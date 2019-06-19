import {Surface} from '../surfaces/surface.js';

//
// Represents a Grid made up 
// of triangles and drawn it 
// by TRIANGLE_STRIP
//
export class Grid extends Surface {

	constructor(rows, cols, color) {
		
		super(cols, rows, color);
		
		this._init();
	}

	/* private methods */

	_createModel() {

		for (var i = 0.0; i < this.rows; i++) {
			for (var j = 0.0; j < this.cols; j++) {
			
				// position buffer
				var x = j - (this.cols - 1.0) / 2.0;
				var y = i - (this.rows - 1.0) / 2.0;
				var z = 0;
				
				this.position_buffer.push(x);
				this.position_buffer.push(y);
				this.position_buffer.push(z);

				// normal buffer
				this.normal_buffer.push(0.0);
				this.normal_buffer.push(0.0);
				this.normal_buffer.push(1.0);

				// uv texture buffer
				var u = i * 1/(this.rows - 1);
				var v = j * 1/(this.cols - 1);

				this.coord_buffer.push(u);
				this.coord_buffer.push(v);
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

