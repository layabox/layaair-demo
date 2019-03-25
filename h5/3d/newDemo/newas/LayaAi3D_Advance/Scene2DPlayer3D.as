package LayaAi3D_Advance {
	import laya.d3.core.Camera;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.light.DirectionLight;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Vector3;
	import laya.display.Stage;
	import laya.events.Event;
	import laya.ui.Image;
	import laya.utils.Handler;
	import laya.utils.Stat;
	import laya.events.KeyBoardManager;
	
	public class Scene2DPlayer3D {
		
		/**
		 * (pos.x pos.y) 屏幕位置
		 *  pos.z 深度取值范围(-1,1);
		 * */
		private var pos:Vector3 = new Vector3(310, 500, 0);
		private var _translate:Vector3 = new Vector3(0, 0, 0);
		private var _translate2:Vector3 = new Vector3(5, -10, 1);
		private var _translate3:Vector3 = new Vector3(0, 0, -0.2);
		private var _translate4:Vector3 = new Vector3(0, 0, 0.2);
		private var _translate5:Vector3 = new Vector3(-0.2, 0, 0);
		private var _translate6:Vector3 = new Vector3(0.2, 0, 0);
		private var _layaMonkey:Sprite3D;
		private var _rotation:Vector3 = new Vector3( -45, 0, 0);
		
		public function Scene2DPlayer3D() {
			
			Laya3D.init(1024, 768);
			Laya.stage.scaleMode = Stage.SCALE_FIXED_HEIGHT;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			Stat.show();
			
			var dialog:Image = Laya.stage.addChild(new Image("res/threeDimen/secne.jpg")) as Image;
			
			var scene:Scene3D = Laya.stage.addChild(new Scene3D()) as Scene3D;
			
			var camera:Camera = scene.addChild(new Camera(0, 0.1, 1000)) as Camera;
			camera.transform.rotate(_rotation, false, false);
			camera.transform.translate(_translate2);
			camera.orthographic = true;
			//正交投影垂直矩阵尺寸
			camera.orthographicVerticalSize = 10;
			
			var directionLight:DirectionLight = scene.addChild(new DirectionLight()) as DirectionLight;
			
			Sprite3D.load("res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", Handler.create(this, function(layaMonkey:Sprite3D):void {
				scene.addChild(layaMonkey);
				_layaMonkey = layaMonkey;
				var tmpLocalScale:Vector3 = layaMonkey.transform.localScale;
				tmpLocalScale.setValue(0.3, 0.3, 0.3);
				//转换2D屏幕坐标系统到3D正交投影下的坐标系统
				camera.convertScreenCoordToOrthographicCoord(pos, _translate);
				layaMonkey.transform.position = _translate;
				var tmpRotationEuler:Vector3 = layaMonkey.transform.rotationEuler;
				tmpRotationEuler.setValue(-30, 0, 0);
				Laya.timer.frameLoop(1, this, onKeyDown);
			
			}));
		
		}
		private function onKeyDown():void {
			KeyBoardManager.hasKeyDown(87) && _layaMonkey.transform.translate(_translate3);//W
			KeyBoardManager.hasKeyDown(83) && _layaMonkey.transform.translate(_translate4);//S
			KeyBoardManager.hasKeyDown(65) && _layaMonkey.transform.translate(_translate5);//A
			KeyBoardManager.hasKeyDown(68) && _layaMonkey.transform.translate(_translate6);//D
		}
	}
}