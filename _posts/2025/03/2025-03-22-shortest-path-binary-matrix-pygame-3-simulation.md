---
layout: post
title: "Designing a Multi-Stage Simulation with Pygame"
date: 2025-03-22 13:15:00 +0000
categories: [Python, Algorithms, Pygame]
author: Serdar Kuzucu
permalink: /2025/03/15/simulating-shortest-path-binary-matrix-pygame-3-simulation-design/
comments: true
post_identifier: simulating-shortest-path-binary-matrix-pygame-3-simulation-design
featured_image: /assets/category/python.png
series: "Simulating Shortest Path in a Binary Matrix using Pygame"
---

Building a simple shortest path simulation is easy, but where’s the fun in that?
In this post, I explore the design of a multi-stage simulation using Pygame, 
where users interact with different states from setup to visualization and results. 
While adding complexity isn’t strictly necessary, 
it provides a great opportunity to learn core game development concepts like game loops, frame rate independence, and scene management. 
This post outlines the structure and expectations of the simulation before diving into the actual implementation.

<!--more-->

---


## Simulation

The simulation application will be a multi-stage application.
This means the user will navigate between stages and experience different user interfaces at different times.
There will be event handling, and the keyboard will play a role too!
You might ask, "Was that complexity necessary?" **Not at all!**
We are adding complexity purely to learn the [Pygame](https://www.pygame.org/) library.

There’s no deep reason why I chose **Pygame** as my framework of choice.
These days, I mostly write Python code, and I don’t want to stop using a language before building a user interface with it.
This code could be much smaller if I used a different language or framework.
For example, most of what I’m implementing now is handled automatically by [Unity](https://unity.com/).
However, I also believe that coding these basics helps me understand Unity and other full-fledged game engines better.

<div class="alert alert-secondary pb-0" role="alert" markdown="1">
I am also learning Unity in parallel, and I am quite surprised
when I saw how this guy called Mark created Flappy Bird in Unity in a 45-minute YouTube video.
Unity will definitely be my next tool to explore.
However, I can also go crazy and write Flappy Bird in Pygame although it may kill me.

Watch here: [The Unity Tutorial For Complete Beginners](https://www.youtube.com/watch?v=XtQMytORBmM)
</div>

### Expectations

Before going into the code, let's discuss expectations from the simulation application.
I am sharing the screenshots below to be able to explain it better.

#### 1. Startup Screen

We want to present some alternative scenarios to the user. 
That's why I added an empty startup screen to inform the user about how to start a simulation.
All possible user choices will navigate us to the same simulation screen with different setups:

1. Pressing "Space" key will start a random simulation. 
   We will not predetermine if finding a path from start position to end position is possible or not.
2. Pressing "Enter" will start a simulation that ends with a successful path from start to end.
   We will randomly create a grid and test it with our algorithm we implemented previously.
   We will create new grid and discard them until we find a grid with a possible solution.
3. Pressing "ESC" will start a simulation that ends with a failure to find a path.
   We will use the same brute-force grid creation logic as the success scenario.


![Simulation Startup Screenshot](/assets/posts/shortest-path-simulation/shortest-path-bfs-startup-screen.png){:width="400px"}

#### 2. Simulation Screen

This screen will take a grid and solve the problem!
It will refresh the visual elements at every step of the algorithm.
What we'll do here is as follows:

1. Draw walls as squares and unvisited nodes as gray circles into the grid
2. Periodically process levels in the BFS algorithm -- Do not process everything at one go, allow user to see it
3. Paint visited circles in blue color
4. Connect visited circles with a line between them and their parent circle. Parent circle is the circle who adds a child circle to the queue.
5. Repeat until the queue is empty, or we reach the end state.
  - If we are at the end state, we navigate to the successful simulation screen
  - If queue is empty, we navigate to the failed simulation screen
6. Current level should be visible to the user as a text at the bottom
7. Pressing ESC during a simulation will navigate us to the initial empty screen immediately

![During Simulation Screenshot](/assets/posts/shortest-path-simulation/shortest-path-bfs-during-simulation.png){:width="400px"}

#### 3. Simulation End Successfully Screen

This screen will show the same simulation view we were displaying in the above screen.
It will also paint the nodes/circles that makes the shortest path in green color.
Among the shortest path circles, the lines will be thicker than the other lines connecting other circles.
We will show the current level with a different text.
It will instruct user to use "Space" key to navigate to the initial empty screen for starting over.

![Simulation Finished Screenshot](/assets/posts/shortest-path-simulation/shortest-path-bfs-end-simulation.png){:width="400px"}

#### 4. Simulation Failed Screen

This is a very similar screen to the successful end screen.
It will have a different text while it displays the current level.
It will show the same grid, but it will add a semi-transparent overlay on top of it.
This doesn't have to be a good user experience. Remember we are doing things for learning.

![Simulation Failed Screenshot](/assets/posts/shortest-path-simulation/shortest-path-bfs-fail-simulation.png){:width="400px"}


### Game Development Concepts

What we're building in this simulation is simple for a game developer (not me).
While it could be done without following game development best practices, I'm using this as a learning opportunity.
Each of these concepts has extensive tutorials online, but here’s a brief (and possibly flawed) summary of them:

#### 1. Game Loop

A [game loop](https://gameprogrammingpatterns.com/game-loop.html) is what keeps a game running.
It’s a continuous cycle that handles user input, updates the game state, and redraws everything on the screen.
In Pygame, this means checking for events like key presses, updating objects, and rendering the latest frame.
The loop keeps running until the game ends, making everything feel smooth and responsive.

Basically, a game loop is a while loop that runs forever unless user closes the game.

A basic game loop in Pygame looks like this:

```python
import pygame

# Initialize Pygame
pygame.init()

# Set up screen and clock
screen = pygame.display.set_mode((800, 600))
clock = pygame.time.Clock()

# Game loop
running = True
while running:
    # Handle events
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        # Handle other events that are important to your application

    # Update game state
    # (update game objects, logic, etc.)
    update()  # Implement your update function and call it

    # Render the screen
    screen.fill((0, 0, 0))  # Clear screen with black
    # (draw game objects, etc.)
    draw()  # Implement your rendering function and call it

    pygame.display.flip()  # Update the display

    # Cap the frame rate to 60 frames per second
    clock.tick(60)

# Clean up
pygame.quit()
```

#### 2. Frame Rate

Frame rate is how many frames (or images) your game renders per second.
It’s usually measured in FPS (frames per second).
A higher frame rate makes the game look smoother, while a lower frame rate can make it feel choppy.
But it’s not just about visuals — if your game logic is tied directly to the frame rate, 
things can speed up or slow down depending on performance, which is why frame rate independence is important.

It is often recommended capping FPS for several reasons.
While higher frame rates can make the game smoother, they may also lead to excessive CPU or GPU usage, 
leading to performance issues, overheating, and reduced battery life on portable devices.
By capping the FPS, we ensure the game runs consistently across different hardware and prevent unnecessary performance spikes.
A common cap, such as 60 FPS, provides a stable and smooth experience without overloading the system.

In the above code, we have the following code piece in the basic game loop.
It allows at most 60 frames per second.
It adds a calculated waiting time between frames.
Without it, the program doesn't wait between frames, keeps updating objects and rendering graphics at a very high speed.

```python
# Cap the frame rate at 60 FPS
clock.tick(60)
```

#### 3. Frame Rate Independence

Frame rate independence is the idea that your game's logic (like movement, animations, and physics) should behave the same way 
regardless of how fast or slow frames are being rendered. 
Instead of relying on a fixed number of updates per second, you scale calculations based on elapsed time (delta time). 
That way, even if the frame rate fluctuates, things move at a consistent speed.

A simple (but not too precise) implementation of frame rate independence can be done as follows.
It moves `clock.tick` to the beginning of the loop, stores the elapsed seconds since the previous frame in a variable,
and passes that value to our imaginary `update` function.

```python
# Main game loop
running = True
while running:
    # Get delta time from clock.tick (in seconds)
    delta_time = clock.tick(60) / 1000  # Convert to seconds

    # Event handling
    handle_events()

    # Update game state with delta time
    # We are passing delta_time to make components do time-based updates
    update(delta_time)

    # Render
    draw()
```

All components/sprites/game objects in the game should update their internal state based on the elapsed time.

```python
speed = 10

# Bad: how fast character moves depends on the frame rate
player.x += speed

# Good: character moves with constant speed
player.x += speed * delta_time
```

#### 4. Delta Time (Δt, Elapsed Time)

Delta time (Δt) represents the time difference between the current and the previous frame. 
Many game engines use this term when updating movement, animations, or physics to make sure things stay consistent, even if the frame rate fluctuates.

To demonstrate how delta time ensures consistent behavior despite varying frame rates, 
let's look at a simple example where we increment a counter every second. 
The key idea here is to track the time between frames and update our game logic based on elapsed time, rather than relying on a fixed frame rate. 
This way, regardless of how fast or slow the frames are being rendered, the logic will behave consistently, and the counter will increment once every second. Here's a simple code snippet showing how this works:

```python
class Counter:
    counter = 0
    elapsed_time = 0

    def update(delta_time):
        elapsed_time += delta_time
        if elapsed_time >= 1:
            counter += 1
            elapsed_time -= 1
```

#### 5. Multiple Scenes

In a game, we rarely have just one screen.
We usually have a welcome screen, a main menu, a gameplay area, a pause menu, and maybe a game-over screen.
Each of these different sections of the game is often called a scene.

A scene represents a self-contained part of the game with its own logic, visuals, and interactions.
When transitioning between different parts of the game, we are essentially switching scenes.
Some game engines explicitly use the term scene (like Unity and Godot), while others might call them screens, states, or stages.

Managing multiple scenes usually requires a system that can switch between them smoothly.
Some games simply replace one scene with another, 
while others keep multiple scenes active at once—like having a gameplay scene running in the background while a pause menu scene is displayed on top.

An oversimplified scene transition might look like this:

```python
class Scene:
    def update(self):
        pass

    def render(self, screen):
        pass


class Game:
    def __init__(self):
        self.scenes = {"menu": MenuScene(), "game": GameScene()}
        self.current_scene = self.scenes["menu"]

    def run(self):
        while True:
            self.current_scene.update()
            self.current_scene.render(screen)  # Assume screen is initialized


class MenuScene(Scene):
    def update(self):
        if user_presses_start():
            game.current_scene = game.scenes["game"]


class GameScene(Scene):
    def update(self):
        if user_presses_exit():
            game.current_scene = game.scenes["menu"]
```

#### 6. Sprite

A sprite is a 2D image or animation that is used to represent an object in a game.
It can be a character, an item, or any visual element in the game world.
Sprites are typically drawn on a 2D canvas or screen, and they can be moved, rotated, and manipulated during the game to give the illusion of interaction or animation.

A simple player sprite that moves right on every frame:

```python
class Player(pygame.sprite.Sprite):
    def __init__(self, image, x, y):
        super().__init__()
        self.image = image
        self.rect = self.image.get_rect(topleft=(x, y))
        self.speed = 5

    def update(self, delta_time):
        self.rect.x += self.speed * delta_time  # Move right

player = Player(load_image("player.png"), 100, 100)
```

---

In this post, we explored the design of a multi-stage simulation using Pygame, focusing on creating a user-interactive experience that navigates through different states—startup, simulation, success, and failure screens. By incorporating game development concepts like the game loop, frame rate independence, delta time, and scene management, we’re not just building a simulation but also gaining a deeper understanding of how games and interactive applications are structured. While the added complexity isn’t strictly necessary for solving the shortest path problem, it provides a valuable learning opportunity for those interested in game development and Pygame.

In the next post, we’ll dive into the actual implementation of this simulation. We’ll write the code to bring these stages to life, handle user input, and visualize the shortest path algorithm step by step. Get ready to see how all these concepts come together in a functional Pygame application!