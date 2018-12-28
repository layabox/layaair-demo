class Loader_SingleType {
	constructor() {
		const 
			Browser = Laya.Browser,
			WebGL = Laya.WebGL,
			Stage = Laya.Stage,
			Stat = Laya.Stat,
			Handler = Laya.Handler;

		// 不支持WebGL时自动切换至Canvas
		Laya.init(Browser.clientWidth, Browser.clientHeight, WebGL);

		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;

		Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
		Laya.stage.bgColor = "#232628";

		// 加载一张png类型资源
		Laya.loader.load("res/apes/monkey0.png", Handler.create(this, this.onAssetLoaded1));
		// 加载多张png类型资源
		Laya.loader.load(
			["res/apes/monkey0.png", "res/apes/monkey1.png", "res/apes/monkey2.png"],
			Handler.create(this, this.onAssetLoaded2));
	}

	onAssetLoaded1(texture) {
		// 使用texture
	}

	onAssetLoaded2() {
		const Loader = Laya.Loader;

		let pic1 = Loader.getRes("res/apes/monkey0.png");
		let pic2 = Loader.getRes("res/apes/monkey1.png");
		let pic3 = Loader.getRes("res/apes/monkey2.png");
		// 使用资源
	}
}

new Loader_SingleType();