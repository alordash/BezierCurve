"use strict";
import { Point } from './Point.js';
import { GetCanvHeight, GetCanvWidth, RedrawCanvas } from './Drawing.js';

/**
 * @type {Array.<Point>}
 */
var points = [];

var Canvas;
var CanvasObject;
var CanvasRect;

var PointCounter = document.getElementById("PointsCounter");

var ClearButton = document.getElementById("ClearButton");
ClearButton.onclick = function () {
    points = [];
    UpdateCounter();
    RedrawCanvas(Canvas, points);
}

var StartButton = document.getElementById("StartButton");
StartButton.onclick = function () {
    if (typeof (CanvasObject) != 'undefined') {
        CanvasObject.parentNode.removeChild(CanvasObject);
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

function canvasOnlick(e) {
    let x = e.offsetX / CanvasObject.width;
    let y = e.offsetY / CanvasObject.height;
    if (!e.shiftKey) {
        points.push(new Point(x, y));
    } else {

    }

    UpdateCounter();
    RedrawCanvas(Canvas, points);
}

function setup() {
    const s = p => {
        let x = 40;
        let y = 40;
    }
    
    Canvas = new p5(s, "CanvasHolder");
    
    Canvas.canvas.id = "MainCanvas";
    CanvasObject = Canvas.canvas;

    CanvasObject.style.border = "#000000";
    CanvasObject.style.borderStyle = "solid";
    CanvasObject.onclick = canvasOnlick;

    CanvasRect = CanvasObject.getBoundingClientRect();

    Canvas.resizeCanvas(GetCanvWidth(CanvasRect), GetCanvHeight(CanvasRect));
}

window.onresize = function () {
    Canvas.resizeCanvas(GetCanvWidth(CanvasRect), GetCanvHeight(CanvasRect));
    RedrawCanvas(Canvas, points);
}