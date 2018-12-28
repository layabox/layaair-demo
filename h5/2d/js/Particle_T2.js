let partPath = "res/particles/RadiusMode.part";

class Particle_T2 {
	constructor() {
		const 
			Browser = Laya.Browser,
			WebGL = Laya.WebGL,
			Stage = Laya.Stage,
			Loader = Laya.Loader,
			Stat = Laya.Stat;

		// 不支持WebGL时自动切换至Canvas
		Laya.init(Browser.width, Browser.height, WebGL);

		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;

		Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
		Laya.stage.bgColor = "#232628";

		Stat.show();
		Laya.loader.load(partPath, Laya.Handler.create(this, this.onAssetsLoaded), null, Loader.JSON);
	}

	onAssetsLoaded(settings) {
		// 当load数组的时候，回调函数传入的参数不再是资源，可以通过以下方法获取资源
		// let settings = Laya.loader.getRes(partPath);

		const Particle2D = Laya.Particle2D;
		// 创建 Particle2D 实例
		let partIns = new Particle2D(settings);
		Laya.stage.addChild(partIns);
		// 开始发射粒子
		partIns.emitter.start();
		// 播放
		partIns.play();

		partIns.x = Laya.stage.width / 2;
		partIns.y = Laya.stage.height / 2;
	}
}

new Particle_T2();