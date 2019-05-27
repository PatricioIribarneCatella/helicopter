import {SolarSystemApp} from './tests/solar-system.js';
import {ToroidSweepApp} from './tests/toroid-sweep.js';
import {ToroidRevApp} from './tests/toroid-rev.js';

import {CurveApp} from './tests/curve-calc.js';

import {BezierQuadCurveSweepApp,
	BezierCubicCurveSweepApp} from './tests/curve-bezier-sweep.js';

import {BSplineQuadCurveSweepApp,
	BSplineCubicCurveSweepApp,
	BSplineCubicCurveLinePathSweepApp} from './tests/curve-bspline-sweep.js';

import {BezierQuadCurveRevApp,
	BezierCubicCurveRevApp} from './tests/curve-bezier-rev.js';

import {BSplineQuadCurveRevApp,
	BSplineCubicCurveRevApp} from './tests/curve-bspline-rev.js';

import {HelicopterCenterBack,
	HelicopterCenterFront, 
	HelicopterCenterHexagon,
	HelicopterCenterCurve} from './tests/helicopter-center.js';

import {HelicopterHelixBlade,
	HelicopterHelixContainer,
	HelicopterHelixConnector} from './tests/helicopter-helix.js';

import {HelicopterLandingGear,
	HelicopterLandingGearBase} from './tests/helicopter-landing.js';

import {HelicopterStairway,
	HelicopterStairwaySteps} from './tests/helicopter-stairway.js';

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

	// Helicopter shapes
	//app = new HelicopterCenterBack(gl, canvas);
	//app = new HelicopterCenterFront(gl, canvas);
	//app = new HelicopterCenterHexagon(gl, canvas);
	app = new HelicopterCenterCurve(gl, canvas);
	//app = new HelicopterHelixBlade(gl, canvas);
	//app = new HelicopterHelixContainer(gl, canvas);
	//app = new HelicopterHelixConnector(gl, canvas);
	//app = new HelicopterLandingGear(gl, canvas);
	//app = new HelicopterLandingGearBase(gl, canvas);
	//app = new HelicopterStairway(gl, canvas);
	//app = new HelicopterStairwaySteps(gl, canvas);

	app.start();
}

window.onload = main;

