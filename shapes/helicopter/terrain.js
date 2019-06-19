import {ImprovedNoise} from '../../libs/noise.js';

import {Color} from '../../3d/color.js';
import {Grid} from '../../shapes/grid.js';

//
// Represents the terrain with 
// planes and mountains.
//
// It uses the implementation done in Three.js:
//
// 	- https://github.com/mrdoob/three.js/blob/master/examples/webgl_geometry_terrain.html
// 	- https://github.com/mrdoob/three.js/blob/master/examples/js/math/ImprovedNoise.js
//
export class Terrain extends Grid {

	constructor() {
	
		super(200, 200, new Color([]));

		this._transform();
	}
	
	_generateHeight(width, height) {
		
		var size = width * height;
		var data = new Uint8Array(size);
		var quality = 1, z = Math.random() * 0.10;
		
		var noise = new ImprovedNoise();
		
		for (var j = 0; j < 4; j++) {
			
			for ( var i = 0; i < size; i++) {
				
				var x = i % width;
				var y = ~ ~ (i / width);
				
				data[i] += Math.abs(noise.perlin(x/quality, y/quality, z) * quality * 1.75);
			}
			
			quality *= 5;
		}

		return data;
	}

	_transform() {
		
		var data = this._generateHeight(this.cols, this.rows);

		for (var i = 0, j = 0, l = data.length; i < l; i++, j += 3) {
			this.position_buffer[j + 2] = data[i] * 0.5;
		}
	}
}
