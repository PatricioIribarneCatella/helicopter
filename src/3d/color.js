export class Color {

	constructor(c) {
		if (c.length == 0) {
			this.auto = true;
		} else {
			this.color = {
				"r": c[0],
				"g": c[1],
				"b": c[2]
			};
			this.auto = false;
		}
	}

	get(rows, cols, i, j) {

		if (this.auto)
			return {
				"r": 1.0 / rows * i,
				"g": 0.2,
				"b": 1.0 / cols * j
			};
		else
			return this.color;
	}
}

