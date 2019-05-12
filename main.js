import {SolarSystemApp} from './solarsystem.js';
import {ToroidSweepApp} from './toroid-sweep.js';
import {ToroidRevApp} from './toroid-rev.js';

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

	//var app = new SolarSystemApp(gl, canvas);
	//var app = new ToroidSweepApp(gl, canvas);
	var app = new ToroidRevApp(gl, canvas);

	app.start();
}

window.onload = main;
