//
// Background and WebGl setup
//

export class App {
	
	constructor(gl, canvas) {
		this.gl = gl;
		this.canvas = canvas;
	}

	// private methods

	init() {
		// black color
		this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

		// clear the color buffer
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);

		// viewport init
		this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
	}

	// public methods

	start() {
		this.init();
	}
}

