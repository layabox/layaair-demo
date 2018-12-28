let 
	mLastMouseX = 0,
	mLastMouseY = 0,
	mX,
	mY;

class TiledMap_ScrollMap {
	constructor() {
		const 
			Browser = Laya.Browser,
			WebGL = Laya.WebGL,
			Stage = Laya.Stage,
			Event = Laya.Event,
			Stat = Laya.Stat;

		// 不支持WebGL时自动切换至Canvas
		Laya.init(Browser.width, Browser.height, WebGL);

		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;

		Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
		Laya.stage.bgColor = "#232628";

		this.createMap();
		Laya.stage.on(Event.MOUSE_DOWN, this, this.mouseDown);
		Laya.stage.on(Event.MOUSE_UP, this, this.mouseUp);

		Stat.show();
	}

	// 创建地图
	createMap() {
		const 
			TiledMap = Laya.TiledMap,
			Rectangle = Laya.Rectangle,
			Handler = Laya.Handler,
			Browser = Laya.Browser;
		mX = mY = 0;
		// 创建地图对象
		this.tiledMap = new TiledMap();
		// 创建地图，适当的时候调用destory销毁地图
		this.tiledMap.createMap("res/tiledMap/desert.json", new Rectangle(0, 0, Browser.width, Browser.height), new Handler(this, this.completeHandler));
	}

	// 地图加载完成的回调
	completeHandler() {
		Laya.stage.on(Laya.Event.RESIZE, this.resize);
		this.resize();
	}

	// 鼠标按下拖动地图
	mouseDown() {
		mLastMouseX = Laya.stage.mouseX;
		mLastMouseY = Laya.stage.mouseY;
		Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
	}

	mouseMove() {
		let 
			moveX = mX - (Laya.stage.mouseX - mLastMouseX),
			moveY = mY - (Laya.stage.mouseY - mLastMouseY);
		// 移动地图视口
		this.tiledMap.moveViewPort(moveX, moveY);
	}

	mouseUp() {
		mX -= Laya.stage.mouseX - mLastMouseX;
		mY -= Laya.stage.mouseY - mLastMouseY;
		Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
	}

	// 窗口大小改变，把地图的视口区域重设下
	resize() {
		// 改变地图视口大小
		this.tiledMap.changeViewPort(mX, mY, Laya.Browser.width, Laya.Browser.height);
	}
}

new TiledMap_ScrollMap();