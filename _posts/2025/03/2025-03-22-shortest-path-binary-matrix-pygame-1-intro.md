---
layout: post
title: "Introduction: Shortest Path in a Binary Matrix Problem"
date: 2025-03-22 13:00:00 +0000
categories: [Python, Algorithms, Pygame]
author: Serdar Kuzucu
permalink: /2025/03/22/simulating-shortest-path-binary-matrix-pygame-1-intro/
comments: true
post_identifier: simulating-shortest-path-binary-matrix-pygame-1-intro
featured_image: /assets/category/python.png
series: "Simulating Shortest Path in a Binary Matrix using Pygame"
---

Hello! This is the first post of a new series I am starting about "Simulating Shortest Path in a Binary Matrix using Pygame".
In this series, I'll walk through how I approached solving the 
["1091. Shortest Path in Binary Matrix"](https://leetcode.com/problems/shortest-path-in-binary-matrix/description/) problem from LeetCode.
This problem was not only an interesting coding challenge but also something I encountered during a job interview.
After solving the problem, I also want to implement a visual simulation code that demonstrates how the algorithm works.
I am not expert in simulating things and building visual software.
I will use this challenge to learn how to use [Pygame](https://www.pygame.org/) and how to simulate algorithms.

<!--more-->

---

## The Problem
The "1091. Shortest Path in Binary Matrix" problem from LeetCode is a classic pathfinding problem.
The task is to find the shortest path from the top-left corner to the bottom-right corner in a binary matrix, where 0 represents an open cell and 1 represents a blocked cell.
The catch is that you can only move horizontally, vertically, or diagonally, and the goal is to determine the shortest path if it exists.

### Problem Breakdown:
**Input:** A binary matrix where each cell is either 0 (open) or 1 (blocked).

**Output:** The length of the shortest path from the top-left to the bottom-right corner of the matrix. 
If no path exists, return -1.

**Conditions:**
- You can only move from a cell to its 8 surrounding cells (vertically, horizontally, or diagonally).
- You cannot move through cells marked with 1.
- The path must be the shortest possible route to the bottom-right corner.

**Example:**

Below is a 5x5 binary matrix example. 
You can see the diagram to better understand how we should navigate within the given grid.

```python
grid = [
    [0, 0, 0, 1, 1],
    [1, 0, 1, 1, 1],
    [1, 0, 1, 0, 1],
    [0, 0, 1, 0, 0],
    [1, 0, 0, 0, 0],
]
```

![Example](/assets/posts/shortest-path-simulation/example_grid.png){:width="600px"}

Solving the problem for the above grid should give us `8` as the result since we are visiting eight locations to reach our destination.
This result includes start and end locations as well.

This problem is a good exercise for practicing pathfinding algorithms and understanding how to deal with grid-based problems, 
which can often come up in interviews (happened to me) or real-world scenarios (never happened to me).

In the upcoming posts in this series, we will focus on implementing an algorithm solving the problem and simulating it visually.
Before jumping into the next post, feel free to pause here and try solving it by yourself for more fun.
You can [click here](https://leetcode.com/problems/shortest-path-in-binary-matrix/description/) to solve it on LeetCode.

Enjoy!
