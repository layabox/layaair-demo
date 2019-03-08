package OfficialExample.LayaAir3D_Trail {
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
			//初始化引擎
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			//显示性能面板
			Stat.show();
			
			//加载场景
			var scene:Scene3D = Laya.stage.addChild(new Scene3D()) as Scene3D;
			
			//加载相机
			var camera:Camera = (scene.addChild(new Camera(0, 0.1, 1000))) as Camera;
			camera.transform.translate(new Vector3(0, 8, 10));
			camera.transform.rotate(new Vector3( -45, 0, 0), true, false);
			//设置相机清除标识为固定颜色
			camera.clearFlag = BaseCamera.CLEARFLAG_SOLIDCOLOR;
			
			//创建平行光
			var directionLight:DirectionLight = scene.addChild(new DirectionLight()) as DirectionLight;
			//设置平行光颜色
			directionLight.color = new Vector3(1, 1, 1);
			directionLight.transform.rotate(new Vector3(-Math.PI / 3, 0, 0));
			
			Sprite3D.load("res/threeDimen/staticModel/grid/plane.lh", Handler.create(this, function(plane:Sprite3D):void {
				scene.addChild(plane);
			}));
			
			Sprite3D.load("res/threeDimen/trail/Cube.lh", Handler.create(this, function(sprite:Sprite3D):void {
				scene.addChild(sprite);
			}));
		}
	
	}
}