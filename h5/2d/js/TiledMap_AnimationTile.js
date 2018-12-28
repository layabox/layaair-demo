class TiledMap_AnimationTile {
	constructor() {
		const 
			Browser = Laya.Browser,
			WebGL = Laya.WebGL,
			Stage = Laya.Stage;

		// 不支持WebGL时自动切换至Canvas
		Laya.init(1100, 800, WebGL);

		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;

		Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
		Laya.stage.bgColor = "#232628";

		this.createMap();
	}

	createMap() {
		const TiledMap = Laya.TiledMap;
		let tiledMap = new TiledMap();
		tiledMap.createMap("res/tiledMap/orthogonal-test-movelayer.json", new Laya.Rectangle(0, 0, Laya.stage.width, Laya.stage.height), null);
	}
}

new TiledMap_AnimationTile();