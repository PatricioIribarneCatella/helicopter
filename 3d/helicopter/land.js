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
	
		var uniformRedLightPos = this.program.findUniform("leftLightPos");
		var uniformGreenLightPos = this.program.findUniform("rightLightPos");

		this.gl.uniform3fv(uniformRedLightPos, lights.red.getPosition());
		this.gl.uniform3fv(uniformGreenLightPos, lights.green.getPosition());

		var uniformRedColor = this.program.findUniform("pointLeftColor");
		var uniformGreenColor = this.program.findUniform("pointRightColor");

		this.gl.uniform3fv(uniformRedColor, lights.red.getColor());
		this.gl.uniform3fv(uniformGreenColor, lights.green.getColor());

		var uniformSpotPos = this.program.findUniform("spotLightPos");
		var uniformSpotDir = this.program.findUniform("spotLightDir");
		var uniformSpotColor = this.program.findUniform("spotColor");

		this.gl.uniform3fv(uniformSpotPos, lights.spot.getPosition());
		this.gl.uniform3fv(uniformSpotDir, lights.spot.getDirection());
		this.gl.uniform3fv(uniformSpotColor, lights.spot.getColor());

		var uniformEye = this.program.findUniform("eye");
		this.gl.uniform3fv(uniformEye, eye);
	}

	_useColor() {
		return false;
	}

	_handleLoadedTexture(id) {
	
		var t = this.textures[id];

		this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
		this.gl.bindTexture(this.gl.TEXTURE_2D, t);
		this.gl.texImage2D(this.gl.TEXTURE_2D, 0,
				   this.gl.RGBA, this.gl.RGBA,
				   this.gl.UNSIGNED_BYTE, t.image);
		this.gl.texParameteri(this.gl.TEXTURE_2D,
				      this.gl.TEXTURE_WRAP_S,
				      this.gl.CLAMP_TO_EDGE);
		this.gl.texParameteri(this.gl.TEXTURE_2D,
				      this.gl.TEXTURE_WRAP_T,
				      this.gl.CLAMP_TO_EDGE);
		this.gl.texParameteri(this.gl.TEXTURE_2D,
				      this.gl.TEXTURE_MIN_FILTER,
				      this.gl.LINEAR);
		this.gl.texParameteri(this.gl.TEXTURE_2D,
				      this.gl.TEXTURE_MAG_FILTER,
				      this.gl.LINEAR);
		this.gl.bindTexture(this.gl.TEXTURE_2D, null);
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

	loadTexture(path, uniformName) {
		
		var texture = this.gl.createTexture();
		var id = this.texId;

		texture.image = new Image();
		texture.image.onload = () => this._handleLoadedTexture(id);
		texture.image.src = path;

		this.textures.push(texture);
		this.uniforms[id] = uniformName;
		this.texId++;
	}
}
