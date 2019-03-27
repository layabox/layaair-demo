package LayaAir3D_Shader {
	import LayaAir3D_Shader.customMaterials.CustomMaterial;
	import common.CameraMoveScript;
	import laya.d3.core.Camera;
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.graphics.Vertex.VertexMesh;
	import laya.d3.math.Quaternion;
	import laya.d3.math.Vector3;
	import laya.d3.resource.models.Mesh;
	import laya.d3.shader.Shader3D;
	import laya.d3.shader.SubShader;
	import laya.display.Stage;
	import laya.utils.Handler;
	import laya.utils.Stat;
	
	/**
	 * ...
	 * @author ...
	 */
	public class Shader_Simple {
		
		private var rotation:Vector3 = new Vector3(0, 0.01, 0);
		
		public function Shader_Simple() {
			
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			Stat.show();
			
			initShader();
			
			var scene:Scene3D = Laya.stage.addChild(new Scene3D()) as Scene3D;
			
			var camera:Camera = (scene.addChild(new Camera(0, 0.1, 100))) as Camera;
			camera.transform.translate(new Vector3(0, 0.5, 1.5));
			camera.addComponent(CameraMoveScript);
			
			Mesh.load("res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/LayaMonkey-LayaMonkey.lm", Handler.create(null, function(mesh:Mesh):void {
				var layaMonkey:MeshSprite3D = scene.addChild(new MeshSprite3D(mesh)) as MeshSprite3D;
				layaMonkey.transform.localScale = new Vector3(0.3, 0.3, 0.3);
				layaMonkey.transform.rotation = new Quaternion(0.7071068, 0, 0, -0.7071067);
				
				var customMaterial:CustomMaterial = new CustomMaterial();
				layaMonkey.meshRenderer.sharedMaterial = customMaterial;
				
				Laya.timer.frameLoop(1, this, function():void {
					layaMonkey.transform.rotate(rotation, false);
				});
			}));
		}
		
		private function initShader():void {
			
			var attributeMap:Object = {'a_Position': VertexMesh.MESH_POSITION0, 'a_Normal': VertexMesh.MESH_NORMAL0};
			var uniformMap:Object = {'u_MvpMatrix': Shader3D.PERIOD_SPRITE, 'u_WorldMat': Shader3D.PERIOD_SPRITE};
			var vs:String = __INCLUDESTR__("customShader/simpleShader.vs");
			var ps:String = __INCLUDESTR__("customShader/simpleShader.ps");
			var customShader:Shader3D = Shader3D.add("CustomShader");
			var subShader:SubShader = new SubShader(attributeMap, uniformMap);
			customShader.addSubShader(subShader);
			subShader.addShaderPass(vs, ps);
		}
	
	}

}