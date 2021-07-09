import Browser = Laya.Browser;
import WebGL = Laya.WebGL;
import Stage = Laya.Stage;
import Event = Laya.Event;
import Stat = Laya.Stat;
import SpineTempletBinary = Laya.SpineTempletBinary;//3.8之后特有的，适用结尾为.skel的资源
import SpineSkeleton = Laya.SpineSkeleton;
export class SpineBinary {
	private aniPath = "res/bone/spineboy-pma.skel";
	private templet:SpineTempletBinary;
	private skeleton:SpineSkeleton;
	private index: number = -1;
	constructor() {
		Laya.init(Browser.width, Browser.height, WebGL);
		Laya.stage.scaleMode = Stage.SCALE_NOSCALE;
		Laya.stage.bgColor = "#232628";
		Stat.show();
		this.startFun();
	}

	private startFun(): void {
		//创建动画模板
		this.templet = new SpineTempletBinary();
		this.templet.loadAni(this.aniPath);
		this.templet.on(Event.COMPLETE, this, this.parseComplete);
		this.templet.on(Event.ERROR, this, this.onError)
	}

	private parseComplete(): void {
		this.skeleton = this.templet.buildArmature();
		Laya.stage.addChild(this.skeleton);
		this.skeleton.pos(Browser.width / 2, Browser.height / 2 + 100);
		this.skeleton.scale(0.5, 0.5);
		this.skeleton.on(Event.STOPPED, this, this.play)
		this.play();
	}

	private onError(): void{
		console.log("parse error");
	}

	private play(): void {
		console.log("1111111111");
		if(++this.index >= this.skeleton.getAnimNum()) {
			this.index = 0
		}
		this.skeleton.play(this.index, false, true)
	}
}

new SpineBinary;