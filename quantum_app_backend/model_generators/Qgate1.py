from __future__ import division
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.cm as cm
from matplotlib.figure import Figure
from odeintw import odeintw
from scipy.linalg import expm
import portalocker

from .bloch import Bloch
# from matplotlib import animation
from matplotlib import animation, rc
import warnings

# About Qgate1 class:
#  a class for the 1 qubit gate simulation
h = 6.626e-34
mu = 9.27e-24
q = 1.6e-19


def state_to_bloch(rho):
    sx = np.asarray([[0, 1], [1, 0]], dtype=complex)  # Pauli matrices
    sy = np.asarray([[0, -1j], [1j, 0]], dtype=complex)
    sz = np.asarray([[1, 0], [0, -1]], dtype=complex)  # Pauli matrices
    u = np.trace(sx.dot(rho)).real
    v = np.trace(sy.dot(rho)).real
    w = np.trace(sz.dot(rho)).real
    return u, v, w


class Qgate1(object):
    def __init__(self):
        self.gate = 1  # gate type
        self.fz = 28  # zeelman spliting frequency, JG removed, from input
        self.gam = 10  # decohence frequency, JG removed, from input

        self.flag_master = 1

        self.gtype = 1
        self.Ns = 1
        self.Nt = 401
        self.Pr = np.zeros((2 * self.Ns, self.Nt))  # output probabiity vs. time
        ### depahsing matrix, non-zero terms
        Nh = 2 * self.Ns  # size of the basis set
        L = [[np.zeros((Nh, Nh)) for i in range(Nh)] for j in range(Nh)]  # set up dephasing parameters
        L[1][1][1, 1] = 1  # diagonal dephasing
        L[0][0][0, 0] = 1
        self.L = L

        self.params_default = {
            'gate': 1,
            'init_state': 2,
            'mag_f_B': 10,
            't2': 0.1,
        }
        self.params_range_default = {
            'gate': ['       X gate (x)    ', '       Y gate (y)    ', '       Z gate (z)    ',
                     '       Hadamard gate    ', '       S gate      ', '       T gate      '],
            'init_state': ['            |+>        ', '            |i+>        ', '            |0>        ',
                           '            |->        ', '            |i->        ', '            |1>        '],
            'mag_f_B': {'min': 0, 'max': 50},
            't2': {'min': 0.0, 'max': 100.0},
        }
        self.params_name_map = {'gate': 'Gate type (B field direction)', }

    def run(self, gate, init_state, mag_f_B, t2):  # main simulation program
        fz = 2 * mu * mag_f_B / h * 1e-4 * 1e-6  # in MHz
        gam = 1 / t2
        [magnetic_x, magnetic_y, magnetic_z, magnetic_h, magnetic_s, magnetic_t] = np.eye(6)[gate - 1]
        if init_state == 1:
            state = np.array([1, 1]) * np.sqrt(2) / 2
        elif init_state == 2:
            state = np.array([1, 1j]) * np.sqrt(2) / 2
        elif init_state == 3:
            state = np.array([1, 0])
        elif init_state == 4:
            state = np.array([1, -1]) * np.sqrt(2) / 2
        elif init_state == 5:
            state = np.array([1, -1j]) * np.sqrt(2) / 2
        elif init_state == 6:
            state = np.array([0, 1])
        else:
            print('Wrong State')
        self.fz = fz
        self.gam = gam
        #        ro0=np.zeros((2*self.Ns, 2*self.Ns))
        #        ro0[0,0]=1
        self.setH(magnetic_x, magnetic_y, magnetic_z, magnetic_h, magnetic_s, magnetic_t)  # set Hamiltonian matrix

        self.gam_n = self.gam / (2 * np.pi * self.fz)  # unitless, normalized dephasing rate to t*pi*fz

        ro0 = np.outer(state, np.conj(state))
        self.ro0 = ro0
        self.Qgate_operation(ro0)  # gate operation
        self.slvro(self.tv, self.Heff, ro0)  # obtain time-dependent evolution

    def setH(self, x, y, z, h, s, t):

        #  B^ dot Pauli matrix vector, for computing effective Hamiltonian
        S_x = np.array([[0, 1], [1, 0]])  # B along x
        S_y = np.array([[0, -1j], [1j, 0]])  # B along y
        S_z = np.array([[1, 0], [0, -1]])  # B along z
        # Hadamard, B field along XZ, pi rotation
        S_h = (S_x + S_z) / np.sqrt(2)
        # S_gate, B field along Z, pi/2 rotation
        S_s = S_z
        # T shift, B field along Z, pi/4 rotation
        S_t = S_z
        # B.dot(S)
        BdS = x * S_x + y * S_y + z * S_z + h * S_h + s * S_s + t * S_t

        w0 = 1  # self.fz    # normalized, to 2*pi*fz
        self.w0 = w0
        ### effective Hamiltonian due to magnetic field
        self.Heff = w0 * 1 / 2 * BdS

        ## set time series array

        tmax = 4 * np.pi  # normalized to (1/2*pi*Zeeman splitting f)
        self.tv = np.linspace(0, tmax, self.Nt)  # unitless, normalized to (1/Zeeman splitting f)
        Ntshort = 101  # this short series is for pi rotation gate

        if x == 1 or y == 1 or z == 1:  # X, Y, Z gates are pi rotation
            Rphase = 1  # rotation phase in pi
        elif h == 1:  # Hardmard is pi rotation
            Rphase = 1
        elif s == 1:  # S gate is pi/2 rotation
            Rphase = 0.5
        elif t == 1:  # T gate is pi/4 rotation
            Rphase = 0.25
        self.tvshort = np.linspace(0, np.pi * Rphase, Ntshort)

        ### ideal transform matrix
        sita = np.pi * Rphase  # rotation angle
        self.U0 = np.cos(sita / 2) * np.eye(2) - 1j * np.sin(sita / 2) * BdS
        self.S = BdS

    def Qgate_operation(self, ro0):  # quantum gate operation, to output sefl.rof
        rof = self.slvro(self.tvshort, self.Heff, ro0)  # solve Master equation
        self.rof = rof  # save to class property
        self.rop_qg = self.rop_ss

    def slvro(self, tv, Heff, ro0):
        ro0 = ro0.astype('complex128')
        rop_ss = []
        rop_ss.append(ro0)
        rop = ro0
        Pr0 = self.Pr
        Pr0[:, 0] = np.real(np.diag(ro0))
        self.dt = tv[1] - tv[0]
        self.Heff = Heff
        if self.flag_master == 1:
            def asys(a, t, c):
                return self.Integ(a)

            sol = odeintw(asys, ro0, tv, args=(1,))
            # sol = odeintw(asys, ro0, t_tmp, args=(1,))
            for ii_t in range(len(tv) - 1):
                Pr0[:, ii_t + 1] = np.real(np.diag(sol[ii_t, :, :]))
            rop = sol[-1]
            rop_ss = sol
        elif self.flag_master == 0:  # ideal without decoherence
            self.Ut = np.expm(-1j * tv.max().dot(Heff))  # the ideal propagator, also used as an output of this function
            rop = self.Ut.dot(ro0).dot(self.Ut.T)  # density matrix in Dirac picture, propagate
            Pr0 = []
            rop_ss.append(rop)
        rof = rop  # final density matrix

        self.rop_ss = rop_ss  # evolution of the density matrix
        self.Pr = Pr0
        return rof  # return

    def Integ(self, rop):
        Heff = self.Heff
        y = -1j * (Heff.dot(rop) - rop.dot(Heff))  # evolution by Heff
        L = self.L
        N = 2 * self.Ns
        M = N
        for ii_n in range(N):  # iterate over dephasing matrix entries
            for ii_m in range(M):
                L1 = L[ii_n][ii_m]  # dephasing operator
                y = y + self.gam_n * (L1.dot(rop).dot(L1.T) - 1 / 2 * (L1.T.dot(L1).dot(rop) + rop.dot(L1.T).dot(L1)))
        return y

    def rkmethod(self, mm):
        dt = self.dt
        k1 = self.Integ(mm)

        mm_temp = mm + 1 / 2 * dt * k1
        k2 = self.Integ(mm_temp)

        mm_temp = mm + 1 / 2 * dt * k2
        k3 = self.Integ(mm_temp)

        mm_temp = mm + dt * k3
        k4 = self.Integ(mm_temp)

        mm_o = mm + 1 / 6 * (k1 + 2 * k2 + 2 * k3 + k4) * dt

        return mm_o

    def plot_evo(self):
        rho = self.rop_qg

        frames = 25
        idx = np.linspace(0, len(rho) - 1, frames)

        def plot_animation_function(frames=11, figsize=(6, 4),
                                    xlim=(0, 2), ylim=(0, 2), interval=100, blit=True):
            fig = plt.figure(figsize=(6, 6), dpi=100)
            ax = fig.add_subplot(111, projection='3d')
            sphere = Bloch(fig=fig, axes=ax)
            sx, sy, sz = [], [], []
            s = rho[0]
            u, v, w = state_to_bloch(s)
            sx.append(u)
            sy.append(v)
            sz.append(w)
            sphere.add_vectors([u, v, w])

            def init():
                sphere.vector_color = ['r']
                return animate(0)

            def animate(i):
                sphere.clear()
                # x = next(x_generator)
                s = rho[int(idx[i])]
                u, v, w = state_to_bloch(s)
                sx.append(u)
                sy.append(v)
                sz.append(w)
                sphere.add_vectors([u, v, w])
                sphere.add_points([sx[:-1], sy[:-1], sz[:-1]])
                sphere.make_sphere()
                return ax

            anim = animation.FuncAnimation(fig, animate, frames,
                                           init_func=init, blit=False)
            plt.show()
            # anim.save('bloch_sphere.gif', writer='imagemagick')
            return anim

        anim = plot_animation_function(frames=frames, figsize=(6, 6),
                                       xlim=(0, 2), ylim=(-2, 2))
        # rc('animation', html='jshtml')
        # rc
        # anim.save('./animationsName.mp4', writer="ffmpeg", fps=60)
        anim_html = anim.to_jshtml(fps=60)
        # with open(f'cache/qgate1/trace_{self.gate}_2_10_0.1_3D.html', "w") as f:
        #     portalocker.lock(f, portalocker.LOCK_EX)
        #     f.write(anim_html)
        return anim_html


if __name__ == "__main__":  # main function, added by JG for debugging
    qg = Qgate1()
    qg.run(**qg.params_default)
    qg.plot_evo()
