package LayaAir3D_Material {
	import common.CameraMoveScript;
	import laya.d3.core.Camera;
	import laya.d3.core.SkinnedMeshSprite3D;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.light.DirectionLight;
	import laya.d3.core.material.BlinnPhongMaterial;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Vector3;
	import laya.display.Stage;
	import laya.utils.Handler;
	import laya.utils.Stat;
	import laya.webgl.resource.Texture2D;
	
	/**
	 * ...
	 * @author
	 */
	public class BlinnPhong_SpecularMap {
		
		private var scene:Scene3D;
		private var rotation:Vector3 = new Vector3(0, 0.01, 0);
		private var specularMapUrl:Array = ["res/threeDimen/skinModel/dude/Assets/dude/headS.png", "res/threeDimen/skinModel/dude/Assets/dude/jacketS.png", "res/threeDimen/skinModel/dude/Assets/dude/pantsS.png", "res/threeDimen/skinModel/dude/Assets/dude/upBodyS.png", "res/threeDimen/skinModel/dude/Assets/dude/upBodyS.png"];
		
		public function BlinnPhong_SpecularMap() {
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			Stat.show();
			
			scene = Laya.stage.addChild(new Scene3D()) as Scene3D;
			
			var camera:Camera = (scene.addChild(new Camera(0, 0.1, 1000))) as Camera;
			camera.transform.translate(new Vector3(0, 3, 5));
			camera.transform.rotate(new Vector3(-15, 0, 0), true, false);
			camera.addComponent(CameraMoveScript);
			
			var directionLight:DirectionLight = scene.addChild(new DirectionLight()) as DirectionLight;
			directionLight.color.setValue(1, 1, 1);
			
			Laya.loader.create("res/threeDimen/skinModel/dude/dude.lh", Handler.create(this, onComplete));
		}
		
		public function onComplete():void {
			Sprite3D.load("res/threeDimen/skinModel/dude/dude.lh", Handler.create(null, function(sprite:Sprite3D):void {
				var dude1:Sprite3D = scene.addChild(sprite) as Sprite3D;
				dude1.transform.position = new Vector3(-1.5, 0, 0);
				
				var dude2:Sprite3D = Sprite3D.instantiate(dude1, scene, false, new Vector3(1.5, 0, 0));
				var skinnedMeshSprite3d:SkinnedMeshSprite3D = dude2.getChildAt(0).getChildAt(0) as SkinnedMeshSprite3D;
				
				for (var i:int = 0; i < skinnedMeshSprite3d.skinnedMeshRenderer.materials.length; i++) {
					var material:BlinnPhongMaterial = skinnedMeshSprite3d.skinnedMeshRenderer.materials[i] as BlinnPhongMaterial;
					Texture2D.load(specularMapUrl[i], Handler.create(null, function(mat:BlinnPhongMaterial, tex:Texture2D):void {
						mat.specularTexture = tex;//高光贴图
					}, [material]));
				}
				
				Laya.timer.frameLoop(1, null, function():void {
					dude1.transform.rotate(rotation);
					dude2.transform.rotate(rotation);
				});
			}));
		
		}
	}
}