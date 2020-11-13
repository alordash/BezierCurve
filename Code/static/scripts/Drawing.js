import { Point } from './Figures/Point.js';

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