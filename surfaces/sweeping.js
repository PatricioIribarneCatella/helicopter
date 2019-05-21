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
		
		super(res, levels);

		this.shape = shape;
		this.path = path;
		this.color = color;
		this.endScale = endScale;

		this._init();
	}

	/* private methods */
	
	_createModel() {

		var u, v, p, t, b, n, scale, pos, matrix;

		var gradientScale = (this.endScale - 1) / (this.rows - 1);

		matrix = mat4.create();

		matrix[3] = 0.0; matrix[7] = 0.0; matrix[11] = 0.0;
		matrix[15] = 1.0;

		for (var i = 0.0; i < this.rows; i++) {
		
			u = i / (this.rows - 1);

			scale = 1 + i * gradientScale;

			t = this.path.getTangent(u);
			b = this.path.getBinormal(u);
			n = this.path.getNormal(u);
			pos = this.path.get(u);

			for (var k = 0; k < 3; k++) {
			
				matrix[k] = b[k];
				matrix[k+4] = n[k];
				matrix[k+8] = t[k];
				matrix[k+12] = pos[k];
			}

			for (var j = 0.0; j < this.cols; j++) {

				v = j / (this.cols - 1);

				pos = this.shape.get(v);

				// scale shape
				pos = [pos[0]*scale, pos[1]*scale, pos[2]*scale];

				p = vec4.fromValues(pos[0], pos[1], pos[2], 1);
				p = vec4.transformMat4(p, p, matrix);

				this.position_buffer.push(p[0]);
				this.position_buffer.push(p[1]);
				this.position_buffer.push(p[2]);
			}
		}
	}

	_createColor() {

		var c;

		for (var i = 0.0; i < this.rows; i++) {
			for (var j = 0.0; j < this.cols; j++) {
		
				c = this.color.get(this.rows, this.cols, i, j);

				this.color_buffer.push(c.r);
				this.color_buffer.push(c.g);
				this.color_buffer.push(c.b);
			};
		};
	}

	_init() {
		this._createModel();
		this._createColor();
	}
}
