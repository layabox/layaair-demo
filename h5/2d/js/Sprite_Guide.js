let guideSteps = 
	[
		{ x: 151, y: 575, radius:150, tip:"res/guide/help6.png", tipx:200, tipy:250 },
		{ x: 883, y: 620, radius:100, tip:"res/guide/help4.png", tipx:730, tipy:380 },
		{ x: 1128, y: 583, radius:110, tip:"res/guide/help3.png", tipx:900, tipy:300 }
	],
	gameContainer,
	guideContainer,
	maskArea,
	interactionArea,
	hitArea,
	tipContainer,
	guideStep = 0;

class Sprite_Guide {
	constructor() {
		const 
			WebGL = Laya.WebGL,
			Stage = Laya.Stage;

		// 不支持WebGL时自动切换至Canvas
		Laya.init(1285, 727, WebGL);

		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;

		Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
		Laya.stage.bgColor = "#232628";

		this.createPage();
	}

	createPage() {
		const 
			Sprite = Laya.Sprite;

		// 绘制底图
		gameContainer = new Sprite();
		Laya.stage.addChild(gameContainer);
		gameContainer.loadImage("res/guide/crazy_snowball.png");
		gameContainer.on(Laya.Event.CLICK, this, this.nextStep);

		// 引导所在容器
		guideContainer = new Sprite();
		Laya.stage.addChild(guideContainer);
		guideContainer.cacheAs = "bitmap";

		// 绘制遮罩区，含透明度，可见游戏背景
		maskArea = new Sprite();
		guideContainer.addChild(maskArea);
		maskArea.alpha = 0.5;
		maskArea.graphics.drawRect(0, 0, Laya.stage.width, Laya.stage.height, "#000");

		// 绘制一个圆形区域，利用叠加模式，从遮罩区域抠出可交互区
		interactionArea = new Sprite();
		guideContainer.addChild(interactionArea);
		// 设置叠加模式
		interactionArea.blendMode = "destination-out";

		// 设置点击区域
		hitArea = new Laya.HitArea();
		hitArea.hit.drawRect(0, 0, Laya.stage.width, Laya.stage.height, "#000");
		guideContainer.hitArea = hitArea;
		guideContainer.mouseEnabled = true;

		tipContainer = new Sprite();
		Laya.stage.addChild(tipContainer);

		this.nextStep();
	}

	nextStep() {
		if (guideStep === guideSteps.length) {
			Laya.stage.removeChild(guideContainer);
			Laya.stage.removeChild(tipContainer);
			return;
		}
		let step = guideSteps[guideStep++];

		hitArea.unHit.clear();
		hitArea.unHit.drawCircle(step.x, step.y, step.radius, "#000000");

		interactionArea.graphics.clear();
		interactionArea.graphics.drawCircle(step.x, step.y, step.radius, "#000000");

		tipContainer.graphics.clear();
		tipContainer.loadImage(step.tip);
		tipContainer.pos(step.tipx, step.tipy);
	}
}

new Sprite_Guide();