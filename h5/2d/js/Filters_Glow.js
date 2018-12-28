let 
	apePath = "res/apes/monkey2.png";

class Filters_Glow {
	constructor() {
		const 
			Browser = Laya.Browser,
			WebGL = Laya.WebGL,
			Stage = Laya.Stage;

		// 不支持WebGL时自动切换至Canvas
		Laya.init(Browser.width, Browser.height, WebGL);

		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;

		Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
		Laya.stage.bgColor = "#232628";

		Laya.loader.load(apePath, Laya.Handler.create(this, this.setup));
	}

	setup() {
		this.createApe();
		this.applayFilter();
	}

	createApe() {
		const Sprite = Laya.Sprite;
		this.ape = new Sprite();
		Laya.stage.addChild(this.ape);
		let texture = Laya.loader.getRes(apePath);
		this.ape.graphics.drawTexture(texture);
		this.ape.x = (Laya.stage.width - texture.width) / 2;
		this.ape.y = (Laya.stage.height - texture.height) / 2;
	}

	applayFilter() {
		// 创建一个发光滤镜
		const GlowFilter = Laya.GlowFilter;
		let glowFilter = new GlowFilter("#ffff00", 10, 0, 0);
		// 设置滤镜集合为发光滤镜
		this.ape.filters = [glowFilter];
	}
}

new Filters_Glow();