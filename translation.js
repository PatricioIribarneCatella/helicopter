//
// Represents a Translation
// |
export class Translation {
	
	constructor(position) {

		this.position = position;
	
		this.modelMatrix = mat4.create();

		this._init();
	}

	/* private methods */

	_init() {
		// initialize rotation matrix
		mat4.identity(this.modelMatrix);
		mat4.translate(this.modelMatrix,
			       this.modelMatrix,
			       this.position);
	}

	/* public methods */
	
	// translation does not need to be updated
	// in every animation frame as a rotation does
	update() {}

	getMatrix() {
		return this.modelMatrix;
	}
}
