export class DirectLight {
    constructor(direction, color) {
        this.direction = direction;
        this.color = color;
    }

    /* private methods */

    /* public methods */

    // Does not have to be
    // updated
    update(controller) {}

    getDirection() {
        return this.direction;
    }

    getColor() {
        return this.color;
    }
}
