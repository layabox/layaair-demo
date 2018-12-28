let aniConfPath = "res/fighter/fighter.atlas";

class Animation_Altas {
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

		Laya.loader.load(aniConfPath, Laya.Handler.create(this, this.createAnimation), null, Laya.Loader.ATLAS);
	}
	
	createAnimation() {
		const Animation = Laya.Animation;
		let ani = new Animation();
		Laya.stage.addChild(ani);
		ani.loadAtlas(aniConfPath);	// 加载图集动画
		ani.interval = 30;			// 设置播放间隔（单位：毫秒）
		ani.index = 1;				// 当前播放索引
		ani.play();					// 播放图集动画

		// 获取动画的边界信息
		let bounds = ani.getGraphicBounds();
		ani.pivot(bounds.width / 2, bounds.height / 2);

		ani.pos(Laya.stage.width / 2, Laya.stage.height / 2);
	}
}

new Animation_Altas();