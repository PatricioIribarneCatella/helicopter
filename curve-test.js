import {App} from './scene/app.js';
import {Scene} from './scene/scene.js';
import {Camera} from './scene/camera.js';

import {ShaderProgram} from './shaders/program.js';

import {BezierCuad, BezierCubic} from './curves/bezier.js';
import {BSplineCuad, BSplineCubic} from './curves/bspline.js';

import {Rotation} from './transformations/rotation.js';

import {Graphic} from './3d/graphic.js';
import {World} from './3d/world.js';

export class CurveApp extends App {

	constructor(gl, canvas) {
		super(gl, canvas);
	}

	/* private methods */

	_printResult(curve) {
		
		var N = 10, pos;

		for (var i = 0; i < N; i++) {
		
			pos = curve.get(i / N);

			console.log(pos);
		}
	}

	_bezierCuadTest() {
		
		console.log("Bezier Cuadratic Test\n");

		var c = new BezierCuad([[0.0, 0.0, 0.0],[1.0, 1.0, 0.0],[2.0, 0.0, 0.0]]);

		this._printResult(c);
	}

	_bezierCubicTest() {
		
		console.log("Bezier Cubic Test\n");

		var c = new BezierCubic([[0.0, 0.0, 0.0],[1.0, 1.0, 0.0],[2.0, 1.0, 0.0],[3.0, 0.0, 0.0]]);

		this._printResult(c);
	}

	_bsplineCuadTest() {
	
		console.log("BSpline Cuadratic Test\n");

		var c = new BSplineCuad([[0.0, 0.0, 0.0],[1.0, 1.0, 0.0],[2.0, 0.0, 0.0]]);

		this._printResult(c);
	}

	_bsplineCubicTest() {
	
		console.log("BSpline Cubic Test\n");

		var c = new BSplineCubic([[0.0, 0.0, 0.0],[1.0, 1.0, 0.0],[2.0, 1.0, 0.0],[3.0, 0.0, 0.0]]);

		this._printResult(c);
	}

	/* public methods */

	start() {
		this._bezierCuadTest();
		this._bezierCubicTest();
		this._bsplineCuadTest();
		this._bsplineCubicTest();
	}
}

