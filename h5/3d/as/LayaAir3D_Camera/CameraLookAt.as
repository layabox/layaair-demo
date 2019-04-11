package LayaAir3D_Camera 
{
	import common.CameraMoveScript;
	import laya.d3.core.BaseCamera;
	import laya.d3.core.Camera;
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.light.DirectionLight;
	import laya.d3.core.material.BlinnPhongMaterial;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Vector3;
	import laya.d3.math.Vector4;
	import laya.d3.resource.models.PrimitiveMesh;
	import laya.display.Stage;
	import laya.events.Event;
	import laya.net.Loader;
	import laya.ui.Button;
	import laya.utils.Browser;
	import laya.utils.Handler;
	import laya.utils.Stat;
	import laya.webgl.resource.Texture2D;
	import laya.d3.core.material.BaseMaterial;
	import laya.d3.resource.models.SkyBox;
	import laya.d3.resource.models.SkyRenderer;
	import laya.d3.core.Sprite3D;
	/**
	 * ...
	 * @author ...
	 */
	public class CameraLookAt 
	{
		private var index:int = 0;
		private var camera:Camera;
		private var box:MeshSprite3D;
		private var capsule:MeshSprite3D;
		private var cylinder:MeshSprite3D;
		private var _translate = new Vector3(0, 0.7, 5);
		private var _rotation:Vector3 = new Vector3( -15, 0, 0);
		private var _rotation2:Vector3 = new Vector3( -3.14 / 3, 0, 0);
		private var _rotation3:Vector3 = new Vector3(0, 45, 0);
		private var _position:Vector3 = new Vector3(1.5, 0.0, 2);
		private var _position2:Vector3 = new Vector3( -1.5, 0.0, 2);
		private var _position3:Vector3 = new Vector3(0.0, 0.0, 2);
		private var _up:Vector3 = new Vector3(0, 1, 0);
		public function CameraLookAt() 
		{
			//初始化引擎
            Laya3D.init(0, 0);            
            //适配模式
            Laya.stage.scaleMode = Stage.SCALE_FULL;
            Laya.stage.screenMode = Stage.SCREEN_NONE;
            //开启统计信息
            Stat.show();            
			//预加载所有资源
			var resource:Array = [  
				"res/threeDimen/texture/layabox.png",
				"res/threeDimen/skyBox/skyBox3/skyBox3.lmat", ];
			Laya.loader.create(resource, Handler.create(this, onPreLoadFinish));	
		}
		
		private function onPreLoadFinish():void
        {
			//创建场景
			var scene:Scene3D = new Scene3D();
			Laya.stage.addChild(scene);
			
			//创建相机，构造函数的三个参数为相机横纵比，近距裁剪，远距裁剪
			camera = new Camera(0, 0.1, 100);
			camera.transform.translate(_translate);
			camera.transform.rotate(_rotation, true, false);
			
			//相机设置清楚标记,使用固定颜色
			camera.clearFlag = BaseCamera.CLEARFLAG_SOLIDCOLOR;
			//使用默认的背景颜色
			//camera.clearColor = new Vector4(0, 0.2, 0.6, 1);
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
			box = sprite.addChild(new MeshSprite3D(PrimitiveMesh.createBox(0.5, 0.5, 0.5))) as MeshSprite3D;
			box.transform.position = _position;
			box.transform.rotate(_rotation3, false, false);
			
			//胶囊体
			capsule = new MeshSprite3D(PrimitiveMesh.createCapsule(0.25, 1, 10, 20));
			capsule.transform.position = _position2;
			sprite.addChild(capsule); 
			
			//圆柱
			cylinder = new MeshSprite3D(PrimitiveMesh.createCylinder(0.25, 1, 20));
			cylinder.transform.position = _position3;
			sprite.addChild(cylinder);
			
			//创建linnPhong材质
			var materialBill:BlinnPhongMaterial = new BlinnPhongMaterial;
			box.meshRenderer.material = materialBill;
			capsule.meshRenderer.material = materialBill;
			cylinder.meshRenderer.material = materialBill;
			//为材质加载纹理
			var tex:Texture2D = Loader.getRes("res/threeDimen/texture/layabox.png") as Texture2D;
			//设置反照率贴图
			materialBill.albedoTexture = tex;
			
			loadUI();	
        }
		private function loadUI():void {
			
			Laya.loader.load(["res/threeDimen/ui/button.png"], Handler.create(this, function():void {
				
				var changeActionButton:Button = Laya.stage.addChild(new Button("res/threeDimen/ui/button.png", "切换注视目标")) as Button;
				changeActionButton.size(200, 40);
				changeActionButton.labelBold = true;
				changeActionButton.labelSize = 30;
				changeActionButton.sizeGrid = "4,4,4,4";
				changeActionButton.scale(Browser.pixelRatio, Browser.pixelRatio);
				changeActionButton.pos(Laya.stage.width / 2 - changeActionButton.width * Browser.pixelRatio / 2 , Laya.stage.height - 100 * Browser.pixelRatio);
				
				changeActionButton.on(Event.CLICK, this, function():void{
					index++;
					if (index % 3 === 1 ){
						//摄像机捕捉模型目标
						camera.transform.lookAt(box.transform.position, _up);
					}
					else if (index % 3 === 2){
						//摄像机捕捉模型目标
						camera.transform.lookAt(cylinder.transform.position, _up);
					}
					else{
						//摄像机捕捉模型目标
						camera.transform.lookAt(capsule.transform.position, _up);
					}
				});
					
			}));
		}
		
	}

}