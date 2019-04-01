//
// Combines a Model element
// and a list of transformations
// to applicate on it
//
export class Graphic {

	constructor(gl, element, transformations, shader) {
		
		this.gl = gl;
		this.model = element;
		this.ts = transformations;
		this.program = shader;

		this._init();
	}

	/* private methods */

	_init() {
		// initialize model matrix element
		this.matrix = mat4.create();
	}

	_updateModelMatrix() {

		var i;
		mat4.identity(this.matrix);

		for (i = 0; i < this.ts.length; i++) {
			mat4.multiply(this.matrix, this.matrix, this.ts[i].getMatrix());
		}

		var uniformMatrixModel = this.program.findUniform("model");
		this.gl.uniformMatrix4fv(uniformMatrixModel, false, this.matrix);
	}
	
	_animate() {
		var i;
		for (i = 0; i < this.ts.length; i++) {
			this.ts[i].update();
		}
	}

	/* public methods */

	draw(camera) {
		
		camera.update(this.program);

		this._updateModelMatrix();
		
		this.model.draw(this.program);

		this._animate();
	}
}

