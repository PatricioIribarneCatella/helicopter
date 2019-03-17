//
// Manges the scene and the objects
// that live in. (Shaders too)
//
export class Scene {

	constructor(gl) {
		this.gl = gl;
	}

	// private methods

	init() {
		console.log("init-scene");
	}

	// public methods

	draw() {
		this.init();
		console.log("drawing-scene");
	}
}

