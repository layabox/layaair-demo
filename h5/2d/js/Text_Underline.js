class Text_Underline {
	constructor() {
		const 
			Browser = Laya.Browser,
			WebGL = Laya.WebGL,
			Stage = Laya.Stage,
			Stat = Laya.Stat;

		// 不支持WebGL时自动切换至Canvas
		Laya.init(600, 400, WebGL);

		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;

		Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
		Laya.stage.bgColor = "#232628";

		this.createTexts();
	}

	createTexts() {
		this.createText('left', null, 100, 10);
		this.createText('center', "#00BFFF", 155, 150);
		this.createText('right', "#FF7F50", 210, 290);
	}

	createText(align, underlineColor, x, y) {
		const Text = Laya.Text;

		let txt = new Text();
		Laya.stage.addChild(txt);

		txt.text = "Layabox\n是HTML5引擎技术提供商\n与优秀的游戏发行商\n面向AS/JS/TS开发者提供HTML5开发技术方案";

		txt.size(300, 50);
		txt.fontSize = 20;
		txt.color = "#ffffff";
		txt.align = align;

		// 设置下划线
		txt.underline = true;
		txt.underlineColor = underlineColor;

		txt.pos(x, y);

		return txt;
	}
}

new Text_Underline();