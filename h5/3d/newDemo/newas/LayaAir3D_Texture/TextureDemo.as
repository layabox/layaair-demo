package LayaAir3D_Texture {
	import common.CameraMoveScript;
	import laya.d3.core.BufferState;
	import laya.d3.core.Camera;
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.light.DirectionLight;
	import laya.d3.core.material.BlinnPhongMaterial;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.graphics.IndexBuffer3D;
	import laya.d3.graphics.Vertex.VertexMesh;
	import laya.d3.graphics.VertexBuffer3D;
	import laya.d3.graphics.VertexDeclaration;
	import laya.d3.math.Vector3;
	import laya.d3.math.Vector4;
	import laya.d3.math.Matrix4x4;
	import laya.d3.resource.models.Mesh;
	import laya.d3.resource.models.PrimitiveMesh;
	import laya.d3.resource.models.SubMesh;
	import laya.display.Stage;
	import laya.utils.Handler;
	import laya.utils.Stat;
	import laya.webgl.WebGLContext;
	import laya.webgl.resource.BaseTexture;
	import laya.webgl.resource.Texture2D;
	
	/**
	 * ...
	 * @author ...
	 */
	public class TextureDemo {
		private var sprite3D:Sprite3D;
		
		public function TextureDemo() {
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			Stat.show();
			
			var scene:Scene3D = Laya.stage.addChild(new Scene3D()) as Scene3D;
			
			var camera:Camera = scene.addChild(new Camera(0, 0.1, 100)) as Camera;
			camera.transform.translate(new Vector3(0, 2, 5));
			camera.transform.rotate(new Vector3(-15, 0, 0), true, false);
			camera.addComponent(CameraMoveScript);
			camera.clearColor = new Vector4(0.2, 0.2, 0.2, 1.0);
			
			var directionLight:DirectionLight = scene.addChild(new DirectionLight()) as DirectionLight;
			//设置平行光的方向
			var mat:Matrix4x4 = directionLight.transform.worldMatrix;
			mat.setForward(new Vector3(-1.0, -1.0, -1.0));
			directionLight.transform.worldMatrix=mat;
			
			sprite3D = scene.addChild(new Sprite3D()) as Sprite3D;
			
			//正方体
			var box:MeshSprite3D = sprite3D.addChild(new MeshSprite3D(PrimitiveMesh.createBox(0.5, 0.5, 0.5))) as MeshSprite3D;
			box.transform.position = new Vector3(0.0, 1.0, 2.5);
			box.transform.rotate(new Vector3(0, 0, 0), false, false);
			var mat:BlinnPhongMaterial = new BlinnPhongMaterial();
			//漫反射贴图
			Texture2D.load("res/threeDimen/texture/layabox.png", Handler.create(null, function(texture:Texture2D):void {
				//在U方向上使用WARPMODE_CLAMP
				texture.wrapModeU = BaseTexture.WARPMODE_CLAMP;
				//在V方向使用WARPMODE_REPEAT
				texture.wrapModeV = BaseTexture.WARPMODE_REPEAT;
				//设置过滤方式
				texture.filterMode = BaseTexture.FILTERMODE_BILINEAR;
				//设置各向异性等级
				texture.anisoLevel = 2;
				
				mat.albedoTexture = texture;
				//修改材质贴图的平铺和偏移
				var tilingOffset:Vector4 = mat.tilingOffset;
				tilingOffset.setValue(2, 2, 0, 0);
				mat.tilingOffset = tilingOffset;
				
				box.meshRenderer.material = mat;
			}));
		
		}
	}
}
