import {App} from '../scene/app.js';
import {Scene} from '../scene/scene.js';
import {Camera} from '../scene/camera.js';

import {ShaderProgram} from '../shaders/program.js';

import {RevolutionSurface} from '../surfaces/revolution.js';
import {SweepSurface} from '../surfaces/sweeping.js';
import {BezierCuad, BezierCubic} from '../curves/bezier.js';
import {BSplineCuad, BSplineCubic} from '../curves/bspline.js';

import {Rotation} from '../transformations/rotation.js';

import {Graphic} from '../3d/graphic.js';
import {World} from '../3d/world.js';


export class BSplineQuadRevHelixApp extends App {

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
		var camera = new Camera(this.gl, this.canvas, [0.0, -5.0, 15.0]);
		scene.addCamera(camera);

		// World
		var world = new World();

		var shape = new BSplineCuad([[2.0, 2.0, 0.0],
					    [2.0, 4.0, 0.0],
					    [4.0, 4.0, 0.0],
					    [4.0, 2.0, 0.0],
					    [4.0, 0.0, 0.0],
					    [2.0, 0.0, 0.0],
					    [2.0, 2.0, 0.0],
					    [2.0, 4.0, 0.0]]);

		var model = new RevolutionSurface(shape, [0.0, 1.0, 0.0], 16, 100);

		var t1 = [new Rotation([1.0, 1.0, 0.0], 0.0, 0.01)];
		var gt1 = new Graphic(this.gl, model, t1, shader);

		world.add(gt1);

		scene.add(world);

		scene.draw();
	}
}

export class BSplineQuadSweepHeliApp extends App {

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
		var camera = new Camera(this.gl, this.canvas, [0.0, -5.0, 15.0]);
		scene.addCamera(camera);

		// World
		var world = new World();

               var shape = new BSplineCuad([[3.0, 6.0, 0.0],
                                       [5.0, 6.0, 0.0],
                                       [6.0, 4.0, 0.0],
                                       [8.0, 4.0, 0.0],
                                       [8.0, 2.0, 0.0],
                                       [6.0, 2.0, 0.0],
                                       [5.0, 0.0, 0.0],
                                       [3.0, 0.0, 0.0],
                                       [2.0, 2.0, 0.0],
                                       [0.0, 2.0, 0.0],
                                       [0.0, 4.0, 0.0],
                                       [2.0, 4.0, 0.0],
                                       [3.0, 6.0, 0.0],
                                       [5.0, 6.0, 0.0]]);

		shape.move([-4.0, -3.0, 0.0]);

		var path = new BSplineCuad([[0.0, 0.0, 0.0],
					[1.0, 0.0, 0.0],
					[2.0, 0.0, 0.0],
					[3.0, 0.0, 0.0],
					[4.0, 0.0, 0.0]]);

		var model = new SweepSurface(shape, path, 100, 100, 0.2);

		var t1 = [new Rotation([0.0, 1.0, 0.0], 0.0, 0.01)];
		var gt1 = new Graphic(this.gl, model, t1, shader);

		world.add(gt1);

		scene.add(world);

		scene.draw();
	}
}

export class BSplineQuadSweepHeliCenterApp extends App {

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
		var camera = new Camera(this.gl, this.canvas, [0.0, -5.0, 15.0]);
		scene.addCamera(camera);

		// World
		var world = new World();

		var shape = new BSplineCuad([[4.0, 9.0, 0.0],
					[5.0, 9.0, 0.0],
					[6.0, 9.0, 0.0],
					[7.0, 9.0, 0.0],
					[8.0, 9.0, 0.0],
					[9.0, 8.0, 0.0],
					[10.0, 7.0, 0.0],
					[11.0, 6.0, 0.0],
					[10.0, 4.0, 0.0],
					[9.0, 3.0, 0.0],
					[8.0, 3.0, 0.0],
					[7.0, 3.0, 0.0],
					[6.0, 3.0, 0.0],
					[5.0, 3.0, 0.0],
					[4.0, 3.0, 0.0],
					[3.0, 3.0, 0.0],
					[2.0, 4.0, 0.0],
					[1.0, 6.0, 0.0],
					[2.0, 7.0, 0.0],
					[3.0, 8.0, 0.0],
					[4.0, 9.0, 0.0],
					[5.0, 9.0, 0.0]]);

		var path = new BSplineCuad([[0.0, 0.0, 0.0],
					[1.0, 0.0, 0.0],
					[2.0, 0.0, 0.0],
					[3.0, 0.0, 0.0],
					[4.0, 0.0, 0.0],
					[5.0, 0.0, 0.0],
					[6.0, 0.0, 0.0]]);

		var model = new SweepSurface(shape, path, 100, 100, 1);

		var t1 = [new Rotation([0.0, 1.0, 0.0], 0.0, 0.01)];
		var gt1 = new Graphic(this.gl, model, t1, shader);

		world.add(gt1);

		scene.add(world);

		scene.draw();
	}
}

export class BezierQuadSweepHeliCenterApp extends App {

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
		var camera = new Camera(this.gl, this.canvas, [0.0, -5.0, 15.0]);
		scene.addCamera(camera);

		// World
		var world = new World();

		var shape = new BezierCuad([[2.0, 4.0, 0.0],
					[3.0, 4.0, 0.0],
					[4.0, 4.0, 0.0],
					[5.0, 3.0, 0.0],
					[6.0, 2.0, 0.0],
					[5.0, 1.0, 0.0],
					[4.0, 0.0, 0.0],
					[3.0, 0.0, 0.0],
					[2.0, 0.0, 0.0],
					[1.0, 1.0, 0.0],
					[0.0, 2.0, 0.0],
					[1.0, 3.0, 0.0],
					[2.0, 4.0, 0.0]]);

		var path = new BezierCuad([[0.0, 0.0, 0.0],
					[1.0, 0.0, 0.0],
					[2.0, 0.0, 0.0],
					[3.0, 0.0, 0.0],
					[4.0, 0.0, 0.0],
					[5.0, 0.0, 0.0],
					[6.0, 0.0, 0.0]]);

		var model = new SweepSurface(shape, path, 100, 100, 1);

		var t1 = [new Rotation([0.0, 1.0, 0.0], 0.0, 0.01)];
		var gt1 = new Graphic(this.gl, model, t1, shader);

		world.add(gt1);

		scene.add(world);

		scene.draw();
	}
}

