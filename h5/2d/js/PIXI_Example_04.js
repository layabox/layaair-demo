const Browser = Laya.Browser;
let 
	starCount = 2500,
	sx = 1.0 + (Math.random() / 20),
	sy = 1.0 + (Math.random() / 20),
	stars = [],
	w = Browser.width,
	h = Browser.height,
	slideX = w / 2,
	slideY = h / 2,
	speedInfo;

class PIXI_Example_04 {
	constructor() {
		const 
			WebGL = Laya.WebGL,
			Stage = Laya.Stage,
			Stat = Laya.Stat,
			Handler = Laya.Handler,
			Loader = Laya.Loader;

		// 不支持WebGL时自动切换至Canvas
		Laya.init(w, h, WebGL);

		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;

		Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
		Laya.stage.bgColor = "#232628";

		Stat.show();

		this.createText();
		this.start();
	}

	start() {
		const Sprite = Laya.Sprite;

		for (var i = 0; i < starCount; i++) {
			var tempBall = new Sprite();
			tempBall.loadImage("res/pixi/bubble_32x32.png");

			tempBall.x = (Math.random() * w) - slideX;
			tempBall.y = (Math.random() * h) - slideY;
			tempBall.pivot(16, 16);

			stars.push({
				sprite: tempBall,
				x: tempBall.x,
				y: tempBall.y
			});

			Laya.stage.addChild(tempBall);
		}

		Laya.stage.on('click', this, this.newWave);
		speedInfo.text = 'SX: ' + sx + '\nSY: ' + sy;

		this.resize();

		Laya.timer.frameLoop(1, this, this.update);
	}

	createText() {
		const Text = Laya.Text;
		
		speedInfo = new Text();
		speedInfo.color = "#FFFFFF";
		speedInfo.pos(w - 160, 20);
		speedInfo.zOrder = 1;
		Laya.stage.addChild(speedInfo);
	}

	newWave() {
		sx = 1.0 + (Math.random() / 20);
		sy = 1.0 + (Math.random() / 20);
		speedInfo.text = 'SX: ' + sx + '\nSY: ' + sy;
	}

	resize() {
		w = Laya.stage.width;
		h = Laya.stage.height;

		slideX = w / 2;
		slideY = h / 2;
	}

	update() {
		for (var i = 0; i < starCount; i++) {
			stars[i].sprite.x = stars[i].x + slideX;
			stars[i].sprite.y = stars[i].y + slideY;
			stars[i].x = stars[i].x * sx;
			stars[i].y = stars[i].y * sy;

			if (stars[i].x > w) {
				stars[i].x = stars[i].x - w;
			} else if (stars[i].x < -w) {
				stars[i].x = stars[i].x + w;
			}

			if (stars[i].y > h) {
				stars[i].y = stars[i].y - h;
			} else if (stars[i].y < -h) {
				stars[i].y = stars[i].y + h;
			}
		}
	}
}

new PIXI_Example_04();