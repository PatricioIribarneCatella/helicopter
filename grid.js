//
// Represents a Grid made up 
// of triangles and drawn it 
// by TRIANGLE_STRIP
//
export class Grid {

	constructor(gl, rows, cols) {
		this.gl = gl;
		this.rows = rows;
		this.cols = cols;
		this._init();
	}

	/* private methods */

	_createModel() {

		this.position_buffer = [];
		this.color_buffer = [];

		for (var i = 0.0; i < this.rows; i++) {
			for (var j = 0.0; j < this.cols; j++) {
				// position = (x, y, z = 0)
				this.position_buffer.push(j - (this.cols - 1.0) / 2.0);
				this.position_buffer.push(i - (this.rows - 1.0) / 2.0);
				this.position_buffer.push(0);

				this.color_buffer.push(1.0 / this.rows * i);
				this.color_buffer.push(0.2);
				this.color_buffer.push(1.0 / this.cols * j);
			};
		};
	}

	_createIndexes() {
		
		this.index_buffer = [];

		for (var i = 0.0; i < (this.rows - 1); i++) {
			if ((i % 2) == 0) {
				// even rows stay normal
				for (var j = 0; j < this.cols; j++) {
					this.index_buffer.push(i * this.cols + j);
					this.index_buffer.push((i + 1) * this.cols + j);
				}
			} else {
				// odd rows get flipped
				for (var j = (this.cols - 1); j >= 0; j--) {
					this.index_buffer.push(i * this.cols + j);
					this.index_buffer.push((i + 1) * this.cols + j);
				}
			}
		}
	}

	_generateBuffers() {
		// generates a GRID defined by
		// 'cols' and 'rows'
		// with colors per vertex
		// and indexes to render it
		this._createModel();
		this._createIndexes();
	}

	_fillPositionBuffer() {
	
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.webgl_position_buffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER,
				   new Float32Array(this.position_buffer),
				   this.gl.STATIC_DRAW);
	}

	_init() {
		this._generateBuffers();

		this.webgl_position_buffer = this.gl.createBuffer();
		this._fillPositionBuffer();
	
		this.webgl_color_buffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.webgl_color_buffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER,
				   new Float32Array(this.color_buffer), 
				   this.gl.STATIC_DRAW);

		this.webgl_index_buffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
		this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER,
				   new Uint16Array(this.index_buffer),
				   this.gl.STATIC_DRAW);
	}

	_bindBuffers(program) {
		// connect position data in local buffers 
		// with shader vertex position buffer
		var vertexPositionAttribute = program.findAttribute("aVertexPosition");
		
		this.gl.enableVertexAttribArray(vertexPositionAttribute);
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.webgl_position_buffer);
		this.gl.vertexAttribPointer(vertexPositionAttribute, 3, this.gl.FLOAT, false, 0, 0);

		// connect color data in local buffers
		// with shader vertex color buffer
		var vertexColorAttribute = program.findAttribute("aVertexColor");
		
		this.gl.enableVertexAttribArray(vertexColorAttribute);
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.webgl_color_buffer);
		this.gl.vertexAttribPointer(vertexColorAttribute, 3, this.gl.FLOAT, false, 0, 0);

		// connect indexes data in local buffers
		// with GPU index buffer
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
	}

	/* public methods */

	draw(program) {

		this._bindBuffers(program);

		this.gl.drawElements(this.gl.TRIANGLE_STRIP,
				     this.index_buffer.length,
				     this.gl.UNSIGNED_SHORT, 0);
	}
}
