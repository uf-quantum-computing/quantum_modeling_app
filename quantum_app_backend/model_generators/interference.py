import matplotlib
import matplotlib.pyplot as plt
from matplotlib.colors import hsv_to_rgb
import scipy as sp
from scipy.sparse import linalg as ln
from scipy import sparse as sparse
import matplotlib.animation as animation
import numpy as np

# User-defined parameters
momentum = 1.0 
spacing = 1.0
split_separation = 5.0
v_tunnel = 150 #DON'T MESS WITH THIS UNLESS YOU WANT TUNNELING

# Values for initial guassian
x0 = -5
y0 = 0
p0_x = momentum
p0_y = 0.0
σ = 2.0

# Resolution for computation
xres = 100
yres = 80

# XY field for 3D
xmin = -30
xmax = 50
ymin = -20
ymax = 20

# set elapsed time in python to see more of the mechanics -- 30-45 seconds

def potential_slit(x, y):
    if 20 < x < 25 and abs(y) > split_separation and abs(y) < spacing + split_separation:
        return 0
    elif 20 < x < 25:
        return v_tunnel
    elif x > 48:
        return v_tunnel
    else:
        return 0

def potential_slit2D_at0(x):
    if 20 < x < 25:
        return v_tunnel
    else:
        return 0
    
class Wave_Packet:
    def __init__(self, n_points, dt, sigma0=5.0, k0=1.0, x0=-150.0, x_begin=-200.0,
                 x_end=200.0, barrier_height=1.0, barrier_width=3.0):
        self.n_points = n_points
        self.sigma0 = sigma0
        self.k0 = k0
        self.x0 = x0
        self.dt = dt
        self.prob = np.zeros(n_points)
        self.barrier_width = barrier_width
        self.barrier_height = barrier_height

        """ 1) Space discretization """
        self.x, self.dx = np.linspace(x_begin, x_end, n_points, retstep=True)

        """ 2) Initialization of the wave function to Gaussian wave packet """
        self.psi = np.exp(-(self.x - x0) ** 2 / (4.0 * sigma0 ** 2)).astype(np.complex128)
        self.psi *= np.exp(1.0j * k0 * self.x)
        self.psi *= (2.0 * np.pi * sigma0 ** 2) ** (-0.25)

        """ 3) Setting up the potential barrier """
        self.potential = np.array(
            [barrier_height if 0.0 < x < barrier_width else 0.0 for x in self.x])
        # modify for the slit?

        """ 4) Creating the Hamiltonian """
        h_diag = np.ones(n_points) / self.dx ** 2 + self.potential
        h_non_diag = np.ones(n_points - 1) * (-0.5 / self.dx ** 2)
        hamiltonian = sparse.diags([h_diag, h_non_diag, h_non_diag], [0, 1, -1])

        """ 5) Computing the Crank-Nicolson time evolution matrix """
        implicit = (sparse.eye(self.n_points) - dt / 2.0j * hamiltonian).tocsc()
        explicit = (sparse.eye(self.n_points) + dt / 2.0j * hamiltonian).tocsc()
        self.evolution_matrix = ln.inv(implicit).dot(explicit).tocsr()

    def evolve(self):
        self.psi = self.evolution_matrix.dot(self.psi)
        self.prob = abs(self.psi) ** 2

        norm = sum(self.prob)
        self.prob /= norm
        self.psi /= norm ** 0.5

        return self.prob


class Wave_Packet3D:
    def __init__(self, x_n_points, y_n_points, dt, sigma0=5.0, k0=-1.0, x0=-150.0, y0=0, x_begin=-200.0,
                 x_end=200.0, y_begin=-100.0, y_end=100.0, BarrierThickness=1.0, barrier_height=1.0):
        self.x_n_points = x_n_points
        self.y_n_points = y_n_points
        self.sigma0 = sigma0
        self.k0 = k0
        self.x0 = x0
        self.y0 = y0
        self.dt = dt
        self.prob = np.zeros([x_n_points, y_n_points])
        self.BarrierThickness = BarrierThickness
        V_tunnel = barrier_height
        self.total_steps = 1600

        """ 1) Space discretization """
        x, dx = np.linspace(x_begin, x_end, x_n_points, retstep=True)
        y, dy = np.linspace(y_begin, y_end, y_n_points, retstep=True)
        self.x, self.y = np.meshgrid(x, y)

        """ 2) Initialization of the wave function to Gaussian wave packet """
        psi_x = np.exp(-(self.x - x0) ** 2 / (4.0 * sigma0 ** 2)).astype(np.complex128)
        psi_y = np.exp(-(self.y - y0) ** 2 / (4.0 * sigma0 ** 2)).astype(np.complex128)
        psi_x *= np.exp(1.0j * k0 * self.x)
        psi_x *= (2.0 * np.pi * sigma0 ** 2) ** (-0.25)
        psi_y *= (2.0 * np.pi * sigma0 ** 2) ** (-0.25)
        psi_0 = psi_x * psi_y

        """ 3) Setting up the potential barrier """
        self.V = np.where((self.x>0) & (self.x<=self.BarrierThickness*dx) , V_tunnel, 0.)
        # modify for the slit

        """ 4) Creating the Hamiltonian """
        px = np.fft.fftshift(np.fft.fftfreq(x_n_points, d=dx)) * 2 * np.pi
        py = np.fft.fftshift(np.fft.fftfreq(y_n_points, d=dy)) * 2 * np.pi
        px, py = np.meshgrid(px, py)

        self.p2 = (px ** 2 + py ** 2)

        Ur = np.exp(-0.5j * self.dt * np.array(self.V))
        Uk = np.exp(-0.5j * self.dt * self.p2)

        """ 5) Computing the Crank-Nicolson time evoluittion matrix """
        self.psi = np.zeros((self.total_steps + 1, *[y_n_points, x_n_points]), dtype = np.complex128)
        self.psi[0] = psi_0
        for i in range(self.total_steps):
            tmp = np.copy(self.psi[i])
            self.psi[i+1] = Ur*np.fft.ifftn(np.fft.ifftshift(Uk*np.fft.fftshift(np.fft.fftn(Ur*tmp))))


class Animator3D:
    def __init__(self, wave_packet):
        self.time = 0.0
        self.wave_packet = wave_packet
        self.wave_packet.psi_plot = self.wave_packet.psi/np.amax(np.abs(self.wave_packet.psi))

        self.fig, self.ax = plt.subplots()

        self.V_img = self.ax.imshow(self.wave_packet.V/np.max(self.wave_packet.V), vmax=1.0, vmin=0, cmap="gray", origin="lower")
        self.img = self.ax.imshow(complex_to_rgba(self.wave_packet.psi_plot[0], max_val=1.0), origin="lower", interpolation="bilinear")

        self.animation_data = {'t': 0, 'ax': self.ax ,'frame': 0}

    def update(self, data):
        self.animation_data['t'] += 1
        if self.animation_data['t'] > self.wave_packet.total_steps:
            self.animation_data['t'] = 0
        self.img.set_data(complex_to_rgba(self.wave_packet.psi_plot[self.animation_data['t']], max_val=1.0))
        return self.V_img, self. img

    def animate(self):
        self.ani = animation.FuncAnimation(
            self.fig, self.update, frames=self.wave_packet.total_steps, interval=5, blit=True)


def complex_to_rgba(Z: np.ndarray, max_val: float = 1.0) -> np.ndarray:
    argl = np.angle(Z)
    mag = np.abs(Z)

    h = (argl + np.pi) / (2 * np.pi)
    s = np.ones(h.shape)
    v = np.ones(h.shape)  # alpha
    rgb = hsv_to_rgb(np.moveaxis(np.array([h, s, v]), 0, -1))  # --> tuple

    abs_z = mag / max_val
    abs_z = np.where(abs_z > 1., 1., abs_z)
    return np.concatenate((rgb, abs_z.reshape((*abs_z.shape, 1))), axis=(abs_z.ndim))


class Animator:
    def __init__(self, wave_packet):
        self.time = 0.0
        self.wave_packet = wave_packet
        self.fig, self.ax = plt.subplots()
        plt.plot(self.wave_packet.x, self.wave_packet.potential * 0.1, color='r')

        self.time_text = self.ax.text(0.05, 0.95, '', horizontalalignment='left',
                                      verticalalignment='top', transform=self.ax.transAxes)
        self.line, = self.ax.plot(self.wave_packet.x, self.wave_packet.evolve())
        self.ax.set_ylim(0, 0.2)
        self.ax.set_xlabel('Position (a$_0$)')
        self.ax.set_ylabel('Probability density (a$_0$)')

    def update(self, data):
        self.line.set_ydata(data)
        return self.line,

    def time_step(self):
        while True:
            self.time += self.wave_packet.dt
            self.time_text.set_text(
                'Elapsed time: {:6.2f} fs'.format(self.time * 2.419e-2))

            yield self.wave_packet.evolve()

    def animate(self):
        self.ani = animation.FuncAnimation(
            self.fig, self.update, self.time_step, interval=5, blit=False)


wave_packet = Wave_Packet(n_points=500, dt=0.5, barrier_width=10, barrier_height=0.5)
wave_packet3D = Wave_Packet3D(x_n_points=100, y_n_points=80, dt=0.5, BarrierThickness=5, barrier_height=1, k0=-1)
animator = Animator(wave_packet)
animator.animate()
animator3D = Animator3D(wave_packet3D)
animator3D.animate()
plt.show()
