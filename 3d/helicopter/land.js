import {Translation} from '../../transformations/translation.js';
import {Rotation} from '../../transformations/rotation.js';
import {Terrain} from '../../shapes/helicopter/terrain.js';

import {Graphic} from '../graphic.js';

export class GraphicLand extends Graphic {

	constructor(gl, shader) {
	
		var land = new Terrain();
		var tland = [new Translation([0.0, -30.0, 0.0]),
			     new Rotation([1.0, 0.0, 0.0], -Math.PI/2, 0.0)];

		super(gl, land, tland, shader);

		this.textures = [];
		this.uniforms = {};
		this.texId = 0;
	}

	/* private methods */

	_bindLights(lights, eye) {

		// Direct Light
		var uniformDirectLight = this.program.findUniform("directLight");
		var uniformDirectColor = this.program.findUniform("directColor");

		this.gl.uniform3fv(uniformDirectLight, lights.direct.getDirection());
		this.gl.uniform3fv(uniformDirectColor, lights.direct.getColor());

		// Left Point Light
		var uniformRedLightPos = this.program.findUniform("leftLightPos");
		var uniformGreenLightPos = this.program.findUniform("rightLightPos");

		this.gl.uniform3fv(uniformRedLightPos, lights.red.getPosition());
		this.gl.uniform3fv(uniformGreenLightPos, lights.green.getPosition());

		// Right Point Light
		var uniformRedColor = this.program.findUniform("pointLeftColor");
		var uniformGreenColor = this.program.findUniform("pointRightColor");

		this.gl.uniform3fv(uniformRedColor, lights.red.getColor());
		this.gl.uniform3fv(uniformGreenColor, lights.green.getColor());

		// Spot Light
		var uniformSpotPos = this.program.findUniform("spotLightPos");
		var uniformSpotDir = this.program.findUniform("spotLightDir");
		var uniformSpotColor = this.program.findUniform("spotColor");

		this.gl.uniform3fv(uniformSpotPos, lights.spot.getPosition());
		this.gl.uniform3fv(uniformSpotDir, lights.spot.getDirection());
		this.gl.uniform3fv(uniformSpotColor, lights.spot.getColor());

		// Camera 'eye'
		var uniformEye = this.program.findUniform("eye");
		this.gl.uniform3fv(uniformEye, eye);
	}

	_useColor() {
		return false;
	}

	_bindTexture() {
		
		for (var i = 0; i < this.textures.length; i++) {
			
			var uniformSampler = this.program.findUniform(this.uniforms[i]);

			this.gl.activeTexture(this.gl.TEXTURE0 + i);
			this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures[i]);
			this.gl.uniform1i(uniformSampler, i);
		}
	}

	_hasTobindCoordBuffer() {
		return true;
	}
	
	/* public methods */

	loadTexture(image, uniformName) {
		
		var texture = this._loadImage(image);

		this.textures.push(texture);
		this.uniforms[this.texId++] = uniformName;
	}
}
