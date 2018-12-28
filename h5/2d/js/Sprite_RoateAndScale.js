class Sprite_RoateAndScale {
	constructor() {
		const 
			Browser = Laya.Browser,
			WebGL = Laya.WebGL,
			Stage = Laya.Stage;

		// 不支持WebGL时自动切换至Canvas
		Laya.init(Browser.clientWidth, Browser.clientHeight, WebGL);

		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;

		Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
		Laya.stage.bgColor = "#232628";

		this.showApe();
	}

	showApe() {
		this.ape = new Laya.Sprite();
		Laya.stage.addChild(this.ape);
		this.ape.loadImage("res/apes/monkey2.png");
		this.ape.pivot(55, 72);
		// this.ape.pos( Laya.stage.width / 2, Laya.stage.height / 2);
		this.ape.x = Laya.stage.width / 2;
		this.ape.y = Laya.stage.height / 2;

		this.scaleDelta = 0;
		Laya.timer.frameLoop(1, this, this.animate);
	}

	animate() {
		this.ape.rotation += 2;

		//心跳缩放
		this.scaleDelta += 0.02;
		let scaleValue = Math.sin(this.scaleDelta);
		this.ape.scale(scaleValue, scaleValue);
	}
}

new Sprite_RoateAndScale();