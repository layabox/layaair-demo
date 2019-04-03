package LayaAir3D_Mesh {
	import common.CameraMoveScript;
	import laya.d3.core.Camera;
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.resource.models.Mesh;
	import laya.d3.resource.models.PrimitiveMesh;
	import laya.display.Stage;
	import laya.events.Event;
	import laya.net.Loader;
	import laya.ui.Button;
	import laya.utils.Browser;
	import laya.utils.Handler;
	import laya.utils.Stat;
	
	/**
	 * ...
	 * @author ...
	 */
	public class ChangeMesh {
		private var sphere:MeshSprite3D;
		private var changeActionButton:Button;
		private var index:int = 0;
		private var sphereMesh:Mesh;
		private var box:Mesh;
		private var capsule:Mesh;
		private var cylinder:Mesh;
		private var cone:Mesh;
		
		public function ChangeMesh() {
			//初始化引擎
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			//显示性能面板
			Stat.show();
			//预加载所有资源
			var resource:Array = ["res/threeDimen/scene/ChangeMaterialDemo/Conventional/scene.ls"];
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
			//获取精灵的mesh
			sphereMesh = sphere.meshFilter.sharedMesh;
			//新建四个mesh
			box = PrimitiveMesh.createBox(0.5, 0.5, 0.5);
			capsule = PrimitiveMesh.createCapsule(0.25, 1, 10, 20);
			cylinder = PrimitiveMesh.createCylinder(0.25, 1, 20);
			cone = PrimitiveMesh.createCone(0.25, 0.75);
			//加载UI
			loadUI();
		
		}
		
		private function loadUI():void {
			
			Laya.loader.load(["res/threeDimen/ui/button.png"], Handler.create(null, function():void {
				
				changeActionButton = Laya.stage.addChild(new Button("res/threeDimen/ui/button.png", "切换Mesh")) as Button;
				changeActionButton.size(160, 40);
				changeActionButton.labelBold = true;
				changeActionButton.labelSize = 30;
				changeActionButton.sizeGrid = "4,4,4,4";
				changeActionButton.scale(Browser.pixelRatio, Browser.pixelRatio);
				changeActionButton.pos(Laya.stage.width / 2 - changeActionButton.width * Browser.pixelRatio / 2, Laya.stage.height - 100 * Browser.pixelRatio);
				
				changeActionButton.on(Event.CLICK, this, function():void {
					debugger;
					index++;
					if (index % 5 === 1) {
						//切换mesh
						sphere.meshFilter.sharedMesh = box;
					} else if (index % 5 === 2) {
						//切换mesh
						sphere.meshFilter.sharedMesh = capsule;
					} else if (index % 5 === 3) {
						//切换mesh
						sphere.meshFilter.sharedMesh = cylinder;
					} else if (index % 5 === 3) {
						//切换mesh
						sphere.meshFilter.sharedMesh = cone;
					} else {
						//切换mesh
						sphere.meshFilter.sharedMesh = sphereMesh;
					}
				});
			
			}));
		}
	
	}

}