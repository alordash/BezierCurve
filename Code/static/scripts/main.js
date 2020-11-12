"use strict";
import { Point, Rectangle } from './Figures.js';
import { GetCanvHeight, GetCanvWidth, RedrawCanvas } from './Drawing.js';

/**
 * @type {Array.<Point>}
 */
var points = [];

//#region Canvas
var Canvas;
//#endregion Canvas

//#region MouseOverlay
var MouseOverlay;
const minRadius = 20;
const maxRadius = 150;
var Radius = minRadius;
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

let ZeroPoint = document.getElementById("ZeroPoint");
let PointStyle = getComputedStyle(ZeroPoint);
ZeroPoint.style.display = 'none';
//#endregion

var ClearButton = document.getElementById("ClearButton");
ClearButton.onclick = function () {
    ClearPoints();
    UpdateCounter();
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
    UpdateCounter();
}


function UpdateCounter() {
    PointCounter.textContent = points.length;
}

function UpdateOverlay(e) {
    let x = e.pageX - Radius;
    let y = e.pageY - Radius;

    let p = new Point(x, y);
    let CanvasRect = Canvas.canvas.getBoundingClientRect();
    let r = new Rectangle(CanvasRect.x, CanvasRect.y, parseInt(Canvas.canvas.style.width), parseInt(Canvas.canvas.style.height));
    if (e.shiftKey && p.isInRect(r)) {
        MouseOverlay.canvas.style.display = 'block';
    } else {
        MouseOverlay.canvas.style.display = 'none';
    }
    if (e.buttons) {
        MouseOverlay.canvas.style.backgroundColor = `rgba(255, 130, 120, 0.4)`;
    } else {
        MouseOverlay.canvas.style.background = 'transparent';
    }
    MouseOverlay.canvas.style.left = `${x}px`;
    MouseOverlay.canvas.style.top = `${y}px`;
    MouseOverlay.canvas.style.borderRadius = `${1.5 * Radius}px`;
    MouseOverlay.canvas.style.height = MouseOverlay.canvas.style.width = `${2 * Radius}px`;
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
                Radius = Math.min(maxRadius, Math.max(minRadius, dst));
                for (let i = 0; i < points.length; i++) {
                    if (points[i].distance(p) <= Radius) {
                        points[i].remove();
                        points.splice(i, 1);
                        i--;
                    }
                }
            }

            UpdateCounter();
            RedrawCanvas(Canvas, points);
        }
    }
    UpdateOverlay(e);
    prevMousePos = new Point(e.pageX, e.pageY);
}

function canvasOnMouseUp() {
    clearTimeout(moveTimer);
    countMove = true;
}

function setup() {
    const s = p => { }

    Canvas = new p5(s, "CanvasHolder");

    Canvas.canvas.id = "MainCanvas";
    Canvas.canvas = Canvas.canvas;

    Canvas.canvas.style.border = "#000000";
    Canvas.canvas.style.borderStyle = "solid";
    Canvas.canvas.style.borderWidth = "3px";
    Canvas.canvas.onmousemove = Canvas.canvas.onmousedown = canvasMouseEvent;

    Canvas.resizeCanvas(GetCanvWidth(Canvas), GetCanvHeight(Canvas));

    MouseOverlay = new p5(s, "MouseOverlay");
    MouseOverlay.canvas.style = `border: 1.5px solid rgb(0, 0, 0);border-radius: ${1.5 * Radius}px;width: ${2 * Radius}px;height: ${2 * Radius}px;background: transparent;position: absolute; top = 0px; left = 0px; display: none`;
    MouseOverlay.canvas.onmousemove = MouseOverlay.canvas.onmousedown = canvasMouseEvent;

    Canvas.canvas.onmouseup = MouseOverlay.canvas.onmouseup = canvasOnMouseUp;
}

window.onresize = function () {
    Canvas.resizeCanvas(GetCanvWidth(Canvas), GetCanvHeight(Canvas));
    RedrawCanvas(Canvas, points);
}

window.onkeyup = function (e) {
    if (!e.shiftKey) {
        MouseOverlay.canvas.style.display = 'none';
    }
}