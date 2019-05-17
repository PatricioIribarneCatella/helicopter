//
// Abstract class
// that represents a 'CURVE'
//
export class Curve {

	constructor(points) {
		this.points = points;
		this.stretches = [];
	}

	/* private methods */

	_linear(coeffs, u) {
		return [coeffs.a[0]*u + coeffs.b[0],
			coeffs.a[1]*u + coeffs.b[1],
			coeffs.a[2]*u + coeffs.b[2]];
	}

	_cuad(coeffs, u) {
		return [coeffs.a[0]*u*u + coeffs.b[0]*u + coeffs.c[0],
			coeffs.a[1]*u*u + coeffs.b[1]*u + coeffs.c[1],
			coeffs.a[2]*u*u + coeffs.b[2]*u + coeffs.c[2]];
	}

	_cubic(coeffs, u) {
		return [coeffs.a[0]*u*u*u + coeffs.b[0]*u*u + coeffs.c[0]*u + coeffs.d[0],
			coeffs.a[1]*u*u*u + coeffs.b[1]*u*u + coeffs.c[1]*u + coeffs.d[1],
			coeffs.a[2]*u*u*u + coeffs.b[2]*u*u + coeffs.c[2]*u + coeffs.d[2]];
	}

	/* public methods */

	get(u) {
		return this._calculate(u)
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
	
		if (this.stretches.length > 2) {
			console.log(u);
		}
		//console.log(this.stretches);
		//console.log(this.stretches.length);

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
		var norm = Math.sqrt(t[0]*t[0] + t[1]*t[1] + t[2]*t[2]);

		return [t[0] / norm, t[1] / norm, t[2] / norm];
	}

	_calculateNormal(u) {
		
		var b = this._calculateBinormal(u);
		var t = this._calculateTangent(u);

		var n = [];

		vec3.cross(n, b, t);

		var norm = Math.sqrt(n[0]*n[0] + n[1]*n[1] + n[2]*n[2]);

		return [n[0] / norm, n[1] / norm, n[2] / norm];
	}

	_calculateBinormal(u) {

		var s;

		if (u < 1) {
			var ug = u * this.stretches.length;

			var integer = Math.floor(ug);

			s = this.stretches[integer];
		} else {
			s = this.stretches[this.stretches.length - 1];
		}
	
		var sod = s.getSecOrdCoeff();

		var b = [];

		vec3.cross(b, this._calculateTangent(u), sod.a);

		var norm = Math.sqrt(b[0]*b[0] + b[1]*b[1] + b[2]*b[2]);

		return [b[0] / norm, b[1] / norm, b[2] / norm];
	}
}

export class CubicCurve extends Curve {

	constructor(points) {
		super(points);
	}

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
		
		return this._cubic(s.getPosCoeff(), fracc);
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
		
		var t = this._cuad(s.getTangCoeff(), fracc);

		var norm = Math.sqrt(t[0]*t[0] + t[1]*t[1] + t[2]*t[2]);

		return [t[0] / norm, t[1] / norm, t[2] / norm];
	}

	_calculateNormal(u) {
		
		var b = this._calculateBinormal(u);
		var t = this._calculateTangent(u);

		var n = [];

		vec3.cross(n, b, t);

		var norm = Math.sqrt(n[0]*n[0] + n[1]*n[1] + n[2]*n[2]);

		return [n[0] / norm, n[1] / norm, n[2] / norm];
	}

	_calculateBinormal(u) {
	
		var s, fracc;

		if (u < 1) {
			var ug = u * this.stretches.length;

			var integer = Math.floor(ug);
			fracc = ug - integer;

			s = this.stretches[integer];
		} else {
			s = this.stretches[this.stretches.length - 1];
			fracc = u;
		}
		
		var sod = s.getSecOrdCoeff();

		var b = [];

		vec3.cross(b, this._calculateTangent(u), this._linear(sod, fracc));

		var norm = Math.sqrt(b[0]*b[0] + b[1]*b[1] + b[2]*b[2]);

		return [b[0] / norm, b[1] / norm, b[2] / norm];
	}
}
