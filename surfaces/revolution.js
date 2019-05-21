import {Surface} from './surface.js';

//
// Represents a Revolution surface
// made from a 'shape' curve object
// and a coordinate axis
// 
// Rows and columns are given
// by rows and res (a.k.a vertical 
// 	resolution)
//
export class RevolutionSurface extends Surface {

	constructor(shape, axis, rows, res, color) {
		
		super(res, rows);

		this.shape = shape;
		this.axis = axis;
		this.color = color;

		this._init();
	}

	/* private methods */
	
	_createModel() {

		var p, v, ang, pos, matrix;
		
		matrix = mat4.create();

		for (var i = 0.0; i < this.rows; i++) {
		
			ang = 2 * Math.PI * (i / this.rows - 1);

			mat4.identity(matrix);
			mat4.rotate(matrix, matrix, ang, this.axis);
			
			for (var j = 0.0; j < this.cols; j++) {

				v = j / (this.cols - 1);

				pos = this.shape.get(v);
				p = vec4.fromValues(pos[0], pos[1], pos[2], 1);

				vec4.transformMat4(p, p, matrix);

				this.position_buffer.push(p[0]);
				this.position_buffer.push(p[1]);
				this.position_buffer.push(p[2]);
			}
		}

		for (var j = 0.0; j < this.cols; j++) {
			
			v = j / (this.cols - 1);

			pos = this.shape.get(v);

			this.position_buffer.push(pos[0]);
			this.position_buffer.push(pos[1]);
			this.position_buffer.push(pos[2]);
		}

		this.rows += 1;
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
