//
// Abstract class
// that represents a 'CURVE'
//
export class Curve {

	constructor(points) {
		this.points = points;
	}

	get(u) {
		return this._calculate(u)
	}

	getTangent(u) {
		return this._calculateTangent(u);
	}
}

