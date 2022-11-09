# Interference 2D + 3D

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

#Pkg.add("pyplot")
# Had some issue, so make sure they are installed
#Pkg.add("LaTeXStrings")
#Pkg.add("PyCall")
gr() # or use pyplot

# INPUT VARIABLES
Momentum = 10 #intensity of wave (1-10)
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

function potential_slit2D(x) 
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

 V2D = potentialoperator(b_position, potential_slit2D)
 H2D = LazySum(Kinetic, V2D)
 
 ψ2D = gaussianstate(b_position, x0, p0_x, σ)
 
 tout, ψt2D = timeevolution.schroedinger(T, ψ2D, H2D);

 anim2 = @animate for t=1:size(T)[1]

     ψ = ψt2D[t]
     n = abs.(ψ.data).^2
     plot(xsample, n, ylims = (0, .3), title = "Probability Density |ψ(x,t)|^2", xlabel = "Position (x)", ylabel = "Probability Density (|ψ(x,t)|^2)", label = "|ψ|^2", alpha=0.3, linewidth = 2)
 end 




 gif(anim1, "3DInterference.gif", fps=60)
 gif(anim2, "2DInterferenceProbDensity.gif", fps=60)#may add another 2D function for just wavefunction