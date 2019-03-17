import * as app from './app.js';

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

	app.init(gl, canvas);

	/*
		var app = new App(gl, canvas);

		app.start();

		-----------------------------------------------------

		class App {
			
			constructor(gl, canvas) {
				this.gl = gl;
				this.canvas = canvas;
				this.scene = new Scene(gl);
			}

			function start() {
				this.scene.draw();
			}
		}

		------------------------------------------------------

		class Scene {
		
			constructor(gl) {
				this.gl = gl;
				this.init();
			}

			function init() {
			
			}

			function draw() {
			
			}
		}
	*/
}

main();
