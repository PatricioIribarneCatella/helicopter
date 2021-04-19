import {Surface} from './surface.js';

//
// Represents a Sweep surface
// made from a 'shape' curve object
// and a 'path' curve object
// 
// Rows and columns are given
// by levels and res (a.k.a vertical 
// 	resolution)
//
// 'endScale' must be zero if
// the object has to mantain its original
// shape's size
//
export class SweepSurface extends Surface {

	constructor(shape, path, levels, res, endScale, color) {
		
		super(res, levels, color);

		this.shape = shape;
		this.path = path;
		this.endScale = endScale;

		this._init();
	}

	/* private methods */
	
	_createModel() {

		var u, v, p, t, b, n, nS, scaleX, scaleY, posP, posS, matrix;

		var gradientScaleX = (this.endScale[0] - 1) / (this.rows - 1);
		var gradientScaleY = (this.endScale[1] - 1) / (this.rows - 1);

		matrix = mat4.create();

		matrix[3] = 0.0; matrix[7] = 0.0; matrix[11] = 0.0;
		matrix[15] = 1.0;

		for (var i = 0.0; i < this.rows; i++) {
		
			u = i / (this.rows - 1);

			scaleX = 1 + (i * gradientScaleX);
			scaleY = 1 + (i * gradientScaleY);

			t = this.path.getTangent(u);
			b = this.path.getBinormal(u);
			n = this.path.getNormal(u);
			posP = this.path.get(u);

			for (var k = 0; k < 3; k++) {
			
				matrix[k] = b[k];
				matrix[k+4] = n[k];
				matrix[k+8] = t[k];
				matrix[k+12] = 0.0;
			}

			for (var j = 0.0; j < this.cols; j++) {

				v = j / (this.cols - 1);

				posS = this.shape.get(v);
				nS = this.shape.getNormal(v);

				// scale shape
				posS = [posS[0]*scaleX, posS[1]*scaleY, posS[2]];

				// transform position
				p = vec4.fromValues(posS[0], posS[1], posS[2], 1);
				p = vec4.transformMat4(p, p, matrix);
				p = [p[0] + posP[0], p[1] + posP[1], p[2] + posP[2]];

				this.position_buffer.push(p[0]);
				this.position_buffer.push(p[1]);
				this.position_buffer.push(p[2]);

				// transform normal
				p = vec4.fromValues(nS[0], nS[1], nS[2], 1);
				p = vec4.transformMat4(p, p, matrix);

				this.normal_buffer.push(p[0]);
				this.normal_buffer.push(p[1]);
				this.normal_buffer.push(p[2]);
			}
		}
	}

	_init() {
		this._createModel();
		this._createColor();
	}
}
