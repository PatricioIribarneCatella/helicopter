//
// Combines a Model element
// and a list of transformations
// to aplicate on it
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

	_createIndexes() {
		
		this.index_buffer = [];
		var cols = this.model.getCols();
		var rows = this.model.getRows();

		for (var i = 0.0; i < (rows - 1); i++) {
			if ((i % 2) == 0) {
				// even rows stay normal
				for (var j = 0; j < cols; j++) {
					this.index_buffer.push(i * cols + j);
					this.index_buffer.push((i + 1) * cols + j);
				}
			} else {
				// odd rows get flipped
				for (var j = (cols - 1); j >= 0; j--) {
					this.index_buffer.push(i * cols + j);
					this.index_buffer.push((i + 1) * cols + j);
				}
			}
		}
	}

	_initBuffers() {
		
		this.webgl_position_buffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.webgl_position_buffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER,
				   new Float32Array(this.model.getPosition()),
				   this.gl.STATIC_DRAW);
	
		this.webgl_color_buffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.webgl_color_buffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER,
				   new Float32Array(this.model.getColor()),
				   this.gl.STATIC_DRAW);

		this.webgl_index_buffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
		this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER,
				   new Uint16Array(this.index_buffer),
				   this.gl.STATIC_DRAW);
	}

	_init() {
		// initialize model matrix element
		this.matrix = mat4.create();

		this._createIndexes();
		this._initBuffers();
	}

	
	_bindTransformations() {

		var uniformMatrixModel = this.program.findUniform("model");
		this.gl.uniformMatrix4fv(uniformMatrixModel, false, this.matrix);
	}

	_bindBuffers() {
		// connect position data in local buffers 
		// with shader vertex position buffer
		var vertexPositionAttribute = this.program.findAttribute("aVertexPosition");
		
		this.gl.enableVertexAttribArray(vertexPositionAttribute);
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.webgl_position_buffer);
		this.gl.vertexAttribPointer(vertexPositionAttribute, 3, this.gl.FLOAT, false, 0, 0);

		// connect color data in local buffers
		// with shader vertex color buffer
		var vertexColorAttribute = this.program.findAttribute("aVertexColor");
		
		this.gl.enableVertexAttribArray(vertexColorAttribute);
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.webgl_color_buffer);
		this.gl.vertexAttribPointer(vertexColorAttribute, 3, this.gl.FLOAT, false, 0, 0);

		// connect indexes data in local buffers
		// with GPU index buffer
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
	}

	_updateTransformations(matrix) {

		var i;
		mat4.identity(this.matrix);

		for (i = 0; i < this.ts.length; i++) {
			mat4.multiply(this.matrix, this.matrix, this.ts[i].getMatrix());
		}

		mat4.multiply(this.matrix, matrix, this.matrix);
	}

	_animate(controller) {

		var i;	
		for (i = 0; i < this.ts.length; i++) {
			this.ts[i].update(controller);
		}
	}

	_draw() {
	
		this._bindBuffers();

		this.gl.drawElements(this.gl.TRIANGLE_STRIP,
				     this.index_buffer.length,
				     this.gl.UNSIGNED_SHORT, 0);
	}

	/* public methods */

	draw(camera, controller, matrix) {
		
		camera.bind(this.program);

		this._updateTransformations(matrix);

		this._bindTransformations();
		
		this._draw();

		this._animate(controller);
	}
}

