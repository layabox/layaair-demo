package LayaAir3D_Camera {
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
	import laya.d3.core.BaseCamera;
	
	public class OrthographicCamera {
		
		/**
		 * (pos.x pos.y) 屏幕位置
		 *  pos.z 深度取值范围(-1,1);
		 * */
		private var pos:Vector3 = new Vector3(310, 500, 0);
		private var _translate:Vector3 = new Vector3(0, 0, 0);
		
		public function OrthographicCamera() {
			
			Laya3D.init(1024, 768);
			Laya.stage.scaleMode = Stage.SCALE_FIXED_HEIGHT;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			Stat.show();
			
			var dialog:Image = Laya.stage.addChild(new Image("res/cartoon2/background.jpg")) as Image;
			
			var scene:Scene3D = Laya.stage.addChild(new Scene3D()) as Scene3D;
			
			var camera:Camera = scene.addChild(new Camera(0, 0.1, 1000)) as Camera;
			camera.transform.rotate(new Vector3(-45, 0, 0), false, false);
			camera.transform.translate(new Vector3(5, -10, 1));
			camera.orthographic = true;
			camera.clearFlag = BaseCamera.CLEARFLAG_DEPTHONLY;
			//正交投影垂直矩阵尺寸
			camera.orthographicVerticalSize = 10;
			
			var directionLight:DirectionLight = scene.addChild(new DirectionLight()) as DirectionLight;
			
			Sprite3D.load("res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", Handler.create(this, function(layaMonkey:Sprite3D):void {
				scene.addChild(layaMonkey);
				layaMonkey.transform.localScale = new Vector3(0.3, 0.3, 0.3);
				//转换2D屏幕坐标系统到3D正交投影下的坐标系统
				camera.convertScreenCoordToOrthographicCoord(pos, _translate);
				layaMonkey.transform.position = _translate;
				
				Laya.stage.on(Event.RESIZE, this, function():void {
					camera.convertScreenCoordToOrthographicCoord(pos, _translate);
					layaMonkey.transform.position = _translate;
				});
			
			}));
		
		}
	}
}