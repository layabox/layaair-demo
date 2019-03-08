package OfficialExample.LayaAir3D_Animation 
{
	import OfficialExample.LayaAir3D_Sprite3D.Sprite3DClone;
	import common.CameraMoveScript;
	import laya.d3.core.Camera;
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.material.BlinnPhongMaterial;
	import laya.d3.core.scene.Scene3D;
	import laya.display.Stage;
	import laya.utils.Handler;
	import laya.utils.Stat;
	import laya.d3.math.Vector3;
	import laya.d3.math.Vector4;
	/**
	 * ...
	 * @author ...
	 */
	public class AnimationEventByUnity 
	{
		
		public function AnimationEventByUnity() 
		{
			//初始化引擎
			Laya3D.init(0, 0);
			Stat.show();
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			
			//加载场景
			Scene3D.load("res/threeDimen/scene/AnimationEventScene/Conventional/scene.ls", Handler.create(this, function(scene:Scene3D):void {
				Laya.stage.addChild(scene) as Scene3D;
				var cube:Sprite3D = scene.getChildByName("Cube");
				cube.addComponent();	
		}
		
	}

}

import laya.components.Script;
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.material.RenderState;
	import laya.d3.core.material.PBRStandardMaterial;
	import laya.d3.math.Vector4;
	import laya.d3.math.Vector3;
	import laya.d3.core.material.PBRSpecularMaterial;
	import laya.events.Event;
	import laya.d3.component.Script3D;
	import laya.d3.loaders.MeshReader;
	import laya.d3.core.material.BlinnPhongMaterial;
	import laya.d3.physics.Collision;
	
	
class SceneScript extends Script3D{
		public function SceneScript() {
			
		}

		public function 
	}
