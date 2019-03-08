package OfficialExample.LayaAir3D_Resourceloading 
{
	import common.CameraMoveScript;
	import laya.d3.core.BaseCamera;
	import laya.d3.core.Camera;
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.light.DirectionLight;
	import laya.d3.core.material.BaseMaterial;
	import laya.d3.core.material.BlinnPhongMaterial;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Quaternion;
	import laya.d3.math.Vector3;
	import laya.d3.math.Vector4;
	import laya.d3.resource.models.Mesh;
	import laya.d3.resource.models.PrimitiveMesh;
	import laya.display.Stage;
	import laya.net.Loader;
	import laya.utils.Handler;
	import laya.utils.Stat;
	import laya.webgl.resource.Texture2D;
	import laya.d3.resource.models.SkyBox;
	import laya.d3.resource.models.SkyRenderer;
	/**
	 * ...
	 * @author ...
	 */
	public class LoadResourceDemo 
	{
		
		private var _scene:Scene3D;
		private var sprite3D:Sprite3D;
		public function LoadResourceDemo() 
		{
			//初始化引擎
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			//显示性能面板
			Stat.show();
			
			//加载资源
			//LoadRes();
			
			//批量预加载方式
			PreloadingRes();
				
		}
		//加载资源
		public function LoadRes()
		{
			//场景加载
			Scene3D.load("res/threeDimen/scene/TerrainScene/XunLongShi.ls", Handler.create(null, function(scene:Scene3D):void {
				_scene = scene;
				Laya.stage.addChild(scene);
				//获取场景相机
				var camera:Camera = scene.getChildByName("Main Camera") as Camera;
				camera.clearFlag = BaseCamera.CLEARFLAG_SKY;
				camera.addComponent(CameraMoveScript);
				//添加光照
				var directionLight:DirectionLight = _scene.addChild(new DirectionLight()) as DirectionLight;
				directionLight.color = new Vector3(1, 1, 1);
				directionLight.transform.rotate(new Vector3( -3.14 / 3, 0, 0));
				
				//材质加载
				BaseMaterial.load("res/threeDimen/skyBox/skyBox3/skyBox3.lmat", Handler.create(null, function(mat:BaseMaterial):void {
					camera.skyboxMaterial = mat;
				}));
				
				(scene.getChildByName('Scenes').getChildByName('HeightMap') as MeshSprite3D).active = false;
				(scene.getChildByName('Scenes').getChildByName('Area') as MeshSprite3D).active = false;
				sprite3D = _scene.addChild(new Sprite3D()) as Sprite3D;
				
				//创建内置立方体
				var box:MeshSprite3D = scene.addChild(new MeshSprite3D(PrimitiveMesh.createBox(10, 10, 10))) as MeshSprite3D;
				box.transform.translate(new Vector3(10, 10, -8));
				//创建BlinnPhongMaterial材质
				var boxMat:BlinnPhongMaterial = new BlinnPhongMaterial();
				//加载纹理
				Texture2D.load("res/threeDimen/Physics/wood.jpg", Handler.create(null, function(tex:Texture2D):void {
					boxMat.albedoTexture = tex;
				}));
				//设置纹理平铺和偏移
				boxMat.tilingOffset = new Vector4(2, 2, 0, 0);
				//设置材质
				box.meshRenderer.material = boxMat;
				
				//加载Mesh
				Mesh.load("res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/LayaMonkey-LayaMonkey.lm", Handler.create(null, function(mesh:Mesh):void {
				var layaMonkey:MeshSprite3D = sprite3D.addChild(new MeshSprite3D(mesh)) as MeshSprite3D;
				layaMonkey.transform.localScale = new Vector3(4, 4, 4);
				layaMonkey.transform.rotation = new Quaternion(0.7071068, 0, 0, -0.7071067);
				layaMonkey.transform.translate(new Vector3(0, 0, 7));
				layaMonkey.transform.rotate(new Vector3(0, 180, 0), false, false);
				}));
				//加载精灵
				Sprite3D.load("res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", Handler.create(null, function(sp:Sprite3D):void {
				var layaMonkey2:Sprite3D = scene.addChild(sp) as Sprite3D;
				layaMonkey2.transform.localScale = new Vector3(4, 4, 4);
				layaMonkey2.transform.translate(new Vector3(-10, 13, 0));
				layaMonkey2.transform.rotate(new Vector3(0, 180, 0), false, false);
				}));
	
			}));
		}
		//批量预加载方式
		public function PreloadingRes()
		{
			//预加载所有资源
			var resource:Array = [
			{url: "res/threeDimen/scene/TerrainScene/XunLongShi.ls", clas: Scene3D, priority: 1},  
			{url: "res/threeDimen/skyBox/skyBox3/skyBox3.lmat", clas: BaseMaterial, priority: 1, constructParams: [512, 512, 1, true, true]},
			{url: "res/threeDimen/Physics/wood.jpg", clas: Texture2D, priority: 1, constructParams: [64, 64, 1, true, true]},
			{url: "res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/LayaMonkey-LayaMonkey.lm", clas: Mesh, priority: 1, constructParams: [32, 32, 1, true, true]},
			{url: "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", clas: Sprite3D, priority: 1, constructParams: [1024, 512, 1, true, true]},];
			Laya.loader.create(resource, Handler.create(this, onPreLoadFinish));	
		}
		public function onPreLoadFinish(){
			//初始化3D场景
			_scene = Laya.stage.addChild(Loader.getRes("res/threeDimen/scene/TerrainScene/XunLongShi.ls")) as Scene3D;
			
			//获取相机
			var camera:Camera = _scene.getChildByName("Main Camera") as Camera;
			//设置相机清楚标记，使用天空
			camera.clearFlag = BaseCamera.CLEARFLAG_SKY;
			//相机视角控制组件(脚本)
			camera.addComponent(CameraMoveScript);
			
			//添加光照
			var directionLight:DirectionLight = _scene.addChild(new DirectionLight()) as DirectionLight;
			//光照颜色
			directionLight.color = new Vector3(1, 1, 1);
			directionLight.transform.rotate(new Vector3( -3.14 / 3, 0, 0));
			
			//使用材质
			var skyboxMaterial:BaseMaterial = Loader.getRes("res/threeDimen/skyBox/skyBox3/skyBox3.lmat") as BaseMaterial;
			var skyRenderer:SkyRenderer = camera.skyRenderer;
			skyRenderer.mesh = SkyBox.instance;
			skyRenderer.material = skyboxMaterial;
			
			//激活场景中的子节点
			(_scene.getChildByName('Scenes').getChildByName('HeightMap') as MeshSprite3D).active = false;
			(_scene.getChildByName('Scenes').getChildByName('Area') as MeshSprite3D).active = false;
			
			
			//使用纹理
			var box:MeshSprite3D = _scene.addChild(new MeshSprite3D(PrimitiveMesh.createBox(10, 10, 10))) as MeshSprite3D;
			box.transform.translate(new Vector3(10, 10, -8));
			var boxMat:BlinnPhongMaterial = new BlinnPhongMaterial();
			boxMat.albedoTexture = Loader.getRes("res/threeDimen/Physics/wood.jpg") as Texture2D;
			boxMat.tilingOffset = new Vector4(2, 2, 0, 0);
			box.meshRenderer.material = boxMat;
			
			//创建一个精灵
			sprite3D = _scene.addChild(new Sprite3D()) as Sprite3D;
			//获取Mesh资源
			var mesh:Mesh = Loader.getRes("res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/LayaMonkey-LayaMonkey.lm") as Mesh;
			//为精灵设置Mesh资源
			var layaMonkey:MeshSprite3D = sprite3D.addChild(new MeshSprite3D(mesh)) as MeshSprite3D;
			layaMonkey.transform.localScale = new Vector3(4, 4, 4);
			layaMonkey.transform.rotation = new Quaternion(0.7071068, 0, 0, -0.7071067);
			layaMonkey.transform.translate(new Vector3(0, 0, 7));
			layaMonkey.transform.rotate(new Vector3(0, 180, 0), false, false);
			
			//使用精灵
			var sp:Sprite3D = Loader.getRes("res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh") as Sprite3D;
			var layaMonkey2:Sprite3D = _scene.addChild(sp) as Sprite3D;
			layaMonkey2.transform.localScale = new Vector3(4, 4, 4);
			layaMonkey2.transform.translate(new Vector3(-10, 13, 0));
			layaMonkey2.transform.rotate(new Vector3(0, 180, 0), false, false);
		}
		
	}

}