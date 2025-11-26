# Linear Algebra Review: Eigenvalues and SVD

Essential linear algebra concepts for machine learning and robotics.

## Eigenvalues and Eigenvectors

For a square matrix $A$, an eigenvector $\mathbf{v}$ and eigenvalue $\lambda$ satisfy:

$$
A\mathbf{v} = \lambda \mathbf{v}
$$

### Computing Eigenvalues

Eigenvalues are roots of the characteristic polynomial:

$$
\det(A - \lambda I) = 0
$$

### Spectral Decomposition

For symmetric matrices:

$$
A = Q \Lambda Q^T
$$

where $Q$ is orthogonal and $\Lambda$ is diagonal.

## Singular Value Decomposition (SVD)

Any matrix $A \in \mathbb{R}^{m \times n}$ can be decomposed as:

$$
A = U \Sigma V^T
$$

where:
- $U \in \mathbb{R}^{m \times m}$ (left singular vectors)
- $\Sigma \in \mathbb{R}^{m \times n}$ (singular values)
- $V \in \mathbb{R}^{n \times n}$ (right singular vectors)

### Applications

| Application | How SVD is Used |
|-------------|-----------------|
| PCA | Principal components from $V$ |
| Low-rank approximation | Truncate small singular values |
| Pseudoinverse | $A^+ = V \Sigma^+ U^T$ |
| Matrix rank | Count non-zero singular values |

```python
import numpy as np

# SVD decomposition
U, S, Vt = np.linalg.svd(A)

# Low-rank approximation
k = 10  # keep top k singular values
A_approx = U[:, :k] @ np.diag(S[:k]) @ Vt[:k, :]
```

## Key Properties

- Singular values are always non-negative
- $\|A\|_2 = \sigma_1$ (largest singular value)
- $\|A\|_F = \sqrt{\sum_i \sigma_i^2}$ (Frobenius norm)

