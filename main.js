import {SolarSystemApp} from './tests/solar-system.js';
import {ToroidSweepApp} from './tests/toroid-sweep.js';
import {ToroidRevApp} from './tests/toroid-rev.js';

import {CurveApp} from './tests/curve-calc.js';
import {BezierQuadCurveSweepApp, BezierCubicCurveSweepApp} from './tests/curve-bezier-sweep.js';
import {BSplineQuadCurveSweepApp, BSplineCubicCurveSweepApp,
	BSplineCubicCurveLinePathSweepApp} from './tests/curve-bspline-sweep.js';
import {BezierQuadCurveRevApp, BezierCubicCurveRevApp} from './tests/curve-bezier-rev.js';
import {BSplineQuadCurveRevApp, BSplineCubicCurveRevApp} from './tests/curve-bspline-rev.js';

import {HelixCirclePartApp,
	HelixScaledPartApp,
	HelicopterCenterPartApp,
	HelicopterCenterHexagonPartApp,
	HelicopterCenterHexagonScaledPartApp,
	HelicopterLandingGearPartApp,
	HelicopterLandingGearBasePartApp,
	HelicopterStairwayStepsPartApp,
	HelicopterStairwayPartApp,
	HelicopterHelixBladePartApp,
	HelicopterCylinderPartsApp} from './tests/helicopter.js';

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

	// General tests
	//
	//app = new SolarSystemApp(gl, canvas);
	//app = new ToroidSweepApp(gl, canvas);
	//app = new ToroidRevApp(gl, canvas);
	
	// Curve and Surfaces tests
	//
	//app = new CurveApp(gl, canvas);
	//
	//app = new BezierQuadCurveSweepApp(gl, canvas);
	//app = new BezierCubicCurveSweepApp(gl, canvas);
	//
	//app = new BSplineQuadCurveSweepApp(gl, canvas);
	//app = new BSplineCubicCurveLinePathSweepApp(gl, canvas);
	//app = new BSplineCubicCurveSweepApp(gl, canvas);
	//
	//app = new BezierQuadCurveRevApp(gl, canvas);
	//app = new BezierCubicCurveRevApp(gl, canvas);
	//
	//app = new BSplineQuadCurveRevApp(gl, canvas);
	//app = new BSplineCubicCurveRevApp(gl, canvas);

	// Helicopter tests
	//
	//app = new HelixCirclePartApp(gl, canvas);
	//app = new HelixScaledPartApp(gl, canvas);
	//app = new HelicopterCenterPartApp(gl, canvas);
	//app = new HelicopterCenterHexagonPartApp(gl, canvas);
	//app = new HelicopterCenterHexagonScaledPartApp(gl, canvas);
	//app = new HelicopterLandingGearPartApp(gl, canvas);
	//app = new HelicopterLandingGearBasePartApp(gl, canvas);
	//app = new HelicopterStairwayStepsPartApp(gl, canvas);
	//app = new HelicopterStairwayPartApp(gl, canvas);
	//app = new HelicopterHelixBladePartApp(gl, canvas);
	app = new HelicopterCylinderPartsApp(gl, canvas);

	app.start();
}

window.onload = main;

