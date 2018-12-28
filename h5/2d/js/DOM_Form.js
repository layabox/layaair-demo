class DOM_Form {
	constructor() {
		const 
			Browser = Laya.Browser,
			WebGL = Laya.WebGL,
			Stage = Laya.Stage,
			Stat = Laya.Stat,
			Handler = Laya.Handler;

		// 不支持WebGL时自动切换至Canvas
		Laya.init(600, 400, WebGL);

		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;

		Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
		Laya.stage.bgColor = "#fff";

		this.form = new Laya.Sprite();
		this.form.size(250,120);
		this.form.pos((Laya.stage.width - this.form.width) / 2, (Laya.stage.height - this.form.height) / 2);
		Laya.stage.addChild(this.form);

		this.rowHeight = 30;
		this.rowSpacing = 10;
		let rowHeightDelta = this.rowSpacing + this.rowHeight;

		// 显示左侧标签
		this.showLabel("邮箱", 0, rowHeightDelta * 0);
		this.showLabel("出生日期", 0, rowHeightDelta * 1);
		this.showLabel("密码", 0, rowHeightDelta * 2);

		// 显示右侧输入框
		let emailInput = this.createInputElement();
		let birthdayInput = this.createInputElement();
		let passwordInput = this.createInputElement();

		birthdayInput.type = "date";
		passwordInput.type = "password";

		Laya.stage.on(Laya.Event.RESIZE, this, this.fitDOMElements, [emailInput, birthdayInput, passwordInput]);
	}

	showLabel(label, x, y) {
		const Text = Laya.Text;

		let t = new Laya.Text();
		t.height = this.rowHeight;
		t.valign = "middle";
		t.fontSize = 15;
		t.font = "SimHei";
		t.text = label;
		t.pos(x, y);
		this.form.addChild(t);
	}
	createInputElement(){
		let input = Laya.Browser.createElement("input");
		input.style.zIndex = Laya.Render.canvas.zIndex + 1;
		input.style.width = "100px";
		Laya.Browser.document.body.appendChild(input);
		return input;
	}
	fitDOMElements(){
		for (let i = 0; i < arguments.length; i++) {
			let dom = arguments[i];
			Laya.Utils.fitDOMElementInArea(dom, this.form, 100, i * (this.rowSpacing + this.rowHeight), 150, this.rowHeight);
		}
	}
}

new DOM_Form();