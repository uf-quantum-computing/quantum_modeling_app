import matplotlib
import matplotlib.pyplot as plt
from matplotlib.colors import hsv_to_rgb
import scipy as sp
from scipy.sparse import linalg as ln
from scipy import sparse as sparse
import matplotlib.animation as animation
import numpy as np
import sys
import io
import base64
import time
from IPython.display import HTML
import PIL

class Wave_Packet:
    def __init__(self, n_points, dt, sigma0=5.0, k0=1.0, x0=-150.0, x_begin=-200.0,
                 x_end=200.0, barrier_height=1.5, barrier_width=3.0):
        self.x_begin = x_begin
        self.x_end = x_end 
        self.n_points = n_points
        self.sigma0 = sigma0
        self.k0 = k0
        self.x0 = x0
        self.dt = dt
        self.prob = np.zeros(n_points)
        self.barrier_width = barrier_width
        self.barrier_height = barrier_height
        self.total_steps = 300

        """ 1) Space discretization """
        self.x, self.dx = np.linspace(x_begin, x_end, n_points, retstep=True)

        """ 2) Initialization of the wave function to Gaussian wave packet """
        self.psi = np.exp(-(self.x - x0) ** 2 / (4.0 * sigma0 ** 2)).astype(np.complex128)
        self.psi *= np.exp(1.0j * k0 * self.x)
        self.psi *= (2.0 * np.pi * sigma0 ** 2) ** (-0.25)

        """ 3) Setting up the potential barrier """
        self.potential = np.array(
            [barrier_height if 0.0 < x < barrier_width else 0.0 for x in self.x])

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
                 x_end=200.0, y_begin=-100.0, y_end=100.0, barrier_width=1.0, barrier_height=1.5):
        self.x_begin = x_begin
        self.x_end = x_end 
        self.y_begin = y_begin
        self.y_end = y_end
        self.x_n_points = x_n_points
        self.y_n_points = y_n_points
        self.sigma0 = sigma0
        self.k0 = k0
        self.x0 = x0
        self.y0 = y0
        self.dt = dt
        self.prob = np.zeros([x_n_points, y_n_points])
        self.BarrierThickness = barrier_width
        V_tunnel = barrier_height
        self.total_steps = 300

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
        self.V = np.where((self.x>0) & (self.x <= self.BarrierThickness*dx), V_tunnel, 0.)

        """ 4) Creating the Hamiltonian """
        px = np.fft.fftshift(np.fft.fftfreq(x_n_points, d=dx)) * 2 * np.pi
        py = np.fft.fftshift(np.fft.fftfreq(y_n_points, d=dy)) * 2 * np.pi
        px, py = np.meshgrid(px, py)

        self.p2 = (px ** 2 + py ** 2)

        Ur = np.exp(-0.5j * self.dt * np.array(self.V))
        Uk = np.exp(-0.5j * self.dt * self.p2)

        """ 5) Computing the Crank-Nicolson time evolution matrix """
        self.psi = np.zeros((self.total_steps + 1, *[y_n_points, x_n_points]), dtype = np.complex128)
        self.psi[0] = psi_0
        for i in range(self.total_steps):
            tmp = np.copy(self.psi[i])
            self.psi[i+1] = Ur*np.fft.ifftn(np.fft.ifftshift(Uk*np.fft.fftshift(np.fft.fftn(Ur*tmp))))

class Animator2D:
    def __init__(self, wave_packet):
        self.time = 0.0
        self.wave_packet = wave_packet
        self.fig, self.ax = plt.subplots()
        plt.plot(self.wave_packet.x, self.wave_packet.potential * 0.1, color='r')
        # plt.title("2D Tunneling Model")

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
        for i in range(self.wave_packet.total_steps):
            self.time += self.wave_packet.dt
            self.time_text.set_text(
                'Elapsed time: {:6.2f} fs'.format(self.time * 2.419e-2))

            yield self.wave_packet.evolve()

    def animate2D(self):
        self.ani = animation.FuncAnimation(
            self.fig, self.update, repeat=True, frames=self.time_step, interval=100, blit=True, save_count=self.wave_packet.total_steps)
        # save the animation as a GIF file and encode to base64
        start_time = time.time()
        self.ani.save('/Users/vyvooz/Documents/Coding Projects/quantum_modeling_app/src/model_gifs/tunneling_2D.gif', writer='pillow')
        end_time = time.time()
        total_time = end_time - start_time
        print("2D animation saving time: ", total_time, " seconds")
        with open('/Users/vyvooz/Documents/Coding Projects/quantum_modeling_app/src/model_gifs/tunneling_2D.gif', 'rb') as file:
            base64Gif2D = base64.b64encode(file.read()).decode('utf-8')
            return base64Gif2D

class Animator3D:
    def __init__(self, wave_packet):
        self.time = 0.0
        self.wave_packet = wave_packet
        self.wave_packet.psi_plot = self.wave_packet.psi/np.amax(np.abs(self.wave_packet.psi))

        self.fig, self.ax = plt.subplots()

        self.V_img = self.ax.imshow(self.wave_packet.V/np.max(self.wave_packet.V), vmax=1.0, vmin=0, cmap="gray", origin="lower")
        self.img = self.ax.imshow(complex_to_rgba(self.wave_packet.psi_plot[0], max_val=1.0), origin="lower", interpolation="bilinear")
        # https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.colorbar.html

        self.colorbar = self.fig.colorbar(self.img, ax=self.ax, orientation='vertical', fraction=.1, pad=0.05)
        x_ticks = np.linspace(self.wave_packet.x_begin, self.wave_packet.x_end, num=9)  # Change num as needed
        y_ticks = np.linspace(self.wave_packet.y_begin, self.wave_packet.y_end, num=5)  # Change num as needed
        self.ax.set_xticks(np.linspace(0, self.wave_packet.x_n_points, len(x_ticks)))
        self.ax.set_yticks(np.linspace(0, self.wave_packet.y_n_points, len(y_ticks)))
        self.ax.set_xticklabels(x_ticks)
        self.ax.set_yticklabels(y_ticks)

        self.ax.set_xlabel('X Position (nm)')
        self.ax.set_ylabel('Y Position (nm)')
        self.ax.text(0.5, 1.05, 'Probability Density',
                     transform=self.ax.transAxes, ha='center')

        self.animation_data = {'t': 0, 'ax': self.ax ,'frame': 0}
        # plt.title("3D Tunneling Model")

    def update3D(self, data):
        self.animation_data['t'] += 1
        if self.animation_data['t'] > self.wave_packet.total_steps:
            self.animation_data['t'] = 0
        self.img.set_data(complex_to_rgba(self.wave_packet.psi_plot[self.animation_data['t']], max_val=0.3))
        return self.V_img, self. img

    def animate3D(self):
        self.ani = animation.FuncAnimation(
            self.fig, self.update3D, frames=self.wave_packet.total_steps, interval=5, blit=False, cache_frame_data=False)
        # Save the animation as a GIF file 
        start_time = time.time()
        self.ani.save('../src/model_gifs/tunneling_3D.gif', writer='pillow')
        end_time = time.time()
        total_time = end_time - start_time
        print("3D animation saving time: ", total_time, " seconds")
        with open('../src/model_gifs/tunneling_3D.gif', 'rb') as file:
            base64Gif3D = base64.b64encode(file.read()).decode('utf-8')
            return base64Gif3D


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

def main():
    # Create instances of Wave_Packet and Wave_Packet3D
    wave_packet = Wave_Packet(n_points=500, dt=0.5, barrier_width=2, barrier_height=3, k0=1)
    wave_packet3D = Wave_Packet3D(x_n_points=500, y_n_points=400, dt=0.5, barrier_width=2, barrier_height=3, k0=1)

    # Create Animator instances and animate
    animator = Animator2D(wave_packet)
    animator.animate2D()
    plt.show()
    animator3D = Animator3D(wave_packet3D)
    animator3D.animate3D()
    plt.show()
    plt.close()

    print("Done")
    sys.exit()

if __name__ == "__main__":
    main()