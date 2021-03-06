import { Point } from './Figures/Point.js';
import { GetPointsOnBezier } from './BezierCurve/BezierCurve.js';

const C = {
    r: 1 / 2,
    g: 0,
    b: 0
}

function ApplyColor(Canvas, value, alpha) {
    return Canvas.color(value * C.r, value * C.g, value * C.b, alpha);
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
    DrawCurves(Canvas, allBezierPointsArr, RenderCurves, ManualMode);
    if (ManualMode) {
        DrawManualCurves(Canvas, allBezierPointsArr, 2, RenderCurves);
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

function DrawCurves(Canvas, points, RenderCurves, ManualMode) {
    let allLength = points.length;
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
                if (i != 0) {
                    Canvas.strokeWeight(1.5);
                    Canvas.stroke(ApplyColor(Canvas, 220 * (1.2 - (i - 2) / layerCount), 100));
                } else {
                    Canvas.strokeWeight(2.5);
                    Canvas.stroke(0);
                }
                for (; j < count; j++) {
                    Canvas.noFill();
                    Canvas.beginShape();
                    let p0 = points[0][i][j];
                    Canvas.curveVertex(p0.x, p0.y);
                    for (let k = 0; k < allLength; k++) {
                        let p = points[k][i][j];
                        Canvas.curveVertex(p.x, p.y);
                    }
                    p0 = points[allLength - 1][i][j];
                    Canvas.curveVertex(p0.x, p0.y);
                    Canvas.endShape();
                }
            }
        }
    }
}

function DrawManualCurves(Canvas, points, width, RenderCurves) {
    let ManualModeRange = document.getElementById("ManualModeRange");
    let minVal = parseInt(ManualModeRange.min);
    let maxVal = parseInt(ManualModeRange.max);
    let d = maxVal - minVal;
    let t = (parseInt(ManualModeRange.value) - minVal) / d;

    let index = Math.round(t / BezierStep);
    let bPointsArr = points[index];

    Canvas.strokeWeight(width);
    if (typeof (bPointsArr) != 'undefined') {
        let length = bPointsArr.length;
        for (let i = 0; i < length; i++) {
            let bPoints = bPointsArr[i];
            let inLength = bPoints.length;
            Canvas.stroke(ApplyColor(Canvas, 200, 120));
            for (let j = 0; j < inLength - 1; j++) {
                let p0 = bPoints[j];
                let p1 = bPoints[j + 1];
                if (i > 0) {
                    if (RenderCurves) {
                        Canvas.line(p0.x, p0.y, p1.x, p1.y);
                    }
                } else {
                    Canvas.line(p0.x, p0.y, p1.x, p1.y);
                }
            }
        }
        for (let i = 0; i < length; i++) {
            let bPoints = bPointsArr[i];
            let inLength = bPoints.length;
            for (let j = 0; j < inLength; j++) {
                let point = bPoints[j];
                let size = 8;
                let shouldDraw = true;
                if (i == 0) {
                    Canvas.fill(180);
                    Canvas.strokeWeight(1.5);
                    Canvas.stroke(0);
                    size = 14;
                } else if (RenderCurves) {
                    Canvas.fill(180 * 1.3, 150);
                    Canvas.strokeWeight(1);
                    Canvas.stroke(0, 100);
                } else {
                    shouldDraw = false;
                }
                if (shouldDraw) {
                    Canvas.ellipse(point.x, point.y, size, size);
                }
            }
        }
    }
}

/**@returns {Array.<Array.<Array.<Point>>>} */
function GetBezierPoints(points) {
    let newPoints = [];
    for (let t = 0; t <= 1; t += BezierStep) {
        let bp = GetPointsOnBezier(t, points);
        newPoints.push(bp);
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