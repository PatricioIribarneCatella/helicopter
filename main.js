import {HelicopterApp} from './helicopter.js';

//
// main function
//
function main() {

	var canvas = document.getElementById("canvas");

	var gl = canvas.getContext("webgl");

	canvas.width = $(window).width() - 20;
	canvas.height = $(window).height() - 30;

	// check if WebGL is available
	if (gl ===  null) {
		alert("WebGl not available");
		return;
	}

	var app;

	app = new HelicopterApp(gl, canvas);

	app.start();
}

window.onload = main;

