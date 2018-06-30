import { Direction } from "./direction";

export interface CubeCoordinates {
    q: number,
    r: number,
    s: number
}

export class CubeCoordinates implements CubeCoordinates {
    public s: number;
    
    constructor(public q = 0, public r = 0) {
        this.s = -q - r;
    }
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
}