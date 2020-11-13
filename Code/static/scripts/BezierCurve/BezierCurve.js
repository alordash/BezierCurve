import { Point } from '../Figures/Point.js';

/**
 * 
 * @param {Number} t 
 * @param {Array.<Point>} points 
 * @returns {Point}
 */
export function GetPointOnBezier(t, points) {
    let newPoints = points.slice(0);
    let n = newPoints.length;
    while(n-- > 1) {
        for (let i = 0; i < n; i++) {
            let p = newPoints[i];
            let pNext = newPoints[i + 1];
            newPoints[i] = new Point(p.x + t * (pNext.x - p.x), p.y + t * (pNext.y - p.y));
        }
    }
    return newPoints[0];
}