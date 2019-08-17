//
// Manipulates GL programs and
// loads shaders from src
//
export class ShaderProgram {

	constructor(gl, vertex_path, fragment_path) {
		
		this.gl = gl;
		this.vs_path = vertex_path;
		this.fs_path = fragment_path;
		
		this._init();
	}

	/* private methods  */
	
	_init() {

		// get shader's text
		var vs_src = this._loadFile(this.vs_path);
		var fs_src = this._loadFile(this.fs_path);

		if (!vs_src) {
			alert("Could not find shader source: " + this.vs_path);
		}

		if (!fs_src) {
			alert("Could not find shader source: " + this.fs_path);
		}

		// compile the shader
		var vs = this._compile(vs_src, this.gl.VERTEX_SHADER);
		var fs = this._compile(fs_src, this.gl.FRAGMENT_SHADER);

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

	_loadFile(path) {
		
		var xhr = new XMLHttpRequest(),
			okStatus = document.location.protocol === "file:" ? 0 : 200;
		
		xhr.open('GET', path, false);
		xhr.send(null);
		
		return xhr.status == okStatus ? xhr.responseText : null;
	}

	_compile(src, type) {
	
		var shader = this.gl.createShader(type);

		this.gl.shaderSource(shader, src);
		this.gl.compileShader(shader);

		if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
			alert("Error compiling shader: " + this.gl.getShaderInfoLog(shader));
		}

		return shader;
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

