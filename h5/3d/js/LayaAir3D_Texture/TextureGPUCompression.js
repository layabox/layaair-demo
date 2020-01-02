class TextureGPUCompression{
    constructor(){
        Laya3D.init(0, 0);
        Laya.Stat.show();
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;

        if (Laya.Browser.onAndroid)
			Laya.URL.basePath = "res/Android/";
		else if (Laya.Browser.onIOS)
        Laya.URL.basePath = "res/IOS/";
		else
        Laya.URL.basePath = "res/Conventional/";
        Laya.Scene3D.load("scene.ls", Laya.Handler.create(this, function(scene) {
            Laya.stage.addChild(scene);
            let camera = scene.getChildByName("Main Camera");
            camera.addComponent(CameraMoveScript);
        }));
        
    }
}

//激活启动类
new TextureGPUCompression();