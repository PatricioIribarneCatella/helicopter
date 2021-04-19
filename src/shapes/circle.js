import { Curve } from '../curves/curve.js';

//
// Represents a 'Circle'
// that it's contained in the
// XY plane -> Normal: (0,0,1)
//
export class Circle extends Curve {
    constructor(radius) {
        super([]);
        this.r = radius;
        this.pos = [0.0, 0.0, 0.0];
    }

    /* private methods */

    _calculate(u) {
        var x, y, z;

        x = this.r * Math.cos(2 * Math.PI * u) + this.pos[0];
        y = this.r * Math.sin(2 * Math.PI * u) + this.pos[1];
        z = 0.0 + this.pos[2];

        return [x, y, z];
    }

    _calculateTangent(u) {
        var x, y, z, norm;

        x = -1 * this.r * 2 * Math.PI * Math.sin(2 * Math.PI * u);
        y = this.r * 2 * Math.PI * Math.cos(2 * Math.PI * u);
        z = 0.0;

        norm = Math.sqrt(x * x + y * y + z * z);

        return [x / norm, y / norm, z / norm];
    }

    _calculateNormal(u) {
        var x, y, z, norm;

        x = -2 * Math.PI * this.r * Math.cos(2 * Math.PI * u);
        y = -2 * Math.PI * this.r * Math.sin(2 * Math.PI * u);
        z = 0.0;

        norm = Math.sqrt(x * x + y * y + z * z);

        return [x / norm, y / norm, z / norm];
    }

    _calculateBinormal(u) {
        return [0.0, 0.0, 1.0];
    }

    /* public methods */

    move(pos) {
        this.pos = pos;
    }
}
