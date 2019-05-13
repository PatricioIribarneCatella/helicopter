//
// Represents a stretch from
// a given curve
//
class Stretch {

	constructor(coeffs, tcoeffs, sdcoeffs) {
	}

	getPosCoeff() {
		return this.coeffs;
	}

	getTangCoeff() {
		return this.tcoeffs;
	}

	getSecOrdCoeff() {
		return this.sdcoeffs;
	}
}

export class CuadStretch extends Stretch {

	constructor(coeffs, tcoeffs, sdcoeffs) {
	
		this.coeffs = {
			"a": coeffs[0],
			"b": coeffs[1],
			"c": coeffs[2]
		};

		this.tcoeffs = {
			"a": tcoeffs[0],
			"b": tcoeffs[1]
		};

		this.sdcoeffs = {
			"a": sdcoeffs
		};
	}
}

export class CubicStretch extends Stretch {

	constructor(coeffs, tcoeffs, sdcoeffs) {
	
		this.coeffs = {
			"a": coeffs[0],
			"b": coeffs[1],
			"c": coeffs[2],
			"d": coeffs[3]
		};

		this.tcoeffs = {
			"a": tcoeffs[0],
			"b": tcoeffs[1],
			"c": tcoeffs[2]
		};

		this.sdcoeffs = {
			"a": sdcoeffs[0],
			"b": sdcoeffs[1]
		};
	}
}

