import { Point } from './Figures.js';

const wk = 0.7;
const hk = 0.7

export function GetCanvWidth(Canvas) {
    return wk * window.outerWidth - Canvas.canvas.style.left;
}

export function GetCanvHeight(Canvas) {
    return hk * window.outerHeight - Canvas.canvas.style.top;
}

/**
 * @param {Array.<Point>} points 
 */
export function RedrawCanvas(Canvas, points) {
    Canvas.background(225, 225, 255);
    let length = points.length;
    for (let i = 0; i < length; i++) {
        let r = (i + 1) * 255 / length;
        let g = 255 - r;
        let p = points[i];
        let pColor = Canvas.color(r, g, 0);
        Canvas.fill(pColor);
        Canvas.ellipse(p.x, p.y, 10, 10);
    }
}