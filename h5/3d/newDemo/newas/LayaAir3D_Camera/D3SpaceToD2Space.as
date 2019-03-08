package OfficialExample.LayaAir3D_Camera {
	import laya.d3.core.Camera;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.light.DirectionLight;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Vector3;
	import laya.display.Stage;
	import laya.ui.Image;
	import laya.utils.Handler;
	import laya.utils.Stat;
	import laya.net.Loader;
	
	public class D3SpaceToD2Space {
		
		private var scene:Scene3D;
		private var camera:Camera;
		private var layaMonkey3D:Sprite3D;
		private var layaMonkey2D:Image;
		private var _position:Vector3 = new Vector3();
		private var _outPos:Vector3 = new Vector3();
		private var scaleDelta:Number = 0;
		
		public function D3SpaceToD2Space() {
			//初始化引擎
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			//显示性能面板
			Stat.show();
			
			//创建场景
			scene = Laya.stage.addChild(new Scene3D()) as Scene3D;
			
			//创建相机
			camera = scene.addChild(new Camera(0, 0.1, 100)) as Camera;
			camera.transform.translate(new Vector3(0, 0.35, 1));
			camera.transform.rotate(new Vector3(-15, 0, 0), true, false);
			
			//创建平行光
			var directionLight:DirectionLight = scene.addChild(new DirectionLight()) as DirectionLight;
			directionLight.color = new Vector3(1, 1, 1);
            directionLight.transform.rotate(new Vector3(-3.14/3, 0,0));
			//加载精灵
			Laya.loader.create("res/threeDimen/staticModel/grid/plane.lh", Handler.create(this, onComplete));
		}
		
		public function onComplete():void {
			//加载三维地面
			var grid:Sprite3D = scene.addChild(Loader.getRes("res/threeDimen/staticModel/grid/plane.lh")) as Sprite3D;
			//加载二维猴子
			layaMonkey2D = Laya.stage.addChild(new Image("res/threeDimen/monkey.png")) as Image;
			//开启定时器循环
			Laya.timer.frameLoop(1, this, animate);
		}
		
		private function animate():void {
			//变换位置
			_position.x = Math.sin(scaleDelta += 0.01);
			//计算位置
			camera.viewport.project(_position, camera.projectionViewMatrix, _outPos);
			layaMonkey2D.pos(_outPos.x / Laya.stage.clientScaleX, _outPos.y / Laya.stage.clientScaleY);
		}
	
	}
}