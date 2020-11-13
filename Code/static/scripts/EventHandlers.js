import { Point } from './Figures/Point.js';
import { Rectangle } from './Figures/Rectangle.js';

let countMove = true;
let moveTimer;
let mouseMoveCounter = 0;
let mouseMovePeriod = 3;
let prevMousePos = new Point(0, 0);

export function CanvasMouseEvent(e, mainCanvas, mouseOverlay, points) {
    let isDown = e.type == 'mousedown';
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
        let CanvasRect = mainCanvas.element.getBoundingClientRect();
        let bw = parseInt(mainCanvas.element.style.borderWidth);
        let r = new Rectangle(CanvasRect.x / 2 + bw, CanvasRect.y / 2 + bw, parseInt(mainCanvas.element.style.width), parseInt(mainCanvas.element.style.height));
        let rawPoint = new Point(e.pageX, e.pageY);
        if (rawPoint.isInRect(r) && resume) {
            let cbw = parseInt(mainCanvas.element.style.borderWidth)
            let x = (e.pageX + document.body.scrollLeft + mainCanvas.element.scrollLeft - mainCanvas.element.offsetLeft - cbw);
            let y = (e.pageY + document.body.scrollTop + mainCanvas.element.scrollTop - mainCanvas.element.offsetTop - cbw);
            let p = new Point(x, y);

            if (!e[globalThis.EraseKey]) {
                points.push(p);
            } else {
                let dst = prevMousePos.distance(new Point(e.pageX, e.pageY));
                mouseOverlay.radius = Math.min(mouseOverlay.maxRadius, Math.max(mouseOverlay.minRadius, dst));
                for (let i = 0; i < points.length; i++) {
                    if (points[i].distance(p) <= mouseOverlay.radius) {
                        points.splice(i, 1);
                        i--;
                    }
                }
            }
        }
    }
    mouseOverlay.UpdateOverlay(e, mainCanvas.element);
    prevMousePos = new Point(e.pageX, e.pageY);
}


export function CanvasOnMouseUp(e, mainCanvas, mouseOverlay) {
    clearTimeout(moveTimer);
    countMove = true;
    mouseOverlay.UpdateOverlay(e, mainCanvas.element);
}