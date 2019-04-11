package LayaAir3D_Camera {
	import laya.d3.core.Camera;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.light.DirectionLight;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Vector3;
	import laya.display.Stage;
	import laya.ui.Image;
	import laya.utils.Handler;
	import laya.utils.Stat;
	
	public class D3SpaceToD2Space {
		
		private var scene:Scene3D;
		private var camera:Camera;
		private var layaMonkey3D:Sprite3D;
		private var layaMonkey2D:Image;
		private var _position:Vector3 = new Vector3();
		private var _outPos:Vector3 = new Vector3();
		private var scaleDelta:Number = 0;
		private var _translate:Vector3 = new Vector3(0, 0.35, 1);
		private var _rotation:Vector3 = new Vector3( -15, 0, 0);
		
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
			camera.transform.translate(_translate);
			camera.transform.rotate(_rotation, true, false);
			
			//创建平行光
			var directionLight:DirectionLight = scene.addChild(new DirectionLight()) as DirectionLight;
			
			var completeHandler:Handler = Handler.create(this, onComplete);
			
			Laya.loader.create("res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", completeHandler);
		}
		
		public function onComplete():void {
			var _this:D3SpaceToD2Space = this;
			//加载精灵
			Sprite3D.load("res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", Handler.create(this, function(layaMonkey3D:Sprite3D):void {
				_this.layaMonkey3D = layaMonkey3D;
				scene.addChild(layaMonkey3D);
				layaMonkey2D = Laya.stage.addChild(new Image("res/threeDimen/monkey.png")) as Image;
				//开启时钟事件
				Laya.timer.frameLoop(1, _this, animate);
			}))
		}
		
		private function animate():void {
			
			_position.x = Math.sin(scaleDelta += 0.01);
			//变换的精灵的位置
			layaMonkey3D.transform.position = _position;
			//矩阵变换得到对应的屏幕坐标
			camera.viewport.project(layaMonkey3D.transform.position, camera.projectionViewMatrix, _outPos);
			
			layaMonkey2D.pos(_outPos.x / Laya.stage.clientScaleX, _outPos.y / Laya.stage.clientScaleY);
		}
	
	}
}