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

**push**(...hexes: HexType[]): HexType

> Adds a bunch of hexes to the grid

**remove**(hex: CubeCoordinates): HexType

> Remove the corresponding stored Hex in the grid and return it.

**recalibrate**(): void

> To call if you **manually** change the coordinates of an hex after it was added
> to the grid

**distance**(hex1: CubeCoordinates, hex2: CubeCoordinates): number

> Get the distance between two hexes of the grid. Returns `-1` if there's no path
between the two hexes, or if one of the two hexes doesn't belong to the
grid.
>
> To get a bird's eye distance, use `CubeCoordinates.distance()`.

**neighbour**(hex: CubeCoordinates, direction: Direction): HexType

> Gets the neighbour of an hex, or `undefined`.

**neighbours**(hex: CubeCoordinates, direction: number = Direction.all): HexType[]

> Gets the neighbours of an hex. You can use `Direction.NorthEast | Direction.South | Direction.SouthEast` to
> have multiple directions

**rotateLeft**(times: number = 1, center?: CubeCoordinates): Grid\<HexType>

> Rotates the whole grid counterclockwise relative to center. Each rotation is 60 °

**rotateRight**(times: number = 1, center?: CubeCoordinates): Grid\<HexType>

> Rotates the whole grid clockwise relative to center. Each rotation is 60 °

**groups**(hexes: HexType[]): Set\<HexType>[]

> Divides the givens hexes into groups. Each group is a set of adjacent hexes.

**merge**(...grids: Grid\<HexType>[]): Grid\<HexType>

> Merges other grids into the current grid.
>
> If hexes overlaps, the older hex is removed.

**path**(hex1: CubeCoordinates, hex2: CubeCoordinates): HexType[]

> Get the shortest path between two hexes. Includes starting & destination hexes.

**values**(): IterableIterator<HexType>

> An iterator over the hexes

get **size**(): number

> Number of hexes in the grid

### Hex<Data=any>  {q, r, s, data}

Implements the `CubeCoordinates` interface.

**Hex**(q: number = 0, r: number = 0, s: number = 0, data: Data = undefined)

> Constructor, fills corresponding members with values

**rotateLeft**(times: number = 1, center?: CubeCoordinates): void

> Rotates the hex counterclockwise relative to center. Each rotation is 60 °

**rotateRight**(times: number = 1, center?: CubeCoordinates): void

> Rotates the hex clockwise relative to center. Each rotation is 60 °

**hexagon\<Data>**(radius: number, options?: {center?: CubeCoordinates, data?: Data[]}) :Hex\<Data>[]

> Creates an hexagon with given radius, center, and each hex being initalized with data fed from `data` starting
> from the exterior ring of the hexagon

**ring\<Data>**(radius: number, options?: {center?: CubeCoordinates, data?: Data[]}) :Hex\<Data>[]

> Creates a ring with given radius, center, and each hex being initalized with data fed from `data` starting
> from the north hexagon in a clockwise manner

### CubeCoordinates {q, r, s}

*static* **parse**(s: string): CubeCoordinates

>Parse a string of the form `${q}x${r}`, for  example `0x0` or `4x-1`.

*static* **distance**(coord1: CubeCoordinates, coord2: CubeCoordinates): number

> Distance between two hexes, assuming no obstructions

*static* **translated**(coord: CubeCoordinates, direction: Direction, n = 1): CubeCoordinates

> Coordinates of the hex translated `n` times in `direction`.

*static* **direction**(coord1: CubeCoordinates, coord2: CubeCoordinates): Direction

> One of the possible directions in order to get closer to coord2 from coord1
*static* **toString**(coord: CubeCoordinates): string

> Opposite of `parse`

### Direction {North, NorthEast, SouthEast, South, SouthWest, NorthWest, all}

*static* **list**(): Direction[]

> Returns an array containing each direction

