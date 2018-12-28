let 
	colAmount = 100,
	extraSpace = 50,
	moveSpeed = 2,
	rotateSpeed = 2,

	characterGroup;

class PerformanceTest_Cartoon {
	constructor() {
		const 
			Browser = Laya.Browser,
			WebGL = Laya.WebGL,
			Stage = Laya.Stage,
			Stat = Laya.Stat,
			Handler = Laya.Handler,
			Loader = Laya.Loader;

		// 不支持WebGL时自动切换至Canvas
		Laya.init(Browser.width, Browser.height, WebGL);

		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;

		Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
		Laya.stage.bgColor = "#232628";

		Stat.show();

		Laya.loader.load("res/cartoonCharacters/cartoonCharactors.json", Handler.create(this, this.createCharacters), null, Loader.ATLAS);
	}

	createCharacters() {
		characterGroup = [];

		for(let i = 0; i < colAmount; ++i) {
			let tx = (Laya.stage.width + extraSpace * 2) / colAmount * i - extraSpace;
			let tr = 360 / colAmount * i;
			let startY = (Laya.stage.height - 500) / 2;

			this.createCharacter("cartoonCharactors/1.png", 46, 50, tr).pos(tx, 50  + startY);
			this.createCharacter("cartoonCharactors/2.png", 34, 50, tr).pos(tx, 150 + startY);
			this.createCharacter("cartoonCharactors/3.png", 42, 50, tr).pos(tx, 250 + startY);
			this.createCharacter("cartoonCharactors/4.png", 48, 50, tr).pos(tx, 350 + startY);
			this.createCharacter("cartoonCharactors/5.png", 36, 50, tr).pos(tx, 450 + startY);
		}

		Laya.timer.frameLoop(1, this, this.animate);
	}

	createCharacter(skin, pivotX, pivotY, rotation) {
		const Sprite = Laya.Sprite;

		let charactor = new Sprite();
		charactor.loadImage(skin);
		charactor.rotation = rotation;
		charactor.pivot(pivotX, pivotY);
		Laya.stage.addChild(charactor);
		characterGroup.push(charactor);

		return charactor;
	}

	animate() {
		for (let i = characterGroup.length - 1; i >= 0; --i) {
			this.animateCharactor(characterGroup[i]);
		}
	}

	animateCharactor(charactor) {
		charactor.x += moveSpeed;
		charactor.rotation += rotateSpeed;

		if (charactor.x > Laya.stage.width + extraSpace) {
			charactor.x = -extraSpace;
		}
	}
}

new PerformanceTest_Cartoon();