package {
	import laya.utils.Browser;
	import laya.webgl.WebGL;
	import laya.display.Stage;
	import laya.spine.SpineTempletBinary;
	import laya.spine.SpineSkeleton;
	import laya.events.Event;
	import laya.utils.Stat;
	public class Main {
		private var aniPath = "res/bone/spineboy-pma.skel";
		private var templet:SpineTempletBinary;
		private var skeleton:SpineSkeleton;
		private var index: Number = -1;
		public function Main() {
			Laya.init(Browser.width, Browser.height, WebGL);
			Laya.stage.scaleMode = Stage.SCALE_NOSCALE;
			Laya.stage.bgColor = "#232628";
			Stat.show();
			this.startFun();
		}

		private function startFun(): void {
			this.templet = new SpineTempletBinary();
			this.templet.loadAni(this.aniPath);
			this.templet.on(Event.COMPLETE, this, this.parseComplete);
			this.templet.on(Event.ERROR, this, this.onError)
		}

		private function parseComplete(): void {
			this.skeleton = this.templet.buildArmature();
			Laya.stage.addChild(this.skeleton);
			this.skeleton.pos(Browser.width / 2, Browser.height / 2 + 100);
			this.skeleton.scale(0.5, 0.5);
			this.skeleton.on(Event.STOPPED, this, this.play)
			this.play();
		}

		private function onError(): void{
			trace("parse error");
		}

		private function play(): void {
			console.log("1111111111");
			if(++this.index >= this.skeleton.getAnimNum()) {
				this.index = 0
			}
			this.skeleton.play(this.index, false, true)
		}
	}
}