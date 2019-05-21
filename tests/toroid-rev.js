import {App} from '../scene/app.js';
import {Scene} from '../scene/scene.js';
import {Camera} from '../scene/camera.js';

import {ShaderProgram} from '../shaders/program.js';

import {RevolutionSurface} from '../surfaces/revolution.js';
import {Circle} from '../shapes/circle.js';

import {Rotation} from '../transformations/rotation.js';

import {Graphic} from '../3d/graphic.js';
import {World} from '../3d/world.js';

export class ToroidRevApp extends App {

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
		shape.move([3.0, 0.0, 0.0]);
		
		// Toroid model 1
		var model = new RevolutionSurface(shape, [0.0, 1.0, 0.0], 500, 50);

		// Toroid graphic 1
		var t = [new Rotation([1.0, 0.0, 0.0], 0.0, 0.01)];
		var gt = new Graphic(this.gl, model, t, shader);

		world.add(gt);

		scene.add(world);

		scene.draw();
	}
}

