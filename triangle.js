//
// WebGL triangle contains:
// - mathematical representation
// - webgl information to render it
//
export class Triangle  {

	constructor(gl, color) {
		this.gl = gl;
		this.color = color;
		this.model = [
			0.0, 0.0, 0.0,
			1.0, 0.0, 0.0,
			0.0, 1.0, 0.0
		];
		this._init();
	}

	/* private methods */

	_init() {
		// set webgl vertex position
		this.triangleVertexBuffer = this.gl.createBuffer();
                
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.triangleVertexBuffer);
                this.gl.bufferData(this.gl.ARRAY_BUFFER,
				   new Float32Array(this.model),
				   this.gl.STATIC_DRAW);

		// set webgl vertex color
		this.triangleColorBuffer = this.gl.createBuffer();

                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.triangleColorBuffer);
                this.gl.bufferData(this.gl.ARRAY_BUFFER,
				   new Float32Array(this.color),
				   this.gl.STATIC_DRAW);
	}

	_bindBuffers(program) {
		// connect position data in local buffers 
		// with shader vertex position buffer
		var vertexPositionAttribute = program.findAttribute("aVertexPosition");
                
		this.gl.enableVertexAttribArray(vertexPositionAttribute);
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.triangleVertexBuffer);
                this.gl.vertexAttribPointer(vertexPositionAttribute, 3, this.gl.FLOAT, false, 0, 0);

		// connect color data in local buffers
		// with shader vertex color buffer
                var vertexColorAttribute = program.findAttribute("aVertexColor");

                this.gl.enableVertexAttribArray(vertexColorAttribute);
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.triangleColorBuffer);
                this.gl.vertexAttribPointer(vertexColorAttribute, 3, this.gl.FLOAT, false, 0, 0);
	}

	/* public methods */

	addTransform(t) {
		this.transformation = t;
	}

	draw(program) {

		this._bindBuffers(program);

                this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
	}
}
