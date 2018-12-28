let DIALOG_WIDTH = 220,
	DIALOG_HEIGHT = 275,
	CLOSE_BTN_WIDTH = 43,
	CLOSE_BTN_PADDING = 5,

	assets = ["res/ui/dialog (1).png", "res/ui/close.png"];

class UI_Dialog {
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

		Laya.loader.load(assets, Handler.create(this, this.onSkinLoadComplete));
	}

	onSkinLoadComplete() {
		const 
			Dialog = Laya.Dialog,
			Image = Laya.Image,
			Button = Laya.Button;

		let dialog = new Dialog();  

		let bg = new Image(assets[0]);
		dialog.addChild(bg);

		let button = new Button(assets[1]);
		button.name = Dialog.CLOSE;
		button.pos(DIALOG_WIDTH - CLOSE_BTN_WIDTH - CLOSE_BTN_PADDING, CLOSE_BTN_PADDING);
		dialog.addChild(button);

		dialog.dragArea = "0,0," + DIALOG_WIDTH + "," + DIALOG_HEIGHT;
		dialog.show();
	}
}

new UI_Dialog();