const Browser = Laya.Browser;
let 
	viewWidth = Browser.width,
	viewHeight = Browser.height,
	lasers = [],
	tick = 0,
	frequency = 80,
	type = 0;

class PIXI_Example_23 {
	constructor() {
		const 
			WebGL = Laya.WebGL,
			Stage = Laya.Stage,
			Stat = Laya.Stat,
			Handler = Laya.Handler;

		// 不支持WebGL时自动切换至Canvas
		Laya.init(viewWidth, viewHeight, WebGL);

		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;

		Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
		Laya.stage.bgColor = "#232628";

		Stat.show();

		// create a background texture
		Laya.stage.loadImage("res/pixi/laserBG.jpg");

		Laya.stage.frameLoop(1, this, this.animate);
	}

	animate() {
		const 
			Sprite = Laya.Sprite,
			Point = Laya.Point;

		let laser;
		if (tick > frequency) {
			tick = 0;
			// iterate through the dudes and update the positions
			laser = new Sprite();
			laser.loadImage("res/pixi/laser0" + ((type % 5) + 1) + ".png");
			type++;

			laser.life = 0;

			let pos1;
			let pos2;
			if (type % 2) {
				pos1 = new Point(-20, Math.random() * viewHeight);
				pos2 = new Point(viewWidth, Math.random() * viewHeight + 20);
			} else {
				pos1 = new Point(Math.random() * viewWidth, -20);
				pos2 = new Point(Math.random() * viewWidth, viewHeight + 20);
			}
			let distX = pos1.x - pos2.x;
			let distY = pos1.y - pos2.y;

			let dist = Math.sqrt(distX * distX + distY * distY) + 40;

			laser.scaleX = dist / 20;
			laser.pos(pos1.x, pos1.y);
			laser.pivotY = 43 / 2;
			laser.blendMode = "lighter";

			laser.rotation = (Math.atan2(distY, distX) + Math.PI) * 180 / Math.PI;

			lasers.push(laser);

			Laya.stage.addChild(laser);

			frequency *= 0.9;
		}

		for (let i = 0; i < lasers.length; i++) {
			laser = lasers[i];
			laser.life++;
			if (laser.life > 60 * 0.3) {
				laser.alpha *= 0.9;
				laser.scaleY = laser.alpha;
				if (laser.alpha < 0.01) {
					lasers.splice(i, 1);
					Laya.stage.removeChild(laser);
					i--;
				}
			}
		}
		// increment the ticker
		tick += 1;
	}
}

new PIXI_Example_23();