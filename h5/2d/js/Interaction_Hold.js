const 
	HOLD_TRIGGER_TIME = 1000,
	apePath = "res/apes/monkey2.png";
let isApeHold = false;

class Interaction_Hold {
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
		Laya.loader.load(apePath, Handler.create(this, this.createApe));
	}

	createApe() {
		const 
			Sprite = Laya.Sprite,
			Event = Laya.Event;

		this.ape = new Sprite();
		this.ape.loadImage(apePath);

		let texture = Laya.loader.getRes(apePath);
		this.ape.pivot(texture.width / 2, texture.height / 2);
		this.ape.pos(Laya.stage.width / 2, Laya.stage.height / 2);
		this.ape.scale(0.8, 0.8);
		Laya.stage.addChild(this.ape);

		// 鼠标交互
		this.ape.on(Event.MOUSE_DOWN, this, this.onApePress);
	}

	onApePress(e) {
		const Event = Laya.Event;

		// 鼠标按下后，HOLD_TRIGGER_TIME毫秒后hold
		Laya.timer.once(HOLD_TRIGGER_TIME, this, this.onHold);
		Laya.stage.on(Event.MOUSE_UP, this, this.onApeRelease);
	}

	onHold() {
		const 
			Tween = Laya.Tween,
			Ease = Laya.Ease;
		
		Tween.to(this.ape, {
			"scaleX": 1,
			"scaleY": 1
		}, 500, Ease.bounceOut);
		isApeHold = true;
	}

	/** 鼠标放开后停止hold */
	onApeRelease() {
		const 
			Tween = Laya.Tween,
			Event = Laya.Event;
		// 鼠标放开时，如果正在hold，则播放放开的效果
		if (isApeHold) {
			isApeHold = false;
			Tween.to(this.ape, {
				"scaleX": 0.8,
				"scaleY": 0.8
			}, 300);
		} else { // 如果未触发hold，终止触发hold
			Laya.timer.clear(this, this.onHold);
		}

		Laya.stage.off(Event.MOUSE_UP, this, this.onApeRelease);
	}
}

new Interaction_Hold();