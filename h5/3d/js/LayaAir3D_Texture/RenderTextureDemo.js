class RenderTextureDemo
{
     constructor()
	{
		Laya3D.init(0, 0);
		Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
		Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        this.box = null;
		
		 Laya.loader.create([
			"res/threeDimen/scene/CourtyardScene/Courtyard.ls"
		], Laya.Handler.create(this, this.onComplete));
	}
	
	onComplete() {
		
		//加载场景
		var scene = Laya.stage.addChild(Laya.Loader.getRes("res/threeDimen/scene/CourtyardScene/Courtyard.ls"));
		//添加相机
		var camera = new Laya.Camera(0, 0.1, 1000);
		scene.addChild(camera);
		camera.transform.translate(new Laya.Vector3(57, 2.5, 58));
		camera.transform.rotate(new Laya.Vector3( -10, 150, 0), true, false);
		//设置相机清除标识
		camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;
		//相机添加视角控制组件(脚本)
		camera.addComponent(CameraMoveScript);
		
		//渲染到纹理的相机
		var renderTargetCamera = new Laya.Camera(0, 0.1, 1000);
		scene.addChild(renderTargetCamera);
		renderTargetCamera.transform.translate(new Laya.Vector3(57, 2.5, 58));
		renderTargetCamera.transform.rotate(new Laya.Vector3( -10, 150, 0), true, false);
		//选择渲染目标为纹理
		renderTargetCamera.renderTarget = new Laya.RenderTexture(2048, 2048);
		//设置深度格式
		//renderTargetCamera.renderTarget.depthStencilFormat = Laya.BaseTexture.FORMAT_DEPTH_16;
		//渲染顺序
		renderTargetCamera.renderingOrder = -1;
		//相机添加视角控制组件(脚本)
		renderTargetCamera.addComponent(CameraMoveScript);
		
		//创建精灵
		var sprite3D = new Laya.Sprite3D();
		scene.addChild(sprite3D);
		//创建MeshSprite3D
		this.box = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(4, 4, 4));
		sprite3D.addChild(this.box);
		//精灵进行平移
		sprite3D.transform.translate(new Laya.Vector3( 55, 2, 65));
		//创建BlinnPhong材质
		var boxMaterial = new Laya.BlinnPhongMaterial();
		//创建纹理
		var boxTexture = new Laya.Texture2D(2048, 2048);
		//设置材质的纹理
		boxMaterial.albedoTexture = boxTexture;
		this.box.meshRenderer.material = boxMaterial;
		
		var renderTargetObj = scene.getChildAt(0).getChildByName("RenderTarget");
		
		Laya.loader.load(["res/threeDimen/ui/button.png"], Laya.Handler.create(this, function() {
			var changeActionButton = Laya.stage.addChild(new Laya.Button("res/threeDimen/ui/button.png", "渲染目标"));
			changeActionButton.size(160, 40);
			changeActionButton.labelBold = true;
			changeActionButton.labelSize = 30;
			changeActionButton.sizeGrid = "4,4,4,4";
			changeActionButton.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
			changeActionButton.pos(Laya.stage.width / 2 - changeActionButton.width * Laya.Browser.pixelRatio / 2, Laya.stage.height - 100 * Laya.Browser.pixelRatio);
			changeActionButton.on(Laya.Event.CLICK, this, function() {
				//将相机的渲染目标作为纹理传递给BlinnPhong材质的纹理
				(renderTargetObj.meshRenderer.material).albedoTexture = renderTargetCamera.renderTarget;
				var boxMaterial = this.box.meshRenderer.material;
				//获取BlinnPhong材质的纹理
				var tex = boxMaterial.albedoTexture;
				//获取相机渲染目标的像素数据,默认renderTarget的颜色为RGBA
				var out = new Uint8Array(2048*2048*4); 
				renderTargetCamera.renderTarget.getData(0, 0, 2048, 2048, out);
				//设置纹理的填充像素像素
				tex.setPixels(out);
				tex.generateMipmap();
			});
		}));
	}
}


//激活启动类
new RenderTextureDemo();