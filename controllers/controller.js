
function HeliController() {

    var xArrow = 0;
    var yArrow = 0;
    var zArrow = 0;

    var motorChanged = false;
    var legChanged = false;
    var doorChanged = false;

    var altitudeInertia = 0.01;
    var speedInertia = 0.1;
    var angleInertia = 0.02;

    var deltaAltitude = 1;
    var deltaSpeed = 0.01;
    var deltaAngle = 0.03;

    var maxSpeed = 2;
    var maxAltitude = 300;
    var minAltitude = 5;

    var positionX = 0;
    var positionY = 0;
    var positionZ = 0;

    var speed = 0;
    var altitude = minAltitude;
    var angle = 0;

    var pitch = 0;
    var roll = 0;

    var angleTarget = 0;
    var altitudeTarget = minAltitude;
    var speedTarget = 0;

    $("body").keydown(function(e) {
        switch(e.key) {
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
	}
    });

    $("body").keyup(function(e) {
        switch(e.key) {
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

        if (xArrow != 0) {
            speedTarget += xArrow*deltaSpeed;
        } else {
            speedTarget += (0-speedTarget)*deltaSpeed;
        }
        
        speedTarget = Math.max(-maxAltitude,Math.min(maxSpeed,speedTarget));

        var speedSign = 1;
        
	if (speed < 0)
	    speedSign =- 1;

        if (zArrow != 0) {
            angleTarget += zArrow*deltaAngle*speedSign;
        }

        if (yArrow != 0) {
            altitudeTarget += yArrow*deltaAltitude;
            altitudeTarget = Math.max(minAltitude,Math.min(maxAltitude,altitudeTarget));
        }
        
        roll = -(angleTarget-angle)*0.4;
        pitch = -Math.max(-0.5,Math.min(0.5,speed));

        speed += (speedTarget-speed)*speedInertia;
        altitude += (altitudeTarget-altitude)*altitudeInertia;
        angle += (angleTarget-angle)*angleInertia;

        var directionX = Math.cos(-angle)*speed;
        var directionZ = Math.sin(-angle)*speed;

        positionX += directionX;
        positionZ += directionZ;
        positionY = altitude;
    }

    this.getPosition = function() {
        return {
            x:positionX,
            y:positionY,
            z:positionZ,
        };
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

        out += " speedTarget: "+speedTarget.toFixed(2)+"<br>";
        out += " altitudeTarget: "+altitudeTarget.toFixed(2)+"<br>";
        out += " angleTarget: "+angleTarget.toFixed(2)+"<br><br>";

        out += " speed: "+speed.toFixed(2)+"<br>";
        out += " altitude: "+altitude.toFixed(2)+"<br><br>";


        out += " xArrow: "+xArrow.toFixed(2)+"<br>";
        out += " yArrow: "+yArrow.toFixed(2)+"<br>";
        out += " zArrow: "+zArrow.toFixed(2)+"<br><br>";

        out += " yaw: "+angle.toFixed(2)+"<br>";
        out += " pitch: "+pitch.toFixed(2)+"<br>";
        out += " roll: "+roll.toFixed(2)+"<br>";

        return out;
    }
}

