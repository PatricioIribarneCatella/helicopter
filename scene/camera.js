//
// Represents a perspective Camera
//
// projection (perspective) + view (position)
//
export class Camera {

	constructor(gl, canvas, pos) {

		this.gl = gl;
		this.canvas = canvas;

		// invert the z index
		this.position = [pos[0], pos[1], -pos[2]];

		this.projMatrix = mat4.create();
		this.viewMatrix = mat4.create();
		this.matrix = mat4.create();

		this._init();
	}

	/* private methods */

	_init() {
		// initialize perspective matrix
		mat4.perspective(this.projMatrix, 45,
				 this.canvas.width / this.canvas.height,
				 0.1, 10000.0);

		// initialize translation matrix
		mat4.translate(this.viewMatrix, this.viewMatrix, this.position);

		mat4.multiply(this.matrix, this.projMatrix, this.viewMatrix);
	}

	/* public methods */

	bind(program) {

		var uniformMatrixPV = program.findUniform("pv");
		this.gl.uniformMatrix4fv(uniformMatrixPV, false, this.matrix);
	}

	update(controller) {
	
		var p = controller.getPosition();
		var c = controller.getCamera();

		var center = p;
		var eye;
/*
		if (c === "global") {
			eye = [0.0, 0.0, 25.0];
		} else if (c === "lateral") {
			eye = [p.x, p.y, p.z + 30.0];
		} else if (c === "up") {
			eye = [p.x, p.y + 30.0, p.z];
		} else if (c === "back") {
			eye = [p.x - 30.0, p.y, p.z];
		} else {
			eye = [0.0, 0.0, 25.0];
		}

		mat4.lookAt(this.matrix, eye, center, [0.0, 1.0, 0.0]);

		mat4.multiply(this.matrix, this.projMatrix, this.matrix);
*/
	}
}
