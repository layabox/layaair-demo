package LayaAir3D_Material {
	import laya.d3.core.Camera;
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.light.DirectionLight;
	import laya.d3.core.material.BlinnPhongMaterial;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Vector3;
	import laya.display.Stage;
	import laya.utils.Handler;
	import laya.utils.Stat;
	import laya.webgl.resource.Texture2D;
	
	public class BlinnPhong_NormalMap {
		private var scene:Scene3D;
		private var rotation:Vector3 = new Vector3(0, 0.01, 0);
		private var normalMapUrl:Array = ["res/threeDimen/staticModel/lizard/Assets/Lizard/lizardeye_norm.png", "res/threeDimen/staticModel/lizard/Assets/Lizard/lizard_norm.png", "res/threeDimen/staticModel/lizard/Assets/Lizard/rock_norm.png"];
		
		public function BlinnPhong_NormalMap() {
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			Stat.show();
			
			scene = Laya.stage.addChild(new Scene3D()) as Scene3D;
			
			var camera:Camera = (scene.addChild(new Camera(0, 0.1, 100))) as Camera;
			camera.transform.translate(new Vector3(0, 0.6, 1.1));
			camera.transform.rotate(new Vector3(-30, 0, 0), true, false);
			
			var directionLight:DirectionLight = scene.addChild(new DirectionLight()) as DirectionLight;
			directionLight.transform.worldMatrix.setForward(new Vector3(0.0, -0.8, -1.0));
			directionLight.color.setValue(1, 1, 1);
			
			Laya.loader.create("res/threeDimen/staticModel/lizard/lizard.lh", Handler.create(this, onComplete), null, Laya3D.HIERARCHY);
		}
		
		public function onComplete(s:*):void {
			Sprite3D.load("res/threeDimen/staticModel/lizard/lizard.lh", Handler.create(null, function(sprite:Sprite3D):void {
				var monster1:Sprite3D = scene.addChild(sprite) as Sprite3D;
				monster1.transform.position = new Vector3(-0.6, 0, 0);
				monster1.transform.localScale = new Vector3(0.075, 0.075, 0.075);
				var monster2:Sprite3D = Sprite3D.instantiate(monster1, scene, false, new Vector3(0.6, 0, 0));
				monster2.transform.localScale = new Vector3(0.075, 0.075, 0.075);
				for (var i:int = 0; i < monster2.getChildByName("lizard").numChildren; i++) {
					var meshSprite3D:MeshSprite3D = monster2.getChildByName("lizard").getChildAt(i) as MeshSprite3D;
					var material:BlinnPhongMaterial = meshSprite3D.meshRenderer.material as BlinnPhongMaterial;
					//法线贴图
					Texture2D.load(normalMapUrl[i], Handler.create(null, function(mat:BlinnPhongMaterial, texture:Texture2D):void {
						mat.normalTexture = texture;
					}, [material]));
				}
				
				Laya.timer.frameLoop(1, null, function():void {
					monster1.transform.rotate(rotation);
					monster2.transform.rotate(rotation);
				});
			}));
		
		}
	
	}
}