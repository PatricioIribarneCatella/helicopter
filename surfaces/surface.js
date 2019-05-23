//
// Abstract class 'Surface'
//
export class Surface {

	constructor(cols, rows, color) {
		
		this.color = color;
		this.cols = cols;
		this.rows = rows;
		
		this.position_buffer = [];
		this.color_buffer = [];
	}

	/* private methods */

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

	/* public methods */

	getPosition() {
		return this.position_buffer;
	}

	getColor() {
		return this.color_buffer;
	}

	getCols() {
		return this.cols;
	}

	getRows() {
		return this.rows;
	}
}
