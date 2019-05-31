import * as utils from '../libs/utils.js';

//
// Manipulates GL programs and
// loads shaders from src
//
export class ShaderProgram {

	constructor(gl, vertex_src, fragment_src) {
		
		this.gl = gl;
		this.vs_src = vertex_src;
		this.fs_src = fragment_src;
		
		this._init();
	}

	/* private methods  */
	
	_init() {
		// compile the shader
		var vs = utils.compile(this.gl, this.vs_src, this.gl.VERTEX_SHADER);
		var fs = utils.compile(this.gl, this.fs_src, this.gl.FRAGMENT_SHADER);

		this.program = this.gl.createProgram();
		
		// attach the shader to the program
		this.gl.attachShader(this.program, vs);
		this.gl.attachShader(this.program, fs);

		// link program
		this.gl.linkProgram(this.program);

		if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
			alert("Unable to initialize the shader program.");
		}
	}

	/* public methods  */

	use() {
		// use the program
		this.gl.useProgram(this.program);
	}

	findAttribute(id) {
		return this.gl.getAttribLocation(this.program, id);
	}

	findUniform(id) {
		return this.gl.getUniformLocation(this.program, id);
	}
}

