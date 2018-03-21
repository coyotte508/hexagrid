import Hex from "./hex";
import CubeCoordinates from "./cubecoordinates";

export default class Grid<Data=any> {    
    private hexes: Map<string, Hex<Data>> = new Map();
    get size () : number { return this.hexes.size};

    constructor(...hexes: Hex<Data>[]) {
        for (let hex of hexes) {
            this.hexes.set(hex.toString(), hex);
        }
    }

    merge(...grids: Grid<Data>[]) {
        for (let grid of grids) {
            grid.hexes.forEach((val, key) => {
                this.hexes.set(key, val);
            });
        }
    }

    rotateLeft(times: number = 1, center?: CubeCoordinates) {
        this.hexes.forEach(hex => hex.rotateLeft(times, center));
    }

    rotateRight(times: number = 1, center?: CubeCoordinates) {
        this.hexes.forEach(hex => hex.rotateRight(times, center));
    }
}