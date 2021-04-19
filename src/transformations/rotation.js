//
// Represents a Rotation
//
export class Rotation {

	constructor(axis, init_angle, increment) {

		this.raxis = axis;
		this.angle = init_angle;
		this.increment = increment;

		this.modelMatrix = mat4.create();

		this._init();
	}

	/* private methods */

	_init() {
		// initialize rotation matrix
		mat4.identity(this.modelMatrix);
		mat4.rotate(this.modelMatrix,
			    this.modelMatrix,
			    this.angle,
			    this.raxis);
	}

	/* public methods */

	update(controller) {

		this.angle += this.increment;

		mat4.identity(this.modelMatrix);
		
		mat4.rotate(this.modelMatrix,
			    this.modelMatrix,
			    this.angle,
			    this.raxis);
	}

	getMatrix() {
		return this.modelMatrix;
	}
}

