import { Point } from './Point.js';

const wk = 0.7;
const hk = 0.7

export function GetCanvWidth(CanvasRect) {
    return wk * window.outerWidth - CanvasRect.x;
}

export function GetCanvHeight(CanvasRect) {
    return hk * window.outerHeight - CanvasRect.y;
}

/**
 * @param {Array.<Point>} points 
 */
export function RedrawCanvas(Canvas, points) {
    Canvas.background(225, 225, 255);
    for (const p of points) {
        let xColor = p.x * 255;
        let yColor = (1 - p.y) * 255;
        let pColor = Canvas.color(xColor, yColor, xColor + yColor);
        Canvas.fill(pColor);
        Canvas.ellipse(p.x * Canvas.width, p.y * Canvas.height, 10, 10);
    }
}