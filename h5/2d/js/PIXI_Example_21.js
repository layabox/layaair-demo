let 
	colors = ["#5D0776", "#EC8A49", "#AF3666", "#F6C84C", "#4C779A"],
	colorCount = 0,
	isDown = false,
	path = [],
	color = colors[0],
	liveGraphics,
	canvasGraphics;

class PIXI_Example_21 {
	constructor() {
		const 
			Browser = Laya.Browser,
			WebGL = Laya.WebGL,
			Stage = Laya.Stage,
			Stat = Laya.Stat,
			Handler = Laya.Handler,
			Loader = Laya.Loader;

		// 不支持WebGL时自动切换至Canvas
		Laya.init(Browser.width, Browser.height, WebGL);

		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;

		Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
		Laya.stage.bgColor = "#3da8bb";

		Stat.show();

		this.createCanvases();

		Laya.timer.frameLoop(1, this, this.animate);

		Laya.stage.on('mousedown', this, this.onMouseDown);
		Laya.stage.on('mousemove', this, this.onMouseMove);
		Laya.stage.on('mouseup', this, this.onMouseUp);
	}

	createCanvases() {
		const Sprite = Laya.Sprite;

		let graphicsCanvas = new Sprite();
		Laya.stage.addChild(graphicsCanvas);
		let liveGraphicsCanvas = new Sprite();
		Laya.stage.addChild(liveGraphicsCanvas);

		liveGraphics = liveGraphicsCanvas.graphics;
		canvasGraphics = graphicsCanvas.graphics;
	}

	onMouseDown() {
		isDown = true;
		color = colors[colorCount++ % colors.length];
		path.length = 0;
	}

	onMouseMove() {
		if (!isDown) return;

		path.push(Laya.stage.mouseX);
		path.push(Laya.stage.mouseY);
	}

	onMouseUp() {
		isDown = false;
		canvasGraphics.drawPoly(0, 0, path.concat(), color);
	}

	animate() {
		liveGraphics.clear();
		liveGraphics.drawPoly(0, 0, path, color);
	}
}

new PIXI_Example_21();