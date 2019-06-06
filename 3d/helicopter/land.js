import {Translation} from '../../transformations/translation.js';
import {Rotation} from '../../transformations/rotation.js';
import {Grid} from '../../shapes/grid.js';

import {Graphic} from '../graphic.js';
import {Color} from '../color.js';

export class GraphicLand extends Graphic {

	constructor(gl, shader) {
	
		var land = new Grid(200, 200, new Color([0.4, 0.4, 0.4]));
		var tland = [new Translation([0.0, -5.0, 0.0]),
			     new Rotation([1.0, 0.0, 0.0], Math.PI/2, 0.0)];

		super(gl, land, tland, shader);
	}

	_bindLights(lights, eye) {
	
		var uniformRedLightPos = this.program.findUniform("leftLightPos");
		var uniformGreenLightPos = this.program.findUniform("rightLightPos");

		this.gl.uniform3fv(uniformRedLightPos, lights.red.getPosition());
		this.gl.uniform3fv(uniformGreenLightPos, lights.green.getPosition());

		var uniformRedColor = this.program.findUniform("pointLeftColor");
		var uniformGreenColor = this.program.findUniform("pointRightColor");

		this.gl.uniform3fv(uniformRedColor, lights.red.getColor());
		this.gl.uniform3fv(uniformGreenColor, lights.green.getColor());

		var uniformEye = this.program.findUniform("eye");
		this.gl.uniform3fv(uniformEye, eye);
	}
}
