class Sprite_DrawPath {
	constructor() {
		const 
			Browser = Laya.Browser,
			WebGL = Laya.WebGL,
			Stage = Laya.Stage;

		// 不支持WebGL时自动切换至Canvas
		Laya.init(Browser.clientWidth, Browser.clientHeight, WebGL);

		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;

		Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
		Laya.stage.bgColor = "#232628";

		this.drawPentagram();
	}

	drawPentagram() {
		let canvas = new Laya.Sprite();
		Laya.stage.addChild(canvas);
		
		let path = [];
		path.push(0, -130);
		path.push(33, -33);
		path.push(137, -30);
		path.push(55, 32);
		path.push(85, 130);
		path.push(0, 73);
		path.push(-85, 130);
		path.push(-55, 32);
		path.push(-137, -30);
		path.push(-33, -33);

		canvas.graphics.drawPoly(Laya.stage.width / 2, Laya.stage.height / 2, path, "#FF7F50");
	}
}

new Sprite_DrawPath();