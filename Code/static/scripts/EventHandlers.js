import { Point } from './Figures/Point.js';
import { Rectangle } from './Figures/Rectangle.js';

let ZeroPoint = document.getElementById("ZeroPoint");
let PointStyle = getComputedStyle(ZeroPoint);
ZeroPoint.style.display = 'none';

let countMove = true;
let moveTimer;
let mouseMoveCounter = 0;
let mouseMovePeriod = 3;
let prevMousePos = new Point(0, 0);

var PointsContainter = document.getElementById("PointsContainter");

export function CanvasMouseEvent(e, mainCanvas, mouseOverlay, points) {
    let isDown = e.type == 'mousedown';
    if (e.buttons || isDown) {
        let resume = true;
        if (isDown) {
            if (!e.shiftKey) {
                countMove = false;
                moveTimer = setTimeout(() => {
                    countMove = true;
                }, 100);
            }
        } else {
            mouseMoveCounter = (mouseMoveCounter + 1) % mouseMovePeriod;
            if (!countMove || (!e.shiftKey && mouseMoveCounter != 0)) {
                resume = false
            }
        }
        let CanvasRect = mainCanvas.element.getBoundingClientRect();
        let w = parseInt(PointStyle.width);
        let h = parseInt(PointStyle.height);
        let bw = parseInt(mainCanvas.element.style.borderWidth);
        let r = new Rectangle(CanvasRect.x + w / 2 + bw, CanvasRect.y + h / 2 + bw, parseInt(mainCanvas.element.style.width) - w, parseInt(mainCanvas.element.style.height) - h);
        let rawPoint = new Point(e.pageX, e.pageY);
        if (rawPoint.isInRect(r) && resume) {
            let cbw = parseInt(mainCanvas.element.style.borderWidth)
            let x = (e.pageX + document.body.scrollLeft + mainCanvas.element.scrollLeft - mainCanvas.element.offsetLeft - cbw);
            let y = (e.pageY + document.body.scrollTop + mainCanvas.element.scrollTop - mainCanvas.element.offsetTop - cbw);
            let p = new Point(x, y);

            if (!e.shiftKey) {
                let pElement = document.createElement("div");
                pElement.className = "point";
                PointsContainter.appendChild(pElement);

                pElement.style.left = `${e.pageX - parseInt(PointStyle.width) / 2}px`;
                pElement.style.top = `${e.pageY - parseInt(PointStyle.height) / 2}px`;

                p.element = pElement;
                points.push(p);
            } else {
                let dst = prevMousePos.distance(new Point(e.pageX, e.pageY));
                mouseOverlay.radius = Math.min(mouseOverlay.maxRadius, Math.max(mouseOverlay.minRadius, dst));
                for (let i = 0; i < points.length; i++) {
                    if (points[i].distance(p) <= mouseOverlay.radius) {
                        points[i].destroy();
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