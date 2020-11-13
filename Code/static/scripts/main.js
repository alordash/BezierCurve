"use strict";
import { Point } from './Figures/Point.js';
import { Rectangle } from './Figures/Rectangle.js';
import { RedrawCanvas } from './Drawing.js';
import { MouseOverlay } from './MouseOverlay/MouseOverlay.js';
import { MainCanvas } from './MainCanvas/MainCanvas.js';

/**
 * @type {Array.<Point>}
 */
var points = [];

//#region Canvas
/**@type {MainCanvas} */
var mainCanvas;
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
        points[0].destroy();
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
    RedrawCanvas(mainCanvas.canvas, points);
}

var StartButton = document.getElementById("StartButton");
StartButton.onclick = function () {
    if (typeof (mainCanvas) != 'undefined') {
        mainCanvas.destroy();
    }
    ClearPoints();
    setup();
    mainCanvas.resizeCanvas();
    RedrawCanvas(mainCanvas.canvas, points);
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
                mouseOverlay.radius = Math.min(maxRadius, Math.max(minRadius, dst));
                for (let i = 0; i < points.length; i++) {
                    if (points[i].distance(p) <= mouseOverlay.radius + w / 2) {
                        points[i].destroy();
                        points.splice(i, 1);
                        i--;
                    }
                }
            }

            UpdateCounter(PointCounter, points);
            RedrawCanvas(mainCanvas.canvas, points);
        }
    }
    mouseOverlay.UpdateOverlay(e, mainCanvas.element);
    prevMousePos = new Point(e.pageX, e.pageY);
}

function canvasOnMouseUp(e) {
    clearTimeout(moveTimer);
    countMove = true;
    mouseOverlay.UpdateOverlay(e, mainCanvas.element);
}

function setup() {
    const s = p => { };

    mainCanvas = new MainCanvas(null, new p5(s, "CanvasHolder"), 0.7, 0.7);
    mainCanvas.element = mainCanvas.canvas.canvas;

    mainCanvas.element.id = "MainCanvas";

    mainCanvas.element.style.border = "#000000";
    mainCanvas.element.style.borderStyle = "solid";
    mainCanvas.element.style.borderWidth = "3px";
    mainCanvas.element.onmousemove = mainCanvas.element.onmousedown = canvasMouseEvent;

    mainCanvas.resizeCanvas();

    mouseOverlay = new MouseOverlay(document.getElementById("MouseOverlay"), minRadius);
    mouseOverlay.overlay.style = `border: 1.5px solid rgb(0, 0, 0);border-radius: ${1.5 * mouseOverlay.radius}px;width: ${2 * mouseOverlay.radius}px;height: ${2 * mouseOverlay.radius}px;background: transparent;position: absolute; top = 0px; left = 0px; display: none`;
    mouseOverlay.overlay.onmousemove = mouseOverlay.overlay.onmousedown = canvasMouseEvent;

    mainCanvas.element.onmouseup = mouseOverlay.overlay.onmouseup = canvasOnMouseUp;
}

window.onresize = function () {
    mainCanvas.resizeCanvas();
    RedrawCanvas(mainCanvas.canvas, points);
}

window.onkeyup = function (e) {
    if (typeof (mouseOverlay) != 'undefined' && !e.shiftKey) {
        mouseOverlay.overlay.style.display = 'none';
    }
}