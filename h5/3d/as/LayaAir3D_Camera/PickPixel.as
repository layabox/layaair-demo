package LayaAir3D_Camera {
	import common.CameraMoveScript;
	import laya.d3.core.BaseCamera;
	import laya.d3.core.Camera;
	import laya.d3.core.material.PBRSpecularMaterial;
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.material.BlinnPhongMaterial;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Vector3;
	import laya.d3.resource.RenderTexture;
	import laya.display.Stage;
	import laya.events.Event;
	import laya.net.Loader;
	import laya.ui.Button;
	import laya.utils.Browser;
	import laya.utils.Handler;
	import laya.utils.Stat;
	import laya.resource.BaseTexture;
	import laya.resource.Texture2D;
	import laya.d3.math.Ray;
	import laya.events.MouseManager
	import laya.display.Text;
	
	public class PickPixel {
		private var isPick:Boolean = false;
		private var changeActionButton:Button;
		private var ray:Ray;
		private var text:Text = new Text();
		private var renderTargetCamera:Camera;
		public function PickPixel() {
			//初始化引擎
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			//显示性能面板
			Stat.show();
			//射线初始化（必须初始化）
			ray = new Ray(new Vector3(0, 0, 0), new Vector3(0, 0, 0));

			//预加载资源
			Laya.loader.create(["res/threeDimen/scene/CourtyardScene/Courtyard.ls","res/threeDimen/texture/earth.png"], Handler.create(this, onComplete));
		}
		
		private function onMouseDown():void {
			var posX:int = MouseManager.instance.mouseX;
			var posY:int = MouseManager.instance.mouseY;
			var out:Uint8Array = new Uint8Array(4);
			renderTargetCamera.renderTarget.getData(posX, posY, 1, 1, out);
			text.text =  out[0] + " " + out[1] + " " + out[2] + " " + out[3];
		}
		
		private function onResize():void{
			var stageHeight:int = Laya.stage.height;
			var stageWidth:int = Laya.stage.width;
			renderTargetCamera.renderTarget.destroy();
			renderTargetCamera.renderTarget = new RenderTexture(stageWidth, stageHeight);
			text.x = Laya.stage.width / 2;
			changeActionButton.pos(Laya.stage.width / 2 - changeActionButton.width * Browser.pixelRatio / 2 , Laya.stage.height - 100 * Browser.pixelRatio);
		}
		private function onComplete():void {
			//加载场景
			var scene:Scene3D = Laya.stage.addChild(Loader.getRes("res/threeDimen/scene/CourtyardScene/Courtyard.ls")) as Scene3D;
			//添加相机
			var camera:Camera = scene.addChild(new Camera(0, 0.1, 1000)) as Camera;
			camera.transform.translate(new Vector3(57, 2.5, 58));
			camera.transform.rotate(new Vector3(-10, 150, 0), true, false);
			//设置相机清除标识
			camera.clearFlag = BaseCamera.CLEARFLAG_SKY;
			//相机添加视角控制组件(脚本)
			camera.addComponent(CameraMoveScript);
			
			//渲染到纹理的相机
			renderTargetCamera = scene.addChild(new Camera(0, 0.1, 1000)) as Camera;
			renderTargetCamera.transform.translate(new Vector3(57, 2.5, 58));
			renderTargetCamera.transform.rotate(new Vector3(-10, 150, 0), true, false);
			//选择渲染目标为纹理
			var stageHeight:int = Laya.stage.height;
			var stageWidth:int = Laya.stage.width;
			renderTargetCamera.renderTarget = new RenderTexture(stageWidth, stageHeight);
			//渲染顺序
			renderTargetCamera.renderingOrder = -1;
			//相机添加视角控制组件(脚本)
			renderTargetCamera.addComponent(CameraMoveScript);
			
			
			Laya.loader.load(["res/threeDimen/ui/button.png"], Handler.create(this, function():void {
				changeActionButton = Laya.stage.addChild(new Button("res/threeDimen/ui/button.png", "拾取像素")) as Button;
				changeActionButton.size(160, 40);
				changeActionButton.labelBold = true;
				changeActionButton.labelSize = 30;
				changeActionButton.sizeGrid = "4,4,4,4";
				changeActionButton.scale(Browser.pixelRatio, Browser.pixelRatio);
				changeActionButton.pos(Laya.stage.width / 2 - changeActionButton.width * Browser.pixelRatio / 2 , Laya.stage.height - 100 * Browser.pixelRatio);
				changeActionButton.on(Event.CLICK, this, function():void {
					if (isPick){
						Laya.stage.on(Event.MOUSE_DOWN, this, null);
						changeActionButton.label = "拾取像素";
						isPick = false;
					}
					else{
						//鼠标事件监听
						Laya.stage.on(Event.MOUSE_DOWN, this, onMouseDown);
						changeActionButton.label = "结束拾取";
						isPick = true;
					}
				});
			}));
			text.x = Laya.stage.width / 2 - 50;
			text.y = 50;
			text.overflow = Text.HIDDEN;
			text.color = "#FFFFFF";
			text.font = "Impact";
			text.fontSize = 20;
			text.borderColor = "#FFFF00";
			text.x = Laya.stage.width / 2;
			text.text = "选中的颜色：";
			Laya.stage.addChild(text);
			//添加舞台RESIZE事件
			Laya.stage.on(Event.RESIZE, this, onResize);
		}
	}
}