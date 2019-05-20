import {SolarSystemApp} from './tests/solar-system.js';

import {ToroidSweepApp} from './tests/toroid-sweep.js';
import {ToroidRevApp} from './tests/toroid-rev.js';

import {CurveApp} from './tests/curve-calc.js';
import {BezierQuadCurveSweepApp, BezierCubicCurveSweepApp} from './tests/curve-bezier-sweep.js';
import {BSplineQuadCurveSweepApp, BSplineCubicCurveSweepApp} from './tests/curve-bspline-sweep.js';
import {BSplineQuadCurveRevApp} from './tests/curve-bspline-rev.js';

//
// main function
//
function main() {

	var canvas = document.getElementById("canvas");

	var gl = canvas.getContext("webgl");

	// check if WebGL is available
	if (gl ===  null) {
		alert("WebGl not available");
		return;
	}

	var app;
	//app = new SolarSystemApp(gl, canvas);
	//app = new ToroidSweepApp(gl, canvas);
	//app = new ToroidRevApp(gl, canvas);
	//app = new CurveApp(gl, canvas);
	//app = new BezierQuadCurveSweepApp(gl, canvas);
	//app = new BezierCubicCurveSweepApp(gl, canvas);
	//app = new BSplineQuadCurveSweepApp(gl, canvas);
	app = new BSplineCubicCurveSweepApp(gl, canvas);
	//app = new BSplineQuadCurveRevApp(gl, canvas);

	app.start();
}

window.onload = main;

