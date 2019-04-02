import {Scene} from './scene.js';
import {Camera} from './camera.js';
import {ShaderProgram} from './program.js';

import {Sphere} from './sphere.js';

import {Rotation} from './rotation.js';
import {Translation} from './translation.js';
import {Scale} from './scaling.js';
import {Identity} from './identity.js';

import {Graphic} from './graphic.js';
import {Container3D} from './container.js';
import {World} from './world.js';

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
	
		// Create a perspective camera moved 7 units from the origin
		var camera = new Camera(this.gl, this.canvas, [0.0, 0.0, 7.0]);
		scene.addCamera(camera);

		// World
		var world = new World();
	
		// Sphere model for all the solar system objects
		var model = new Sphere(this.gl, 30, 30);

		// Sun
		var gs = new Graphic(this.gl, model, [new Identity()], shader);

		world.add(gs);

		// Earth - Moon system
		var tem = [new Rotation([0.0, 1.0, 0.0], 0.0, 0.03),
			   new Translation([3.0, 0.0, 0.0])];

		var em = new Container3D(tem);

		// Earth
		var ts = [new Rotation([0.0, 1.0, 0.0], 0.0, 0.05),
			  new Scale([0.5, 0.5, 0.5])];

		var ge = new Graphic(this.gl, model, ts, shader);

		em.add(ge);

		// Moon
		var tm = [new Rotation([0.0, 1.0, 0.0], 0.0, 0.05),
			  new Translation([1.25, 0.0, 0.0]),
			  new Scale([0.25, 0.25, 0.25])];

		var gm = new Graphic(this.gl, model, tm, shader);

		em.add(gm);

		world.add(em);

		scene.add(world);
		
		scene.draw();
	}
}

