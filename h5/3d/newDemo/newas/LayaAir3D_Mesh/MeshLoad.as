package OfficialExample.LayaAir3D_Mesh {
	import common.Tool;
	import laya.d3.core.Camera;
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.light.DirectionLight;
	import laya.d3.core.pixelLine.PixelLineSprite3D;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Color;
	import laya.d3.math.Quaternion;
	import laya.d3.math.Vector3;
	import laya.d3.resource.models.Mesh;
	import laya.d3.resource.models.PrimitiveMesh;
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
	public class MeshLoad {
		
		private var sprite3D:Sprite3D;
		private var lineSprite3D:Sprite3D;
		private var rotation:Vector3 = new Vector3(0, 0.01, 0);
		
		public function MeshLoad() {
			
			//初始化引擎
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			//显示性能面板
			Stat.show();
			
			//创建场景
			var scene:Scene3D = Laya.stage.addChild(new Scene3D()) as Scene3D;
			
			//创建相机
			var camera:Camera = scene.addChild(new Camera(0, 0.1, 100)) as Camera;
			camera.transform.translate(new Vector3(0, 0.8, 1.5));
			camera.transform.rotate(new Vector3(-15, 0, 0), true, false);
			
			//添加平行光
			var directionLight:DirectionLight = scene.addChild(new DirectionLight()) as DirectionLight;
			directionLight.color = new Vector3(0.6, 0.6, 0.6);
			
			//创建精灵
			sprite3D = scene.addChild(new Sprite3D()) as Sprite3D;
			lineSprite3D = scene.addChild(new Sprite3D()) as Sprite3D;
			
			//加载mesh
			Mesh.load("res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/LayaMonkey-LayaMonkey.lm", Handler.create(null, function(mesh:Mesh):void {
				var layaMonkey:MeshSprite3D = sprite3D.addChild(new MeshSprite3D(mesh)) as MeshSprite3D;
				layaMonkey.transform.localScale = new Vector3(0.3, 0.3, 0.3);
				layaMonkey.transform.rotation = new Quaternion(0.7071068, 0, 0, -0.7071067);
				
				//创建像素线渲染精灵
				var layaMonkeyLineSprite3D:PixelLineSprite3D = lineSprite3D.addChild(new PixelLineSprite3D(5000)) as PixelLineSprite3D;
				//设置像素线渲染精灵线模式
				Tool.linearModel(layaMonkey, layaMonkeyLineSprite3D, Color.GREEN);
				
				var plane:MeshSprite3D = sprite3D.addChild(new MeshSprite3D(PrimitiveMesh.createPlane(6, 6, 10, 10))) as MeshSprite3D;
				plane.transform.position = new Vector3(0, 0, -1);
				var planeLineSprite3D:PixelLineSprite3D = lineSprite3D.addChild(new PixelLineSprite3D(1000)) as PixelLineSprite3D;
				Tool.linearModel(plane, planeLineSprite3D, Color.GRAY);
				
				//设置时钟定时执行
				Laya.timer.frameLoop(1, this, function():void {
					layaMonkeyLineSprite3D.transform.rotate(rotation, false);
					layaMonkey.transform.rotate(rotation, false);
				});
				
				lineSprite3D.active = false;
				loadUI();
			}));
		
		}
		
		private var curStateIndex:int = 0;
		
		private function loadUI():void {
			Laya.loader.load(["res/threeDimen/ui/button.png"], Handler.create(null, function():void {
				var changeActionButton:Button = Laya.stage.addChild(new Button("res/threeDimen/ui/button.png", "正常模式")) as Button;
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
					} else {
						sprite3D.active = true;
						lineSprite3D.active = false;
						changeActionButton.label = "正常模式";
					}
				});
			}));
		}
	}
}