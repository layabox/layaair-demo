class Text_Restrict {
	constructor() {
		const 
			Browser = Laya.Browser,
			WebGL = Laya.WebGL,
			Stage = Laya.Stage,
			Stat = Laya.Stat;

		// 不支持WebGL时自动切换至Canvas
		Laya.init(550, 300, WebGL);

		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;

		Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
		Laya.stage.bgColor = "#232628";

		this.createTexts();
	}

	createTexts() {
		this.createLabel("只允许输入数字：").pos(50, 20);
		let input = this.createInput();
		input.pos(50, 50);
		input.restrict = "0-9";

		this.createLabel("只允许输入字母：").pos(50, 100);
		input = this.createInput();
		input.pos(50, 130);
		input.restrict = "a-zA-Z";

		this.createLabel("只允许输入中文字符：").pos(50, 180);
		input = this.createInput();
		input.pos(50, 210);
		input.restrict = "\u4e00-\u9fa5";
	}

	createLabel(text) {
		const Text = Laya.Text;

		let label = new Text();
		Laya.stage.addChild(label);
		label.text = text;
		label.color = "white";
		label.fontSize = 20;
		return label;
	}

	createInput() {
		const Input = Laya.Input;
		
		let input = new Input();
		Laya.stage.addChild(input);

		input.size(200, 30);
		input.borderColor = "#FFFF00";
		input.bold = true;
		input.fontSize = 20;
		input.color = "#FFFFFF";
		input.padding = [0, 4, 0, 4];

		
		return input;
	}
}

new Text_Restrict();