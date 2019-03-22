import {ShaderProgram} from './program.js';

//
// Manages transformation
// matrix: model + view + perspective
//
export class Transformation {

	constructor(gl, canvas, vs_id, fs_id) {

		this.gl = gl;
		this.canvas = canvas;
		this.modelMatrix = mat4.create();
		this.viewMatrix = mat4.create();
		this.projMatrix = mat4.create();
		this.angle = 1.57078;
		
		this.program = new ShaderProgram(this.gl, vs_id, fs_id);
		this.elements = [];

		this._init();
	}

	/* private methods */

	_init() {
		// initialize perspective matrix
		mat4.identity(this.projMatrix);
		//mat4.perspective(this.projMatrix, 45, this.canvas.with / this.canvas.height, 0.1, 100.0);

		// initialize rotation matrix
		mat4.identity(this.modelMatrix);
		mat4.rotate(this.modelMatrix, this.modelMatrix, this.angle, [0.0, 0.0, 1.0]);

		// initialize translation matrix
		mat4.identity(this.viewMatrix);
		//mat4.translate(this.viewMatrix, this.viewMatrix, [0.0, 0.0, -5.0]);
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

	add(element) {
		this.elements.push(element);
	}

	draw() {
		this._updateShaderMatrix();

		var i;
		for (i = 0; i < this.elements.length; i++) {
			this.elements[i].draw(this.program);
		}
	}

	update() {
		this.angle += 0.01;
		mat4.identity(this.modelMatrix);
		mat4.rotate(this.modelMatrix, this.modelMatrix, this.angle, [0.0, 0.0, 1.0]);
	}
}
