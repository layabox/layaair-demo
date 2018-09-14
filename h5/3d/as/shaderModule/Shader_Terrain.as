package shaderModule {
	import common.CameraMoveScript;
	import laya.d3.core.BaseCamera;
	import laya.d3.core.Camera;
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.RenderableSprite3D;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.graphics.Vertex.VertexMesh;
	import laya.d3.math.Vector2;
	import laya.d3.math.Vector3;
	import laya.d3.math.Vector4;
	import laya.d3.resource.Texture2D;
	import laya.d3.resource.models.Mesh;
	import laya.d3.shader.Shader3D;
	import laya.display.Stage;
	import laya.events.Event;
	import laya.utils.Handler;
	import laya.utils.Stat;
	import laya.webgl.resource.Texture2D;
	import shaderModule.customMaterials.CustomTerrainMaterial;
	
	/**
	 * ...
	 * @author
	 */
	public class Shader_Terrain {
		
		public function Shader_Terrain() {
			
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			Stat.show();
			
			initShader();
			
			var scene:Scene3D = Laya.stage.addChild(new Scene3D) as Scene3D;
			
			var camera:Camera = scene.addChild(new Camera(0, 0.1, 1000)) as Camera;
			camera.transform.rotate(new Vector3(-18, 180, 0), false, false);
			camera.transform.translate(new Vector3(-28, 20, -18), false);
			camera.addComponent(CameraMoveScript);
			
			Mesh.load("../../../../res/threeDimen/skinModel/Terrain/terrain_New-Part-01.lm", Handler.create(null, function(mesh:Mesh):void {
				var terrain:MeshSprite3D = scene.addChild(new MeshSprite3D(mesh)) as MeshSprite3D;
				var customMaterial:CustomTerrainMaterial = new CustomTerrainMaterial();
				Texture2D.load("../../../../res/threeDimen/skinModel/Terrain/splatAlphaTexture.png", Handler.create(null, function(tex:Texture2D):void {
					customMaterial.splatAlphaTexture = tex;
				}));
				Texture2D.load("../../../../res/threeDimen/skinModel/Terrain/ground_01.jpg", Handler.create(null, function(tex:Texture2D):void {
					customMaterial.diffuseTexture1 = tex;
				}));
				
				Texture2D.load("../../../../res/threeDimen/skinModel/Terrain/ground_02.jpg", Handler.create(null, function(tex:Texture2D):void {
					customMaterial.diffuseTexture2 = tex;
				}));
				
				Texture2D.load("../../../../res/threeDimen/skinModel/Terrain/ground_03.jpg", Handler.create(null, function(tex:Texture2D):void {
					customMaterial.diffuseTexture3 = tex;
				}));
				
				Texture2D.load("../../../../res/threeDimen/skinModel/Terrain/ground_04.jpg", Handler.create(null, function(tex:Texture2D):void {
					customMaterial.diffuseTexture4 = tex;
				}))
				customMaterial.setDiffuseScale1(new Vector2(27.92727, 27.92727));
				customMaterial.setDiffuseScale2(new Vector2(13.96364, 13.96364));
				customMaterial.setDiffuseScale3(new Vector2(18.61818, 18.61818));
				customMaterial.setDiffuseScale4(new Vector2(13.96364, 13.96364));
				customMaterial.ambientColor = new Vector3(1, 1, 1);
				customMaterial.diffuseColor = new Vector3(1, 1, 1);
				customMaterial.specularColor = new Vector4(1, 1, 1, 8);
				terrain.meshRenderer.sharedMaterial = customMaterial;
			}))
		
		}
		
		private function initShader():void {
			
			CustomTerrainMaterial.__init__();
			var attributeMap:Object = {'a_Position': VertexMesh.MESH_POSITION0, 'a_Normal': VertexMesh.MESH_NORMAL0, 'a_Texcoord0': VertexMesh.MESH_TEXTURECOORDINATE0};
			var uniformMap:Object = {'u_MvpMatrix': [Sprite3D.MVPMATRIX, Shader3D.PERIOD_SPRITE], 'u_WorldMat': [Sprite3D.WORLDMATRIX, Shader3D.PERIOD_SPRITE], 'u_CameraPos': [BaseCamera.CAMERAPOS, Shader3D.PERIOD_CAMERA], 'u_SplatAlphaTexture': [CustomTerrainMaterial.SPLATALPHATEXTURE, Shader3D.PERIOD_MATERIAL], 'u_DiffuseTexture1': [CustomTerrainMaterial.DIFFUSETEXTURE1, Shader3D.PERIOD_MATERIAL], 'u_DiffuseTexture2': [CustomTerrainMaterial.DIFFUSETEXTURE2, Shader3D.PERIOD_MATERIAL], 'u_DiffuseTexture3': [CustomTerrainMaterial.DIFFUSETEXTURE3, Shader3D.PERIOD_MATERIAL], 'u_DiffuseTexture4': [CustomTerrainMaterial.DIFFUSETEXTURE4, Shader3D.PERIOD_MATERIAL], 'u_DiffuseTexture5': [CustomTerrainMaterial.DIFFUSETEXTURE5, Shader3D.PERIOD_MATERIAL], 'u_DiffuseScale1': [CustomTerrainMaterial.DIFFUSESCALE1, Shader3D.PERIOD_MATERIAL], 'u_DiffuseScale2': [CustomTerrainMaterial.DIFFUSESCALE2, Shader3D.PERIOD_MATERIAL], 'u_DiffuseScale3': [CustomTerrainMaterial.DIFFUSESCALE3, Shader3D.PERIOD_MATERIAL], 'u_DiffuseScale4': [CustomTerrainMaterial.DIFFUSESCALE4, Shader3D.PERIOD_MATERIAL], 'u_DiffuseScale5': [CustomTerrainMaterial.DIFFUSESCALE5, Shader3D.PERIOD_MATERIAL]};
			
			var vs:String = __INCLUDESTR__("customShader/terrainShader.vs");
			var ps:String = __INCLUDESTR__("customShader/terrainShader.ps");
			var customTerrianShader:Shader3D = Shader3D.add("CustomTerrainShader", attributeMap, uniformMap, RenderableSprite3D.shaderDefines, CustomTerrainMaterial.shaderDefines);
			customTerrianShader.addShaderPass(vs, ps);
		}
	
	}

}