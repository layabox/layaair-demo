import CameraMoveScript from "./common/CameraMoveScript"
class LoadResourceDemo{
	private _scene:Laya.Scene3D;
	private sprite3D:Laya.Sprite3D;
    constructor(){
        this._scene =null;
        this.sprite3D =null;
        //初始化引擎
		Laya3D.init(0, 0);
		Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
		Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
		//显示性能面板
		Laya.Stat.show();
			
		//加载资源
		this.LoadRes();
			
		//批量预加载方式
		//this.PreloadingRes();
    }
    LoadRes(){
        //场景加载
		Laya.Scene3D.load("res/threeDimen/scene/TerrainScene/XunLongShi.ls", Laya.Handler.create(this, function(scene) {
				this._scene = scene;
				Laya.stage.addChild(scene);
				//获取场景相机
				var camera = scene.getChildByName("Main Camera");
				camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;
				camera.addComponent(CameraMoveScript);
				//添加光照
				var directionLight = this._scene.addChild(new Laya.DirectionLight());
				directionLight.color = new Laya.Vector3(1, 1, 1);
				directionLight.transform.rotate(new Laya.Vector3( -3.14 / 3, 0, 0));
				
				//材质加载
				Laya.BaseMaterial.load("res/threeDimen/skyBox/skyBox3/skyBox3.lmat", Laya.Handler.create(this, function(mat) {
					camera.skyboxMaterial = mat;
				}));
				
				(scene.getChildByName('Scenes').getChildByName('HeightMap')).active = false;
				(scene.getChildByName('Scenes').getChildByName('Area') ).active = false;
				this.sprite3D = this._scene.addChild(new Laya.Sprite3D());
				
				//创建内置立方体
				var box = scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(10, 10, 10)));
				box.transform.translate(new Laya.Vector3(10, 10, -8));
				//创建BlinnPhongMaterial材质
				var boxMat = new Laya.BlinnPhongMaterial();
				//加载纹理
				Laya.Texture2D.load("res/threeDimen/Physics/wood.jpg", Laya.Handler.create(this, function(tex) {
					boxMat.albedoTexture = tex;
				}));
				//设置纹理平铺和偏移
				boxMat.tilingOffset = new Laya.Vector4(2, 2, 0, 0);
				//设置材质
				box.meshRenderer.material = boxMat;
				
				//加载Mesh
				Laya.Mesh.load("res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/LayaMonkey-LayaMonkey.lm", Laya.Handler.create(this, function(mesh) {
				    var layaMonkey = this.sprite3D.addChild(new Laya.MeshSprite3D(mesh));
				    layaMonkey.transform.localScale = new Laya.Vector3(4, 4, 4);
				    layaMonkey.transform.rotation = new Laya.Quaternion(0.7071068, 0, 0, -0.7071067);
				    layaMonkey.transform.translate(new Laya.Vector3(0, 0, 7));
				    layaMonkey.transform.rotate(new Laya.Vector3(0, 180, 0), false, false);
				}));
				//加载精灵
				Laya.Sprite3D.load("res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", Laya.Handler.create(this, function(sp) {
				    var layaMonkey2 = scene.addChild(sp);
				    layaMonkey2.transform.localScale = new Laya.Vector3(4, 4, 4);
				    layaMonkey2.transform.translate(new Laya.Vector3(-10, 13, 0));
				    layaMonkey2.transform.rotate(new Laya.Vector3(0, 180, 0), false, false);
				}));
	
			}));
    }
    //批量预加载方式
    PreloadingRes(){
        //预加载所有资源
		var resource = [
            {url: "res/threeDimen/scene/TerrainScene/XunLongShi.ls", clas: Laya.Scene3D, priority: 1},  
            {url: "res/threeDimen/skyBox/skyBox3/skyBox3.lmat", clas: Laya.BaseMaterial, priority: 1, constructParams: [512, 512, 1, true, true]},
            {url: "res/threeDimen/Physics/wood.jpg", clas: Laya.Texture2D, priority: 1, constructParams: [64, 64, 1, true, true]},
            {url: "res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/LayaMonkey-LayaMonkey.lm", clas: Laya.Mesh, priority: 1, constructParams: [32, 32, 1, true, true]},
            {url: "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", clas: Laya.Sprite3D, priority: 1, constructParams: [1024, 512, 1, true, true]},];
            Laya.loader.create(resource, Laya.Handler.create(this, this.onPreLoadFinish));	
    }
    onPreLoadFinish(){
        //初始化3D场景
			this._scene = Laya.stage.addChild(Laya.Loader.getRes("res/threeDimen/scene/TerrainScene/XunLongShi.ls")) as Laya.Scene3D;
			
			//获取相机
			var camera = this._scene.getChildByName("Main Camera") as Laya.Camera;
			//设置相机清楚标记，使用天空
			camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;
			//相机视角控制组件(脚本)
			camera.addComponent(CameraMoveScript);
			
			//添加光照
			var directionLight = new Laya.DirectionLight();
			this._scene.addChild(directionLight);
			//光照颜色
			directionLight.color = new Laya.Vector3(1, 1, 1);
			directionLight.transform.rotate(new Laya.Vector3( -3.14 / 3, 0, 0));
			
			//使用材质
			var skyboxMaterial = Laya.Loader.getRes("res/threeDimen/skyBox/skyBox3/skyBox3.lmat");
			var skyRenderer = camera.skyRenderer;
			skyRenderer.mesh = Laya.SkyBox.instance;
			skyRenderer.material = skyboxMaterial;
			
			//激活场景中的子节点
			(this._scene.getChildByName('Scenes').getChildByName('HeightMap')).active = false;
			(this._scene.getChildByName('Scenes').getChildByName('Area')).active = false;
			
			
			//使用纹理
			var box = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(10, 10, 10));
			this._scene.addChild(box);
			box.transform.translate(new Laya.Vector3(10, 10, -8));
			var boxMat = new Laya.BlinnPhongMaterial();
			boxMat.albedoTexture = Laya.Loader.getRes("res/threeDimen/Physics/wood.jpg");
			boxMat.tilingOffset = new Laya.Vector4(2, 2, 0, 0);
			box.meshRenderer.material = boxMat;
			
			//创建一个精灵
			this.sprite3D = new Laya.Sprite3D();
			this._scene.addChild(this.sprite3D);
			//获取Mesh资源
			var mesh = Laya.Loader.getRes("res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/LayaMonkey-LayaMonkey.lm");
			//为精灵设置Mesh资源
			var layaMonkey = new Laya.MeshSprite3D(mesh);
			this.sprite3D.addChild(layaMonkey);
			layaMonkey.transform.localScale = new Laya.Vector3(4, 4, 4);
			layaMonkey.transform.rotation = new Laya.Quaternion(0.7071068, 0, 0, -0.7071067);
			layaMonkey.transform.translate(new Laya.Vector3(0, 0, 7));
			layaMonkey.transform.rotate(new Laya.Vector3(0, 180, 0), false, false);
			
			//使用精灵
			var sp = Laya.Loader.getRes("res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh");
			var layaMonkey2 = this._scene.addChild(sp) as Laya.MeshSprite3D;
			layaMonkey2.transform.localScale = new Laya.Vector3(4, 4, 4);
			layaMonkey2.transform.translate(new Laya.Vector3(-10, 13, 0));
			layaMonkey2.transform.rotate(new Laya.Vector3(0, 180, 0), false, false);
    }
}

//激活启动类
new LoadResourceDemo();