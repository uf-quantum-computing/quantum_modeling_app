# Dynamic Wavefunction Generation
# Computational Nano Lab, UFL
# ====================== imports ======================
using Pkg
Pkg.add("QuantumOptics")
Pkg.add("LinearAlgebra")
Pkg.add("Plots")
Pkg.add("ProgressMeter")
Pkg.add("Images")
Pkg.add("Colors")
using QuantumOptics
using LinearAlgebra
using Plots
using ProgressMeter
using Images
using ImageCore
using Colors

# ====================== imports ======================
#Pkg.add("pyplot")
#Pkg.add("LaTeXStrings")
#Pkg.add("PyCall")
gr() # or use pyplot

xmin = -50
xmax = 50
Npoints = 200

b_position = PositionBasis(xmin, xmax, Npoints)
b_momentum = MomentumBasis(b_position)
xpoints = samplepoints(b_position)
#setting up bases

# INPUT VARIABLES
mass = 10
velocity = 10 # EDITING NOTE: need to find min/max for fixed output

x0 = -35 # starting position
sigma0 = 2 # constant for gaussian, don't worry about
p0 = mass * velocity #momentum of particle/packet 

Txp = transform(b_position, b_momentum)
Tpx = transform(b_momentum, b_position)
H = LazyProduct(Txp, momentum(b_momentum)^2/2, Tpx) #calculate hamiltonian from bases

 #values for plotting

ψ = gaussianstate(b_position, x0, p0, sigma0)

T = collect(0.0:0.1:15.0)
tout, ψt = timeevolution.schroedinger(T, ψ, H);

#generates wavefunction animations, these are saved as .gif files
waveFunctionAnim = @animate for t=1:size(T)[1]

    ψ = ψt[t]
    n = ψ.data
    plot(xpoints, n, ylims = (-1, 1), zlims = (-1, 1), title = "Wavefunction ψ(x,t)", xlabel = "Position (x)", ylabel = "Position (y)", zlabel = "Position(z)", label = "ψ", alpha=0.3, linewidth = 2)
end every 2

probDensityAnim = @animate for t=1:size(T)[1]

    ψ = ψt[t]
    n = abs.(ψ.data).^2
    plot(xpoints, n, ylims = (0, .2), title = "Probability Density |ψ(x,t)|^2", xlabel = "Position (x)", ylabel = "Probability Density (|ψ(x,t)|^2)", label = "|ψ|^2", alpha=0.3, linewidth = 2)
end every 2
gif(waveFunctionAnim, "wave_10x10.gif", fps = 60)
gif(probDensityAnim, "wave_density_10x10.gif", fps = 60)