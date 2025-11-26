# Implementing a Simple MDP Solver

This exercise guides you through implementing Value Iteration for solving Markov Decision Processes.

## Problem Statement

Implement value iteration to solve a simple gridworld MDP.

## Background

A Markov Decision Process is defined by:
- State space $\mathcal{S}$
- Action space $\mathcal{A}$
- Transition probabilities $P(s'|s,a)$
- Reward function $R(s,a,s')$
- Discount factor $\gamma \in [0,1)$

### Bellman Optimality Equation

$$
V^*(s) = \max_a \sum_{s'} P(s'|s,a)[R(s,a,s') + \gamma V^*(s')]
$$

## Exercise

### Part 1: Define the MDP

Create a 4x4 gridworld where:
- The agent starts at (0,0)
- Goal is at (3,3) with reward +1
- There's a pit at (1,1) with reward -1
- All other transitions have reward 0

### Part 2: Implement Value Iteration

```python
import numpy as np

class GridWorldMDP:
    def __init__(self, size=4, gamma=0.9):
        self.size = size
        self.gamma = gamma
        self.actions = ['up', 'down', 'left', 'right']
        self.goal = (3, 3)
        self.pit = (1, 1)
    
    def get_next_state(self, state, action):
        """Return next state given current state and action."""
        i, j = state
        if action == 'up':
            next_state = (max(0, i-1), j)
        elif action == 'down':
            next_state = (min(self.size-1, i+1), j)
        elif action == 'left':
            next_state = (i, max(0, j-1))
        elif action == 'right':
            next_state = (i, min(self.size-1, j+1))
        return next_state
    
    def get_reward(self, state, action, next_state):
        """Return reward for transition."""
        if next_state == self.goal:
            return 1.0
        elif next_state == self.pit:
            return -1.0
        return 0.0

def value_iteration(mdp, epsilon=1e-6):
    """
    Implement value iteration algorithm.
    
    Args:
        mdp: The MDP to solve
        epsilon: Convergence threshold
    
    Returns:
        V: Optimal value function
        policy: Optimal policy
    """
    V = np.zeros((mdp.size, mdp.size))
    
    while True:
        delta = 0
        for i in range(mdp.size):
            for j in range(mdp.size):
                state = (i, j)
                if state == mdp.goal:
                    continue
                
                v = V[i, j]
                # TODO: Compute max over actions
                values = []
                for action in mdp.actions:
                    next_state = mdp.get_next_state(state, action)
                    r = mdp.get_reward(state, action, next_state)
                    values.append(r + mdp.gamma * V[next_state])
                
                V[i, j] = max(values)
                delta = max(delta, abs(v - V[i, j]))
        
        if delta < epsilon:
            break
    
    # Extract policy
    policy = {}
    for i in range(mdp.size):
        for j in range(mdp.size):
            state = (i, j)
            best_action = None
            best_value = float('-inf')
            for action in mdp.actions:
                next_state = mdp.get_next_state(state, action)
                r = mdp.get_reward(state, action, next_state)
                value = r + mdp.gamma * V[next_state]
                if value > best_value:
                    best_value = value
                    best_action = action
            policy[state] = best_action
    
    return V, policy
```

### Part 3: Test Your Solution

Run value iteration and verify:
1. The value at the goal should be 0 (terminal state)
2. States closer to the goal should have higher values
3. The policy should navigate around the pit

## Expected Output

```
Value Function:
[[0.59 0.66 0.73 0.81]
 [0.53 -1.0 0.66 0.90]
 [0.48 0.53 0.73 1.00]
 [0.43 0.48 0.81 0.00]]

Policy:
(0,0): right
(0,1): right
...
```

