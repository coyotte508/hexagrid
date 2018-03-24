export enum Direction {
    North = 1,
    NorthEast = 2,
    SouthEast = 4,
    South = 8,
    SouthWest = 16,
    NorthWest = 32
}

export namespace Direction {
    export function list() {
        return [Direction.North, Direction.NorthEast, Direction.SouthEast,
            Direction.South, Direction.SouthWest, Direction.NorthWest];
    }

    export const all: number = Direction.North | Direction.NorthEast | Direction.SouthEast | Direction.South | Direction.SouthWest | Direction.NorthWest;
}