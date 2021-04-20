window.Laya=window.Laya||{};

(function (exports, Laya) {
	'use strict';

	class SkeletonMask {
	    constructor() {
	        this.fontName = "fontClip";
	        Laya.Laya3D.init(0, 0);
	        Laya.Stat.show();
	        Laya.Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
	        Laya.Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
	        this.loadFont();
	        Laya.Scene3D.load("res/threeDimen/LayaScene_MaskModelTest/Conventional/MaskModelTest.ls", Laya.Handler.create(this, function (scene) {
	            Laya.Laya.stage.addChild(scene);
	            var camera = scene.getChildByName("Camera");
	        }));
	    }
	    loadFont() {
	        var bitmapFont = new Laya.BitmapFont();
	        bitmapFont.loadFont("res/threeDimen/LayaScene_MaskModelTest/font/fontClip.fnt", new Laya.Handler(this, this.onFontLoaded, [bitmapFont]));
	    }
	    onFontLoaded(bitmapFont) {
	        bitmapFont.setSpaceWidth(10);
	        Laya.Text.registerBitmapFont(this.fontName, bitmapFont);
	        this.createText(this.fontName);
	        this.createText1(this.fontName);
	        this.createText2(this.fontName);
	    }
	    createText(font) {
	        var txt = new Laya.Text();
	        txt.width = 250;
	        txt.wordWrap = true;
	        txt.text = "带有骨骼遮罩的动画";
	        txt.color = "#FFFFFFFF";
	        txt.leading = 5;
	        txt.fontSize = 10;
	        txt.zOrder = 999999999;
	        txt.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
	        txt.pos(Laya.Laya.stage.width / 2 - 50, Laya.Laya.stage.height / 2);
	        Laya.Laya.stage.on(Laya.Event.RESIZE, txt, () => {
	            txt.pos(Laya.Laya.stage.width / 2 - 50, Laya.Laya.stage.height / 2);
	        });
	        Laya.Laya.stage.addChild(txt);
	    }
	    createText1(font) {
	        var txt = new Laya.Text();
	        txt.width = 250;
	        txt.wordWrap = true;
	        txt.text = "正常动画一";
	        txt.color = "#FFFFFFFF";
	        txt.size(200, 300);
	        txt.leading = 5;
	        txt.fontSize = 15;
	        txt.zOrder = 999999999;
	        txt.pos(Laya.Laya.stage.width / 2 - 240, Laya.Laya.stage.height / 2);
	        Laya.Laya.stage.on(Laya.Event.RESIZE, txt, () => {
	            txt.pos(Laya.Laya.stage.width / 2 - 240, Laya.Laya.stage.height / 2);
	        });
	        Laya.Laya.stage.addChild(txt);
	    }
	    createText2(font) {
	        var txt = new Laya.Text();
	        txt.width = 250;
	        txt.wordWrap = true;
	        txt.text = "正常动画二";
	        txt.color = "#FFFFFFFF";
	        txt.leading = 5;
	        txt.zOrder = 999999999;
	        txt.fontSize = 15;
	        txt.pos(Laya.Laya.stage.width / 2 + 140, Laya.Laya.stage.height / 2);
	        Laya.Laya.stage.on(Laya.Event.RESIZE, txt, () => {
	            txt.pos(Laya.Laya.stage.width / 2 + 140, Laya.Laya.stage.height / 2);
	        });
	        Laya.Laya.stage.addChild(txt);
	    }
	}
	new SkeletonMask();

	exports.SkeletonMask = SkeletonMask;

}(this.Laya = this.Laya || {}, Laya));
