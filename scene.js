import {ShaderProgram} from './program.js';

//
// Manages the scene and the objects
// that live in. (Shaders too)
//
export class Scene {

	constructor(gl, vert_shader_id, frag_shader_id) {
		this.gl = gl;
		this.vs_id = vert_shader_id;
		this.fs_id = frag_shader_id;
		this.elements = [];
		this.program = new ShaderProgram(this.gl, this.vs_id, this.fs_id);
	}

	/* public methods */

	add(element) {
		this.elements.push(element);
	}

	draw() {
		var e1 = this.elements[0];
		e1.draw(this.program);
	}
}

