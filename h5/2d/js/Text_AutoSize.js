class Text_AutoSize {
	constructor() {
		const 
			Browser = Laya.Browser,
			WebGL = Laya.WebGL,
			Stage = Laya.Stage,
			Stat = Laya.Stat;

		// 不支持WebGL时自动切换至Canvas
		Laya.init(550, 400, WebGL);

		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;

		Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
		Laya.stage.bgColor = "#232628";

		this.setup();
	}

	setup() {
		const Text = Laya.Text;

		// 该文本自动适应尺寸
		var autoSizeText = this.createSampleText();
		autoSizeText.overflow = Text.VISIBLE;
		autoSizeText.y = 50;

		// 该文本被限制了宽度
		var widthLimitText = this.createSampleText();
		widthLimitText.width = 100;
		widthLimitText.y = 180;

		//该文本被限制了高度 
		var heightLimitText = this.createSampleText();
		heightLimitText.height = 20;
		heightLimitText.y = 320;
	}

	createSampleText() {
		const Text = Laya.Text;

		let text = new Text();
		Laya.stage.addChild(text);
		text.overflow = Text.HIDDEN;

		text.color = "#FFFFFF";
		text.font = "Impact";
		text.fontSize = 20;
		text.borderColor = "#FFFF00";
		text.x = 80;

		text.text = "A POWERFUL HTML5 ENGINE ON FLASH TECHNICAL\n" + "A POWERFUL HTML5 ENGINE ON FLASH TECHNICAL\n" + "A POWERFUL HTML5 ENGINE ON FLASH TECHNICAL";

		return text;

	}
}

new Text_AutoSize();