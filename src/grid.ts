import Hex from "./hex";
import CubeCoordinates from "./cubecoordinates";

export default class Grid<Data=any> {    
    private hexes: Map<string, Hex<Data>> = new Map();
    get size () : number { return this.hexes.size};

    constructor(...hexes: Hex<Data>[]) {
        this.push(...hexes);
    }

    /**
     * Merge other grids into the current grid
     * 
     * If any hex in the new grids overlap with hexes in the current grid, 
     * the older hexes are overwritten, similarly to what happens with `Object.assign`.
     * @param grids grids to merge into the current grid
     */
    merge(...grids: Grid<Data>[]) {
        const [thisHexes, ...otherHexes] = [this, ...grids].map(grid => Array.from(grid.values()));

        this.hexes.clear();
        this.push(...thisHexes.concat(...otherHexes));
    }

    /**
     * Adds a bunch of hexes to the grid
     * @param hexes 
     */
    push(...hexes: Hex<Data>[]) {
        for (let hex of hexes) {
            this.hexes.set(hex.toString(), hex);
        }
    }

    get(q: number, r: number): Hex<Data> {
        return this.hexes.get(`${q}x${r}`);
    }

    /**
     * Removes a hex by its coordinates. Returns whether there 
     * was a hex removed
     * 
     * @param q 
     * @param r 
     */
    remove(q: number, r: number): boolean {
        return this.hexes.delete(`${q}x${r}`);
    }

    /**
     * Rotates the whole grid X times to the left, relative to center. 
     * 
     * Each rotation is 60°
     * 
     * @param times 
     * @param center The origin if not given
     */
    rotateLeft(times: number = 1, center?: CubeCoordinates) {
        this.hexes.forEach(hex => hex.rotateLeft(times, center));
        this.recalibrate();
    }

    /**
     * Rotates the whole grid X times to the right, relative to center. 
     * 
     * Each rotation is 60°
     * 
     * @param times 
     * @param center The origin if not given
     */
    rotateRight(times: number = 1, center?: CubeCoordinates) {
        this.hexes.forEach(hex => hex.rotateRight(times, center));
        this.recalibrate();
    }

    /**
     * Makes sure the underlying storage of Hexes is coherent, if 
     * any of their coordinates was changed since they were added
     */
    recalibrate() {
        const array = Array.from(this.values());
        this.hexes.clear();
        this.push(...array);
    }

    values(): IterableIterator<Hex<Data>> {
        return this.hexes.values();
    }
}