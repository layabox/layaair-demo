class TextureDemo {
	constructor() {
		Laya3D.init(0, 0);
		Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
		Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
		Laya.Stat.show();
		
		var scene = Laya.stage.addChild(new Laya.Scene3D());
		
		var camera = scene.addChild(new Laya.Camera(0, 0.1, 100));
		camera.transform.translate(new Laya.Vector3(0, 2, 5));
		camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
		camera.addComponent(CameraMoveScript);
		camera.clearColor = new Laya.Vector4(0.2, 0.2, 0.2, 1.0);
		
		var directionLight = scene.addChild(new Laya.DirectionLight());
		//设置平行光的方向
		var mat = directionLight.transform.worldMatrix;
		mat.setForward(new Laya.Vector3(-1.0, -1.0, -1.0));
		directionLight.transform.worldMatrix=mat;
		
		this.sprite3D = scene.addChild(new Laya.Sprite3D());
		
		//正方体
		var box = this.sprite3D.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(0.5, 0.5, 0.5)));
		box.transform.position = new Laya.Vector3(0.0, 1.0, 2.5);
		box.transform.rotate(new Laya.Vector3(0, 0, 0), false, false);
		var mater = new Laya.BlinnPhongMaterial();
		//漫反射贴图
		Laya.Texture2D.load("res/threeDimen/texture/layabox.png", Laya.Handler.create(null, function(texture) {
			//在U方向上使用WARPMODE_CLAMP
			texture.wrapModeU = Laya.BaseTexture.WARPMODE_CLAMP;
			//在V方向使用WARPMODE_REPEAT
			texture.wrapModeV = Laya.BaseTexture.WARPMODE_REPEAT;
			//设置过滤方式
			texture.filterMode = Laya.BaseTexture.FILTERMODE_BILINEAR;
			//设置各向异性等级
			texture.anisoLevel = 2;
			
			mater.albedoTexture = texture;
			//修改材质贴图的平铺和偏移
			var tilingOffset = mater.tilingOffset;
			tilingOffset.setValue(2, 2, 0, 0);
			mater.tilingOffset = tilingOffset;
			
			box.meshRenderer.material =mater;
		}));
		
	}
}

new TextureDemo();