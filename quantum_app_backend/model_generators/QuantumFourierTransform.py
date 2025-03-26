from __future__ import division
import numpy as np
import matplotlib.pyplot as plt
from matplotlib import animation
from scipy.linalg import logm
from odeintw import odeintw
from matplotlib.animation import HTMLWriter


# Local Bloch class that supports multi-sphere plotting (n=3).
from bloch import Bloch


##############################################################################
# Utilities for building gates
##############################################################################
def single_qubit_gate(gate, target, n):
    """
    Embed a single-qubit operator 'gate' into an n-qubit space,
    acting on qubit index 'target'.
    """
    op = 1
    for qubit in range(n):
        if qubit == target:
            op = np.kron(op, gate)
        else:
            op = np.kron(op, np.eye(2))
    return op


def controlled_rotation(control, target, n, phi):
    """
    Construct a controlled phase rotation: if control is |1>, apply e^{i phi} on the |1> of target.
    The operator is (|0><0| on control x I_target) + (|1><1| on control x R_phi on target).
    Embed in n-qubit space.
    """
    # Projection operators
    P0 = np.array([[1, 0], [0, 0]], dtype=complex)
    P1 = np.array([[0, 0], [0, 1]], dtype=complex)
    I = np.eye(2, dtype=complex)
    R = np.array([[1, 0], [0, np.exp(1j * phi)]], dtype=complex)

    op_term0 = 1
    op_term1 = 1
    for qubit in range(n):
        if qubit == control:
            op_term0 = np.kron(op_term0, P0)
            op_term1 = np.kron(op_term1, P1)
        elif qubit == target:
            op_term0 = np.kron(op_term0, I)
            op_term1 = np.kron(op_term1, R)
        else:
            op_term0 = np.kron(op_term0, I)
            op_term1 = np.kron(op_term1, I)
    return op_term0 + op_term1


##############################################################################
# Single-qubit Bloch utilities
##############################################################################
sx = np.array([[0, 1], [1, 0]], dtype=complex)
sy = np.array([[0, -1j], [1j, 0]], dtype=complex)
sz = np.array([[1, 0], [0, -1]], dtype=complex)


def single_qubit_bloch_vector(rho_1q):
    """
    Given a 2x2 density matrix, return the (x, y, z) Bloch coordinates.
    """
    bx = np.trace(sx @ rho_1q).real
    by = np.trace(sy @ rho_1q).real
    bz = np.trace(sz @ rho_1q).real
    return [bx, by, bz]


##############################################################################
# Partial trace: from 3-qubit to 1-qubit
##############################################################################
def partial_trace_1qubit(rho_3q, qubit_idx):
    """
    Return the 2x2 reduced density matrix for 'qubit_idx' in {0,1,2}.
    By tracing out the other two qubits from the 8x8 density matrix rho_3q.
    """
    # Reshape: 8x8 => (2,2,2, 2,2,2)
    rho_reshaped = np.reshape(rho_3q, (2, 2, 2, 2, 2, 2))
    if qubit_idx == 0:
        # keep indices (a, a'), sum over (b,c,b',c')
        return np.einsum('abcdef->ad', rho_reshaped)
    elif qubit_idx == 1:
        # keep (b, b'), sum over (a,c,a',c')
        return np.einsum('abcdef->be', rho_reshaped)
    else:
        # keep (c, c'), sum over (a,b,a',b')
        return np.einsum('abcdef->cf', rho_reshaped)


def normalize_rho(rho):
    """
    Ensure trace(rho) = 1 (up to numerical tolerance).
    """
    tr = np.trace(rho)
    if abs(tr) > 1e-14:
        return rho / tr
    return rho


##############################################################################
# ODE for time evolution: d/dt rho = - i [H, rho]
##############################################################################
def drho_dt(rho_flat, t, H):
    """
    'rho_flat' is the flattened 8x8 density matrix,
    'H' is the 8x8 Hamiltonian,
    we return the flattened derivative d(rho)/dt.
    """
    rho = np.reshape(rho_flat, (8, 8))
    comm = H @ rho - rho @ H
    drho = -1j * comm
    return drho.ravel()


def controlled_rotation_hamiltonian(control, target, n, phi):
    """Generate Hamiltonian for controlled-rotation directly."""
    P1 = np.array([[0, 0], [0, 1]], dtype=complex)
    I = np.eye(2, dtype=complex)
    Z = np.array([[1, 0], [0, -1]], dtype=complex)

    # Projector for |1⟩ on control qubit
    proj_term = 1
    for i in range(n):
        if i == control:
            proj_term = np.kron(proj_term, P1)
        else:
            proj_term = np.kron(proj_term, I)

    # Z term for target qubit (generates rotation)
    z_term = 1
    for i in range(n):
        if i == target:
            z_term = np.kron(z_term, Z)
        else:
            z_term = np.kron(z_term, I)

    # Hamiltonian is phi/2 * P1_control ⊗ Z_target
    return (phi) * proj_term @ z_term


def hadamard_hamiltonian(qubit_idx, n):
    """Generate Hamiltonian for Hadamard directly."""
    X = np.array([[0, 1], [1, 0]], dtype=complex)
    Z = np.array([[1, 0], [0, -1]], dtype=complex)
    I = np.eye(2, dtype=complex)

    x_term = 1
    z_term = 1
    for i in range(n):
        if i == qubit_idx:
            x_term = np.kron(x_term, X)
            z_term = np.kron(z_term, Z)
        else:
            x_term = np.kron(x_term, I)
            z_term = np.kron(z_term, I)

    # Hamiltonian is (π/2√2) * (X + Z)
    return (np.pi / 2) * (x_term + z_term) / np.sqrt(2)

##############################################################################
# Step-by-step QFT with ODE integration, partial-skip version
##############################################################################
class QFTStepByStepODE:
    def __init__(self, initial_state_str='100'):
        self.n = 3
        self.N = 2 ** self.n

        try:
            idx = int(initial_state_str, 2)  # Convert from binary string to integer
            if idx >= self.N:
                raise ValueError(f"Invalid state: {initial_state_str}. Must be a {self.n}-bit binary string.")
        except ValueError:
            raise ValueError(f"Invalid state: {initial_state_str}. Must be a {self.n}-bit binary string.")

        self.rho_init = np.zeros((self.N, self.N), dtype=complex)
        self.rho_init[idx, idx] = 1.0

        # Gate sequence for 3-qubit QFT (6 gates total)
        H_1q = (1 / np.sqrt(2)) * np.array([[1, 1], [1, -1]], dtype=complex)
        self.gate_sequence = [
            ("Hadamard on Q0", single_qubit_gate(H_1q, 0, self.n)),
            ("CR(π/2) Q0->Q1", controlled_rotation(0, 1, self.n, np.pi / 2)),
            ("CR(π/4) Q0->Q2", controlled_rotation(0, 2, self.n, np.pi / 4)),
            ("Hadamard on Q1", single_qubit_gate(H_1q, 1, self.n)),
            ("CR(π/2) Q1->Q2", controlled_rotation(1, 2, self.n, np.pi / 2)),
            ("Hadamard on Q2", single_qubit_gate(H_1q, 2, self.n)),
        ]
        # Steps per gate for the ODE
        self.steps_per_gate = 20

        # We'll record the entire time evolution for the *current* gate:
        self.rho_t_list = []  # each element is a (8,8) density matrix
        self.gate_label_list = []

    def run(self, n_step):
        """
        Run up to the nth gate (1-based):
          - For the first (n-1) gates, apply each gate U instantly by matrix multiplication
            (no ODE, no intermediate states).
          - For the nth gate, do a time evolution from t=0..1 using odeintw
            to interpolate from identity to U_n.

        'n_step' must be <= the total number of gates (6 for 3-qubit QFT).

        We'll store the states only for the nth gate's time evolution
        in self.rho_t_list so we can animate that step by step.
        """
        self.n_step = n_step
        # clear any previous results
        self.rho_t_list.clear()
        self.gate_label_list.clear()

        if n_step < 1 or n_step > len(self.gate_sequence):
            raise ValueError(f"n_step must be between 1 and {len(self.gate_sequence)} inclusive.")

        # Start from the initial state
        current_rho = np.copy(self.rho_init)

        # 1) Apply the first (n-1) gates by direct matrix multiplication
        for idx in range(n_step - 1):
            gate_label, U_gate = self.gate_sequence[idx]
            # Instantly apply:  rho <- U_gate * rho * U_gate^\dagger
            current_rho = U_gate @ current_rho @ U_gate.conjugate().T

        # 2) The nth gate is integrated with ODE
        gate_label, U_gate = self.gate_sequence[n_step - 1]

        if "Hadamard" in gate_label:
            # Extract target qubit index
            qubit_idx = int(gate_label.split("Q")[1])
            H_gate = hadamard_hamiltonian(qubit_idx, self.n)
        elif "CR(" in gate_label:
            # Extract control and target qubits
            parts = gate_label.split(" ")
            phi_str = parts[0][3:-1]  # Extract "π/2" from "CR(π/2)"
            if "π/2" in phi_str:
                phi = np.pi / 2
            elif "π/4" in phi_str:
                phi = np.pi / 4
            else:
                phi = float(phi_str)

            cq_tq = parts[1].split("->")
            control_qubit = int(cq_tq[0][1:])  # Extract number from "Q0"
            target_qubit = int(cq_tq[1][1:])  # Extract number from "Q1"

            H_gate = controlled_rotation_hamiltonian(control_qubit, target_qubit, self.n, phi)
        else:
            # Fallback to original method
            logU = logm(U_gate)
            H_gate = 0.5 * (logU - logU.conjugate().T) * (-1j)

        # ODE from t=0..1
        tspan = np.linspace(0, 1, self.steps_per_gate)
        rho0_flat = current_rho.ravel()
        sol = odeintw(drho_dt, rho0_flat, tspan, args=(H_gate,))

        # 3) Store each time step in self.rho_t_list and label them
        for i, t in enumerate(tspan):
            rho_t = np.reshape(sol[i], (self.N, self.N))
            rho_t = normalize_rho(rho_t)
            self.rho_t_list.append(rho_t)
            self.gate_label_list.append(f"{gate_label}  (t={t:.2f})")

        # The final state after nth gate is sol[-1], but we don't apply further steps here

    def animate_bloch(self):
        """
        Create a single animation that shows:
          - Three Bloch spheres (one per qubit) on the left.
          - A bar chart of probabilities for the 8 basis states on the right.

        We update both in each frame according to the time-evolved density
        matrices in self.rho_t_list.
        """
        if len(self.rho_t_list) == 0:
            print("No states to animate. Call run(n_step=...) first.")
            return

        # --------------------------------------------------------------------
        # 1) Precompute the Bloch vectors for each qubit at each time step
        #    and also the probability distribution over the 8 basis states.
        # --------------------------------------------------------------------
        all_bloch_vectors = []
        all_probabilities = []
        for rho in self.rho_t_list:
            # Bloch vectors
            triple_vec = []
            for qubit_idx in [0, 1, 2]:
                r1q = partial_trace_1qubit(rho, qubit_idx)
                r1q = normalize_rho(r1q)
                vec = single_qubit_bloch_vector(r1q)
                triple_vec.append(vec)
            all_bloch_vectors.append(triple_vec)

            # Probability distribution (diagonal of rho)
            diag = np.real(np.diag(rho))  # shape (8,)
            all_probabilities.append(diag)

        all_bloch_vectors = np.array(all_bloch_vectors)  # shape (numFrames, 3, 3)
        all_probabilities = np.array(all_probabilities)  # shape (numFrames, 8)

        # --------------------------------------------------------------------
        # 2) Create a figure with 4 subplots in one row:
        #    - 3 for the Bloch spheres,
        #    - 1 for the probability bar chart.
        # --------------------------------------------------------------------
        fig = plt.figure(figsize=(10, 4), dpi=100)

        # Subplots for Bloch spheres (3D). We'll create them ourselves,
        # then pass them to the Bloch object as "axes=[...]".
        ax0 = fig.add_subplot(1, 3, 1, projection='3d')
        ax1 = fig.add_subplot(1, 3, 2, projection='3d')
        ax2 = fig.add_subplot(1, 3, 3, projection='3d')

        # Subplot for the probability bar chart (2D).
        # ax_prob = fig.add_subplot(1, 4, 4)

        # Initialize three separate Bloch objects
        b0 = Bloch(fig=fig, axes=ax0)
        b1 = Bloch(fig=fig, axes=ax1)
        b2 = Bloch(fig=fig, axes=ax2)
        bloch_spheres = [b0, b1, b2]

        # A text label (centered above figure) to show the gate label/time.
        gate_text = fig.text(0.5, 0.94, "", ha="center", va="center", fontsize=12)

        # --------------------------------------------------------------------
        # 3) Set up the probability bar chart
        # --------------------------------------------------------------------
        xvals = np.arange(8)
        # bars = ax_prob.bar(xvals, all_probabilities[0], align='center')
        # ax_prob.set_ylim(0, 1)
        # ax_prob.set_xlim(-0.5, 7.5)
        # ax_prob.set_xlabel("Basis state (decimal index)")
        # ax_prob.set_ylabel("Probability")
        # ax_prob.set_xticks(xvals)

        # Optionally label them in binary:
        # e.g. '000','001',..., '111'
        # bin_labels = [f"{i:03b}" for i in range(8)]
        # ax_prob.set_xticklabels(bin_labels)

        # --------------------------------------------------------------------
        # 4) Animation functions
        # --------------------------------------------------------------------
        def init():
            # Bloch spheres: show the first frame
            for qubit_i, b in enumerate(bloch_spheres):
                b.clear()
                v = all_bloch_vectors[0, qubit_i]
                b.add_vectors(v)
                b.make_sphere()

            # Probability bars: set their heights for the first frame
            # p0 = all_probabilities[0]
            # for bar, height in zip(bars, p0):
            #     bar.set_height(height)

            gate_text.set_text(self.gate_label_list[0])
            return []

        def animate(frame_idx):
            # 4a) Update Bloch spheres
            for qubit_i, b in enumerate(bloch_spheres):
                b.clear()
                v = all_bloch_vectors[frame_idx, qubit_i]
                b.add_vectors(v)
                b.make_sphere()

            # 4b) Update probability bars
            # probs = all_probabilities[frame_idx]
            # for bar, height in zip(bars, probs):
            #     bar.set_height(height)

            # 4c) Update the annotation text
            gate_text.set_text(self.gate_label_list[frame_idx])
            return []

        # --------------------------------------------------------------------
        # 5) Create the animation
        # --------------------------------------------------------------------
        anim = animation.FuncAnimation(
            fig,
            animate,
            frames=len(self.rho_t_list),
            init_func=init,
            interval=250,
            blit=False
        )

        # plt.show()
        # or, to save:

        anim_js = anim.to_jshtml(fps=30)
        with open(f"qft_with_bloch_and_probs_{self.n_step}.html", "w") as f:
            f.write(anim_js)

        # html_writer = HTMLWriter()
        # anim.save(f"qft_with_bloch_and_probs_{self.n_step}.html", writer=html_writer)

        # print(f"Animation saved as qft_with_bloch_and_probs_{self.n_step}.html")        
        #
        return anim


##############################################################################
# Example usage
##############################################################################
if __name__ == "__main__":
    qft_ode = QFTStepByStepODE(initial_state_str='011')

    # Suppose we only want to do GATE #2 in a time-evolved way
    # and skip gate #1 instantly:
    qft_ode.run(n_step=6)
    qft_ode.animate_bloch()

    # Alternatively, run the 6th gate with time evolution (skip gates #1..5)
    # qft_ode.run(n_step=6)
    # qft_ode.animate_bloch()
