class RenderTargetTo2DSprite{
    constructor(){
        //初始化引擎
        Laya3D.init(1000, 500);            
        //适配模式
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        //开启统计信息
        Laya.Stat.show(); 

		//预加载角色动画资源
        Laya.loader.create("res/threeDimen/scene/LayaScene_city01/Conventional/city01.ls",Laya.Handler.create(this,this.onComplete));	
    }

    onComplete(){
		//加载场景
		let scene = Laya.loader.getRes("res/threeDimen/scene/LayaScene_city01/Conventional/city01.ls");
		Laya.stage.addChild(scene);  
		//添加相机
		var camera = scene.getChildByName("Main Camera");
		//相机添加视角控制组件(脚本)
		camera.addComponent(CameraMoveScript);

		//增加个小猴
		Laya.Sprite3D.load("res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", Laya.Handler.create(this, function (layaMonkey) {
			scene.addChild(layaMonkey);
			layaMonkey.transform.localScale = new Laya.Vector3(0.5, 0.5, 0.5);
			layaMonkey.transform.rotate(new Laya.Vector3(0, 180, 0), true, false);
			layaMonkey.transform.position = new Laya.Vector3(-28.8, 5, -53);
		}));

			
		//渲染到纹理的相机
		let renderTargetCamera = scene.addChild(new Laya.Camera(0, 0.1, 1000));
		renderTargetCamera.transform.translate(new Laya.Vector3(57, 2.5, 58));
		renderTargetCamera.transform.rotate(new Laya.Vector3( -10, 150, 0), true, false);
		//选择渲染目标为纹理
		renderTargetCamera.renderTarget = new Laya.RenderTexture(2048, 2048);
		//渲染顺序
		renderTargetCamera.renderingOrder = -1;
		//相机添加视角控制组件(脚本)
		renderTargetCamera.addComponent(CameraMoveScript);
			
        Laya.loader.load("res/threeDimen/ui/button.png", Laya.Handler.create(null, function() {
            let changeActionButton = Laya.stage.addChild(new Laya.Button("res/threeDimen/ui/button.png", "渲染到2DSprite"));
            changeActionButton.size(240, 40);
            changeActionButton.labelBold = true;
            changeActionButton.labelSize = 30;
            changeActionButton.sizeGrid = "4,4,4,4";
            changeActionButton.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
            changeActionButton.pos(Laya.stage.width / 2 - changeActionButton.width * Laya.Browser.pixelRatio / 2, Laya.stage.height - 100 * Laya.Browser.pixelRatio);
            changeActionButton.on(Laya.Event.CLICK, this, function() {
				//渲染到纹理的相机
				var renderTargetCamera = scene.addChild(new Laya.Camera(0, 0.3, 1000));
				renderTargetCamera.transform.position = new Laya.Vector3(-28.8, 8, -60);
				renderTargetCamera.transform.rotate(new Laya.Vector3(0, 180, 0), true, false);
				//选择渲染目标为纹理
				renderTargetCamera.renderTarget = new Laya.RenderTexture(512, 512);
				//渲染顺序
				renderTargetCamera.renderingOrder = -1;
				//清除标记
				renderTargetCamera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;
				var rtex = new Laya.Texture(renderTargetCamera.renderTarget, Laya.Texture.DEF_UV);
				var sp = new Laya.Sprite();
				Laya.stage.addChild(sp);
				sp.graphics.drawTexture(rtex);
            });
        }));
    }
}

//激活启动类
new RenderTargetTo2DSprite();