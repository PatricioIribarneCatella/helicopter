//
// Manages transformation
// matrix: model + view + perspective
//
export class Transformation {

	constructor(gl, canvas, shader) {

		this.gl = gl;
		this.canvas = canvas;
		this.modelMatrix = mat4.create();
		this.viewMatrix = mat4.create();
		this.projMatrix = mat4.create();
		this.angle = 1.57078;
		
		this.program = shader;

		this._init();
	}

	/* private methods */

	_init() {
		// initialize perspective matrix
		mat4.identity(this.projMatrix);

		// initialize rotation matrix
		mat4.identity(this.modelMatrix);

		// initialize translation matrix
		mat4.identity(this.viewMatrix);
	}

	_updateShaderMatrix() {

		var uniformMatrixModel = this.program.findUniform("model");
		var uniformMatrixView = this.program.findUniform("view");
		var uniformMatrixProj = this.program.findUniform("proj");

		this.gl.uniformMatrix4fv(uniformMatrixModel, false, this.modelMatrix);
		this.gl.uniformMatrix4fv(uniformMatrixView, false, this.viewMatrix);
		this.gl.uniformMatrix4fv(uniformMatrixProj, false, this.projMatrix);
	}

	/* public methods */

	rotate(axe) {
		this.raxe = axe;
		mat4.rotate(this.modelMatrix, this.modelMatrix,
				this.angle, this.raxe);
	}

	perspective(turn_on) {
		if (turn_on) {
			mat4.perspective(this.projMatrix, 45,
				this.canvas.with / this.canvas.height, 0.1, 100.0);
		}
	}

	move(position) {
		mat4.translate(this.viewMatrix, this.viewMatrix, position);
	}

	add(element) {
		this.element = element;
	}

	draw() {
		this._updateShaderMatrix();
		this.element.draw(this.program);
	}

	update() {
		this.angle += 0.01;
		mat4.identity(this.modelMatrix);
		mat4.rotate(this.modelMatrix, this.modelMatrix,
				this.angle, this.raxe);
	}
}
