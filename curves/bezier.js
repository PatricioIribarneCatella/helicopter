import {Curve} from './curve.js';
import {CuadStretch, CubicStretch} from './stretch.js';

//
// Bezier cuadratic and cubic curves
//

//
// Cuadratic:
//   If len(points) + 1 % 3 == 0
//   its correct
//
export class BezierCuad extends Curve {

	constructor(points) {
		super(points);
		this._init();
	}

	_init() {

		var p0, p1, p2;
		var a, b, c;
		var at, bt;

		for (var i = 0; i < this.points.lenght; i += 2) {
			
			p0 = this.points[i];
			p1 = this.points[i+1];
			p2 = this.points[i+2];
			
			// position coefficients
			a = p0 - 2*p1 + p2;
			b = -2*p0 + 2*p1;
			c = p0;

			// tangent coefficients
			at = 2*p0 - 2*p1 + 2*p2;
			bt = -2*p0 + 2*p1;

			var s = new CuadStretch([a, b, c], [at, bt]);

			this.stretches.push(s);
		}
	}

	_cuad(coeffs, u) {
		return coeffs.a*u*u + coeffs.b*u + coeffs.c;
	}

	_linear(coeffs, u) {
		return coeffs.a*u + coeffs.b;
	}

	_calculate(u) {
		
		u = u * this.stretches.lenght;
		
		var integer = Math.floor(u);
		var fracc = u - integer;

		var s = this.stretches[integer];

		return this._cuad(s.getPosCoeff(), fracc);
	}

	_calculateTangent(u) {
		
		u = u * this.stretches.lenght;
		
		var integer = Math.floor(u);
		var fracc = u - integer;

		var s = this.stretches[integer];

		return this._linear(s.getTangCoeff(), fracc);
	}
}

//
// Cubic:
//   If len(points) + 1 % 4 == 0
//   its correct
//
export class BezierCubic extends Curve {

	constructor(points) {
		super(points);
		this._init();
	}

	_init() {
		
		var p0, p1, p2, p3;
		var a, b, c, d;
		var at, bt, ct;

		for (var i = 0; i < this.points.lenght; i += 3) {
			
			p0 = this.points[i];
			p1 = this.points[i+1];
			p2 = this.points[i+2];
			p3 = this.points[i+3];
			
			// position coefficients
			a = -p0 - 3*p1 - 3*p2 + p3;
			b = 3*p0 - 6*p1 + 3*p2;
			c = -3*p0 + 3*p1;
			d = p0

			// tangent coefficients
			at = -3*p0 + 9*p1 - 9*p2 + 3*p3;
			bt = 6*p0 - 12*p1 + 6*p2;
			ct = -3*p0 + 3*p1;

			var s = new CubicStretch([a, b, c, d], [at, bt, ct]);

			this.stretches.push(s);
		}
	}

	_cubic(coeffs, u) {
		return coeffs.a*u*u*u + coeffs.b*u*u + coeffs.c*u + coeffs.d;
	}

	_cuad(coeffs, u) {
		return coeffs.a*u*u + coeffs.b*u + coeffs.c;
	}

	_calculate(u) {
		
		u = u * this.stretches.lenght;
		
		var integer = Math.floor(u);
		var fracc = u - integer;

		var s = this.stretches[integer];

		return this._cubic(s.getPosCoeff(), fracc);
	}

	_calculateTangent(u) {
	
		u = u * this.stretches.lenght;
		
		var integer = Math.floor(u);
		var fracc = u - integer;

		var s = this.stretches[integer];

		return this._cuad(s.getTangCoeff(), fracc);
	}
}

