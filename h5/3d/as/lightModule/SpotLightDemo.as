package lightModule {
	import laya.d3.component.Animator;
	import laya.d3.component.AnimatorState;
	import laya.d3.core.Camera;
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.light.SpotLight;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Quaternion;
	import laya.d3.math.Vector3;
	import laya.d3.resource.models.Mesh;
	import laya.display.Stage;
	import laya.events.Event;
	import laya.utils.Handler;
	import laya.utils.Stat;
	import common.CameraMoveScript;
	
	/**
	 * ...
	 * @author ...
	 */
	public class SpotLightDemo {
		
		private var _quaternion:Quaternion = new Quaternion();
		private var _direction:Vector3 = new Vector3();
		
		public function SpotLightDemo() {
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			Stat.show();
			
			var scene:Scene3D = Laya.stage.addChild(new Scene3D()) as Scene3D;
			
			var camera:Camera = (scene.addChild(new Camera(0, 0.1, 1000))) as Camera;
			camera.transform.translate(new Vector3(0, 0.7, 1.3));
			camera.transform.rotate(new Vector3(-15, 0, 0), true, false);
			camera.addComponent(CameraMoveScript);
			
			//聚光灯
			var spotLight:SpotLight = scene.addChild(new SpotLight()) as SpotLight;
			spotLight.color = new Vector3(1, 1, 0);
			spotLight.transform.position = new Vector3(0.0, 1.2, 0.0);
			spotLight.transform.worldMatrix.setForward(new Vector3(0.15, -1.0, 0.0));
			spotLight.range = 6.0;
			spotLight.spotAngle = 32;
			
			Sprite3D.load("../../../../res/threeDimen/staticModel/grid/plane.lh", Handler.create(null, function(sprite:Sprite3D):void {
				scene.addChild(sprite) as Sprite3D;
				Sprite3D.load("../../../../res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", Handler.create(null, function(layaMonkey:Sprite3D):void {
					scene.addChild(layaMonkey) as Sprite3D;
					var aniSprite3d:Sprite3D = layaMonkey.getChildAt(0) as Sprite3D;
					var animator:Animator = aniSprite3d.getComponent(Animator) as Animator;
					
					var state:AnimatorState = new AnimatorState();
					state.name = "happy";
					state.clipStart = 115 / 150;
					state.clipEnd = 150 / 150;
					state.clip = animator.getDefaultState().clip;
					animator.addState(state);
					
					animator.play("happy");
					
					Laya.timer.frameLoop(1, null, function():void {
						Quaternion.createFromYawPitchRoll(0.025, 0, 0, _quaternion);
						spotLight.transform.worldMatrix.getForward(_direction);
						Vector3.transformQuat(_direction, _quaternion, _direction);
						spotLight.transform.worldMatrix.setForward(_direction);
					});
				}));
			
			}));
		
		}
	}
}