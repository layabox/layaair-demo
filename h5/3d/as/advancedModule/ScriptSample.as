package advancedModule {
	import laya.d3.component.Script3D;
	import laya.d3.core.Camera;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.light.DirectionLight;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Vector3;
	import laya.display.Stage;
	import laya.net.Loader;
	import laya.utils.Handler;
	
	/**
	 * ...
	 * @author ...
	 */
	public class ScriptSample {
		
		public function ScriptSample() {
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			
			//预加载所有资源
			var resource:Array = [{url: "../../../../res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", type: Laya3D.HIERARCHY, priority: 1}];
			Laya.loader.create(resource, Handler.create(this, onComplete));
		}
		
		private function onComplete():void {
			var scene:Scene3D = Laya.stage.addChild(new Scene3D()) as Scene3D;
			
			var camera:Camera = scene.addChild(new Camera(0, 0.1, 100)) as Camera;
			camera.transform.translate(new Vector3(0, 0.8, 1.5));
			camera.transform.rotate(new Vector3(-15, 0, 0), true, false);
			
			var directionLight:DirectionLight = scene.addChild(new DirectionLight()) as DirectionLight;
			directionLight.color = new Vector3(0.6, 0.6, 0.6);
			
			var monkey:Sprite3D = Loader.getRes("../../../../res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh");
			monkey.addComponent(MonkeyScript);
			scene.addChild(monkey);
		}
	}
}

import laya.d3.component.Script3D;
import laya.d3.core.Sprite3D;
import laya.d3.math.Vector3;

class MonkeyScript extends Script3D {
	private var rotation:Vector3 = new Vector3(0, 0.01, 0);
	
	override public function onAwake():void {
		trace("onAwake");
	}
	
	override public function onStart():void {
		trace("onStart");
	}
	
	override public function onUpdate():void {
		(owner as Sprite3D).transform.rotate(rotation, false);
	}
	
	override public function onLateUpdate():void {
		trace("onLateUpdate");
	}
}

