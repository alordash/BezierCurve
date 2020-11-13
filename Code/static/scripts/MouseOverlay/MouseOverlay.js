import { Point } from '../Figures/Point.js';
import { Rectangle } from '../Figures/Rectangle.js';

export class MouseOverlay {
    overlay;
    radius;
    constructor(overlay, radius) {
        this.overlay = overlay;
        this.radius = radius;
    }

    UpdateOverlay(e, Canvas) {
        let x = e.pageX - this.radius;
        let y = e.pageY - this.radius;

        let p = new Point(x, y);
        let CanvasRect = Canvas.canvas.getBoundingClientRect();
        let r = new Rectangle(CanvasRect.x, CanvasRect.y, parseInt(Canvas.canvas.style.width), parseInt(Canvas.canvas.style.height));
        if (e.shiftKey && p.isInRect(r)) {
            this.overlay.canvas.style.display = 'block';
        } else {
            this.overlay.canvas.style.display = 'none';
        }
        if (e.buttons) {
            this.overlay.canvas.style.backgroundColor = `rgba(255, 130, 120, 0.4)`;
        } else {
            this.overlay.canvas.style.background = 'transparent';
        }
        this.overlay.canvas.style.left = `${x}px`;
        this.overlay.canvas.style.top = `${y}px`;
        this.overlay.canvas.style.borderRadius = `${1.5 * this.radius}px`;
        this.overlay.canvas.style.height = this.overlay.canvas.style.width = `${2 * this.radius}px`;
    }
}