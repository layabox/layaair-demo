package  {
	import common.CameraMoveScript;
	import laya.d3.core.BaseCamera;
	import laya.d3.core.Camera;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.material.UnlitMaterial;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Vector3;
	import laya.d3.resource.RenderTexture;
	import laya.display.Sprite;
	import laya.display.Stage;
	import laya.events.Event;
	import laya.net.Loader;
	import laya.resource.Texture;
	import laya.ui.Button;
	import laya.utils.Browser;
	import laya.utils.Handler;
	import laya.utils.Stat;
	
	public class RenderTargetTo2DSprite {
		public function RenderTargetTo2DSprite() {
			//初始化引擎
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			//显示性能面板
			Stat.show();
			
			//预加载资源
			Laya.loader.create(["res/threeDimen/scene/LayaScene_city01/Conventional/city01.ls"], Handler.create(this, this.onComplete));
		}
		
		private function onComplete():void {
			//加载场景
			var scene:Scene3D = Laya.stage.addChild(Loader.getRes("res/threeDimen/scene/LayaScene_city01/Conventional/city01.ls")) as Scene3D;
			//添加相机
			var camera: Camera = scene.getChildByName("Main Camera");
			//相机添加视角控制组件(脚本)
			camera.addComponent(CameraMoveScript);
			
			//增加个小猴
			Sprite3D.load("res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", Handler.create(this, function (layaMonkey: Sprite3D): void {
				scene.addChild(layaMonkey);
				layaMonkey.transform.localScale = new Vector3(0.5, 0.5, 0.5);
				layaMonkey.transform.rotate(new Vector3(0, 180, 0), true, false);
				layaMonkey.transform.position = new Vector3(-28.8, 5, -53);
			}));


			Laya.loader.load(["res/threeDimen/ui/button.png"], Handler.create(this, function (): void {
				var changeActionButton: Button = Laya.stage.addChild(new Button("res/threeDimen/ui/button.png", "渲染到2DSprite"));
				changeActionButton.size(240, 40);
				changeActionButton.labelBold = true;
				changeActionButton.labelSize = 30;
				changeActionButton.sizeGrid = "4,4,4,4";
				changeActionButton.scale(Browser.pixelRatio, Browser.pixelRatio);
				changeActionButton.pos(Laya.stage.width / 2 - changeActionButton.width * Browser.pixelRatio / 2, Laya.stage.height - 100 * Browser.pixelRatio);
				changeActionButton.on(Event.CLICK, this, function (): void {
					//渲染到纹理的相机
					var renderTargetCamera: Camera = scene.addChild(new Camera(0, 0.3, 1000));
					renderTargetCamera.transform.position = new Vector3(-28.8, 8, -60);
					renderTargetCamera.transform.rotate(new Vector3(0, 180, 0), true, false);
					//选择渲染目标为纹理
					renderTargetCamera.renderTarget = new RenderTexture(512, 512);
					//渲染顺序
					renderTargetCamera.renderingOrder = -1;
					//清除标记
					renderTargetCamera.clearFlag = BaseCamera.CLEARFLAG_SKY;
					var rtex = new Texture(renderTargetCamera.renderTarget, Texture.DEF_UV);
					var sp = new Sprite();
					Laya.stage.addChild(sp);
					sp.graphics.drawTexture(rtex);
				});
			}));
		}
	}
}