import {expect} from "chai";
import Hex from "./hex";

describe("Hex", () => {
    it ("should rotate left", () => {
        const hex = new Hex(-3, 2);
        hex.rotateLeft(2);
        expect(hex).to.include({q: 2, r: 1});
        hex.rotateLeft(4);
        expect(hex).to.include({q: -3, r: 2});
    });

    it ("should rotate right with center", () => {
        const hex = new Hex(-3, 2);

        hex.rotateRight(3, {q: -3, r: 2, s: 1});
        expect(hex).to.include({q: -3, r: 2});
        hex.rotateRight(1, {q: -2, r: 1, s: 1});
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

    it ("should generate hexagons with data feeding", () => {
        const HexNone = Hex.extend("none");
        const hexaNone = HexNone.hexagon(1);
        expect(hexaNone.map(hex => hex.data)).to.have.same.members(["none","none","none","none","none","none","none"]);

        const hexaAbcdefg = Hex.hexagon(1, {data: ["a","b","c","d","e","f","g"]});
        expect(hexaAbcdefg.map(hex => hex.data)).to.have.same.members(["a","b","c","d","e","f","g"]);

        const HexA = Hex.extend({a: 5});
        const data = [{a:1}, {a: 2}];
        const ringA = HexA.ring(1, {data});
        expect(ringA.map(hex => hex.data)).to.include.deep.members([{a:1}, {a: 2}, {a: 5}]);
    });
});