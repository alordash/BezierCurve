import { Point } from './Figures/Point.js';
import { Rectangle } from './Figures/Rectangle.js';
import { PointSize, RedrawCanvas } from './Drawing.js';

let countMove = true;
let moveTimer;
let mouseMoveCounter = 0;
let mouseMovePeriod = 3;
let prevMousePos = new Point(0, 0);

let holdingPoint = false;
let holdingPointIndex = -1;
let holdStartPoint;
let holdPoint;

export function CanvasMouseEvent(e, mainCanvas, mouseOverlay, points) {
    let shouldRedraw = false;
    let isDown = e.type == 'mousedown';
    let rawPoint = new Point(e.offsetX, e.offsetY);
    let x = (e.pageX + document.body.scrollLeft + mainCanvas.element.scrollLeft - mainCanvas.element.offsetLeft);
    let y = (e.pageY + document.body.scrollTop + mainCanvas.element.scrollTop - mainCanvas.element.offsetTop);
    if (isDown && !holdingPoint && !e[globalThis.EraseKey]) {
        holdingPointIndex = 0;
        for (; !holdingPoint && holdingPointIndex < points.length; holdingPointIndex++) {
            let p = points[holdingPointIndex];
            let dst = p.distance(rawPoint);
            if (dst <= PointSize) {
                holdingPoint = true;
                holdPoint = new Point(p.x, p.y);
                holdStartPoint = new Point(e.pageX, e.pageY);
            }
        }
        holdingPointIndex--;
    }
    if (holdingPoint) {
        let d = new Point(e.pageX - holdStartPoint.x, e.pageY - holdStartPoint.y);
        points[holdingPointIndex].x = holdPoint.x + d.x;
        points[holdingPointIndex].y = holdPoint.y + d.y;
        shouldRedraw = true;
    } else {
        if (e.buttons || isDown) {
            let resume = true;
            if (isDown) {
                if (!e[globalThis.EraseKey]) {
                    countMove = false;
                    moveTimer = setTimeout(() => {
                        countMove = true;
                    }, 100);
                }
            } else {
                mouseMoveCounter = (mouseMoveCounter + 1) % mouseMovePeriod;
                if (!countMove || (!e[globalThis.EraseKey] && mouseMoveCounter != 0)) {
                    resume = false
                }
            }
            let r = new Rectangle(PointSize / 2, PointSize / 2, parseInt(mainCanvas.element.style.width) - PointSize, parseInt(mainCanvas.element.style.height) - PointSize);
            if (rawPoint.isInRect(r) && resume) {
                let p = new Point(x, y);

                if (!e[globalThis.EraseKey]) {
                    points.push(p);
                    shouldRedraw = true;
                } else {
                    let dst = prevMousePos.distance(new Point(e.pageX, e.pageY));
                    mouseOverlay.radius = Math.min(mouseOverlay.maxRadius, Math.max(mouseOverlay.minRadius, dst));
                    for (let i = 0; i < points.length; i++) {
                        if (points[i].distance(p) <= mouseOverlay.radius) {
                            points.splice(i, 1);
                            i--;
                            shouldRedraw = true;
                        }
                    }
                }
            }
        }
        mouseOverlay.UpdateOverlay(e, mainCanvas.element);
    }
    if (shouldRedraw) {
        RedrawCanvas(mainCanvas.canvas, points);
    }
    prevMousePos = new Point(e.pageX, e.pageY);
}


export function CanvasOnMouseUp(e, mainCanvas, mouseOverlay) {
    clearTimeout(moveTimer);
    countMove = true;
    mouseOverlay.UpdateOverlay(e, mainCanvas.element);

    holdingPoint = false;
}