class GPUTransparentTexture{
	constructor(){
		//初始化引擎
		Laya3D.init(0, 0);
		//显示性能面板
		Laya.Stat.show();
		Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
		Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
	
		//unity纹理压缩功能导出时会分为三个平台的资源，根据平台来区分使用
		//如果是在Android平台
		if(Laya.Browser.onAndroid){
			Laya.Scene3D.load("res/threeDimen/scene/LayaScene_GPUTransparentTexture/Android/layaScene.ls", Laya.Handler.create(null, function(scene) {
			Laya.stage.addChild(scene);
			var camera = scene.getChildByName("Main Camera");
			camera.addComponent(CameraMoveScript);
			}));
		}
		//如果是在IOS平台
		else if(Laya.Browser.onIOS){
			Laya.Scene3D.load("res/threeDimen/scene/LayaScene_GPUTransparentTexture/IOS/layaScene.ls", Laya.Handler.create(null, function(scene) {
			Laya.stage.addChild(scene);
			var camera = scene.getChildByName("Main Camera");
			camera.addComponent(CameraMoveScript);
			}));
		}
		//如果是在通用平台
		else{
			Laya.Scene3D.load("res/threeDimen/scene/LayaScene_GPUTransparentTexture/Conventional/layaScene.ls", Laya.Handler.create(null, function(scene) {
			Laya.stage.addChild(scene);
			var camera = scene.getChildByName("Main Camera");
			camera.addComponent(CameraMoveScript);
			}));
		}
	}
}
//激活启动类
new GPUTransparentTexture();