import { Point } from './Figures.js';

const wk = 0.7;
const hk = 0.7

export function GetCanvWidth(Canvas) {
    return wk * window.outerWidth - Canvas.canvas.style.left;
}

export function GetCanvHeight(Canvas) {
    return hk * window.outerHeight - Canvas.canvas.style.top;
}

export function GetCanX(x, Canvas) {
    return x + document.body.scrollLeft + Canvas.canvas.scrollLeft - Canvas.canvas.offsetLeft - parseInt(Canvas.canvas.style.borderWidth);
}

export function GetCanY(y, Canvas) {
    return y + document.body.scrollTop + Canvas.canvas.scrollTop - Canvas.canvas.offsetTop - parseInt(Canvas.canvas.style.borderWidth);
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
        points[i].element.style.background = `rgb(${r}, ${g}, 0)`;
    }
}