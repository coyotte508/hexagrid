import Hex from "./hex";
import { Direction } from "./direction";
import { CubeCoordinates } from "./cubecoordinates";

export default class Grid<HexType extends Hex<any> = Hex<any>> {    
    private hexes: Map<string, HexType> = new Map();
    get size () : number { return this.hexes.size};

    constructor(...hexes: HexType[]) {
        this.push(...hexes);
    }

    /**
     * Merge other grids into the current grid
     * 
     * If any hex in the new grids overlap with hexes in the current grid, 
     * the older hexes are overwritten, similarly to what happens with `Object.assign`.
     * @param grids grids to merge into the current grid
     */
    merge(...grids: Grid<HexType>[]): Grid<HexType> {
        const [thisHexes, ...otherHexes] = [this, ...grids].map(grid => Array.from(grid.values()));

        this.hexes.clear();
        this.push(...thisHexes.concat(...otherHexes));

        return this;
    }

    /**
     * Adds a bunch of hexes to the grid
     * @param hexes 
     */
    push(...hexes: HexType[]) {
        for (let hex of hexes) {
            this.hexes.set(hex.toString(), hex);
        }
    }

    get(q: number, r: number): HexType {
        return this.hexes.get(`${q}x${r}`);
    }

    getS(coord: string): HexType {
        return this.hexes.get(coord);
    }

    neighbour(q: number, r: number, direction: Direction) {
        const coord = CubeCoordinates.translated({q, r, s: -q-r}, direction);
        return this.get(coord.r, coord.s);
    }

    neighbours(q: number, r: number, directions: number = Direction.all): HexType[] {
        const ret = <HexType[]>[];
        const center = {q, r, s: -q-r};
        for (let direction of Direction.list()) {
            if (direction & directions) {
                const {q, r} = CubeCoordinates.translated(center, direction);
                const hex = this.get(q, r);
                if ( hex ) {
                    ret.push(hex);
                }            
            }
        }

        return ret;
    }

    /**
     * Get the list of hexes forming the shortest path between two hexes (included)
     * 
     * The algorithm doesn't take into account direction, and thus can be improved
     * to be faster
     * 
     * @param q1 q coordinate of the first hex
     * @param r1 r coordinate of the first hex
     * @param q2 q coordinate of the last hex
     * @param r2 r coordinate of the last hex
     */
    path(q1: number, r1: number, q2: number, r2: number): HexType[] {
        // Stupid algorithm, with no heuristic

        const hex1 = this.get(q1, r1);
        const hex2 = this.get(q2, r2);

        if (!hex1 || !hex2) {
            return undefined;
        }

        const destCoord = hex2.toString();

        const pathTo: {[coord: string]: HexType[]} = {};
        pathTo[hex1.toString()] = [hex1];

        let toExpand = [hex1];
        let toExpandNext = [];

        while (!(destCoord in pathTo) && toExpand.length > 0) {
            for (const hex of toExpand) {
                const curPath = pathTo[hex.toString()];

                for (const neighbour of this.neighbours(hex.q, hex.r)) {
                    const dest = neighbour.toString();

                    if (pathTo[dest] && pathTo[dest].length <= curPath.length + 1) {
                        continue;
                    }

                    pathTo[dest] = [].concat(curPath, [neighbour]);
                    toExpandNext.push(neighbour);
                }
            }

            toExpand = toExpandNext;
            toExpandNext = [];
        }

        return pathTo[destCoord];
    }

    /**
     * Distance between two hexes. -1 if not possible
     * 
     * @param q1 
     * @param r1 
     * @param q2 
     * @param r2 
     */
    distance(q1: number, r1: number, q2: number, r2: number) {
        const path = this.path(q1, r1, q2, r2);

        return (path || []).length - 1;
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
    rotateLeft(times: number = 1, center?: CubeCoordinates): Grid<HexType> {
        this.hexes.forEach(hex => hex.rotateLeft(times, center));
        this.recalibrate();

        return this;
    }

    /**
     * Rotates the whole grid X times to the right, relative to center. 
     * 
     * Each rotation is 60°
     * 
     * @param times 
     * @param center The origin if not given
     */
    rotateRight(times: number = 1, center?: CubeCoordinates): Grid<HexType> {
        this.hexes.forEach(hex => hex.rotateRight(times, center));
        this.recalibrate();

        return this;
    }

    /**
     * Makes sure the underlying storage of Hexes is coherent, if 
     * any of their coordinates was changed since they were added
     */
    recalibrate(): Grid<HexType> {
        const array = Array.from(this.values());
        this.hexes.clear();
        this.push(...array);

        return this;
    }

    values(): IterableIterator<HexType> {
        return this.hexes.values();
    }

    toJSON(): Array<HexType> {
        return Array.from(this.values());
    }
}