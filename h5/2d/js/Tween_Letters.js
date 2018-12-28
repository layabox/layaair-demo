class Tween_Letters {
	constructor() {
		const 
			Browser = Laya.Browser,
			WebGL = Laya.WebGL,
			Stage = Laya.Stage,
			Stat = Laya.Stat,
			Handler = Laya.Handler;

		// 不支持WebGL时自动切换至Canvas
		Laya.init(Browser.width, Browser.height, WebGL);

		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;

		Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
		Laya.stage.bgColor = "#232628";

		Stat.show();
		this.setup();
	}

	setup() {
		const 
			Text = Laya.Text,
			Tween = Laya.Tween,
			Ease = Laya.Ease;

		let w = 400;
		let offset = Laya.stage.width - w >> 1;
		let endY = Laya.stage.height / 2 - 50;
		let demoString = "LayaBox";

		for (let i = 0, len = demoString.length; i < len; ++i) {
			let letterText = this.createLetter(demoString.charAt(i));
			letterText.x = w / len * i + offset;

			Tween.to(letterText, {
				y: endY
			}, 1000, Ease.elasticOut, null, i * 1000);
		}
	}

	createLetter(char) {
		const Text = Laya.Text;

		let letter = new Text();
		letter.text = char;
		letter.color = "#FFFFFF";
		letter.font = "Impact";
		letter.fontSize = 110;
		Laya.stage.addChild(letter);

		return letter;
	}
}

new Tween_Letters();