let 
	mFactory,
	mArmature,
	mStartX = 400,
	mStartY = 500,
	mCurrIndex = 0;

class Skeleton_MultiTexture {
	constructor() {
		const 
			Browser = Laya.Browser,
			WebGL = Laya.WebGL,
			Stage = Laya.Stage,
			Stat = Laya.Stat;

		// 不支持WebGL时自动切换至Canvas
		Laya.init(Browser.clientWidth, Browser.clientHeight, WebGL);

		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;

		Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
		Laya.stage.bgColor = "#ffffff";

		Stat.show();
		this.startFun();
	}

	startFun() {
		const 
			Templet = Laya.Templet,
			Event = Laya.Event;
		const mAniPath = "res/spine/spineRes1/dragon.sk";

		mFactory = new Templet();
		mFactory.on(Event.COMPLETE, this, this.parseComplete);
		mFactory.on(Event.ERROR, this, this.onError);
		mFactory.loadAni(mAniPath);
	}

	onError() {
		trace("error");
	}

	parseComplete() {
		// 创建模式为1，使用动画自己的缓冲区，可以启用换装(相当耗费内存)
		mArmature = mFactory.buildArmature(1);
		Laya.stage.addChild(mArmature);
		mArmature.pos(mStartX, mStartY);
		mArmature.scale(0.5, 0.5);
		mArmature.on(Laya.Event.STOPPED, this, this.completeHandler);
		this.play();
	}

	completeHandler() {
		this.play();
	}

	play() {
		mCurrIndex++;
		let aniNum = mArmature.getAnimNum();
		if (mCurrIndex >= aniNum) {
			mCurrIndex = 0;
		}
		mArmature.play(mCurrIndex, false);
	}
}

new Skeleton_MultiTexture();