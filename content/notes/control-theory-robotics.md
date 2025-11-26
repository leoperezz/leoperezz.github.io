# Control Theory for Robotics

Fundamental concepts of control theory applied to robotic systems.

## State-Space Representation

A dynamical system in state-space form:

$$
\dot{\mathbf{x}} = A\mathbf{x} + B\mathbf{u}
$$
$$
\mathbf{y} = C\mathbf{x} + D\mathbf{u}
$$

where:
- $\mathbf{x} \in \mathbb{R}^n$ is the state vector
- $\mathbf{u} \in \mathbb{R}^m$ is the control input
- $\mathbf{y} \in \mathbb{R}^p$ is the output

## Stability Analysis

### Lyapunov Stability

A system is stable if there exists a Lyapunov function $V(\mathbf{x})$ such that:

1. $V(\mathbf{x}) > 0$ for $\mathbf{x} \neq 0$
2. $V(0) = 0$
3. $\dot{V}(\mathbf{x}) \leq 0$

## PID Control

The classic PID controller:

$$
u(t) = K_p e(t) + K_i \int_0^t e(\tau) d\tau + K_d \frac{de(t)}{dt}
$$

```python
class PIDController:
    def __init__(self, Kp, Ki, Kd):
        self.Kp = Kp
        self.Ki = Ki
        self.Kd = Kd
        self.integral = 0
        self.prev_error = 0
    
    def compute(self, error, dt):
        self.integral += error * dt
        derivative = (error - self.prev_error) / dt
        self.prev_error = error
        
        return (self.Kp * error + 
                self.Ki * self.integral + 
                self.Kd * derivative)
```

## LQR: Linear Quadratic Regulator

Optimal control for linear systems with quadratic cost:

$$
J = \int_0^\infty (\mathbf{x}^T Q \mathbf{x} + \mathbf{u}^T R \mathbf{u}) dt
$$

The optimal control law is $\mathbf{u} = -K\mathbf{x}$ where $K$ solves the Riccati equation.

