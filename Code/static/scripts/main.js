"use strict";
import { Point } from './Figures/Point.js';
import { Rectangle } from './Figures/Rectangle.js';
import { GetCanvHeight, GetCanvWidth, RedrawCanvas } from './Drawing.js';
import { MouseOverlay } from './MouseOverlay/MouseOverlay.js';

/**
 * @type {Array.<Point>}
 */
var points = [];

//#region Canvas
var Canvas;
//#endregion Canvas

//#region MouseOverlay
/**@type {MouseOverlay} */
var mouseOverlay;
const minRadius = 20;
const maxRadius = 150;
//#endregion

//#region Points
function ClearPoints() {
    while (typeof (points[0]) != 'undefined') {
        points[0].remove();
        points.splice(0, 1);
    }
}
var PointsContainter = document.getElementById("PointsContainter");

var PointCounter = document.getElementById("PointsCounter");

function UpdateCounter() {
    PointCounter.textContent = points.length;
}

let ZeroPoint = document.getElementById("ZeroPoint");
let PointStyle = getComputedStyle(ZeroPoint);
ZeroPoint.style.display = 'none';
//#endregion

var ClearButton = document.getElementById("ClearButton");
ClearButton.onclick = function () {
    ClearPoints();
    UpdateCounter(PointCounter, points);
    RedrawCanvas(Canvas, points);
}

var StartButton = document.getElementById("StartButton");
StartButton.onclick = function () {
    if (typeof (Canvas) != 'undefined') {
        Canvas.canvas.parentNode.removeChild(Canvas.canvas);
    }
    ClearPoints();
    setup();
    Canvas.resizeCanvas(GetCanvWidth(Canvas), GetCanvHeight(Canvas));
    RedrawCanvas(Canvas, points);
    UpdateCounter(PointCounter, points);
}

let countMove = true;
let moveTimer;
let mouseMoveCounter = 0;
let mouseMovePeriod = 3;
let prevMousePos = new Point(0, 0);

function canvasMouseEvent(e) {
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
        let CanvasRect = Canvas.canvas.getBoundingClientRect();
        let w = parseInt(PointStyle.width);
        let h = parseInt(PointStyle.height);
        let bw = parseInt(Canvas.canvas.style.borderWidth);
        let r = new Rectangle(CanvasRect.x + w / 2 + bw, CanvasRect.y + h / 2 + bw, parseInt(Canvas.canvas.style.width) - w, parseInt(Canvas.canvas.style.height) - h);
        let rawPoint = new Point(e.pageX, e.pageY);
        if (rawPoint.isInRect(r) && resume) {
            let x = (e.pageX + document.body.scrollLeft + Canvas.canvas.scrollLeft - Canvas.canvas.offsetLeft - parseInt(Canvas.canvas.style.borderWidth));
            let y = (e.pageY + document.body.scrollTop + Canvas.canvas.scrollTop - Canvas.canvas.offsetTop - parseInt(Canvas.canvas.style.borderWidth));
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
                mouseOverlay.radius = Math.min(maxRadius, Math.max(minRadius, dst));
                for (let i = 0; i < points.length; i++) {
                    if (points[i].distance(p) <= mouseOverlay.radius + w / 2) {
                        points[i].remove();
                        points.splice(i, 1);
                        i--;
                    }
                }
            }

            UpdateCounter(PointCounter, points);
            RedrawCanvas(Canvas, points);
        }
    }
    mouseOverlay.UpdateOverlay(e, Canvas);
    prevMousePos = new Point(e.pageX, e.pageY);
}

function canvasOnMouseUp(e) {
    clearTimeout(moveTimer);
    countMove = true;
    mouseOverlay.UpdateOverlay(e, Canvas);
}

function setup() {
    const s = p => { };

    Canvas = new p5(s, "CanvasHolder");

    Canvas.canvas.id = "MainCanvas";
    Canvas.canvas = Canvas.canvas;

    Canvas.canvas.style.border = "#000000";
    Canvas.canvas.style.borderStyle = "solid";
    Canvas.canvas.style.borderWidth = "3px";
    Canvas.canvas.onmousemove = Canvas.canvas.onmousedown = canvasMouseEvent;

    Canvas.resizeCanvas(GetCanvWidth(Canvas), GetCanvHeight(Canvas));

    mouseOverlay = new MouseOverlay(document.getElementById("MouseOverlay"), minRadius);
    mouseOverlay.overlay.style = `border: 1.5px solid rgb(0, 0, 0);border-radius: ${1.5 * mouseOverlay.radius}px;width: ${2 * mouseOverlay.radius}px;height: ${2 * mouseOverlay.radius}px;background: transparent;position: absolute; top = 0px; left = 0px; display: none`;
    mouseOverlay.overlay.onmousemove = mouseOverlay.overlay.onmousedown = canvasMouseEvent;

    Canvas.canvas.onmouseup = mouseOverlay.overlay.onmouseup = canvasOnMouseUp;
}

window.onresize = function () {
    Canvas.resizeCanvas(GetCanvWidth(Canvas), GetCanvHeight(Canvas));
    RedrawCanvas(Canvas, points);
}

window.onkeyup = function (e) {
    if (typeof(mouseOverlay) != 'undefined' && !e.shiftKey) {
        mouseOverlay.overlay.style.display = 'none';
    }
}