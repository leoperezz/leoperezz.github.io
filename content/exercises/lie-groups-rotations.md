# Lie Groups and Rotation Representations

This exercise explores different representations of rotations and their relationships through Lie group theory.

## Problem Statement

Given a rotation matrix $R \in SO(3)$, find the corresponding:
1. Axis-angle representation $(\hat{\omega}, \theta)$
2. Unit quaternion $q \in S^3$
3. Euler angles $(\phi, \theta, \psi)$

## Background

The rotation group $SO(3)$ is a Lie group with Lie algebra $\mathfrak{so}(3)$:

$$
\mathfrak{so}(3) = \{A \in \mathbb{R}^{3 \times 3} : A^T = -A\}
$$

### Exponential Map

The exponential map $\exp: \mathfrak{so}(3) \to SO(3)$ is given by Rodrigues' formula:

$$
\exp([\omega]_\times \theta) = I + \sin\theta [\hat{\omega}]_\times + (1 - \cos\theta)[\hat{\omega}]_\times^2
$$

## Exercise

### Part 1: Axis-Angle Extraction

Given:
$$
R = \begin{pmatrix} 0 & -1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 1 \end{pmatrix}
$$

Find $\hat{\omega}$ and $\theta$.

**Hint**: The angle can be found from $\text{tr}(R) = 1 + 2\cos\theta$.

### Part 2: Implementation

```python
import numpy as np

def rotation_to_axis_angle(R):
    """Extract axis-angle from rotation matrix."""
    theta = np.arccos((np.trace(R) - 1) / 2)
    
    if np.abs(theta) < 1e-6:
        return np.array([0, 0, 1]), 0
    
    omega = (1 / (2 * np.sin(theta))) * np.array([
        R[2, 1] - R[1, 2],
        R[0, 2] - R[2, 0],
        R[1, 0] - R[0, 1]
    ])
    
    return omega / np.linalg.norm(omega), theta

# Test with the given rotation
R = np.array([
    [0, -1, 0],
    [1, 0, 0],
    [0, 0, 1]
])

axis, angle = rotation_to_axis_angle(R)
print(f"Axis: {axis}")
print(f"Angle: {np.degrees(angle)} degrees")
```

### Part 3: Quaternion Conversion

Convert the result to a unit quaternion using:

$$
q = \cos\frac{\theta}{2} + \sin\frac{\theta}{2}(w_x \mathbf{i} + w_y \mathbf{j} + w_z \mathbf{k})
$$

## Solution

The rotation matrix represents a 90° rotation about the z-axis:
- $\hat{\omega} = (0, 0, 1)$
- $\theta = \frac{\pi}{2}$

The corresponding quaternion is:
$$
q = \cos(45°) + \sin(45°)\mathbf{k} = \frac{\sqrt{2}}{2} + \frac{\sqrt{2}}{2}\mathbf{k}
$$

