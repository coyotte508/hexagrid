import CubeCoordinates from "./cubecoordinates";
import { loadDefaults, clone } from "./utils";

export default class Hex<Data=any> implements CubeCoordinates {
    constructor(public q: number = 0, public r: number = 0, public data: Data = null) {
        
    }

    get s(): number {
        return 0 - this.q - this.r;
    }

    rotateLeft(times: number = 1, center?: CubeCoordinates) {
        // Deal with negative and positive numbers
        times = (times % 6 + 6) % 6;

        if (center) {
            [this.q, this.r] = [this.q - center.q, this.r - center.r];
        }

        switch(times) {
            case 0: break;
            case 1: [this.q, this.r] = [-this.r, -this.s]; break;
            case 2: [this.q, this.r] = [this.s, this.q]; break;
            case 3: [this.q, this.r] = [-this.q, -this.r]; break;
            case 4: [this.q, this.r] = [this.r, this.s]; break;
            case 5: [this.q, this.r] = [-this.s, -this.q]; break;
            default: throw new TypeError("Hex.rotateLeft should have an integer as parameter");
        }

        if (center) {
            [this.q, this.r] = [this.q + center.q, this.r + center.r];    
        }
    }

    rotateRight(times: number = 1, center?: CubeCoordinates) {
        this.rotateLeft(-times, center);
    }

    toString() : string {
        return `${this.q}x${this.r}`;
    }

    /**
     * Creates an hexagon of radius r, feeding the data supplied. 
     * 
     * 0 is a single hexagon
     * @param radius 
     * @param options 
     */
    static hexagon<Data>(radius: number, options?: {data?: Data[]}) : Hex<Data>[] {
        const {data} = loadDefaults(options, {data: []});
        const ret: Hex<Data>[][] = [];
        let totalLength = 0;
        
        for (let r = radius; r >= 0; r--) {
            ret.push(this.ring(r, {data: data.slice(totalLength)}));
            totalLength += ret[ret.length-1].length;
        }

        return ([] as Hex<Data>[]).concat(...ret);
    }

    static ring<Data>(radius: number, options?: {data?: Data[]}) : Hex<Data>[] {
        const {data} = loadDefaults(options, {data: []});
        const ret: Hex<Data>[] = [];

        const feed: () => Data = () => ret.length < data.length ? data[ret.length] : null;

        // flat N to NW
        for (let [q, r] = [0, radius]; r >= 0; r--, q++) {
            ret.push(new Hex(q,r,feed()));
        }
        // NW to SW
        for (let [q, r] = [radius, -1]; r >= -radius; r--) {
            ret.push(new Hex(q,r,feed()));
        }
        // SW to S
        for (let [q, r] = [radius-1, -radius]; q >= 0; q--) {
            ret.push(new Hex(q,r,feed()));
        }
        // S to SE
        for (let [q, r] = [-1, -radius+1]; q >= -radius; q--, r++) {
            ret.push(new Hex(q,r,feed()));
        }
        // SE to NE
        for (let [q, r] = [-radius, 1]; r <= radius; r++) {
            ret.push(new Hex(q,r,feed()));
        }
        // NE to N
        for (let [q, r] = [-radius+1, radius]; q < 0; q++) {
            ret.push(new Hex(q,r,feed()));
        }

        return ret;
    }

    /**
     * Creates a child class that extends Hex, and initializes by default
     * with data = `defaultData`
     * 
     * @param defaultData 
     */
    static extend<Data>(defaultData: Data) {
        return class ExtendedHex extends this<Data> {
            constructor(q: number, r: number, data?: Partial<Data>) {
                super(q, r, Object.assign({}, data, defaultData));
            }
        }
    }
}