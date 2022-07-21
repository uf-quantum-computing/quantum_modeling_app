# Tunneling and Interference
# Computational Nano Lab, UFL
using Pkg
Pkg.add("QuantumOptics")
using QuantumOptics
Pkg.add("LinearAlgebra")
using LinearAlgebra
Pkg.add("Plots")
using Plots
Pkg.add("ProgressMeter")
using ProgressMeter
Pkg.add("Images")
using Images
using ImageCore
Pkg.add("Colors")
using Colors

# Pkg.add("pyplot")
# Had some issue, so make sure they are installed
# Pkg.add("LaTeXStrings")
# Pkg.add("PyCall")
gr() # or use pyplot

# Values for initial guassian
x0 = -5
y0 = 0
p0_x = 3.0
p0_y = 0.0
σ = 2.0

# Resolution for computation
xres = 100
yres = 80

# XY field
xmin = -30
xmax = 50
ymin = -20
ymax = 20


## =================== START POTENTIALS =================== ##
# Simple potential function for a double-slit
function potential_slit(x,y)
    # Create the slits
    if x > 20 && x < 25 && abs(y) > 1 && abs(y) < 5
        return 0
        # Fill the rest of the wall
    elseif x > 20 && x < 25
        return 150
        # Make a wall at the end of the screen
    elseif x > 48
        return 150
    else
        return 0
    end
end

V_tunnel = 4
function potential_tunneling(x,y)
    # Fill the rest of the wall
    if x > 12 && x < 13
        return V_tunnel
    else
        return 0
    end

end

potential_guassian(x,y) = exp(-(x^2 + y^2)/15.0) 

## =================== END POTENTIALS =================== ##

# Basis for particle in real space
b_position = PositionBasis(xmin, xmax, xres)
b_momentum = MomentumBasis(b_position)
b_positiony = PositionBasis(ymin, ymax, yres)
b_momentumy = MomentumBasis(b_positiony)

# Combine the basis via tensor product
b_comp_x = b_position ⊗ b_positiony
b_comp_p = b_momentum ⊗ b_momentumy


# Transformation between position and momentum basis
Txp = transform(b_comp_x, b_comp_p)
Tpx = transform(b_comp_p, b_comp_x)

px = momentum(b_momentum)
py = momentum(b_momentumy)

# LazyTensor to wait till later before computation
Hkinx = LazyTensor(b_comp_p, [1, 2], [px^2/2, one(b_momentumy)])
Hkiny = LazyTensor(b_comp_p, [1, 2], [one(b_momentum), py^2/2])

Hkinx_FFT = LazyProduct(Txp, Hkinx, Tpx)
Hkiny_FFT = LazyProduct(Txp, Hkiny, Tpx);

# show gif
function show_animated_gif(density::Array, V_plot::Array, xsample, ysample, T)
    p = plot(show=true)
    prog = Progress(size(T)[1], 1)
    @gif for t=1:size(T)[1]
        angl = angle.(density[t])
        mag = abs2.(density[t])


        img = colorview(HSV, (angl.+3.14/2) * 180/pi, ones(size(mag)), mag .* (1/ maximum(mag)))
        V_img = colorview(HSV, zeros(size(V_plot)), zeros(size(V_plot)), V_plot .*(1/maximum(V_plot)))
        img = convert.(RGB, img)
        V_img = convert.(RGB, V_img)
        img = scaleminmax(RGB,0.0,1.0).(img + V_img)
        plot!(img)
        next!(prog)
    end every 2

end

# a little better for animation
function save_as_gif(density::Array, V_plot::Array, xsample, ysample, T)
    prog = Progress(size(T)[1], 1)
    anim = @animate for t=1:size(T)[1]
        angl = angle.(density[t])
        mag = abs2.(density[t])


        img = colorview(HSV, (angl.+3.14/2) * 180/pi, ones(size(mag)), mag .* (1/ maximum(mag)))
        V_img = colorview(HSV, zeros(size(V_plot)), zeros(size(V_plot)), V_plot .*(1/maximum(V_plot)))
        img = convert.(RGB, img)
        V_img = convert.(RGB, V_img)
        img = scaleminmax(RGB,0.0,1.0).(img + V_img)
        plot(img)
        next!(prog)
    end
    gif(anim, "out.gif", fps=30)

end

function run(potential::Function, do_display::Bool) 
    V = potentialoperator(b_comp_x, potential)

    # Finally create our hamiltonian
    H = LazySum(Hkinx_FFT, Hkiny_FFT, V)

    ψx = gaussianstate(b_position, x0, p0_x, σ)
    ψy = gaussianstate(b_positiony, y0, p0_y, σ)
    ψ = ψx ⊗ ψy

    T = collect(0.0:0.1:18.0)
    tout, ψt = timeevolution.schroedinger(T, ψ, H);

    density = [Array(transpose(reshape((ψ.data), (xres, yres)))) for ψ=ψt]
    V_plot = Array(transpose(reshape(real.(diag(V.data)), (xres, yres))))

    xsample, ysample = samplepoints(b_position), samplepoints(b_positiony)

    # either show gif or show nothing and save as gif
    if do_display
        show_animated_gif(density, V_plot, xsample, ysample, T)
    else
        save_as_gif(density, V_plot, xsample, ysample, T)
    end

end
