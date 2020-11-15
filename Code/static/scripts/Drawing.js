import { Point } from './Figures/Point.js';
import { GetPointsOnBezier } from './BezierCurve/BezierCurve.js';

const C = {
    r: 1 / 2,
    g: 0,
    b: 0
}

export var PointSize = 20;
export var GridStep = 75;

export function Realign(val, step) {
    return Math.round(val / step) * step;
}

const BezierStep = 0.005;

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
    let allBezierPointsArr = GetBezierPoints(points);
    if (ManualMode) {
        DrawManualCurves(Canvas, allBezierPointsArr, 2);
    }
    DrawCurves(Canvas, allBezierPointsArr, 1.5, RenderCurves, ManualMode);

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

function DrawCurves(Canvas, points, width, RenderCurves, ManualMode) {
    let allLength = points.length;
    Canvas.stroke(0);
    Canvas.strokeWeight(width);
    let i = 0;
    let j = 0;
    if (allLength > 0) {
        let layerCount = points[0].length;
        if (layerCount) {
            if (!RenderCurves && !ManualMode) {
                layerCount = 1;
            }
            for (; i < layerCount; i++) {
                if (i > 0 && ManualMode && !RenderCurves && i != layerCount - 1) {
                    i = layerCount - 1;
                }
                let count = points[0][i].length;
                if (!RenderCurves && !ManualMode) {
                    j = count - 1;
                } else {
                    j = 0;
                }
                for (; j < count; j++) {
                    Canvas.noFill();
                    Canvas.beginShape();
                    for (let k = 0; k < allLength; k++) {
                        let p = points[k][i][j];
                        Canvas.curveVertex(p.x, p.y);
                    }
                    Canvas.endShape();
                }
            }
        }
    }
}

function DrawManualCurves(Canvas, points, width) {
    let ManualModeRange = document.getElementById("ManualModeRange");
    let minVal = parseInt(ManualModeRange.min);
    let maxVal = parseInt(ManualModeRange.max);
    let d = maxVal - minVal;
    let t = (parseInt(ManualModeRange.value) - minVal) / d;

    let index = Math.round(t / BezierStep);
    let bPointsArr = points[index];

    Canvas.stroke(140);
    Canvas.strokeWeight(width);
    if (typeof (bPointsArr) != 'undefined') {
        let length = bPointsArr.length;
        for (let i = 0; i < length; i++) {
            let bPoints = bPointsArr[i];
            let inLength = bPoints.length;
            for (let j = 0; j < inLength; j++) {
                let point = bPoints[j];
                Canvas.ellipse(point.x, point.y, 5, 5);
            }
            for (let j = 0; j < inLength - 1; j++) {
                let p0 = bPoints[j];
                let p1 = bPoints[j + 1];
                Canvas.line(p0.x, p0.y, p1.x, p1.y);
            }
        }
    }
}

/**@returns {Array.<Array.<Array.<Point>>>} */
function GetBezierPoints(points) {
    let newPoints = [];
    for (let t = 0, i = 0; t <= 1; t += BezierStep, i++) {
        let bp = GetPointsOnBezier(t, points);
        newPoints[i] = bp;
    }
    newPoints[newPoints.length] = GetPointsOnBezier(1, points);
    return newPoints;
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