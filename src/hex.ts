import CubeCoordinates from "./cubecoordinates";
import { loadDefaults, clone } from "./utils";

export default class Hex<Data=any> implements CubeCoordinates {
    constructor(public q: number = 0, public r: number = 0, public data: Data = null) {
        
    }

    get s(): number {
        return 0 - this.q - this.r;
    }

    toString() : string {
        return `${this.q}x${this.r}`;
    }

    static hexagon<Data>(radius: number, options?: {defaultData?: Data, data?: Data[]}) : Hex<Data>[] {
        const {defaultData, data} = loadDefaults(options, {defaultData: null, data: []});
        const ret: Hex<Data>[][] = [];
        let totalLength = 0;
        
        for (let r = radius; r >= 0; r--) {
            ret.push(Hex.ring(r, {defaultData, data: data.slice(totalLength)}));
            totalLength += ret[ret.length-1].length;
        }

        return ([] as Hex<Data>[]).concat(...ret);
    }

    static ring<Data>(radius: number, options?: {defaultData?: Data, data?: Data[]}) : Hex<Data>[] {
        const {defaultData, data} = loadDefaults(options, {defaultData: null, data: []});
        const ret: Hex<Data>[] = [];

        const feed: () => Data = () => ret.length < data.length ? data[ret.length] : clone(defaultData);

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
}