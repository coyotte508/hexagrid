import { Direction } from "./direction";

export interface CubeCoordinates {
    q: number,
    r: number,
    s: number
}

export namespace CubeCoordinates {
    export function translated(coord: CubeCoordinates, direction: Direction, n: number = 1): CubeCoordinates {
        const {q, r, s} = coord;
        switch (direction) {
            // 0, +
            case Direction.North: return {q, r: r + n, s: s - n};
            // +, 0
            case Direction.NorthEast: return {q: q + n, r, s: s - n};
            // +, -
            case Direction.SouthEast: return {q: q + n, r: r - n, s};
            // 0, -
            case Direction.South: return {q, r: r - n, s: s + n};
            // -, 0
            case Direction.SouthWest: return {q: q - n, r, s: s + n};
            // -, +
            case Direction.NorthWest: return {q: q - n, r: r + n, s};
            default: throw new TypeError("Wrong direction: " + direction);
        }
    }
}