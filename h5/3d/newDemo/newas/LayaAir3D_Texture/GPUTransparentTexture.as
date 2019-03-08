package OfficialExample.LayaAir3D_Texture 
{
	import common.CameraMoveScript;
	import laya.d3.core.Camera;
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.material.BlinnPhongMaterial;
	import laya.d3.core.scene.Scene3D;
	import laya.display.Stage;
	import laya.utils.Handler;
	import laya.utils.Stat;
	import laya.utils.Browser;
	
	public class GPUTransparentTexture {
		public function GPUTransparentTexture() {
			//初始化引擎
			Laya3D.init(0, 0);
			//显示性能面板
			Stat.show();
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
		
			//unity纹理压缩功能导出时会分为三个平台的资源，根据平台来区分使用
			//如果是在Android平台
			if(Browser.onAndroid){
				Scene3D.load("res/threeDimen/scene/LayaScene_GPUTransparentTexture/Android/layaScene.ls", Handler.create(null, function(scene:Scene3D):void {
				Laya.stage.addChild(scene) as Scene3D;
				var camera:Camera = scene.getChildByName("Main Camera") as Camera;
				camera.addComponent(CameraMoveScript);
				}));
			}
			//如果是在IOS平台
			else if(Browser.onIOS){
				Scene3D.load("res/threeDimen/scene/LayaScene_GPUTransparentTexture/IOS/layaScene.ls", Handler.create(null, function(scene:Scene3D):void {
				Laya.stage.addChild(scene) as Scene3D;
				var camera:Camera = scene.getChildByName("Main Camera") as Camera;
				camera.addComponent(CameraMoveScript);
				}));
			}
			//如果是在通用平台
			else{
				Scene3D.load("res/threeDimen/scene/LayaScene_GPUTransparentTexture/Conventional/layaScene.ls", Handler.create(null, function(scene:Scene3D):void {
				Laya.stage.addChild(scene) as Scene3D;
				var camera:Camera = scene.getChildByName("Main Camera") as Camera;
				camera.addComponent(CameraMoveScript);
				}));
			}
		
		}
	
	}

}