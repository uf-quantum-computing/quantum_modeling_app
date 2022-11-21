#Tunneling 2D + 3D

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

# INPUT VARIABLES
V_tunnel = 1 #intensity of barrier (1-5)
BarrierThickness = 1 #thickness of barrier (not the same as intensity but related) (1-5)
Momentum = 1 #intensity of wave (1-10)

# Values for initial guassian
x0 = -5
y0 = 0
p0_x = Momentum
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


function potential_tunneling(x,y)
    # Fill the rest of the wall
    if x > 13 - (BarrierThickness/2) && x < 13 + (BarrierThickness/2)
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
b_comp_x = QuantumOpticsBase.tensor(b_position, b_positiony)
b_comp_p = QuantumOpticsBase.tensor(b_momentum, b_momentumy)


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


    V = potentialoperator(b_comp_x, potential_tunneling)

    # Finally create our hamiltonian for 3D
    H = LazySum(Hkinx_FFT, Hkiny_FFT, V)

    ψx = gaussianstate(b_position, x0, p0_x, σ)
    ψy = gaussianstate(b_positiony, y0, p0_y, σ)
    ψ = QuantumOpticsBase.tensor(ψx, ψy)


    T = collect(0.0:0.1:15.0)
    tout, ψt = timeevolution.schroedinger(T, ψ, H);

    density = [Array(transpose(reshape((ψ.data), (xres, yres)))) for ψ=ψt]
    V_plot = Array(transpose(reshape(real.(diag(V.data)), (xres, yres))))

    xsample, ysample = samplepoints(b_position), samplepoints(b_positiony)

    prog = Progress(size(T)[1], 1)
    anim1 = @animate for t=1:size(T)[1]
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

    # 2D Section, many variables reused

    Txp2D = transform(b_position, b_momentum)
    Tpx2D = transform(b_momentum, b_position)
    H2D = LazyProduct(Txp2D, momentum(b_momentum)^2/2, Tpx2D) 
    
    
    ψ2D = gaussianstate(b_position, x0, p0_x, σ)
    
    tout, ψt2D = timeevolution.schroedinger(T, ψ2D, H2D);

    anim2 = @animate for t=1:size(T)[1]

        ψ = ψt2D[t]
        n = abs.(ψ.data).^2
        plot(xsample, n, xlims = (0, 120), ylims = (0, .3), title = "Probability Density |ψ(x,t)|^2", xlabel = "Position (x)", ylabel = "Probability Density (|ψ(x,t)|^2)", label = "|ψ|^2", alpha=0.3, linewidth = 2)
    end 
    # ============== generate GIFs ==============
    tunneling_3D_img_string = "tunneling_3D_" * string(V_tunnel) * "x" * string(BarrierThickness) * "x" * string(Momentum) * ".gif"
    tunneling_2D_img_string = "tunneling_2D_" * string(V_tunnel) * "x" * string(BarrierThickness) * "x" * string(Momentum) * ".gif"
    gif(anim1, tunneling_3D_img_string, fps=60)
    gif(anim2, tunneling_2D_img_string, fps=60)