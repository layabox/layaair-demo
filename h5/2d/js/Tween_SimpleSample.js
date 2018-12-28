class Tween_SimpleSample {
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
			Sprite = Laya.Sprite,
			Tween = Laya.Tween;

		let terminalX = 200;
		
		let characterA = this.createCharacter("res/cartoonCharacters/1.png");
		characterA.pivot(46.5, 50);
		characterA.y = 100;

		let characterB = this.createCharacter("res/cartoonCharacters/2.png");
		characterB.pivot(34, 50);
		characterB.y = 250;

		Laya.stage.graphics.drawLine(terminalX, 0, terminalX, Laya.stage.height, "#FFFFFF");
		
		// characterA使用Tween.to缓动
		Tween.to(characterA, { x : terminalX }, 1000);
		// characterB使用Tween.from缓动
		characterB.x = terminalX;
		Tween.from(characterB, { x:0 }, 1000);
	}

	createCharacter(skin) {
		const Sprite = Laya.Sprite;

		let character = new Sprite();
		character.loadImage(skin);
		Laya.stage.addChild(character);

		return character;
	}
}

new Tween_SimpleSample();