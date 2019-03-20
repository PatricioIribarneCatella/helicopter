//
// Manages transformation
// matrix: model + view + perspective
//
export class Transformation {

	constructor(canvas) {

		this.canvas = canvas;
		this.modelMatrix = mat4.create();
		this.viewMatrix = mat4.create();
		this.projMatrix = mat4.create();
		this.rotate_angle = -1.57078;
		
		this._init();
	}

	/* private methods */

	_init() {
		// initialize perspective matrix
		mat4.perspective(this.projMatrix, 45, this.canvas.width / this.canvas.height, 0.1, 100.0);

		// initialize rotation matrix
		mat4.identity(this.modelMatrix);
		mat4.rotate(this.modelMatrix, this.modelMatrix, this.rotate_angle, [0.0, 0.0, 1.0]);

		// initialize translation matrix
		mat4.identity(this.viewMatrix);
	}

	/* public methods */

}
