import {CuadCurve, CubicCurve} from './curve.js';
import {CuadStretch, CubicStretch} from './stretch.js';

//
// BSpline cuadratic and cubic curves
//

//
// Cuadratic
//
export class BSplineCuad extends CuadCurve {

	constructor(points) {
		super(points);
		this._init();
	}

	_init() {
		
		var p0, p1, p2;
		var a, b, c;
		var at, bt;
		var ad;

		for (var i = 0; i <= this.points.length - 3; i++) {
			
			p0 = this.points[i];
			p1 = this.points[i+1];
			p2 = this.points[i+2];

			// position coefficients
			a = [p0[0]-p1[0]+p2[0], p0[1]-p1[1]+p2[1], p0[2]-p1[2]+p2[2]];
			b = [-2*p0[0]+p1[0], -2*p0[1]+p1[1], -2*p0[2]+p1[2]];
			c = p0;

			// tangent coefficients
			at = [2*p0[0]-2*p1[0]+p2[0], 2*p0[1]-2*p1[1]+p2[1], 2*p0[2]-2*p1[2]+p2[2]];
			bt = [-2*p0[0]+p1[0], -2*p0[1]+p1[1], -2*p0[2]+p1[2]];

			// second order derivate
			ad = [p0[0]-p1[0]+p2[0], p0[1]-p1[1]+p2[1], p0[2]-p1[2]+p2[2]];

			var s = new CuadStretch([a, b, c], [at, bt], ad);

			this.stretches.push(s);
		}
	}
}

//
// Cubic
//
export class BSplineCubic extends CubicCurve {

	constructor(points) {
		super(points);
		this._init();
	}

	_init() {
		var p0, p1, p2, p3;
		var a, b, c, d;
		var at, bt, ct;
		var ad, bd;

		for (var i = 0; i <= this.points.length - 4; i++) {
			
			p0 = this.points[i];
			p1 = this.points[i+1];
			p2 = this.points[i+2];
			p3 = this.points[i+3];
			
			// position coefficients
			a = [-p0[0]+3*p1[0]-3*p2[0]+p3[0], -p0[1]+3*p1[1]-3*p2[1]+p3[1], -p0[2]+3*p1[2]-3*p2[2]+p3[2]];
			b = [3*p0[0]-6*p1[0]+3*p2[0], 3*p0[1]-6*p1[1]+3*p2[1], 3*p0[2]-6*p1[2]+3*p2[2]];
			c = [-3*p0[0]-3*p2[0], -3*p0[1]-3*p2[1], -3*p0[2]-3*p2[2]];
			d = [p0[0]+4*p1[0]+p2[0], p0[1]+4*p1[1]+p2[1], p0[2]+4*p1[2]+p2[2]];

			// tangent coefficients
			at = [-3*p0[0]+9*p1[0]-9*p2[0]+3*p3[0], -3*p0[1]+9*p1[1]-9*p2[1]+3*p3[1], -3*p0[2]+9*p1[2]-9*p2[2]+3*p3[2]];
			bt = [6*p0[0]-12*p1[0]+6*p2[0], 6*p0[1]-12*p1[1]+6*p2[1], 6*p0[2]-12*p1[2]+6*p2[2]];
			ct = [-3*p0[0] -3*p2[0], -3*p0[1] -3*p2[1], -3*p0[2] -3*p2[2]];

			// second order derivate
			ad = [-p0[0]+3*p1[0]-3*p2[0]+p3[0], -p0[1]+3*p1[1]-3*p2[1]+p3[1], -p0[2]+3*p1[2]-3*p2[2]+p3[2]];
			bd = [p0[0]-2*p1[0]+p2[0], p0[1]-2*p1[1]+p2[1], p0[2]-2*p1[2]+p2[2]];
			
			var s = new CubicStretch([a, b, c, d], [at, bt, ct], [ad, bd]);

			this.stretches.push(s);
		}
	}
}

