# Derivada covariante and intro to differential geometry

Ahora hablaremos sobre uno de los temas que más me gustaron dentro de mi etapa como undergrad, la derivada covariante. A lo largo de este blog, solo trabajaremos con superficies que viven en $\mathbb{R}^3$. Antes de empezar, debemos de repasar algunos conceptos importantes como los son las curvas, superficies y finalmente campos vectoriales.

# Curvas Parametriazadas

Definimos a una curva parametrizada como una función $\gamma:I \to \mathbb{R}^3$ donde $I \subset \mathbb{R}$ es un intervalo que además es de clase $C^{\infty}$. Más aún, decimos que esta curva parametrizada es **regular** siempre cuando se cumpla que $||\gamma'(t)|| \neq 0 \ \forall t \in I$.

Aunque esta tiene una definición simple, podemos encontrar diversas propiedades y objetos matemáticos interesantes dentro de este objeto. La misión principal de esta parte es entender cómo podemos caracterizar las curvas y la relación entre sus propiedades definidas por sus distintas derivadas.

## Parametrización por longitud de arco

Sin entrar en mucho detalle, se puede mostrar que toda curva regular puede ser parametrizada por longitud de arco. Es decir, podemos reparametrizarla, es decir, cambiar la forma en cómo recorremos la curva sin modificar esta para que podamos obtener que $||\gamma'(s)|| = 1 \ \forall s \in I$. 

## Vector tangente y curvatura

Ahora hablaremos de este vector tangete unitaria. Sea una curva regultar parametrizada por longitud de arco $\gamma: I \to \mathbb{R}^3$. Definimos al vector tangente unitario como:

$$
T(s) = \gamma'(s)
$$


