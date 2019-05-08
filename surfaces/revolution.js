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

	constructor(shape, axis, rows, res) {
		
		super(res, rows);

		this.shape = shape;
		this.axis = axis;

		this._init();
	}

	_init() {
		
	}

}
