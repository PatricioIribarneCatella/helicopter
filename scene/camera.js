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
	}

	/* public methods */

	update(program) {
		
		var matrix = mat4.create();

		mat4.multiply(matrix, this.projMatrix, this.viewMatrix);

		var uniformMatrixPV = program.findUniform("pv");
		this.gl.uniformMatrix4fv(uniformMatrixPV, false, matrix);
	}
}
