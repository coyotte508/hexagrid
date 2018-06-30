import {expect} from "chai";
import { CubeCoordinates } from "./cubecoordinates";

describe("Cubecoordinates", () => {
  it("distance", () => {
    const coord1 = new CubeCoordinates(0, 0);
    const coord2 = new CubeCoordinates(0, 1);
    const coord3 = new CubeCoordinates(1, -1);

    expect(CubeCoordinates.distance(coord1, coord2)).to.equal(1);
    expect(CubeCoordinates.distance(coord1, coord3)).to.equal(1);
    expect(CubeCoordinates.distance(coord2, coord3)).to.equal(2);
  });
});