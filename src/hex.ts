import { CubeCoordinates } from "./cubecoordinates";
import { loadDefaults, clone } from "./utils";

export default class Hex<Data=any> implements CubeCoordinates {
    constructor(public q: number = 0, public r: number = 0, public data?: Data) {
        
    }

    get s(): number {
        return 0 - this.q - this.r;
    }

    rotateRight(times: number = 1, _center?: CubeCoordinates) {
        // Deal with negative and positive numbers
        times = (times % 6 + 6) % 6;
        const center = _center? {q: _center.q, r: _center.r} : {q: 0, r: 0};

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

    rotateLeft(times: number = 1, center?: CubeCoordinates) {
        this.rotateRight(-times, center);
    }

    toString() : string {
        return `${this.q}x${this.r}`;
    }

    toJSON(): CubeCoordinates & {data?: Data} {
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

        const feed: () => Data | undefined = () => ret.length < data.length ? data[ret.length] : undefined;

        // flat N to NE
        for (let [q, r] = [radius, 0]; q >= 0; q--, r++) {
            ret.push(new this(q,r,feed()));
        }
        // NE to SE
        for (let [q, r] = [-1, radius]; q >= -radius; q--) {
            ret.push(new this(q,r,feed()));
        }
        // SE to S
        for (let [q, r] = [-radius, radius-1]; r >= 0; r--) {
            ret.push(new this(q,r,feed()));
        }
        // S to SW
        for (let [q, r] = [-radius+1, -1]; r >= -radius; r--, q++) {
            ret.push(new this(q,r,feed()));
        }
        // SW to NW
        for (let [q, r] = [1, -radius]; q <= radius; q++) {
            ret.push(new this(q,r,feed()));
        }
        // NW to N
        for (let [q, r] = [radius, -radius+1]; r < 0; r++) {
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
                if (typeof defaultData === "object") {
                    super(q, r, Object.assign({}, defaultData, data));
                } else {
                    super(q, r, data === undefined ? defaultData : <Data>data);
                }
            }
        }
    }
}