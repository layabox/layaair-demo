class Sprite_Cache {
	constructor() {
		const 
			Browser = Laya.Browser,
			WebGL = Laya.WebGL,
			Stage = Laya.Stage;

		// 不支持WebGL时自动切换至Canvas
		Laya.init(Browser.clientWidth, Browser.clientHeight, WebGL);

		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;

		Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
		Laya.stage.bgColor = "#232628";

		Laya.Stat.show();
		this.cacheText();
	}

	cacheText() {
		const 
			Sprite = Laya.Sprite,
			Text = Laya.Text;
		
		let textBox = new Sprite();
		Laya.stage.addChild(textBox);
		// 随机摆放文本
		let text;
		for (let i = 0; i < 1000; i++) {
			text = new Text();
			textBox.addChild(text);
			text.fontSize = 20;
			text.text = (Math.random() * 100).toFixed(0);
			text.rotation = Math.random() * 360;
			text.color = "#ccc";

			text.x = Math.random() * Laya.stage.width;
			text.y = Math.random() * Laya.stage.height;
		}
		
		//缓存为静态图像
		textBox.cacheAs = "bitmap";
	}
}

new Sprite_Cache();