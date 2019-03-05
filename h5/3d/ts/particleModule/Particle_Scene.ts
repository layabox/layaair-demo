import CameraMoveScript from "./common/CameraMoveScript"
class Particle_Scene {
    constructor() {
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        
        Laya.Scene3D.load("../res/threeDimen/scene/ParticleScene/Example_01.ls", Laya.Handler.create(null, function(sprite:Laya.Scene3D):void {
            var scene:Laya.Scene3D = Laya.stage.addChild(sprite) as Laya.Scene3D;
            var camera:Laya.Camera = scene.addChild(new Laya.Camera(0, 0.1, 100)) as Laya.Camera;
            camera.transform.translate(new Laya.Vector3(0, 1, 0));
            camera.addComponent(CameraMoveScript);
        }))
    }
}
new Particle_Scene;