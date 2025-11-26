# BLOG 1: Attention Is All You Need

En este blog hablaremos principalmente sobre el mecanismo de atención, pero no desde una perspectiva única de los Large Language Models sino que de forma general cual es la idea detrás de esto. Para esto, usaremos otro sistema que está bastante relacionado, pero que me gusta ejemplificarlo porque los mecanismos de atención cambian y además, está relacionado a robótica. Tocaremos el paper de Attention Is All You Need claro,

# Tokenizer and Embeddings

## Tokenizer

Empecemos por notar cómo podemos representar las palabras en entes matemáticos para poder manipularlas. En ese sentido, se introduce el concepto de **Tokenizer**. La idea de este objeto lo podemos definir como una función inyectiva $tokenizer:\Sigma \to \mathbb{N}$ donde $\Sigma$ será un conjunto que construiremos al que llamaremos **Tokens Sets**. La idea es que cada conjunto de palabras se divide en sub palabras pequeñas que llamaremos tokens y la idea de la función $tokenizer$ es que asignará a cada token un número natural $n$ único. 

Aquí una imagen de referencia de cómo se ve esto:

![image](https://hackmd.io/_uploads/r1EPJ9YpJe.png)

![image](https://hackmd.io/_uploads/rkEdyqtp1g.png)

Podemos ver cómo toda la cadena de palabras es divida por tokens y cada uno de estos es asignado a un número entero fijo. A lo largo del artículo denotaremos al cardinal del conjunto de tokens como $\text{vocab size} = |\Sigma|.$

## Embedding

Podemos pensar que esta representación es útil, ya que tenemos una representación **única** para cada token; sin embargo, pese a que es única, esta carece de información. Entonces necesitamos tener una representación que sea lo suficientemente única, pero que además tenga la capacidad de almacenar la informaión de dicho token y de cierta forma darnos la posibilidad de entender cual es su relación con otros tokens. Es por ese motivo que introducimos el concepto de *Embedding*. 

Un embedding es un vector cuya función es representar a los tokens en un dimensión específica. En este caso tendremos que la dimensión será denotada como $d_{\text{model}}$. El funcionamiento general es básicamente tener una especie de look-up-table tal que podamos mapear cada token con su respectivo embedding. De esta forma, tenemos que si nuestra oración tiene $N$ tokens, luego por pasar por el proceso de los embeddings, nos quedará una matriz de dimensión $N \times d_{\text{model}}$ donde cada fila $i$ representa al token $i$ correspondiente. 

La efectividad de este enfoque es que ahora podemos pasar a los parámetros de cada vector como parámetros del modelo e intuitivamente cada esta representación vectorial debería de mejorar en cada paso de entrenamiento.

# Mecanismo de atención

Una vez explicado cómo podemos convertir las oraciones en representaciones numéricas, ahora explicaremos uno de los conceptos más importantes del paper. Para esto, debemos preguntarnos: ¿Qué significa la atención? ¿Cómo codificamos la atención? Observemos la siguiente fórmula propuesta en el paper.

En el paper una vez obtenida la representación vectorial de toda la sentencia en esta matriz $M \in \mathbb{R}^{N \times d_{\text{model}}}$, realizamos $3$ transformaciones lineales para poder obtener tres matrices que serán relevantes para codificar la atención. Estas son las de 

$$
Q = M.W^Q, W^Q \in \mathbb{R}^{d_{\text{model}}\times d_k}
$$

$$
K = M.W^K, W^K \in \mathbb{R}^{d_{\text{model}}\times d_k}
$$

$$
V = M.W^V, W^V \in \mathbb{R}^{d_{\text{model}}\times d_v}
$$

Consideremos entonces las matrices $Q \in \mathbb{R}^{N\times d_k}, K \in \mathbb{R}^{N\times d_k}, V \in \mathbb{R}^{N\times d_v}$, donde $Q, K, V$ son las matrices conocidas como *Queries*, *Keys* y *Values* y $d_k,d_v \in \mathbb{N}$. En estas matrices estamos almacenando ahora diferentes representaciones de los tokens en estas dos dimensiones. Como veremos más adelante, cada una de las matrices tendrá en cada fila $i$ una representación diferente de cada token $i$. Luego, en el paper codifican la atención como:

$$
\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}} \right)V
$$

Expliquemos el porqué de esta fórmula y la intuición detrás de ella. Empecemos por lo más básico.

## Multiplicación de matrices

Podemos expresar la multiplicación de matrices de la siguiente forma en términos matemáticos. Sean las matrices $Q \in \mathbb{R}^{N\times d_k}$ y $K \in \mathbb{R}^{N\times d_k}$, su producto $S = QK^T$ (donde $K^T$ es la transpuesta de $K$) tendrá la dimensión $S \in \mathbb{R}^{N \times N}$. Si tomamos la fila $i$ y la columna $j$, cada componente de $S$ se puede calcular como:

$$
S_{i,j} = \sum_{k=1}^{d_k} Q_{i,k} K^{T}_{k,j}
$$

En otras palabras, estamos realizando un producto interno entre la fila $i$ de la matriz $Q$ y la fila $j$ de $K$ (debido a la transposición). Recordemos que podemos considerar cada fila de $Q$ y $K$ como la información en dimensión $d_k$ de cada token:

$$
\begin{bmatrix}
\text{token}_1 \\
\text{token}_2 \\
\vdots \\
\text{token}_N \\
\end{bmatrix}
$$

donde cada token $i$ se representa como un vector en $\mathbb{R}^{d_k}$:

$$
\text{token}_i \in \mathbb{R}^{d_k} \quad \text{(visto como un vector fila)}
$$

Al realizar el producto interno entre filas y columnas, almacenamos en el componente $S_{i,j}$ la información cruzada entre el $\text{token}_i$ y el $\text{token}_j$. De esta forma, podemos representar en esta matriz toda la información global sobre las relaciones entre los tokens de manera eficiente.

Sin embargo, esto aún no es suficiente. Ahora explicaremos por qué es necesario normalizar este resultado, es decir, dividirlo por $\sqrt{d_k}$


## Normalizacion

Empecemos por un caso simple. Tomemos dos vectores $q \in \mathbb{R}^{d_k}$ y $v \in \mathbb{R}^{d_k}$. Supongamos que ambos tienen $\mu=0$ y $\sigma^2=1$. Entonces, al realizar el producto interno, la variable resultante tendrá $\mu=0$ y $\sigma^2=d_k$. Por lo tanto, a medida que la dimensión $d_k$ aumenta, el valor resultante tiene altas probabilidades de ser un número muy negativo o muy positivo. 

¿Por qué esto es un problema? Porque introduce inestabilidad, especialmente si queremos usar la función $softmax$, la cual es utilizada en nuestra fórmula de atención. Analicemos en detalle este fenómeno.

## $Softmax$

La función $softmax$ está representada como:

$$
\text{softmax}(x)_i = \frac{e^{x_i}}{\sum_{j=1}^{n} e^{x_j}}
$$

Notemos que al aplicar $softmax$ a un vector, el resultado es una distribución de probabilidad, ya que se cumple que:

$$
\sum_{i=1}^{n} \text{softmax}(x)_i = 1
$$

Sin embargo, debido a la forma de esta función, analicemos qué sucede cuando los componentes del vector $x$ toman valores muy negativos y muy positivos.

Dado que la función $softmax$ no tiene una salida escalar, su derivada está representada por el \textit{Jacobiano}, ya que recordemos que:

$$
\frac{\partial f}{\partial v}(a) = Df(a) \cdot v
$$

donde $Df(a)$ es la matriz compuesta por todas las derivadas parciales de $f$.

En el caso de la función $softmax$, tenemos que:

$$
\frac{\partial \text{softmax}(x)_i}{\partial x_j} = \text{softmax}(x)_i \cdot (\delta_{i,j} - \text{softmax}(x)_j)
$$

donde $\delta_{i,j}$ es la delta de Kronecker.

Debido a la forma de este componente del Jacobiano de la función $softmax$, podemos observar que en la mayoría de los casos su valor es cercano a $0$. Esto se puede demostrar considerando diferentes casos en los que algunos componentes del vector $x$ son muy positivos y otros muy negativos, y sustituyéndolos en la derivada parcial de la función.

Para ilustrar este fenómeno de manera práctica, realizaremos una simulación en la que generaremos vectores aleatorios con $\mu=0$ y $\sigma^2=d_k$, y analizaremos cómo la norma del Jacobiano de la función $softmax$ se reduce a medida que la dimensión $d_k$ aumenta. Esto implica que los gradientes se vuelven muy pequeños, lo que dificulta el entrenamiento del modelo. Este efecto, ya analizado en secciones anteriores, es conocido como el problema del \textit{vanishing gradient}.



```python
import numpy as np
import matplotlib.pyplot as plt

def softmax(z):
    e_z = np.exp(z - np.max(z))
    return e_z / e_z.sum()

def softmax_jacobian(z):
    s = softmax(z).reshape(-1, 1)
    return np.diagflat(s) - np.dot(s, s.T)

def compute_jacobian_norm(z):
    J = softmax_jacobian(z)
    return np.linalg.norm(J, 'fro')

num_simulations = 1000
d_k_values = np.logspace(0, 4, 20)
norms = []

for d_k in d_k_values:
    current_norms = []
    for _ in range(num_simulations):
        z = np.random.normal(loc=0, scale=np.sqrt(d_k), size=50)
        current_norms.append(compute_jacobian_norm(z))
    norms.append(np.mean(current_norms))

plt.figure(figsize=(10, 6))
plt.scatter(d_k_values, norms, alpha=0.7, color='red')
plt.xscale('log')
plt.yscale('log')
plt.xlabel('$d_k$ (escala logarítmica)', fontsize=12)
plt.ylabel('Norma de Frobenius del Jacobiano (log)', fontsize=12)
plt.title('Decaimiento de la norma del Jacobiano de Softmax con $d_k$ grande', fontsize=14)
plt.grid(True, which="both", ls="--")
```

![Decaimiento de la norma del Jacobiano de Softmax con $d_k$ grande](https://res.cloudinary.com/dtpiuha91/image/upload/v1745814918/1_vyjlrb.png)

Ahora veamos qué sucede cuando aplicamos el efecto normalizador. Para esto, basta con cambiar la línea de código:

```python
z = np.random.normal(loc=0, scale=np.sqrt(d_k), size=50)
z = z/np.sqrt(d_k)
```

![Decaimiento de la norma del Jacobiano de Softmax con $d_k$ grande](https://res.cloudinary.com/dtpiuha91/image/upload/v1745814918/2_tjrldx.png)

Notemos que ahora, sin importar el tamaño de la dimensión $d_k$, la norma de la matriz jacobiana se mantiene estable y uniforme sin decaimientos.

## Mecanismo de atención

Ahora que entendimos la multiplicación de las matrices $Q$ y $K$, el efecto de la normalización por su dimensión $d_k$ y su implicancia al momento de usar el $softmax$, finalmente llegamos a la parte de ¿por qué se le llama un mecanismo de atención?

Definimos la matriz resultante de la operación de $softmax$ como

$$
S = \text{softmax}\left(\frac{Q K^T}{\sqrt{d_k}}\right) \in \mathbb{R}^{N \times N}
$$

El siguiente paso para definir la atención ($Attention$) es multiplicar por la matriz $V \in \mathbb{R}^{N \times d_v}$. Sin embargo, la clave para entender este mecanismo de atención se encuentra al expresar las filas de la matriz de atención de la siguiente forma:

$$
Attention_i = \sum_{k=1}^{N} S_{i,k} V_k
$$

Podemos observar que la fila $i$ de $Attention$ no es más que una suma ponderada de las filas de $V$, ya que, debido a la función $softmax$, tenemos que $\sum_{k=1}^{N} S_{i,k} = 1 \ \forall i = 1,2,...,N$. Intuitivamente, estamos almacenando en cada fila de $Attention$ esta suma ponderada, donde $S_{i,k}$ indica cuál sería la relevancia de cada $token_k$ para el $token_i$ usando los "pesos" determinados por la matriz $S_{i,k}$.


## Multi-Head Attention

El **Multi-Head Attention** se basa en la idea de ejecutar múltiples operaciones de atención en paralelo, donde cada una trabaja con proyecciones de menor dimensión del espacio original. Matemáticamente, cada cabeza de atención se define como:

$$
\text{head}_i = \text{Attention}(Q W^Q_i, K W^K_i, V W^V_i)
$$

donde las proyecciones son matrices de parámetros aprendidas durante el entrenamiento:

- $W^Q_i \in \mathbb{R}^{d_{\text{model}} \times d_k}$
- $W^K_i \in \mathbb{R}^{d_{\text{model}} \times d_k}$
- $W^V_i \in \mathbb{R}^{d_{\text{model}} \times d_v}$
- $W^O \in \mathbb{R}^{h d_v \times d_{\text{model}}}$

Usamos estas matrices $Q,K,V$ como notación; sin embargo, estas son iguales a la matriz inicial $M \in \mathbb{R}^{N \times d_{\text{model}}}$ que se obtiene luego de pasar por los embeddings y también por el positional encoding que veremos más adelante. Vemos que en nuestra formula hacemos explícita la transformación lineal colocando las matrices $W$ dentro.

Estas matrices proyectan las entradas $Q$, $K$ y $V$ en subespacios de menor dimensión, permitiendo que cada cabeza procese la información de manera independiente. La relación entre las dimensiones para mantener la misma complejidad que al usar una sola cabeza es la siguiente:

$$
d_k = d_v = \frac{d_\text{model}}{h}
$$

Al final, los resultados de todas las cabezas se concatenan y se proyectan nuevamente al espacio original mediante una matriz $W^O$:

$$
\text{MultiHead}(Q, K, V) = \text{Concat}(\text{head}_1, \dots, \text{head}_h) W^O
$$

De esta manera, el modelo puede aprender y capturar múltiples relaciones entre palabras dentro de la secuencia desde distintos subespacios de representación. **Multi-Head Attention** permite que el modelo atienda conjuntamente a información de diferentes subespacios en distintas posiciones, evitando la pérdida de información que ocurriría si solo se utilizara una única cabeza de atención.


## Positional Encoding

Como vimos previamente, la atención se codifica de forma general y cruzada entre todos los tokens; sin embargo, esto introduce que no exista la percepción de posición de estos. Es decir, a diferencia de las RNN donde sí se podía tener información sobre la posición posicional de un token, en este caso, al tener una información cruzada no es posible. Debido a esto, se introduce dicha información de la siguiente manera: se agregan **positional encodings** a los embeddings de entrada. 

Estos codificadores posicionales son vectores que representan explícitamente la posición de cada token en la secuencia. Hay varias formas de implementarlos, pero en el Transformer original se utilizan funciones senoidales y cosenoidales de diferentes frecuencias para generar estos vectores. La idea es que tokens cercanos tengan codificaciones similares, y que el modelo pueda inferir de manera continua la relación espacial entre los tokens. Estos vectores se suman directamente a los embeddings de palabra, permitiendo que el modelo tenga tanto información del contenido como de la posición de cada token en la secuencia.

Para una posición $pos$ y una dimensión $i$ del embedding, el codificador posicional se define como:

$$
PE(pos, 2i) = \sin\left(\frac{pos}{10000^{\frac{2i}{d_{\text{model}}}}}\right)
$$

$$
PE(pos, 2i+1) = \cos\left(\frac{pos}{10000^{\frac{2i}{d_{\text{model}}}}}\right)
$$

donde:
- $pos$ es el índice de posición del token en la secuencia,
- $i$ es el índice de dimensión del vector de embedding,
- $d_{\text{model}}$ es el tamaño del embedding.

En otras palabras, **las dimensiones pares** usan una función seno, y **las dimensiones impares** usan una función coseno, ambas con frecuencias que decrecen exponencialmente a medida que aumenta la dimensión.

Esta representación funciona por varias razones fundamentales:

1. **Codificación de relaciones relativas**:  El uso de funciones seno y coseno permite que el modelo capture de forma natural la diferencia relativa entre posiciones. Gracias a las propiedades de estas funciones periódicas, la distancia entre dos posiciones puede ser inferida directamente a partir de sus codificaciones. Esto facilita que el mecanismo de atención identifique patrones como "el siguiente token" o "tokens separados por cierta distancia", sin necesidad de información explícita adicional.

2. **Captura de relaciones a diferentes escalas**: Al usar frecuencias que decrecen exponencialmente, algunas dimensiones del codificador posicional capturan variaciones rápidas (relaciones locales) mientras que otras capturan variaciones lentas (relaciones globales). Así, el modelo puede entender tanto dependencias cortas como dependencias largas dentro de la secuencia de tokens.

3. **Generalización a secuencias más largas**:Dado que seno y coseno son funciones continuas y no están limitadas a un número fijo de posiciones, el modelo puede extrapolar a secuencias más largas de las vistas durante el entrenamiento. Esto permite que el mismo esquema de codificación funcione bien incluso en contextos no vistos previamente.

Esta incorporación se realiza directamente después de obtener nuestra matriz de Embeddings de los tokens y se hace a través de la suma.

Aquí un buen [vídeo](https://www.youtube.com/watch?v=T3OT8kqoqjc) en donde esto se puede entender mejor de forma visual.

## Masking

Otro componente importante para entrenar la parte del encoder es la técnica de **Masking**. Esta es fundamental porque debemos asegurarnos de que las predicciones del modelo se basen únicamente en información del pasado, y que no puedan acceder a información del futuro. Si el modelo pudiera "ver" el futuro durante el entrenamiento, sus predicciones no reflejarían un escenario realista, ya que en la práctica solo contamos con información pasada o presente.

Concretamente, queremos que dado un $token_i$, este solo preste atención a los tokens anteriores (o a sí mismo), y no a tokens futuros, es decir, tokens $j$ con $j>i$. Para lograr esto, analicemos nuestra matriz previa a aplicar la función $Softmax$, que es:

$$
S^* = \frac{QK^T}{\sqrt{d_k}}
$$

Esta matriz codifica las similitudes (o scores) entre todos los pares de tokens. De forma expandida, la matriz $S^*$ es:

$$
S^* =
\begin{bmatrix}
s_{1,1} & s_{1,2} & s_{1,3} & \cdots & s_{1,N} \\
s_{2,1} & s_{2,2} & s_{2,3} & \cdots & s_{2,N} \\
s_{3,1} & s_{3,2} & s_{3,3} & \cdots & s_{3,N} \\
\vdots  & \vdots  & \vdots  & \ddots & \vdots \\
s_{N,1} & s_{N,2} & s_{N,3} & \cdots & s_{N,N}
\end{bmatrix}
$$

Sin embargo, notemos que el componente $S^*_{ij}$ representa la atención que el $token_i$ le presta al $token_j$. Si $i<j$, esto implicaría que el token actual está viendo hacia el futuro, lo cual no es deseado. Como mencionamos, queremos que el modelo solo atienda a sí mismo y a los tokens anteriores.

Una manera efectiva de lograrlo es modificando $S^*$: colocamos $-\infty$ en todas las entradas $S^*_{ij}$ donde $i<j$. Esto garantiza que, al aplicar luego la función $Softmax$, esas posiciones tendrán probabilidad cero, ya que:

$$
\text{Softmax}(-\infty) = 0
$$

Así, nuestra matriz enmascarada de puntuaciones quedaría:

$$
\tilde{S}^* =
\begin{bmatrix}
s_{1,1} & -\infty & -\infty & \cdots & -\infty \\
s_{2,1} & s_{2,2} & -\infty & \cdots & -\infty \\
s_{3,1} & s_{3,2} & s_{3,3} & \cdots & -\infty \\
\vdots  & \vdots  & \vdots  & \ddots & \vdots \\
s_{N,1} & s_{N,2} & s_{N,3} & \cdots & s_{N,N}
\end{bmatrix}
$$

Al aplicar $Softmax$ fila por fila, obtenemos una matriz de atenciones donde las probabilidades hacia el futuro son cero, y las probabilidades sobre el pasado y el presente suman 1 en cada fila:

$$
\text{Softmax}(\tilde{S}^*) =
\begin{bmatrix}
p_{1,1} & 0 & 0 & \cdots & 0 \\
p_{2,1} & p_{2,2} & 0 & \cdots & 0 \\
p_{3,1} & p_{3,2} & p_{3,3} & \cdots & 0 \\
\vdots  & \vdots  & \vdots  & \ddots & \vdots \\
p_{N,1} & p_{N,2} & p_{N,3} & \cdots & p_{N,N}
\end{bmatrix}
$$

Finalmente, cumplimos que para cada fila $i$:

$$
\sum_{j=1}^i p_{i,j} = 1
$$

Es decir, la suma de las probabilidades a las que un token puede atender (solo hacia el pasado o a sí mismo) es exactamente 1.


# Conclusiones

En este blog hemos visto los principales conceptos detrás del modelo Transformer, desde la atención hasta los positional encodings y el masking. En el blog de **NONHUMAN** se puede observar cómo implementamos cada componente de estos dentro de un pequeño modelo que llegamos a entrenar con varios PDF's que aunque no genere texto coherente siempre, puede llegar a generar una distribución al menos legible, ya que estuvo hecho con fines meramente educativos. El link del [blog](https://www.nonhuman.site/articles/000002).

## Referencias

1. [Vaswani, Ashish, et al. "Attention Is All You Need". *NeurIPS*, 2017.](https://arxiv.org/abs/1706.03762)
