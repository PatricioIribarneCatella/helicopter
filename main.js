import {SolarSystemApp} from './solarsystem.js';
import {ToroidApp} from './toroid.js';

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
	var app = new ToroidApp(gl, canvas);

	app.start();
}

window.onload = main;
