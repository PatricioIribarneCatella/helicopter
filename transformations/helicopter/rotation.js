//
// Represents a double Rotation
// using the 'controller' data
//
export class HelicopterRotation {

	constructor() {

		this.modelMatrix = mat4.create();
		this.rotateX = mat4.create();
		this.rotateY = mat4.create();
	}

	/* public methods */

	update(controller) {

		var angleX = controller.getRoll();
		var angleY = controller.getYaw();

		mat4.identity(this.modelMatrix);
		mat4.identity(this.rotateX);
		mat4.identity(this.rotateY);

		mat4.rotate(this.rotateX,
			    this.rotateX,
			    angleX,
			    [1.0, 0.0, 0.0]);

		mat4.rotate(this.rotateY,
			    this.rotateY,
			    angleY,
			    [0.0, 1.0, 0.0]);

		mat4.multiply(this.modelMatrix,
			      this.rotateX,
			      this.rotateY);
	}

	getMatrix() {
		return this.modelMatrix;
	}
}

//
// Represents a Rotation
// using the 'Pitch' angle
//
export class HelixRotation {

	constructor(position) {
		
		this.position = position;
		this.modelMatrix = mat4.create();
	}

	/* public methods */

	update(controller) {
		
		var angle = controller.getPitch();

		mat4.identity(this.modelMatrix);
		
		if (this.position === "left") {
			angle = -angle;
		}

		mat4.rotate(this.modelMatrix,
			    this.modelMatrix,
			    angle,
			    [1.0, 0.0, 0.0]);
	}

	getMatrix() {
		return this.modelMatrix;
	}
}
