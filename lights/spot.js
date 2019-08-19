export class SpotLight {

	constructor(position, direction, color, intensity) {

		this.direction = direction;
		this.dir = direction;
		this.offset = position;
		this.position = position;
		this.color = color;
		this.intensity = intensity;
	}

	/* private methods */

	/* public methods */

	update(controller) {
	
		var aux;
		var p = controller.getPosition();
		var angle = controller.getYaw();

		aux = [this.offset[0]*Math.cos(angle) + this.offset[2]*Math.sin(angle),
		       this.offset[1],
		       -this.offset[0]*Math.sin(angle) + this.offset[2]*Math.cos(angle)];
		
		this.position = [p.x + aux[0], p.y + aux[1], p.z + aux[2]];

		aux = [this.dir[0]*Math.cos(angle) + this.dir[2]*Math.sin(angle),
		       this.dir[1],
		       -this.dir[0]*Math.sin(angle) + this.dir[2]*Math.cos(angle)];

		this.direction = [aux[0], aux[1], aux[2]];
	}

	getDirection() {
		return this.direction;
	}

	getPosition() {
		return this.position;
	}

	getColor() {
		return this.color;
	}

	getIntensity() {
		return this.intensity;
	}
}
