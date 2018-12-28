let numLoaded = 0;

class Loader_ProgressAndErrorHandle {
	constructor() {
		const 
			Browser = Laya.Browser,
			WebGL = Laya.WebGL,
			Stage = Laya.Stage,
			Stat = Laya.Stat,
			Handler = Laya.Handler,
			Event = Laya.Event,
			Loader = Laya.Loader;

		// 不支持WebGL时自动切换至Canvas
		Laya.init(Browser.clientWidth, Browser.clientHeight, WebGL);

		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;

		Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
		Laya.stage.bgColor = "#232628";

		// 无加载失败重试
		Laya.loader.retryNum = 0;

		var urls = ["do not exist", "res/fighter/fighter.png", "res/legend/map.jpg"];
		Laya.loader.load(urls, Handler.create(this, this.onAssetLoaded), Handler.create(this, this.onLoading, null, false), Loader.TEXT);

		// 侦听加载失败
		Laya.loader.on(Event.ERROR, this, this.onError);
	}

	onAssetLoaded(texture) {
		// 使用texture
		console.log("加载结束");
	}

	// 加载进度侦听器
	onLoading(progress) {
		console.log("加载进度: " + progress);
	}

	onError(err) {
		console.log("加载失败: " + err);
	}
}

new Loader_ProgressAndErrorHandle();