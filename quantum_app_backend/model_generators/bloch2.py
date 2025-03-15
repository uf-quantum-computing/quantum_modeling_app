__all__ = ['Bloch']

import os

import numpy as np
from numpy import (outer, cos, sin, ones)

from packaging.version import parse as parse_version


try:
    import matplotlib
    import matplotlib.pyplot as plt
    from mpl_toolkits.mplot3d import Axes3D
    from matplotlib.patches import FancyArrowPatch
    from mpl_toolkits.mplot3d import proj3d

    # Define a custom _axes3D function based on the matplotlib version.
    # The auto_add_to_figure keyword is new for matplotlib>=3.4.
    if parse_version(matplotlib.__version__) >= parse_version('3.4'):
        def _axes3D(fig, *args, **kwargs):
            ax = Axes3D(fig, *args, auto_add_to_figure=False, **kwargs)
            return fig.add_axes(ax)
    else:
        def _axes3D(*args, **kwargs):
            return Axes3D(*args, **kwargs)

    class Arrow3D(FancyArrowPatch):
        def __init__(self, xs, ys, zs, *args, **kwargs):
            FancyArrowPatch.__init__(self, (0, 0), (0, 0), *args, **kwargs)

            self._verts3d = xs, ys, zs

        def draw(self, renderer):
            xs3d, ys3d, zs3d = self._verts3d
            xs, ys, zs = proj3d.proj_transform(xs3d, ys3d, zs3d, self.axes.M)

            self.set_positions((xs[0], ys[0]), (xs[1], ys[1]))
            FancyArrowPatch.draw(self, renderer)

        def do_3d_projection(self, renderer=None):
            # only called by matplotlib >= 3.5
            xs3d, ys3d, zs3d = self._verts3d
            xs, ys, zs = proj3d.proj_transform(xs3d, ys3d, zs3d, self.axes.M)
            self.set_positions((xs[0], ys[0]), (xs[1], ys[1]))
            return np.min(zs)
except ImportError:
    pass

try:
    from IPython.display import display
except ImportError:
    pass


class Bloch:
    r"""
    Class for plotting data on the Bloch sphere.  Valid data can be either
    points, vectors, or Qobj objects.

    Attributes
    ----------
    axes : matplotlib.axes.Axes
        User supplied Matplotlib axes for Bloch sphere animation.
    fig : matplotlib.figure.Figure
        User supplied Matplotlib Figure instance for plotting Bloch sphere.
    font_color : str, default 'black'
        Color of font used for Bloch sphere labels.
    font_size : int, default 20
        Size of font used for Bloch sphere labels.
    frame_alpha : float, default 0.1
        Sets transparency of Bloch sphere frame.
    frame_color : str, default 'gray'
        Color of sphere wireframe.
    frame_width : int, default 1
        Width of wireframe.
    point_color : list, default ["b", "r", "g", "#CC6600"]
        List of colors for Bloch sphere point markers to cycle through, i.e.
        by default, points 0 and 4 will both be blue ('b').
    point_marker : list, default ["o", "s", "d", "^"]
        List of point marker shapes to cycle through.
    point_size : list, default [25, 32, 35, 45]
        List of point marker sizes. Note, not all point markers look the same
        size when plotted!
    sphere_alpha : float, default 0.2
        Transparency of Bloch sphere itself.
    sphere_color : str, default '#FFDDDD'
        Color of Bloch sphere.
    figsize : list, default [7, 7]
        Figure size of Bloch sphere plot.  Best to have both numbers the same;
        otherwise you will have a Bloch sphere that looks like a football.
    vector_color : list, ["g", "#CC6600", "b", "r"]
        List of vector colors to cycle through.
    vector_width : int, default 5
        Width of displayed vectors.
    vector_style : str, default '-\|>'
        Vector arrowhead style (from matplotlib's arrow style).
    vector_mutation : int, default 20
        Width of vectors arrowhead.
    view : list, default [-60, 30]
        Azimuthal and Elevation viewing angles.
    xlabel : list, default ["$x$", ""]
        List of strings corresponding to +x and -x axes labels, respectively.
    xlpos : list, default [1.1, -1.1]
        Positions of +x and -x labels respectively.
    ylabel : list, default ["$y$", ""]
        List of strings corresponding to +y and -y axes labels, respectively.
    ylpos : list, default [1.2, -1.2]
        Positions of +y and -y labels respectively.
    zlabel : list, default ['$\\left\|0\\right>$', '$\\left\|1\\right>$']
        List of strings corresponding to +z and -z axes labels, respectively.
    zlpos : list, default [1.2, -1.2]
        Positions of +z and -z labels respectively.
    """
    def __init__(self, n=1, fig=None, axes=None, view=None, figsize=None,
                 background=False):
        # Number of spheres
        self.n = n
        # Figure and axes
        self.fig = fig
        self._ext_fig = fig is not None
        if axes is None:
            self.axes = [None] * n
        else:
            self.axes = [axes] if not isinstance(axes, list) else axes
            if len(self.axes) != n:
                raise ValueError(f"Number of axes ({len(self.axes)}) must match number of spheres ({n})")
        # Background axes, default = False
        self.background = background
        # The size of the figure in inches, default = [5,5].
        if figsize is None:
            self.figsize = [5 * n, 5]
        else:
            self.figsize = figsize
        # Azimuthal and Elvation viewing angles, default = [-60,30].
        self.view = view if view else [-60, 30]
        # Color of Bloch sphere, default = #FFDDDD
        self.sphere_color = '#FFDDDD'
        # Transparency of Bloch sphere, default = 0.2
        self.sphere_alpha = 0.2
        # Color of wireframe, default = 'gray'
        self.frame_color = 'gray'
        # Width of wireframe, default = 1
        self.frame_width = 1
        # Transparency of wireframe, default = 0.2
        self.frame_alpha = 0.2
        # Labels for x-axis (in LaTex), default = ['$x$', '']
        self.xlabel = [r'$\left|+\right>$', r'$\left|-\right>$']
        # Position of x-axis labels, default = [1.2, -1.2]
        self.xlpos = [1.2, -1.2]
        # Labels for y-axis (in LaTex), default = ['$y$', '']
        self.ylabel = [r'$\left|i+\right>$', r'$\left|i-\right>$']
        # Position of y-axis labels, default = [1.1, -1.1]
        self.ylpos = [1.2, -1.2]
        # Labels for z-axis (in LaTex),
        # default = [r'$\left\|0\right>$', r'$\left|1\right>$']
        self.zlabel = [r'$\left|0\right>$', r'$\left|1\right>$']
        # Position of z-axis labels, default = [1.2, -1.2]
        self.zlpos = [1.2, -1.2]
        # ---font options---
        # Color of fonts, default = 'black'
        self.font_color = 'black'
        # Size of fonts, default = 20
        self.font_size = 20

        # ---vector options---
        # List of colors for Bloch vectors, default = ['b','g','r','y']
        self.vector_default_color = ['g', '#CC6600', 'b', 'r']
        # List that stores the display colors for each vector
        self.vector_color = []
        # Width of Bloch vectors, default = 5
        self.vector_width = 3
        # Style of Bloch vectors, default = '-\|>' (or 'simple')
        self.vector_style = '-|>'
        # Sets the width of the vectors arrowhead
        self.vector_mutation = 20

        # ---point options---
        # List of colors for Bloch point markers, default = ['b','g','r','y']
        self.point_default_color = ['b', 'r', 'g', '#CC6600']
        # List that stores the display colors for each set of points
        self.point_color = []
        # Size of point markers, default = 25
        self.point_size = [25, 32, 35, 45]
        # Shape of point markers, default = ['o','^','d','s']
        self.point_marker = ['o', 's', 'd', '^']

        # ---data lists---
        # Data for point markers
        self.points = [[] for _ in range(n)]
        # Data for Bloch vectors
        self.vectors = [[] for _ in range(n)]
        # Transparency of vectors, alpha value from 0 to 1
        self.vector_alpha = []
        # Data for annotations
        self.annotations = []
        # Number of times sphere has been saved
        self.savenum = 0
        # Style of points, 'm' for multiple colors, 's' for single color
        self.point_style = []
        # Transparency of points, alpha value from 0 to 1
        self.point_alpha = []
        # Data for line segment
        self._lines = [[] for _ in range(n)]
        # Data for arcs and arc style
        self._arcs = [[] for _ in range(n)]

    def set_label_convention(self, convention):
        """Set x, y and z labels according to one of conventions.

        Parameters
        ----------
        convention : string
            One of the following:

            - "original"
            - "xyz"
            - "sx sy sz"
            - "01"
            - "polarization jones"
            - "polarization jones letters"
              see also: https://en.wikipedia.org/wiki/Jones_calculus
            - "polarization stokes"
              see also: https://en.wikipedia.org/wiki/Stokes_parameters
        """
        ketex = "$\\left.|%s\\right\\rangle$"
        # \left.| is on purpose, so that every ket has the same size

        if convention == "original":
            self.xlabel = ['$x$', '']
            self.ylabel = ['$y$', '']
            self.zlabel = ['$\\left|0\\right>$', '$\\left|1\\right>$']
        elif convention == "xyz":
            self.xlabel = ['$x$', '']
            self.ylabel = ['$y$', '']
            self.zlabel = ['$z$', '']
        elif convention == "sx sy sz":
            self.xlabel = ['$s_x$', '']
            self.ylabel = ['$s_y$', '']
            self.zlabel = ['$s_z$', '']
        elif convention == "01":
            self.xlabel = ['', '']
            self.ylabel = ['', '']
            self.zlabel = ['$\\left|0\\right>$', '$\\left|1\\right>$']
        elif convention == "polarization jones":
            self.xlabel = [ketex % "\\nearrow\\hspace{-1.46}\\swarrow",
                           ketex % "\\nwarrow\\hspace{-1.46}\\searrow"]
            self.ylabel = [ketex % "\\circlearrowleft", ketex %
                           "\\circlearrowright"]
            self.zlabel = [ketex % "\\leftrightarrow", ketex % "\\updownarrow"]
        elif convention == "polarization jones letters":
            self.xlabel = [ketex % "D", ketex % "A"]
            self.ylabel = [ketex % "L", ketex % "R"]
            self.zlabel = [ketex % "H", ketex % "V"]
        elif convention == "polarization stokes":
            self.ylabel = ["$\\nearrow\\hspace{-1.46}\\swarrow$",
                           "$\\nwarrow\\hspace{-1.46}\\searrow$"]
            self.zlabel = ["$\\circlearrowleft$", "$\\circlearrowright$"]
            self.xlabel = ["$\\leftrightarrow$", "$\\updownarrow$"]
        else:
            raise Exception("No such convention.")

    def __str__(self):
        s = ""
        s += "Bloch data:\n"
        s += "-----------\n"
        s += "Number of points:  " + str(len(self.points)) + "\n"
        s += "Number of vectors: " + str(len(self.vectors)) + "\n"
        s += "\n"
        s += "Bloch sphere properties:\n"
        s += "------------------------\n"
        s += "font_color:      " + str(self.font_color) + "\n"
        s += "font_size:       " + str(self.font_size) + "\n"
        s += "frame_alpha:     " + str(self.frame_alpha) + "\n"
        s += "frame_color:     " + str(self.frame_color) + "\n"
        s += "frame_width:     " + str(self.frame_width) + "\n"
        s += "point_default_color:" + str(self.point_default_color) + "\n"
        s += "point_marker:    " + str(self.point_marker) + "\n"
        s += "point_size:      " + str(self.point_size) + "\n"
        s += "sphere_alpha:    " + str(self.sphere_alpha) + "\n"
        s += "sphere_color:    " + str(self.sphere_color) + "\n"
        s += "figsize:         " + str(self.figsize) + "\n"
        s += "vector_default_color:" + str(self.vector_default_color) + "\n"
        s += "vector_width:    " + str(self.vector_width) + "\n"
        s += "vector_style:    " + str(self.vector_style) + "\n"
        s += "vector_mutation: " + str(self.vector_mutation) + "\n"
        s += "view:            " + str(self.view) + "\n"
        s += "xlabel:          " + str(self.xlabel) + "\n"
        s += "xlpos:           " + str(self.xlpos) + "\n"
        s += "ylabel:          " + str(self.ylabel) + "\n"
        s += "ylpos:           " + str(self.ylpos) + "\n"
        s += "zlabel:          " + str(self.zlabel) + "\n"
        s += "zlpos:           " + str(self.zlpos) + "\n"
        return s

    def _repr_png_(self):
        from IPython.core.pylabtools import print_figure
        self.render()
        fig_data = print_figure(self.fig, 'png')
        plt.close(self.fig)
        return fig_data

    def _repr_svg_(self):
        from IPython.core.pylabtools import print_figure
        self.render()
        fig_data = print_figure(self.fig, 'svg')
        plt.close(self.fig)
        return fig_data

    def clear(self, idx=None):
        """Resets Bloch sphere data sets to empty.
        """
        if idx is None:
            for i in range(self.n):
                self.points[i] = []
                self.vectors[i] = []
                self._lines[i] = []
                self._arcs[i] = []
        else:
            if not 0 <= idx < self.n:
                raise ValueError(f"Sphere index {idx} out of range [0, {self.n - 1}]")
            self.points[idx] = []
            self.vectors[idx] = []
            self._lines[idx] = []
            self._arcs[idx] = []

        self.point_style = []
        self.point_alpha = []
        self.vector_alpha = []
        self.annotations = []
        self.vector_color = []
        self.point_color = []

    def add_points(self, points, idx=0, meth='s', colors=None, alpha=1.0):
        """Add a list of data points to bloch sphere.

        Parameters
        ----------
        points : array_like
            Collection of data points.

        meth : {'s', 'm', 'l'}
            Type of points to plot, use 'm' for multicolored, 'l' for points
            connected with a line.

        colors : array_like
            Optional array with colors for the points.
            A single color for meth 's', and list of colors for meth 'm'

        alpha : float, default=1.
            Transparency value for the vectors. Values between 0 and 1.

        Notes
        -----
        When using ``meth=l`` in QuTiP 4.6, the line transparency defaulted
        to ``0.75`` and there was no way to alter it.
        When the ``alpha`` parameter was added in QuTiP 4.7, the default
        became ``alpha=1.0`` for values of ``meth``.
        """
        if not 0 <= idx < self.n:
            raise ValueError(f"Sphere index {idx} out of range [0, {self.n - 1}]")

        points = np.asarray(points)

        if points.ndim == 1:
            points = points[:, np.newaxis]

        if points.ndim != 2 or points.shape[0] != 3:
            raise ValueError("The included points are not valid. Points must "
                             "be equivalent to a 2D array where the first "
                             "index represents the x,y,z values and the "
                             "second index iterates over the points.")

        if meth not in ['s', 'm', 'l']:
            raise ValueError(f"The value for meth = {meth} is not valid."
                             " Please use 's', 'l' or 'm'.")

        if meth == 's' and points.shape[1] == 1:
            points = np.append(points[:, :1], points, axis=1)

        self.point_style.append(meth)
        self.points[idx].append(points)
        self.point_alpha.append(alpha)
        self.point_color.append(colors)

    def add_vectors(self, vectors, idx=0, colors=None, alpha=1.0):
        """Add a list of vectors to Bloch sphere.

        Parameters
        ----------
        vectors : array_like
            Array with vectors of unit length or smaller.

        colors : array_like
            Optional array with colors for the vectors.

        alpha : float, default=1.
            Transparency value for the vectors. Values between 0 and 1.

        """
        if not 0 <= idx < self.n:
            raise ValueError(f"Sphere index {idx} out of range [0, {self.n - 1}]")

        vectors = np.asarray(vectors)

        if vectors.ndim == 1:
            vectors = vectors[np.newaxis, :]

        if vectors.ndim != 2 or vectors.shape[1] != 3:
            raise ValueError(
                "The included vectors are not valid. Vectors must "
                "be equivalent to a 2D array where the first "
                "index represents the iteration over the vectors and the "
                "second index represents the position in 3D of vector head.")

        n_vectors = vectors.shape[0]
        if colors is None:
            colors = np.array([None] * n_vectors)
        else:
            colors = np.asarray(colors)

        if colors.ndim != 1 or colors.size != n_vectors:
            raise ValueError("The included colors are not valid. colors must "
                             "be equivalent to a 1D array with the same "
                             "size as the number of vectors. ")

        for k, vec in enumerate(vectors):
            self.vectors[idx].append(vec)
            self.vector_alpha.append(alpha)
            self.vector_color.append(colors[k])

    def make_sphere(self):
        """
        Plots Bloch sphere and data sets.
        """
        self.render()

    def run_from_ipython(self):
        try:
            __IPYTHON__
            return True
        except NameError:
            return False

    def _is_inline_backend(self):
        backend = matplotlib.get_backend()
        return backend == "module://matplotlib_inline.backend_inline"

    def render(self):
        """
        Render the Bloch sphere and its data sets in on given figure and axes.
        """
        if not self._ext_fig:
            if self.fig is None or not plt.fignum_exists(self.fig.number):
                self.fig = plt.figure(figsize=self.figsize)

            # Create or update axes for each sphere
        for i in range(self.n):
            if self.axes[i] is None:
                self.axes[i] = self.fig.add_subplot(1, self.n, i + 1, projection='3d')
                self.axes[i].view_init(azim=self.view[0], elev=self.view[1])

            # Clear and set up the axes
            self.axes[i].clear()
            self.axes[i].grid(False)
            if self.background:
                self.axes[i].set_xlim3d(-1.3, 1.3)
                self.axes[i].set_ylim3d(-1.3, 1.3)
                self.axes[i].set_zlim3d(-1.3, 1.3)
            else:
                self.axes[i].set_axis_off()
                self.axes[i].set_xlim3d(-0.7, 0.7)
                self.axes[i].set_ylim3d(-0.7, 0.7)
                self.axes[i].set_zlim3d(-0.7, 0.7)

            if parse_version(matplotlib.__version__) >= parse_version('3.3'):
                self.axes[i].set_box_aspect((1, 1, 1))

            # Plot sphere components
            if not self.background:
                self.plot_axes(i)

            self.plot_back(i)
            self.plot_points(i)
            self.plot_vectors(i)
            self.plot_lines(i)
            self.plot_arcs(i)
            self.plot_front(i)
            self.plot_axes_labels(i)
            self.plot_annotations(i)

        self.fig.canvas.draw()

    def plot_back(self, idx):
        # back half of sphere
        u = np.linspace(0, np.pi, 25)
        v = np.linspace(0, np.pi, 25)
        x = outer(cos(u), sin(v))
        y = outer(sin(u), sin(v))
        z = outer(ones(np.size(u)), cos(v))
        self.axes[idx].plot_surface(x, y, z, rstride=2, cstride=2,
                               color=self.sphere_color, linewidth=0,
                               alpha=self.sphere_alpha)
        # wireframe
        self.axes[idx].plot_wireframe(x, y, z, rstride=5, cstride=5,
                                 color=self.frame_color,
                                 alpha=self.frame_alpha)
        # equator
        self.axes[idx].plot(1.0 * cos(u), 1.0 * sin(u), zs=0, zdir='z',
                       lw=self.frame_width, color=self.frame_color)
        self.axes[idx].plot(1.0 * cos(u), 1.0 * sin(u), zs=0, zdir='x',
                       lw=self.frame_width, color=self.frame_color)

    def plot_front(self, idx):
        # front half of sphere
        u = np.linspace(-np.pi, 0, 25)
        v = np.linspace(0, np.pi, 25)
        x = outer(cos(u), sin(v))
        y = outer(sin(u), sin(v))
        z = outer(ones(np.size(u)), cos(v))
        self.axes[idx].plot_surface(x, y, z, rstride=2, cstride=2,
                               color=self.sphere_color, linewidth=0,
                               alpha=self.sphere_alpha)
        # wireframe
        self.axes[idx].plot_wireframe(x, y, z, rstride=5, cstride=5,
                                 color=self.frame_color,
                                 alpha=self.frame_alpha)
        # equator
        self.axes[idx].plot(1.0 * cos(u), 1.0 * sin(u),
                       zs=0, zdir='z', lw=self.frame_width,
                       color=self.frame_color)
        self.axes[idx].plot(1.0 * cos(u), 1.0 * sin(u),
                       zs=0, zdir='x', lw=self.frame_width,
                       color=self.frame_color)

    def plot_axes(self, idx):
        # axes
        span = np.linspace(-1.0, 1.0, 2)
        self.axes[idx].plot(span, 0 * span, zs=0, zdir='z', label='X',
                       lw=self.frame_width, color=self.frame_color)
        self.axes[idx].plot(0 * span, span, zs=0, zdir='z', label='Y',
                       lw=self.frame_width, color=self.frame_color)
        self.axes[idx].plot(0 * span, span, zs=0, zdir='y', label='Z',
                       lw=self.frame_width, color=self.frame_color)

    def plot_axes_labels(self, idx):
        # axes labels
        opts = {'fontsize': self.font_size,
                'color': self.font_color,
                'horizontalalignment': 'center',
                'verticalalignment': 'center'}
        self.axes[idx].text(0, -self.xlpos[0], 0, self.xlabel[0], **opts)
        self.axes[idx].text(0, -self.xlpos[1], 0, self.xlabel[1], **opts)

        self.axes[idx].text(self.ylpos[0], 0, 0, self.ylabel[0], **opts)
        self.axes[idx].text(self.ylpos[1], 0, 0, self.ylabel[1], **opts)

        self.axes[idx].text(0, 0, self.zlpos[0], self.zlabel[0], **opts)
        self.axes[idx].text(0, 0, self.zlpos[1], self.zlabel[1], **opts)

        for a in (self.axes[idx].xaxis.get_ticklines() +
                  self.axes[idx].xaxis.get_ticklabels()):
            a.set_visible(False)
        for a in (self.axes[idx].yaxis.get_ticklines() +
                  self.axes[idx].yaxis.get_ticklabels()):
            a.set_visible(False)
        for a in (self.axes[idx].zaxis.get_ticklines() +
                  self.axes[idx].zaxis.get_ticklabels()):
            a.set_visible(False)

    def plot_vectors(self, idx):
        # -X and Y data are switched for plotting purposes
        for k, vec in enumerate(self.vectors[idx]):

            xs3d = vec[1] * np.array([0, 1])
            ys3d = -vec[0] * np.array([0, 1])
            zs3d = vec[2] * np.array([0, 1])

            alpha = self.vector_alpha[k]
            color = self.vector_color[k]
            if color is None:
                color_idx = k % len(self.vector_default_color)
                color = self.vector_default_color[color_idx]

            # decorated style, with arrow heads
            a = Arrow3D(xs3d, ys3d, zs3d,
                        mutation_scale=self.vector_mutation,
                        lw=self.vector_width,
                        arrowstyle=self.vector_style,
                        color=color, alpha=alpha)

            self.axes[idx].add_artist(a)

    def plot_points(self, idx):
        # -X and Y data are switched for plotting purposes
        for k, points in enumerate(self.points[idx]):
            points = np.asarray(points)
            num_points = points.shape[1]

            dist = np.linalg.norm(points, axis=0)
            if not np.allclose(dist, dist[0], rtol=1e-12):
                indperm = np.argsort(dist)
                points = points[:, indperm]
            else:
                indperm = np.arange(num_points)

            s = self.point_size[np.mod(k, len(self.point_size))]
            marker = self.point_marker[np.mod(k, len(self.point_marker))]
            style = self.point_style[k]
            if self.point_color[k] is not None:
                color = self.point_color[k]
            elif self.point_style[k] in ['s', 'l']:
                color = self.point_default_color[
                    k % len(self.point_default_color)
                ]
            elif self.point_style[k] == 'm':
                length = np.ceil(num_points/len(self.point_default_color))
                color = np.tile(self.point_default_color, length.astype(int))
                color = color[indperm]
                color = list(color)

            if self.point_style[k] in ['s', 'm']:
                self.axes[idx].scatter(np.real(points[1]),
                                  -np.real(points[0]),
                                  np.real(points[2]),
                                  s=s,
                                  marker=marker,
                                  color=color,
                                  alpha=self.point_alpha[k],
                                  edgecolor=None,
                                  zdir='z',
                                  )

            elif self.point_style[k] == 'l':
                self.axes[idx].plot(np.real(points[1]),
                               -np.real(points[0]),
                               np.real(points[2]),
                               color=color,
                               alpha=self.point_alpha[k],
                               zdir='z',
                               )

    def plot_annotations(self, idx):
        # -X and Y data are switched for plotting purposes
        for annotation in self.annotations:
            vec = annotation['position']
            opts = {'fontsize': self.font_size,
                    'color': self.font_color,
                    'horizontalalignment': 'center',
                    'verticalalignment': 'center'}
            opts.update(annotation['opts'])
            self.axes[idx].text(vec[1], -vec[0], vec[2],
                           annotation['text'], **opts)

    def plot_lines(self, idx):
        for line, fmt, kw in self._lines[idx]:
            self.axes[idx].plot(line[0], line[1], line[2], fmt, **kw)

    def plot_arcs(self, idx):
        for arc, fmt, kw in self._arcs[idx]:
            self.axes[idx].plot(arc[1, :], -arc[0, :], arc[2, :], fmt, **kw)

    def save(self, name=None, format='png', dirc=None, dpin=None):
        """Saves Bloch sphere to file of type ``format`` in directory ``dirc``.

        Parameters
        ----------

        name : str
            Name of saved image. Must include path and format as well.
            i.e. '/Users/Me/Desktop/bloch.png'
            This overrides the 'format' and 'dirc' arguments.
        format : str
            Format of output image.
        dirc : str
            Directory for output images. Defaults to current working directory.
        dpin : int
            Resolution in dots per inch.

        Returns
        -------
        File containing plot of Bloch sphere.

        """
        self.render()
        # Conditional variable for first argument to savefig
        # that is set in subsequent if-elses
        complete_path = ""
        if dirc:
            if not os.path.isdir(os.getcwd() + "/" + str(dirc)):
                os.makedirs(os.getcwd() + "/" + str(dirc))
        if name is None:
            if dirc:
                complete_path = os.getcwd() + "/" + str(dirc) + '/bloch_' \
                                + str(self.savenum) + '.' + format
            else:
                complete_path = os.getcwd() + '/bloch_' + \
                                str(self.savenum) + '.' + format
        else:
            complete_path = name

        if dpin:
            self.fig.savefig(complete_path, dpi=dpin)
        else:
            self.fig.savefig(complete_path)
        self.savenum += 1
        if self.fig:
            plt.close(self.fig)


def _hide_tick_lines_and_labels(axis):
    '''
    Set visible property of ticklines and ticklabels of an axis to False
    '''
    for a in axis.get_ticklines() + axis.get_ticklabels():
        a.set_visible(False)

if __name__ == '__main__':
    # Create a figure with 3 Bloch spheres
    b = Bloch(n=3)

    # Add vectors to different spheres
    b.add_vectors([1, 0, 0], idx=0)  # X vector on first sphere
    b.add_vectors([0, 1, 0], idx=1)  # Y vector on second sphere
    b.add_vectors([0, 0, 1], idx=2)  # Z vector on third sphere

    # Add points to specific spheres
    #b.add_points([[0, 1], [0, 0], [1, 0]], idx=1)  # Points on first sphere

    # Render all spheres
    b.make_sphere()

    plt.show()

    #plt.savefig('test.png')