let logger, keyDownList;

class Interaction_Keyboard {
	constructor() {
		const 
			Browser = Laya.Browser,
			WebGL = Laya.WebGL,
			Stage = Laya.Stage,
			Stat = Laya.Stat,
			Handler = Laya.Handler;

		// 不支持WebGL时自动切换至Canvas
		Laya.init(Browser.clientWidth, Browser.clientHeight, WebGL);

		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;

		Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
		Laya.stage.bgColor = "#232628";

		Stat.show();
		this.setup();
	}

	setup() {
		this.listenKeyboard();
		this.createLogger();

		Laya.timer.frameLoop(1, this, this.keyboardInspector);
	}

	listenKeyboard() {
		const Event = Laya.Event;

		// 用Set实现更好一些
		keyDownList = [];

		// 添加键盘按下事件,一直按着某按键则会不断触发
		Laya.stage.on(Event.KEY_DOWN, this, this.onKeyDown);
		// 添加键盘抬起事件
		Laya.stage.on(Event.KEY_UP, this, this.onKeyUp);
	}

	/** 键盘按下处理 */
	onKeyDown(e) {
		keyDownList[e["keyCode"]] = true;
	}

	/** 键盘抬起处理 */
	onKeyUp(e) {
		delete keyDownList[e["keyCode"]];
	}

	/** 添加提示文本 */
	createLogger() {
		const Text = Laya.Text;

		logger = new Text();

		logger.size(Laya.stage.width, Laya.stage.height);
		logger.fontSize = 30;
		logger.font = "SimHei";
		logger.wordWrap = true;
		logger.color = "#FFFFFF";
		logger.align = 'center';
		logger.valign = 'middle';

		Laya.stage.addChild(logger);
	}

	keyboardInspector() {
		let numKeyDown = keyDownList.length;

		let newText = '[ ';
		console.log(numKeyDown);
		for (let i = 0; i < numKeyDown; i++) {
			if (keyDownList[i]) {
				newText += i + " ";
			}
		}
		newText += ']';

		logger.changeText(newText);
	}
}

new Interaction_Keyboard();