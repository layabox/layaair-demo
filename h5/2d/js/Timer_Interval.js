class Timer_Interval {
	constructor() {
		const 
			Browser = Laya.Browser,
			WebGL = Laya.WebGL,
			Stage = Laya.Stage,
			Stat = Laya.Stat,
			Handler = Laya.Handler;

		// 不支持WebGL时自动切换至Canvas
		Laya.init(Browser.width, Browser.height, WebGL);

		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;

		Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
		Laya.stage.bgColor = "#232628";

		Stat.show();
		this.setup();
	}

	setup() {
		let vGap = 100;

		this.rotateTimeBasedText = this.createText("基于时间旋转", Laya.stage.width / 2, (Laya.stage.height - vGap) / 2);
		this.rotateFrameRateBasedText = this.createText("基于帧频旋转", this.rotateTimeBasedText.x, this.rotateTimeBasedText.y + vGap);

		Laya.timer.loop(200, this, this.animateTimeBased);
		Laya.timer.frameLoop(2, this, this.animateFrameRateBased);
	}

	createText(text, x, y) {
		const Text = Laya.Text;
		
		let t = new Text();
		t.text = text;
		t.fontSize = 30;
		t.color = "white";
		t.bold = true;
		t.pivot(t.width / 2, t.height / 2);
		t.pos(x, y);
		Laya.stage.addChild(t);

		return t;
	}

	animateTimeBased() {
		this.rotateTimeBasedText.rotation += 1;
	}

	animateFrameRateBased() {
		this.rotateFrameRateBasedText.rotation += 1;
	}
}

new Timer_Interval();