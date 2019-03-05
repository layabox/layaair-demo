import CameraMoveScript from "./common/CameraMoveScript"
class SpotLightDemo {
    private _quaternion:Laya.Quaternion = new Laya.Quaternion();
    private _direction:Laya.Vector3 = new Laya.Vector3();

    constructor() {
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        
        var scene:Laya.Scene3D = Laya.stage.addChild(new Laya.Scene3D()) as Laya.Scene3D;
        
        var camera:Laya.Camera = (scene.addChild(new Laya.Camera(0, 0.1, 1000))) as Laya.Camera;
        camera.transform.translate(new Laya.Vector3(0, 0.7, 1.3));
        camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
        camera.addComponent(CameraMoveScript);
        
        //聚光灯
        var spotLight:Laya.SpotLight = scene.addChild(new Laya.SpotLight()) as Laya.SpotLight;
        spotLight.color = new Laya.Vector3(1, 1, 0);
        spotLight.transform.position = new Laya.Vector3(0.0, 1.2, 0.0);
        spotLight.transform.worldMatrix.setForward(new Laya.Vector3(0.15, -1.0, 0.0));
        spotLight.range = 6.0;
        spotLight.spotAngle = 32;
    
     
        
        Laya.Sprite3D.load("../res/threeDimen/staticModel/grid/plane.lh", Laya.Handler.create(this, function(sprite:Laya.Sprite3D):void {
            scene.addChild(sprite) as Laya.Sprite3D;
            Laya.Sprite3D.load("../res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", Laya.Handler.create(this, function(layaMonkey:Laya.Sprite3D):void {
                scene.addChild(layaMonkey) as Laya.Sprite3D;
                var aniSprite3d:Laya.Sprite3D = layaMonkey.getChildAt(0) as Laya.Sprite3D;
                var animator:Laya.Animator = aniSprite3d.getComponent(Laya.Animator) as Laya.Animator;
                
                var state:Laya.AnimatorState = new Laya.AnimatorState();
                state.name = "happy";
                state.clipStart = 115 / 150;
                state.clipEnd = 150 / 150;
                state.clip = animator.getDefaultState().clip;
                animator.addState(state);
                
                animator.play("happy");
                
                Laya.timer.frameLoop(1, this, function():void {
                    Laya.Quaternion.createFromYawPitchRoll(0.025, 0, 0, this._quaternion);
                    spotLight.transform.worldMatrix.getForward(this._direction);
                    Laya.Vector3.transformQuat(this._direction, this._quaternion, this._direction);
                    spotLight.transform.worldMatrix.setForward(this._direction);
                });
            }));
        
        }));
    }
}
new SpotLightDemo;