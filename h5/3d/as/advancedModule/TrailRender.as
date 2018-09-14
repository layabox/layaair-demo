package advancedModule {
	import laya.d3.core.BaseCamera;
	import laya.d3.core.Camera;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.light.DirectionLight;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Vector3;
	import laya.display.Stage;
	import laya.utils.Handler;
	import laya.utils.Stat;
	
	public class TrailRender {
		public function TrailRender() {
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			Stat.show();
			
			var scene:Scene3D = Laya.stage.addChild(new Scene3D()) as Scene3D;
			
			var camera:Camera = (scene.addChild(new Camera(0, 0.1, 1000))) as Camera;
			camera.transform.translate(new Vector3(0, 8, 10));
			camera.transform.rotate(new Vector3(-45, 0, 0), true, false);
			camera.clearFlag = BaseCamera.CLEARFLAG_SOLIDCOLOR;
			
			var directionLight:DirectionLight = scene.addChild(new DirectionLight()) as DirectionLight;
			directionLight.color = new Vector3(1, 1, 1);
			directionLight.transform.rotate(new Vector3(-Math.PI / 3, 0, 0));
			
			Sprite3D.load("../../../../res/threeDimen/staticModel/grid/plane.lh", Handler.create(this, function(plane:Sprite3D):void {
				scene.addChild(plane);
			}));
			
			Sprite3D.load("../../../../res/threeDimen/trail/Cube.lh", Handler.create(this, function(sprite:Sprite3D):void {
				scene.addChild(sprite);
			}));
		}
	
	}
}