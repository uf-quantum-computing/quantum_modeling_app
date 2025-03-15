from matplotlib import pyplot as plt
import numpy as np
from matplotlib import animation, rc
from matplotlib.animation import FuncAnimation, ArtistAnimation

import bloch

def HadamardGateNumerical(state):
    hdmrd = np.array([[1, 1], [1, -1]]) / np.sqrt(2)
    return hdmrd.dot(state)

def SGateNumerical(state):
    gate = np.array([[1, 0], [0, 1j]])
    return gate.dot(state)

def TGateNumerical(state):
    gate = np.array([[1, 0], [0, np.cos(np.pi / 4) + 1j * np.sin(np.pi / 4)]])
    return gate.dot(state)

def normalize(coord):
    return np.sqrt(1-(coord*coord))

def polarToCart(state):
    thta = findThetaPhi(state)[0]
    phi = findThetaPhi(state)[1]
    cartSt = [np.sin(thta)*np.cos(phi), np.sin(thta)*np.sin(phi), np.cos(thta)]
    return cartSt

def findThetaPhi(state):
    thta = 2*np.arccos(np.abs(state[0]))
    phi = np.angle(state[1]) - np.angle(state[0])
    return np.array([thta, phi])

def showSph(polSt1, polSt2, polSt3):
    state1 = polarToCart(polSt1)
    state2 = polarToCart(polSt2)
    state3 = polarToCart(polSt3)

    b = bloch.Bloch(n=3)

    b.add_vectors(state1, idx=0)
    b.add_vectors(state2, idx=1)
    b.add_vectors(state3, idx=2)

    b.make_sphere()

    plt.show()

"""
def animateNotWorking(polSt1, polSt2, polSt3, matrix):
    state1 = polarToCart(polSt1)
    state2 = polarToCart(polSt2)
    state3 = polarToCart(polSt3)

    end_state1 = polarToCart(matrix.dot(polSt1))
    end_state2 = polarToCart(matrix.dot(polSt2))
    end_state3 = polarToCart(matrix.dot(polSt3))


    b = bloch.Bloch(n=3)
    b.add_vectors(state1, idx=0)
    b.add_vectors(state2, idx=1)
    b.add_vectors(state3, idx=2)
    b.make_sphere()

    def setUp():

        b.make_sphere()

    def update(i):
        t = i / 20

        v_t = (1 - t) * np.array([1, 1]) + t * polSt1
        Av_t = matrix.dot(v_t)

        bn = bloch.Bloch(n=3)

        bn.add_vectors(polarToCart(Av_t), idx=0)
        bn.add_vectors(state2, idx=1)
        bn.add_vectors(state3, idx=2)

        return bn.axes

    anim = FuncAnimation(b.fig, update, frames=50, init_func=setUp, blit=True)
    plt.show()
    anim.save('bloch_sphere.gif', writer='imagemagick')

def animate():
    frames = []

    polSt1 = np.array([1, 0])
    polSt2 = np.array([0, 1])
    polSt3 = np.array([0, 1])

    b = bloch.Bloch(n=3)

    def addFrame():

        state1 = polarToCart(polSt1)
        state2 = polarToCart(polSt2)
        state3 = polarToCart(polSt3)

        b.add_vectors(state1, idx=0)
        b.add_vectors(state2, idx=1)
        b.add_vectors(state3, idx=2)

        b.make_sphere()

    addFrame()
    frames.append(b.axes)
    polSt1 = HadamardGateNumerical(polSt1)
    addFrame()
    frames.append(b.axes)
    polSt1 = SGateNumerical(polSt1)
    addFrame()
    frames.append(b.axes)
    polSt1 = TGateNumerical(polSt1)
    addFrame()
    frames.append(b.axes)

    polSt2 = HadamardGateNumerical(polSt2)
    addFrame()
    frames.append(b.axes)
    polSt2 = SGateNumerical(polSt2)
    addFrame()
    frames.append(b.axes)

    polSt3 = HadamardGateNumerical(polSt3)
    addFrame()
    frames.append(b.axes)
    anim = ArtistAnimation(b.fig, frames, interval=50, blit=True)
    anim.save("test.gif", writer='imagemagick')


"""
polSt1 = np.array([1, 0])
polSt2 = np.array([0, 1])
polSt3 = np.array([0, 1])

showSph(polSt1, polSt2, polSt3)

polSt1 = HadamardGateNumerical(polSt1)
showSph(polSt1, polSt2, polSt3)
polSt1 = SGateNumerical(polSt1)
showSph(polSt1, polSt2, polSt3)
polSt1 = TGateNumerical(polSt1)
showSph(polSt1, polSt2, polSt3)

polSt2 = HadamardGateNumerical(polSt2)
showSph(polSt1, polSt2, polSt3)
polSt2 = SGateNumerical(polSt2)
showSph(polSt1, polSt2, polSt3)

polSt3 = HadamardGateNumerical(polSt3)
showSph(polSt1, polSt2, polSt3)
#anim = ArtistAnimation(fig, frames, interval=50, blit=True)


print(polSt1)
print(polSt2)
print(polSt3)

showSph(polSt1, polSt2, polSt3)