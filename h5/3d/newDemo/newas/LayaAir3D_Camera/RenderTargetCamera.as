package LayaAir3D_Camera {
	import common.CameraMoveScript;
	import laya.d3.core.BaseCamera;
	import laya.d3.core.Camera;
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
	
	public class RenderTargetCamera {
		public function RenderTargetCamera() {
			//初始化引擎
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			//显示性能面板
			Stat.show();
			
			//预加载资源
			Laya.loader.create(["res/threeDimen/scene/CourtyardScene/Courtyard.ls"], Handler.create(this, onComplete));
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
			var renderTargetCamera:Camera = scene.addChild(new Camera(0, 0.1, 1000)) as Camera;
			renderTargetCamera.transform.translate(new Vector3(57, 2.5, 58));
			renderTargetCamera.transform.rotate(new Vector3(-10, 150, 0), true, false);
			//选择渲染目标为纹理
			renderTargetCamera.renderTarget = new RenderTexture(2048, 2048);
			//渲染顺序
			renderTargetCamera.renderingOrder = -1;
			//相机添加视角控制组件(脚本)
			renderTargetCamera.addComponent(CameraMoveScript);
			
			//创建网格精灵
			var renderTargetObj:MeshSprite3D = scene.getChildAt(0).getChildByName("RenderTarget") as MeshSprite3D;
			
			Laya.loader.load(["res/threeDimen/ui/button.png"], Handler.create(this, function():void {
				var changeActionButton:Button = Laya.stage.addChild(new Button("res/threeDimen/ui/button.png", "渲染目标")) as Button;
				changeActionButton.size(160, 40);
				changeActionButton.labelBold = true;
				changeActionButton.labelSize = 30;
				changeActionButton.sizeGrid = "4,4,4,4";
				changeActionButton.scale(Browser.pixelRatio, Browser.pixelRatio);
				changeActionButton.pos(Laya.stage.width / 2 - changeActionButton.width * Browser.pixelRatio / 2, Laya.stage.height - 100 * Browser.pixelRatio);
				changeActionButton.on(Event.CLICK, this, function():void {
					//设置网格精灵的纹理
					(renderTargetObj.meshRenderer.material as BlinnPhongMaterial).albedoTexture = renderTargetCamera.renderTarget;
				});
			}));
		}
	}
}