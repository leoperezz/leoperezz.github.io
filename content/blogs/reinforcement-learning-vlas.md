Vision-Language-Action (VLA) models are quickly becoming the standard way to build general-purpose robot policies: a single neural system that can look at the world, read natural language instructions, and output low-level actions for a real robot arm [[1]]. In this article, we walk through what VLAs are, why flow matching has become the dominant way to generate actions, and why combining them with Reinforcement Learning (RL) is both powerful and surprisingly hard. We then outline a concrete research proposal—**FLOW-ACT (Flow Matching with Action-Critic Training)**—for training flow-based VLAs with an RL critic in a way that is actually deployable on real robots.

Along the way we will focus on **flow-based models** (e.g. $\pi_0$ [[1]], GR-3 [[2]], $\pi_{0.5}$ [[5]]) and discuss the main challenges that arise when we try to push these models beyond pure imitation into RL-based continual improvement.

# Preliminares

## What are Vision-Language-Action (VLA) models?

At a high level, a VLA model takes as input:

- one or more RGB images of the scene,
- a natural-language instruction (e.g. *“fold the towel neatly”*),
- robot state (joint angles, velocities, gripper state),

and outputs a sequence of robot actions—either continuous motor commands or discrete skills.

Most modern VLAs follow a similar pattern [[1]][[2]][[3]][[4]][[5]]:

- **Backbone**: a large pre-trained Vision-Language Model (VLM) that fuses images and text into a shared embedding space.
- **Action Expert / Head**: a transformer (or similar) that consumes these embeddings plus action tokens and outputs either:
  - **continuous actions** via a flow / diffusion model over $\mathbb{R}^d$, or
  - **discrete actions** / tokens that encode motion primitives or joint commands.

This modularity is key: the VLM handles semantics and spatial reasoning, while the action head specializes in robot control.

## Flow-based action generation

Flow matching [[1]][[3]][[5]][[11]] is a modern framework for training **iterative generative models** using deterministic flows instead of stochastic diffusion processes. Classical denoising diffusion models are based on stochastic differential equations (SDEs), where samples are progressively denoised by reversing a noisy Markov chain. In contrast, flow matching learns a time-dependent **velocity field** defining an ordinary differential equation (ODE) whose flow deterministically transports a simple base distribution (e.g., a Gaussian) into the data distribution. This leads to simpler training objectives, cheaper likelihood-free training, and faster inference, while often achieving competitive or better sample quality in practice.

Formally, let $p(x)$ be a data distribution on $\mathbb{R}^d$. Flow matching aims to learn parameters $\theta$ of a velocity field
$$
v_\theta(t, x) : [0, 1] \times \mathbb{R}^d \to \mathbb{R}^d
$$
such that the induced flow $\psi_\theta(t, x)$, defined as the solution of the ODE
$$
\frac{d}{dt}\,\psi_\theta(t, x) = v_\theta\bigl(t, \psi_\theta(t, x)\bigr),
$$
maps a simple base distribution at $t = 0$ (typically a standard Gaussian) into the target distribution $p(x)$ at $t = 1$. In other words, drawing $x^0 \sim \mathcal{N}(0, I_d)$ and integrating the ODE from $t = 0$ to $t = 1$ produces a sample $x^1 = \psi_\theta(1, x^0)$ that should follow $p(x)$.

In this article we focus on the simplest variant of flow matching based on linear paths and uniform time sampling. Given independently drawn pairs $x^0 \sim \mathcal{N}(0, I_d)$, $x^1 \sim p(x)$, and a time $t \sim \text{Unif}([0, 1])$, we define the linear interpolation
$$
x^t = (1 - t)\,x^0 + t\,x^1.
$$
The flow matching objective trains the velocity field to point, on average, from $x^0$ toward $x^1$ along this straight-line path:
$$
\min_\theta \mathbb{E}_{x^0, x^1, t}\bigl[\|v_\theta(t, x^t) - (x^1 - x^0)\|_2^2\bigr].
$$
At optimum, the learned velocity field defines a flow that transports the base Gaussian into the data distribution. Sampling then amounts to numerically integrating the ODE starting from Gaussian noise; in practice, simple solvers such as Euler integration with a small number of steps are often sufficient.

For VLAs and continuous-control policies, we apply this construction in **action space**. Let $\mathcal{A} = \mathbb{R}^d$ denote the space of continuous actions (e.g., joint deltas or Cartesian displacements). We consider a state- and time-dependent velocity field
$$
v_\theta(t, s, x) : [0, 1] \times \mathcal{S} \times \mathbb{R}^d \to \mathbb{R}^d,
$$
where $s \in \mathcal{S}$ is the current robot state or observation and $x \in \mathbb{R}^d$ is a point in action space. Given demonstrations $(s, a)$ drawn from a dataset $\mathcal{D}$, we define $x^1 = a$, sample $x^0 \sim \mathcal{N}(0, I_d)$ and $t \sim \text{Unif}([0, 1])$, and interpolate
$$
x^t = (1 - t)\,x^0 + t\,x^1.
$$
The basic flow-matching behavioral cloning objective is then
$$
L_{\text{Flow}}(\theta)
= \mathbb{E}_{\substack{s, a = x^1 \sim \mathcal{D},\\ x^0 \sim \mathcal{N}(0, I_d),\\ t \sim \text{Unif}([0, 1])}}
\Bigl[\bigl\|v_\theta(t, s, x^t) - (x^1 - x^0)\bigr\|_2^2\Bigr].
$$

The learned state-dependent velocity field induces a state-dependent flow $\psi_\theta(t, s, x)$, which we can view as a **policy**. For a fixed state $s$ and noise $z \sim \mathcal{N}(0, I_d)$, integrating the ODE from $t = 0$ to $t = 1$ with initial condition $x^0 = z$ yields an action
$$
a = \mu_\theta(s, z) \coloneqq \psi_\theta(1, s, z).
$$
Here, $\mu_\theta : \mathcal{S} \times \mathbb{R}^d \to \mathcal{A}$ is a deterministic mapping, but because $z$ is random we obtain an induced stochastic policy
$$
\pi_\theta(a \mid s) \quad \text{defined by} \quad a = \mu_\theta(s, z), \; z \sim \mathcal{N}(0, I_d).
$$
In the rest of the article we will refer to both the deterministic flow $\mu_\theta$ and the induced stochastic policy $\pi_\theta$ simply as the **flow policy**.


# Reinforcement learning in VLAs

Most deployed VLA systems today are trained with **Imitation Learning (IL)** on demonstration datasets: humans teleoperate the robot or provide kinesthetic demonstrations, and the model simply learns to mimic them [[6]][[7]]. However, in **long-horizon, dexterous tasks** (cloth folding, deformable object manipulation, bimanual skills), demonstrations can be:

- noisy or inconsistent,
- suboptimal or partially failing,
- sparse in *recovery behaviors* (how to fix mistakes).

This leads to a familiar problem: the VLA can imitate “average” behavior but struggles when it needs to recover from errors or optimize success rates over time [[7]][[8]].

**Why bring in Reinforcement Learning?**

Reinforcement Learning provides a natural way to go beyond merely imitating an expert policy: it can learn—directly from experience—which trajectories are good or bad, use that signal to improve success rates, and keep improving autonomously over time in the real world.

- learn directly from **trial-and-error** in the real world,
- incorporate **sparse success signals** (task completion),
- leverage **human corrections** as high-value signals,
- gradually improve beyond the quality of the demonstration dataset [[8]][[9]][[10]][[11]][[14]].

But standard RL methods like PPO [[12]][[13]] assume that the policy is a *simple distribution* $\pi_\theta(\mathbf{a}_t|\mathbf{s}_t)$ (e.g. a Gaussian or categorical). Flow-based VLAs instead define a **generative process** over actions via an ODE-like integration. Adapting policy gradients or value-based methods to this setting is non-trivial and often computationally heavy [[9]][[11]][[14]].

So, in the following sections, we will look at how this has been addressed across different paper proposals. We focus exclusively on papers that use Flow Matching to compute actions, as these represent the current state of the art.


## The problem with flow matching-based policies

As previously mentioned, PPO typically assumes that the policy is a distribution $\pi_\theta(\mathbf{a}_t|\mathbf{s}_t)$; however, the actual flow matching process consists of learning a vector field that transports samples from an initial distribution $p_0$ to a final distribution $p_1$. The problem with this approach is that an explicit distribution over actions cannot be obtained directly, making it difficult to apply classical RL methods based on policies or standard Q-functions.

For this reason, we will specifically discuss three key papers for this type of case: $\pi^{*}_{0.6}$ [[9]], GR-RL [[8]], and Flow Q-Learning [[15]] — how they approach this problem from a general perspective, and what their weaknesses or areas for improvement are.

But first, let us clearly understand why traditional RL does not work with these types of policies.

Essentially, we need to understand the flow matching inference process. During inference, we sample from a simple distribution $p_0$ using a velocity field represented by a neural network $u_{\theta}(x,t)$, but we do this over multiple steps — that is, we integrate over time, as illustrated in the animation below.

```flow-animation
```

The issue is that applying algorithms such as PPO would require backpropagating through time, which can be extremely unstable during training [[15]] [[8]].

The first intuition for applying actor-critic methods would be: if we have a critic $Q(s_t,a_t)$, then we should logically steer the flow matching process in the direction that maximizes this function; however, the difficulty lies in the actions $a_t$. As previously noted, we would need to propagate $\nabla_{a^{\tau}_t}Q(s_t,a_t^{\tau})$ through time, which makes training extremely unstable. We will now discuss the different approaches taken in the above papers to address this challenge.

> **Note:** The Adjoint Matching paper [[16]] was recently published and addresses this problem from a different angle — it does manage to effectively propagate the gradient of the final action $Q(s_t,a_t)$ using a base model. It is a very interesting paper; unfortunately, I did not have time to review it in detail. I will update this article soon.


## Problem formulation: RL for flow-based robotic manipulation

We model robotic manipulation as a finite-horizon Markov Decision Process:

$$
\mathcal{M} = (\mathcal{S}, \mathcal{A}, \mathcal{P}, \mathcal{R}, \gamma),
$$

where:

- $\mathbf{s}_t \in \mathcal{S}$ is a multimodal observation (images, language, proprioception).
- $\mathbf{a}_t \in \mathcal{A} \subset \mathbb{R}^d$ is a continuous action (joint deltas, gripper).
- $\mathcal{P}$ is the unknown environment dynamics.
- $\gamma \in [0,1]$ is the discount factor.

We assume a **sparse reward** structure with a per-step cost:

$$
r_{\text{raw}}(\mathbf{s}_t, \mathbf{a}_t) =
\begin{cases}
0 & \text{if } t = T \text{ and task succeeds} \\
-C_{\text{fail}} & \text{if } t = T \text{ and task fails} \\
-1 & \text{otherwise (per-step cost),}
\end{cases}
$$

where $T$ is the horizon and $C_{\text{fail}} > 0$ is a failure penalty.

To stabilize learning, we normalize all rewards into $(-1, 0]$:

$$
r(\mathbf{s}_t, \mathbf{a}_t) = \frac{r_{\text{raw}}(\mathbf{s}_t, \mathbf{a}_t)}{C_{\text{fail}} + T}.
$$

The (normalized) return from time $t$ is:

$$
G_t = \sum_{k=t}^{T} \gamma^{k-t} r(\mathbf{s}_k, \mathbf{a}_k),
$$

so successful trajectories end up with returns near $0$, while failures are close to $-1$.

**Distributional critic via return discretization**

Instead of regressing a single scalar $Q$-value, we use a **distributional critic** that predicts a categorical distribution over return bins [[8]][[9]]. We discretize the range $[-1, 0]$ into $B$ uniformly spaced bins:

$$
b_i = -1 + \frac{i-1}{B-1}, \quad i \in \{1,\dots,B\}.
$$

Given a target return $G_t \in [-1,0]$, we convert it into a **two-hot** target distribution $\mathbf{y}_t \in \Delta^{B-1}$:

$$
y_{t,i} = \frac{b_{i+1} - G_t}{b_{i+1} - b_i}, \quad
y_{t,i+1} = \frac{G_t - b_i}{b_{i+1} - b_i},
$$

with $y_{t,j} = 0$ for $j \notin \{i,i+1\}$. This gives a smooth target over bins that still encodes the exact return.

---

## Architecture: shared backbone, distributional critic and flow actor

The **FLOW-ACT** architecture uses a single large model with three main components:

1. **VLA backbone** $E_\omega(\mathbf{o}_t)$  
   Encodes images, language, and proprioception into a latent embedding $z_t \in \mathbb{R}^{d_z}$. Typically:
   - a pre-trained VLM (e.g. SigLIP, PaliGemma) for images + text,
   - separate encoders for proprioceptive state,
   - a projection layer to align all modalities into a common space before fusion.

2. **Distributional Q-function head** $Q_\phi(z_t, \mathbf{a}_t)$  
   A lightweight MLP that outputs logits over $B$ return bins:
   $$
   \mathbf{p}_t = \text{Softmax}\big(Q_\phi(E_\omega(\mathbf{o}_t), \mathbf{a}_t)\big),
   $$
   and the expected value is:
   $$
   \bar{Q}_\phi(\mathbf{o}_t, \mathbf{a}_t) = \sum_{i=1}^{B} p_{\phi,i}(b_i|\mathbf{o}_t,\mathbf{a}_t)\, b_i.
   $$

3. **Flow matching action head** $\mathbf{v}_\theta(\cdot)$  
   A continuous normalizing flow that implements a **vector field**:
   $$
   \mathbf{v}_\theta : [0,1] \times \mathcal{A} \times \mathbb{R}^{d_z} \rightarrow \mathcal{A},
   $$
   applied to action tokens in an attention-based “action expert” that lets all action tokens attend to each other.

Both the actor and critic share the backbone $E_\omega$, so gradients from both objectives refine the same multimodal representation.

**Critic training objective**

We train the critic with cross-entropy over discretized Monte Carlo returns. For trajectories $\tau \sim \mathcal{D}$ (initially demonstrations, later a replay buffer), the loss is:

$$
\mathcal{L}_{\text{Critic}}(\phi, \omega)
= \mathbb{E}_{\tau \sim \mathcal{D}}
\left[
\sum_{t=0}^{T}
\text{CrossEntropy}\big(
Q_\phi(E_\omega(\mathbf{o}_t), \mathbf{a}_t),
\hat{G}_t(\tau)
\big)
\right],
$$

where $\hat{G}_t$ is the two-hot encoding of the return $G_t$.

---

## Clean action projection: keeping the critic in-distribution

One subtle but crucial issue: the critic is trained **only** on *clean* demonstration actions $\mathbf{a}_t$, but the flow actor operates on **noisy intermediate actions** $\mathbf{a}_t^\tau$ for $\tau \in (0,1)$ during training.

If we simply evaluate $Q_\phi(\mathbf{o}_t, \mathbf{a}_t^\tau)$ and backpropagate through it, we are asking the critic to generalize far off its training distribution—which often yields unstable and uninformative gradients.

To fix this, we use a **clean action projection** based on the geometry of rectified flow matching. Under the linear-Gaussian path:

$$
q(\mathbf{a}_t^\tau|\mathbf{a}_t) = \mathcal{N}(\tau \mathbf{a}_t, (1-\tau)\mathbf{I}),
$$

we can recover a clean action estimate from a noisy sample using the learned vector field:

$$
\tilde{\mathbf{a}}_t(\mathbf{a}_t^\tau, \tau)
= \mathbf{a}_t^\tau + (1-\tau)\, \mathbf{v}_\theta(\mathbf{a}_t^\tau, \mathbf{o}_t).
$$

If $\mathbf{v}_\theta$ perfectly matches the optimal transport vector field, then $\tilde{\mathbf{a}}_t = \mathbf{a}_t$. In practice, as training progresses, this becomes a high-quality estimate of the underlying clean action.

We then:

1. compute $\tilde{\mathbf{a}}_t$ from $\mathbf{a}_t^\tau$,
2. feed $\tilde{\mathbf{a}}_t$ into the critic,
3. backpropagate *through the projection* into the vector field, while treating the critic weights as frozen.

This ensures that:

- the critic is always queried on in-distribution inputs,
- yet its gradients still shape the flow dynamics at noisy states.

---

## Critic-guided flow matching (FLOW-ACT)

We now describe **FLOW-ACT**: a way to steer the flow field toward higher-value actions using gradients from the distributional critic, without turning the policy into a brittle RL-only system.

### Training steps for one batch

For each sample $(\mathbf{o}_t, \mathbf{a}_t)$ from the replay buffer $\mathcal{D}$:

1. **Sample flow time and noise**  
   $$
   \tau \sim \text{Beta}(\alpha, \beta_{\text{dist}}), \quad
   \epsilon \sim \mathcal{N}(\mathbf{0}, \mathbf{I}).
   $$

2. **Construct noisy action**  
   $$
   \mathbf{a}_t^\tau = \tau \mathbf{a}_t + (1-\tau)\epsilon.
   $$

3. **Project to clean action estimate**  
   $$
   \tilde{\mathbf{a}}_t =
   \mathbf{a}_t^\tau + (1-\tau)\, \mathbf{v}_\theta(\mathbf{a}_t^\tau, \mathbf{o}_t).
   $$

4. **Evaluate critic on the projected action**  
   Compute the expected value:
   $$
   \bar{Q}_\phi(\mathbf{o}_t, \tilde{\mathbf{a}}_t)
   $$
   using the distributional critic.

5. **Compute critic gradient in action space**  
   With critic parameters frozen:
   $$
   \mathbf{g}_t =
   \nabla_{\tilde{\mathbf{a}}_t} \bar{Q}_\phi(\mathbf{o}_t, \tilde{\mathbf{a}}_t).
   $$

6. **Build a critic-guided target vector field**  
   The standard flow matching target is:
   $$
   \mathbf{u}(\mathbf{a}_t^\tau|\mathbf{a}_t) = \mathbf{a}_t - \epsilon.
   $$
   We augment it with critic guidance:
   $$
   \tilde{\mathbf{u}}(\mathbf{a}_t^\tau|\mathbf{a}_t,\mathbf{o}_t)
   = \mathbf{u}(\mathbf{a}_t^\tau|\mathbf{a}_t) + \lambda\, \mathbf{g}_t,
   $$
   where $\lambda > 0$ controls how strongly the critic pulls the flow toward high-value actions.

### Actor loss with proximal regularization

We train the actor to match this guided field but **regularize** it not to drift too far from the original flow-matching target.

Guided matching loss:

$$
\mathcal{L}_{\text{Actor}}(\theta, \omega)
= \mathbb{E}
\left[
\big\|
\mathbf{v}_\theta(\mathbf{a}_t^\tau, E_\omega(\mathbf{o}_t))
- \text{stopgrad}\big(\tilde{\mathbf{u}}(\mathbf{a}_t^\tau|\mathbf{a}_t,\mathbf{o}_t)\big)
\big\|^2
\right].
$$

Proximal regularization:

$$
\mathcal{L}_{\text{prox}}(\theta, \omega)
= \eta \cdot \mathbb{E}
\left[
\big\|
\mathbf{v}_\theta(\mathbf{a}_t^\tau, E_\omega(\mathbf{o}_t))
- \mathbf{u}(\mathbf{a}_t^\tau|\mathbf{a}_t)
\big\|^2
\right],
$$

with $\eta > 0$ as an anchoring strength. The total actor loss is:

$$
\mathcal{L}_{\text{Actor}}^{\text{Total}}(\theta, \omega)
= \mathcal{L}_{\text{Actor}}(\theta, \omega)
 + \mathcal{L}_{\text{prox}}(\theta, \omega).
$$

The `stopgrad` operator prevents gradients from flowing into the critic, treating it as a static energy landscape that shapes the flow.

### How human corrections and failures enter the picture

Because the critic is trained on a **replay buffer** that mixes:

- demonstrations,
- autonomous rollouts,
- successful episodes,
- failures (near $-1$ returns),
- and **human corrections** (manual interventions),

its return distribution becomes highly informative in exactly the states where the policy struggles. When a human intervenes and recovers a difficult state, the resulting trajectories have higher returns, which sharpen the critic’s gradients in those regions. Through the clean-action projection and critic-guided vector field, these gradients *directly* pull the flow toward recovery behaviors.


## References

1. [Black, Kevin, et al. *"$\pi$0: A vision-language-action flow model for general robot control".* arXiv preprint arXiv:2410.24164, 2025.](https://doi.org/10.48550/arXiv.2410.24164)
2. [Cheang, Chong, et al. *"GR-3 Technical Report".* arXiv preprint arXiv:2410.15570, 2024.](https://doi.org/10.48550/arXiv.2410.15570)
3. [Pertsch, Karl, et al. *"FAST: Efficient Action Tokenization for Vision-Language-Action Models".* arXiv preprint arXiv:2501.09747, 2025.](https://doi.org/10.48550/arXiv.2501.09747)
4. [Kim, Moo Jin, et al. *"OpenVLA: An open-source vision-language-action model".* arXiv preprint arXiv:2406.09246, 2024.](https://doi.org/10.48550/arXiv.2406.09246)
5. [Physical Intelligence, et al. *"$\pi$0.5: A vision-language-action model with open-world generalization".* arXiv preprint arXiv:2504.16054, 2025.](https://doi.org/10.48550/arXiv.2504.16054)
6. [Zhao, Tony Z., and Vikash Kumar, Sergey Levine, Chelsea Finn. *"Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware".* arXiv preprint arXiv:2304.13705, 2023.](https://arxiv.org/abs/2304.13705)
7. [Belkhale, Suneel, Yuchen Cui, and Dorsa Sadigh. *"Data Quality in Imitation Learning".* arXiv preprint arXiv:2306.02437, 2023.](https://arxiv.org/abs/2306.02437)
8. [Li, Yunfei, et al. *"GR-RL: Going Dexterous and Precise for Long-Horizon Robotic Manipulation".* arXiv preprint arXiv:2512.01801, 2025.](https://arxiv.org/abs/2512.01801)
9. [Physical Intelligence, et al. *"$\pi^{*}_{0.6}$: a VLA That Learns From Experience".* arXiv preprint arXiv:2511.14759, 2025.](https://arxiv.org/abs/2511.14759)
10. [Zhai, Shaopeng, et al. *"A Vision-Language-Action-Critic Model for Robotic Real-World Reinforcement Learning".* arXiv preprint arXiv:2509.15937, 2025.](https://arxiv.org/abs/2509.15937)
11. [Chen, Kang, et al. *"$\pi_\texttt{RL}$: Online RL Fine-tuning for Flow-based Vision-Language-Action Models".* arXiv preprint arXiv:2510.25889, 2025.](https://arxiv.org/abs/2510.25889)
12. [Murphy, Kevin. *"Reinforcement Learning: An Overview".* arXiv preprint arXiv:2412.05265, 2025.](https://arxiv.org/abs/2412.05265)
13. [Schulman, John, et al. *"Proximal Policy Optimization Algorithms".* arXiv preprint arXiv:1707.06347, 2017.](https://arxiv.org/abs/1707.06347)
14. [Lei, Kun, et al. *"RL-100: Performant Robotic Manipulation with Real-World Reinforcement Learning".* arXiv preprint arXiv:2510.14830, 2025.](https://arxiv.org/abs/2510.14830)
15. [Park, Seohong, Qiyang Li, and Sergey Levine. *"Flow Q-Learning".* arXiv preprint arXiv:2502.02538, 2025.](https://doi.org/10.48550/arXiv.2502.02538)
16. [Li, Qiyang, and Sergey Levine. *"Q-learning with Adjoint Matching".* arXiv preprint arXiv:2601.14234, 2026.](https://doi.org/10.48550/arXiv.2601.14234)
