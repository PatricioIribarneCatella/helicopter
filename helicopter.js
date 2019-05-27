import {App} from '../scene/app.js';
import {Scene} from '../scene/scene.js';
import {Camera} from '../scene/camera.js';

import {ShaderProgram} from '../shaders/program.js';

import {Rotation} from '../transformations/rotation.js';
import {Identity} from '../transformations/identity.js';
import {Translation} from '../transformations/translation.js';
import {Scale} from '../transformations/scaling.js';

import {Graphic} from '../3d/graphic.js';
import {Container3D} from '../3d/container.js';
import {World} from '../3d/world.js';
import {Color} from '../3d/color.js';

import {BackCenter} from '../shapes/helicopter/back.js';
import {FrontCenter} from '../shapes/helicopter/front.js';
import {HexagonCenter, CurveCenter} from '../shapes/helicopter/center.js';
import {HelixContainer, HelixConnector} from '../shapes/helicopter/helix.js';
import {Blade} from '../shapes/helicopter/blade.js';
import {Cylinder} from '../shapes/cylinder.js';

export class HelicopterApp extends App {

	constructor(gl, canvas) {
		super(gl, canvas);
	}

	/* public methods */

	start() {
	
		var scene = new Scene(this.gl);

		var shader = new ShaderProgram(this.gl,
					       matrix_vertex_shader,
					       simple_fragment_shader);

		// Perspective camera moved 7 units from the origin
		var camera = new Camera(this.gl, this.canvas, [0.0, 0.0, 20.0]);
		scene.addCamera(camera);

		// World
		var world = new World();

		// Helicopter Tree

		var t = [new Rotation([1.0, 1.0, 0.0], 0.0, 0.01)];
		var helicopter = new Container3D(t);

		////////////////////
		//     Center     //
		////////////////////

		// Front center
		var front = new FrontCenter(50, 50);
		var t1 = [new Rotation([0.0, 1.0, 0.0], Math.PI, 0.0)];
		var gfront = new Graphic(this.gl, front, t1, shader);

		helicopter.add(gfront);

		// First curve center
		var frontHelixAndLegs = new Container3D([new Identity()]);
		var curve = new CurveCenter(50, 50);
		var t2 = [new Identity()];
		var gcurve1 = new Graphic(this.gl, curve, t2, shader);
		
		frontHelixAndLegs.add(gcurve1);

		helicopter.add(frontHelixAndLegs);

		// Hexagon center
		var hexa = new HexagonCenter(50, 50);
		var t3 = [new Translation([2.0, 0.0, 0.0])];
		var ghexa = new Graphic(this.gl, hexa, t3, shader);

		helicopter.add(ghexa);

		// Second curve center
		var backHelixAndLegs = new Container3D([new Translation([8.0, 0.0, 0.0])]);
		var t4 = [new Scale([2.0, 1.0, 1.0])];
		var gcurve2 = new Graphic(this.gl, curve, t4, shader);

		backHelixAndLegs.add(gcurve2);

		helicopter.add(backHelixAndLegs);

		// Back center
		var back = new BackCenter(50, 50);
		var t5 = [new Translation([12.0, 0.0, 0.0])];
		var gback = new Graphic(this.gl, back, t5, shader);

		helicopter.add(gback);

		////////////////////
		//     Helixes    //
		////////////////////

		var helix = new Container3D([new Identity()]);
		
		var cylinder = new Cylinder(1, 1, 50, 50, new Color([1.0, 0.84, 0.0]));
		var t6 = [new Translation([0.0, -1.25, 0.0]),
			  new Rotation([1.0, 0.0, 0.0], -Math.PI/2, 0.0),
			  new Scale([1.0, 1.0, 2.5])];
		var gc = new Graphic(this.gl, cylinder, t6, shader);

		helix.add(gc);

		var connector = new HelixConnector(50, 50);
		var t7 = [new Rotation([1.0, 0.0, 0.0], Math.PI/2, 0.0),
			  new Scale([1.0, 1.0/6.0, 3.0/16.0])];
		var gconn = new Graphic(this.gl, connector, t7, shader);

		helix.add(gconn);

		var container = new HelixContainer(50, 50);
		var t8 = [new Translation([9.0, 0.0, 0.0]),
			  new Rotation([1.0, 0.0, 0.0], Math.PI/2, 0.0),
			  new Scale([0.4, 0.4, 0.4])];
		var gcontainer = new Graphic(this.gl, container, t8, shader);

		helix.add(gcontainer);

		////// Front helixes //////

		var t9 = [new Translation([1.0, 2.0, -2.0]),
			  new Rotation([0.0, 0.0, 1.0], Math.PI/2, 0.0),
			  new Rotation([0.0, 1.0, 0.0], Math.PI/2, 0.0)];
		var rightFrontHelix = new Container3D(t9);
		rightFrontHelix.add(helix);

		frontHelixAndLegs.add(rightFrontHelix);
		
		var t10 = [new Translation([1.0, 2.0, 2.0]),
			   new Rotation([0.0, 0.0, 1.0], Math.PI/2, 0.0),
			   new Rotation([0.0, 1.0, 0.0], -Math.PI/2, 0.0)];
		var leftFrontHelix = new Container3D(t10);
		leftFrontHelix.add(helix);

		frontHelixAndLegs.add(leftFrontHelix);

		////// Back helixes //////

		var t11 = [new Translation([2.0, 2.0, -2.0]),
			  new Rotation([0.0, 0.0, 1.0], Math.PI/2, 0.0),
			  new Rotation([0.0, 1.0, 0.0], Math.PI/2, 0.0)];
		var rightBackHelix = new Container3D(t11);
		rightBackHelix.add(helix);

		backHelixAndLegs.add(rightBackHelix);

		var t12 = [new Translation([2.0, 2.0, 2.0]),
			   new Rotation([0.0, 0.0, 1.0], Math.PI/2, 0.0),
			   new Rotation([0.0, 1.0, 0.0], -Math.PI/2, 0.0)];
		var leftBackHelix = new Container3D(t12);
		leftBackHelix.add(helix);

		backHelixAndLegs.add(leftBackHelix);

		//////////////////////
		//   Landing legs   //
		//////////////////////

		///////////////////////
		//  Door & Stairway  //
		///////////////////////

		world.add(helicopter);

		scene.add(world);

		scene.draw();
	}
}
