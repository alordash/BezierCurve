import { Point } from '../Figures/Point.js';
import { Rectangle } from '../Figures/Rectangle.js';

export class MouseOverlay {
    overlay;
    radius;
    minRadius = 20;
    maxRadius = 150;
    constructor(overlay) {
        this.overlay = overlay;
        this.radius = this.minRadius;
        this.overlay.style.borderRadius = `${1.5 * this.radius}px`;
        this.overlay.style.width = this.overlay.style.height = `${2 * this.radius}px`;
    }

    UpdateOverlay(e, canvasElement) {
        let x = e.pageX - this.radius;
        let y = e.pageY - this.radius;

        let p = new Point(x, y);
        let CanvasRect = canvasElement.getBoundingClientRect();
        let r = new Rectangle(CanvasRect.x, CanvasRect.y, parseInt(canvasElement.style.width), parseInt(canvasElement.style.height));
        if (e[globalThis.EraseKey] && p.isInRect(r)) {
            this.overlay.style.display = 'block';
        } else {
            this.overlay.style.display = 'none';
        }
        if (e.buttons) {
            this.overlay.style.backgroundColor = `rgba(255, 130, 120, 0.4)`;
        } else {
            this.overlay.style.background = 'transparent';
        }
        this.overlay.style.left = `${x}px`;
        this.overlay.style.top = `${y}px`;
        this.overlay.style.borderRadius = `${1.5 * this.radius}px`;
        this.overlay.style.height = this.overlay.style.width = `${2 * this.radius}px`;
    }
}