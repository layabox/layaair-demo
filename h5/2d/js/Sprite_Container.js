class Sprite_Container {
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

		this.showApe();
	}

	showApe() {
		const 
			Sprite = Laya.Sprite;
		const 
			layoutRadius = 150,
			radianUnit = Math.PI / 2;
		// 该容器用于装载4张猩猩图片
		this.apesCon = new Sprite();
		Laya.stage.addChild(this.apesCon);

		// 添加4张猩猩图片
		let ape;
		for (let i = 0; i < 4; i++) {
			ape = new Sprite();
			this.apesCon.addChild(ape);
			ape.loadImage(`res/apes/monkey${i}.png`);
			ape.pivot(55, 72).pos(
				Math.cos(radianUnit * i) * layoutRadius,
				Math.sin(radianUnit * i) * layoutRadius
			);
		}

		this.apesCon.pos(Laya.stage.width / 2, Laya.stage.height / 2);
		Laya.timer.frameLoop(1, this, this.animate);
	}

	animate() {
		this.apesCon.rotation += 1;
	}
}

new Sprite_Container();