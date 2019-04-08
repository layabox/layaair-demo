package LayaAir3D_Performance {
	import common.CameraMoveScript;
	import laya.d3.core.Camera;
	import laya.d3.core.RenderableSprite3D;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.graphics.StaticBatchManager;
	import laya.display.Stage;
	import laya.events.Event;
	import laya.ui.Button;
	import laya.utils.Browser;
	import laya.utils.Handler;
	import laya.utils.Stat;
	
	/**
	 * ...
	 * @author ...
	 */
	public class StaticBatchingTest {
		private var curStateIndex:int = 0;
		private var changeActionButton:Button;
		private var planeSprite:RenderableSprite3D;
		private var cubeSprite:RenderableSprite3D;
		private var sphereSprite:RenderableSprite3D;
		private var capsuleSprite:RenderableSprite3D;
		private var cylinderSprite:RenderableSprite3D;
		private var renderableSprite3Ds:Vector.<RenderableSprite3D> = new Vector.<RenderableSprite3D>;
		
		public function StaticBatchingTest() {
			Laya3D.init(0, 0);
			Stat.show();
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			
			Scene3D.load("res/threeDimen/scene/StaticBatching/staticBatching.ls", Handler.create(this, function(scene:Scene3D):void {
				Laya.stage.addChild(scene) as Scene3D;
				var camera:Camera = scene.getChildByName("Main Camera") as Camera;
				camera.addComponent(CameraMoveScript);
				
				//获取相同材质的精灵
				planeSprite = scene.getChildByName("Plane") as RenderableSprite3D;
				cubeSprite = scene.getChildByName("Cube") as RenderableSprite3D;
				sphereSprite = scene.getChildByName("Sphere") as RenderableSprite3D;
				capsuleSprite = scene.getChildByName("Capsule") as RenderableSprite3D;
				cylinderSprite = scene.getChildByName("Cylinder") as RenderableSprite3D;
				
				//精灵设置不开启合并
				planeSprite._isStatic = false;
				cubeSprite._isStatic = false;
				sphereSprite._isStatic = false;
				capsuleSprite._isStatic = false;
				cylinderSprite._isStatic = false;
				
				//加入到合并数组
				renderableSprite3Ds.push(planeSprite);
				renderableSprite3Ds.push(cubeSprite);
				renderableSprite3Ds.push(sphereSprite);
				renderableSprite3Ds.push(capsuleSprite);
				renderableSprite3Ds.push(cylinderSprite);
				
				//生成按钮
				loadUI();
			
			}));
		
		}
		
		private function loadUI():void {
			Laya.loader.load(["res/threeDimen/ui/button.png"], Handler.create(this, function():void {
				
				changeActionButton = Laya.stage.addChild(new Button("res/threeDimen/ui/button.png", "静态合并")) as Button;
				changeActionButton.size(160, 40);
				changeActionButton.labelBold = true;
				changeActionButton.labelSize = 30;
				changeActionButton.sizeGrid = "4,4,4,4";
				changeActionButton.scale(Browser.pixelRatio, Browser.pixelRatio);
				changeActionButton.pos(Laya.stage.width / 2 - changeActionButton.width * Browser.pixelRatio / 2, Laya.stage.height - 100 * Browser.pixelRatio);
				
				changeActionButton.on(Event.CLICK, this, function():void {
					//精灵设置开启静态合并
					planeSprite._isStatic = true;
					cubeSprite._isStatic = true;
					sphereSprite._isStatic = true;
					capsuleSprite._isStatic = true;
					cylinderSprite._isStatic = true;
					//进行静态合并
					StaticBatchManager.combine(null, renderableSprite3Ds);
				});
			}));
		}
	
	}

}