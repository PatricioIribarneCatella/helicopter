//
// Abstract class 'Surface'
//
export class Surface {

	constructor(cols, rows) {
		
		this.cols = cols;
		this.rows = rows;
		
		this.position_buffer = [];
		this.color_buffer = [];
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
