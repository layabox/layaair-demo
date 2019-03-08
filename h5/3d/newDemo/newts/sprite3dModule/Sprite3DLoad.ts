import CameraMoveScript from "./common/CameraMoveScript"
class Sprite3DLoad {
    constructor() {
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        
        var scene:Laya.Scene3D = Laya.stage.addChild(new Laya.Scene3D()) as Laya.Scene3D;
        scene.ambientColor = new Laya.Vector3(1, 1, 1);
        
        var camera:Laya.Camera = scene.addChild(new Laya.Camera(0, 0.1, 100)) as Laya.Camera;
        camera.transform.translate(new Laya.Vector3(0, 0.5, 1));
        camera.transform.rotate(new Laya.Vector3( -15, 0, 0), true, false);
        camera.addComponent(CameraMoveScript);
        
        Laya.Sprite3D.load("res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", Laya.Handler.create(null, function(sprite:Laya.Sprite3D):void {
            scene.addChild(sprite);
        }));
    }
}
new Sprite3DLoad;