let 
	monkey1Str = "res/apes/monkey1.png",
	monkey2Str = "res/apes/monkey2.png",
	monkey1Res,
	monkey2Res;

class Sprite_SwitchTexture {
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

		this.flag = true;
		Laya.loader.load([monkey1Str, monkey2Str], Laya.Handler.create(this, this.onAssetsLoaded));
	}

	onAssetsLoaded() {
		monkey1Res = Laya.loader.getRes(monkey1Str),
		monkey2Res = Laya.loader.getRes(monkey2Str);
		this.ape = new Laya.Sprite();
		Laya.stage.addChild(this.ape);
		this.ape.pivot(55, 72);
		this.ape.pos(Laya.stage.width / 2, Laya.stage.height / 2);

		this.switchTexture();

		this.ape.on(Laya.Event.CLICK, this, this.switchTexture);
	}
	
	switchTexture() {
		let monkey = (this.flag = !this.flag) ? monkey1Res : monkey2Res;

		this.ape.graphics.clear();
		this.ape.graphics.drawTexture(monkey, 0, 0);

		this.ape.size(monkey.width, monkey.height);
	}
}

new Sprite_SwitchTexture();