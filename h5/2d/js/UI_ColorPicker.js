let skin = "res/ui/colorPicker.png";

class UI_ColorPicker {
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

		Laya.loader.load(skin, Handler.create(this, this.onColorPickerSkinLoaded));
	}

	onColorPickerSkinLoaded() {
		const 
			ColorPicker = Laya.ColorPicker,
			Handler = Laya.Handler;

		let colorPicker = new ColorPicker();
		colorPicker.selectedColor = "#ff0033";
		colorPicker.skin = skin;
		
		colorPicker.pos(100, 100);
		colorPicker.changeHandler = new Handler(this, this.onChangeColor, [colorPicker]);
		Laya.stage.addChild(colorPicker);
		
		this.onChangeColor(colorPicker);
	}

	onChangeColor(colorPicker) {
		console.log(colorPicker.selectedColor);
	}
}

new UI_ColorPicker();