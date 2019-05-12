import {App} from './scene/app.js';
import {Scene} from './scene/scene.js';
import {Camera} from './scene/camera.js';

import {ShaderProgram} from './shaders/program.js';

import {SweepSurface} from './surfaces/sweeping.js';
import {Circle} from './shapes/circle.js';

import {Rotation} from './transformations/rotation.js';

import {Graphic} from './3d/graphic.js';
import {World} from './3d/world.js';

export class ToroidSweepApp extends App {

	constructor(gl, canvas) {
		super(gl, canvas);
	}

	/* public methods */

	start() {
	
		var scene = new Scene(this.gl);

		var shader = new ShaderProgram(this.gl,
					       matrix_vertex_shader,
					       simple_fragment_shader);

		// Perspective camera moved 7 units from the origin
		var camera = new Camera(this.gl, this.canvas, [0.0, 0.0, 15.0]);
		scene.addCamera(camera);

		// World
		var world = new World();

		var shape = new Circle(1);
		
		// Toroid model 1
		var path = new Circle(5);
		var model = new SweepSurface(shape, path, 100, 50);

		// Toroid graphic 1
		var t1 = [new Rotation([0.0, 1.0, 0.0], 0.0, 0.01)];
		var gt1 = new Graphic(this.gl, model, t1, shader);

		world.add(gt1);
		
		// Toroid model 2
		var path = new Circle(7);
		var model2 = new SweepSurface(shape, path, 100, 50);

		// Toroid graphic 2
		var t2 = [new Rotation([1.0, 0.0, 0.0], 0.0, 0.01)];
		var gt2 = new Graphic(this.gl, model2, t2, shader);

		world.add(gt2);

		scene.add(world);

		scene.draw();
	}
}
