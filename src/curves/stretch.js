//
// Represents a stretch from
// a given curve
//
class Stretch {

	getPosCoeff() {
		return this.coeffs;
	}

	getTangCoeff() {
		return this.tcoeffs;
	}
}

export class CuadStretch extends Stretch {

	constructor(c, tc) {

		super();

		this.coeffs = {
			"a": c[0],
			"b": c[1],
			"c": c[2]
		};

		this.tcoeffs = {
			"a": tc[0],
			"b": tc[1]
		};
	}
}

export class CubicStretch extends Stretch {

	constructor(c, tc) {
	
		super();

		this.coeffs = {
			"a": c[0],
			"b": c[1],
			"c": c[2],
			"d": c[3]
		};

		this.tcoeffs = {
			"a": tc[0],
			"b": tc[1],
			"c": tc[2]
		};
	}
}

