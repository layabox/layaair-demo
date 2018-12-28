class Text_InputMultiline {
	constructor() {
		const 
			Browser = Laya.Browser,
			WebGL = Laya.WebGL,
			Stage = Laya.Stage,
			Stat = Laya.Stat;

		// 不支持WebGL时自动切换至Canvas
		Laya.init(Browser.clientWidth, Browser.clientHeight, WebGL);

		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;

		Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
		Laya.stage.bgColor = "#232628";

		this.createInput();
	}

	createInput() {
		const Input = Laya.Input;

		let inputText = new Input();
		Laya.stage.addChild(inputText);

		//多行输入
		inputText.multiline = true;
		inputText.wordWrap = true;
			
		inputText.size(350, 100);
		inputText.x = Laya.stage.width - inputText.width >> 1;
		inputText.y = Laya.stage.height - inputText.height >> 1;
		inputText.padding = [2,2,2,2];
		
		// 移动端输入提示符
		inputText.prompt = "Type some word...";
		
		// 设置字体样式
		inputText.bgColor = "#666666";
		inputText.color = "#ffffff";
		inputText.fontSize = 20;
	}
}

new Text_InputMultiline();