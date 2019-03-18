//
// Compiles a shader source code
// depending on its type
//
export function compile(gl, src, type) {

	// compile the shader
	var shader = gl.createShader(type);

	gl.shaderSource(shader, src);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert("Error compiling shader: " + gl.getShaderInfoLog(shader));
	}

	return shader;
}

