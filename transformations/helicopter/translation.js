//
// Represents a Translation
// using the data in the 'controller'
//
export class HelicopterTranslation {
	
	constructor() {

		this.modelMatrix = mat4.create();
	}

	/* public methods */
	
	update(controller) {
		
		var pos = controller.getPosition();

		mat4.identity(this.modelMatrix);
		mat4.translate(this.modelMatrix,
			       this.modelMatrix,
			       [pos.x, pos.y, pos.z]);
	}

	getMatrix() {
		return this.modelMatrix;
	}
}
