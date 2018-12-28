let 
	SPACING = 100,
	INPUT_WIDTH = 300,
	INPUT_HEIGHT = 50,
	Y_OFFSET = 50,
	skins;

class UI_Input {
	constructor() {
		const 
			Browser = Laya.Browser,
			WebGL = Laya.WebGL,
			Stage = Laya.Stage,
			Stat = Laya.Stat,
			Handler = Laya.Handler;

		// 不支持WebGL时自动切换至Canvas
		Laya.init(800, 600, WebGL);

		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;

		Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
		Laya.stage.bgColor = "#232628";

		Stat.show();
		skins = ["res/ui/input (1).png", "res/ui/input (2).png", "res/ui/input (3).png", "res/ui/input (4).png"]
		Laya.loader.load(skins, Handler.create(this, this.onLoadComplete));
	}

	onLoadComplete() {
		for (let i = 0, len = skins.length; i < len; ++i) {
			var input = this.createInput(skins[i]);
			input.prompt = 'Type:';
			input.x = (Laya.stage.width - input.width) / 2;
			input.y = i * SPACING + Y_OFFSET;
		}
	}

	createInput(skin) {
		const TextInput = Laya.TextInput;

		var ti = new TextInput();

		ti.skin = skin;
		ti.size(300, 50);
		ti.sizeGrid = "0,40,0,40";
		ti.font = "Arial";
		ti.fontSize = 30;
		ti.bold = true;
		ti.color = "#606368";

		Laya.stage.addChild(ti);

		return ti;
	}
}

new UI_Input();