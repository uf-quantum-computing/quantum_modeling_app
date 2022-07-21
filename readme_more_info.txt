
Yes, it should work by running Julia REPL on the Mac (https://en.wikibooks.org/wiki/Introducing_Julia/Getting_started#On_macOS_X) and then running include("path/to/packet.jl") followed by run(quantum_tunneling, true). This should open up a window that shows the animation.

Attached is a zip with the code and a quick readme along with a gif of quantum tunneling 

Depending on the presentation format, it might be interesting and hands-on to let students write their own quick potential function (probably in a separate file followed by include("their_file")) and then doing run(their_function, true).

__________
Introducing Julia/Getting started - Wikibooks, open books ...
en.wikibooks.org
To install Julia on your computer, visit http://julialang.org/downloads/ and follow instructions. You can use Julia online, in a browser. JuliaBox provides online ...