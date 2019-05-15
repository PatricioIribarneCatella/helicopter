import {SolarSystemApp} from './solar-system.js';
import {ToroidSweepApp} from './toroid-sweep.js';
import {ToroidRevApp} from './toroid-rev.js';
import {CurveApp} from './curve-test.js';
import {CurveSweepApp} from './curve-sweep.js';

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
	app = new CurveSweepApp(gl, canvas);

	app.start();
}

window.onload = main;
