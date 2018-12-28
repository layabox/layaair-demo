const ApePath = "res/apes/monkey2.png";
let dragRegion;

class Interaction_Drag {
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
		Laya.loader.load(ApePath, Handler.create(this, this.setup));
	}

	setup() {
		this.createApe();
		this.showDragRegion();
	}

	createApe() {
		const 
			Sprite = Laya.Sprite,
			Event = Laya.Event;

		this.ape = new Sprite();

		this.ape.loadImage(ApePath);
		Laya.stage.addChild(this.ape);

		let texture = Laya.loader.getRes(ApePath);
		this.ape.pivot(texture.width / 2, texture.height / 2);
		this.ape.x = Laya.stage.width / 2;
		this.ape.y = Laya.stage.height / 2;

		this.ape.on(Event.MOUSE_DOWN, this, this.onStartDrag);
	}

	showDragRegion() {
		const 
			Rectangle = Laya.Rectangle;
		
		//拖动限制区域
		let dragWidthLimit = 350;
		let dragHeightLimit = 200;
		dragRegion = new Rectangle(Laya.stage.width - dragWidthLimit >> 1, Laya.stage.height - dragHeightLimit >> 1, dragWidthLimit, dragHeightLimit);

		//画出拖动限制区域
		Laya.stage.graphics.drawRect(
			dragRegion.x, dragRegion.y, dragRegion.width, dragRegion.height,
			null, "#FFFFFF", 2);
	}

	onStartDrag(e) {
		//鼠标按下开始拖拽(设置了拖动区域和超界弹回的滑动效果)
		this.ape.startDrag(dragRegion, true, 100);
	}
}

new Interaction_Drag();