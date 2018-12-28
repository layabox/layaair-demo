let lastDistance = 0;

class Interaction_Scale {
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
		const Event = Laya.Event;

		this.createSprite();

		Laya.stage.on(Event.MOUSE_UP, this, this.onMouseUp);
		Laya.stage.on(Event.MOUSE_OUT, this, this.onMouseUp);
	}

	createSprite() {
		const 
			Sprite = Laya.Sprite,
			Event = Laya.Event;
		
		let w = 300,
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
			lastDistance = this.getDistance(touches);

			Laya.stage.on(Event.MOUSE_MOVE, this, this.onMouseMove);
		}
	}

	onMouseMove(e) {
		let distance = this.getDistance(e.touches);

		//判断当前距离与上次距离变化，确定是放大还是缩小
		const factor = 0.01;
		this.sp.scaleX += (distance - lastDistance) * factor;
		this.sp.scaleY += (distance - lastDistance) * factor;

		lastDistance = distance;
	}

	onMouseUp(e) {
		const Event = Laya.Event;

		Laya.stage.off(Event.MOUSE_MOVE, this, this.onMouseMove);
	}

	/**计算两个触摸点之间的距离*/
	getDistance(points) {
		let distance = 0;
		if (points && points.length == 2) {
			let dx = points[0].stageX - points[1].stageX;
			let dy = points[0].stageY - points[1].stageY;

			distance = Math.sqrt(dx * dx + dy * dy);
		}
		return distance;
	}
}

new Interaction_Scale();