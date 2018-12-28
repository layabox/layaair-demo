let skins;

class UI_Slider {
	constructor() {
		const 
			Browser = Laya.Browser,
			WebGL = Laya.WebGL,
			Stage = Laya.Stage,
			Stat = Laya.Stat,
			Handler = Laya.Handler;

		// 不支持WebGL时自动切换至Canvas
		Laya.init(550, 400, WebGL);

		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;

		Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
		Laya.stage.bgColor = "#232628";

		Stat.show();
		skins = [];
		skins.push("res/ui/hslider.png", "res/ui/hslider$bar.png");
		skins.push("res/ui/vslider.png", "res/ui/vslider$bar.png");
		Laya.loader.load(skins, Handler.create(this, this.onLoadComplete));
	}

	onLoadComplete() {
		this.placeHSlider();
		this.placeVSlider();
	}

	placeHSlider() {
		const 
			HSlider = Laya.HSlider,
			Handler = Laya.Handler;

		let hs = new HSlider("res/ui/hslider.png");
		Laya.stage.addChild(hs);

		hs.width = 300;
		hs.pos(50, 170);
		hs.min = 0;
		hs.max = 100;
		hs.value = 50;
		hs.tick = 1;

		hs.changeHandler = new Handler(this, this.onChange);
	}

	placeVSlider() {
		const 
			VSlider = Laya.VSlider,
			Handler = Laya.Handler;

		let vs = new VSlider();
		Laya.stage.addChild(vs);
		vs.skin = "res/ui/vslider.png";

		vs.height = 300;
		vs.pos(400, 50);
		vs.min = 0;
		vs.max = 100;
		vs.value = 50;
		vs.tick = 1;

		vs.changeHandler = new Handler(this, this.onChange);
	}

	onChange(value) {
		console.log("滑块的位置：" + value);
	}
}

new UI_Slider();