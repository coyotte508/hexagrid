import {expect} from "chai";
import Hex from "./hex";

describe("Hex", () => {
    it ("should rotate left", () => {
        const hex = new Hex(-3, 2);

        hex.rotateLeft(2);
        expect(hex).to.include({q: 1, r: -3});
        hex.rotateLeft(4);
        expect(hex).to.include({q: -3, r: 2});
    });

    it ("should rotate left with center", () => {
        const hex = new Hex(-3, 2);

        hex.rotateLeft(3, {q: -3, r: 2, s: 1});
        expect(hex).to.include({q: -3, r: 2});
        hex.rotateLeft(1, {q: -2, r: 1, s: 1});
        expect(hex).to.include({q: -3, r: 1});
    });

    it ("should have a third coordinate s", () => {
        const hex = new Hex(-3, 2);

        expect(hex.s).to.equal(1);
    });

    it ("should have all three coordinates in the JSON object", () => {
        const hex = new Hex(5, -3);

        const json = JSON.parse(JSON.stringify(hex));
        expect(json).to.include({q: 5, r: -3, s: -2});
    });
});