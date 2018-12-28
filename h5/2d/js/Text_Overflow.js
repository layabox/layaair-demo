class Text_Overflow {
	constructor() {
		const 
			Browser = Laya.Browser,
			WebGL = Laya.WebGL,
			Stage = Laya.Stage,
			Stat = Laya.Stat;

		// 不支持WebGL时自动切换至Canvas
		Laya.init(600, 300, WebGL);

		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;

		Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
		Laya.stage.bgColor = "#232628";

		this.createInput();
	}

	createInput() {
		const Text = Laya.Text;

		let t1 = this.createText();
		t1.overflow = Text.VISIBLE;
		t1.pos(10, 10);

		let t2 = this.createText();
		t2.overflow = Text.SCROLL;
		t2.pos(10, 110);

		let t3 = this.createText();
		t3.overflow = Text.HIDDEN;
		t3.pos(10, 210);
	}

	createText() {
		const Text = Laya.Text;

		let txt = new Text();

		txt.text =
			"Layabox是HTML5引擎技术提供商与优秀的游戏发行商，面向AS/JS/TS开发者提供HTML5开发技术方案！\n" +
			"Layabox是HTML5引擎技术提供商与优秀的游戏发行商，面向AS/JS/TS开发者提供HTML5开发技术方案！\n" +
			"Layabox是HTML5引擎技术提供商与优秀的游戏发行商，面向AS/JS/TS开发者提供HTML5开发技术方案！";

		txt.borderColor = "#FFFF00";

		txt.size(300, 50);
		txt.fontSize = 20;
		txt.color = "#ffffff";

		Laya.stage.addChild(txt);

		return txt;
	}
}

new Text_Overflow();