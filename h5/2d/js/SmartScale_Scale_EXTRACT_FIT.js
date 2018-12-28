class SmartScale_Scale_EXTRACT_FIT {
	constructor() {
		const 
			Browser = Laya.Browser,
			WebGL = Laya.WebGL,
			Stage = Laya.Stage,
			Stat = Laya.Stat,
			Handler = Laya.Handler;

		// 不支持WebGL时自动切换至Canvas
		Laya.init(550, 400, WebGL);

		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;

		Laya.stage.scaleMode = Stage.SCALE_EXACTFIT;
		Laya.stage.bgColor = "#232628";

		this.createCantralRect();
	}

	createCantralRect() {
		const Sprite = Laya.Sprite;
		
		this.rect = new Sprite();
		this.rect.graphics.drawRect(-100, -100, 200, 200, "gray");
		Laya.stage.addChild(this.rect);

		this.updateRectPos();
	}

	updateRectPos() {
		this.rect.x = Laya.stage.width / 2;
		this.rect.y = Laya.stage.height / 2;
	}
}

new SmartScale_Scale_EXTRACT_FIT();