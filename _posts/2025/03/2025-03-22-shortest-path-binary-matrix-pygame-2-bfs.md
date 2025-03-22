---
layout: post
title: "Solving Shortest Path in a Binary Matrix"
date: 2025-03-22 13:05:00 +0000
categories: [Python, Algorithms, Pygame]
author: Serdar Kuzucu
permalink: /2025/03/15/simulating-shortest-path-binary-matrix-pygame-2-solution/
comments: true
post_identifier: simulating-shortest-path-binary-matrix-pygame-2-solution
featured_image: /assets/category/python.png
series: "Simulating Shortest Path in a Binary Matrix using Pygame"
---

Hey all! This is the second post in the "Simulating Shortest Path in a Binary Matrix using Pygame" series.
In this post, we will choose an algorithm and explain why we selected it as our preferred approach for this problem.
We'll also describe a few alternative algorithms commonly used for similar types of problems.
Then, we'll analyze the time and space complexity of the algorithm using Big-O notation.
Finally, we will implement the algorithm in Python.

<!--more-->

---

## Choosing the Right Algorithm

When choosing an algorithm for finding the shortest path in a binary matrix, we need to consider both correctness and efficiency.
A brute-force approach, such as trying all possible paths, is infeasible due to its exponential time complexity.
A depth-first search (DFS) might seem like an option, but since it explores one path fully before backtracking,
it doesn't guarantee the shortest path in an unweighted grid.
A* search is another possibility, as it uses heuristics to optimize the search, 
but implementing an effective heuristic for this specific problem adds complexity. 
Given that we are working with an unweighted grid where all movements have the same cost, 
[Breadth-First Search (BFS)](https://en.wikipedia.org/wiki/Breadth-first_search) is the ideal choice—it explores all possible paths level by level, 
ensuring that the first time we reach the target, we've found the shortest path. 
Therefore, we will use BFS for our implementation.

Here’s why BFS is particularly suited for this problem and how it compares to other algorithms:

- **Guaranteed Shortest Path:** Since BFS visits nodes layer by layer, the first time it encounters the target node, 
it has found the shortest path in terms of the number of moves.
- **Efficiency:** BFS works efficiently in grid-based problems, like the one in this task, where we don't need to worry about weighted edges or more complex conditions.
Every move from one cell to another has the same "weight" (cost), which is a key factor in why BFS is optimal.

### Other Algorithms:

While BFS is ideal for this problem, there are alternative approaches that can be used for pathfinding:

- **[Depth-First Search (DFS)](https://en.wikipedia.org/wiki/Depth-first_search):** 
DFS explores deeper into the graph before backtracking, which makes it less suitable for shortest path problems.
It may explore longer paths before finding the target, which means it could miss the shortest path unless additional logic is used to track distances.

- **[Dijkstra's Algorithm](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm):**
Dijkstra's algorithm is used for finding the shortest path in graphs with weighted edges.
However, in this case, all moves have the same "cost", making BFS a simpler and more efficient choice.
Dijkstra’s algorithm is also more computationally expensive due to the priority queue management.

- **[A\* Search Algorithm](https://en.wikipedia.org/wiki/A*_search_algorithm):**
A\* is an advanced pathfinding algorithm that uses heuristics to guide the search.
While it can be faster than BFS in certain cases, it requires additional setup with heuristic functions.
In this problem, a simple BFS is sufficient, and introducing heuristics would be an unnecessary complexity.

---

## Space and Time Complexity of BFS

### Time Complexity:

In BFS, the time complexity is often represented as `O(V + E)`, where:

- `V` is the number of vertices (nodes) in the graph.
- `E` is the number of edges (connections between nodes).

For our grid problem, let's consider:

- `V` (vertices): In a grid of size `N x N`, there are `N²` vertices (one for each cell in the grid).
- `E` (edges): Each vertex (cell) can have up to 8 neighbors (up, down, left, right, and the 4 diagonal neighbors). 
So, in the worst case, the number of edges will be 8 times the number of vertices, which gives us a maximum of `8 * N²` edges.

Therefore, the time complexity of BFS can be expressed as:

`O(V + E) = O(N² + 8 * N²) = O(9 * N²) = O(N²)`

Since constants are dropped in Big-O notation, it simplifies to `O(N²)`.

### Space Complexity:

- **Queue:**
BFS uses a queue to store the vertices that need to be explored.
In the worst case, the queue could hold all the vertices of the grid, as we could be exploring each one.
Therefore, the space complexity for the queue is `O(V)`.
Since the grid has `N²` vertices, this becomes `O(N²)`.
- **Visited List:**
BFS typically also keeps track of which vertices have been visited to avoid revisiting them.
This requires storing a boolean value (True/False) for each vertex, which also takes `O(N²)` space for the grid, as there are `N²` vertices to track.

- In summary:
  - The queue will take up `O(N²)` space.
  - The visited list will also take up `O(N²)` space.
  - So, the total space complexity is `O(N²)` + `O(N²)` = `O(N²)`.

---

## Let's Code the Algorithm

To begin with, it's worth mentioning that I will implement the function with a different signature than what LeetCode requires for their question.
I will also use these functions in the simulation code I will implement later.
Inline comments will be included in the code, and I will minimize explanations outside the code.

**Imports and Constants:**

```python
# This is a double-ended queue implementation in python.
# It is an efficient data structure for our queueing needs.
from collections import deque

# The partial() is used for partial function application which “freezes” some portion 
# of a function’s arguments and/or keywords resulting in a new object with a simplified signature.
from functools import partial

# This is to be used as type hints when we take the grid as a parameter to the functions
from typing import List

# Values inside the grid 2-D array.
# Using constants instead of numbers self-documents the code.
WALL = 1
NON_WALL = 0

# All directions we can go from any Vertex (cell in grid). Having them in an array reduces the code duplication 
# when we try finding all neighbors.
DIRECTIONS = [
    (1, 0),   # Right
    (1, 1),   # Bottom-Right
    (0, 1),   # Bottom
    (-1, 1),  # Bottom-Left
    (-1, 0),  # Left
    (-1, -1), # Top-Left
    (0, -1),  # Top
    (1, -1),  # Top-Right
]
```

**Is a valid move?**

```python
def is_valid(
    x: int,
    y: int,
    grid: List[List[int]],
    size: int,
    visited: List[List[bool]],
) -> bool:
    """
    Given a position (x, y), verifies if it is within the grid's boundaries,
    if it is not a wall (grid[x][y] == 1), if it is not visited before.
    Use this function to test if a candidate neighbor can be queued for a visit.
    """
    if not (x >= 0 and x < size and y >= 0 and y < size):
        return False
    if grid[x][y] == WALL:
        return False
    if visited[x][y]:
        return False
    return True
```

**Visiting Neighbors:**

```python
def visit_neighbors(
    x: int,
    y: int,
    grid: List[List[int]],
    size: int,
    visited: List[List[bool]],
    queue: deque,
) -> None:
    """
    Given a position (x, y), visit its neighbors and queue them for a visit.
    Returns the list of neighbors for further processing in the simulation.
    """
    is_valid_partial = partial(is_valid, grid=grid, size=size, visited=visited)
    neighbors = []

    for dx, dy in DIRECTIONS:
        new_x, new_y = x + dx, y + dy
        if is_valid_partial(new_x, new_y):
            visited[new_x][new_y] = True
            neighbors.append((new_x, new_y))

    queue.extend(neighbors)
    return neighbors
```

**The algorithm:**

```python
def shortest_path(
    grid: List[List[int]],
    start: tuple[int, int] = (0, 0),
    end: tuple[int, int] = None,
) -> int:
    """
    Given a square grid, find the shortest path from the start to the end.
    Returns the number of steps required to reach the end from the start.
    If no path is found, returns -1.
    """

    # Size of the grid; assuming it is a square grid
    size = len(grid)

    # Initialize the level of the BFS traversal
    level = 0

    # If end is not provided, set it to the bottom-right corner of the grid
    if end is None:
        end = (size - 1, size - 1)

    # If start or end is a wall, return -1
    start_x, start_y = start
    end_x, end_y = end
    if grid[start_x][start_y] == WALL or grid[end_x][end_y] == WALL:
        return -1

    # Initialize the visited matrix and the queue for BFS traversal
    # Both data structures are initialized with the start position
    visited = [[False] * size for _ in range(size)]
    visited[start_x][start_y] = True
    queue = deque([start])

    # Perform BFS traversal. Loop until the queue is empty.
    while len(queue) > 0:
        # At each iteration, we exhaust all elements at the current level.
        level += 1
        
        # Loop through only the number of elements at the current level because the queue
        # will be modified during the iteration.
        elements_at_level = len(queue)
        for _ in range(0, elements_at_level):
            # Pop the element from the queue
            x, y = queue.popleft()
            # If the end is reached, return the level
            if x == end_x and y == end_y:
                return level
            # Visit the neighbors of the current element. They will be processed in the next level.
            visit_neighbors(x, y, grid, size, visited, queue)

    # There are no more elements to visit and the end was not reached
    return -1
```

This code defines the algorithm that returns either the length of the shortest path between start and end positions in the given square grid
or `-1` when there is no such path.

That's it! We can test this function by providing some solvable and non-solvable grid examples.

Let's test it with the first example we have given in the first post of this series and two examples shared on the original LeetCode question.

```python
def test_shortest_path_2x2_solvable():
    # The first example on the LeetCode question
    grid = [
        [0, 1],
        [1, 0],
    ]
    assert 2 == shortest_path(grid)


def test_shortest_path_3x3_solvable():
    # The second example on the LeetCode question
    grid = [
        [0, 0, 0],
        [1, 1, 0],
        [1, 1, 0],
    ]
    assert 4 == shortest_path(grid)


def test_shortest_path_5x5_solvable():
    # Our randomly generated example we've seen in first post of this series
    grid = [
        [0, 0, 0, 1, 1],
        [1, 0, 1, 1, 1],
        [1, 0, 1, 0, 1],
        [0, 0, 1, 0, 0],
        [1, 0, 0, 0, 0],
    ]
    assert 7 == shortest_path(grid)


def test_shortest_path_5x5_unsolvable():
    # Just flipping (x=1, y=2) from 0 to 1, we have made our above example unsolvable
    grid = [
        [0, 0, 0, 1, 1],
        [1, 0, 1, 1, 1],
        [1, 1, 1, 0, 1],
        [0, 0, 1, 0, 0],
        [1, 0, 0, 0, 0],
    ]
    assert -1 == shortest_path(grid)
```

With our BFS implementation in place, we now have a solid foundation for solving the shortest path problem in a binary matrix.
We've chosen BFS for its efficiency in unweighted grids and verified its correctness with test cases.
This completes the algorithmic part of our journey.
Now, we’re ready to shift our focus to visualization. 
In the next posts, we will bring this algorithm to life by simulating its execution step by step using Pygame. Stay tuned!
