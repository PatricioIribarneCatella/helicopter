import {App} from './scene/app.js';
import {Scene} from './scene/scene.js';
import {Camera} from './scene/camera.js';

import {ShaderProgram} from './shaders/program.js';

import {BezierCuad, BezierCubic} from './curves/bezier.js';

import {Rotation} from './transformations/rotation.js';

import {Graphic} from './3d/graphic.js';
import {World} from './3d/world.js';

export class CurveApp extends App {

	constructor(gl, canvas) {
		super(gl, canvas);
	}

	/* private methods */

	_bezierCuadTest() {
		
		console.log("Bezier Cuadratic Test\n");

		var c = new BezierCuad([[0.0, 0.0, 0.0],[1.0, 1.0, 0.0],[2.0, 0.0, 0.0]]);

		var N = 10, pos;

		for (var i = 0; i < N; i++) {
		
			pos = c.get(i / N);

			console.log(pos);
		}
	}

	_bezierCubicTest() {
		
		console.log("Bezier Cubic Test\n");
/*
		var c = new BezierCubic([[0.0, 0.0, 0.0],[1.0, 1.0, 0.0],[2.0, 0.0, 0.0],[]]);

		var N = 10, pos;

		for (var i = 0; i < N; i++) {
		
			pos = c.get(i / N);

			console.log(pos);
		}
*/
	}

	_bsplineCuadTest() {
	
		console.log("BSpline Cuadratic Test\n");
	}

	_bsplineCubicTest() {
	
		console.log("BSpline Cubic Test\n");
	}

	/* public methods */

	start() {
		this._bezierCuadTest();
		this._bezierCubicTest();
		this._bsplineCuadTest();
		this._bsplineCubicTest();
	}
}

