class RenderTargetCamera{
    constructor(){
        //初始化引擎
        Laya3D.init(1000, 500);            
        //适配模式
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        //开启统计信息
        Laya.Stat.show(); 

		//预加载角色动画资源
        Laya.loader.create("res/threeDimen/scene/CourtyardScene/Courtyard.ls",Laya.Handler.create(this,this.onComplete));	
    }

    onComplete(){
		//加载场景
		var scene = Laya.loader.getRes("res/threeDimen/scene/CourtyardScene/Courtyard.ls");
		Laya.stage.addChild(scene);  
		//添加相机
		var camera = scene.addChild(new Laya.Camera(0, 0.1, 1000));
		camera.transform.translate(new Laya.Vector3(57, 2.5, 58));
		camera.transform.rotate(new Laya.Vector3( -10, 150, 0), true, false);
		//设置相机清除标识
		camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;
		//相机添加视角控制组件(脚本)
		camera.addComponent(CameraMoveScript);
			
		//渲染到纹理的相机
		var renderTargetCamera = scene.addChild(new Laya.Camera(0, 0.1, 1000));
		renderTargetCamera.transform.translate(new Laya.Vector3(57, 2.5, 58));
		renderTargetCamera.transform.rotate(new Laya.Vector3( -10, 150, 0), true, false);
		//选择渲染目标为纹理
		renderTargetCamera.renderTarget = new Laya.RenderTexture(2048, 2048);
		//渲染顺序
		renderTargetCamera.renderingOrder = -1;
		//相机添加视角控制组件(脚本)
		renderTargetCamera.addComponent(CameraMoveScript);
			
		//创建网格精灵
		var renderTargetObj = scene.getChildAt(0).getChildByName("RenderTarget");
			
        Laya.loader.load("res/threeDimen/ui/button.png", Laya.Handler.create(null, function() {
            var changeActionButton = Laya.stage.addChild(new Laya.Button("res/threeDimen/ui/button.png", "渲染目标"));
            changeActionButton.size(160, 40);
            changeActionButton.labelBold = true;
            changeActionButton.labelSize = 30;
            changeActionButton.sizeGrid = "4,4,4,4";
            changeActionButton.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
            changeActionButton.pos(Laya.stage.width / 2 - changeActionButton.width * Laya.Browser.pixelRatio / 2, Laya.stage.height - 100 * Laya.Browser.pixelRatio);
            changeActionButton.on(Laya.Event.CLICK, this, function() {
				//设置网格精灵的纹理
				(renderTargetObj.meshRenderer.material).albedoTexture = renderTargetCamera.renderTarget;
            });
        }));
    }
}

//激活启动类
new RenderTargetCamera();