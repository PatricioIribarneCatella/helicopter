import {Surface} from '../surfaces/surface.js';

//
// Represents a Sphere made up 
// of triangles and drawn it 
// by TRIANGLE_STRIP
//
export class Sphere extends Surface {

	constructor(rows, cols, color) {
		
		super(cols, rows, color);

		this.theta = 2 * Math.PI / this.rows;
		this.phi = 2 * Math.PI / this.cols;
		
		this._init();
	}

	/* private methods */

	_createModel() {

		for (var i = 0.0; i < this.rows; i++) {
			for (var j = 0.0; j < this.cols; j++) {
				
				var x = Math.cos(i * this.theta) * Math.sin(j * this.phi);
				var y = Math.sin(i * this.theta) * Math.sin(j * this.phi);
				var z = Math.cos(j * this.phi);
				
				this.position_buffer.push(x);
				this.position_buffer.push(y);
				this.position_buffer.push(z);
			};
		};
	}

	_init() {
		// generates a GRID defined by
		// 'cols' and 'rows'
		// with colors per vertex
		// and indexes to render it
		
		this._createModel();
		this._createColor();
	}
}

