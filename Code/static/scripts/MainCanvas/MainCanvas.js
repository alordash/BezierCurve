export class MainCanvas {
    element;
    canvas;
    wk;
    hk;
    constructor(element, canvas, wk, hk) {
        this.element = element;
        this.canvas = canvas;
        this.wk = wk;
        this.hk = hk;
        this.element.id = "MainCanvas";
    
        this.element.style.border = "#000000";
        this.element.style.borderStyle = "solid";
        this.element.style.borderWidth = "3px";

        this.resizeCanvas();
    }

    destroy() {
        this.element.parentNode.removeChild(this.element);
        delete this;
    } 
    
    GetCanX(x) {
        return x + document.body.scrollLeft + this.element.scrollLeft - this.element.offsetLeft - parseInt(this.element.style.borderWidth);
    }

    GetCanY(y) {
        return y + document.body.scrollTop + this.element.scrollTop - this.element.offsetTop - parseInt(this.element.style.borderWidth);
    }

    GetCanvWidth() {
        return this.wk * window.outerWidth - this.element.style.left;
    }

    GetCanvHeight() {
        return this.hk * window.outerHeight - this.element.style.top;
    }

    resizeCanvas() {
        this.canvas.resizeCanvas(this.GetCanvWidth(), this.GetCanvHeight());
    }

}