class UI_ProgressBar {
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
		Laya.loader.load(["res/ui/progressBar.png", "res/ui/progressBar$bar.png"], Handler.create(this, this.onLoadComplete));
	}

	onLoadComplete() {
		const 
			ProgressBar = Laya.ProgressBar,
			Handler = Laya.Handler;
		
		this.progressBar = new ProgressBar("res/ui/progressBar.png");
		Laya.stage.addChild(this.progressBar);
	
		this.progressBar.width = 400;

		this.progressBar.x = (Laya.stage.width - this.progressBar.width ) / 2;
		this.progressBar.y = Laya.stage.height / 2;
		
		this.progressBar.sizeGrid = "5,5,5,5";
		this.progressBar.changeHandler = new Handler(this, this.onChange);

		Laya.timer.loop(100, this, this.changeValue);
	}

	changeValue() {
		if (this.progressBar.value >= 1) {
			this.progressBar.value = 0;
		}
		this.progressBar.value += 0.05;
	}

	onChange(value) {
		console.log("进度：" + Math.floor(value * 100) + "%");
	}
}

new UI_ProgressBar();