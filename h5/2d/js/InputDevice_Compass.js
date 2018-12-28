let 
	compassImgPath = "res/inputDevice/kd.png",
	compassImg,
	degreesText,
	directionIndicator,
	firstTime = true;

class InputDevice_Compass {
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

		Laya.loader.load(compassImgPath, Handler.create(this, this.init));
	}

	init() {
		const 
			Gyroscope = Laya.Gyroscope,
			Event = Laya.Event;
		// 创建罗盘
		this.createCompass();
		// 创建方位指示器
		this.createDirectionIndicator();
		// // 画出其他UI
		this.drawUI();
		// // 创建显示角度的文本
		this.createDegreesText();
		
		Gyroscope.instance.on(Event.CHANGE, this, this.onOrientationChange);
	}

	// 方位指示器指向当前所朝方位
	createCompass() {
		const Sprite = Laya.Sprite;

		compassImg = new Sprite();
		Laya.stage.addChild(compassImg);
		compassImg.loadImage(compassImgPath);
		
		compassImg.pivot(compassImg.width / 2, compassImg.height / 2);
		compassImg.pos(Laya.stage.width / 2, 400);
	}

	createDirectionIndicator() {
		const Sprite = Laya.Sprite;

		directionIndicator = new Sprite();
		Laya.stage.addChild(directionIndicator);
		
		directionIndicator.alpha = 0.8;
		
		directionIndicator.graphics.drawCircle(0, 0, 70, "#343434");
		directionIndicator.graphics.drawLine(-40, 0, 40, 0, "#FFFFFF", 3);
		directionIndicator.graphics.drawLine(0, -40, 0, 40, "#FFFFFF", 3);
		
		directionIndicator.x = compassImg.x;
		directionIndicator.y = compassImg.y;
	}

	drawUI() {
		const Sprite = Laya.Sprite;

		let canvas = new Sprite();
		Laya.stage.addChild(canvas);
		
		canvas.graphics.drawLine(compassImg.x, 50, compassImg.x, 182, "#FFFFFF", 3);
		
		canvas.graphics.drawLine(-140 + compassImg.x, compassImg.y, 140 + compassImg.x, compassImg.y, "#AAAAAA", 1);
		canvas.graphics.drawLine(compassImg.x, -140 + compassImg.y, compassImg.x, 140 + compassImg.y, "#AAAAAA", 1);
	}

	createDegreesText() {
		const Text = Laya.Text;

		degreesText = new Text();
		Laya.stage.addChild(degreesText);
		
		degreesText.align = "center";
		degreesText.size(Laya.stage.width, 100);
		degreesText.pos(0, compassImg.y + 400);
		degreesText.fontSize = 100;
		degreesText.color = "#FFFFFF";
	}

	onOrientationChange(absolute, info) {
		const Browser = Laya.Browser;

		if (info.alpha === null) {
			alert("当前设备不支持陀螺仪。");
		} else if (firstTime && !absolute && !Browser.onIOS) {
			firstTime = false;
			alert("在当前设备中无法获取地球坐标系，使用设备坐标系，你可以继续观赏，但是提供的方位并非正确方位。");
		}
		
		// 更新角度显示
		degreesText.text = 360 - Math.floor(info.alpha) + "°";
		compassImg.rotation = info.alpha;
		
		// 更新方位指示器
		directionIndicator.x = -1 * Math.floor(info.gamma) / 90 * 70 + compassImg.x;
		directionIndicator.y = -1 * Math.floor(info.beta) / 90 * 70 + compassImg.y;
	}
}

new InputDevice_Compass();