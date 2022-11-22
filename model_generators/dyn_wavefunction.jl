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

#Pkg.add("pyplot")
# Had some issue, so make sure they are installed
#Pkg.add("LaTeXStrings")
#Pkg.add("PyCall")
gr() # or use pyplot

# ====================== Wavefunction ======================
xmin = -50
xmax = 50
Npoints = 200

b_position = PositionBasis(xmin, xmax, Npoints)
b_momentum = MomentumBasis(b_position)
xpoints = samplepoints(b_position)
#setting up bases

#//INPUT VARIABLES
mass = 2 #0.25 - 2
velocity = 2 #0.25 - 2


x0 = -35 #starting position
sigma0 = 2 #constant for gaussian, don't worry about
p0 = mass * velocity #momentum of particle/packet IMPORTANT: product cannot be more than 5 or it starts interfering with itself


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
    plot(xpoints, n, ylims = (-1, 1), zlims = (-1, 1), xlabel = "Position (x)", ylabel = "Position (y)", zlabel = "Position(z)", legend = false, linewidth = 1.5, background_color = "black", seriescolor = "deepskyblue2")
end 

probDensityAnim = @animate for t=1:size(T)[1]

    ψ = ψt[t]
    n = abs.(ψ.data).^2
    plot(xpoints, n, ylims = (0, .3), xlabel = "Position (x)", ylabel = "Probability Density", legend = false, linewidth = 3, background_color = "black", seriescolor = "deepskyblue2")
end 

wavefuntion_img_string = "wavefunction_" * string(mass) * "x" * string(velocity) * ".gif"
wavefuntion_probDensity_img_string = "wavefunction_probDensity_" * string(mass) * "x" * string(velocity) * ".gif"
gif(waveFunctionAnim, wavefuntion_img_string, fps = 60)
gif(probDensityAnim, wavefuntion_probDensity_img_string, fps = 60)