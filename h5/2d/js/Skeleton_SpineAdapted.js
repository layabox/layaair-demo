var Browser = Laya.Browser;
var WebGL = Laya.WebGL;
var Stage = Laya.Stage;
var Event = Laya.Event;
var Stat = Laya.Stat;
var SpineTempletBinary = Laya.SpineTempletBinary;
class SpineBinary {
	constructor() {
		this.aniPath = "res/bone/spineboy-pma.skel";
		this.index = -1;
		Laya.init(Browser.width, Browser.height, WebGL);
		Laya.stage.scaleMode = Stage.SCALE_NOSCALE;
		Laya.stage.bgColor = "#232628";
		Stat.show();
		this.startFun();
	}
	startFun() {
		this.templet = new SpineTempletBinary();
		this.templet.loadAni(this.aniPath);
		this.templet.on(Event.COMPLETE, this, this.parseComplete);
		this.templet.on(Event.ERROR, this, this.onError);
	}
	parseComplete() {
		this.skeleton = this.templet.buildArmature();
		Laya.stage.addChild(this.skeleton);
		this.skeleton.pos(Browser.width / 2, Browser.height / 2 + 100);
		this.skeleton.scale(0.5, 0.5);
		this.skeleton.on(Event.STOPPED, this, this.play);
		this.play();
	}
	onError() {
		console.log("parse error");
	}
	play() {
		console.log("1111111111");
		if (++this.index >= this.skeleton.getAnimNum()) {
			this.index = 0;
		}
		this.skeleton.play(this.index, false, true);
	}
}
new SpineBinary;