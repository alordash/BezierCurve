import { Point } from './Figures/Point.js';
import { GetPointOnBezier } from './BezierCurve/BezierCurve.js';

export var PointSize = 20;

/**
 * @param {Array.<Point>} points 
 */
export function RedrawCanvas(Canvas, points) {
    Canvas.background(225, 225, 255);
    DrawBezierCurve(Canvas, points);
    DrawPoints(Canvas, points);
}

function DrawBezierCurve(Canvas, points) {
    let length = points.length;
    if (length > 1) {
        Canvas.noFill();
        Canvas.strokeWeight(2);
        Canvas.stroke(42);
        Canvas.beginShape();
        Canvas.curveVertex(points[0].x, points[0].y);
        for (let t = 0; t <= 1; t += 0.005) {
            let bp = GetPointOnBezier(t, points);
            Canvas.curveVertex(bp.x, bp.y);
        }
        Canvas.curveVertex(points[length - 1].x, points[length - 1].y);
        Canvas.curveVertex(points[length - 1].x, points[length - 1].y);
        Canvas.endShape();
    }
}

function DrawPoints(Canvas, points) {
    let length = points.length;
    Canvas.strokeWeight(2);
    for (let i = 0; i < length; i++) {
        let p = points[i];
        let r = (i + 1) * 255 / length;
        let g = 255 - r;
        //points[i].element.style.background = `rgb(${r}, ${g}, 0)`;
        let pColor = Canvas.color(r, g, 0);
        Canvas.fill(pColor);
        Canvas.ellipse(p.x, p.y, PointSize, PointSize);
    }
}