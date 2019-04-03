package LayaAir3D_Sprite3D {
	import common.CameraMoveScript;
	import laya.d3.core.Camera;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.light.DirectionLight;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Vector3;
	import laya.display.Stage;
	import laya.events.Event;
	import laya.net.Loader;
	import laya.ui.Button;
	import laya.utils.Browser;
	import laya.utils.Handler;
	import laya.utils.Stat;
	
	public class Sprite3DParent {
		private var sprite3D:Sprite3D;
		private var scene:Scene3D;
		
		public function Sprite3DParent() {
			//初始化引擎
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			//显示性能面板
			Stat.show();
			
			//创建场景
			scene = Laya.stage.addChild(new Scene3D()) as Scene3D;
			
			//创建相机
			var camera:Camera = scene.addChild(new Camera(0, 0.1, 100)) as Camera;
			camera.transform.translate(new Vector3(0, 0.75, 1));
			camera.transform.rotate(new Vector3(-30, 0, 0), true, false);
			camera.addComponent(CameraMoveScript);
			
			//添加光照
			var directionLight:DirectionLight = scene.addChild(new DirectionLight()) as DirectionLight;
			directionLight.color = new Vector3(1, 1, 1);
			directionLight.transform.rotate(new Vector3(-3.14 / 3, 0, 0));
			
			//预加载所有资源
			var resource:Array = ["res/threeDimen/skinModel/LayaMonkey2/LayaMonkey.lh", "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh",];
			Laya.loader.create(resource, Handler.create(this, onPreLoadFinish));
		}
		
		public function onPreLoadFinish():void {
			//添加父级猴子
			var layaMonkeyParent:Sprite3D = scene.addChild(Loader.getRes("res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh")) as Sprite3D;
			//加载第二只猴子，作为子猴子
			var layaMonkeySon:Sprite3D = Loader.getRes("res/threeDimen/skinModel/LayaMonkey2/LayaMonkey.lh") as Sprite3D;
			layaMonkeySon.transform.translate(new Vector3(2.5, 0, 0));
			//缩放
			var scale:Vector3 = new Vector3(0.5, 0.5, 0.5);
			layaMonkeySon.transform.localScale = scale;
			
			layaMonkeyParent.addChild(layaMonkeySon);
			
			addButton(100, 120, 160, 30, "移动父级猴子", 20, function(e:Event):void {
				layaMonkeyParent.transform.translate(new Vector3(-0.1, 0, 0));
			});
			addButton(100, 160, 160, 30, "放大父级猴子", 20, function(e:Event):void {
				var scale:Vector3 = new Vector3(0.2, 0.2, 0.2);
				layaMonkeyParent.transform.localScale = scale;
			});
			addButton(100, 200, 160, 30, "旋转父级猴子", 20, function(e:Event):void {
				layaMonkeyParent.transform.rotate(new Vector3(-15, 0, 0), true, false);
			});
			
			addButton(100, 250, 160, 30, "移动子级猴子", 20, function(e:Event):void {
				layaMonkeySon.transform.translate(new Vector3(-0.1, 0, 0));
			});
			addButton(100, 290, 160, 30, "放大子级猴子", 20, function(e:Event):void {
				var scale:Vector3 = new Vector3(1, 1, 1);
				layaMonkeySon.transform.localScale = scale;
			});
			addButton(100, 330, 160, 30, "旋转子级猴子", 20, function(e:Event):void {
				layaMonkeySon.transform.rotate(new Vector3(-15, 0, 0), true, false);
			});
		}
		
		private function addButton(x:Number, y:Number, width:Number, height:Number, text:String, size:int, clickFun:Function):void {
			Laya.loader.load(["res/threeDimen/ui/button.png"], Handler.create(null, function():void {
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
	
	}

}