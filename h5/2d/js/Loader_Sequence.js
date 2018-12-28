let numLoaded = 0;

class Loader_Sequence {
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

		// 按序列加载 monkey2.png - monkey1.png - monkey0.png
		// 不开启缓存
		// 关闭并发加载
		Laya.loader.maxLoader = 1;
		Laya.loader.load("res/apes/monkey2.png", Handler.create(this, this.onAssetLoaded), null, null, 0, false);
		Laya.loader.load("res/apes/monkey1.png", Handler.create(this, this.onAssetLoaded), null, null, 1, false);
		Laya.loader.load("res/apes/monkey0.png", Handler.create(this, this.onAssetLoaded), null, null, 2, false);
	}

	onAssetLoaded(texture) {
		console.log(texture.url);

		// 恢复默认并发加载个数。
		if (++numLoaded == 3) {
			Laya.loader.maxLoader = 5;
			console.log("All done.");
		}
	}
}

new Loader_Sequence();