//
// Abstract class representing
// the application object
//
export class App {
	
	constructor(gl, canvas) {
		this.gl = gl;
		this.canvas = canvas;
		this._init();
	}

	/* private methods */
	
	//
	// Background and WebGl setup
	//
	_init() {
		// black color
		this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

		// clear the color buffer
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
		
		this.gl.enable(this.gl.DEPTH_TEST);                              
		this.gl.depthFunc(this.gl.LEQUAL);

		// viewport init
		this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
	}

	/* public methods */

	start() {}
}

