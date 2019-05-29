import {App} from '../scene/app.js';
import {Scene} from '../scene/scene.js';
import {Camera} from '../scene/camera.js';

import {ShaderProgram} from '../shaders/program.js';

import {Rotation} from '../transformations/rotation.js';
import {Identity} from '../transformations/identity.js';
import {Translation} from '../transformations/translation.js';
import {Scale} from '../transformations/scaling.js';
import {HelicopterRotation, HelixRotation} from '../transformations/helicopter/rotation.js';
import {HelicopterTranslation} from '../transformations/helicopter/translation.js';

import {Graphic} from '../3d/graphic.js';
import {Container3D} from '../3d/container.js';
import {World} from '../3d/world.js';
import {Color} from '../3d/color.js';

import {Cylinder} from '../shapes/cylinder.js';
import {BackCenter} from '../shapes/helicopter/back.js';
import {FrontCenter} from '../shapes/helicopter/front.js';
import {HexagonCenter, CurveCenter} from '../shapes/helicopter/center.js';
import {Blade} from '../shapes/helicopter/blade.js';
import {HelixContainer, HelixConnector, Helix} from '../shapes/helicopter/helix.js';
import {LandingGear, LandingGearBase} from '../shapes/helicopter/landing.js';
import {Stairway} from '../shapes/helicopter/stairway.js';

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

		// Perspective camera
		var camera = new Camera(this.gl, this.canvas, [0.0, 0.0, 40.0]);
		scene.addCamera(camera);

		// Keyboard controller
		var controller = new HeliController();
		scene.addController(controller);

		// World
		var world = new World();

		// Helicopter Tree

		var t = [new HelicopterTranslation(),
			 new HelicopterRotation(),
			 new Rotation([0.0, 1.0, 0.0], Math.PI, 0.0),
			 new Translation([-4.0, 0.0, 0.0])];
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
		var t3 = [new Translation([2.0, 0.0, 0.0])];
		var hexaCenterAndDoor = new Container3D(t3);
		var hexa = new HexagonCenter(50, 50);
		var ghexa = new Graphic(this.gl, hexa, [new Identity()], shader);

		hexaCenterAndDoor.add(ghexa);

		helicopter.add(hexaCenterAndDoor);

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

		var leftHelix = new Helix("left", this.gl, shader);
		var rightHelix = new Helix("right", this.gl, shader);

		////// Front helixes //////

		var t9 = [new Translation([1.0, 2.0, -2.0]),
			  new Rotation([0.0, 0.0, 1.0], Math.PI/2, 0.0),
			  new Rotation([0.0, 1.0, 0.0], Math.PI/2, 0.0)];
		var rightFrontHelix = new Container3D(t9);
		rightFrontHelix.add(rightHelix);

		var t10 = [new Translation([1.0, 2.0, 2.0]),
			   new Rotation([0.0, 0.0, 1.0], Math.PI/2, 0.0),
			   new Rotation([0.0, 1.0, 0.0], -Math.PI/2, 0.0)];
		var leftFrontHelix = new Container3D(t10);
		leftFrontHelix.add(leftHelix);

		frontHelixAndLegs.add(rightFrontHelix);
		frontHelixAndLegs.add(leftFrontHelix);

		////// Back helixes //////

		var t11 = [new Translation([2.0, 2.0, -2.0]),
			  new Rotation([0.0, 0.0, 1.0], Math.PI/2, 0.0),
			  new Rotation([0.0, 1.0, 0.0], Math.PI/2, 0.0)];
		var rightBackHelix = new Container3D(t11);
		rightBackHelix.add(rightHelix);

		var t12 = [new Translation([2.0, 2.0, 2.0]),
			   new Rotation([0.0, 0.0, 1.0], Math.PI/2, 0.0),
			   new Rotation([0.0, 1.0, 0.0], -Math.PI/2, 0.0)];
		var leftBackHelix = new Container3D(t12);
		leftBackHelix.add(leftHelix);

		backHelixAndLegs.add(rightBackHelix);
		backHelixAndLegs.add(leftBackHelix);

		//////////////////////
		//   Landing legs   //
		//////////////////////

		var leg = new Container3D([new Identity()]);

		var gear = new LandingGear();

		var tgUp = [new Translation([-0.25, -1.0, 0.0]),
			    new Scale([0.25, 0.5, 0.25])];
		var up = new Graphic(this.gl, gear, tgUp, shader);

		leg.add(up);

		var tgDown = [new Translation([0.0, -2.0, 0.0]),
			      new Scale([0.25, 0.5, 0.25])];
		var down = new Graphic(this.gl, gear, tgDown, shader);

		leg.add(down);

		var union = new Cylinder(0.125, 0.6, 20, 20, new Color([0.0, 0.0, 1.0]));
		var tuni = [new Translation([0.0, -1.5, 0.0]),
			    new Rotation([0.0, 1.0, 0.0], -Math.PI/2, 0.0),
			    new Translation([0.0, 0.0, -0.30])];
		var gunion = new Graphic(this.gl, union, tuni, shader);

		leg.add(gunion);

		var base = new LandingGearBase();
		var tbase = [new Translation([0.0, -3.8, 0.0]),
		     	     new Scale([2.0/5.0, 1.0/4.0, 2.0/5.0]),
			     new Rotation([0.0, 1.0, 0.0], Math.PI/4, 0.0)];
		var gbase = new Graphic(this.gl, base, tbase, shader);

		leg.add(gbase);

		////// Front legs //////

		var t13 = [new Translation([1.0, -2.8, -2.0]),
			   new Rotation([0.0, 1.0, 0.0], Math.PI/2, 0.0)];
		var rightFrontLeg = new Container3D(t13);
		rightFrontLeg.add(leg);

		var t14 = [new Translation([1.0, -2.8, 2.0]),
			   new Rotation([0.0, 1.0, 0.0], -Math.PI/2, 0.0)];
		var leftFrontLeg = new Container3D(t14);
		leftFrontLeg.add(leg);

		frontHelixAndLegs.add(rightFrontLeg);
		frontHelixAndLegs.add(leftFrontLeg);

		////// Back legs //////

		var t15 = [new Translation([2.0, -2.8, -2.0]),
			   new Rotation([0.0, 1.0, 0.0], Math.PI/2, 0.0)];
		var rightBackLeg = new Container3D(t15);
		rightBackLeg.add(leg);

		var t16 = [new Translation([2.0, -2.8, 2.0]),
			   new Rotation([0.0, 1.0, 0.0], -Math.PI/2, 0.0)];
		var leftBackLeg = new Container3D(t16);
		leftBackLeg.add(leg);

		backHelixAndLegs.add(rightBackLeg);
		backHelixAndLegs.add(leftBackLeg);

		///////////////////////
		//  Door & Stairway  //
		///////////////////////

		var door = new Stairway();

		var t17 = [new Translation([3.0, 1.25, 2.25]),
			   new Rotation([1.0, 0.0, 0.0], -Math.PI/4, 0.0),
			   new Rotation([0.0, 1.0, 0.0], Math.PI/2, 0.0),
			   new Scale([1.0, Math.sqrt(2)/2.0, 1.5])];
		var gstair1 = new Graphic(this.gl, door, t17, shader);

		var t18 = [new Translation([3.0, -1.25, 2.25]),
			   new Rotation([1.0, 0.0, 0.0], Math.PI/4, 0.0),
			   new Rotation([0.0, 1.0, 0.0], Math.PI/2, 0.0),
			   new Scale([1.0, Math.sqrt(2)/2.0, 1.5])];
		var gstair2 = new Graphic(this.gl, door, t18, shader);

		hexaCenterAndDoor.add(gstair1);
		hexaCenterAndDoor.add(gstair2);

		world.add(helicopter);

		scene.add(world);

		scene.draw();
	}
}
