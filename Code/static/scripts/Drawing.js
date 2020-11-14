import { Point } from './Figures/Point.js';
import { GetPointOnBezier } from './BezierCurve/BezierCurve.js';

export var PointSize = 20;
export var GridStep = 75;

export function Realign(val, step) {
    return Math.round(val / step) * step;
}

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
    DrawGrid(Canvas, GridStep);
    if (ManualMode) {
        DrawPoints(Canvas, points, size);
    }
    let count = points.length - 2;
    let newPoints = [];
    let point;
    for (let i = 2; i <= points.length; i++) {
        newPoints[i - 2] = [];
        for (let j = 0; j <= points.length - i; j++) {
            if (i == points.length && j == 0) {
                point = DrawBezierCurve(Canvas, points.slice(j, j + i), 4, 42, true, ManualMode);
                if (ManualMode) {
                    point.isMain = true;
                }
            } else if ((RenderPoints && i == 2) || RenderCurves) {
                point = DrawBezierCurve(Canvas, points.slice(j, j + i), 2, 220 * (1.2 - (i - 2) / count), false, ManualMode);
                if (ManualMode) {
                    point.isMain = false;
                }
            }
            if (ManualMode) {
                newPoints[i - 2].push(point);
            }
        }
    }

    if (ManualMode) {
        for (let i = 0; i < newPoints.length; i++) {
            count = newPoints[i].length - 2;
            let step = 2;
            let length = newPoints[i].length;
            let maxLength = length - step;
            for (let j = 0; j < length; j++) {
                if (j <= maxLength) {
                    DrawBezierCurve(Canvas, newPoints[i].slice(j, j + step), 2, 180, false, false);
                }
                let p = newPoints[i][j];
                if (p.isMain) {
                    Canvas.fill(180);
                } else {
                    Canvas.fill(1.3 * 180, 150);
                }
                Canvas.stroke(0, 100);
                Canvas.strokeWeight(1);
                Canvas.ellipse(p.x, p.y, p.size, p.size);
            }
        }
    }
    Canvas.strokeWeight(2);
    if (!ManualMode) {
        DrawPoints(Canvas, points, size);
    }
}

function DrawGrid(Canvas, step) {
    let x = 0;
    let y = 0;
    let w = Canvas.canvas.width;
    let h = Canvas.canvas.height;
    Canvas.stroke(100);
    Canvas.strokeWeight(1.5);
    while (x < w) {
        Canvas.line(x, 0, x, h);
        x += step;
    }
    while (y < h) {
        Canvas.line(0, y, w, y);
        y += step;
    }
}

function DrawBezierCurve(Canvas, points, width, brightness, isMain, ManualMode) {
    let length = points.length;
    if (length > 1) {
        if (ManualMode && !isMain) {
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
            if (isMain) {
                Canvas.fill(brightness);
            } else {
                size = 12;
                Canvas.fill(1.3 * brightness);
            }
            Canvas.stroke(255, 200);
            Canvas.strokeWeight(1);
            let ManualModeRange = document.getElementById("ManualModeRange");
            let minVal = parseInt(ManualModeRange.min);
            let maxVal = parseInt(ManualModeRange.max);
            let d = maxVal - minVal;
            let t = (parseInt(ManualModeRange.value) - minVal) / d;
            let bp = GetPointOnBezier(t, points);
            bp.size = size;
            return bp;
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