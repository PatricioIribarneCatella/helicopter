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
		
		super(res, rows, color);

		this.shape = shape;
		this.axis = axis;

		this._init();
	}

	/* private methods */
	
	_createModel() {

		var p, v, nS, ang, pos, matrix;
		
		matrix = mat4.create();

		for (var i = 0.0; i < this.rows; i++) {
		
			ang = 2 * Math.PI * (i / this.rows - 1);

			mat4.identity(matrix);
			mat4.rotate(matrix, matrix, ang, this.axis);
			
			for (var j = 0.0; j < this.cols; j++) {

				v = j / (this.cols - 1);

				pos = this.shape.get(v);
				nS = this.shape.getNormal(v);

				// transform position
				p = vec4.fromValues(pos[0], pos[1], pos[2], 1);
				vec4.transformMat4(p, p, matrix);

				this.position_buffer.push(p[0]);
				this.position_buffer.push(p[1]);
				this.position_buffer.push(p[2]);

				// transform normal
				p = vec4.fromValues(nS[0], nS[1], nS[2], 1);
				vec4.transformMat4(p, p, matrix);

				this.normal_buffer.push(p[0]);
				this.normal_buffer.push(p[1]);
				this.normal_buffer.push(p[2]);
			}
		}

		for (var j = 0.0; j < this.cols; j++) {
			
			v = j / (this.cols - 1);

			pos = this.shape.get(v);

			this.position_buffer.push(pos[0]);
			this.position_buffer.push(pos[1]);
			this.position_buffer.push(pos[2]);
			
			nS = this.shape.getNormal(v);

			this.normal_buffer.push(nS[0]);
			this.normal_buffer.push(nS[1]);
			this.normal_buffer.push(nS[2]);
		}

		this.rows += 1;
	}

	_init() {
		this._createModel();
		this._createColor();
	}
}
