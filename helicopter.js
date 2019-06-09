import {App} from '../scene/app.js';
import {Scene} from '../scene/scene.js';
import {Camera} from '../scene/camera.js';

import {ShaderProgram} from '../shaders/program.js';

import {Rotation} from '../transformations/rotation.js';
import {Identity} from '../transformations/identity.js';
import {Translation} from '../transformations/translation.js';
import {Scale} from '../transformations/scaling.js';
import {HelicopterRotation,
	MotorRotation,
	StairwayRotation} from '../transformations/helicopter/rotation.js';
import {HelicopterTranslation} from '../transformations/helicopter/translation.js';

import {World} from '../3d/world.js';
import {Color} from '../3d/color.js';
import {Graphic} from '../3d/graphic.js';
import {Container3D} from '../3d/container.js';
import {GraphicLand} from '../3d/helicopter/land.js';
import {GraphicSky} from '../3d/helicopter/sky.js';
import {GraphicReflect} from '../3d/helicopter/reflect.js';

import {DirectLight} from '../lights/direct.js';
import {PointLight} from '../lights/point.js';
import {SpotLight} from '../lights/spot.js';

import {Grid} from "../shapes/grid.js";
import {Sphere} from "../shapes/sphere.js";
import {Cylinder} from '../shapes/cylinder.js';
import {BackCenter} from '../shapes/helicopter/back.js';
import {FrontCenter} from '../shapes/helicopter/front.js';
import {HexagonCenter, CurveCenter} from '../shapes/helicopter/center.js';
import {Helix} from '../shapes/helicopter/helix.js';
import {LandingLeg} from '../shapes/helicopter/landing.js';
import {Stairway, Steps} from '../shapes/helicopter/stairway.js';

export class HelicopterApp extends App {

	constructor(gl, canvas) {
		super(gl, canvas);
	}

	/* public methods */

	start() {
	
		var scene = new Scene(this.gl);

		var shader = new ShaderProgram(this.gl,
					       normal_vertex_shader,
					       normal_fragment_shader);

		var landShader = new ShaderProgram(this.gl,
						   bitmap_vertex_shader,
						   bitmap_fragment_shader);

		var skyShader = new ShaderProgram(this.gl,
						  sky_vertex_shader,
						  sky_fragment_shader);

		var reflectShader = new ShaderProgram(this.gl,
						      normal_vertex_shader,
						      reflect_fragment_shader);

		// Perspective camera
		var camera = new Camera(this.gl, this.canvas, [0.0, 0.0, 40.0]);
		scene.addCamera(camera);

		// Keyboard controller
		var controller = new HeliController();
		scene.addController(controller);

		// Lights
		var lights = {
			direct: new DirectLight([0.0, 1.0, 1.0], [1.0, 1.0, 1.0]),
			spot: new SpotLight([7.0, -1.0, 0.0],
					    [1.0, -2.0, 0.0],
					    [1.0, 1.0, 1.0]),
			red: new PointLight([-6.0, -2.0, 3.0], [1.0, 0.0, 0.0]),
			green: new PointLight([-6.0, -2.0, -3.0], [0.0, 1.0, 0.0])
		};
		scene.addLights(lights);

		// World
		var world = new World();

		// Sky sphere
		var gsky = new GraphicSky(this.gl, skyShader);
		gsky.loadTexture("img/sunset.jpg");

		world.add(gsky);
		
		// Lanscape
		var gland = new GraphicLand(this.gl, landShader);
		gland.loadTexture("img/land-perlin.png");

		world.add(gland);

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
		var gfront = new GraphicReflect(this.gl, front, t1, reflectShader);
		gfront.loadTexture("img/sunset.jpg");

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
		var ghexa = new GraphicReflect(this.gl,
					hexa, [new Identity()], reflectShader);
		ghexa.loadTexture("img/sunset.jpg");

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
			  new Rotation([0.0, 1.0, 0.0], Math.PI/2, 0.0),
			  new MotorRotation("right")];
		var rightFrontHelix = new Container3D(t9);
		rightFrontHelix.add(rightHelix);

		var t10 = [new Translation([1.0, 2.0, 2.0]),
			   new Rotation([0.0, 0.0, 1.0], Math.PI/2, 0.0),
			   new Rotation([0.0, 1.0, 0.0], -Math.PI/2, 0.0),
			   new MotorRotation("left")];
		var leftFrontHelix = new Container3D(t10);
		leftFrontHelix.add(leftHelix);

		frontHelixAndLegs.add(rightFrontHelix);
		frontHelixAndLegs.add(leftFrontHelix);

		////// Back helixes //////

		var t11 = [new Translation([2.0, 2.0, -2.0]),
			  new Rotation([0.0, 0.0, 1.0], Math.PI/2, 0.0),
			  new Rotation([0.0, 1.0, 0.0], Math.PI/2, 0.0),
			  new MotorRotation("right")];
		var rightBackHelix = new Container3D(t11);
		rightBackHelix.add(rightHelix);

		var t12 = [new Translation([2.0, 2.0, 2.0]),
			   new Rotation([0.0, 0.0, 1.0], Math.PI/2, 0.0),
			   new Rotation([0.0, 1.0, 0.0], -Math.PI/2, 0.0),
			   new MotorRotation("left")];
		var leftBackHelix = new Container3D(t12);
		leftBackHelix.add(leftHelix);

		backHelixAndLegs.add(rightBackHelix);
		backHelixAndLegs.add(leftBackHelix);

		//////////////////////
		//   Landing legs   //
		//////////////////////

		var leftLeg = new LandingLeg("left", this.gl, shader);
		var rightLeg = new LandingLeg("right", this.gl, shader);
		
		////// Front legs //////

		var t13 = [new Translation([1.0, -2.8, -2.0]),
			   new Rotation([0.0, 1.0, 0.0], Math.PI/2, 0.0)];
		var rightFrontLeg = new Container3D(t13);
		rightFrontLeg.add(rightLeg);

		var t14 = [new Translation([1.0, -2.8, 2.0]),
			   new Rotation([0.0, 1.0, 0.0], -Math.PI/2, 0.0)];
		var leftFrontLeg = new Container3D(t14);
		leftFrontLeg.add(leftLeg);

		frontHelixAndLegs.add(rightFrontLeg);
		frontHelixAndLegs.add(leftFrontLeg);

		////// Back legs //////

		var t15 = [new Translation([2.0, -2.8, -2.0]),
			   new Rotation([0.0, 1.0, 0.0], Math.PI/2, 0.0)];
		var rightBackLeg = new Container3D(t15);
		rightBackLeg.add(rightLeg);

		var t16 = [new Translation([2.0, -2.8, 2.0]),
			   new Rotation([0.0, 1.0, 0.0], -Math.PI/2, 0.0)];
		var leftBackLeg = new Container3D(t16);
		leftBackLeg.add(leftLeg);

		backHelixAndLegs.add(rightBackLeg);
		backHelixAndLegs.add(leftBackLeg);

		///////////////////////
		//  Door & Stairway  //
		///////////////////////
		
		var door = new Stairway();

		var tdoor = [new Translation([3.0, -2.0, 1.0]),
			     new Rotation([0.0, 1.0, 0.0], -Math.PI/2, 0.0),
			     new StairwayRotation(-Math.PI/4)];
		var cdoor = new Container3D(tdoor);

		var t17 = [new Scale([1.0, Math.sqrt(2)/2.0, 1.5]),
			   new Translation([0.0, 2.0, 0.0])];
		var gstair1 = new Graphic(this.gl, door, t17, shader);

		cdoor.add(gstair1);

		var t18 = [new Translation([0.0, 2*Math.sqrt(2), 0.0]),
			   new StairwayRotation(Math.PI/2),
			   new Scale([1.0, Math.sqrt(2)/2.0, 1.5]),
			   new Translation([0.0, 2.0, 0.0])];
		var gstair2 = new Graphic(this.gl, door, t18, shader);

		cdoor.add(gstair2);

		hexaCenterAndDoor.add(cdoor);

		var steps = new Steps(this.gl, shader);

		hexaCenterAndDoor.add(steps);

		world.add(helicopter);

		scene.add(world);

		scene.draw();
	}
}
