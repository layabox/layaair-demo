class Sound_SimpleDemo {
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
		this.setup();
	}

	setup() {
		const Event = Laya.Event;
		var gap = 10;

		//创建一个Sprite充当音效播放按钮
		let soundButton = this.createButton("播放音效");
		soundButton.x = (Laya.stage.width - soundButton.width * 2 + gap) / 2;
		soundButton.y = (Laya.stage.height - soundButton.height) / 2;

		//创建一个Sprite充当音乐播放按钮
		var musicButton = this.createButton("播放音乐");
		musicButton.x = soundButton.x + gap + soundButton.width;
		musicButton.y = soundButton.y;

		soundButton.on(Event.CLICK, this, this.onPlaySound);
		musicButton.on(Event.CLICK, this, this.onPlayMusic);
	}

	createButton(labelText) {
		let w = 110,
			h = 40;

		const Sprite = Laya.Sprite;
		let btn = new Sprite();
		Laya.stage.addChild(btn);
		btn.size(w, h);
		btn.graphics.drawRect(0, 0, w, h, "#FF7F50");
		btn.graphics.fillText(labelText, w / 2, 8, "24px SimHei", "#FFFFFF", "center");
		return btn;
	}

	// 播放音效
	onPlaySound() {
		console.log("播放音效");
		Laya.SoundManager.playMusic("res/sounds/btn.mp3", 1, new Laya.Handler(this, this.onComplete));
	}

	// 播放音乐
	onPlayMusic() {
		console.log("播放音乐");
		Laya.SoundManager.playSound("res/sounds/bgm.mp3", 1, new Laya.Handler(this, this.onComplete));
	}

	onComplete() {
		console.log("播放完成");
	}
}

new Sound_SimpleDemo();