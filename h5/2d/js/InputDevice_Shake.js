let 
	picW = 824,
	picH = 484,
	console,

	shakeCount = 0;

class InputDevice_Shake {
	constructor() {
		const 
			Browser = Laya.Browser,
			WebGL = Laya.WebGL,
			Stage = Laya.Stage,
			Stat = Laya.Stat,
			Handler = Laya.Handler;

		// 不支持WebGL时自动切换至Canvas
		Laya.init(700, 1024, WebGL);

		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;

		Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
		Laya.stage.bgColor = "#232628";

		this.showShakePic();
		this.showConsoleText();
		this.startShake();
	}

	showShakePic() {
		const Sprite = Laya.Sprite;

		let shakePic = new Sprite();
		shakePic.loadImage("res/inputDevice/shake.png");
		Laya.stage.addChild(shakePic);
	}
	showConsoleText() {
		const Text = Laya.Text;

		console = new Text();
		Laya.stage.addChild(console);
		
		console.y = picH + 10;
		console.width = Laya.stage.width;
		console.height = Laya.stage.height - console.y;
		console.color = "#FFFFFF";
		console.fontSize = 50;
		console.align = "center";
		console.valign = 'middle';
		console.leading = 10;
	}
	
	startShake() {
		const Shake = Laya.Shake;

		Shake.instance.start(5, 500);
		Shake.instance.on(Laya.Event.CHANGE, this, this.onShake);
		console.text = '开始接收设备摇动\n';
	}
	
	onShake() {
		const Shake = Laya.Shake;

		shakeCount++;
		
		console.text += "设备摇晃了" + shakeCount + "次\n";
		
		if (shakeCount >= 3) {
			Shake.instance.stop();
			
			console.text += "停止接收设备摇动";
		}
	}
}

new InputDevice_Shake();