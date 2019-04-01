import {Scene} from './scene.js';
import {Camera} from './camera.js';
import {ShaderProgram} from './program.js';

import {Grid} from './grid.js';
import {Sphere} from './sphere.js';

import {Rotation} from './rotation.js';
import {Translation} from './translation.js';
import {Scale} from './scaling.js';

import {Graphic} from './graphic.js';

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

	start() {		
		var scene = new Scene(this.gl);

		var shader = new ShaderProgram(this.gl,
					       matrix_vertex_shader,
					       simple_fragment_shader);
	
		// Create a perspective camera moved 5 units from the origin
		var camera = new Camera(this.gl, this.canvas, [0.0, 0.0, 6.0]);
		scene.addCamera(camera);

		var grid = new Grid(this.gl, 3, 2);

		var tg = [new Rotation([0.0, 1.0, 0.0], 0.0, 0.03),
			  new Translation([3.0, 0.0, 0.0]),
			  new Rotation([0.0, 1.0, 0.0], 0.0, 0.07)];

		var g1 = new Graphic(this.gl, grid, tg, shader);

		scene.add(g1);

		var s = new Sphere(this.gl, 30, 30);

		var ts = [new Translation([0.0, 0.0, 0.0]),
			  new Rotation([1.0, 0.0, 0.0], 0.0, 0.04),
			  new Scale([0.5, 0.5, 0.5])];

		var g2 = new Graphic(this.gl, s, ts, shader);

		scene.add(g2);
		
		scene.draw();
	}
}

