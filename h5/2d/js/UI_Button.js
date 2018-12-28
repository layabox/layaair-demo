let COLUMNS = 2,
	BUTTON_WIDTH = 147,
	BUTTON_HEIGHT = 165 / 3,
	HORIZONTAL_SPACING = 200,
	VERTICAL_SPACING = 100,

	xOffset,
	yOffset,

	skins;

class UI_Button {
	constructor() {
		const 
			Browser = Laya.Browser,
			WebGL = Laya.WebGL,
			Stage = Laya.Stage,
			Stat = Laya.Stat,
			Handler = Laya.Handler;

		// 不支持WebGL时自动切换至Canvas
		Laya.init(800, 600, WebGL);

		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;

		Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
		Laya.stage.bgColor = "#232628";

		skins = [
			"res/ui/button-1.png", "res/ui/button-2.png", "res/ui/button-3.png",
			"res/ui/button-4.png", "res/ui/button-5.png", "res/ui/button-6.png"
		];

		// 计算将Button至于舞台中心的偏移量
		xOffset = (Laya.stage.width - HORIZONTAL_SPACING * (COLUMNS - 1) - BUTTON_WIDTH) / 2;
		yOffset = (Laya.stage.height - VERTICAL_SPACING * (skins.length / COLUMNS - 1) - BUTTON_HEIGHT) / 2;

		Laya.loader.load(skins, Handler.create(this, this.onUIAssetsLoaded));
	}

	onUIAssetsLoaded() {
		for (let i = 0, len = skins.length; i < len; ++i) {
			let btn = this.createButton(skins[i]);
			let x = i % COLUMNS * HORIZONTAL_SPACING + xOffset;
			let y = (i / COLUMNS | 0) * VERTICAL_SPACING + yOffset;
			btn.pos(x, y);
		}
	}

	createButton(skin) {
		const Button = Laya.Button;

		let btn = new Button(skin);
		Laya.stage.addChild(btn);
		return btn;
	}
}

new UI_Button();