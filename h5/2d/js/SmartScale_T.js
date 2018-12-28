let 
	modes = ["noscale", "exactfit", "showall", "noborder", "full", "fixedwidth", "fixedheight"],
	index = 0,
	txt;
class SmartScale_T {
	constructor() {
		const 
			Browser = Laya.Browser,
			WebGL = Laya.WebGL,
			Stage = Laya.Stage,
			Stat = Laya.Stat,
			Handler = Laya.Handler,
			Image = Laya.Image,
			Text = Laya.Text;

		// 不支持WebGL时自动切换至Canvas
		Laya.init(550, 400, WebGL);

		//设置适配模式
		Laya.stage.scaleMode = "noscale";
		//设置横竖屏
		Laya.stage.screenMode = Stage.SCREEN_HORIZONTAL;
		//设置水平对齐
		Laya.stage.alignH = "center";
		//设置垂直对齐
		Laya.stage.alignV = "middle";

		//实例一个背景
		let bg = new Image();
		bg.skin = "res/bg.jpg";
		Laya.stage.addChild(bg);

		//实例一个文本
		this.txt = new Text();
		this.txt.text = "点击我切换适配模式(noscale)";
		this.txt.bold = true;
		this.txt.pos(0, 200);
		this.txt.fontSize = 30;
		this.txt.on("click", this, this.onTxtClick);
		Laya.stage.addChild(this.txt);

		//实例一个小人，放到右上角，并相对布局
		let boy1 = new Image();
		boy1.skin = "res/cartoonCharacters/1.png";
		boy1.top = 0;
		boy1.right = 0;
		boy1.on("click", this, this.onBoyClick);
		Laya.stage.addChild(boy1);

		//实例一个小人，放到右下角，并相对布局
		let boy2 = new Image();
		boy2.skin = "res/cartoonCharacters/2.png";
		boy2.bottom = 0;
		boy2.right = 0;
		boy2.on("click", this, this.onBoyClick);
		Laya.stage.addChild(boy2);

		//侦听点击事件，输出坐标信息
		Laya.stage.on("click", this, this.onClick);
		Laya.stage.on("resize", this, this.onResize);
	}

	onBoyClick(e) {
		//点击后小人会放大缩小
		let boy = e.target;
		if (boy.scaleX === 1) {
			boy.scale(1.2, 1.2);
		} else {
			boy.scale(1, 1);
		}
	}

	onTxtClick(e) {
		//点击后切换适配模式
		e.stopPropagation();
		index++;
		if (index >= modes.length) index = 0;
		Laya.stage.scaleMode = modes[index];
		this.txt.text = "点击我切换适配模式" + "(" + modes[index] + ")";
	}

	onClick(e) {
		//输出坐标信息
		console.log("mouse:", Laya.stage.mouseX, Laya.stage.mouseY);
	}

	onResize() {
		//输出当前适配模式下的stage大小
		console.log("size:", Laya.stage.width, Laya.stage.height);
	}
}

new SmartScale_T();