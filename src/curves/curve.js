//
// Abstract class
// that represents a 'CURVE'
//
export class Curve {
    constructor(points) {
        this.pos = [0.0, 0.0, 0.0];
        this.points = points;
        this.stretches = [];
    }

    /* private methods */

    _linear(coeffs, u) {
        return [
            coeffs.a[0] * u + coeffs.b[0],
            coeffs.a[1] * u + coeffs.b[1],
            coeffs.a[2] * u + coeffs.b[2],
        ];
    }

    _cuad(coeffs, u) {
        return [
            coeffs.a[0] * u * u + coeffs.b[0] * u + coeffs.c[0],
            coeffs.a[1] * u * u + coeffs.b[1] * u + coeffs.c[1],
            coeffs.a[2] * u * u + coeffs.b[2] * u + coeffs.c[2],
        ];
    }

    _cubic(coeffs, u) {
        return [
            coeffs.a[0] * u * u * u + coeffs.b[0] * u * u + coeffs.c[0] * u + coeffs.d[0],
            coeffs.a[1] * u * u * u + coeffs.b[1] * u * u + coeffs.c[1] * u + coeffs.d[1],
            coeffs.a[2] * u * u * u + coeffs.b[2] * u * u + coeffs.c[2] * u + coeffs.d[2],
        ];
    }

    _calculateNormal(u) {
        var t = this._calculateTangent(u);
        var n = [-t[1], t[0], t[2]];

        var norm = Math.sqrt(n[0] * n[0] + n[1] * n[1] + n[2] * n[2]);

        return [n[0] / norm, n[1] / norm, n[2] / norm];
    }

    _calculateBinormal(u) {
        return [0.0, 0.0, 1.0];
    }

    /* public methods */

    move(pos) {
        this.pos = pos;
    }

    get(u) {
        var v = this._calculate(u);

        return [v[0] + this.pos[0], v[1] + this.pos[1], v[2] + this.pos[2]];
    }

    getTangent(u) {
        return this._calculateTangent(u);
    }

    getNormal(u) {
        return this._calculateNormal(u);
    }

    getBinormal(u) {
        return this._calculateBinormal(u);
    }
}

export class CuadCurve extends Curve {
    constructor(points) {
        super(points);
    }

    /* private methods */

    _calculate(u) {
        var s, fracc;

        if (u < 1) {
            u = u * this.stretches.length;

            var integer = Math.floor(u);
            fracc = u - integer;

            s = this.stretches[integer];
        } else {
            s = this.stretches[this.stretches.length - 1];
            fracc = u;
        }

        return this._cuad(s.getPosCoeff(), fracc);
    }

    _calculateTangent(u) {
        var s, fracc;

        if (u < 1) {
            u = u * this.stretches.length;

            var integer = Math.floor(u);
            fracc = u - integer;

            s = this.stretches[integer];
        } else {
            s = this.stretches[this.stretches.length - 1];
            fracc = u;
        }

        var t = this._linear(s.getTangCoeff(), fracc);
        var norm = Math.sqrt(t[0] * t[0] + t[1] * t[1] + t[2] * t[2]);

        return [t[0] / norm, t[1] / norm, t[2] / norm];
    }
}

export class CubicCurve extends Curve {
    constructor(points) {
        super(points);
    }

    _calculate(u) {
        var s, fracc;

        if (u < 1) {
            var ux = u * this.stretches.length;

            var integer = Math.floor(ux);
            fracc = ux - integer;

            s = this.stretches[integer];
        } else {
            s = this.stretches[this.stretches.length - 1];
            fracc = u;
        }

        return this._cubic(s.getPosCoeff(), fracc);
    }

    _calculateTangent(u) {
        var s, fracc;

        if (u < 1) {
            var ux = u * this.stretches.length;

            var integer = Math.floor(ux);
            fracc = ux - integer;

            s = this.stretches[integer];
        } else {
            s = this.stretches[this.stretches.length - 1];
            fracc = u;
        }

        var t = this._cuad(s.getTangCoeff(), fracc);

        var norm = Math.sqrt(t[0] * t[0] + t[1] * t[1] + t[2] * t[2]);

        return [t[0] / norm, t[1] / norm, t[2] / norm];
    }
}
