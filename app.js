import {Scene} from './scene.js';
import {Triangle} from './triangle.js';
import {Transformation} from './transformation.js';

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

		// viewport init
		this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
	}

	/* public methods */

	start() {		
		var scene = new Scene(this.gl);

		var color = [
			1.0, 0.0, 0.0, // v1
			1.0, 1.0, 0.0, // v2
			0.0, 1.0, 0.0  // v3
		];

		var t = new Transformation(this.gl, this.canvas);

		t.add(new Triangle(this.gl, color));

		scene.add(t);

		scene.draw();
	}
}

