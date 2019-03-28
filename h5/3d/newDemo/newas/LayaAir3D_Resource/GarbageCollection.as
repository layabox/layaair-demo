package LayaAir3D_Resource {
	import common.CameraMoveScript;
	import laya.d3.core.Camera;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Vector3;
	import laya.display.Stage;
	import laya.events.Event;
	import laya.resource.Resource;
	import laya.ui.Button;
	import laya.utils.Browser;
	import laya.utils.Handler;
	import laya.utils.Stat;
	
	/**
	 * ...
	 * @author LayaAir3D Team
	 */
	public class GarbageCollection {
		/**@private */
		private var _scene:Scene3D;
		/**@private */
		private var _castType:int = 0;
		
		/**
		 * @private
		 */
		public function GarbageCollection() {
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			Stat.show();
			
			loadScene();
			addButton(200, 200, 160, 40, "释放显存", function(e:Event):void {
				_castType++;
				_castType %= 2;
				switch (_castType) {
				case 0: 
					(e.target as Button).label = "释放显存";
					loadScene();
					break;
				case 1: 
					(e.target as Button).label = "加载场景";
					if (_scene)//_scene不为空表示场景已加载完成
						garbageCollection();
					break;
				}
			});
		}
		
		/**
		 * @private
		 */
		public function addButton(x:Number, y:Number, width:Number, height:Number, text:String, clickFun:Function):void {
			Laya.loader.load(["res/threeDimen/ui/button.png"], Handler.create(null, function():void {
				var changeActionButton:Button = Laya.stage.addChild(new Button("res/threeDimen/ui/button.png", text)) as Button;
				changeActionButton.size(width, height);
				changeActionButton.labelBold = true;
				changeActionButton.labelSize = 30;
				changeActionButton.sizeGrid = "4,4,4,4";
				changeActionButton.scale(Browser.pixelRatio, Browser.pixelRatio);
				changeActionButton.pos(x, y);
				changeActionButton.on(Event.CLICK, this, clickFun);
			}));
		}
		
		/**
		 * @private
		 */
		public function loadScene():void {
			Scene3D.load("threeDimen/scene/ParticleScene/Example_01.ls", Handler.create(null, function(scene:Scene3D):void {
				_scene = Laya.stage.addChildAt(scene, 0) as Scene3D;
				var camera:Camera = scene.addChild(new Camera(0, 0.1, 100)) as Camera;
				camera.transform.translate(new Vector3(0, 1, 0));
				camera.addComponent(CameraMoveScript);
			}))
		}
		
		/**
		 * @private
		 */
		public function garbageCollection():void {
			_scene.destroy();//销毁场景
			_scene = null;
			Resource.destroyUnusedResources();//销毁无用资源(没有被场景树引用,并且没有加资源锁的)
		}
	
	}

}