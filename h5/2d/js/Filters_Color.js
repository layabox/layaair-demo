let 
	apePath = "res/apes/monkey2.png",
	apeTexture;

class Filters_Color {
	constructor() {
		const 
			Browser = Laya.Browser,
			WebGL = Laya.WebGL,
			Stage = Laya.Stage;

		// 不支持WebGL时自动切换至Canvas
		Laya.init(Browser.width, Browser.height, WebGL);

		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;

		Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
		Laya.stage.bgColor = "#232628";

		Laya.loader.load(apePath, Laya.Handler.create(this, this.setup));
	}

	setup() {
		this.normalizeApe();
		this.makeRedApe();
		this.grayingApe();
	}

	normalizeApe() {
		let originalApe = this.createApe();
		originalApe.x = (Laya.stage.width - apeTexture.width * 3) / 2;
		originalApe.y = (Laya.stage.height - apeTexture.height) / 2;
	}

	makeRedApe() {
		const ColorFilter = Laya.ColorFilter;

		//由 20 个项目（排列成 4 x 5 矩阵）组成的数组，红色
		let redMat = [
			1, 0, 0, 0, 0, // R
			0, 0, 0, 0, 0, // G
			0, 0, 0, 0, 0, // B
			0, 0, 0, 1, 0  // A
		];
		//创建一个颜色滤镜对象,红色
		let redFilter = new ColorFilter(redMat);

		// 红色的猩猩
		let redApe = this.createApe();
		redApe.filters = [redFilter];

		let firstChild = Laya.stage.getChildAt(0);
		redApe.x = firstChild.x + apeTexture.width;
		redApe.y = firstChild.y;
	}

	grayingApe() {
		const ColorFilter = Laya.ColorFilter;

		//由 20 个项目（排列成 4 x 5 矩阵）组成的数组，灰图
		let grayscaleMat = [
			0.3086, 0.6094, 0.0820, 0, 0, 
			0.3086, 0.6094, 0.0820, 0, 0, 
			0.3086, 0.6094, 0.0820, 0, 0, 
			0, 		0, 		0, 		1, 0
		];
		//创建一个颜色滤镜对象，灰图
		let grayscaleFilter = new ColorFilter(grayscaleMat);

		// 使用 gray 方法实现灰色滤镜
		// let grayscaleFilter = new ColorFilter();
		// grayscaleFilter.gray();

		// 灰度猩猩
		let grayApe = this.createApe();
		grayApe.filters = [grayscaleFilter];

		let secondChild = Laya.stage.getChildAt(1);
		grayApe.x = secondChild.x + apeTexture.width;
		grayApe.y = secondChild.y;
	}

	createApe() {
		const Sprite = Laya.Sprite;
		let ape = new Sprite();
		Laya.stage.addChild(ape);
		apeTexture = Laya.loader.getRes(apePath);
		ape.graphics.drawTexture(apeTexture);
		return ape;
	}
}

new Filters_Color();