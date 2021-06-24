class Sprite_DisplayImage {
	constructor() {
		const
			Browser = Laya.Browser,
			WebGL = Laya.WebGL,
			Stage = Laya.Stage;
		Config.isAntialias = true;
		// 不支持WebGL时自动切换至Canvas
		Laya.init(Browser.clientWidth, Browser.clientHeight, WebGL);
		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;
		Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
		Laya.stage.bgColor = "#232628";

		this.showApe();
	}

	showApe() {
		const
			monkey1Path = "./res/apes/monkey1.png",
			monkey2Path = "./res/apes/monkey2.png";

		// 方法1：使用loadImage
		let ape = new Laya.Sprite();
		Laya.stage.addChild(ape);
		ape.loadImage(monkey1Path);

		// 方法2：使用drawTexture
		Laya.loader.load(monkey2Path, Laya.Handler.create(this, function () {
			let monkey2 = Laya.loader.getRes(monkey2Path);
			let ape2 = new Laya.Sprite();
			Laya.stage.addChild(ape2);
			ape2.graphics.drawTexture(monkey2, 100, 0);
		}));
	}
}

new Sprite_DisplayImage();