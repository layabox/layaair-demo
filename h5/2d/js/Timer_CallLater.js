class Timer_CallLater {
	constructor() {
		const 
			Browser = Laya.Browser,
			WebGL = Laya.WebGL,
			Stage = Laya.Stage,
			Stat = Laya.Stat,
			Handler = Laya.Handler;

		// 不支持WebGL时自动切换至Canvas
		Laya.init(550, 400, WebGL);

		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;

		Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
		Laya.stage.bgColor = "#232628";

		Stat.show();
		this.demonstrate();
	}

	demonstrate() {
		for (let i = 0; i < 10; i++) {
			Laya.timer.callLater(this, this.onCallLater);
		}
	}

	onCallLater() {
		const Text = Laya.Text;

		console.log("onCallLater triggered");

		let text = new Text();
		text.font = "SimHei";
		text.fontSize = 30;
		text.color = "#FFFFFF";
		text.text = "打开控制台可见该函数仅触发了一次";
		text.size(Laya.stage.width, Laya.stage.height);
		text.wordWrap = true;
		text.valign = "middle";
		text.align = "center";
		Laya.stage.addChild(text);
	}

}

new Timer_CallLater();