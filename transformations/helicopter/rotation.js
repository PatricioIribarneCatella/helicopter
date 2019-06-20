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

//
// Represents a Rotation of the
// helix motors
//
export class MotorRotation {

	constructor(position) {
		
		this.position = position;
		
		this.up = false;
		this.prevState = false;
		this.targetUp = false;
		this.targetDown = false;

		this.angle = 0.0;
		this.delta = 0.01;

		this.modelMatrix = mat4.create();
	}

	/* public methods */

	update(controller) {
		
		var state = controller.getMotorPosChanged();
		var target;

		if (state === this.prevState) {
			
			if (this.up && this.targetDown) {
			
				if (this.position === "left") {
					target = this.angle - this.delta;
					this.angle = Math.max(target, 0.0);
				} else {
					target = this.angle + this.delta;
					this.angle = Math.min(target, 0.0);
				}
				
				if (this.angle == 0.0) {
					this.up = false;
					this.targetDown = false;
				}

			} else if (!this.up && this.targetUp) {

				if (this.position === "left") {
					target = this.angle + this.delta;
					this.angle = Math.min(target, Math.PI/2);
				} else {
					target = this.angle - this.delta;
					this.angle = Math.max(target, -Math.PI/2);
				}
				
				if (this.angle == Math.PI/2 || this.angle == -Math.PI/2) {
					this.up = true;
					this.targetUp = false;
				}
			}
			
			mat4.identity(this.modelMatrix);
	
			mat4.rotate(this.modelMatrix,
			    this.modelMatrix,
			    this.angle,
			    [0.0, 1.0, 0.0]);

			return;
		}
		
		this.prevState = state;

		if (this.up) {
			this.targetDown = true;
		} else {
			this.targetUp = true;
		}
	}

	getMatrix() {
		return this.modelMatrix;
	}
}

//
// Represents a Rotation
// applied to the landing gear legs
//
export class LegRotation {

	constructor(angle, delta) {
		
		this.maxAngle = angle;
		this.angle = 0.0;
		this.delta = delta;

		this.extended = true;
		this.targetContract = false;
		this.targetExtended = false;
		this.prevState = false;
		
		this.modelMatrix = mat4.create();
	}

	/* public methods */

	update(controller) {
		
		var state = controller.getLegPosChanged();
		var target;

		if (state === this.prevState) {

			if (this.extended && this.targetContract) {
				
				if (this.maxAngle > 0.0) {
					target = this.angle + this.delta;
					this.angle = Math.min(target, this.maxAngle);
				} else {
					target = this.angle - this.delta;
					this.angle = Math.max(target, this.maxAngle);
				}
				
				if (this.angle == this.maxAngle) {
					this.extended = false;
					this.targetContract = false;
				}

			} else if (!this.extended && this.targetExtended) {
				
				if (this.maxAngle > 0.0) {
					target = this.angle - this.delta;
					this.angle = Math.max(target, 0.0);
				} else {
					target = this.angle + this.delta;
					this.angle = Math.min(target, 0.0);
				}

				if (this.angle == 0.0) {
					this.extended = true;
					this.targetExtended = false;
				}
			}

			mat4.identity(this.modelMatrix);

			mat4.rotate(this.modelMatrix,
				    this.modelMatrix,
				    this.angle,
				    [1.0, 0.0, 0.0]);

			return;
		}

		this.prevState = state;

		if (this.extended) {
			this.targetContract = true;
		} else {
			this.targetExtended = true;
		}
	}

	getMatrix() {
		return this.modelMatrix;
	}
}

//
// Represents a Rotation
// that opens the stairway
// (z axis)
export class StairwayRotation {

	constructor(angle) {
	
		this.angle = angle;
		this.minAngle = angle;
		this.maxAngle = angle - Math.PI/2;
		this.delta = 0.02;

		this.opened = false;
		this.hasEnd = false;
		this.prevState = false;
		this.targetOpen = false;
		this.targetClose = false;

		this.modelMatrix = mat4.create();

		this._init();
	}

	_init() {
	
		mat4.rotate(this.modelMatrix,
			    this.modelMatrix,
			    this.angle,
			    [0.0, 0.0, 1.0]);
	}

	/* public methods */

	update(controller) {
		
		var state = controller.getDoorChanged();
		var target;

		if (state === this.prevState) {

			if (this.opened && this.targetClose) {
			
				target = this.angle + this.delta;
				this.angle = Math.min(target, this.minAngle);

				if (this.angle === this.minAngle) {
					this.opened = false;
					this.targetClose = false;
				}

			} else if (!this.opened && this.targetOpen) {
			
				target = this.angle - this.delta;
				this.angle = Math.max(target, this.maxAngle);

				if (this.angle === this.maxAngle) {
					this.opened = true;
					this.hasEnd = true;
					this.targetOpen = false;
				}
			}
			
			mat4.identity(this.modelMatrix);
			
			mat4.rotate(this.modelMatrix,
				    this.modelMatrix,
				    this.angle,
				    [0.0, 0.0, 1.0]);
		
			return;
		}
		
		this.prevState = state;

		if (this.opened) {
			this.targetClose = true;
			this.hasEnd = false;
		} else {
			this.targetOpen = true;
		}
	}

	getMatrix() {
		return this.modelMatrix;
	}

	hasFinished() {
		return this.hasEnd;
	}
}

