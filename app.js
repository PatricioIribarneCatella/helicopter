//
// Background and WebGl setup
//
export function init(gl, canvas) {

	// black color
	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	// clear the color buffer
	gl.clear(gl.COLOR_BUFFER_BIT);

	// viewport init
	gl.viewport(0, 0, canvas.width, canvas.height);
}

