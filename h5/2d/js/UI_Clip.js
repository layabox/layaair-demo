let buttonSkin = "res/ui/button-7.png",
	clipSkin = "res/ui/num0-9.png",
	bgSkin = "res/ui/coutDown.png",

	currFrame;

class UI_Clip {
	constructor() {
		const 
			Browser = Laya.Browser,
			WebGL = Laya.WebGL,
			Stage = Laya.Stage,
			Stat = Laya.Stat,
			Handler = Laya.Handler;

		// 不支持WebGL时自动切换至Canvas
		Laya.init(800, 600, WebGL);

		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;

		Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
		Laya.stage.bgColor = "#232628";

		Laya.loader.load([buttonSkin, clipSkin, bgSkin], Handler.create(this, this.onSkinLoaded));
	}

	onSkinLoaded() {
		this.showBg();
		this.createTimerAnimation();
		this.showTotalSeconds();
		this.createController();
	}

	showBg() {
		const Image = Laya.Image;

		let bg = new Image(bgSkin);
		bg.size(224, 302);
		bg.pos(Laya.stage.width - bg.width >> 1, Laya.stage.height - bg.height >> 1);
		Laya.stage.addChild(bg);
	}

	createTimerAnimation() {
		const Clip = Laya.Clip;

		this.counter = new Clip(clipSkin, 10, 1);
		Laya.stage.addChild(this.counter);

		this.counter.autoPlay = true;
		this.counter.interval = 1000;

		this.counter.x = (Laya.stage.width - this.counter.width) / 2 - 35;
		this.counter.y = (Laya.stage.height - this.counter.height) / 2 - 40;
	}

	showTotalSeconds() {
		const Clip = Laya.Clip;

		let clip = new Clip(clipSkin, 10, 1);
		clip.index = clip.clipX - 1;
		clip.pos(this.counter.x + 60, this.counter.y);
		Laya.stage.addChild(clip);
	}

	createController() {
		const Button = Laya.Button;

		this.controller = new Button(buttonSkin, "暂停");
		this.controller.labelBold = true;
		this.controller.labelColors = "#FFFFFF,#FFFFFF,#FFFFFF,#FFFFFF";
		this.controller.size(84, 30);

		this.controller.on('click', this, this.onClipSwitchState);

		this.controller.x = (Laya.stage.width - this.controller.width) / 2;
		this.controller.y = (Laya.stage.height - this.controller.height) / 2 + 110;
		Laya.stage.addChild(this.controller);
	}

	onClipSwitchState() {
		if (this.counter.isPlaying) {
			this.counter.stop();
			currFrame = this.counter.index;
			this.controller.label = "播放";
		} else {
			this.counter.play();
			this.counter.index = currFrame;
			this.controller.label = "暂停";
		}
	}
}

new UI_Clip();