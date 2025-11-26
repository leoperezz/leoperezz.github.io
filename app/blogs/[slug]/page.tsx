import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { CopyBlogButton } from "@/components/copy-blog-button"

interface BlogPageProps {
  params: Promise<{ slug: string }>
}

const sampleContent = `# Understanding the Mathematics of Neural Networks

This post explores the fundamental mathematical concepts behind neural networks, from basic linear algebra to advanced optimization techniques.

## Introduction

Neural networks have revolutionized machine learning, but at their core, they're built on elegant mathematical principles. In this article, we'll dive deep into the mathematics that make deep learning possible.

> "Mathematics is the language in which God has written the universe." — Galileo Galilei

---

## The Building Blocks

### Linear Transformations

At each layer, a neural network performs a linear transformation followed by a non-linear activation. The basic operation is:

$$
\\mathbf{z} = \\mathbf{W}\\mathbf{x} + \\mathbf{b}
$$

Where:
- $\\mathbf{W} \\in \\mathbb{R}^{n \\times m}$ is the weight matrix
- $\\mathbf{x} \\in \\mathbb{R}^{m}$ is the input vector
- $\\mathbf{b} \\in \\mathbb{R}^{n}$ is the bias vector

### Activation Functions

Common activation functions include:

1. **ReLU**: $f(x) = \\max(0, x)$
2. **Sigmoid**: $\\sigma(x) = \\frac{1}{1 + e^{-x}}$
3. **Tanh**: $\\tanh(x) = \\frac{e^x - e^{-x}}{e^x + e^{-x}}$
4. **Softmax**: $\\text{softmax}(x_i) = \\frac{e^{x_i}}{\\sum_j e^{x_j}}$

---

## Gradient Descent and Backpropagation

The learning process relies on minimizing a loss function $\\mathcal{L}$ through gradient descent:

$$
\\theta_{t+1} = \\theta_t - \\eta \\nabla_{\\theta} \\mathcal{L}(\\theta_t)
$$

The gradient $\\nabla \\mathcal{L}$ is computed using the **chain rule**:

$$
\\frac{\\partial \\mathcal{L}}{\\partial w_{ij}} = \\frac{\\partial \\mathcal{L}}{\\partial a_j} \\cdot \\frac{\\partial a_j}{\\partial z_j} \\cdot \\frac{\\partial z_j}{\\partial w_{ij}}
$$

### The Loss Landscape

For a typical neural network, we optimize over a complex, high-dimensional loss surface:

$$
\\nabla \\mathcal{L}^p = \\left( \\frac{\\partial \\mathcal{L}}{\\partial \\theta_1}, \\frac{\\partial \\mathcal{L}}{\\partial \\theta_2}, \\ldots, \\frac{\\partial \\mathcal{L}}{\\partial \\theta_n} \\right)
$$

---

## Reinforcement Learning Demos

Here are some reinforcement learning agents trained using PPO:

### CartPole

![CartPole balancing agent](https://res.cloudinary.com/dtpiuha91/video/upload/v1742525560/cartpole_f7bjc6.mp4)

### LunarLander

![Lunar Lander autonomous landing](https://res.cloudinary.com/dtpiuha91/video/upload/v1742525561/lunarlander_qre1sy.mp4)

### BipedalWalker

![Bipedal Walker learning to walk](https://res.cloudinary.com/dtpiuha91/video/upload/v1742525563/bipedalwalker_dhtlzz.mp4)

### CarRacing

![Car Racing agent navigating track](https://res.cloudinary.com/dtpiuha91/video/upload/v1742525567/carracing_ftrdav.mp4)

---

## PPO Loss Function Analysis

The following image shows the loss function behavior as a function of the probability ratio:

![Loss Function vs Ratio in function of the advantage](https://res.cloudinary.com/dtpiuha91/image/upload/v1742526789/1_vtqzsk.png)

---

## Code Example

Here's a simple implementation of a neural network layer in Python:

\`\`\`python
import numpy as np

class DenseLayer:
    def __init__(self, input_dim, output_dim):
        self.W = np.random.randn(input_dim, output_dim) * 0.01
        self.b = np.zeros((1, output_dim))
    
    def forward(self, x):
        self.x = x
        self.z = np.dot(x, self.W) + self.b
        return self.z
    
    def backward(self, dz, learning_rate=0.01):
        m = self.x.shape[0]
        dW = np.dot(self.x.T, dz) / m
        db = np.sum(dz, axis=0, keepdims=True) / m
        dx = np.dot(dz, self.W.T)
        
        self.W -= learning_rate * dW
        self.b -= learning_rate * db
        return dx
\`\`\`

And here's an equivalent implementation in TypeScript:

\`\`\`typescript
interface Layer {
  W: number[][];
  b: number[];
  forward(x: number[][]): number[][];
  backward(dz: number[][], lr: number): number[][];
}

class DenseLayer implements Layer {
  W: number[][];
  b: number[];
  private x: number[][] = [];

  constructor(inputDim: number, outputDim: number) {
    this.W = Array.from({ length: inputDim }, () =>
      Array.from({ length: outputDim }, () => Math.random() * 0.01)
    );
    this.b = Array(outputDim).fill(0);
  }

  forward(x: number[][]): number[][] {
    this.x = x;
    return this.matmul(x, this.W).map((row) =>
      row.map((val, j) => val + this.b[j])
    );
  }
}
\`\`\`

---

## Network Architecture Visualization

\`\`\`mermaid
graph LR
    A[Input Layer] --> B[Hidden Layer 1]
    B --> C[Hidden Layer 2]
    C --> D[Output Layer]
    
    B --> E[ReLU]
    C --> F[ReLU]
    D --> G[Softmax]
\`\`\`

---

## Comparison of Optimizers

| Optimizer | Learning Rate | Momentum | Adaptive | Best For |
|-----------|--------------|----------|----------|----------|
| SGD | Fixed | No | No | Simple problems |
| Momentum | Fixed | Yes | No | Deep networks |
| Adam | Adaptive | Yes | Yes | General purpose |
| AdaGrad | Adaptive | No | Yes | Sparse data |
| RMSprop | Adaptive | No | Yes | RNNs |

---

## Key Takeaways

Here are the main points to remember:

- Neural networks are **differentiable functions** composed of linear transformations and non-linearities
- **Backpropagation** efficiently computes gradients using the chain rule
- **Optimization** algorithms like Adam improve upon basic gradient descent
- Understanding the math helps you:
  - Debug training issues
  - Design better architectures
  - Implement custom layers

### Further Reading

For more on this topic, check out:

- *Deep Learning* by Goodfellow, Bengio, and Courville
- *Pattern Recognition and Machine Learning* by Bishop
- [3Blue1Brown's Neural Network Series](https://www.3blue1brown.com/topics/neural-networks)

---

## Conclusion

The mathematics of neural networks, while initially daunting, reveals elegant structures. From the simple dot product to the intricate dance of gradients flowing backward through layers, each component serves a purpose in the learning process.

Understanding these foundations not only makes you a better practitioner but also opens doors to research and innovation in the field.

*Thanks for reading! Feel free to reach out with questions or comments.*
`

export default async function BlogPostPage({ params }: BlogPageProps) {
  const { slug } = await params
  const content = sampleContent

  const titleMatch = content.match(/^#\s+(.+)$/m)
  const title = titleMatch
    ? titleMatch[1]
    : slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-6 py-12">
          <Link
            href="/blogs"
            className="mb-8 inline-flex items-center gap-2 font-sans text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blogs
          </Link>

          <header className="mb-10">
            <time className="font-mono text-sm text-muted-foreground">November 20, 2024</time>
            <div className="flex items-start gap-3 mt-3">
              <h1 className="font-sans text-3xl font-semibold tracking-tight text-foreground sm:text-4xl flex-1">
                {title}
              </h1>
              <CopyBlogButton content={content} />
            </div>
          </header>

          <MarkdownRenderer content={content} />
        </article>
      </main>
      <Footer />
    </div>
  )
}
