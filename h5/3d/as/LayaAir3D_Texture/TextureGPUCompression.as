package LayaAir3D_Texture {
	import common.CameraMoveScript;
	import laya.d3.core.Camera;
	import laya.d3.core.scene.Scene3D;
	import laya.display.Stage;
	import laya.net.URL;
	import laya.utils.Browser;
	import laya.utils.Handler;
	import laya.utils.Stat;
	import laya.webgl.WebGL;
	
	public class TextureGPUCompression {
		public function TextureGPUCompression() {
			Laya3D.init(0, 0);
			Stat.show();
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			
			if (Browser.onAndroid)
				URL.basePath = "res/threeDimen/scene/LayaScene_TextureGPUCompression/Android/";
			else if (Browser.onIOS)
				URL.basePath = "res/threeDimen/scene/LayaScene_TextureGPUCompression/IOS/";
			else
				URL.basePath = "res/threeDimen/scene/LayaScene_TextureGPUCompression/Conventional/";
			
			Scene3D.load("scene.ls", Handler.create(this, function(scene:Scene3D):void {
				Laya.stage.addChild(scene) as Scene3D;
				var camera:Camera = scene.getChildByName("Main Camera") as Camera;
				camera.addComponent(CameraMoveScript);
			}));
		
		}
	
	}

}