
let assets = ["res/comp/fontClip_num.png", "res/comp/fontClip.png"];
 class Font_Clip {
	constructor() {
		// 不支持WebGL时自动切换至Canvas
		const WebGL = Laya.WebGL,
		Stage = Laya.Stage;
		Laya.init(800, 600, WebGL);
		
		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;
		Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
		Laya.stage.bgColor = "#232628";
		Laya.loader.load(assets, Laya.Handler.create(this, this.ShowContent));
	}
	 ShowContent() {
		const
		FontClip = Laya.FontClip;
		var clipnum= new FontClip(assets[0]);
		var fontClip = new FontClip(assets[1]);
		var TestFontClip = new FontClip(assets[1]);
		var TestClipNum = new FontClip(assets[0]);
		var clipnum1 = new FontClip(assets[0]);

		clipnum.pos(240, 500);
		clipnum.size(250, 50);
		clipnum.sheet = "0123456789";
		clipnum.value = "114499";
		clipnum.spaceY = 10;

		TestClipNum.pos(200, 400);
		TestClipNum.sheet = "0123456789";
		TestClipNum.value = "0123456789";

		clipnum1.pos(150, 200);
		clipnum1.direction = "vertical";
		clipnum1.sheet = "0123456789";
		clipnum1.value = "223388";

		fontClip.pos(240, 300);
		fontClip.sheet = "鼠牛虎兔龙蛇马羊 猴鸡狗猪年快乐";
		fontClip.value = "猪年快乐";
		fontClip.spaceY = 10;

		TestFontClip.pos(200, 200);
		TestFontClip.sheet = "鼠牛虎兔龙蛇马羊猴鸡狗猪年快乐";
		TestFontClip.value = "鼠牛虎兔龙蛇马羊猴鸡狗猪年快乐";
		TestFontClip.spaceY = 10;

		Laya.stage.addChild(clipnum);
		Laya.stage.addChild(fontClip);
		Laya.stage.addChild(TestFontClip);
		Laya.stage.addChild(TestClipNum);
		Laya.stage.addChild(clipnum1);
	}
}
new Font_Clip();
