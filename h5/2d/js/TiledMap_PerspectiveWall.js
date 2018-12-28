class TiledMap_PerspectiveWall {
	constructor() {
		const 
			Browser = Laya.Browser,
			WebGL = Laya.WebGL,
			Stage = Laya.Stage;

		// 不支持WebGL时自动切换至Canvas
		Laya.init(700, 500, WebGL);

		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;

		Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
		Laya.stage.bgColor = "#232628";

		this.createMap();
		Laya.stage.on(Laya.Event.CLICK, this, this.onStageClick);
	}

	createMap() {
		const 
			TiledMap = Laya.TiledMap,
			Rectangle = Laya.Rectangle;
		this.tiledMap = new TiledMap();
		this.tiledMap.createMap("res/tiledMap/perspective_walls.json", new Rectangle(0, 0, Laya.stage.width, Laya.stage.height), null);
	}
}

new TiledMap_PerspectiveWall();