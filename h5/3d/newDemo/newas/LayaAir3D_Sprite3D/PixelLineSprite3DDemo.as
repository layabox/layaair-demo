package LayaAir3D_Sprite3D 
{
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
	import laya.d3.resource.models.PrimitiveMesh;
	import laya.d3.shader.Shader3D;
	import laya.display.Stage;
	import laya.events.Event;
	import laya.ui.Button;
	import laya.utils.Browser;
	import laya.utils.Handler;
	import laya.utils.Stat;
	public class PixelLineSprite3DDemo 
	{
		private var scene:Scene3D;
		private var camera:Camera;
		private var ray:Ray;
		private var lineSprite3D:Sprite3D;
		private var pixline:PixelLineSprite3D;
		private var point:Vector2 = new Vector2();
		private var lastPoint:Vector3 = null;
		private var curPoint:Vector3 = null;
		private var startColor = new Color(1, 0, 0);
		private var endColor = new Color(0, 0, 1);
		public function PixelLineSprite3DDemo() 
		{
			//初始化引擎
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			//显示性能面板
			Stat.show();
			
			//创建场景
			scene = Laya.stage.addChild(new Scene3D()) as Scene3D;
			
			//创建相机
			camera = scene.addChild(new Camera(0, 0.1, 100)) as Camera;
			camera.transform.translate(new Vector3(0, 0.0, 0.0));
			camera.transform.rotate(new Vector3(0, 0, 0), true, false);
			camera.addComponent(CameraMoveScript);
			
			//添加光照
			var directionLight:DirectionLight = scene.addChild(new DirectionLight()) as DirectionLight;
            directionLight.color = new Vector3(1, 1, 1);
            directionLight.transform.rotate(new Vector3( -3.14 / 3, 0, 0));
			
			lineSprite3D = scene.addChild(new Sprite3D()) as Sprite3D;
			pixline = new PixelLineSprite3D(500);
			lineSprite3D.addChild(pixline);
			
			//射线初始化（必须初始化）
			ray = new Ray(new Vector3(0, 0, 0), new Vector3(0, 0, 0));
			
			addButton(100, 250, 160, 30, "开始绘制", 20, function(e:Event):void {
				Laya.stage.on(Event.MOUSE_DOWN, this, onMouseDown);
			});
		}
		private function addButton(x:Number, y:Number, width:Number, height:Number, text:String, size:int, clickFun:Function):void {
			Laya.loader.load(["res/threeDimen/ui/button.png"], Handler.create(this, function():void {
				var changeActionButton:Button = Laya.stage.addChild(new Button("res/threeDimen/ui/button.png", text)) as Button;
				changeActionButton.size(width, height);
				changeActionButton.labelBold = true;
				changeActionButton.labelSize = size;
				changeActionButton.sizeGrid = "4,4,4,4";
				changeActionButton.scale(Browser.pixelRatio, Browser.pixelRatio);
				changeActionButton.pos(x, y);
				changeActionButton.on(Event.CLICK, this, clickFun);
			}));
		}
		
		private function onMouseDown():void {
			point.x = MouseManager.instance.mouseX;
			point.y = MouseManager.instance.mouseY;
			//产生射线
			camera.viewportPointToRay(point, ray);
			if (lastPoint === null){
				lastPoint.setValue(ray.origin.x, ray.origin.y, ray.origin.z);
				curPoint.setValue(ray.origin.x, ray.origin.y, ray.origin.z);
			}
			else{
				curPoint.x = ray.origin.x;
				curPoint.y = ray.origin.y;
				curPoint.z = ray.origin.z;
				pixline.addLine(lastPoint, curPoint, startColor, endColor);
				lastPoint.x = ray.origin.x;
				lastPoint.y = ray.origin.y;
				lastPoint.z = ray.origin.z;
			}
		}
		
	}

}