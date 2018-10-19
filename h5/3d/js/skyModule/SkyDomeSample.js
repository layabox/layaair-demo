class SkyDomeSample{
    constructor(){
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        var scene = Laya.stage.addChild(new Laya.Scene3D());
        this.camera = scene.addChild(new Laya.Camera(0, 0.1, 100));
        this.camera.transform.rotate(new Laya.Vector3(10, 0, 0), true, false);
        this.camera.addComponent(CameraMoveScript);
        this.camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;
        this.exposureNumber = 0;
        //天空盒
        Laya.BaseMaterial.load("res/threeDimen/skyBox/DawnDusk/SkyBox.lmat", Laya.Handler.create(this, this.loadMaterial));
    }

    loadMaterial(mat){
        this.camera.skyboxMaterial = mat;    
        Laya.timer.frameLoop(1, this, this.onFrameLoop);
    }

    onFrameLoop(){
        this.camera.skyboxMaterial.exposure = Math.sin(this.exposureNumber += 0.01) + 1;
    }
}

//激活启动类
new SkyDomeSample();
