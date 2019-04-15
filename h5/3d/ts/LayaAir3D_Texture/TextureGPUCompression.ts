import CameraMoveScript from "./common/CameraMoveScript"
class TextureGPUCompression{
    constructor(){
        Laya3D.init(0, 0);
        Laya.Stat.show();
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
    
        
        if(Laya.Browser.onAndroid){
            Laya.Scene3D.load("res/threeDimen/scene/LayaScene_TextureGPUCompression/Android/scene.ls", Laya.Handler.create(this, function(scene) {
            Laya.stage.addChild(scene);
            var camera = scene.getChildByName("Main Camera");
            camera.addComponent(CameraMoveScript);
            }));
        }
        else if(Laya.Browser.onIOS){
            Laya.Scene3D.load("res/threeDimen/scene/LayaScene_TextureGPUCompression/IOS/scene.ls", Laya.Handler.create(this, function(scene) {
            Laya.stage.addChild(scene);
            var camera = scene.getChildByName("Main Camera");
            camera.addComponent(CameraMoveScript);
            }));
        }
        else{
            Laya.Scene3D.load("res/threeDimen/scene/LayaScene_TextureGPUCompression/Conventional/scene.ls", Laya.Handler.create(this, function(scene) {
            Laya.stage.addChild(scene);
            var camera = scene.getChildByName("Main Camera");
            camera.addComponent(CameraMoveScript);
            }));
        }
    }
}

//激活启动类
new TextureGPUCompression();