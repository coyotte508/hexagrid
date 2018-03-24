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

    toJSON(): CubeCoordinates & {data: Data} {
        return {
            q: this.q,
            r: this.r,
            s: this.s,
            data: this.data
        };
    }

    /**
     * Creates an hexagon of radius r around options.center, feeding the data supplied. 
     * 
     * A radius of 0 gives a single hexagon
     * @param radius 
     * @param options 
     */
    static hexagon<Data>(radius: number, options?: {center?: CubeCoordinates, data?: Data[]}) : Hex<Data>[] {
        const {center, data} = loadDefaults(options, {data: [], center: {q: 0, r: 0, s: 0}});
        const ret: Hex<Data>[][] = [];
        let totalLength = 0;
        
        for (let r = radius; r >= 0; r--) {
            ret.push(this.ring(r, {center, data: data.slice(totalLength)}));
            totalLength += ret[ret.length-1].length;
        }

        return ([] as Hex<Data>[]).concat(...ret);
    }

    /**
     * Creates a ring of radius r around options.center, feeding the data supplied
     * 
     * @param radius 
     * @param options
     */
    static ring<Data>(radius: number, options?: {center?: CubeCoordinates, data?: Data[]}) : Hex<Data>[] {
        const {center, data} = loadDefaults(options, {data: [], center: {q: 0, r: 0, s: 0}});
        const ret: Hex<Data>[] = [];

        const feed: () => Data = () => ret.length < data.length ? data[ret.length] : null;

        // flat N to NW
        for (let [q, r] = [0, radius]; r >= 0; r--, q++) {
            ret.push(new this(q,r,feed()));
        }
        // NW to SW
        for (let [q, r] = [radius, -1]; r >= -radius; r--) {
            ret.push(new this(q,r,feed()));
        }
        // SW to S
        for (let [q, r] = [radius-1, -radius]; q >= 0; q--) {
            ret.push(new this(q,r,feed()));
        }
        // S to SE
        for (let [q, r] = [-1, -radius+1]; q >= -radius; q--, r++) {
            ret.push(new this(q,r,feed()));
        }
        // SE to NE
        for (let [q, r] = [-radius, 1]; r <= radius; r++) {
            ret.push(new this(q,r,feed()));
        }
        // NE to N
        for (let [q, r] = [-radius+1, radius]; q < 0; q++) {
            ret.push(new this(q,r,feed()));
        }

        for (let hex of ret) {
            hex.q += center.q;
            hex.r += center.r;
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