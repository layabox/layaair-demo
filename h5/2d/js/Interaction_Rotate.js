let preRadian = 0;

class Interaction_Rotate {
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

		Laya.stage.on(Event.MOUSE_UP, this, this.onMouseUp);
		Laya.stage.on(Event.MOUSE_OUT, this, this.onMouseUp);
	}

	createSprite() {
		const 
			Sprite = Laya.Sprite,
			Event = Laya.Event;
		
		let w = 200,
			h = 300;

		this.sp = new Sprite();
		Laya.stage.addChild(this.sp);
		this.sp.graphics.drawRect(0, 0, w, h, "#FF7F50");
		this.sp.size(w, h);
		this.sp.pivot(w / 2, h / 2);
		this.sp.pos(Laya.stage.width / 2, Laya.stage.height / 2);
		
		this.sp.on(Event.MOUSE_DOWN, this, this.onMouseDown);
	}

	onMouseDown(e) {
		const Event = Laya.Event;

		// 手机上才有 touches 属性
		let touches = e.touches;

		if (touches && touches.length == 2) {
			preRadian = Math.atan2(
				touches[0].stageY - touches[1].stageY,
				touches[0].stageX - touches[1].stageX);

			Laya.stage.on(Event.MOUSE_MOVE, this, this.onMouseMove);
		}
	}

	onMouseMove(e) {
		let touches = e.touches;
		if (touches && touches.length == 2) {
			let nowRadian = Math.atan2(
				touches[0].stageY - touches[1].stageY,
				touches[0].stageX - touches[1].stageX);

			this.sp.rotation += 180 / Math.PI * (nowRadian - preRadian);

			preRadian = nowRadian;
		}
	}

	onMouseUp(e) {
		const Event = Laya.Event;

		Laya.stage.off(Event.MOUSE_MOVE, this, this.onMouseMove);
	}
}

new Interaction_Rotate();