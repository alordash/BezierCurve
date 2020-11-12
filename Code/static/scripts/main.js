"use strict";
import { Point } from './Point.js';
import { GetCanvHeight, GetCanvWidth, RedrawCanvas } from './Drawing.js';

/**
 * @type {Array.<Point>}
 */
var points = [];

//#region Canvas
var Canvas;
var CanvasRect;
//#endregion Canvas

//#region MouseOverlay
var MouseOverlay;
const minRadius = 20;
const maxRadius = 150;
var Radius = minRadius;
//#endregion

var PointCounter = document.getElementById("PointsCounter");

var ClearButton = document.getElementById("ClearButton");
ClearButton.onclick = function () {
    points = [];
    UpdateCounter();
    RedrawCanvas(Canvas, points);
}

var StartButton = document.getElementById("StartButton");
StartButton.onclick = function () {
    if (typeof (Canvas) != 'undefined') {
        Canvas.canvas.parentNode.removeChild(Canvas.canvas);
    }
    points = [];
    setup();
    Canvas.resizeCanvas(GetCanvWidth(CanvasRect), GetCanvHeight(CanvasRect));
    RedrawCanvas(Canvas, points);
    UpdateCounter();
}

function UpdateCounter() {
    PointCounter.textContent = points.length;
}

function UpdateOverlay(e) {
    if (e.shiftKey) {
        MouseOverlay.canvas.style.display = 'block';
    } else {
        MouseOverlay.canvas.style.display = 'none';
    }
    MouseOverlay.canvas.style.left = `${e.pageX - Radius}px`;
    MouseOverlay.canvas.style.top = `${e.pageY - Radius}px`;
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
        if (resume) {
            let x = (e.pageX + document.body.scrollLeft + Canvas.canvas.scrollLeft - Canvas.canvas.offsetLeft - parseInt(Canvas.canvas.style.borderWidth));
            let y = (e.pageY + document.body.scrollTop + Canvas.canvas.scrollTop - Canvas.canvas.offsetTop - parseInt(Canvas.canvas.style.borderWidth));
            let p = new Point(x, y);

            if (!e.shiftKey) {
                points.push(p);
            } else {
                let dst = prevMousePos.distance(new Point(e.pageX, e.pageY));
                Radius = Math.min(maxRadius, Math.max(minRadius, dst));
                UpdateOverlay(e);
                for (let i = 0; i < points.length; i++) {
                    if (points[i].distance(p) <= Radius) {
                        points.splice(i, 1);
                        i--;
                    }
                }
            }

            UpdateCounter();
            RedrawCanvas(Canvas, points);
        }
    }
    prevMousePos = new Point(e.pageX, e.pageY);
}

function canvasOnMouseUp() {
    clearTimeout(moveTimer);
    countMove = true;
}

function setup() {
    const s = p => {
        let x = 40;
        let y = 40;
    }

    Canvas = new p5(s, "CanvasHolder");

    Canvas.canvas.id = "MainCanvas";
    Canvas.canvas = Canvas.canvas;

    Canvas.canvas.style.border = "#000000";
    Canvas.canvas.style.borderStyle = "solid";
    Canvas.canvas.style.borderWidth = "3px";
    Canvas.canvas.onmousemove = Canvas.canvas.onmousedown = canvasMouseEvent;

    CanvasRect = Canvas.canvas.getBoundingClientRect();

    Canvas.resizeCanvas(GetCanvWidth(CanvasRect), GetCanvHeight(CanvasRect));

    MouseOverlay = new p5(s, "MouseOverlay");
    MouseOverlay.canvas.style = `border: 1.5px solid rgb(0, 0, 0);border-radius: ${1.5 * Radius}px;width: ${2 * Radius}px;height: ${2 * Radius}px;background: transparent;position: absolute; top = 0px; left = 0px; display: none`;
    MouseOverlay.canvas.onmousemove = MouseOverlay.canvas.onmousedown = canvasMouseEvent;
    MouseOverlayRect = MouseOverlay.canvas.getBoundingClientRect();

    Canvas.canvas.onmouseup = MouseOverlay.canvas.onmouseup = canvasOnMouseUp;
}

window.onresize = function () {
    Canvas.resizeCanvas(GetCanvWidth(CanvasRect), GetCanvHeight(CanvasRect));
    RedrawCanvas(Canvas, points);
}

window.onkeyup = function (e) {
    if (!e.shiftKey) {
        MouseOverlay.canvas.style.display = 'none';
    }
}

window.onmousemove = function (e) {
    if (typeof (MouseOverlay) != 'undefined') {
        UpdateOverlay(e);
    }
}