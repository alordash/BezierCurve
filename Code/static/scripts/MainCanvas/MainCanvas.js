import { Realign } from '../Drawing.js';

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

    GetCanvWidth(step) {
        let w = this.wk * window.outerWidth - this.element.style.left;
        if (step) {
            w = Realign(w, step);
        }
        return w;
    }

    GetCanvHeight(step) {
        let h = this.hk * window.outerHeight - this.element.style.top;
        if (step) {
            h = Realign(h, step);
        }
        return h;
    }

    resizeCanvas(step) {
        this.canvas.resizeCanvas(this.GetCanvWidth(step), this.GetCanvHeight(step));
    }

}