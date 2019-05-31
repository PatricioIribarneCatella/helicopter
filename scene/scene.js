//
// Manages the scene and the objects
// that live in. (Shaders too)
//
export class Scene {

	constructor(gl) {
		this.gl = gl;
	}

	/* public methods */

	add(world) {
		this.world = world;
	}

	addCamera(camera) {
		this.camera = camera;
	}

	addController(controller) {
		this.controller = controller;
	}

	draw() {
		window.requestAnimationFrame(() => this.draw());
		
		this.controller.update();

		this.camera.update(this.controller);

		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

		this.world.draw(this.camera, this.controller);

		$("#display").html(this.controller.getInfo());
	}
}

