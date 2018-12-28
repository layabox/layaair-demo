let fontName = "diyFont";

class Text_BitmapFont {
	constructor() {
		const 
			Browser = Laya.Browser,
			WebGL = Laya.WebGL,
			Stage = Laya.Stage,
			Stat = Laya.Stat;

		// 不支持WebGL时自动切换至Canvas
		Laya.init(Browser.width, Browser.height, WebGL);

		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;

		Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
		Laya.stage.bgColor = "#232628";

		this.loadFont();
	}

	loadFont() {
		const 
			BitmapFont = Laya.BitmapFont,
			Handler = Laya.Handler;

		this.bitmapFont = new BitmapFont();
		this.bitmapFont.loadFont("res/bitmapFont/test.fnt", new Handler(this, this.onFontLoaded, [this.bitmapFont]));
	}

	onFontLoaded() {
		// 设置空格的宽
		this.bitmapFont.setSpaceWidth(10);
		 // 注册位图字体
		Laya.Text.registerBitmapFont(fontName, this.bitmapFont);

		this.createText(fontName);
	}

	createText(font) {
		let txt = new Laya.Text();
		Laya.stage.addChild(txt);
		txt.width = 250;
		txt.wordWrap = true;
		txt.text = "Do one thing at a time, and do well.";
		txt.font = font; // 文本的字体名称，以字符串形式表示
		txt.leading = 5; // 垂直行间距
		txt.pos(Laya.stage.width - txt.width >> 1, Laya.stage.height - txt.height >> 1);
	}
}

new Text_BitmapFont();