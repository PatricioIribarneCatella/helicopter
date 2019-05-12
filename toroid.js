import {App} from './scene/app.js';
import {Scene} from './scene/scene.js';
import {Camera} from './scene/camera.js';

import {ShaderProgram} from './shaders/program.js';

import {SweepSurface} from './surfaces/sweeping.js';
import {Circle} from './shapes/circle.js';

import {Rotation} from './transformations/rotation.js';
import {Translation} from './transformations/translation.js';
import {Scale} from './transformations/scaling.js';
import {Identity} from './transformations/identity.js';

import {Graphic} from './3d/graphic.js';
import {Container3D} from './3d/container.js';
import {World} from './3d/world.js';

export class ToroidApp extends App {

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

		// Toroid model
		var shape = new Circle(1);
		var path = new Circle(5);
		var model = new SweepSurface(shape, path, 100, 50);

		// Toroid graphic
		var t = [new Rotation([0.0, 1.0, 0.0], 0.0, 0.01)];
		var gt = new Graphic(this.gl, model, t, shader);

		world.add(gt);

		scene.add(world);

		scene.draw();
	}
}
