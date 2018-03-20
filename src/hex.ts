import CubeCoordinates from "./cubecoordinates";

export default class Hex<Data=any> implements CubeCoordinates {
    constructor(public q: number = 0, public r: number = 0, public data: Data = null) {
        
    }

    get s(): number {
        return 0 - this.q - this.r;
    }

    toString() : string {
        return `${this.q}x${this.r}`;
    }

    static hexagon<Data>(radius: number) : Hex<Data>[] {
        const ret: Hex<Data>[][] = [];
        for (let r = radius; r >= 0; r--) {
            ret.push(Hex.ring(r));
        }
        return ([] as Hex<Data>[]).concat(...ret);
    }

    static ring<Data>(radius: number) : Hex<Data>[] {
        const ret: Hex<Data>[] = [];

        // flat N to NW
        for (let [q, r] = [0, radius]; r >= 0; r--, q++) {
            ret.push(new Hex(q,r));
        }
        // NW to SW
        for (let [q, r] = [radius, -1]; r >= -radius; r--) {
            ret.push(new Hex(q,r));
        }
        // SW to S
        for (let [q, r] = [radius-1, -radius]; q >= 0; q--) {
            ret.push(new Hex(q,r));
        }
        // S to SE
        for (let [q, r] = [-1, -radius+1]; q >= -radius; q--, r++) {
            ret.push(new Hex(q,r));
        }
        // SE to NE
        for (let [q, r] = [-radius, 1]; r <= radius; r++) {
            ret.push(new Hex(q,r));
        }
        // NE to N
        for (let [q, r] = [-radius+1, radius]; q < 0; q++) {
            ret.push(new Hex(q,r));
        }

        return ret;
    }
}