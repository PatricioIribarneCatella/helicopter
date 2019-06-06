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

	addLights(lights) {
		this.lights = lights;
	}

	draw() {
		window.requestAnimationFrame(() => this.draw());
		
		this.controller.update();

		this.camera.update(this.controller);

		for (l in this.lights) {
			this.lights[l].update(this.controller);
		}

		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

		this.world.draw(this.camera, this.controller, this.lights);

		$("#display").html(this.controller.getInfo());
	}
}

