const 
	// 一只凤凰的分辨率是550 * 400
	phoenixWidth = 500,
	phoenixHeight = 400,
	bgColorChannels = {
		r: 99,
		g: 0,
		b: 0xFF
	},
	gradientInterval = 2000;

class BlendMode_Lighter {
	constructor() {
		const 
			Browser = Laya.Browser,
			WebGL = Laya.WebGL,
			Stage = Laya.Stage,
			Stat = Laya.Stat,
			Sprite = Laya.Sprite,
			Tween = Laya.Tween;

		// 不支持WebGL时自动切换至Canvas
		Laya.init(phoenixWidth * 2, phoenixHeight, WebGL);

		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;

		Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
		Laya.stage.bgColor = "#232628";

		Stat.show();

		this.bgColorTweener = new Tween();

		this.setup();
	}

	setup() {
		this.createPhoenixes();

		// 动态背景渲染
		this.evalBgColor();
		Laya.timer.frameLoop(1, this, this.renderBg);
	}

	createPhoenixes() {
		let scaleFactor = Math.min(
			Laya.stage.width / (phoenixWidth * 2),
			Laya.stage.height / phoenixHeight);

		// 混合模式的凤凰
		let blendedPhoenix = this.createAnimation();
		blendedPhoenix.blendMode = Laya.BlendMode.LIGHTER; // 指定要使用的混合模式
		blendedPhoenix.scale(scaleFactor, scaleFactor);
		blendedPhoenix.y = (Laya.stage.height - phoenixHeight * scaleFactor) / 2;

		// 正常模式的凤凰
		let normalPhoenix = this.createAnimation();
		normalPhoenix.scale(scaleFactor, scaleFactor);
		normalPhoenix.x = phoenixWidth * scaleFactor;
		normalPhoenix.y = (Laya.stage.height - phoenixHeight * scaleFactor) / 2;
	}

	createAnimation() {
		let frames = [];
		for (let i = 1; i <= 25; ++i) {
			frames.push(`res/phoenix/phoenix${this.preFixNumber(i, 4)}.jpg`);
		}

		let animation = new Laya.Animation();
		Laya.stage.addChild(animation);
		animation.loadImages(frames);

		let clips = animation.frames.concat(); // 拷贝frames
		// 反转帧
		clips = clips.reverse();
		// 添加到已有帧末尾
		animation.frames = animation.frames.concat(clips);

		animation.play();

		return animation;
	}

	preFixNumber(num, strLen) {
		return ("0000000000" + num).slice(-strLen);
	}

	evalBgColor() {
		let color = Math.random() * 0xFFFFFF;
		let channels = this.getColorChannals(color);
		this.bgColorTweener.to(bgColorChannels, {
			r: channels[0],
			g: channels[1],
			b: channels[2]
		}, gradientInterval, null, Laya.Handler.create(this, this.onTweenComplete));
	}

	getColorChannals(color) {
		let result = [];
		result.push(color >> 16);
		result.push(color >> 8 & 0xFF);
		result.push(color & 0xFF);
		return result;
	}

	onTweenComplete() {
		this.evalBgColor();
	}

	renderBg() {
		Laya.stage.graphics.clear();
		Laya.stage.graphics.drawRect(
			0, 0,
			phoenixWidth, phoenixHeight, this.getHexColorString());
	}

	getHexColorString() {
		bgColorChannels.r = Math.floor(bgColorChannels.r);
		// 绿色通道使用0
		bgColorChannels.g = 0;
		//obj.g = Math.floor(obj.g);
		bgColorChannels.b = Math.floor(bgColorChannels.b);

		var r = bgColorChannels.r.toString(16);
		r = r.length == 2 ? r : "0" + r;
		var g = bgColorChannels.g.toString(16);
		g = g.length == 2 ? g : "0" + g;
		var b = bgColorChannels.b.toString(16);
		b = b.length == 2 ? b : "0" + b;
		return "#" + r + g + b;
	}
}

new BlendMode_Lighter();