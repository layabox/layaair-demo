let 
	mArmature,
	fileName = "Dragon",
	mTexturePath,
	mAniPath,

	rowCount = 10,
	colCount = 10,
	xOff = 50,
	yOff = 100,

	mSpacingX,
	mSpacingY,
	mAnimationArray = [],
	mFactory,
	mActionIndex = 0;

class PerformanceTest_Skeleton {
	constructor() {
		const 
			Browser = Laya.Browser,
			WebGL = Laya.WebGL,
			Stage = Laya.Stage,
			Stat = Laya.Stat,
			Handler = Laya.Handler,
			Loader = Laya.Loader;

		// 不支持WebGL时自动切换至Canvas
		Laya.init(Browser.width, Browser.height, WebGL);

		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;

		Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
		Laya.stage.bgColor = "#232628";

		Stat.show();

		mSpacingX = Browser.width / colCount;
		mSpacingY = Browser.height / rowCount;
		mTexturePath = "res/skeleton/" + fileName + "/" + fileName + ".png";
		mAniPath = "res/skeleton/" + fileName + "/" + fileName + ".sk";
		Laya.loader.load([{ url: mTexturePath, type: Loader.IMAGE }, { url: mAniPath, type: Loader.BUFFER }], Handler.create(this, this.onAssetsLoaded));
	}

	onAssetsLoaded() {
		const 
			Loader = Laya.Loader,
			Templet = Laya.Templet,
			Event = Laya.Event;

		let tTexture = Loader.getRes(mTexturePath);
		let arraybuffer = Loader.getRes(mAniPath);
		mFactory = new Templet();
		mFactory.on(Event.COMPLETE, this, this.parseComplete);
		mFactory.parseData(tTexture, arraybuffer, 10);
	}


	parseComplete() {
		const Event = Laya.Event;

		for (let i = 0; i < rowCount; i++) {
			for (let j = 0; j < colCount; j++) {
				mArmature = mFactory.buildArmature();
				mArmature.x = xOff + j * mSpacingX;
				mArmature.y = yOff + i * mSpacingY;
				mAnimationArray.push(mArmature);
				mArmature.play(0, true);
				Laya.stage.addChild(mArmature);
			}
		}
		Laya.stage.on(Event.CLICK, this, this.toggleAction);
	}

	toggleAction(e) {
		mActionIndex++;
		let tAnimNum = mArmature.getAnimNum();
		if (mActionIndex >= tAnimNum) {
			mActionIndex = 0;
		}
		for (let i = 0, n = mAnimationArray.length; i < n; i++) {
			mAnimationArray[i].play(mActionIndex, true);
		}
	}
}

new PerformanceTest_Skeleton();