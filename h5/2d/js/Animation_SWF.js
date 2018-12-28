class Animation_SWF {
	constructor() {
		const 
			Browser = Laya.Browser,
			WebGL = Laya.WebGL,
			Stage = Laya.Stage;

		// 不支持WebGL时自动切换至Canvas
		Laya.init(Browser.width, Browser.height, WebGL);

		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;

		Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
		Laya.stage.bgColor = "#232628";

		this.createMovieClip();
	}

	createMovieClip() {
		const MovieClip = Laya.MovieClip;
		const SWFPath = "res/swf/dragon.swf";
		let MCWidth = 318,
			MCHeight = 406;

		let mc = new MovieClip();
		Laya.stage.addChild(mc);
		mc.x = (Laya.stage.width - MCWidth) / 2;
		mc.y = (Laya.stage.height - MCHeight) / 2;
		mc.load(SWFPath);
	}
	
}

new Animation_SWF();