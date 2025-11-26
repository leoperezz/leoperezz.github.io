# PID Controller Tuning Challenge

Tune a PID controller for a second-order system to achieve desired performance specifications.

## Problem Statement

Given a mass-spring-damper system:

$$
m\ddot{x} + c\dot{x} + kx = F
$$

with $m = 1$ kg, $c = 0.5$ N·s/m, $k = 2$ N/m, design a PID controller to:
1. Track a step reference with <5% overshoot
2. Achieve settling time < 3 seconds
3. Eliminate steady-state error

## Background

### Transfer Function

The plant transfer function is:

$$
G(s) = \frac{1}{ms^2 + cs + k} = \frac{1}{s^2 + 0.5s + 2}
$$

### PID Controller

$$
C(s) = K_p + \frac{K_i}{s} + K_d s
$$

The closed-loop transfer function:

$$
T(s) = \frac{C(s)G(s)}{1 + C(s)G(s)}
$$

## Exercise

### Part 1: Simulate the Open-Loop System

```python
import numpy as np
from scipy.integrate import odeint
import matplotlib.pyplot as plt

class MassSpringDamper:
    def __init__(self, m=1.0, c=0.5, k=2.0):
        self.m = m
        self.c = c
        self.k = k
    
    def dynamics(self, state, t, force):
        x, v = state
        a = (force - self.c * v - self.k * x) / self.m
        return [v, a]
    
    def simulate(self, x0, v0, force_func, t_span):
        def dynamics_wrapper(state, t):
            return self.dynamics(state, t, force_func(t))
        
        t = np.linspace(0, t_span, 1000)
        solution = odeint(dynamics_wrapper, [x0, v0], t)
        return t, solution

# Open-loop step response
system = MassSpringDamper()
t, response = system.simulate(0, 0, lambda t: 1.0, 10)
```

### Part 2: Implement PID Controller

```python
class PIDController:
    def __init__(self, Kp, Ki, Kd, dt=0.01):
        self.Kp = Kp
        self.Ki = Ki
        self.Kd = Kd
        self.dt = dt
        self.integral = 0
        self.prev_error = 0
    
    def compute(self, setpoint, measurement):
        error = setpoint - measurement
        
        # Proportional term
        P = self.Kp * error
        
        # Integral term (with anti-windup)
        self.integral += error * self.dt
        self.integral = np.clip(self.integral, -10, 10)
        I = self.Ki * self.integral
        
        # Derivative term
        derivative = (error - self.prev_error) / self.dt
        D = self.Kd * derivative
        self.prev_error = error
        
        return P + I + D

def simulate_closed_loop(Kp, Ki, Kd, setpoint=1.0, duration=10.0):
    system = MassSpringDamper()
    controller = PIDController(Kp, Ki, Kd)
    
    dt = 0.01
    t = np.arange(0, duration, dt)
    x = np.zeros_like(t)
    v = 0
    
    for i in range(1, len(t)):
        force = controller.compute(setpoint, x[i-1])
        state = odeint(
            lambda s, t: system.dynamics(s, t, force),
            [x[i-1], v],
            [0, dt]
        )[-1]
        x[i], v = state
    
    return t, x
```

### Part 3: Tune the Controller

Try these methods:
1. **Ziegler-Nichols**: Find ultimate gain $K_u$ and period $T_u$
2. **Manual tuning**: Start with P, add D, then I
3. **Optimization**: Minimize a cost function

| Method | $K_p$ | $K_i$ | $K_d$ |
|--------|-------|-------|-------|
| Initial guess | 1.0 | 0.1 | 0.5 |
| After tuning | ? | ? | ? |

## Performance Metrics

```python
def analyze_response(t, y, setpoint=1.0):
    # Overshoot
    overshoot = (np.max(y) - setpoint) / setpoint * 100
    
    # Settling time (2% criterion)
    settled = np.abs(y - setpoint) < 0.02 * setpoint
    if np.any(settled):
        settling_time = t[np.argmax(settled)]
    else:
        settling_time = np.inf
    
    # Steady-state error
    ss_error = abs(y[-1] - setpoint)
    
    return {
        'overshoot': overshoot,
        'settling_time': settling_time,
        'ss_error': ss_error
    }
```

## Solution Hints

Good starting values for this system:
- $K_p \approx 10$ for fast response
- $K_i \approx 2$ to eliminate steady-state error
- $K_d \approx 3$ to reduce overshoot

Final tuned values should achieve all specifications!

