import { Point } from './Figures/Point.js';
import { GetPointOnBezier } from './BezierCurve/BezierCurve.js';

export var PointSize = 20;

/**
 * @param {Array.<Point>} points 
 */
export function RedrawCanvas(Canvas, points) {
    let RenderPoints = document.getElementById("RenderPointsCheckbox").checked;
    let RenderCurves = document.getElementById("RenderCurvesCheckbox").checked;
    let ManualMode = document.getElementById("ManualModeCheckbox").checked;
    let size = PointSize;
    if (!RenderPoints) {
        size = 2;
    }
    Canvas.background(225, 225, 255);
    if (ManualMode) {
        DrawPoints(Canvas, points, size);
    }
    let count = points.length - 2;
    for (let i = 2; i <= points.length; i++) {
        for (let j = 0; j <= points.length - i; j++) {
            if (i == points.length && j == 0) {
                DrawBezierCurve(Canvas, points.slice(j, j + i), 4, 42, true);
            } else if ((RenderPoints && i == 2) || RenderCurves) {
                DrawBezierCurve(Canvas, points.slice(j, j + i), 2, 220 * (1.2 - (i - 2) / count), false);
            }
        }
    }
    Canvas.strokeWeight(2);
    if (!ManualMode) {
        DrawPoints(Canvas, points, size);
    }
}

function DrawBezierCurve(Canvas, points, width, brightness, isMain) {
    let length = points.length;
    let ManualMode = document.getElementById("ManualModeCheckbox").checked;
    if (length > 1) {
        if(ManualMode && !isMain) {
            Canvas.strokeWeight(1.5);
            Canvas.stroke(brightness * 1.3, 150);
        } else {
            Canvas.stroke(brightness);
        }
        Canvas.strokeWeight(width);
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
        if (ManualMode) {
            let size = 16;
            if(isMain) {
                Canvas.fill(brightness);
            } else {
                size = 12;
                Canvas.fill(1.3 * brightness);
            }
            Canvas.stroke(255);
            Canvas.strokeWeight(1);
            let ManualModeRange = document.getElementById("ManualModeRange");
            let minVal = parseInt(ManualModeRange.min);
            let maxVal = parseInt(ManualModeRange.max);
            let d = maxVal - minVal;
            let t = (parseInt(ManualModeRange.value) - minVal) / d;
            let bp = GetPointOnBezier(t, points);
            Canvas.ellipse(bp.x, bp.y, size, size);
        }
    }
}

function DrawPoints(Canvas, points, size) {
    let length = points.length;
    Canvas.stroke(15);
    for (let i = 0; i < length; i++) {
        let p = points[i];
        let b = 255 * (1 - (i + 1) / length);
        let pColor = Canvas.color(b);
        Canvas.fill(pColor);
        Canvas.ellipse(p.x, p.y, size, size);
    }
}