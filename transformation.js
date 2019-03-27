//
// Manages transformation
// matrix: model + view + perspective
//
export class Transformation {

	constructor(gl, canvas, shader) {

		this.gl = gl;
		this.canvas = canvas;
		this.program = shader;
		
		this.modelMatrix = mat4.create();
		this.viewMatrix = mat4.create();
		this.projMatrix = mat4.create();

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

	_updateModel() {
		var pos = [-this.position[0], -this.position[1], -this.position[2]];
		mat4.identity(this.modelMatrix);
		mat4.translate(this.modelMatrix, this.modelMatrix, pos);
		mat4.rotate(this.modelMatrix, this.modelMatrix,
				this.angle, this.raxis);
		mat4.translate(this.modelMatrix, this.modelMatrix, this.position);
	}

	/* public methods */

	rotate(axis, init_angle, increment) {
		
		this.raxis = axis;
		this.angle = init_angle;
		this.increment = increment;

		this._updateModel();
	}

	move(position) {
		this.position = position;
		this.element.move(this.position);
	}

	perspective(turn_on) {
		if (turn_on) {
			mat4.perspective(this.projMatrix, 45,
				this.canvas.width / this.canvas.height, 0.1, 100.0);
		}
	}

	view(position) {
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
		this.angle += this.increment;
		
		this._updateModel();
	}
}
