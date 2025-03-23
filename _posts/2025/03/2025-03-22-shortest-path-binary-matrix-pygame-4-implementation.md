---
layout: post
title: "Implementing the Simulation with Pygame"
date: 2025-03-23 00:09:00 +0000
categories: [Python, Algorithms, Pygame]
author: Serdar Kuzucu
permalink: /2025/03/15/simulating-shortest-path-binary-matrix-pygame-4-implementation/
comments: true
post_identifier: simulating-shortest-path-binary-matrix-pygame-4-implementation
featured_image: /assets/category/python.png
series: "Simulating Shortest Path in a Binary Matrix using Pygame"
---

Welcome to the 4th post in the "Simulating Shortest Path in a Binary Matrix using Pygame" series!
So far, we’ve explored the problem, implemented BFS, and designed a multi-stage simulation.
Now, it’s time to bring it all to life!
In this post, we’ll dive into the Pygame implementation and create an interactive visualization of the algorithm.
You’ll see walls, paths, and visited nodes animate on screen, watch BFS explore the grid step by step, and even handle success or failure scenarios.
Whether you’re here for the algorithms, the visuals, or just the fun of coding, this post will turn our simulation into a reality.
Let’s get started!

<!--more-->

---

## Let's Code It!

Sections below will show the classes and functions, but skip imports.
I will post the complete code to GitHub and share links to the actual code under each section.

### `sprites.py`

The `sprites.py` file defines various Pygame sprite classes and helper functions for rendering different elements in the simulation.
Let's go one by one.

**Helper Functions:**

```python
def create_wall(cell_size: int = CELL_SIZE, padding: int = 2) -> pygame.Surface:
    """Creates a surface representing a wall cell.

    Args:
        cell_size (int): The size of the cell in pixels.
        padding (int): The padding inside the cell to adjust the wall appearance.

    Returns:
        pygame.Surface: A surface with a dark red rectangle representing a wall.
    """
    # Create a transparent surface of the given cell size
    surface = pygame.Surface((cell_size, cell_size), pygame.SRCALPHA).convert_alpha()
    
    # Draw a dark red rectangle with padding to make the wall visually distinct
    pygame.draw.rect(
        surface,
        DARK_RED,  # Fill color
        (
            padding,  # X position of the rectangle within the `surface`
            padding,  # Y position of the rectangle within the `surface`
            cell_size - 2 * padding,  # Width of the rectangle
            cell_size - 2 * padding,  # Height of the rectangle
        ),
    )
    return surface


def create_circle(
    fill_color: tuple[int, int, int],
    border_color: tuple[int, int, int] = BLACK,
    cell_size: int = CELL_SIZE,
    padding: int = 1,
    border_width: int = 1,
) -> None:
    """Creates a circular surface with a border.

    Args:
        fill_color (tuple[int, int, int]): RGB color of the inner circle.
        border_color (tuple[int, int, int]): RGB color of the outer border.
        cell_size (int): The size of the cell in pixels.
        padding (int): Space between the circle and the edge of the surface.
        border_width (int): Thickness of the border.

    Returns:
        pygame.Surface: A surface containing a circle with the given properties.
    """
    # Create a transparent surface of the given cell size
    surface = pygame.Surface((cell_size, cell_size), pygame.SRCALPHA).convert_alpha()
    
    # Calculate center coordinates
    center_x = cell_size // 2
    center_y = cell_size // 2
    
    # Calculate the outer and inner radii
    outer_radius = cell_size // 2 - 2 * padding
    inner_radius = outer_radius - 2 * border_width
    
    # Draw the outer circle (border)
    pygame.draw.circle(surface, border_color, (center_x, center_y), outer_radius)
    
    # Draw the inner circle (fill)
    pygame.draw.circle(surface, fill_color, (center_x, center_y), inner_radius)
    return surface


@cache
def get_cell_surfaces() -> dict[CellType, pygame.Surface]:
    """Pre-renders and caches surfaces for different cell types.

    Returns:
        dict[CellType, pygame.Surface]: A dictionary mapping cell types to 
        their corresponding pre-rendered surfaces.
    """
    surfaces = {
        "wall": create_wall(),  # Surface for wall cells
        "unvisited": create_circle(GRAY),  # Surface for unvisited cells
        "visited": create_circle(BLUE),  # Surface for visited cells
        "final_path": create_circle(GREEN),  # Surface for the shortest path
    }
    return surfaces
```

`CellSprite` represents a single cell in the grid-based simulation, extending `pygame.sprite.Sprite` to integrate with Pygame’s rendering and update system.
Each cell has an `(x, y)` position in the grid and a `cell_type` that determines its appearance, such as "wall," "visited," or "final_path."
The class preloads surfaces for different cell types using `get_cell_surfaces()` to optimize rendering.
It also includes a method, `update_type()`, which allows the cell’s appearance to be updated dynamically based on state changes during the simulation.
By managing its own graphical representation and position, `CellSprite` enables efficient visual updates in the Pygame environment.

```python
class CellSprite(pygame.sprite.Sprite):
    """Represents a grid cell in the simulation as a Pygame sprite.

    Attributes:
        x (int): The x-coordinate of the cell in the grid.
        y (int): The y-coordinate of the cell in the grid.
        cell_type (CellType): The type of the cell (e.g., wall, visited, etc.).
        image (pygame.Surface): The visual representation of the cell.
        rect (pygame.Rect): The rectangle defining the cell's position.
    """

    def __init__(
        self,
        x: int,
        y: int,
        cell_type: CellType,
    ):
        """Initializes a CellSprite with position and type.

        Args:
            x (int): The x-coordinate of the cell in the grid.
            y (int): The y-coordinate of the cell in the grid.
            cell_type (CellType): The type of the cell (determines appearance).
        """
        super().__init__()
        self.x = x
        self.y = y
        self.cell_type = cell_type
        self.image = get_cell_surfaces()[self.cell_type]  # Assign the corresponding surface
        self.rect = self.image.get_rect(topleft=(x * CELL_SIZE, y * CELL_SIZE))  # Position in grid

    def update_type(self, cell_type: CellType):
        """Updates the cell's type and refreshes its appearance.

        Args:
            cell_type (CellType): The new type of the cell.
        """
        self.cell_type = cell_type
        self.image = get_cell_surfaces()[self.cell_type]  # Update surface based on new type
```

The `LineSprite` class represents a visual line connecting two points on a grid, typically used for illustrating paths or connections between cells.
It inherits from `pygame.sprite.Sprite`, allowing it to be part of Pygame's sprite system.
The sprite is initialized with two grid coordinates, a customizable line width, and a color.
The line is drawn on a surface, with its dimensions calculated based on the distance between the two points.
Special handling is applied to diagonal lines, increasing their width for better visibility.
The sprite's `rect` is adjusted to position the line properly within the grid, ensuring it aligns with the grid's structure.

```python
class LineSprite(pygame.sprite.Sprite):
    """Represents a line connecting two points in the grid.

    This sprite is used to visually represent paths or connections between cells
    in the grid-based simulation. It supports drawing both straight and diagonal
    lines with configurable width and color.

    Attributes:
        image (pygame.Surface): The surface containing the drawn line.
        rect (pygame.Rect): The rectangular area occupied by the line.
    """

    def __init__(
        self,
        from_point: tuple[int, int],
        to_point: tuple[int, int],
        line_width: int = THIN_LINE_WIDTH,
        color: tuple[int, int, int] = RED,
    ):
        """Initializes a LineSprite connecting two grid points.

        Args:
            from_point (tuple[int, int]): The starting point (grid coordinates).
            to_point (tuple[int, int]): The ending point (grid coordinates).
            line_width (int, optional): The width of the line. Defaults to THIN_LINE_WIDTH.
            color (tuple[int, int, int], optional): The color of the line. Defaults to RED.
        """
        super().__init__()

        # Convert grid coordinates to pixel coordinates.
        x1, y1, x2, y2 = (p * CELL_SIZE for p in (*from_point, *to_point))
        
        # Calculate the required surface dimensions to fit the line.
        width, height = abs(x1 - x2) + CELL_SIZE, abs(y1 - y2) + CELL_SIZE

        # Create a transparent surface to draw the line on.
        self.image = pygame.Surface((width, height), pygame.SRCALPHA).convert_alpha()
        self.rect = self.image.get_rect(topleft=(min(x1, x2), min(y1, y2)))

        # Adjust line width for diagonal lines to make them more visible.
        if x1 != x2 and y1 != y2:
            line_width = int(line_width * 1.5)

        # Center the line within the grid cell.
        shift_by_x = CELL_SIZE // 2 - self.rect.left
        shift_by_y = CELL_SIZE // 2 - self.rect.top

        # Draw the line from the starting point to the ending point.
        pygame.draw.line(
            self.image,
            color,
            (x1 + shift_by_x, y1 + shift_by_y),
            (x2 + shift_by_x, y2 + shift_by_y),
            line_width,
        )
```


The `TextSprite` class is a simple way to display text in a game.
The class renders a given text string in a specified font size and color.
It creates a surface and pre-renders the text during initialization.
This makes it efficient to repeatedly redraw at each frame.

```python
class TextSprite(pygame.sprite.Sprite):
    """
    A sprite class for rendering and displaying text in a Pygame game.

    This class is used to create a text element that can be added to the 
    Pygame sprite system for rendering.

    Attributes:
        image (pygame.Surface): The surface containing the rendered text.
        rect (pygame.Rect): The rectangle that defines the boundaries of the text.
    """

    def __init__(self, text: str, font_size: int, color: tuple[int, int, int]):
        """
        Initialize the TextSprite object.

        Args:
            text (str): The text string to display in the sprite.
            font_size (int): The font size for rendering the text.
            color (tuple[int, int, int]): The color of the text in RGB format.
        """
        super().__init__()

        # Create a font object with the specified font size.
        font = pygame.font.Font(None, font_size)

        # Render the text with the specified color and store it in the 'image' attribute.
        self.image = font.render(text, True, color)

        # Get the rectangle for the rendered text to define its position and size.
        self.rect = self.image.get_rect()
```

The `OverlaySprite` class is used to create semi-transparent overlays on the game screen.
It allows setting a custom width, height, color, and transparency level (alpha).
The overlay is drawn as a surface with the given dimensions and then filled with the specified color and transparency.
This class is useful for adding visual effects or background elements without obscuring the content behind it.

```python
class OverlaySprite(pygame.sprite.Sprite):
    """
    A sprite that creates a semi-transparent overlay for the game screen.
    
    This class creates an overlay that can be used for effects such as modal dialogs,
    backgrounds for text, or to create visual focus. The overlay is customizable in terms of size, 
    color, and transparency (alpha value).

    Attributes:
        image (pygame.Surface): The surface representing the overlay sprite.
        rect (pygame.Rect): The rectangle used for positioning the overlay sprite.
    """
    
    def __init__(self, width: int, height: int, color=(128, 128, 128), alpha=200):
        """
        Initialize the OverlaySprite with the given width, height, color, and alpha.
        
        Args:
            width (int): The width of the overlay.
            height (int): The height of the overlay.
            color (tuple[int, int, int]): The RGB color of the overlay (default is gray).
            alpha (int): The transparency of the overlay (default is 200).
        """
        super().__init__()

        # Create a new surface with the given width and height and transparent background
        self.image = pygame.Surface((width, height), pygame.SRCALPHA)
        
        # Fill the surface with the specified color and alpha (transparency)
        self.image.fill((*color, alpha))
        
        # Set the rect attribute for positioning the sprite
        self.rect = self.image.get_rect()
```

### `game.py`

The `game.py` file is responsible for managing the core structure and flow of the game.
It defines the main game loop, handles user input through event handling, updates the game state, and renders the game scene to the screen.
This file also handles transitions between different game states (e.g., welcome screen, gameplay, game over), ensuring smooth navigation and gameplay experience. 
Essentially, it serves as the backbone of the game's execution, coordinating all aspects of the game's lifecycle.

```python
class Game:
    def __init__(self):
        # Currently active state
        self.state = None
        
        # Next state to activate at the end of the game loop iteration
        self.next_state = None
        
        # Is the game running?
        self.running = False
        
        # Game's main screen; main surface to draw our game into
        self.screen = None

    def run(self):
        # Before doing anything else with pygame, it must be initialized
        pygame.init()
        
        # Define the screen and its size
        self.screen = pygame.display.set_mode(SCREEN_SIZE)
        
        # This sets the text on the title bar of the window
        pygame.display.set_caption("Shortest Path in Binary Matrix")
        
        # Update the contents of the entire display
        pygame.display.flip()

        # Clock will help us keep track of time and handle frame rate
        clock = pygame.time.Clock()
        
        # Set running to True to go into the infinite gaming loop until running is False
        self.running = True
        
        # Initialise the InitState: entrance scene for the game
        from leetcode.bfs_shortest_path.states import InitState
        self.state = InitState(self)

        # Start the gaming loop; run the code until running=False
        while self.running:
            # We do two things here: first, ask clock to update and regulate the frame rate,
            # then we calculate the deltaTime (elapsed time) in seconds.
            #
            # clock.tick(FPS) ensures that the game runs at the specified FPS (frames per second),
            # by limiting the number of frames that can be drawn within a given time.
            #
            # The resulting delta_time is the time in seconds between the current frame and the previous frame.
            # This value can be used for frame rate-independent movement or other time-dependent operations.
            # Dividing by 1000 converts the result from milliseconds to seconds, 
            # which is a standard unit of time for physics simulations.
            #
            # The value of delta_time can be used for smooth animations, physics calculations, or any other task
            # that requires time-based adjustments that are not dependent on the actual frame rate.
            delta_time = clock.tick(FPS) / 1000  # deltaTime in seconds
            print("FPS: ", clock.get_fps(), "Delta time: ", delta_time)

            # Game loops typically have 3 main actions: handling events, updating game state, and rendering.
            # Handle input events (e.g., keyboard, mouse) and game logic changes.
            self.handle_events()
            
            # Update the current game state based on the elapsed time (delta_time),
            # ensuring frame rate independence for physics, movements, or logic.
            self.state.update(delta_time)
            
            # Render the updated state to the screen (draw the updated visuals or objects).
            self.state.render()

            # Flip the display buffers to update the screen with the new frame.
            # This is typically used in double-buffered rendering to prevent flickering.
            pygame.display.flip()

            # Check if there is a state change request pending.
            if self.next_state is not None:
                # Transition to the new state by updating the current state.
                self.state = self.next_state
                
                # Reset the next_state to None, clearing the transition request.
                self.next_state = None

        # Quit the game, terminates the window. We need to call this when the game loop ends.
        # Otherwise, the window stays open.
        pygame.quit()

    def handle_events(self):
        # Initialize an empty list to store the events to be processed.
        events = []
        
        # Loop through all events in the event queue.
        for event in pygame.event.get():
            # If the event is a quit event (e.g., closing the window).
            if event.type == pygame.QUIT:
                # Set the running flag to False to stop the game loop.
                self.running = False
                # Exit the method immediately to stop handling further events.
                return
            else:
                # Add all other events to the events list for further processing.
                events.append(event)
        
        # Pass the collected events to the current game state's handle_events method for processing.
        self.state.handle_events(events)


if __name__ == "__main__":
    # Create an instance of the Game class, initializing the game object.
    game = Game()
    
    # Call the run method to start the game loop and begin game execution.
    game.run()
```


### `states.py`

`GameState` is an abstract base class (ABC) that defines the structure for different game states in the simulation.
It provides three methods — `handle_events`, `update`, and `render` — which are meant to be overridden by subclasses.
These methods define how the state handles user input, updates game logic, and renders visuals.
By using this base class, the game can manage different states (e.g., initialization, simulation, completion) in a structured and consistent way.


```python
class GameState(ABC):
    """
    Abstract base class representing the general state of the game.

    This class defines the essential methods that each game state must implement:
    - handle_events: Handles any input events (like keyboard or mouse actions).
    - update: Updates the state of the game, usually for animation or logic progression.
    - render: Renders the current state of the game on the screen.

    Inherits from ABC (Abstract Base Class) to ensure that any subclass must implement the abstract methods.
    However there are no abstract methods as of now.
    """

    def handle_events(self, events: List[pygame.event.Event]):
        """
        Handles input events for the current game state.

        Args:
            events (List[pygame.event.Event]): A list of events to process.
        """
        pass

    def update(self, delta_time: float):
        """
        Updates the game state, usually for animation or logic progression.

        Args:
            delta_time (float): The time elapsed since the last frame (in seconds).
        """
        pass

    def render(self):
        """
        Renders the current state of the game to the screen.
        """
        pass
```

`TimelyUpdateGameState` is a subclass of `GameState` that ensures updates occur at a fixed rate, defined by `updates_per_second`.
Instead of updating continuously every frame, it accumulates elapsed time (`delta_time`) and only triggers an update when enough time has passed.
The actual update logic is delegated to the `perform_update` method, which must be implemented by **subclasses**.

This is useful for managing time-sensitive logic, such as animations or physics updates, without being tied to the frame rate.

```python
class TimelyUpdateGameState(GameState, ABC):
    """
    A subclass of GameState that handles time-based updates.

    This class adds functionality to ensure that updates to the game state 
    occur at a consistent rate, based on the specified updates per second 
    (FPS). It ensures that updates are triggered only after the specified 
    amount of time has passed.

    Args:
        game (Game): The game instance to which the state belongs.
        updates_per_second (float | int): The number of updates to be performed per second.
    """

    def __init__(self, game: Game, updates_per_second: float | int):
        """
        Initializes the state with the game instance and updates per second.

        Args:
            game (Game): The game instance to which the state belongs.
            updates_per_second (float | int): The number of updates per second for the game state.
        """
        self.game = game
        self.time_lapsed_since_last_update = 0
        self.updates_per_second = updates_per_second
        self.update_interval = 1 / updates_per_second

    def update(self, delta_time: float):
        """
        Updates the game state based on the elapsed time, ensuring that updates 
        occur at the specified rate.

        Args:
            delta_time (float): The time elapsed since the last frame (in seconds).
        """
        self.time_lapsed_since_last_update += delta_time
        if self.time_lapsed_since_last_update < self.update_interval:
            return
        self.time_lapsed_since_last_update -= self.update_interval
        self.perform_update()

    @abstractmethod
    def perform_update(self):
        """
        Performs the actual update logic for the game state. This method must 
        be implemented by any subclass.

        This method is called when the time threshold is reached for an update.
        """
        pass
```

The `InitState` class is responsible for initializing the starting screen of the game, where the user can choose how to generate the grid for the BFS simulation.
It presents three options to the user: 
pressing the SPACE key for a random grid, 
ENTER for a successful path, 
and ESC for a failure path. 
The class organizes the display of these options using `TextSprite` objects and handles key events to transition to the next state based on the user's input.
Once an option is selected, it generates the corresponding grid and passes it to the `SimulationState` class to begin the BFS simulation.

```python
class InitState(GameState):
    """
    Represents the initial state of the game, where the user can choose to start
    a random, successful, or failure path.

    In this state, the user is presented with instructions on how to proceed, 
    and their input determines the grid that will be generated for the next state.
    """

    def __init__(self, game: Game):
        """
        Initializes the InitState, which displays the initial instructions to the user.

        Args:
            game (Game): The game instance to which this state belongs.
        """
        self.game = game

        # Create text sprites to display on the screen with different instructions
        text_1 = TextSprite("Press SPACE to start randomly", 36, BLACK)
        text_2 = TextSprite("Press ENTER to start a successful path", 36, GREEN)
        text_3 = TextSprite("Press ESC to start a failure path", 36, RED)

        # Position the text sprites on the screen
        text_2.rect.center = (SCREEN_SIZE_X // 2, SCREEN_SIZE_Y // 2)
        text_1.rect.bottomleft = text_2.rect.topleft
        text_3.rect.topleft = text_2.rect.bottomleft

        # Add text sprites to the sprite group for rendering
        self.objects = pygame.sprite.Group()
        self.objects.add(text_1, text_2, text_3)

    def handle_events(self, events: List[pygame.event.Event]):
        """
        Handles input events for the InitState, where the user chooses how to proceed.

        Args:
            events (List[pygame.event.Event]): A list of events to process.
        """
        for event in events:
            if event.type == pygame.KEYUP:
                if event.key == pygame.K_SPACE:
                    # Start with a randomly generated grid
                    self._create_grid_and_navigate(GRID_SIZE, is_good=None)
                if event.key == pygame.K_KP_ENTER or event.key == pygame.K_RETURN:
                    # Start with a successful path grid
                    self._create_grid_and_navigate(GRID_SIZE, is_good=True)
                if event.key == pygame.K_ESCAPE:
                    # Start with a failure path grid
                    self._create_grid_and_navigate(GRID_SIZE, is_good=False)

    def _create_grid_and_navigate(
        self, size: int, is_good: bool | None = None
    ) -> List[List[int]]:
        """
        Creates a grid based on the chosen type (good or bad) and transitions to
        the simulation state.

        Args:
            size (int): The size of the grid.
            is_good (bool | None): Whether to create a good or bad grid. If None, 
                                   a random choice is made.

        Returns:
            List[List[int]]: The generated grid.
        """
        if is_good is None:
            is_good = random.choice([True, False])

        if is_good:
            # Generate a good grid
            grid = create_good_grid(size)
        else:
            # Generate a bad grid
            grid = create_bad_grid(size)

        # Transition to the simulation state with the generated grid
        self.game.next_state = SimulationState(
            self.game, grid=grid, start_pos=START_POS, end_pos=END_POS
        )

    def render(self):
        """
        Renders the initial state to the screen, displaying the instructions.

        This method fills the screen with a white background and draws the text
        sprites for user instructions.
        """
        screen = self.game.screen
        screen.fill(WHITE)
        self.objects.draw(screen)
```


The `SimulationState` class represents the BFS pathfinding simulation in the game.
It manages the grid and its cells, keeping track of visited cells and updating the state of the game as the algorithm progresses.
It initializes the grid, sets the start and end positions, and visualizes the pathfinding process with the help of sprites for cells and lines.
The class is responsible for handling the BFS logic, updating the level, visiting neighboring cells, and drawing the path on the screen.
If a path to the destination is found, the class reconstructs the final path with thicker lines, and transitions to a success state;
otherwise, it transitions to a state indicating no path exists.
Additionally, it handles user input, allowing the player to escape back to the initial state.


```python
class SimulationState(TimelyUpdateGameState):
    """
    A game state representing the simulation of BFS pathfinding on a grid.
    """
    def __init__(
        self,
        game: Game,
        grid: List[List[int]],
        start_pos: tuple[int, int],
        end_pos: tuple[int, int],
    ):
        """
        Initializes the simulation state with the given parameters.
        
        Args:
            game (Game): The current game instance.
            grid (List[List[int]]): A 2D grid representing the game environment.
            start_pos (tuple[int, int]): The starting position for the pathfinding.
            end_pos (tuple[int, int]): The destination position for the pathfinding.
        """
        super().__init__(game, UPDATES_PER_SECOND)

        self.grid = grid
        self.grid_size = len(grid)  # Only works for square grids
        self.visited = [[False] * self.grid_size for _ in range(self.grid_size)]  # Track visited cells
        self.queue = deque([start_pos])  # Queue for BFS
        self.parents = {start_pos: None}  # Store parent of each cell for path reconstruction
        self.start_pos = start_pos
        self.end_pos = end_pos
        self.visited[start_pos[0]][start_pos[1]] = True  # Mark start position as visited
        self.cell_sprites = pygame.sprite.Group()  # Group for cell sprites
        self.line_sprites = pygame.sprite.Group()  # Group for lines representing the BFS path
        self.text_sprites = pygame.sprite.GroupSingle()  # Single group for text (level display)
        self.level = 0  # BFS level counter

        # Initialize cell sprites for the grid based on the type of each cell
        for x in range(len(self.grid)):
            for y in range(len(self.grid[x])):
                cell_type = "wall" if self.grid[x][y] == WALL else "unvisited"
                cell_sprite = CellSprite(x, y, cell_type)
                self.cell_sprites.add(cell_sprite)

        self.update_cell_type(start_pos[0], start_pos[1], "visited")

    def perform_update(self):
        """
        Perform one update step for the BFS pathfinding algorithm.
        If the queue is empty, it transitions to the next state.
        """
        if len(self.queue) == 0:
            # If the queue is empty, no path is found; transition to NoPathState
            entities = self.get_all_sprites_as_group()
            self.game.next_state = NoPathState(self.game, entities, self.level)
            return

        elements_at_level = len(self.queue)
        self.level += 1  # Increase the level (depth) of BFS

        # Process each element at the current BFS level
        for _ in range(0, elements_at_level):
            x, y = self.queue.popleft()
            if (x, y) == self.end_pos:
                # If the end position is reached, build the final path
                self.build_final_path()
                entities = self.get_all_sprites_as_group()
                # Navigate to CompletionState to display the result
                self.game.next_state = CompletionState(self.game, entities, self.level)
                return

            # Visit neighboring cells of the current position
            self.visit_neighbors(x, y)

    def visit_neighbors(self, x: int, y: int) -> None:
        """
        Visit all valid neighboring cells and update their state.
        
        Args:
            x (int): The x-coordinate of the current cell.
            y (int): The y-coordinate of the current cell.
        """
        # This function alters visited and queue
        neighbors = visit_neighbors(
            x, y, self.grid, self.grid_size, self.visited, self.queue
        )
        for neighbor in neighbors:
            self.parents[neighbor] = (x, y)  # Set parent for path reconstruction
            self.update_cell_type(neighbor[0], neighbor[1], "visited")
            self.add_line((x, y), neighbor)

    def handle_events(self, events: List[pygame.event.Event]):
        """
        Handle user input events, such as pressing the escape key to return to the initial state.
        
        Args:
            events (List[pygame.event.Event]): List of pygame events to handle.
        """
        for event in events:
            if event.type == pygame.KEYUP and event.key == pygame.K_ESCAPE:
                # Escape key pressed, go back to initial state
                self.game.next_state = InitState(self.game)
                return

    @property
    def level(self) -> int:
        """
        The current BFS level (depth).

        Returns:
            int: The current level.
        """
        return self._level

    @level.setter
    def level(self, value: int):
        """
        Set the level and update the displayed level text sprite.

        Args:
            value (int): The new level value.
        """
        self._level = value
        sprite = TextSprite(f"Current Level: {value}", 36, BLACK)
        sprite.rect.topleft = (THIN_LINE_WIDTH, self.grid_size * CELL_SIZE)
        self.text_sprites.add(sprite)

    def update_cell_type(self, x: int, y: int, cell_type: CellType) -> None:
        """
        Update the cell sprite type for the given position.
        
        Args:
            x (int): The x-coordinate of the cell.
            y (int): The y-coordinate of the cell.
            cell_type (CellType): The new cell type.
        """
        for sprite in self.cell_sprites:
            if sprite.x == x and sprite.y == y:
                sprite.update_type(cell_type)
                break

    def get_all_sprites_as_group(self) -> pygame.sprite.Group:
        """
        Get all sprites (cells, lines, text) as a pygame sprite group.

        Returns:
            pygame.sprite.Group: The group containing all sprites for rendering.
        """
        entities = pygame.sprite.Group()
        entities.add(self.cell_sprites)
        entities.add(self.line_sprites)
        return entities

    def add_line(
        self,
        from_point: tuple[int, int],
        to_point: tuple[int, int],
        line_width: int = THIN_LINE_WIDTH,
    ) -> None:
        """
        Add a line sprite between two points to represent the BFS path.

        Args:
            from_point (tuple[int, int]): The starting point of the line.
            to_point (tuple[int, int]): The ending point of the line.
            line_width (int, optional): The width of the line. Defaults to THIN_LINE_WIDTH.
        """
        line_sprite = LineSprite(from_point, to_point, line_width, RED)
        self.line_sprites.add(line_sprite)

    def build_final_path(self) -> None:
        """
        Reconstruct and display the final path from the end position to the start position.
        """
        current = self.end_pos
        self.update_cell_type(current[0], current[1], "final_path")

        # Reconstruct the path by tracing the parents
        while current != self.start_pos:
            previous = current
            current = self.parents[current]
            self.update_cell_type(current[0], current[1], "final_path")
            self.add_line(current, previous, line_width=THICK_LINE_WIDTH)

    def render(self):
        """
        Render all sprites (cells, lines, and text) to the screen.
        """
        screen = self.game.screen
        screen.fill(WHITE)

        self.cell_sprites.draw(screen)
        self.line_sprites.draw(screen)
        self.text_sprites.draw(screen)
```


The `CompletionState` represents the final state in the pathfinding simulation, indicating that a valid path has been found.
It displays a message to the user showing the shortest path found and the level where it was discovered.
The state also provides instructions to the player, allowing them to press the space bar to restart the simulation.
This state helps conclude the simulation and provides the user with feedback on the success of the pathfinding process, 
offering a smooth transition to the next step in the simulation.

```python
class CompletionState(GameState):
    """
    A game state that represents the completion of the BFS pathfinding simulation.

    This state is shown when the algorithm successfully finds a path to the destination.
    It displays the shortest path length and offers the player an option to restart the simulation.

    Attributes:
        game (Game): The game instance, used to transition between states.
        entities (pygame.sprite.Group): A group containing the text and sprite entities to be rendered.
        shortest_path (int): The length of the shortest path found during the simulation.
    """

    def __init__(self, game: Game, entities: pygame.sprite.Group, shortest_path: int):
        """
        Initializes the completion state with the game, entities, and shortest path length.

        Args:
            game (Game): The game instance, which handles the state transitions.
            entities (pygame.sprite.Group): The group of entities (sprites, text) to be displayed.
            shortest_path (int): The length of the shortest path found in the simulation.
        """
        self.game = game
        self.entities = pygame.sprite.Group()
        self.entities.add(entities)
        self.shortest_path = shortest_path

        text_1 = TextSprite(
            f"Shortest path found at level {self.shortest_path}", 32, GREEN
        )
        text_2 = TextSprite("Press space to go to the beginning", 32, BLACK)
        text_1.rect.topleft = (THIN_LINE_WIDTH, GRID_SIZE * CELL_SIZE)
        text_2.rect.topleft = text_1.rect.bottomleft
        self.entities.add(text_1, text_2)

    def handle_events(self, events: List[pygame.event.Event]):
        """
        Handles the user input events during the completion state.

        Specifically, listens for the spacebar key press to transition to the initial state.

        Args:
            events (List[pygame.event.Event]): A list of events that are checked for input.
        """
        for event in events:
            if event.type == pygame.KEYUP:
                if event.key == pygame.K_SPACE:
                    self.game.next_state = InitState(self.game)
                    return

    def render(self):
        """
        Renders the completion state to the screen, displaying the entities.

        Clears the screen and draws all entities (text and sprites) to indicate the completion
        of the pathfinding simulation.
        """
        screen = self.game.screen
        screen.fill(WHITE)
        self.entities.draw(screen)
```


The `NoPathState` is displayed when the pathfinding simulation reaches a point where no valid path is found after exploring all possible levels.
It informs the user that the algorithm could not find a solution, showing the number of levels visited during the search.
Similar to the `CompletionState`, the user can press the space bar to restart the simulation and attempt finding a path again.
This state provides feedback on the failure of the algorithm and allows for a fresh start, ensuring that the user can continue experimenting with different scenarios.


```python
class NoPathState(GameState):
    """
    A game state that represents the scenario where no path was found in the BFS pathfinding simulation.

    This state is shown when the algorithm fails to find a path after visiting a certain number of levels.
    It informs the user that no path was found and provides an option to restart the simulation.

    Attributes:
        game (Game): The game instance, used to transition between states.
        entities (pygame.sprite.OrderedUpdates): A group containing the text and sprite entities to be rendered.
        final_level (int): The number of levels visited before determining that no path was found.
    """

    def __init__(self, game: Game, entities: pygame.sprite.Group, final_level: int):
        """
        Initializes the no-path state with the game, entities, and the number of levels visited.

        Args:
            game (Game): The game instance, which handles the state transitions.
            entities (pygame.sprite.Group): The group of entities (sprites, text) to be displayed.
            final_level (int): The number of levels that were visited without finding a path.
        """
        self.game = game  # Store the game instance to facilitate state transitions
        self.entities = pygame.sprite.OrderedUpdates()  # Create an ordered sprite group for entities
        self.entities.add(entities)  # Add the provided entities (sprites, text) to the group

        # Create a text sprite to display the message about the path not being found
        text_1 = TextSprite(
            f"Shortest path not found after visiting {final_level} levels!", 32, RED
        )
        text_1.rect.topleft = (THIN_LINE_WIDTH, GRID_SIZE * CELL_SIZE)  # Position the text at the top left of the screen

        # Create another text sprite to instruct the player to press space to restart
        text_2 = TextSprite(f"Press space to go to the beginning", 32, BLACK)
        text_2.rect.topleft = text_1.rect.bottomleft  # Position this text below the first one

        # Create an overlay sprite that covers the grid area (used for background or effects)
        overlay = OverlaySprite(GRID_SIZE * CELL_SIZE, GRID_SIZE * CELL_SIZE)
        # Add the text and overlay sprites to the group of entities
        self.entities.add(text_1, text_2, overlay)

    def handle_events(self, events: List[pygame.event.Event]):
        """
        Handles the user input events during the no-path state.

        Specifically, listens for the spacebar key press to transition to the initial state.

        Args:
            events (List[pygame.event.Event]): A list of events that are checked for input.
        """
        for event in events:  # Loop through all the events to check for key presses
            if event.type == pygame.KEYUP:  # Check if a key has been released
                if event.key == pygame.K_SPACE:  # Check if the space key was pressed
                    self.game.next_state = InitState(self.game)  # Transition to the initial state

    def render(self):
        """
        Renders the no-path state to the screen, displaying the entities.

        Clears the screen and draws all entities (text and sprites) to indicate that no path was found
        in the pathfinding simulation.
        """
        screen = self.game.screen  # Get the game screen to render the state
        screen.fill(WHITE)  # Fill the screen with a white background

        self.entities.draw(screen)  # Draw all the entities (text, overlay, etc.) to the screen
```


### `algorithm.py`

We have already seen some functions from this file in the 2nd post of this series:
[Solving Shortest Path in a Binary Matrix](/2025/03/15/simulating-shortest-path-binary-matrix-pygame-2-solution/).
We will add other helper functions to help our simulation create random grids.

```python
def create_good_grid(
    size: int = 10,
    start_position: tuple[int, int] = (0, 0),
    end_position: Optional[tuple[int, int]] = None,
) -> List[List[int]]:
    """
    Creates a grid where a valid path exists from the start to the end position.

    Args:
        size (int): The size of the grid (default is 10).
        start_position (tuple[int, int]): The starting position in the grid (default is (0, 0)).
        end_position (Optional[tuple[int, int]]): The end position in the grid. If None, defaults to (size-1, size-1).

    Returns:
        List[List[int]]: A grid where the shortest path length is greater than 0 (i.e., a valid path exists).
    """
    return create_grid(
        size=size,
        start_position=start_position,
        end_position=end_position,
        predicate=lambda x: x > 0,  # Ensures a valid path exists
    )


def create_bad_grid(
    size: int = 10,
    start_position: tuple[int, int] = (0, 0),
    end_position: Optional[tuple[int, int]] = None,
) -> List[List[int]]:
    """
    Creates a grid where no valid path exists from the start to the end position.

    Args:
        size (int): The size of the grid (default is 10).
        start_position (tuple[int, int]): The starting position in the grid (default is (0, 0)).
        end_position (Optional[tuple[int, int]]): The end position in the grid. If None, defaults to (size-1, size-1).

    Returns:
        List[List[int]]: A grid where the shortest path length is -1 (i.e., no valid path exists).
    """
    return create_grid(
        size=size,
        start_position=start_position,
        end_position=end_position,
        predicate=lambda x: x == -1,  # Ensures no valid path exists
    )


def create_grid(
    size: int = 10,
    start_position: tuple[int, int] = (0, 0),
    end_position: Optional[tuple[int, int]] = None,
    predicate: Callable[[int], bool] = None,
) -> List[List[int]]:
    """
    Generates a grid based on the given size, start/end positions, and a predicate function.

    Args:
        size (int): The size of the grid (default is 10).
        start_position (tuple[int, int]): The starting position in the grid (default is (0, 0)).
        end_position (Optional[tuple[int, int]]): The end position in the grid. If None, defaults to (size-1, size-1).
        predicate (Callable[[int], bool]): A function that determines if the generated grid meets the desired condition.

    Returns:
        List[List[int]]: A grid that satisfies the predicate condition.

    Raises:
        ValueError: If the grid size is less than 3.
    """
    # Ensure the grid size is at least 3 to allow for meaningful simulation
    if size < 3:
        raise ValueError("Size must be at least 3")

    # Default end position to the bottom-right corner if not provided
    if end_position is None:
        end_position = (size - 1, size - 1)

    # Continuously generate grids until one satisfies the predicate condition
    while True:
        # Create a random grid with walls (1) and open cells (0)
        grid = [
            [random.choice([NON_WALL, WALL]) for _ in range(size)] for _ in range(size)
        ]

        # Ensure the start and end positions are open cells
        grid[start_position[0]][start_position[1]] = NON_WALL
        grid[end_position[0]][end_position[1]] = NON_WALL

        # Calculate the shortest path length using the BFS algorithm
        shortest_path_length = shortest_path(grid, start_position, end_position)

        # Return the grid if it satisfies the predicate condition
        if predicate(shortest_path_length):
            return grid
```

And there we have it — a fully functional BFS pathfinding simulation brought to life with Pygame!
From designing sprites and managing game states to visualizing the algorithm step by step,
we’ve covered the essentials of building an interactive simulation.
This project not only solves the "Shortest Path in a Binary Matrix" problem 
but also provides a hands-on way to understand core game development concepts like game loops, frame rate independence, and scene management.

Here's how it looks.
Below, I’m sharing a GIF I created from the frames I stored during the simulation.
I’ll dive into the full details of storing the frames and creating the GIF in Python in a future blog post.

![Simulation Gif](/assets/posts/shortest-path-simulation/simulation.gif){:width="400px"}

Feel free to experiment with the code — try tweaking the grid size, colors, or even the algorithm itself.
If you’re feeling adventurous, why not add new features like changing the grid size from initial screen 
or setting start/end coordinates dynamically or randomly?
The possibilities are endless!

I haven't shown all the code in this blog to keep it shorter, but you can always read it on GitHub.
Here is the link: [💻 sedran/leetcode-pygame](https://github.com/sedran/leetcode-pygame/tree/main/src/leetcode_pygame/bfs_shortest_path).

Whether this is the end of the series or just the beginning of another coding journey, 
I hope this post has inspired you to explore the intersection of algorithms and game development further.
Happy coding, and may your paths always be the shortest! 🚀
