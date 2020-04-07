import Hex from "./hex";
import { Direction } from "./direction";
import { CubeCoordinates, CubeCoordinatesPartial } from "./cubecoordinates";

export default class Grid<HexType extends Hex<any> = Hex<any>> {
    private hexes: Map<string, HexType> = new Map();
    get size(): number { return this.hexes.size; }

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
    merge(...grids: Array<Grid<HexType>>): Grid<HexType> {
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
        for (const hex of hexes) {
            this.hexes.set(hex.toString(), hex);
        }
    }

    get(coord: CubeCoordinatesPartial): HexType {
        return this.hexes.get(`${coord.q}x${coord.r}`);
    }

    getS(coord: string): HexType {
        return this.hexes.get(coord);
    }

    neighbour(coord: CubeCoordinatesPartial, direction: Direction) {
        return this.get(CubeCoordinates.translated(coord, direction));
    }

    neighbours(center: CubeCoordinatesPartial, directions: number = Direction.all): HexType[] {
        const ret = <HexType[]> [];
        for (const direction of Direction.list()) {
            if (direction & directions) {
                const hex = this.get(CubeCoordinates.translated(center, direction));
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
     * Using A*
     *
     */
    path(coord1: CubeCoordinatesPartial, coord2: CubeCoordinatesPartial): HexType[] {
        const hex1 = this.get(coord1);
        const hex2 = this.get(coord2);

        if (!hex1 || !hex2) {
            return undefined;
        }

        // const testPath = this.easyPath(coord1, coord2);
        // if (testPath) {
        //     return testPath;
        // }

        const destCoord = hex2.toString();

        interface PathTo {
            [coord: string]: HexType[];
        }

        const allPaths: PathTo = {};
        const toExpand: {[minDist: number]: PathTo} = {};
        let toExpandNext: HexType[][] = [];

        const addPath = (path: HexType[]) => {
            const [last] = path.slice(-1);

            const minDist = CubeCoordinates.distance(last, hex2);
            toExpand[minDist] = toExpand[minDist] || {};
            toExpand[minDist][last.toString()] = path;
            allPaths[last.toString()] = path;
        };

        const readyNextIteration = () => {
            let minDistance = Number.POSITIVE_INFINITY;

            for (const key of Object.keys(toExpand)) {
                if (+key < minDistance) {
                    minDistance = +key;
                }
            }

            if (minDistance < Number.POSITIVE_INFINITY) {
                toExpandNext = Object.values(toExpand[minDistance]);
                delete toExpand[minDistance];
            } else {
                toExpandNext = [];
            }
        };

        addPath([hex1]);
        readyNextIteration();

        while (!(destCoord in allPaths) && toExpandNext.length > 0) {
            for (const path of toExpandNext) {
                const hex = path[path.length - 1];

                for (const neighbour of this.neighbours(hex)) {
                    if (allPaths[neighbour.toString()]) {
                        continue;
                    }

                    addPath([...path, neighbour]);
                }
            }

            readyNextIteration();
        }

        return allPaths[destCoord];
    }

    /**
     * Shortest path between two coordinates, stopping when obstacle
     * @param hex1
     * @param hex2
     */
    easyPath(coord1: CubeCoordinatesPartial, coord2: CubeCoordinatesPartial): HexType[] {
        const hex1 = this.get(coord1);
        const hex2 = this.get(coord2);

        if (!hex1 || !hex2) {
            return undefined;
        }

        const path = [hex1];

        let currentHex = hex1;

        while (currentHex.q !== hex2.q || currentHex.r !== hex2.r) {
            currentHex = this.neighbour(currentHex, CubeCoordinates.direction(currentHex, hex2));

            if (!currentHex) {
                return undefined;
            }

            path.push(currentHex);
        }

        return path;
    }

    /**
     * Distance between two hexes. -1 if not possible
     *
     */
    distance(hex1: CubeCoordinatesPartial, hex2: CubeCoordinatesPartial) {
        const path = this.path(hex1, hex2);

        return (path || []).length - 1;
    }

    /**
     * Removes a hex by its coordinates. Returns whether there
     * was a hex removed
     *
     * @param q
     * @param r
     */
    remove({q, r}: CubeCoordinatesPartial): boolean {
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
     * Separate the hexes given into groups.
     *
     * Each hex in a group can travel through to other
     * members of its group by going through only members
     * of its group.
     *
     * @param hexes
     */
    groups(hexes: HexType[]) {
        const hexSet = new Set(hexes);
        const groups: Array<Set<HexType>> = [];

        for (const hex of hexes) {
            // If the hex is already in a group
            if ((() => {
                for (const group of groups) {
                    if (group.has(hex)) {
                        return true;
                    }
                }
            })()) {
                continue;
            }

            const newGroup = new Set([hex]);
            let toExplore = new Set([hex]);
            let nextToExplore = new Set<HexType>();

            groups.push(newGroup);

            while (toExplore.size > 0) {
                for (const hex of toExplore) {
                    for (const nb of this.neighbours(hex)) {
                        if (newGroup.has(nb)) {
                            continue;
                        }

                        if (!hexSet.has(nb)) {
                            continue;
                        }

                        newGroup.add(nb);
                        nextToExplore.add(nb);
                    }
                }

                toExplore = nextToExplore;
                nextToExplore = new Set();
            }
        }

        return groups;
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

    toJSON(): HexType[] {
        return Array.from(this.values());
    }
}
