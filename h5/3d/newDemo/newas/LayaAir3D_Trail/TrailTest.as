package OfficialExample.LayaAir3D_Trail 
{
	import laya.d3.core.BaseCamera;
	import laya.d3.core.Camera;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.light.DirectionLight;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Vector3;
	import laya.display.Stage;
	import laya.utils.Handler;
	import laya.utils.Stat;
	import common.CameraMoveScript;
	/**
	 * ...
	 * @author ...
	 */
	public class TrailTest 
	{
		
		public function TrailTest() 
		{
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			Stat.show();
			Scene3D.load("res/threeDimen/TrailTest/Trail.ls", Handler.create(this, function(scene:Scene3D):void {
				Laya.stage.addChild(scene) as Scene3D;
				var camera:Camera = scene.getChildByName("Main Camera") as Camera;
				camera.addComponent(CameraMoveScript);
				var directionLight:DirectionLight = scene.addChild(new DirectionLight()) as DirectionLight;
				directionLight.color = new Vector3(1, 1, 1);
				directionLight.transform.rotate(new Vector3(-Math.PI / 3, 0, 0));
			}));
	
		}
		
	}

}