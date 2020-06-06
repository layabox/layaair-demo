package  {
	import laya.d3.core.Camera;
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.light.ShadowMode;
	import laya.d3.core.light.SpotLight;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.shader.Shader3D;
	import laya.display.Node;
	import laya.utils.Handler;
	import laya.utils.Stat;
	import laya.display.Stage;
	
	/**
	 * ...
	 * @author zqx
	 */
	public class Main {		
		private var demoScene:Scene3D;
		private var camera: Camera;

		public function Main() {
			Laya3D.init(0,0);
			Stat.show();
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			Shader3D.debugMode = true;
    
			Scene3D.load("res/testNewFunction/LayaScene_depthScene/Conventional/depthScene.ls", Handler.create(this, function (scene: Scene3D): void {
				this.demoScene =Laya.stage.addChild(scene) as Scene3D;  
				this.camera= scene.getChildByName("Camera") as Camera;
				//this.camera.addComponent(CameraMoveScript);
				this.camera.active = true; 
				this.receaveRealShadow(this.demoScene);
			}));
		}
		
		public function receaveRealShadow(scene3d:Scene3D):void
		{
			var childLength:Number = scene3d.numChildren;
			for(var i:Number = 0;i<childLength;i++)
			{
				var childSprite:Node = scene3d.getChildAt(i);
				if(childSprite instanceof MeshSprite3D)
				{
					childSprite.meshRenderer.receiveShadow = true;
					childSprite.meshRenderer.castShadow = true;
				}
				else if(childSprite instanceof SpotLight)
				{
					childSprite.shadowMode = ShadowMode.Hard;
					// Set shadow max distance from camera.
					childSprite.shadowDistance = 3;
					// Set shadow resolution.
					childSprite.shadowResolution = 512;
					// set shadow Bias
					childSprite.shadowDepthBias = 1.0;
				}
			}
		}
		
	}

}