# Interference 2D + 3D
# Computational Nano Lab, UFL

# ================== import packages ==================
using Pkg
Pkg.add("QuantumOptics")
Pkg.add("LinearAlgebra")
Pkg.add("Plots")
Pkg.add("ProgressMeter")
Pkg.add("Images")
Pkg.add("ImageCore")
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

# ================== Interference ==================

# INPUT VARIABLES
Momentum = 5 #intensity of wave (1-5)
Spacing = 1 #size of the slit spaces (1-10)
SlitSeparation = 5 #spacing of the slits relative to the incoming wave (1-5)
V_tunnel = 150 #DON'T MESS WITH THIS UNLESS YOU WANT TUNNELING

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



# Simple potential function for a double-slit
function potential_slit(x,y)
    # Create the slits
    if x > 20 && x < 25 && abs(y) > SlitSeparation && abs(y) < Spacing + SlitSeparation
        return 0
        # Fill the rest of the wall
    elseif x > 20 && x < 25
        return V_tunnel
        # Make a wall at the end of the screen
    elseif x > 48
        return V_tunnel
    else
        return 0
    end
end

function potential_slit2D_at0(x) 
        if x > 20 && x < 25
            return V_tunnel
        else
            return 0
        end
end

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


    V = potentialoperator(b_comp_x, potential_slit)

    # Finally create our hamiltonian for 3D
    H = LazySum(Hkinx_FFT, Hkiny_FFT, V)

    ψx = gaussianstate(b_position, x0, p0_x, σ)
    ψy = gaussianstate(b_positiony, y0, p0_y, σ)
    ψ = QuantumOpticsBase.tensor(ψx, ψy)


    T = collect(0.0:0.1:25.0)
    tout, ψt = timeevolution.schroedinger(T, ψ, H);

    density = [Array(transpose(reshape((ψ.data), (xres, yres)))) for ψ=ψt]
    V_plot = Array(transpose(reshape(real.(diag(V.data)), (xres, yres))))

    xsample, ysample = samplepoints(b_position), samplepoints(b_positiony)

# 3D Section
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
 Kinetic = LazyProduct(Txp2D, momentum(b_momentum)^2/2, Tpx2D) 

 V2D_at0 = potentialoperator(b_position, potential_slit2D_at0)
 H2D_at0 = LazySum(Kinetic, V2D_at0)
 
 ψ2D_at0 = gaussianstate(b_position, x0, p0_x, σ)
 
 tout_at0, ψt2D_at0 = timeevolution.schroedinger(T, ψ2D_at0, H2D_at0);

 rectangle(w, h, x, y) = Shape(x .+ [0,w,w,0], y .+ [0,0,h,h]) #rectangle function for barrier

 anim2 = @animate for t=1:size(T)[1]

     ψ = ψt2D_at0[t]
     n = abs.(ψ.data).^2
     plot(xsample, n, ylims = (0, .3), xlabel = "Position (x)", ylabel = "Probability Density", legend = false, linewidth = 3, background_color = "black", seriescolor = "deepskyblue2")
     plot!(rectangle(5,1,20,0), color = "white", opacity = 0.5)
 end 

# ============== generate GIFs ==============
interference_3D_img_string = "interference_3D_" * string(Momentum) * "x" * string(Spacing) * "x" * string(SlitSeparation) * ".gif"
interference_2D_img_string = "interference_2D_" * string(Momentum) * "x" * string(Spacing) * "x" * string(SlitSeparation) * ".gif"
 gif(anim1, interference_3D_img_string, fps=60)
 gif(anim2, interference_2D_img_string, fps=60) # may add another 2D function for just wavefunction