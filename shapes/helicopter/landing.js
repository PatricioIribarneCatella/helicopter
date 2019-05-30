import {BSplineCuad} from '../../curves/bspline.js';
import {BezierCuad} from '../../curves/bezier.js';
import {SweepSurface} from '../../surfaces/sweeping.js';
import {RevolutionSurface} from '../../surfaces/revolution.js';

import {Color} from '../../3d/color.js';
import {Container3D} from '../../3d/container.js';
import {Graphic} from '../../3d/graphic.js';

import {Identity} from '../../transformations/identity.js';
import {Rotation} from '../../transformations/rotation.js';
import {Translation} from '../../transformations/translation.js';
import {Scale} from '../../transformations/scaling.js';
import {LegRotation} from '../../transformations/helicopter/rotation.js';

import {Cylinder} from '../../shapes/cylinder.js';

export class LandingGear extends SweepSurface {

	constructor() {

		var shape = new BSplineCuad([[0.0, 2.0, 0.0],
					[0.0, 4.0, 0.0],
					[2.0, 4.0, 0.0],
					[2.0, 2.0, 0.0],
					[2.0, 0.0, 0.0],
					[0.0, 0.0, 0.0],
					[0.0, 2.0, 0.0],
					[0.0, 4.0, 0.0]]);

		shape.move([-1.0, -2.0, 0.0]);

		var path = new BezierCuad([[0.0, 0.0, 0.0],
					[0.5, 0.0, 0.0],
					[1.0, 0.0, 0.0]]);

		var c = new Color([0.0, 0.50, 0.0]);

		super(shape, path, 16, 100, [1, 1], c);

		this._complete(path);
		this._createColor();
	}

	_complete(path) {

		var k, p;

		var pos_buffer = [];

		p = path.get(0.0);

		// Add level zero to create the 'floor'
		for (k = 0; k < this.cols; k++) {
			pos_buffer.push(p[0]);
			pos_buffer.push(p[1]);
			pos_buffer.push(p[2]);
		}

		// Move all the points to the new buffer
		for (k = 0; k < this.position_buffer.length; k++) {
			pos_buffer.push(this.position_buffer[k]);
		}

		p = path.get(1.0);
		
		// Add final level to create the 'roof'
		for (k = 0; k < this.cols; k++) {
			pos_buffer.push(p[0]);
			pos_buffer.push(p[1]);
			pos_buffer.push(p[2]);
		}

		this.position_buffer = pos_buffer;

		this.rows += 2;

	}
}

export class LandingGearBase extends RevolutionSurface {

	constructor() {
		
		var shape = new BezierCuad([[0.0, 4.0, 0.0],
					[0.5, 4.0, 0.0],
					[1.0, 4.0, 0.0],
					[3.0, 3.0, 0.0],
					[5.0, 2.0, 0.0],
					[5.0, 1.0, 0.0],
					[5.0, 0.0, 0.0],
					[2.5, 0.0, 0.0],
					[0.0, 0.0, 0.0]]);

		var c = new Color([0.9, 0.9, 0.9]);

		super(shape, [0.0, 1.0, 0.0], 4, 20, c);
	}
}

export class LandingLeg extends Container3D {

	constructor(position, gl, shader) {

		var upAngle, downAngle;
		
		if (position === "left") {
			upAngle = Math.PI/4;
			downAngle = -Math.PI/2;
		} else {
			upAngle = -Math.PI/4;
			downAngle = Math.PI/2;
		}

		super([new LegRotation(upAngle)]);

		this.upAngle = upAngle;
		this.downAngle = downAngle;

		this.gl = gl;
		this.shader = shader;
		this.position = position;

		this._initialize();
	}

	_initialize() {
	
		var gear = new LandingGear();

		//// Up ////
		var tgUp = [new Translation([-0.25, -1.0, 0.0]),
			    new Scale([0.25, 0.5, 0.25])];
		var up = new Graphic(this.gl, gear, tgUp, this.shader);

		this.add(up);

		//// Cylinder Union ////
		var union = new Cylinder(0.125, 0.6, 20, 20, new Color([0.0, 0.0, 1.0]));
		var tuni = [new Translation([0.0, -1.5, 0.0]),
			    new Rotation([0.0, 1.0, 0.0], -Math.PI/2, 0.0),
			    new Translation([0.0, 0.0, -0.30])];
		var gunion = new Graphic(this.gl, union, tuni, this.shader);

		this.add(gunion);

		//// Down and Base ////

		var tcDown = [new Translation([0.0, -1.5, 0.0]),
			      new LegRotation(this.downAngle)];
		var cdown = new Container3D(tcDown);

		//// Down ////
		var tgDown = [new Translation([0.0, -0.5, 0.0]),
			      new Scale([0.25, 0.5, 0.25])];
		var down = new Graphic(this.gl, gear, tgDown, this.shader);
		
		cdown.add(down);

		//// Base ////
		var base = new LandingGearBase();
		var tbase = [new Translation([0.0, -1.3, 0.0]),
			     new LegRotation(this.upAngle),
		     	     new Scale([2.0/5.0, 1.0/4.0, 2.0/5.0]),
			     new Rotation([0.0, 1.0, 0.0], Math.PI/4, 0.0),
			     new Translation([0.0, -4.0, 0.0])];
		var gbase = new Graphic(this.gl, base, tbase, this.shader);

		cdown.add(gbase);

		this.add(cdown);
	}
}
