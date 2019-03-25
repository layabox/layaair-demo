package LayaAir3D_Sprite3D {
	import common.CameraMoveScript;
	import laya.d3.core.Camera;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.light.DirectionLight;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Vector3;
	import laya.display.Stage;
	import laya.net.Loader;
	import laya.utils.Handler;
	import laya.utils.Stat;
	
	public class SkinnedMeshSprite3DDemo {
		private var scene:Scene3D;
		
		public function SkinnedMeshSprite3DDemo() {
			//初始化引擎
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			//显示性能面板
			Stat.show();
			
			//创建场景
			scene = Laya.stage.addChild(new Scene3D()) as Scene3D;
			
			//创建相机
			var camera:Camera = scene.addChild(new Camera(0, 0.1, 100)) as Camera;
			camera.transform.translate(new Vector3(0, 0.5, 1));
			camera.transform.rotate(new Vector3(-15, 0, 0), true, false);
			camera.addComponent(CameraMoveScript);
			
			//添加光照
			var directionLight:DirectionLight = scene.addChild(new DirectionLight()) as DirectionLight;
			directionLight.color = new Vector3(1, 1, 1);
			directionLight.transform.rotate(new Vector3(-3.14 / 3, 0, 0));
			
			//预加载资源
			Laya.loader.create("res/threeDimen/skinModel/dude/dude.lh", Handler.create(this, onComplete));
		
		}
		
		public function onComplete():void {
			//添加父级猴子
			var dude:Sprite3D = scene.addChild(Loader.getRes("res/threeDimen/skinModel/dude/dude.lh")) as Sprite3D;
			//缩放
			var scale:Vector3 = new Vector3(0.1, 0.1, 0.1);
			dude.transform.localScale = scale;
			dude.transform.rotate(new Vector3(0, 3.14, 0));
		}
	
	}

}