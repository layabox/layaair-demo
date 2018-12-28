let skin = "res/ui/textarea.png";

class UI_Panel {
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
		Laya.loader.load(skin, Handler.create(this, this.setup));
	}

	setup() {
		const 
			Panel = Laya.Panel,
			Image = Laya.Image;

		let panel = new Panel();
		// panel.hScrollBarSkin = "";
		panel.hScrollBarSkin = "res/ui/hscroll.png";
		panel.hScrollBar.hide = true;
		panel.size(600, 275);
		panel.x = (Laya.stage.width - panel.width) / 2;
		panel.y = (Laya.stage.height - panel.height) / 2;
		Laya.stage.addChild(panel);

		let img;
		for (let i = 0; i < 4; i++) {
			img = new Image("res/ui/dialog (1).png");
			img.x = i * 250;
			panel.addChild(img);
		}
	}
}

new UI_Panel();