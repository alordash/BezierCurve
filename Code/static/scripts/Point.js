export class Point {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    distance(p) {
        return Math.sqrt(Math.pow(p.x - this.x, 2) + Math.pow(p.y - this.y, 2));
    }
}