import {expect} from "chai";
import { clone } from "./utils";

describe("clone", () => {
    it("should clone an object", () => {
        const base = {a: 1, b: 'c'};

        expect(clone(base)).to.not.equal(base);
        expect(clone(base)).to.deep.equal(base);
    });

    it("should clone a number", () => {
        expect(clone(1)).to.equal(1);
    });

    it("should clone an array", () => {
        const arr = [1,4,3];

        expect(clone(arr)).to.have.ordered.members([1,4,3]).but.not.equal(arr);
    });
});