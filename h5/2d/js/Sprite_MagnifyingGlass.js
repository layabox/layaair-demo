let 
	bgPath = "res/bg2.png",
	maskPath = "res/mask.png";

class Sprite_MagnifyingGlass {
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

		Laya.loader.load([bgPath, maskPath], Laya.Handler.create(this, this.setup));
	}

	setup() {
		const 
			Sprite = Laya.Sprite;
		let 
			bgRes = Laya.loader.getRes(bgPath),
			maskRes = Laya.loader.getRes(maskPath);

		let bg = new Sprite();
		Laya.stage.addChild(bg);
		bg.graphics.drawTexture(bgRes);

		let bg2 = new Sprite();
		Laya.stage.addChild(bg2);
		bg2.graphics.drawTexture(bgRes);
		bg2.scale(3, 3);

		// 创建mask
		let maskSp = new Sprite();
		maskSp.graphics.drawTexture(maskRes);
		maskSp.pivot(50, 50);

		// 设置mask
		bg2.mask = maskSp;

		Laya.stage.on(Laya.Event.MOUSE_MOVE, this, () => {
			bg2.x = -Laya.stage.mouseX * 2;
			bg2.y = -Laya.stage.mouseY * 2;

			maskSp.x = Laya.stage.mouseX;
			maskSp.y = Laya.stage.mouseY;
		});
	}
}

new Sprite_MagnifyingGlass();