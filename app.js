import {Scene} from './scene.js';
import {Triangle} from './triangle.js';

export class App {
	
	constructor(gl, canvas) {
		this.gl = gl;
		this.canvas = canvas;
		this.init();
	}

	/* private methods */
	
	//
	// Background and WebGl setup
	//
	init() {
		// black color
		this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

		// clear the color buffer
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);

		// viewport init
		this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
	}

	/* public methods */

	start() {		
		var scene = new Scene(this.gl, "vs", "fs");

		var t1 = {
			"pos": {
				"v1": [-0.5, -0.5, 0.0],
				"v2": [-0.5, 0.5, 0.0],
				"v3": [0.0, -0.5, 0.0]
			},
			"color": {
				"v1": [1.0, 0.0, 0.0],
				"v2": [1.0, 1.0, 0.0],
				"v3": [0.0, 1.0, 0.0]
			}
		};

		var t2 = {
			"pos": {
				"v1": [0.0, 0.5, 0.0],
				"v2": [0.5, -0.5, 0.0],
				"v3": [0.5, 0.5, 0.0]
			},
			"color": {
				"v1": [0.0, 1.0, 1.0],
				"v2": [0.0, 0.0, 1.0],
				"v3": [1.0, 0.0, 1.0]
			}
		};

		scene.add(new Triangle(this.gl, t1));
		scene.add(new Triangle(this.gl, t2));

		scene.draw();
	}
}

