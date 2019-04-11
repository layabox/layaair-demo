class ParticleBurningGround{
    constructor(){
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        let scene = Laya.stage.addChild(new Laya.Scene3D());
        let camera = scene.addChild(new Laya.Camera(0, 0.1, 100));
        camera.clearColor.setValue(0, 0, 0, 1);
        camera.transform.translate(new Laya.Vector3(0, 2, 4));
        camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
        Laya.Sprite3D.load("res/threeDimen/particle/ETF_Burning_Ground.lh", Laya.Handler.create(this, function (sprite) {
                scene.addChild(sprite);
        }));
    }
}
//激活启动类
new ParticleBurningGround();