# Gradient Descent Variants Comparison

Compare different gradient descent optimization algorithms on a simple convex function.

## Problem Statement

Implement and compare SGD, Momentum, and Adam on the Rosenbrock function:

$$
f(x, y) = (a - x)^2 + b(y - x^2)^2
$$

with $a = 1$ and $b = 100$.

## Background

### Gradient Descent Update Rules

**SGD:**
$$
\theta_{t+1} = \theta_t - \eta \nabla f(\theta_t)
$$

**Momentum:**
$$
v_{t+1} = \beta v_t + \nabla f(\theta_t)
$$
$$
\theta_{t+1} = \theta_t - \eta v_{t+1}
$$

**Adam:**
$$
m_t = \beta_1 m_{t-1} + (1-\beta_1) g_t
$$
$$
v_t = \beta_2 v_{t-1} + (1-\beta_2) g_t^2
$$
$$
\hat{m}_t = \frac{m_t}{1-\beta_1^t}, \quad \hat{v}_t = \frac{v_t}{1-\beta_2^t}
$$
$$
\theta_{t+1} = \theta_t - \frac{\eta \hat{m}_t}{\sqrt{\hat{v}_t} + \epsilon}
$$

## Exercise

### Part 1: Implement the Optimizers

```python
import numpy as np

def rosenbrock(x, y, a=1, b=100):
    return (a - x)**2 + b * (y - x**2)**2

def rosenbrock_grad(x, y, a=1, b=100):
    dx = -2 * (a - x) - 4 * b * x * (y - x**2)
    dy = 2 * b * (y - x**2)
    return np.array([dx, dy])

class SGD:
    def __init__(self, lr=0.001):
        self.lr = lr
    
    def step(self, params, grads):
        return params - self.lr * grads

class Momentum:
    def __init__(self, lr=0.001, beta=0.9):
        self.lr = lr
        self.beta = beta
        self.v = None
    
    def step(self, params, grads):
        if self.v is None:
            self.v = np.zeros_like(params)
        self.v = self.beta * self.v + grads
        return params - self.lr * self.v

class Adam:
    def __init__(self, lr=0.001, beta1=0.9, beta2=0.999, eps=1e-8):
        self.lr = lr
        self.beta1 = beta1
        self.beta2 = beta2
        self.eps = eps
        self.m = None
        self.v = None
        self.t = 0
    
    def step(self, params, grads):
        if self.m is None:
            self.m = np.zeros_like(params)
            self.v = np.zeros_like(params)
        
        self.t += 1
        self.m = self.beta1 * self.m + (1 - self.beta1) * grads
        self.v = self.beta2 * self.v + (1 - self.beta2) * grads**2
        
        m_hat = self.m / (1 - self.beta1**self.t)
        v_hat = self.v / (1 - self.beta2**self.t)
        
        return params - self.lr * m_hat / (np.sqrt(v_hat) + self.eps)
```

### Part 2: Run Experiments

```python
def optimize(optimizer, start, n_steps=1000):
    params = np.array(start, dtype=float)
    history = [params.copy()]
    
    for _ in range(n_steps):
        grads = rosenbrock_grad(params[0], params[1])
        params = optimizer.step(params, grads)
        history.append(params.copy())
    
    return np.array(history)

# Starting point
start = [-2.0, 2.0]

# Run all optimizers
sgd_history = optimize(SGD(lr=0.0001), start)
momentum_history = optimize(Momentum(lr=0.0001), start)
adam_history = optimize(Adam(lr=0.01), start)
```

### Part 3: Analyze Results

Compare:
1. Convergence speed (steps to reach $f < 0.01$)
2. Final loss value
3. Trajectory smoothness

## Expected Results

| Optimizer | Steps to Converge | Final Loss |
|-----------|------------------|------------|
| SGD | >10000 | ~1.0 |
| Momentum | ~5000 | ~0.1 |
| Adam | ~1000 | <0.01 |

Adam typically converges fastest on this problem due to adaptive learning rates.

