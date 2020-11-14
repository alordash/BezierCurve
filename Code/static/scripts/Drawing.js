import { Point } from './Figures/Point.js';
import { GetPointOnBezier } from './BezierCurve/BezierCurve.js';

export var PointSize = 20;

/**
 * @param {Array.<Point>} points 
 */
export function RedrawCanvas(Canvas, points) {
    let RenderPoints = document.getElementById("RenderPointsCheckbox").checked;
    let RenderCurves = document.getElementById("RenderCurvesCheckbox").checked;
    Canvas.background(225, 225, 255);
    let count = points.length - 2;
    for (let i = 2; i <= points.length; i++) {
        for (let j = 0; j <= points.length - i; j++) {
            if (i == points.length && j == 0) {
                Canvas.stroke(42);
                Canvas.strokeWeight(4);
                DrawBezierCurve(Canvas, points.slice(j, j + i));
            } else if ((RenderPoints && i == 2) || RenderCurves) {
                Canvas.stroke(220 * (1.2 - (i - 2) / count));
                Canvas.strokeWeight(2);
                DrawBezierCurve(Canvas, points.slice(j, j + i));
            }
        }
    }
    Canvas.strokeWeight(2);
    let size = PointSize;
    if (!RenderPoints) {
        size = 2;
    }
    DrawPoints(Canvas, points, size);
}

function DrawBezierCurve(Canvas, points) {
    let length = points.length;
    if (length > 1) {
        Canvas.noFill();
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

function DrawPoints(Canvas, points, size) {
    let length = points.length;
    for (let i = 0; i < length; i++) {
        let p = points[i];
        let b = 255 * (1 - (i + 1) / length);
        let pColor = Canvas.color(b);
        Canvas.fill(pColor);
        Canvas.ellipse(p.x, p.y, size, size);
    }
}