import Hex from "./hex";

export default class Grid<Data=any> {
    constructor(...hexes: Hex<Data>[]) {
        for (let hex of hexes) {
            this.hexes.set(hex.toString(), hex);
        }
    }

    hexes: Map<string, Hex<Data>> = new Map();
}