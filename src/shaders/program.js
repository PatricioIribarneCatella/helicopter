//
// Manipulates GL programs and
// loads shaders from src
//
export class Shader {
    constructor(gl, vertex_file, fragment_file) {
        this.gl = gl;
        this.vs_src = vertex_file.getText();
        this.fs_src = fragment_file.getText();

        this._init();
    }

    /* private methods  */

    _init() {
        // compile the shader
        var vs = this._compile(this.vs_src, this.gl.VERTEX_SHADER);
        var fs = this._compile(this.fs_src, this.gl.FRAGMENT_SHADER);

        this.program = this.gl.createProgram();

        // attach the shader to the program
        this.gl.attachShader(this.program, vs);
        this.gl.attachShader(this.program, fs);

        // link program
        this.gl.linkProgram(this.program);

        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS))
            alert('Unable to initialize the shader program.');
    }

    _compile(src, type) {
        var shader = this.gl.createShader(type);

        this.gl.shaderSource(shader, src);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            alert('Error compiling shader: ' + this.gl.getShaderInfoLog(shader));
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
