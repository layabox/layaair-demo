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
            this.camera = scene.getChildByName("Main Camera");
            //加入摄像机移动控制脚本
           // this.camera.addComponent(CameraMoveScript);
            //增加后期处理
            var postProcess = new Laya.PostProcess();
            //增加后期处理泛光效果
            var bloom = new Laya.BloomEffect();
            postProcess.addEffect(bloom);
            this.camera.postProcess = postProcess;
            this.camera.enableHDR = true;
            //设置泛光参数
            bloom.intensity = 5;
            bloom.threshold = 0.90;
            bloom.softKnee = 0.5;
            bloom.clamp = 65472;
            bloom.diffusion = 5;
            bloom.anamorphicRatio = 0.0;
            bloom.color = new Laya.Color(1, 1, 1, 1);
            bloom.fastMode = true;
            //增加污渍纹理参数
            Laya.Texture2D.load("res/threeDimen/scene/LayaScene_BloomScene/Conventional/Assets/LensDirt01.png", Laya.Handler.create(this, function(tex) {
                bloom.dirtTexture = tex;
                bloom.dirtIntensity = 4.0;
            }));

            //加载UI
			this.loadUI();
        }));
    }

    loadUI() {
        Laya.loader.load(["res/threeDimen/ui/button.png"], Laya.Handler.create(this, function() {
            var button = Laya.stage.addChild(new Laya.Button("res/threeDimen/ui/button.png", "关闭HDR"));
            button.size(200, 40);
            button.labelBold = true;
            button.labelSize = 30;
            button.sizeGrid = "4,4,4,4";
            button.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
            button.pos(Laya.stage.width / 2 - button.width * Laya.Browser.pixelRatio / 2, Laya.stage.height - 60 * Laya.Browser.pixelRatio);
            button.on(Laya.Event.CLICK, this, function() {
                let enableHDR = this.camera.enableHDR;
                if (enableHDR)
                    button.label = "开启HDR";
                else
                    button.label = "关闭HDR";
					this.camera.enableHDR = !enableHDR;
            });
        
        }));
    }
}
//启动激活类
new PostProcessBloom();