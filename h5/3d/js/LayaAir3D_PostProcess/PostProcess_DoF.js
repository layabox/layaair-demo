
     class PostProcessDoF {
        constructor() {
            Laya3D.init(0, 0);
            Laya.stage.scaleMode = Stage.SCALE_FULL;
            Laya.stage.screenMode = Stage.SCREEN_NONE;
            Stat.show();
            Shader3D.debugMode = true;
            Laya.loader.create("res/threeDimen/LayaScene_zhuandibanben/Conventional/zhuandibanben.ls", Handler.create(this, this.onComplate));
        }
        onComplate() {
            let scene = this.scene = Loader.getRes("res/threeDimen/LayaScene_zhuandibanben/Conventional/zhuandibanben.ls");
            Laya.stage.addChild(scene);
            let camera = this.camera = scene.getChildByName("MainCamera");
            camera.addComponent(CameraMoveScript);
            let mainCamera = scene.getChildByName("BlurCamera");
            mainCamera.removeSelf();
            camera.depthTextureMode |= DepthTextureMode.Depth;
            let postProcess = new PostProcess();
            camera.postProcess = postProcess;
            let gaussianDoF = new GaussianDoF();
            console.log(gaussianDoF);
            postProcess.addEffect(gaussianDoF);
            gaussianDoF.farStart = 1;
            gaussianDoF.farEnd = 5;
            gaussianDoF.maxRadius = 1.0;
        }
    }

    new PostProcessDoF();