
function HeliController() {

	//
	// Movement variables
	//
	var xArrow = 0;
	var yArrow = 0;
	var zArrow = 0;

	var motorChanged = false;
	var legChanged = false;
	var doorChanged = false;
	var camera = 1;

	var altitudeInertia = 0.01;
	var speedInertia = 0.1;
	var angleInertia = 0.02;

	var deltaAltitude = 1;
	var deltaSpeed = 0.01;
	var deltaAngle = 0.03;

	var maxSpeed = 2;
	var maxAltitude = 300;
	var minAltitude = 0.0;

	var positionX = 40;
	var positionY = 10;
	var positionZ = 0;

	var speed = 0;
	var altitude = minAltitude;
	var angle = 0;

	var pitch = 0;
	var roll = 0;

	var angleTarget = 0;
	var altitudeTarget = minAltitude;
	var speedTarget = 0;

	//
	// Camera movement variables (orbital)
	//
	var isMouseDown = false;
	var radio = 40, alfa = 0, beta = 0;
	var factorVelocidad = 0.01;
	var mouseZoom = 0.0;
	var previous = {
		x: 0,
		y: 0
	};
	var mouse = {
		x: 0,
		y: 0
	};
	var posCameraX = 0.0;
	var posCameraY = 50.0;
	var posCameraZ = 40.0;

	/////////////////////
	//  Event Handlers //
	/////////////////////
	
	// Camera movement

	$('body').mousemove(function(e) {

		mouse.x = e.clientX || e.pageX;
		mouse.y = e.clientY || e.pageY;
	});

	$('body').mousedown(function(e) {
		isMouseDown = true;
	});

	$('body').mouseup(function(e) {
		isMouseDown = false;
	});

	// Movement

	$("body").keydown(function(e) {
		switch (e.key) {
			case "w":
			case "ArrowUp":
				xArrow = 1;
				break;
			case "s":
			case "ArrowDown":
				xArrow = -1;
				break;
			case "a":
			case "ArrowLeft":
				zArrow = 1;
				break;
			case "d":
			case "ArrowRight":
				zArrow = -1;
				break;

			case "q":
			case "PageUp":
				yArrow = 1;
				break;
			case "e":
			case "PageDown":
				yArrow = -1;
				break;

			case "h":
				motorChanged = !motorChanged;
				break;
			case "t":
				legChanged = !legChanged;
				break;
			case "p":
				doorChanged = !doorChanged;
				break;

			case "1":
				camera = 1;
				break;
			case "2":
				camera = 2;
				break;
			case "3":
				camera = 3;
				break;
			case "4":
				camera = 4;
				break;
			case "5":
				camera = 5;
				break;
		}
	});

	$("body").keyup(function(e) {
		switch (e.key) {
			case "w":
			case "s":
			case "ArrowUp":
			case "ArrowDown":
				xArrow = 0;
				break;
			case "a":
			case "d":
			case "ArrowLeft":
			case "ArrowRight":
				zArrow = 0;
				break;
			case "q":
			case "e":
			case "PageUp":
			case "PageDown":
				yArrow = 0;
				break;
		}
	});

	this.update = function() {

		//
		// Movement Update
		//
		if (xArrow != 0) {
			speedTarget += xArrow * deltaSpeed;
		} else {
			speedTarget += (0 - speedTarget) * deltaSpeed;
		}

		speedTarget = Math.max(-maxAltitude, Math.min(maxSpeed, speedTarget));

		var speedSign = 1;

		if (speed < 0)
			speedSign = -1;

		if (zArrow != 0) {
			angleTarget += zArrow * deltaAngle * speedSign;
		}

		if (yArrow != 0) {
			altitudeTarget += yArrow * deltaAltitude;
			altitudeTarget = Math.max(minAltitude, Math.min(maxAltitude, altitudeTarget));
		}

		roll = -(angleTarget - angle) * 0.4;
		pitch = -Math.max(-0.5, Math.min(0.5, speed));

		speed += (speedTarget - speed) * speedInertia;
		altitude += (altitudeTarget - altitude) * altitudeInertia;
		angle += (angleTarget - angle) * angleInertia;

		var directionX = Math.cos(-angle) * speed;
		var directionZ = Math.sin(-angle) * speed;

		positionX += directionX;
		positionZ += directionZ;
		positionY = altitude;

		//
		// Camera movement Update
		//
		if (isMouseDown) {
			
			var deltaX = mouse.x - previous.x;
			var deltaY = mouse.y - previous.y;

			previous.x = mouse.x;
			previous.y = mouse.y;

			alfa = alfa + deltaX * factorVelocidad;
			beta = beta + deltaY * factorVelocidad;

			if (beta < 0)
				beta = 0;

			if (beta > Math.PI)
				beta = Math.PI;
		
			posCameraX = radio * Math.sin(alfa) * Math.sin(beta);
			posCameraY = radio * Math.cos(beta);
			posCameraZ = radio * Math.cos(alfa) * Math.sin(beta);
		}
	}

	this.getPosition = function() {
		return {
			x: positionX,
			y: positionY,
			z: positionZ,
		};
	}

	this.getCameraPosition = function() {
		return {
			x: posCameraX,
			y: posCameraY,
			z: posCameraZ,
		};
	}

	this.getCameraType = function () {

		switch (camera) {
			case 1:
				return "global";
			case 2:
				return "orbital";
			case 3:
				return "lateral";
			case 4:
				return "up";
			case 5:
				return "back";
		}
	}

	this.getYaw = function() {
		return angle;
	}

	this.getRoll = function() {
		return roll;
	}

	this.getPitch = function() {
		return pitch;
	}

	this.getSpeed = function() {
		return speed;
	}

	this.getMotorPosChanged = function() {
		return motorChanged;
	}

	this.getLegPosChanged = function() {
		return legChanged;
	}

	this.getDoorChanged = function() {
		return doorChanged;
	}

	this.getInfo = function() {

		var out = "";

		out += " <b>Target:</b><br>";
		out += " <t>speed: " + speedTarget.toFixed(2) + "<br>";
		out += " <t>altitude: " + altitudeTarget.toFixed(2) + "<br>";
		out += " <t>angle: " + angleTarget.toFixed(2) + "<br><br>";

		out += " <b>Current:</b><br>";
		out += " <t>speed: " + speed.toFixed(2) + "<br>";
		out += " <t>altitude: " + altitude.toFixed(2) + "<br><br>";

		out += " <b>Camera:</b> " + this.getCameraType() + "<br><br>";

		out += " <b>Angles:</b><br>"
		out += " <t>yaw: " + angle.toFixed(2) + "<br>";
		out += " <t>pitch: " + pitch.toFixed(2) + "<br>";
		out += " <t>roll: " + roll.toFixed(2) + "<br>";

		return out;
	}
}

