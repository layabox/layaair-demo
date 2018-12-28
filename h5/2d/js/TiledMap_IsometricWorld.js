class TiledMap_IsometricWorld {
	constructor() {
		const 
			Browser = Laya.Browser,
			WebGL = Laya.WebGL,
			Stage = Laya.Stage;

		// 不支持WebGL时自动切换至Canvas
		Laya.init(1600, 800, WebGL);

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
			Rectangle = Laya.Rectangle,
			Point = Laya.Point;
		this.tiledMap = new TiledMap();
		this.tiledMap.createMap("res/tiledMap/isometric_grass_and_water.json", new Rectangle(0, 0, Laya.stage.width, Laya.stage.height), Laya.Handler.create(this, this.mapLoaded), null, new Point(1600, 800));
	}

	onStageClick() {
		let p = new Laya.Point(0, 0);
		// 通过屏幕坐标来获取选中格子的索引
		this.layer.getTilePositionByScreenPos(Laya.stage.mouseX, Laya.stage.mouseY, p);
		// 通过地图坐标得到屏幕坐标
		this.layer.getScreenPositionByTilePos(Math.floor(p.x), Math.floor(p.y), p);
		this.sprite.pos(p.x, p.y);
	}

	mapLoaded() {
		this.layer = this.tiledMap.getLayerByIndex(0);
		var radiusX = 32;
		var radiusY = Math.tan(180 / Math.PI * 30) * radiusX; // 14.37
		var color = "#FF7F50";

		this.sprite = new Laya.Sprite();
		this.sprite.graphics.drawLine(0, 0, -radiusX, radiusY, color);
		this.sprite.graphics.drawLine(0, 0, radiusX, radiusY, color);
		this.sprite.graphics.drawLine(-radiusX, radiusY, 0, radiusY * 2, color);
		this.sprite.graphics.drawLine(radiusX, radiusY, 0, radiusY * 2, color);
		Laya.stage.addChild(this.sprite);
	}
}

new TiledMap_IsometricWorld();