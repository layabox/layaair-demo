class SkyDomeSample {
    constructor() {
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        var scene:Laya.Scene3D = Laya.stage.addChild(new Laya.Scene3D()) as Laya.Scene3D;
        
        var camera:Laya.Camera = scene.addChild(new Laya.Camera(0, 0.1, 100)) as Laya.Camera;
        camera.transform.rotate(new Laya.Vector3( 10, 0, 0), true, false);
        camera.addComponent(CameraMoveScript);
        camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;
        
        //天空盒
        Laya.BaseMaterial.load("../../res/threeDimen/skyBox/DawnDusk/SkyBox.lmat", Laya.Handler.create(null, function(mat:Laya.SkyBoxMaterial):void {
            camera.skyboxMaterial = mat;
            var exposureNumber:number = 0;
            Laya.timer.frameLoop(1, this, function():void {
                mat.exposure = Math.sin(exposureNumber += 0.01) + 1;
            });
        }))
    }
}
new SkyDomeSample;