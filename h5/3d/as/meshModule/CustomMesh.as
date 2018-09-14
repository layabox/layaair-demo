package meshModule {
	import common.CameraMoveScript;
	import common.Tool;
	import laya.d3.core.Camera;
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.light.DirectionLight;
	import laya.d3.core.pixelLine.PixelLineSprite3D;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Color;
	import laya.d3.math.Vector3;
	import laya.d3.math.Vector4;
	import laya.d3.resource.models.BoxMesh;
	import laya.d3.resource.models.CapsuleMesh;
	import laya.d3.resource.models.ConeMesh;
	import laya.d3.resource.models.CylinderMesh;
	import laya.d3.resource.models.PlaneMesh;
	import laya.d3.resource.models.SphereMesh;
	import laya.d3.shader.Shader3D;
	import laya.display.Stage;
	import laya.events.Event;
	import laya.ui.Button;
	import laya.utils.Browser;
	import laya.utils.Handler;
	import laya.utils.Stat;
	
	/**
	 * ...
	 * @author
	 */
	public class CustomMesh {
		
		private var sprite3D:Sprite3D;
		private var lineSprite3D:Sprite3D;
		
		public function CustomMesh() {
			
			Shader3D.debugMode = true;
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			Stat.show();
			
			var scene:Scene3D = Laya.stage.addChild(new Scene3D()) as Scene3D;
			
			var camera:Camera = scene.addChild(new Camera(0, 0.1, 100)) as Camera;
			camera.transform.translate(new Vector3(0, 2, 5));
			camera.transform.rotate(new Vector3(-15, 0, 0), true, false);
			camera.addComponent(CameraMoveScript);
			camera.clearColor = new Vector4(0.2, 0.2, 0.2, 1.0);
			
			var directionLight:DirectionLight = scene.addChild(new DirectionLight()) as DirectionLight;
			directionLight.transform.worldMatrix.setForward(new Vector3(1.0, -1.0, -1.0));
			
			sprite3D = scene.addChild(new Sprite3D()) as Sprite3D;
			lineSprite3D = scene.addChild(new Sprite3D()) as Sprite3D;
			
			//正方体
			var box:MeshSprite3D = sprite3D.addChild(new MeshSprite3D(new BoxMesh(0.5, 0.5, 0.5))) as MeshSprite3D;
			box.transform.position = new Vector3(2.0, 0.25, 0.6);
			box.transform.rotate(new Vector3(0, 45, 0), false, false);
			var boxLineSprite3D:PixelLineSprite3D = lineSprite3D.addChild(new PixelLineSprite3D(100)) as PixelLineSprite3D;
			Tool.linearModel(box, boxLineSprite3D, Color.GREEN);
			
			//球体
			var sphere:MeshSprite3D = sprite3D.addChild(new MeshSprite3D(new SphereMesh(0.25, 20, 20))) as MeshSprite3D;
			sphere.transform.position = new Vector3(1.0, 0.25, 0.6);
			var sphereLineSprite3D:PixelLineSprite3D = lineSprite3D.addChild(new PixelLineSprite3D(2500)) as PixelLineSprite3D;
			Tool.linearModel(sphere, sphereLineSprite3D, Color.GREEN);
			
			//圆柱体
			var cylinder:MeshSprite3D = sprite3D.addChild(new MeshSprite3D(new CylinderMesh(0.25, 1, 20))) as MeshSprite3D;
			cylinder.transform.position = new Vector3(0, 0.5, 0.6);
			var cylinderLineSprite3D:PixelLineSprite3D = lineSprite3D.addChild(new PixelLineSprite3D(1000)) as PixelLineSprite3D;
			Tool.linearModel(cylinder, cylinderLineSprite3D, Color.GREEN);
			
			//胶囊体
			var capsule:MeshSprite3D = sprite3D.addChild(new MeshSprite3D(new CapsuleMesh(0.25, 1, 10, 20))) as MeshSprite3D;
			capsule.transform.position = new Vector3( -1.0, 0.5, 0.6);
			var capsuleLineSprite3D:PixelLineSprite3D = lineSprite3D.addChild(new PixelLineSprite3D(3000)) as PixelLineSprite3D;
			Tool.linearModel(capsule, capsuleLineSprite3D, Color.GREEN);
			
			//圆锥体
			var cone:MeshSprite3D = sprite3D.addChild(new MeshSprite3D(new ConeMesh(0.25, 0.75))) as MeshSprite3D;
			cone.transform.position = new Vector3( -2.0, 0.375, 0.6);
			var coneLineSprite3D:PixelLineSprite3D = lineSprite3D.addChild(new PixelLineSprite3D(500)) as PixelLineSprite3D;
			Tool.linearModel(cone, coneLineSprite3D, Color.GREEN);
			
			//平面
			var plane:MeshSprite3D = sprite3D.addChild(new MeshSprite3D(new PlaneMesh(6, 6, 10, 10))) as MeshSprite3D;
			var planeLineSprite3D:PixelLineSprite3D = lineSprite3D.addChild(new PixelLineSprite3D(1000)) as PixelLineSprite3D;
			Tool.linearModel(plane, planeLineSprite3D, Color.GRAY);
			
			lineSprite3D.active = false;
			loadUI();
		}
		
		private var curStateIndex:int = 0;
		private function loadUI():void {
            
            Laya.loader.load(["../../../../res/threeDimen/ui/button.png"], Handler.create(null, function():void {
                
                var changeActionButton:Button = Laya.stage.addChild(new Button("../../../../res/threeDimen/ui/button.png", "正常模式")) as Button;
                changeActionButton.size(160, 40);
                changeActionButton.labelBold = true;
                changeActionButton.labelSize = 30;
                changeActionButton.sizeGrid = "4,4,4,4";
                changeActionButton.scale(Browser.pixelRatio, Browser.pixelRatio);
                changeActionButton.pos(Laya.stage.width / 2 - changeActionButton.width * Browser.pixelRatio / 2, Laya.stage.height - 100 * Browser.pixelRatio);
                changeActionButton.on(Event.CLICK, this, function():void {
                    if (++curStateIndex % 2 == 1) {
                        sprite3D.active = false;
						lineSprite3D.active = true;
                        changeActionButton.label = "网格模式";
                    }
                    else {
                        sprite3D.active = true;
						lineSprite3D.active = false;
                        changeActionButton.label = "正常模式";
                    }
                });
            }));
        }
	}
}