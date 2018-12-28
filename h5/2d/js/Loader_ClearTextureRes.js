let 
	PathBg = "res/bg2.png",
	PathFly = "res/fighter/fighter.atlas";

class Loader_ClearTextureRes {
	constructor() {
		const 
			Browser = Laya.Browser,
			WebGL = Laya.WebGL,
			Stage = Laya.Stage,
			Stat = Laya.Stat,
			Handler = Laya.Handler;

		// 不支持WebGL时自动切换至Canvas
		Laya.init(Browser.clientWidth, Browser.clientHeight, WebGL);

		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;

		Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
		Laya.stage.bgColor = "#232628";

		Stat.show();
		this.init();
	}

	init() {
		const 
			Sprite = Laya.Sprite,
			Animation = Laya.Animation,
			Text = Laya.Text,
			Event = Laya.Event;

		// 创建背景
		this.spBg = Sprite.fromImage(PathBg);
		Laya.stage.addChild(this.spBg);

		// 创建动画
		this.aniFly = new Animation();
		this.aniFly.loadAtlas(PathFly);
		this.aniFly.play();
		this.aniFly.pos(250, 100);
		Laya.stage.addChild(this.aniFly);

		// 创建按钮
		this.btn = new Sprite().size(205, 55);
		this.btn.graphics.drawRect(0, 0, this.btn.width, this.btn.height, "#057AFB");
		this.txt = new Text();
		this.txt.text = "销毁";
		this.txt.pos(75, 15);
		this.txt.fontSize = 25;
		this.txt.color = "#FF0000";
		this.btn.addChild(this.txt);
		this.btn.pos(20, 160);
		Laya.stage.addChild(this.btn);

		//添加侦听
		this.btn.on(Event.MOUSE_UP, this, this.onMouseUp);
	}

	/**
	 * 鼠标事件响应函数
	 * @param evt 
	 */
	onMouseUp(evt) {
		if (this.isDestroyed) {
			//通过设置 visible=true ，来触发渲染，然后引擎会自动恢复资源
			this.spBg.visible = true;
			this.aniFly.visible = true;

			this.isDestroyed = false;
			this.txt.text = "销毁";
		} else {
			//通过设置 visible=false ，来停止渲染对象
			this.spBg.visible = false;
			this.aniFly.visible = false;

			//销毁 Texture 使用的图片资源
			Laya.loader.clearTextureRes(PathBg);
			Laya.loader.clearTextureRes(PathFly);

			this.isDestroyed = true;
			this.txt.text = "恢复";
		}
	}
}

new Loader_ClearTextureRes();