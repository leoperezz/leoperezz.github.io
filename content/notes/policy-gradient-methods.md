# Reinforcement Learning: Policy Gradient Methods

Notes on policy gradient methods for reinforcement learning.

## Introduction

Policy gradient methods directly optimize the policy $\pi_\theta$ by computing gradients of expected return.

## The Policy Gradient Theorem

The gradient of the expected return is:

$$
\nabla_\theta J(\theta) = \mathbb{E}_{\pi_\theta}\left[\sum_{t=0}^T \nabla_\theta \log \pi_\theta(a_t|s_t) \cdot G_t\right]
$$

where $G_t = \sum_{k=t}^T \gamma^{k-t} r_k$ is the return from time $t$.

## REINFORCE Algorithm

The simplest policy gradient algorithm:

```python
def reinforce(env, policy, optimizer, num_episodes=1000):
    for episode in range(num_episodes):
        states, actions, rewards = collect_trajectory(env, policy)
        returns = compute_returns(rewards, gamma=0.99)
        
        loss = 0
        for t in range(len(states)):
            log_prob = policy.log_prob(states[t], actions[t])
            loss -= log_prob * returns[t]
        
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
```

## Variance Reduction

### Baseline Subtraction

Use a baseline $b(s)$ to reduce variance:

$$
\nabla_\theta J(\theta) = \mathbb{E}\left[\nabla_\theta \log \pi_\theta(a|s) \cdot (G_t - b(s_t))\right]
$$

### Actor-Critic Methods

Use a learned value function as baseline:

$$
\nabla_\theta J(\theta) = \mathbb{E}\left[\nabla_\theta \log \pi_\theta(a|s) \cdot A^\pi(s, a)\right]
$$

where $A^\pi(s,a) = Q^\pi(s,a) - V^\pi(s)$ is the advantage function.

## PPO: Proximal Policy Optimization

PPO clips the policy ratio to prevent large updates:

$$
L^{CLIP}(\theta) = \mathbb{E}\left[\min(r_t(\theta)A_t, \text{clip}(r_t(\theta), 1-\epsilon, 1+\epsilon)A_t)\right]
$$

where $r_t(\theta) = \frac{\pi_\theta(a_t|s_t)}{\pi_{\theta_{old}}(a_t|s_t)}$.

