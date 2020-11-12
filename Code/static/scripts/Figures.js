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

    isInRect(r) {
        return r.x <= this.x && this.x <= r.x + r.w && r.y <= this.y && this.y <= r.y + r.h;
    }
}

export class Rectangle {
    x;
    y;
    w;
    h;
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
}