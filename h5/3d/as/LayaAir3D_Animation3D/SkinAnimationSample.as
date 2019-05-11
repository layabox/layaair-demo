package LayaAir3D_Animation3D {
	import common.CameraMoveScript;
	import laya.d3.component.Animator;
	import laya.d3.core.Camera;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.light.DirectionLight;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Vector3;
	import laya.d3.math.Matrix4x4;
	import laya.d3.math.Vector4;
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
	public class SkinAnimationSample {
		private var changeActionButton:Button;
		private var zombieAnimator:Animator;
		private var curStateIndex:int = 0;
		private var clipName:Array = ["idle", "fallingback", "idle", "walk", "Take 001"];
		private var _translate:Vector3 = new Vector3(0, 1.5, 4);
		private var _rotation:Vector3 = new Vector3( -15, 0, 0);
		private var _forward:Vector3 = new Vector3(-1.0, -1.0, -1.0);
		
		public function SkinAnimationSample() {
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			Stat.show();
			
			var scene:Scene3D = Laya.stage.addChild(new Scene3D()) as Scene3D;
			
			var camera:Camera = (scene.addChild(new Camera(0, 0.1, 1000))) as Camera;
			camera.transform.translate(_translate);
			camera.transform.rotate(_rotation, true, false);
			camera.addComponent(CameraMoveScript);
			
			var directionLight:DirectionLight = scene.addChild(new DirectionLight()) as DirectionLight;
			//设置平行光的方向
			var mat:Matrix4x4 = directionLight.transform.worldMatrix;
			mat.setForward(_forward);
			directionLight.transform.worldMatrix=mat;
			directionLight.color.setValue(1, 1, 1);
			
			Sprite3D.load("res/threeDimen/skinModel/Zombie/Plane.lh", Handler.create(this, function(plane:Sprite3D):void {
				scene.addChild(plane);
			}));
			
			Sprite3D.load("res/threeDimen/skinModel/Zombie/Zombie.lh", Handler.create(this, function(zombie:Sprite3D):void {
				scene.addChild(zombie);
				zombieAnimator = (zombie.getChildAt(0) as Sprite3D).getComponent(Animator) as Animator;//获取Animator动画组件
				loadUI();
			}));
		}
		
		private function loadUI():void {
			
			Laya.loader.load(["res/threeDimen/ui/button.png"], Handler.create(this, function():void {
				
				changeActionButton = Laya.stage.addChild(new Button("res/threeDimen/ui/button.png", "切换动作")) as Button;
				changeActionButton.size(160, 40);
				changeActionButton.labelBold = true;
				changeActionButton.labelSize = 30;
				changeActionButton.sizeGrid = "4,4,4,4";
				changeActionButton.scale(Browser.pixelRatio, Browser.pixelRatio);
				changeActionButton.pos(Laya.stage.width / 2 - changeActionButton.width * Browser.pixelRatio / 2, Laya.stage.height - 100 * Browser.pixelRatio);
				changeActionButton.on(Event.CLICK, this, function():void {
					//根据名称播放动画
					zombieAnimator.play(clipName[++curStateIndex % clipName.length]);
				});
			
			}));
		}
	
	}
}