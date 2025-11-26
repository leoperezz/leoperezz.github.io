# Introduction to Differential Geometry

These are my notes from the differential geometry course, covering the fundamental concepts of curves, surfaces, and manifolds.

## 1. Curves in $\mathbb{R}^n$

A parametrized curve is a smooth map $\gamma: I \to \mathbb{R}^n$ where $I \subseteq \mathbb{R}$ is an interval.

### Arc Length

The arc length of a curve from $t=a$ to $t=b$ is:

$$
L(\gamma) = \int_a^b \|\gamma'(t)\| \, dt
$$

### Curvature

For a unit-speed curve, the curvature is:

$$
\kappa(s) = \|\gamma''(s)\|
$$

## 2. Surfaces

A regular surface is a subset $S \subseteq \mathbb{R}^3$ such that for every point $p \in S$, there exists a neighborhood $V$ of $p$ and a map $\mathbf{x}: U \to V \cap S$ that is:

1. **Smooth**: $\mathbf{x}$ is infinitely differentiable
2. **Homeomorphism**: $\mathbf{x}$ is a homeomorphism onto its image
3. **Regular**: $d\mathbf{x}_q$ is injective for all $q \in U$

### First Fundamental Form

$$
I = E \, du^2 + 2F \, du \, dv + G \, dv^2
$$

where:
- $E = \langle \mathbf{x}_u, \mathbf{x}_u \rangle$
- $F = \langle \mathbf{x}_u, \mathbf{x}_v \rangle$
- $G = \langle \mathbf{x}_v, \mathbf{x}_v \rangle$

## 3. Gaussian Curvature

The Gaussian curvature is defined as:

$$
K = \kappa_1 \cdot \kappa_2
$$

where $\kappa_1$ and $\kappa_2$ are the principal curvatures.

### Theorema Egregium

Gauss's remarkable theorem states that $K$ depends only on the first fundamental form—it is an intrinsic property of the surface.

## Key Formulas

| Concept | Formula |
|---------|---------|
| Arc Length | $L = \int \|\gamma'\| \, dt$ |
| Curvature | $\kappa = \|T'\|$ |
| Gaussian Curvature | $K = \kappa_1 \kappa_2$ |
| Mean Curvature | $H = \frac{1}{2}(\kappa_1 + \kappa_2)$ |

