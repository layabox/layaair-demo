package LayaAir3D_Advance {
	import common.CameraMoveScript;
	import laya.d3.component.PostProcess;
	import laya.d3.core.Camera;
	import laya.d3.core.render.BloomEffect;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Color;
	import laya.display.Stage;
	import laya.events.Event;
	import laya.resource.Texture2D;
	import laya.ui.Button;
	import laya.utils.Browser;
	import laya.utils.Handler;
	import laya.utils.Stat;
	
	public class PostProcessBloom {
		public var camera:Camera = null;
		
		/**
		 *@private
		 */
		public function PostProcessBloom() {
			//初始化引擎
			Laya3D.init(0, 0);
			Stat.show();
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			//加载场景
			Scene3D.load("res/threeDimen/scene/LayaScene_BloomScene/Conventional/BloomScene.ls", Handler.create(this, function(scene:Scene3D):void {
				Laya.stage.addChild(scene) as Scene3D;
				
				//获取场景中的相机
				camera = scene.getChildByName("Main Camera") as Camera;
				//加入摄像机移动控制脚本
				camera.addComponent(CameraMoveScript);
				
				//增加后期处理
				var postProcess:PostProcess = new PostProcess();
				//增加后期处理泛光效果
				var bloom:BloomEffect = new BloomEffect();
				postProcess.addEffect(bloom);
				camera.postProcess = postProcess;
				camera.enableHDR = true;
				
				//设置泛光参数
				bloom.intensity = 5;
				bloom.threshold = 0.9;
				bloom.softKnee = 0.5;
				bloom.clamp = 65472;
				bloom.diffusion = 5;
				bloom.anamorphicRatio = 0.0;
				bloom.color = new Color(1, 1, 1, 1);
				bloom.fastMode = true;
				
				//增加污渍纹理参数
				Texture2D.load("res/threeDimen/scene/LayaScene_BloomScene/Conventional/Assets/LensDirt01.png", Handler.create(null, function(tex:Texture2D):void {
					bloom.dirtTexture = tex;
					bloom.dirtIntensity = 2.0;
				}));
				
				//加载UI
				loadUI();
			}));
		}
		
		/**
		 *@private
		 */
		public function loadUI():void {
			Laya.loader.load(["res/threeDimen/ui/button.png"], Handler.create(this, function():void {
				var button:Button = Laya.stage.addChild(new Button("res/threeDimen/ui/button.png", "关闭HDR")) as Button;
				button.size(200, 40);
				button.labelBold = true;
				button.labelSize = 30;
				button.sizeGrid = "4,4,4,4";
				button.scale(Browser.pixelRatio, Browser.pixelRatio);
				button.pos(Laya.stage.width / 2 - button.width * Browser.pixelRatio / 2, Laya.stage.height - 60 * Browser.pixelRatio);
				button.on(Event.CLICK, this, function():void {
					var enableHDR:Boolean = camera.enableHDR;
					if (enableHDR)
						button.label = "开启HDR";
					else
						button.label = "关闭HDR";
					camera.enableHDR = !enableHDR;
				});
			
			}));
		}
	}
}