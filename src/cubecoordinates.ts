import { Direction } from "./direction";

export interface CubeCoordinates {
    q: number,
    r: number,
    s: number
}

export interface CubeCoordinatesPartial {
    q: number,
    r: number
}

export class CubeCoordinates implements CubeCoordinates {
    public s: number;
    
    constructor(public q = 0, public r = 0) {
        this.s = -q - r;
    }
}

export namespace CubeCoordinates {
    export function translated(coord: CubeCoordinatesPartial, direction: Direction, n: number = 1): CubeCoordinates {
        const {q, r} = coord;
        const s = -q -r;
        // q is up, r is diagonal up right.
        switch (direction) {
            // +, 0
            case Direction.North: return {r, q: q + n, s: s - n};
            // 0, +
            case Direction.NorthEast: return {r: r + n, q, s: s - n};
            // -, +
            case Direction.SouthEast: return {r: r + n, q: q - n, s};
            // -, 0
            case Direction.South: return {r, q: q - n, s: s + n};
            // 0, -
            case Direction.SouthWest: return {r: r - n, q, s: s + n};
            // +, -
            case Direction.NorthWest: return {r: r - n, q: q + n, s};
            default: throw new TypeError("Wrong direction: " + direction);
        }
    }

    export function parse(str: string) {
        const spl = str.split("x");

        const q = +spl[0];
        const r = +spl[1];
        const s = -q-r;

        return {q, r, s};
    }

    export function distance(coord1: CubeCoordinates, coord2: CubeCoordinates) {
        return (Math.abs(coord1.q-coord2.q) + Math.abs(coord1.r-coord2.r) + Math.abs(coord1.s-coord2.s)) / 2;
    }
    
    export function toString(coord: CubeCoordinates) {
        return `${coord.q}x${coord.r}`;
    }
}