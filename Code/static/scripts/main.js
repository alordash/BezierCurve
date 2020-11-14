import { Point } from './Figures/Point.js';
import { Rectangle } from './Figures/Rectangle.js';
import { RedrawCanvas } from './Drawing.js';
import { MouseOverlay } from './MouseOverlay/MouseOverlay.js';
import { MainCanvas } from './MainCanvas/MainCanvas.js';
import { CanvasMouseEvent, CanvasOnMouseUp } from './EventHandlers.js';

const EraseKey = "ctrlKey";
globalThis.EraseKey = EraseKey;

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
//#endregion

//#region Points
function ClearPoints() {
    while (typeof (points[0]) != 'undefined') {
        points.splice(0, 1);
    }
}

var PointCounter = document.getElementById("PointsCounter");

function UpdateCounter() {
    PointCounter.textContent = points.length;
}
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

function UpdateCanvas() {
    if (typeof (mainCanvas) != 'undefined') {
        RedrawCanvas(mainCanvas.canvas, points);
    }
}

var RenderPointsCheckbox = document.getElementById("RenderPointsCheckbox");
RenderPointsCheckbox.onchange = UpdateCanvas;

var RenderCurvesCheckbox = document.getElementById("RenderCurvesCheckbox");
RenderCurvesCheckbox.onchange = UpdateCanvas;

var ManualModeCheckbox = document.getElementById("ManualModeCheckbox");
ManualModeCheckbox.onchange = UpdateCanvas;


var ManualModeRange = document.getElementById("ManualModeRange");
ManualModeRange.onchange = UpdateCanvas;
ManualModeRange.onmousemove = function (e) {
    if(e.buttons) {
        UpdateCanvas();
    }
};

function canvasMouseEvent(e) {
    CanvasMouseEvent(e, mainCanvas, mouseOverlay, points);

    UpdateCounter(PointCounter, points);
}

function canvasOnMouseUp(e) {
    CanvasOnMouseUp(e, mainCanvas, mouseOverlay);
}

function setup() {
    const s = p => { };

    let canvas = new p5(s, "CanvasHolder");
    mainCanvas = new MainCanvas(canvas.canvas, canvas, 0.7, 0.7);
    mainCanvas.element = mainCanvas.canvas.canvas;

    mainCanvas.element.onmousemove = mainCanvas.element.onmousedown = canvasMouseEvent;

    mouseOverlay = new MouseOverlay(document.getElementById("MouseOverlay"));
    mouseOverlay.overlay.onmousemove = mouseOverlay.overlay.onmousedown = canvasMouseEvent;

    mainCanvas.element.onmouseup = mouseOverlay.overlay.onmouseup = canvasOnMouseUp;
}

window.onresize = function () {
    if (typeof (mainCanvas) != 'undefined') {
        mainCanvas.resizeCanvas();
        RedrawCanvas(mainCanvas.canvas, points);
    }
}

window.onkeyup = function (e) {
    if (typeof (mouseOverlay) != 'undefined' && !e[globalThis.EraseKey]) {
        mouseOverlay.overlay.style.display = 'none';
    }
}