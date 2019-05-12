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
export class SweepSurface extends Surface {

	constructor(shape, path, levels, res) {
		
		super(res, levels);

		this.shape = shape;
		this.path = path;

		this._init();
	}

	/* private methods */
	
	_createModel() {

		var u, v, p, t, b, n, pos, matrix;

		matrix = mat4.create(matrix);

		for (var i = 0.0; i < this.rows; i++) {
		
			u = i / (this.rows - 1);

			t = this.path.getTangent(u);
			b = this.path.getBinormal(u);
			n = this.path.getNormal(u);
			pos = this.path.get(u);
			
			for (var k = 0; k < 4; k++) {
			
				if (k == 3 || k == 7 || k == 11) {
					matrix[k] = 0;
				} else if (k == 15) {
					matrix[k] = 1;
				} else {
					matrix[k] = b[k];
					matrix[k+4] = n[k];
					matrix[k+8] = t[k];
					matrix[k+12] = pos[k];
				}
			}

			for (var j = 0.0; j < this.cols; j++) {

				v = j / (this.cols - 1);

				pos = this.shape.get(v);
				p = vec4.fromValues(pos[0], pos[1], pos[2], 1);

				p = vec4.transformMat4(p, p, matrix);

				this.position_buffer.push(p[0]);
				this.position_buffer.push(p[1]);
				this.position_buffer.push(p[2]);
			}
		}
	}

	_createColor() {
	
		for (var i = 0.0; i < this.rows; i++) {
			for (var j = 0.0; j < this.cols; j++) {
				this.color_buffer.push(1.0 / this.rows * i);
				this.color_buffer.push(0.2);
				this.color_buffer.push(1.0 / this.cols * j);
			};
		};
	}

	_init() {
		this._createModel();
		this._createColor();
	}
}
