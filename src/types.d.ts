// Custom type declarations for packages without TypeScript definitions

declare module '@mapbox/point-geometry' {
  export default class Point {
    x: number;
    y: number;
    constructor(x: number, y: number);
    clone(): Point;
    add(p: Point): Point;
    sub(p: Point): Point;
    mult(k: number): Point;
    div(k: number): Point;
    rotate(a: number): Point;
    matMult(m: number[]): Point;
    unit(): Point;
    perp(): Point;
    round(): Point;
    mag(): number;
    equals(p: Point): boolean;
    dist(p: Point): number;
    distSqr(p: Point): number;
    angle(): number;
    angleTo(p: Point): number;
    angleWith(p: Point): number;
    angleWithSep(x: number, y: number): number;
  }
}

declare module '@mapbox/vector-tile' {
  export class VectorTile {
    constructor(pbf: any, end?: number);
    layers: { [key: string]: VectorTileLayer };
  }

  export class VectorTileLayer {
    constructor(pbf: any, end?: number);
    version: number;
    name: string;
    extent: number;
    length: number;
    feature(i: number): VectorTileFeature;
  }

  export class VectorTileFeature {
    constructor(pbf: any, end?: number, extent: number, keys: string[], values: any[]);
    properties: { [key: string]: any };
    extent: number;
    type: number;
    id: number | undefined;
    loadGeometry(): Array<Array<{ x: number; y: number }>>;
    bbox(): [number, number, number, number];
    toGeoJSON(x: number, y: number, z: number): any;
  }
}