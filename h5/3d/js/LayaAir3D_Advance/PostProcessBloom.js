class PostProcessBloom {
    constructor() {
        //初始化引擎
        Laya3D.init(0, 0);
        Laya.Stat.show();
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        this.rotation = new Laya.Vector3(0, 0.01, 0);
        //加载场景
        Laya.Scene3D.load("res/threeDimen/scene/LayaScene_BloomScene/Conventional/BloomScene.ls", Laya.Handler.create(this, function(scene) {
            Laya.stage.addChild(scene);
            
            //获取场景中的相机
            var camera = scene.getChildByName("Main Camera");
            //加入摄像机移动控制脚本
            camera.addComponent(CameraMoveScript);
            
            var postProcess = new Laya.PostProcess();
            var bloom = new Laya.BloomEffect();
            postProcess.addEffect(bloom);
            camera.postProcess = postProcess;
            
            bloom.intensity = 5;
            bloom.threshold = 0.90;
            bloom.softKnee = 0.5;
            bloom.clamp = 65472;
            bloom.diffusion = 7;
            bloom.anamorphicRatio = 0.0;
            bloom.color = new Laya.Color(1, 1, 1, 1);
            bloom.fastMode = true;
        }));
    }
}
//启动激活类
new PostProcessBloom();