class Sprite_Pivot {
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

		this.createApes();
	}

	createApes() {
		const Sprite = Laya.Sprite;
		let monkey2Path = "res/apes/monkey2.png";
		let gap = 150;

		this.ape1 = new Sprite();
		Laya.stage.addChild(this.ape1);
		this.ape1.loadImage(monkey2Path);
		// 设置轴心点为中心
		this.ape1.pivot(55, 72);
		this.ape1.pos(Laya.stage.width / 2 - gap, Laya.stage.height / 2);

		// 不设置轴心点默认为左上角
		this.ape2 = new Sprite();
		Laya.stage.addChild(this.ape2);
		this.ape2.loadImage(monkey2Path);
		this.ape2.pos(Laya.stage.width / 2 + gap, Laya.stage.height / 2);
		
		Laya.timer.frameLoop(1, this, this.animate);
	}

	animate() {
		this.ape1.rotation += 2;
		this.ape2.rotation += 2;
	}
}

new Sprite_Pivot();