package testNative
{
	import laya.d3.component.Animator;
	import laya.d3.core.BaseCamera;
	import laya.d3.core.Camera;
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.SkinnedMeshSprite3D;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.material.BaseMaterial;
	import laya.d3.core.material.BlinnPhongMaterial;
	import laya.d3.core.material.ExtendTerrainMaterial;
	import laya.d3.core.material.SkyBoxMaterial;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Vector3;
	import laya.d3.resource.models.SkyBox;
	import laya.d3.shader.Shader3D;
	import laya.display.Stage;
	import laya.events.Event;
	import laya.utils.Handler;
	import laya.utils.Stat;
	import common.CameraMoveScript;
	
	public class SceneLoad3
	{
		
		public var monkeyRow:int = 10;
		public var monkeyCount:int = 0;
		public var _scene:Scene3D;
		public var layaMonkey:Sprite3D;
		
		public function SceneLoad3()
		{
			Shader3D.debugMode = true;
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			Stat.show();
			
			var _this:SceneLoad3 = this;
			Scene3D.load("../../../../res/threeDimen/scene/TerrainScene/XunLongShi.ls", Handler.create(null, function(scene:Scene3D):void
			{
				
				_this._scene = scene;
				
				Laya.stage.addChild(scene);
				var camera:Camera = scene.getChildByName("Main Camera") as Camera;
				camera.clearFlag = BaseCamera.CLEARFLAG_SKY;
				camera.addComponent(CameraMoveScript);
				
				BaseMaterial.load("../../../../res/threeDimen/skyBox/skyBox3/skyBox3.lmat", Handler.create(null, function(mat:BaseMaterial):void
				{
					camera.skyboxMaterial = mat;
				}));
				
				(scene.getChildByName('Scenes').getChildByName('HeightMap') as MeshSprite3D).active = false;
				(scene.getChildByName('Scenes').getChildByName('Area') as MeshSprite3D).active = false;
				
				_this.loadMonkey();
			}))
		
		}
		
		public function loadMonkey()
		{
			//var camera:Camera = _scene.addChild(new Camera(0, 1, 100)) as Camera;
			//camera.transform.translate(new Vector3(0, 5, 7));
			//camera.transform.rotationEuler = new Vector3(-0.3, 0, 0);
			//camera.useOcclusionCulling = false;
			//camera.addComponent(CameraMoveScript);
			//camera.clearFlag = BaseCamera.CLEARFLAG_SOLIDCOLOR;
			//camera.skyboxMaterial = SkyBoxMaterial.load("../../../../res/threeDimen/skybox/skyBox4/SkyboxMaterial.lmat");
			var _this:SceneLoad3 = this;
			Sprite3D.load("../../../../res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", Handler.create(null, function(lm:Sprite3D):void
			{
				layaMonkey = lm;
				
				var meshSprite3d:SkinnedMeshSprite3D = lm.getChildAt(0).getChildByName("LayaMonkey") as SkinnedMeshSprite3D;
				var mat:BlinnPhongMaterial = meshSprite3d.skinnedMeshRenderer.sharedMaterial as BlinnPhongMaterial;
				mat.albedoIntensity = 5;
				
				var monkeyAnimator:Animator = (layaMonkey.getChildAt(0) as Sprite3D).getComponent(Animator) as Animator;
				//monkeyAnimator.getDefaultClip().islooping = true;
				monkeyAnimator.getDefaultState(0)._clip.islooping = true;
				layaMonkey.transform.translate(new Vector3(0, 7, 0));
				layaMonkey.transform.scale = new Vector3(0.3, 0.3, 0.3);
				layaMonkey.transform.rotate(new Vector3(0, 180, 0),true,false );
				_scene.addChild(layaMonkey);
				Laya.timer.frameOnce(1, _this, createMonkey);
			}));
		}
		
		public function createMonkey():void
		{
			if (layaMonkey)
			{
				var i:int = parseInt(monkeyCount / monkeyRow);
				var j:int = parseInt(monkeyCount % monkeyRow);
				var sp:Sprite3D = Sprite3D.instantiate(layaMonkey, _scene, false, new Vector3((-monkeyRow / 2 + i) * 4, 7, -2 + -j * 2));
				//sp.transform.rotate(new Vector3(0, 180, 0),true,false );
				monkeyCount++;
				if (monkeyCount < monkeyRow * monkeyRow)
				{
					Laya.timer.frameOnce(1, this, createMonkey);
				}
			}
		}
	}
}