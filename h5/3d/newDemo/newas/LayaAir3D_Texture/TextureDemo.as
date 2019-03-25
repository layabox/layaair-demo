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
	import laya.d3.resource.models.Mesh;
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
			directionLight.transform.worldMatrix.setForward(new Vector3(1.0, -1.0, -1.0));
			
			sprite3D = scene.addChild(new Sprite3D()) as Sprite3D;
			
			//正方体
			var box:MeshSprite3D = sprite3D.addChild(new MeshSprite3D(CustomizeCube(0.5, 0.5, 0.5))) as MeshSprite3D;
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
				box.meshRenderer.material = mat;
			}));
		
		}
		
		public static function _createMesh(vertexDeclaration:VertexDeclaration, vertices:Float32Array, indices:Uint16Array):Mesh {
			var mesh:Mesh = new Mesh();
			var subMesh:SubMesh = new SubMesh(mesh);
			
			var vertexBuffer:VertexBuffer3D = new VertexBuffer3D(vertices.length * 4, WebGLContext.STATIC_DRAW, true);
			vertexBuffer.vertexDeclaration = vertexDeclaration;
			vertexBuffer.setData(vertices);
			mesh._vertexBuffers.push(vertexBuffer);
			mesh._vertexCount += vertexBuffer.vertexCount;
			var indexBuffer:IndexBuffer3D = new IndexBuffer3D(IndexBuffer3D.INDEXTYPE_USHORT, indices.length, WebGLContext.STATIC_DRAW, true);
			indexBuffer.setData(indices);
			mesh._indexBuffer = indexBuffer;
			
			var bufferState:BufferState = mesh._bufferState;
			bufferState.bind();
			bufferState.applyVertexBuffer(vertexBuffer);
			bufferState.applyIndexBuffer(indexBuffer);
			bufferState.unBind();
			
			subMesh._vertexBuffer = vertexBuffer;
			subMesh._indexBuffer = indexBuffer;
			subMesh._indexStart = 0;
			subMesh._indexCount = indexBuffer.indexCount;
			
			var subIndexBufferStart:Vector.<int> = subMesh._subIndexBufferStart;
			var subIndexBufferCount:Vector.<int> = subMesh._subIndexBufferCount;
			var boneIndicesList:Vector.<Uint16Array> = subMesh._boneIndicesList;
			subIndexBufferStart.length = 1;
			subIndexBufferCount.length = 1;
			boneIndicesList.length = 1;
			subIndexBufferStart[0] = 0;
			subIndexBufferCount[0] = indexBuffer.indexCount;
			
			var subMeshes:Vector.<SubMesh> = new Vector.<SubMesh>();
			subMeshes.push(subMesh);
			mesh._setSubMeshes(subMeshes);
			var memorySize:int = vertexBuffer._byteLength + indexBuffer._byteLength;
			mesh._setCPUMemory(memorySize);
			mesh._setGPUMemory(memorySize);
			return mesh;
		}
		
		/**
		 * 创建Box网格。
		 * @param long 半径
		 * @param height 垂直层数
		 * @param width 水平层数
		 * @return
		 */
		public static function CustomizeCube(long:Number = 1, height:int = 1, width:Number = 1):Mesh {
			const vertexCount:int = 24;
			const indexCount:int = 36;
			
			var vertexDeclaration:VertexDeclaration = VertexMesh.getVertexDeclaration("POSITION,NORMAL,UV");
			
			var halfLong:Number = long / 2;
			var halfHeight:Number = height / 2;
			var halfWidth:Number = width / 2;
			
			var vertices:Float32Array = new Float32Array([
			//上
			-halfLong, halfHeight, -halfWidth, 0, 1, 0, 0, 0, halfLong, halfHeight, -halfWidth, 0, 1, 0, 2, 0, halfLong, halfHeight, halfWidth, 0, 1, 0, 2, 2, -halfLong, halfHeight, halfWidth, 0, 1, 0, 0, 2, 
			//下
			-halfLong, -halfHeight, -halfWidth, 0, -1, 0, 0, 2, halfLong, -halfHeight, -halfWidth, 0, -1, 0, 2, 2, halfLong, -halfHeight, halfWidth, 0, -1, 0, 2, 0, -halfLong, -halfHeight, halfWidth, 0, -1, 0, 0, 0, 
			//左
			-halfLong, halfHeight, -halfWidth, -1, 0, 0, 0, 0, -halfLong, halfHeight, halfWidth, -1, 0, 0, 2, 0, -halfLong, -halfHeight, halfWidth, -1, 0, 0, 2, 2, -halfLong, -halfHeight, -halfWidth, -1, 0, 0, 0, 2, 
			//右
			halfLong, halfHeight, -halfWidth, 1, 0, 0, 2, 0, halfLong, halfHeight, halfWidth, 1, 0, 0, 0, 0, halfLong, -halfHeight, halfWidth, 1, 0, 0, 0, 2, halfLong, -halfHeight, -halfWidth, 1, 0, 0, 2, 2, 
			//前
			-halfLong, halfHeight, halfWidth, 0, 0, 1, 0, 0, halfLong, halfHeight, halfWidth, 0, 0, 1, 2, 0, halfLong, -halfHeight, halfWidth, 0, 0, 1, 2, 2, -halfLong, -halfHeight, halfWidth, 0, 0, 1, 0, 2, 
			//后
			-halfLong, halfHeight, -halfWidth, 0, 0, -1, 2, 0, halfLong, halfHeight, -halfWidth, 0, 0, -1, 0, 0, halfLong, -halfHeight, -halfWidth, 0, 0, -1, 0, 2, -halfLong, -halfHeight, -halfWidth, 0, 0, -1, 2, 2]);
			
			var indices:Uint16Array = new Uint16Array([
			//上
			0, 1, 2, 2, 3, 0, 
			//下
			4, 7, 6, 6, 5, 4, 
			//左
			8, 9, 10, 10, 11, 8, 
			//右
			12, 15, 14, 14, 13, 12, 
			//前
			16, 17, 18, 18, 19, 16, 
			//后
			20, 23, 22, 22, 21, 20]);
			return _createMesh(vertexDeclaration, vertices, indices);
		}
	
	}
}
