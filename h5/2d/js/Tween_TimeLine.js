class Tween_TimeLine {
	constructor() {
		const 
			Browser = Laya.Browser,
			WebGL = Laya.WebGL,
			Stage = Laya.Stage,
			Stat = Laya.Stat,
			Handler = Laya.Handler;

		// 不支持WebGL时自动切换至Canvas
		Laya.init(550, 400, WebGL);

		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;

		Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
		Laya.stage.bgColor = "#232628";

		Stat.show();
		this.setup();
	}

	setup() {
		const Event = Laya.Event;

		this.createApe();
		this.createTimerLine();
		Laya.stage.on(Event.KEY_DOWN, this, this.keyDown);
	}

	createApe() {
		const Sprite = Laya.Sprite;

		this.target = new Sprite();
		Laya.stage.addChild(this.target);

		this.target.loadImage("res/apes/monkey2.png");
		this.target.pivot(55, 72);
		this.target.pos(100,100);
	}
	
	createTimerLine() {
		const 
			TimeLine = Laya.TimeLine,
			Event = Laya.Event;

		this.timeLine = new TimeLine();
		// addLabel(label:String, offset:Number) offset: 标签事件相对于上个动画的偏移时间(单位：毫秒)
		this.timeLine.addLabel("turnRight", 0).to(this.target, {x:450, y:100, scaleX:0.5, scaleY:0.5}, 2000, null, 0)
			.addLabel("turnDown", 0).to(this.target, {x:450, y:300, scaleX:0.2, scaleY:1, alpha:1}, 2000, null, 0)
			.addLabel("turnLeft", 0).to(this.target, {x:100, y:300, scaleX:1, scaleY:0.2, alpha:0.1}, 2000, null, 0)
			.addLabel("turnUp", 0).to(this.target, {x:100, y:100, scaleX:1, scaleY:1, alpha:1}, 2000, null, 0);
		this.timeLine.play(0, true);
		this.timeLine.on(Event.COMPLETE, this, this.onComplete);
		this.timeLine.on(Event.LABEL, this, this.onLabel);
	}

	onComplete() {
		console.log("timeLine complete!!!!");
	}
	
	onLabel(label) {
		console.log("LabelName:" + label);
	}

	keyDown(e) {
		const Keyboard = Laya.Keyboard;

		switch(e.keyCode) {
			case Keyboard.LEFT:
				this.timeLine.play("turnLeft");
				break;
			case Keyboard.RIGHT:
				this.timeLine.play("turnRight");
				break;
			case Keyboard.UP:
				this.timeLine.play("turnUp");
				break;
			case Keyboard.DOWN:
				this.timeLine.play("turnDown");
				break;
			case Keyboard.P:
				this.timeLine.pause();
				break;
			case Keyboard.R:
				this.timeLine.resume();
				break;
		}
	}
}

new Tween_TimeLine();