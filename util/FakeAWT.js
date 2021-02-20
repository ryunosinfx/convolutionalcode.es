import { V } from './V.js';
export class Dimension {
	constructor(width, height) {
		this.width = width;
		this.height = height;
	}
}
export class Font {
	static ITALIC = 'ITALIC';
	static BOLD = 'BOLD';
	constructor(fontfamily, fontStyle, fontSize) {
		this.fontfamily = fontfamily;
		this.fontStyle = fontStyle;
		this.fontSize = fontSize;
	}
}
export class JLabel {
	static EXIT_ON_CLOSE = 'EXIT_ON_CLOSE';
	static RIGHT = 'RIGHT';
	static LEFT = 'LEFT';
	constructor(text) {
		this.elm = V.c('span');
		this.elm.textContent = text;
	}
	setFont(font) {
		this.font = font;
		this.elm.style.fontFamily = font.fontfamily;
		if (font.fontStyle === Font.ITALIC) {
			this.elm.style.fontStyle = 'italic';
		}
		this.elm.style.fontSize = font.fontSize;
	}
}
export class JTextField {
	constructor(size) {
		this.elm = V.c('input');
		this.elm.textContent = text;
		V.sa(this.elm, 'length', size);
	}
	getText() {
		return this.elm.value;
	}
}
export class JButton {
	constructor(text) {
		this.elm = V.c('button');
		this.elm.textContent = text;
	}
	addActionListener(handler) {
		V.ael(this.elm, 'click', handler);
	}
}
export class FlowLayout {
	constructor(text) {
		this.elm = V.c('span');
		this.elm.textContent = text;
	}
}

export class Container {
	constructor(elm = V.c('div')) {
		this.elm = elm;
		this.elm.textContent = text;
	}
	setLayout(layout) {
		this.layout = layout;
	}
	add(elm) {
		V.a(this.elm, elm);
	}
}

class G {
	constructor(parentElm) {
		this.parentElm = parentElm;
		this.canvasElm = V.c('canvas');
		this.ctx = this.canvasElm.getContext('2d');
		this.imgElm = V.c('img');
		this.font = new Font('sans-serif', '', 10);
		this.reset();
		V.a(this.parentElm, this.canvasElm);
		this.color = '#000000';
	}
	reset() {
		const w = this.parentElm.clientWidth;
		const h = this.parentElm.clientHeight;
		V.sa(this.canvasElm, 'width', w);
		V.sa(this.canvasElm, 'height', h);
	}
	setRenderingHint(...hints) {
		this.hints = hints;
	}
	setBackground(color) {
		this.color = color;
	}
	clearRect(sx, sy, ex, ey) {
		this.ctx.fillStyle = this.color;
		this.ctx.fillRect(sx, sy, ex, ey);
	}
	draw(func) {
		this.ctx.beginPath();
		func(this.ctx);
		// ctx.ellipse(100, 100, 50, 75, Math.PI / 4, 0, 2 * Math.PI);
		this.ctx.stroke();
	}
	drawString(string, x, y) {
		this.ctx.font = this.font.fontSize + 'px ' + this.font.fontfamily;
		this.ctx.fillText(string, x, y);
	}
	setStroke(stroke) {
		this.stroke = stroke;
	}
	setFont(font) {
		this.font = font;
	}
}
export class BasicStroke {
	static CAP_BUTT = 'CAP_BUTT';
	static JOIN_BEVEL = 'JOIN_BEVEL';
	//float width, int cap, int join, float miterlimit, float[] dash, float dash_phase
	//1, BasicStroke.CAP_BUTT, BasicStroke.JOIN_BEVEL, 0, new Array(9), 0
	constructor(width) {
		this.width = width;
	}
}
export class Ellipse2D {
	static Double(xF, yF, xT, yT, rotation = 0, startAngle = 0, endAngle = 2 * Math.PI) {
		return (ctx) => {
			ctx.ellipse(xF, yF, xT, yT, rotation, startAngle, endAngle);
		};
	}
}
export class Line2D {
	static Double(xF, yF, xT, yT) {}
}
export class Color {
	static gray = '#808080';
}
export class RenderingHints {
	static KEY_ANTIALIASING = 'KEY_ANTIALIASING';
	static VALUE_ANTIALIAS_ON = 'VALUE_ANTIALIAS_ON';
}
export class JFrame {
	static EXIT_ON_CLOSE = 'EXIT_ON_CLOSE';
	constructor() {
		this.panel = new JPanel();
	}
	setDefaultCloseOperation() {}
	getContentPanel() {
		return this.panel.Container;
	}
	pack() {
		this.panel.pack();
	}
	setVisible(isVisible) {
		this.isVisible = isVisible;
		this.panel.frame.style.display = isVisible ? 'block' : 'none';
	}
}
export class JPanel {
	constructor() {
		this.frame = V.c('div');
		this.frame.style.display = 'none';
		this.Container = new Container();

		V.a(this.frame, this.Container.elm);
		this.myXs = 0;
		this.myXf = 0;
	}
	getX() {
		return 0;
	}
	getWidth() {
		return 0;
	}
	getHeight() {
		return 0;
	}
	setPreferredSize(demention) {
		this.demention = demention;
	}
	repaint() {
		if (!this.ctx) {
		}
		this.paintComponents();
	}
	paintComponents() {}
	getContentPanel() {
		return this.Container;
	}
	removeAll() {
		V.rc(this.Container.elm);
	}
	pack() {
		V.a(V.b, this.frame);
	}
	setVisible(isVisible) {
		this.isVisible = isVisible;

		this.frame.style.display = isVisible ? 'block' : 'none';
	}
	add(elm) {
		V.a(this.content, elm);
	}
}
export class JOptionPane {
	constructor(msg) {
		this.msg = msg;
	}
}
