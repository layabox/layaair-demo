let 
	amount = 500,

	character1 = [
		"res/cartoon2/yd-6_01.png",
		"res/cartoon2/yd-6_02.png",
		"res/cartoon2/yd-6_03.png",
		"res/cartoon2/yd-6_04.png",
		"res/cartoon2/yd-6_05.png",
		"res/cartoon2/yd-6_06.png",
		"res/cartoon2/yd-6_07.png",
		"res/cartoon2/yd-6_08.png",
	],
	character2 = [
		"res/cartoon2/yd-3_01.png",
		"res/cartoon2/yd-3_02.png",
		"res/cartoon2/yd-3_03.png",
		"res/cartoon2/yd-3_04.png",
		"res/cartoon2/yd-3_05.png",
		"res/cartoon2/yd-3_06.png",
		"res/cartoon2/yd-3_07.png",
		"res/cartoon2/yd-3_08.png",
	],
	character3 = [
		"res/cartoon2/yd-2_01.png",
		"res/cartoon2/yd-2_02.png",
		"res/cartoon2/yd-2_03.png",
		"res/cartoon2/yd-2_04.png",
		"res/cartoon2/yd-2_05.png",
		"res/cartoon2/yd-2_06.png",
		"res/cartoon2/yd-2_07.png",
		"res/cartoon2/yd-2_08.png",
	],
	character4 = [
		"res/cartoon2/wyd-1_01.png",
		"res/cartoon2/wyd-1_02.png",
		"res/cartoon2/wyd-1_03.png",
		"res/cartoon2/wyd-1_04.png",
		"res/cartoon2/wyd-1_05.png",
		"res/cartoon2/wyd-1_06.png",
		"res/cartoon2/wyd-1_07.png",
		"res/cartoon2/wyd-1_08.png",
	],

	characterSkins = [character1, character2, character3, character4],

	characters = [],
	text;

class PerformanceTest_Cartoon2 {
	constructor() {
		const 
			Browser = Laya.Browser,
			WebGL = Laya.WebGL,
			Stage = Laya.Stage,
			Stat = Laya.Stat,
			Handler = Laya.Handler,
			Text = Laya.Text;

		// 不支持WebGL时自动切换至Canvas
		Laya.init(1280, 720, WebGL);

		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;

		Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
		Laya.stage.bgColor = "#232628";

		Laya.stage.screenMode = Stage.SCREEN_HORIZONTAL;

		Stat.enable();

		Laya.stage.loadImage("res/cartoon2/background.jpg", 0, 0, 1280, 900);
		this.createCharacters();
		text = new Text();
		text.zOrder = 10000;
		text.fontSize = 60;
		text.color = "#ff0000"
		Laya.stage.addChild(text);

		Laya.timer.frameLoop(1, this, this.gameLoop);
	}

	createCharacters() {
		let char;
		let charSkin;
		for (let i = 0; i < amount; i++) {
			charSkin = characterSkins[Math.floor(Math.random() * characterSkins.length)];
			char = new Character(charSkin);

			char.x = Math.random() * (Laya.stage.width + Character.WIDTH * 2);
			char.y = Math.random() * (Laya.stage.height - Character.HEIGHT);
			char.zOrder = char.y;

			char.setSpeed(Math.round(Math.random() * 2 + 3));
			char.setName(i.toString());

			Laya.stage.addChild(char);
			characters.push(char);
		}
	}

	gameLoop() {
		const Stat = Laya.Stat;
		
		for (let i = characters.length - 1; i >= 0; i--) {
			characters[i].update();
		}
		if (Laya.timer.currFrame % 60 === 0) {
			text.text = Stat.FPS.toString();
		}
	}
}

class Character extends Laya.Sprite {
	constructor(images) {
		super();
		
		this.speed = 5;
		this.bloodBar;
		this.animation;
		this.nameLabel;

		this.createAnimation(images);
		this.createBloodBar();
		this.createNameLabel();
	}

	createAnimation(images) {
		const Animation = Laya.Animation;

		this.animation = new Animation();
		this.animation.loadImages(images);
		this.animation.interval = 70;
		this.animation.play(0);
		this.addChild(this.animation);
	}

	createBloodBar() {
		const Sprite = Laya.Sprite;

		this.bloodBar = new Sprite();
		this.bloodBar.loadImage("res/cartoon2/blood_1_r.png");
		this.bloodBar.x = 20;
		this.addChild(this.bloodBar);
	}

	createNameLabel() {
		const Text = Laya.Text;

		this.nameLabel = new Text();
		this.nameLabel.color = "#FFFFFF";
		this.nameLabel.text = "Default";
		this.nameLabel.fontSize = 13;
		this.nameLabel.width = Character.WIDTH;
		this.nameLabel.align = "center";
		this.addChild(this.nameLabel);
	}

	setSpeed(value) {
		this.speed = value;
	}

	setName(value) {
		this.nameLabel.text = value;
	}

	update() {
		this.x += this.speed;
		if (this.x >= Laya.stage.width + Character.WIDTH)
			this.x = -Character.WIDTH;
	}
}
Character.WIDTH = 110;
Character.HEIGHT = 110;

new PerformanceTest_Cartoon2();