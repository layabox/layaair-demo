package LayaAir3D_Material {
	import common.CameraMoveScript;
	import laya.d3.core.Camera;
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.material.BlinnPhongMaterial;
	import laya.d3.core.material.PBRStandardMaterial;
	import laya.d3.core.scene.Scene3D;
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
	public class MaterialDemo {
		private var sphere:MeshSprite3D;
		private var pbrStandardMaterial:PBRStandardMaterial;
		private var pbrTexture:Texture2D;
		private var billinMaterial:BlinnPhongMaterial;
		private var changeActionButton:Button;
		private var index:int = 0;
		
		public function MaterialDemo() {
			//初始化引擎
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			//显示性能面板
			Stat.show();
			//预加载所有资源
			var resource:Array = ["res/threeDimen/scene/ChangeMaterialDemo/Conventional/scene.ls",  "res/threeDimen/texture/earth.png"];
			Laya.loader.create(resource, Handler.create(this, onPreLoadFinish));
		
		}
		
		public function onPreLoadFinish() {
			//初始化3D场景
			var scene:Scene3D = Laya.stage.addChild(Loader.getRes("res/threeDimen/scene/ChangeMaterialDemo/Conventional/scene.ls")) as Scene3D;
			//获取相机
			var camera:Camera = scene.getChildByName("Main Camera") as Camera;
			//为相机添加视角控制组件(脚本)
			camera.addComponent(CameraMoveScript);
			//获取球型精灵
			sphere = scene.getChildByName("Sphere") as MeshSprite3D;
			//获取球型精灵自带的BlinnPhong材质
			billinMaterial = sphere.meshRenderer.material as BlinnPhongMaterial;
			//创建一个新的PBRStandard材质
			pbrStandardMaterial = new PBRStandardMaterial();
			//获取新的纹理
			pbrTexture = Loader.getRes("res/threeDimen/texture/earth.png") as Texture2D;
			//为PBRStandard材质设置漫反射贴图
			pbrStandardMaterial.albedoTexture = pbrTexture;
			//加载UI
			loadUI();
		
		}
		
		private function loadUI():void {
			
			Laya.loader.load(["res/threeDimen/ui/button.png"], Handler.create(this, function():void {
				
				changeActionButton = Laya.stage.addChild(new Button("res/threeDimen/ui/button.png", "切换材质")) as Button;
				changeActionButton.size(160, 40);
				changeActionButton.labelBold = true;
				changeActionButton.labelSize = 30;
				changeActionButton.sizeGrid = "4,4,4,4";
				changeActionButton.scale(Browser.pixelRatio, Browser.pixelRatio);
				changeActionButton.pos(Laya.stage.width / 2 - changeActionButton.width * Browser.pixelRatio / 2, Laya.stage.height - 100 * Browser.pixelRatio);
				
				changeActionButton.on(Event.CLICK, this, function():void {
					index++;
					if (index % 2 === 1) {
						//切换至PBRStandard材质
						sphere.meshRenderer.material = pbrStandardMaterial;
					} else {
						//切换至BlinnPhong材质
						sphere.meshRenderer.material = billinMaterial;
					}
				});
			
			}));
		}
	
	}

}