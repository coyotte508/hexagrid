# hexagrid
Hexagonal grid in typescript, for npm, inspired by [redblobgames](https://www.redblobgames.com/grids/hexagons/) and [honeycomb](https://github.com/flauwekeul/honeycomb).

This code is meant for backend and reasonably fast algorithms on hexagonal grids. To have visualisation data
such as pixel coordinates of the center & corners of the hexes, use **honeycomb**.

## API

### Grid<Data = any>

The grid can access individual hexagons efficiently by their coordinates. If you modify an individual hex's coordinates, then you need to call `grid.recalibrate()`.

**Grid**(...hexes: Hex\<Data>[])

> Creates a grid with those hexes

**distance**(q1:number, r1: number, q2: number, r2: number): number

> Get the distance between two hexes. Returns `-1` if there's no path
between the two hexes, or if one of the hexes doesn't belong to the
grid
>
> The algorithm is not optimized with a direction heuristic

**get**(q: number, r: number): Hex\<Data>

> Get the corresponding stored Hex in the grid.

**merge**(...grids: Grid\<Data>[]): Grid\<Data>

> Merges other grids into the current grid.
>
> If hexes overlaps, the older hex is removed.

**path**(q1:number, r1: number, q2: number, r2: number): Hex\<Data>[]

> Get the shortest path between two hexes. Includes starting & destination hexes.
>
> The algorithm is not optimized with a direction heuristic

get **size**(): number

> Number of hexes in the grid

### Hex<Data=any>  {q, r, s, data}

Implements the `CubeCoordinates` interface.

**Hex**(q: number = 0, r: number = 0, s: number = 0, data: Data = undefined)

> Constructor, fills corresponding members with values

### CubeCoordinates {q, r, s}

*static* **parse**(s: string): CubeCoordinates

>Parse a string of the form `${q}x${r}`, for  example `0x0` or `4x-1`.