import * as utils from './utils.js';

//
// Manipulates GL programs and
// loads shaders from src
//
export class ShaderProgram {

	constructor(gl, vertex_src_id, fragment_src_id) {
		
		this.gl = gl;
		this.vs_src_id = vertex_src_id;
		this.fs_src_id = fragment_src_id;
		
		this._init();
	}

	_init() {
		// get shader from source
		var vs_src = document.getElementById(this.vs_src_id);
		var fs_src = document.getElementById(this.fs_src_id);


		// compile the shader
		var vs = utils.compile(this.gl, vs_src, this.gl.VERTEX_SHADER);
		var fs = utils.compile(this.gl, fs_src, this.gl.FRAGMENT_SHADER);

		this.program = this.gl.createProgram();
		
		// attach the shader to the program
		this.gl.attachShader(this.program, vs);
		this.gl.attachShader(this.program, fs);

		// link program
		this.gl.linkProgram(this.program);

		if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
			alert("Unable to initialize the shader program.");
		}

		// use the program
		this.gl.useProgram(this.program);
	}
}

