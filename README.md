# hexagrid
Hexagonal grid in typescript, for npm, inspired by [redblobgames](https://www.redblobgames.com/grids/hexagons/) and [honeycomb](https://github.com/flauwekeul/honeycomb).

This code is meant for backend and reasonably fast algorithms on hexagonal grids. To have visualisation data
such as pixel coordinates of the center & corners of the hexes, use **honeycomb**.

## API

### Grid\<HexType extends Hex = Hex>

The grid can access individual hexagons efficiently by their coordinates. If you modify an individual hex's coordinates, then you need to call `grid.recalibrate()`.

**Grid**(...hexes: HexType[])

> Creates a grid with those hexes

**get**(hex: CubeCoordinates): HexType

> Get the corresponding stored Hex in the grid.

**getS**(str: string): HexType

> Get the corresponding stored Hex in the grid. `str` is `'${hex.q}x{hex.r}'`. 

**distance**(hex1: CubeCoordinates, hex2: CubeCoordinates): number

> Get the distance between two hexes. Returns `-1` if there's no path
between the two hexes, or if one of the hexes doesn't belong to the
grid

**groups**(hexes: HexType[]): Set\<HexType>[]

> Divides the givens hexes into groups. Each group is a set of adjacent hexes.

**merge**(...grids: Grid\<HexType>[]): Grid\<HexType>

> Merges other grids into the current grid.
>
> If hexes overlaps, the older hex is removed.

**path**(hex1: CubeCoordinates, hex2: CubeCoordinates): HexType[]

> Get the shortest path between two hexes. Includes starting & destination hexes.

get **size**(): number

> Number of hexes in the grid

### Hex<Data=any>  {q, r, s, data}

Implements the `CubeCoordinates` interface.

**Hex**(q: number = 0, r: number = 0, s: number = 0, data: Data = undefined)

> Constructor, fills corresponding members with values

### CubeCoordinates {q, r, s}

*static* **parse**(s: string): CubeCoordinates

>Parse a string of the form `${q}x${r}`, for  example `0x0` or `4x-1`.

*static* **distance**(coord1: CubeCoordinates, coord2: CubeCoordinates): number

> Distance between two hexes, assuming no obstructions

*static* **translated**(coord: CubeCoordinates, direction: Direction, n = 1): CubeCoordinates

> Coordinates of the hex translated `n` times in `direction`.