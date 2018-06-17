import {expect} from "chai";
import Grid from "./grid";
import Hex from "./hex";

describe("Grid", () => {
    it ("should be able to get individual hexes", () => {
        const grid = new Grid<string>(new Hex(2, -1, "Hello"), new Hex(2, 0, "World"));
        expect(grid.get(2, 1)).to.be.undefined;
        expect(grid.get(2, 0).data).to.equal("World");
        expect(grid.get(2, -1).data).to.equal("Hello");
    });

    it ("should overwrite hex at same position and have consistent size", () => {
        const grid = new Grid<string>();
        expect(grid.size).to.equal(0);

        grid.push(new Hex(0, 2), new Hex(4, -2, "Hi"));
        expect(grid.size).to.equal(2);

        grid.push(new Hex(1, 2), new Hex(4, -2, "Boy"));
        expect(grid.size).to.equal(3);

        expect(grid.get(4, -2).data).to.equal("Boy");
    });

    it ("should be able to remove hexes", () => {
        const grid = new Grid(...Hex.ring(2));
        expect(grid.size).to.equal(12);

        grid.remove(-2, 0);
        expect(grid.size).to.equal(11);

        grid.push(new Hex(-2, 0));
        expect(grid.size).to.equal(12);
    });

    it ("should be able to rotate fully", () => {
        const grid = new Grid(...Hex.hexagon(1));
        expect(grid.size).to.equal(7);
        
        grid.remove(1, 0);
        grid.get(0, 1).data = "Single data";
        expect(grid.size).to.equal(6);

        grid.rotateLeft(3);
        expect(grid.get(-1, 0)).to.be.undefined;
        expect(grid.get(0, -1).data).to.equal("Single data");
        expect(grid.size).to.equal(6);
        
        grid.push(new Hex(0, -1, "newer"));
        expect(grid.size).to.equal(6);
        expect(grid.get(0, -1).data).to.equal("newer");
    });

    it ("should be able to recalibrate", () => {
        const grid = new Grid(new Hex(-2, 0), new Hex(1, 1, "ola"));
        
        grid.get(1, 1).r = 2;
        grid.recalibrate();
        
        expect(grid.get(1, 1)).to.be.undefined;
        expect(grid.get(1, 2).data).to.equal("ola");
    });

    it ("should be able to find neighbours", () => {
        const grid = new Grid(...Hex.ring(1));

        expect(grid.neighbours(0, 0).length).to.equal(6);
        expect(grid.neighbours(1, 0).length).to.equal(2);
    });

    describe("distance", () => {
        it ("should return 0 if the starting point and end are the same", () => {
            const grid = new Grid(...Hex.hexagon(1));

            expect(grid.distance(1,0,1,0)).to.equal(0);
        });

        it ("should return the distance between two hexagons", () => {
            const grid = new Grid(...Hex.hexagon(1), ...Hex.ring(1, {center: {q: 10, r: 0, s: -10}}));

            expect(grid.distance(1,0,0,0)).to.equal(1);
            expect(grid.distance(1,0,-1,0)).to.equal(2);
            expect(grid.distance(11,0,9,0)).to.equal(3);
        });

        it ("should return -1 if there's no path", () => {
            const grid = new Grid(...Hex.hexagon(1), ...Hex.hexagon(1, {center: {q: 10, r: 0, s: -10}}));

            expect(grid.distance(0, 0, 10, 0)).to.equal(-1);
            expect(grid.distance(-5,0,-5,0)).to.equal(-1);
            expect(grid.distance(10, 1, 10, 0)).to.equal(1);
        });
    })
});