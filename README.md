# Quantum Modeling App

Tunneling and Interference | Computational Nano Lab, UFL

## Load program

The plot backend is `gr`

`include("tunnel.jl")`

This should install and precompile all the necessary package.

## Run the program

Run Julia REPL via terminal

**Note**: May take a little longer on first time due to precompliation)

```julia
    V_tunnel = 4
    run(potential_tunneling, true)
```

- Set to false to save as out.gif without showing a display
- Three defined potentials:
  1. potential_slit
  2. potential_tunneling
  3. potential_guassian

To change how long it runs, do `T = collect(0.0:0. 1:stop_time);`

---

## Julia

- Julia Documentation - [https://docs.julialang.org/en/v1/](https://docs.julialang.org/en/v1/)
- Julia Download - [https://julialang.org/downloads/](https://julialang.org/downloads/)
