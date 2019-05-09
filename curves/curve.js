//
// Abstract class
// that represents a 'CURVE'
//
export class Curve {

	constructor(points) {
		this.points = points;
		this.stretches = [];
	}

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

