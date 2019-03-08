import CameraMoveScript from "./common/CameraMoveScript"
class TextureDemo{
	private sprite3D:Laya.Sprite3D;
    constructor(){
        this.sprite3D =null;
        Laya3D.init(0, 0);
		Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
		Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
		Laya.Stat.show();
			
		var scene = Laya.stage.addChild(new Laya.Scene3D());
			
		var camera = new Laya.Camera(0, 0.1, 100);
		scene.addChild(camera);
		camera.transform.translate(new Laya.Vector3(0, 2, 5));
		camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
		camera.addComponent(CameraMoveScript);
		camera.clearColor = new Laya.Vector4(0.2, 0.2, 0.2, 1.0);
			
		var directionLight = new Laya.DirectionLight();
		scene.addChild(directionLight);
		directionLight.transform.worldMatrix.setForward(new Laya.Vector3(1.0, -1.0, -1.0));
			
		this.sprite3D = new Laya.Sprite3D();
		scene.addChild(this.sprite3D);
			
		//正方体
		var box = new Laya.MeshSprite3D(this.CustomizeCube(0.5, 0.5, 0.5));
		this.sprite3D.addChild(box);
		box.transform.position = new Laya.Vector3(0.0, 1.0, 2.5);
		box.transform.rotate(new Laya.Vector3(0, 0, 0), false, false);
		var mat = new Laya.BlinnPhongMaterial();
		//漫反射贴图
		Laya.Texture2D.load("res/threeDimen/texture/layabox.png", Laya.Handler.create(this, function(texture) {
			//在U方向上使用WARPMODE_CLAMP
			texture.wrapModeU = Laya.BaseTexture.WARPMODE_CLAMP;
			//在V方向使用WARPMODE_REPEAT
			texture.wrapModeV = Laya.BaseTexture.WARPMODE_REPEAT;
			//设置过滤方式
			texture._setFilterMode(Laya.BaseTexture.FILTERMODE_BILINEAR);
			//设置各向异性等级
			texture.anisoLevel = 2;
			mat.albedoTexture = texture;
			box.meshRenderer.material = mat;
		}));
	}
	_createMesh(vertexDeclaration, vertices, indices){
		var mesh = new Laya.Mesh();
		var subMesh = new Laya.SubMesh(mesh);
			
		var vertexBuffer = new Laya.VertexBuffer3D(vertices.length * 4, Laya.WebGLContext.STATIC_DRAW, true);
		vertexBuffer.vertexDeclaration = vertexDeclaration;
		vertexBuffer.setData(vertices);
		mesh._vertexBuffers.push(vertexBuffer);
		mesh._vertexCount += vertexBuffer.vertexCount;
		var indexBuffer = new Laya.IndexBuffer3D(Laya.IndexBuffer3D.INDEXTYPE_USHORT, indices.length, Laya.WebGLContext.STATIC_DRAW, true);
		indexBuffer.setData(indices);
		mesh._indexBuffer = indexBuffer;
			
		var bufferState = mesh._bufferState;
		bufferState.bind();
		bufferState.applyVertexBuffer(vertexBuffer);
		bufferState.applyIndexBuffer(indexBuffer);
		bufferState.unBind();
			
		subMesh._vertexBuffer = vertexBuffer;
		subMesh._indexBuffer = indexBuffer;
		subMesh._indexStart = 0;
		subMesh._indexCount = indexBuffer.indexCount;
			
		var subIndexBufferStart = subMesh._subIndexBufferStart;
		var subIndexBufferCount = subMesh._subIndexBufferCount;
		var boneIndicesList = subMesh._boneIndicesList;
		subIndexBufferStart.length = 1;
		subIndexBufferCount.length = 1;
		boneIndicesList.length = 1;
		subIndexBufferStart[0] = 0;
		subIndexBufferCount[0] = indexBuffer.indexCount;
			
		var subMeshes = new Array();
		subMeshes.push(subMesh);
		mesh._setSubMeshes(subMeshes);
		var memorySize = vertexBuffer._byteLength + indexBuffer._byteLength;
		mesh._setCPUMemory(memorySize);
		mesh._setGPUMemory(memorySize);
		return mesh;
	}
	CustomizeCube(long, height, width){
		const vertexCount = 24;
		const indexCount = 36;
			
		var vertexDeclaration = Laya.VertexMesh.getVertexDeclaration("POSITION,NORMAL,UV");
			
		var halfLong = long / 2;
		var halfHeight = height / 2;
		var halfWidth = width / 2;
			
		var vertices = new Float32Array([
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
			
		var indices = new Uint16Array([
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
		return this._createMesh(vertexDeclaration, vertices, indices);
	}
}
//激活启动类
new TextureDemo();