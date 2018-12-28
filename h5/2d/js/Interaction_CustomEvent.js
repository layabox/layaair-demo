const ROTATE = "rotate";

class Interaction_CustomEvent {
	constructor() {
		const 
			Browser = Laya.Browser,
			WebGL = Laya.WebGL,
			Stage = Laya.Stage,
			Stat = Laya.Stat,
			Handler = Laya.Handler;

		// 不支持WebGL时自动切换至Canvas
		Laya.init(Browser.clientWidth, Browser.clientHeight, WebGL);

		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;

		Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
		Laya.stage.bgColor = "#232628";

		Stat.show();
		this.setup();
	}

	setup() {
		this.createSprite();
	}

	createSprite() {
		const 
			Sprite = Laya.Sprite,
			Event = Laya.Event;

		this.sp = new Sprite();
		this.sp.graphics.drawRect(0, 0, 200, 200, "#D2691E");
		this.sp.pivot(100, 100);

		this.sp.x = Laya.stage.width / 2;
		this.sp.y = Laya.stage.height / 2;

		this.sp.size(200, 200);
		Laya.stage.addChild(this.sp);

		this.sp.on(ROTATE, this, this.onRotate); // 侦听自定义的事件
		this.sp.on(Event.CLICK, this, this.onSpriteClick);
	}

	onSpriteClick(e) {
		let randomAngle = Math.random() * 180;
		//发送自定义事件
		this.sp.event(ROTATE, [randomAngle]);
	}

	// 触发自定义的rotate事件
	onRotate(newAngle) {
		const 
			Tween = Laya.Tween,
			Ease = Laya.Ease;

		Tween.to(this.sp, {
			"rotation": newAngle
		}, 1000, Ease.elasticOut);
	}
}

new Interaction_CustomEvent();