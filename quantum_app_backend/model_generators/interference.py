import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
from matplotlib.patches import Rectangle
from scipy.sparse import linalg as ln
from scipy.sparse import csc_matrix
from pathlib import Path
import portalocker
import os
import time
import sys
import logging
current = os.path.dirname(os.path.realpath(__file__))
parent = os.path.dirname(current)
sys.path.append(parent)
from db import MongoConnector

logger = logging.getLogger('quantum_app')

def calculate_center_of_mass(x, psi):
    try:
        density = np.abs(psi)**2
        total_density = np.sum(density)
        if total_density == 0:
            raise ValueError("Total density is zero")
        x_cm = np.sum(x * density) / total_density
        return x_cm
    except Exception as e:
        logger.debug(f"Error calculating center of mass: {str(e)}")
        raise


class Wave_Packet3D:
    def __init__(self, sigma0=0.5, k0=6, x0=0.2, barrier_height=200, barrier_width=0.6, slit_space=0.8, slit_sep=1.0):
        try:
            logger.info(f"Starting interference calculation with momentum={k0}")
            self.L = 8
            self.t_Loc = 4.5
            self.dx = 0.1
            self.Nx = self.Ny = int(self.L / self.dx) + 1
            self.k0 = k0
            self.sigma0 = sigma0
            self.x0 = self.L * x0
            self.y0 = self.L / 2
            self.w = barrier_width
            self.s = slit_sep
            self.a = slit_space
            
            # Calculate positions
            self.b_left = int((self.t_Loc - self.w / 2) / self.dx)
            self.b_right = int((self.t_Loc + self.w / 2) / self.dx)
            self.lower_slit_b = int(1 / (2 * self.dx) * (self.L + self.s) + self.a / self.dx)
            self.lower_slit_t = int(1 / (2 * self.dx) * (self.L + self.s))
            self.upper_slit_b = int(1 / (2 * self.dx) * (self.L - self.s))
            self.upper_slit_t = int(1 / (2 * self.dx) * (self.L - self.s) - self.a / self.dx)

            self.potential = self.potential_init(barrier_height)
            self.Ni = (self.Nx - 2) * (self.Ny - 2)

            logger.info("Constructing evolution matrix")
            self.evo_matrix = self.evo_matrix_cons()
            
            self.x = np.linspace(0, self.L, self.Ny - 2)
            self.y = np.linspace(0, self.L, self.Ny - 2)
            self.x, self.y = np.meshgrid(self.x, self.y)

            logger.info("Initializing wave function")
            self.psi0 = self.psi0_init(self.sigma0, self.k0)
            self.probs = []
            self.probs.append(np.sqrt(np.real(self.psi0) ** 2 + np.imag(self.psi0) ** 2))

            logger.info("Beginning time evolution...")
            for i in range(1, self.Nt):
                psi_vect = self.psi0.reshape((self.Ni))
                psi_vect = self.evo_matrix.dot(psi_vect)
                self.psi0 = psi_vect.reshape((self.Nx - 2, self.Ny - 2))
                self.probs.append(np.sqrt(np.real(self.psi0) ** 2 + np.imag(self.psi0) ** 2))
                if i % 100 == 0:  # Periodic progress updates
                    logger.info(f"Time evolution {i/self.Nt*100:.0f}% complete")
            self.probs = np.array(self.probs)

        except Exception as e:
            logger.debug(f"Error in calculation: {str(e)}")
            raise

    def potential_init(self, v0):
        try:
            v = np.zeros((self.Ny, self.Ny), complex)
            v[0:self.upper_slit_t, self.b_left:self.b_right] = v0
            v[self.upper_slit_b:self.lower_slit_t, self.b_left:self.b_right] = v0
            v[self.lower_slit_b:, self.b_left:self.b_right] = v0
            return v
        except Exception as e:
            logger.debug(f"Error initializing potential: {str(e)}")
            raise

    def psi0_init(self, sigma=0.5, k=1):
        try:
            logger.info(f"Initializing wave function with sigma={sigma}, k={k}")
            psi0 = np.exp(-1 / 2 * ((self.x - self.x0) ** 2 + (self.y - self.y0) ** 2) / sigma ** 2) * np.exp(1j * k * (self.x - self.x0))

            x_cm_initial = calculate_center_of_mass(self.x, psi0)
            psi_test = (self.evo_matrix.dot(np.copy(psi0).reshape((self.Ni)))).reshape((self.Nx - 2, self.Ny - 2))
            x_cm_later = calculate_center_of_mass(self.x, psi_test)
            dx_per_step = x_cm_later - x_cm_initial
            
            self.Nt = min(800, int(1.5 * self.L / abs(dx_per_step)))
            if dx_per_step < 0:  # Assuming "forward" is in the positive x direction
                logger.info("Reversing wave direction")
                psi0 = np.exp(-1 / 2 * ((self.x - self.x0) ** 2 + (self.y - self.y0) ** 2) / sigma ** 2) * np.exp(1j * (-k) * (self.x - self.x0))
            
            psi0[0, :] = psi0[-1, :] = psi0[:, 0] = psi0[:, -1] = 0
            return psi0

        except Exception as e:
            logger.debug(f"Error initializing wave function: {str(e)}")
            raise

    def evo_matrix_cons(self):
        try:
            logger.info("Constructing evolution matrix")
            Dt = self.dx ** 2 / 4
            rx, ry = -Dt / (2j * self.dx ** 2), -Dt / (2j * self.dx ** 2)
            A = np.zeros((self.Ni, self.Ni), complex)
            M = np.zeros((self.Ni, self.Ni), complex)
            
            for k in range(self.Ni):
                i = 1 + k // (self.Ny - 2)
                j = 1 + k % (self.Ny - 2)

                A[k, k] = 1 + 2 * rx + 2 * ry + 1j * Dt / 2 * self.potential[i, j]
                M[k, k] = 1 - 2 * rx - 2 * ry - 1j * Dt / 2 * self.potential[i, j]

                if i != 1:
                    A[k, (i - 2) * (self.Ny - 2) + j - 1] = -ry
                    M[k, (i - 2) * (self.Ny - 2) + j - 1] = ry

                if i != self.Nx - 2:
                    A[k, i * (self.Ny - 2) + j - 1] = -ry
                    M[k, i * (self.Ny - 2) + j - 1] = ry

                if j != 1:
                    A[k, k - 1] = -rx
                    M[k, k - 1] = rx

                if j != self.Ny - 2:
                    A[k, k + 1] = -rx
                    M[k, k + 1] = rx

            Asp = csc_matrix(A)
            Msp = csc_matrix(M)
            evolution_matrix = ln.inv(Asp).dot(Msp).tocsr()
            logger.info("Evolution matrix construction completed")
            return evolution_matrix

        except Exception as e:
            logger.debug(f"Error constructing evolution matrix: {str(e)}")
            raise


class Animator3D:
    def __init__(self, wave_packet):
        try:
            self.wave_packet = wave_packet
            self.fig = plt.figure(figsize=(6, 5))
            self.ax = self.fig.add_subplot(111, xlim=(0, self.wave_packet.L), ylim=(0, self.wave_packet.L))

            self.img = self.ax.imshow(
                self.wave_packet.probs[0], 
                extent=[0, self.wave_packet.L, 0, self.wave_packet.L],
                cmap=plt.get_cmap("hot"), 
                vmin=0, 
                vmax=np.max(self.wave_packet.probs), 
                zorder=1
            )
            
            self.setup_plot()
            
        except Exception as e:
            logger.debug(f"Error initializing Animator3D: {str(e)}")
            raise

    def setup_plot(self):
        try:
            self.colorbar = self.fig.colorbar(self.img, ax=self.ax, orientation='vertical', fraction=.1, pad=0.05)
            self.ax.set_xlabel('X Position (nm)')
            self.ax.set_ylabel('Y Position (nm)')
            self.ax.text(0.5, 1.05, 'Probability Density', transform=self.ax.transAxes, ha='center')
            
            # Add slits
            slitcolor = "w"
            slitalpha = 0.8
            self.add_walls(slitcolor, slitalpha)
            self.fig.tight_layout(pad=1)
            
        except Exception as e:
            logger.debug(f"Error setting up plot: {str(e)}")
            raise

    def add_walls(self, color, alpha):
        try:
            wp = self.wave_packet
            walls = [
                Rectangle((wp.b_left * wp.dx, 0),
                         wp.w, wp.upper_slit_t * wp.dx,
                         color=color, zorder=20, alpha=alpha),
                Rectangle((wp.b_left * wp.dx, wp.upper_slit_b * wp.dx),
                         wp.w, (wp.lower_slit_t - wp.upper_slit_b) * wp.dx,
                         color=color, zorder=20, alpha=alpha),
                Rectangle((wp.b_left * wp.dx, wp.lower_slit_b * wp.dx),
                         wp.w, wp.upper_slit_t * wp.dx,
                         color=color, zorder=20, alpha=alpha)
            ]
            
            for wall in walls:
                self.ax.add_patch(wall)
                
        except Exception as e:
            logger.debug(f"Error adding walls to plot: {str(e)}")
            raise

    def update(self, i):
        try:
            self.img.set_data(self.wave_packet.probs[i])
            self.img.set_zorder(1)
            return self.img,
        except Exception as e:
            logger.debug(f"Error updating animation frame {i}: {str(e)}")
            raise

    def animate3D(self):
        try:
            logger.info("Generating animation of interference model...")
            anim = FuncAnimation(
                self.fig, 
                self.update, 
                interval=1, 
                frames=np.arange(0, self.wave_packet.Nt - 100, 10), 
                repeat=False,
                blit=0
            )
            
            logger.debug("Converting animation to HTML")
            anim_js = anim.to_jshtml(fps=30)

            ## No longer need to save the file locally
            # path = os.path.abspath(os.path.join(f"quantum_app_backend/cache/interference/probs_{self.wave_packet.k0}_{self.wave_packet.a}_{self.wave_packet.s}_3D.html"))
            # if not Path(path).exists():
            #     with open(path, "w", encoding="utf-8") as f:
            #         portalocker.lock(f, portalocker.LOCK_EX)
            #         f.write(anim_js)
            return anim_js
            
        except Exception as e:
            logger.debug(f"Error generating animation: {str(e)}")
            raise

# Driver to upload interference models to MongoDB
if __name__ == "__main__":
    try:
        logger.debug("Starting interference model generation script")
        mongo = MongoConnector()
        wave_packet = Wave_Packet3D(slit_space=1, slit_sep=1, k0=2)
        animator = Animator3D(wave_packet)

        parameters = {
            'momentum': float(wave_packet.k0), 
            'spacing': float(wave_packet.a), 
            'slit_separation': float(wave_packet.s)
        }
        
        start_time = time.time()
        logger.debug(f"Generating interference model with parameters: {parameters}")

        anim_js = animator.animate3D()
        mongo.upload(mongo.collection('interference'), parameters, anim_js)

        end_time = time.time()
        duration = end_time - start_time
        
        logger.debug(f'Interference model inserted successfully. Time taken: {duration:.2f}s')
        
    except Exception as e:
        logger.debug("Failed to generate and upload interference model", exc_info=True)
        raise