package LayaAir3D_Camera {
	import common.CameraMoveScript;
	import laya.d3.core.BaseCamera;
	import laya.d3.core.Camera;
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.light.DirectionLight;
	import laya.d3.core.material.BaseMaterial;
	import laya.d3.core.material.BlinnPhongMaterial;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Vector3;
	import laya.d3.math.Vector4;
	import laya.d3.resource.models.PrimitiveMesh;
	import laya.d3.resource.models.SkyBox;
	import laya.d3.resource.models.SkyRenderer;
	import laya.display.Stage;
	import laya.events.Event;
	import laya.net.Loader;
	import laya.ui.Button;
	import laya.utils.Browser;
	import laya.utils.Handler;
	import laya.utils.Stat;
	import laya.webgl.resource.Texture2D;
	
	/**
	 * ...
	 * @author ...
	 */
	public class CameraDemo {
		private var index:int = 0;
		private var camera:Camera;
		private var _translate:Vector3 = new Vector3(0, 0.7, 5);
		private var _rotation:Vector3 = new Vector3(-15, 0, 0);
		private var _rotation2:Vector3 = new Vector3(-3.14 / 3, 0, 0);
		private var _rotation3:Vector3 = new Vector3(0, 45, 0);
		private var _clearColor:Vector4 = new Vector4(0, 0.2, 0.6, 1);
		
		public function CameraDemo() {
			//初始化引擎
			Laya3D.init(1000, 500);
			//适配模式
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			//开启统计信息
			Stat.show();
			//预加载所有资源
			var resource:Array = ["res/threeDimen/texture/layabox.png", "res/threeDimen/skyBox/skyBox2/skyBox2.lmat"];
			Laya.loader.create(resource, Handler.create(this, onPreLoadFinish));
		}
		
		private function onPreLoadFinish():void {
			//创建场景
			var scene:Scene3D = new Scene3D();
			Laya.stage.addChild(scene);
			
			//创建相机，构造函数的三个参数为相机横纵比，近距裁剪，远距裁剪
			camera = new Camera(0, 0.1, 100);
			camera.transform.translate(_translate);
			camera.transform.rotate(_rotation, true, false);
			
			//相机设置清楚标记,使用固定颜色
			camera.clearFlag = BaseCamera.CLEARFLAG_SOLIDCOLOR;
			//使用默认颜色
			//camera.clearColor = _clearColor;
			//设置摄像机视野范围（角度）
			camera.fieldOfView = 60;
			//为相机添加视角控制组件(脚本)
			camera.addComponent(CameraMoveScript);
			scene.addChild(camera);
			
			//添加平行光
			var directionLight:DirectionLight = scene.addChild(new DirectionLight()) as DirectionLight;
			//设置平行光颜色
			directionLight.color.setValue(1, 1, 1);
			directionLight.transform.rotate(_rotation2);
			
			var sprite:Sprite3D = new Sprite3D;
			scene.addChild(sprite);
			
			//正方体
			var box:MeshSprite3D = sprite.addChild(new MeshSprite3D(PrimitiveMesh.createBox(0.5, 0.5, 0.5))) as MeshSprite3D;
			box.transform.position.setValue(0.0, 0.0, 2);
			box.transform.rotate(_rotation3, false, false);
			
			//创建linnPhong材质
			var materialBill:BlinnPhongMaterial = new BlinnPhongMaterial;
			box.meshRenderer.material = materialBill;
			//为材质加载纹理
			var tex:Texture2D = Loader.getRes("res/threeDimen/texture/layabox.png") as Texture2D;
			//设置反照率贴图
			materialBill.albedoTexture = tex;
			
			loadUI();
		}
		
		private function loadUI():void {
			
			Laya.loader.load(["res/threeDimen/ui/button.png"], Handler.create(null, function():void {
				
				var changeActionButton:Button = Laya.stage.addChild(new Button("res/threeDimen/ui/button.png", "正透切换")) as Button;
				changeActionButton.size(160, 40);
				changeActionButton.labelBold = true;
				changeActionButton.labelSize = 30;
				changeActionButton.sizeGrid = "4,4,4,4";
				changeActionButton.scale(Browser.pixelRatio, Browser.pixelRatio);
				changeActionButton.pos(Laya.stage.width / 2 - changeActionButton.width * Browser.pixelRatio / 2 - 100, Laya.stage.height - 100 * Browser.pixelRatio);
				
				changeActionButton.on(Event.CLICK, this, function():void {
					index++;
					if (index % 2 === 1) {
						//正交投影属性设置
						camera.orthographic = true;
						//正交垂直矩阵距离,控制3D物体远近与显示大小
						camera.orthographicVerticalSize = 7;
					} else {
						//正交投影属性设置,关闭
						camera.orthographic = false;
					}
				});
				
				var changeActionButton2:Button = Laya.stage.addChild(new Button("res/threeDimen/ui/button.png", "切换背景")) as Button;
				changeActionButton2.size(160, 40);
				changeActionButton2.labelBold = true;
				changeActionButton2.labelSize = 30;
				changeActionButton2.sizeGrid = "4,4,4,4";
				changeActionButton2.scale(Browser.pixelRatio, Browser.pixelRatio);
				changeActionButton2.pos(Laya.stage.width / 2 - changeActionButton2.width * Browser.pixelRatio / 2 + 100, Laya.stage.height - 100 * Browser.pixelRatio);
				
				changeActionButton2.on(Event.CLICK, this, function():void {
					index++;
					if (index % 2 === 1) {
						debugger;
						//设置相机的清除标识为天空盒
						camera.clearFlag = BaseCamera.CLEARFLAG_SKY;
						//使用加载天空盒材质
						var skyboxMaterial:BaseMaterial = Loader.getRes("res/threeDimen/skyBox/skyBox2/skyBox2.lmat") as BaseMaterial;
						//获取相机的天空渲染器
						var skyRenderer:SkyRenderer = camera.skyRenderer;
						//设置相机的天空渲染器的mesh
						skyRenderer.mesh = SkyBox.instance;
						//设置相机的天空渲染器的material
						skyRenderer.material = skyboxMaterial;
					} else {
						//设置相机的清除标识为为固定颜色
						camera.clearFlag = BaseCamera.CLEARFLAG_SOLIDCOLOR;
					}
				});
			
			}));
		}
	
	}

}