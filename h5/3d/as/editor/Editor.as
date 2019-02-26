package editor 
{
	import common.CameraMoveScript;
	import laya.d3.core.Camera;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.light.DirectionLight;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Ray;
	import laya.d3.math.Vector2;
	import laya.d3.math.Vector3;
	import laya.d3.utils.RaycastHit;
	import laya.display.Stage;
	import laya.events.Event;
	import laya.events.MouseManager;
	import laya.ui.Button;
	import laya.utils.Browser;
	import laya.utils.Handler;
	import laya.utils.Stat;
	/**
	 * ...
	 * @author 
	 */
	public class Editor 
	{
		private var scene:Scene3D;
		private var camera:Camera;
		
		private var curStateIndex:int = 0;
		private var coordinatesModel:int = 0;
		
		private var ray:Ray = new Ray(new Vector3(0, 0, 0), new Vector3(0, 0, 0));
		private var point:Vector2 = new Vector2();
		private var _outHitInfo:RaycastHit = new RaycastHit();
		private var hasSelectedSprite3D:Sprite3D;
		
		public function Editor() 
		{
			Laya3D.init(0, 0, true);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			Stat.show();
			
			loadUI();
			
			scene = Laya.stage.addChild(new Scene3D()) as Scene3D;
            
            camera = scene.addChild(new Camera(0, 0.1, 1000)) as Camera;
			camera.transform.translate(new Vector3(0, 0.5, 2));
            camera.transform.rotate(new Vector3( -10, 0, 0), false, false);
			camera.addComponent(CameraMoveScript);
			
			var directionLight:DirectionLight = scene.addChild(new DirectionLight()) as DirectionLight;
            directionLight.transform.worldMatrix.setForward(new Vector3(-1.0, -1.0, -1.0));
			
			var sphere:Sprite3D = scene.addChild(Sprite3D.load("Editor/Sphere.lh")) as Sprite3D;
			sphere.addChild(new PositionSprite3D(sphere));
			
			addMouseEvent();
		}
		
		public function onSelectGameObject():void{
			trace("OK!");
		}
		
		public function addMouseEvent():void {
			Laya.stage.on(Event.MOUSE_DOWN, this, onMouseDown);
			Laya.stage.on(Event.MOUSE_UP, this, onMouseUp);
			Laya.stage.on(Event.MOUSE_OUT, this, onMouseOut);
		} 
		
		public function onMouseDown():void {
			
			hasSelectedSprite3D = null;
			point.x = MouseManager.instance.mouseX;
			point.y = MouseManager.instance.mouseY;
			camera.viewportPointToRay(point, ray);
			scene.rayCast(ray, _outHitInfo, 100, 0);
			if (_outHitInfo.distance != -1) {
				hasSelectedSprite3D = _outHitInfo.sprite3D;
			}
			Laya.stage.on(Event.MOUSE_MOVE, this, onMouseMove);
		}
		
		public function onMouseMove():void {
			
		}
		
		public function onMouseUp():void {
			
			Laya.stage.off(Event.MOUSE_MOVE, this, onMouseMove);
			
			point.x = MouseManager.instance.mouseX;
			point.y = MouseManager.instance.mouseY;
			
			camera.viewportPointToRay(point, ray);
			scene.rayCast(ray, _outHitInfo, 100, 0);
			if (_outHitInfo.distance != -1) {
				if (hasSelectedSprite3D == _outHitInfo.sprite3D){
					debugger;
					onSelectGameObject();
				}
			}
		}
		
		public function onMouseOut():void {
			
			Laya.stage.off(Event.MOUSE_MOVE, this, onMouseMove);
		}
		
		private function loadUI():void{
			
			Laya.loader.load(["../../../../res/threeDimen/ui/button.png"], Handler.create(null, function():void {
                var changeActionButton:Button = Laya.stage.addChild(new Button("../../../../res/threeDimen/ui/button.png", "Global")) as Button;
                changeActionButton.size(160, 40);
                changeActionButton.labelBold = true;
                changeActionButton.labelSize = 30;
                changeActionButton.sizeGrid = "5,5,5,5";
                changeActionButton.scale(Browser.pixelRatio, Browser.pixelRatio);
                changeActionButton.pos(changeActionButton.width * Browser.pixelRatio, 100 * Browser.pixelRatio);
                changeActionButton.on(Event.CLICK, this, function():void {
                    if (++curStateIndex % 2 == 1) {
                        coordinatesModel = 1;
                        changeActionButton.label = "Local";
                    }
                    else {
                        coordinatesModel = 0;
                        changeActionButton.label = "Global";
                    }
                });
            }));
		}
		
	}

}