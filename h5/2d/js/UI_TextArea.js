let skin = "res/ui/textarea.png";

class UI_TextArea {
	constructor() {
		const 
			Browser = Laya.Browser,
			WebGL = Laya.WebGL,
			Stage = Laya.Stage,
			Stat = Laya.Stat,
			Handler = Laya.Handler;

		// 不支持WebGL时自动切换至Canvas
		Laya.init(550, 400, WebGL);

		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;

		Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
		Laya.stage.bgColor = "#232628";

		Stat.show();
		Laya.loader.load(skin, Handler.create(this, this.onLoadComplete));
	}

	onLoadComplete() {
		const 
			TextArea = Laya.TextArea;

		let ta = new TextArea("");
        ta.skin = skin;

        ta.font = "Arial";
        ta.fontSize = 18;
        ta.bold = true;

        ta.color = "#3d3d3d";

        ta.pos(100, 15);
        ta.size(375, 355);

        ta.padding = "70,8,8,8";

        Laya.stage.addChild(ta);
	}
}

new UI_TextArea();