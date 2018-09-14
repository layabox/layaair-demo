
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        //添加场景
        Laya.loader.create([
            "res/threeDimen/scene/CourtyardScene/Courtyard.ls"
        ], Laya.Handler.create(this, this.onComplete));
    function onComplete() 
    {
        var scene = Laya.stage.addChild(Laya.Loader.getRes("res/threeDimen/scene/CourtyardScene/Courtyard.ls"));
        //添加摄像机，并渲染天空盒
        var camera = scene.addChild(new Laya.Camera(0, 0.1, 1000));
        camera.transform.translate(new Laya.Vector3(57, 2.5, 58));
        camera.transform.rotate(new Laya.Vector3(-10, 150, 0), true, false);
        camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;
        camera.addComponent(CameraMoveScript);
        var renderTargetCamera = scene.addChild(new Laya.Camera(0, 0.1, 1000));
        renderTargetCamera.transform.translate(new Laya.Vector3(57, 2.5, 58));
        renderTargetCamera.transform.rotate(new Laya.Vector3(-10, 150, 0), true, false);
        //设置质量
        renderTargetCamera.renderTarget = new Laya.RenderTexture(2048, 2048);
        //渲染顺序
        renderTargetCamera.renderingOrder = -1;
        //添加移动脚本
        renderTargetCamera.addComponent(CameraMoveScript);
        //得到场景中的要渲染的板 
        var renderTargetObj = scene.getChildAt(0).getChildByName("RenderTarget");
        //添加按钮
        Laya.loader.load(["res/threeDimen/ui/button.png"], Laya.Handler.create(null, function () {
            var changeActionButton = Laya.stage.addChild(new Laya.Button("res/threeDimen/ui/button.png", "渲染目标"));
            changeActionButton.size(160, 40);
            changeActionButton.labelBold = true;
            changeActionButton.labelSize = 30;
            changeActionButton.sizeGrid = "4,4,4,4";
            changeActionButton.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
            changeActionButton.pos(Laya.stage.width / 2 - changeActionButton.width * Laya.Browser.pixelRatio / 2, Laya.stage.height - 100 * Laya.Browser.pixelRatio);
            changeActionButton.on(Laya.Event.CLICK, this, function () {
                //按下后渲染到板上
                renderTargetObj.meshRenderer.material.albedoTexture = renderTargetCamera.renderTarget;
            });
        }));
    };
