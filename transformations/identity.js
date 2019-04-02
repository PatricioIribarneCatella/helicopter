//
// Represents an Identity
// transformation
//
export class Identity {

	constructor() {
		this.modelMatrix = mat4.create();
	}

	/* public methods */

	// it does not need to be updated
	update() {}

	getMatrix() {
		return this.modelMatrix;
	}
}

