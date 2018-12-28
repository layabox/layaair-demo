//swipe滚动范围
let TrackLength = 200;
//触发swipe的拖动距离
let TOGGLE_DIST = TrackLength / 2;

let buttonPosition, beginPosition, endPosition;
let button;

class Interaction_Swipe {
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
		this.drawTrack();
	}

	createSprite() {
		const 
			Sprite = Laya.Sprite,
			Event = Laya.Event;

		const w = 50;
		const h = 30;

		this.button = new Sprite();
		this.button.graphics.drawRect(0, 0, w, h, "#FF7F50");
		this.button.pivot(w / 2, h / 2);
		//设置宽高（要接收鼠标事件必须设置宽高，否则不会被命中）  
		this.button.size(w, h);
		this.button.x = (Laya.stage.width - TrackLength) / 2;
		this.button.y = Laya.stage.height / 2;

		this.button.on(Event.MOUSE_DOWN, this, this.onMouseDown);

		Laya.stage.addChild(this.button);
		//左侧临界点设为圆形初始位置
		beginPosition = this.button.x;
		//右侧临界点设置
		endPosition = beginPosition + TrackLength;
	}

	drawTrack() {
		Laya.stage.graphics.drawLine(
			beginPosition, Laya.stage.height / 2,
			endPosition, Laya.stage.height / 2,
			"#FFFFFF", 20);
	}

	/**按下事件处理*/
	onMouseDown(e) {
		const Event = Laya.Event;

		//添加鼠标移到侦听
		Laya.stage.on(Event.MOUSE_MOVE, this, this.onMouseMove);
		buttonPosition = this.button.x;

		Laya.stage.on(Event.MOUSE_UP, this, this.onMouseUp);
		Laya.stage.on(Event.MOUSE_OUT, this, this.onMouseUp);
	}
	/**移到事件处理*/
	onMouseMove(e) {
		this.button.x = Math.max(Math.min(Laya.stage.mouseX, endPosition), beginPosition);
	}


	/**抬起事件处理*/
	onMouseUp(e) {
		const 
			Event = Laya.Event,
			Tween = Laya.Tween;

		Laya.stage.off(Event.MOUSE_MOVE, this, this.onMouseMove);
		Laya.stage.off(Event.MOUSE_UP, this, this.onMouseUp);
		Laya.stage.off(Event.MOUSE_OUT, this, this.onMouseUp);

		// 滑动到目的地
		let dist = Laya.stage.mouseX - buttonPosition;

		let targetX = beginPosition;
		if (dist > TOGGLE_DIST) {
			targetX = endPosition;
		}
		Tween.to(this.button, {
			x: targetX
		}, 100);
	}
}

new Interaction_Swipe();