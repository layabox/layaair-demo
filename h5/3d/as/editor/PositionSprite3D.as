package editor 
{
	import laya.d3.component.physics.MeshCollider;
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.material.BlinnPhongMaterial;
	import laya.d3.core.material.RenderState;
	import laya.d3.math.Vector3;
	import laya.d3.math.Vector4;
	import laya.d3.resource.models.Mesh;
	/**
	 * ...
	 * @author 
	 */
	public class PositionSprite3D extends Sprite3D
	{
		public var owner:Sprite3D;
		
		public var positionX:MeshSprite3D;
		public var positionY:MeshSprite3D;
		public var positionZ:MeshSprite3D;
		
		public var localPositionX:MeshSprite3D;
		public var localPositionY:MeshSprite3D;
		public var localPositionZ:MeshSprite3D; 
		
		public function PositionSprite3D(owner:Sprite3D) 
		{
			this.owner = owner;
			
			initPosition();
		}
		
		public function initPosition():void{
			
			positionX = addChild(new MeshSprite3D(Mesh.load("Editor/Assets/Editor/Position.lm"))) as MeshSprite3D;
			positionX.transform.rotate(new Vector3(0, 90, 0), false, false);
			
			var matX:BlinnPhongMaterial = new BlinnPhongMaterial();
			matX.albedoColor = new Vector4(1, 0, 0, 1);
			matX.renderQueue = 5000;
			var renderStateX:RenderState = matX.getRenderState();
			renderStateX.depthTest = RenderState.DEPTHTEST_OFF;
			positionX.meshRender.sharedMaterial = matX;
			
			var positionXCollider:MeshCollider = positionX.addComponent(MeshCollider) as MeshCollider;
			positionXCollider.mesh = positionX.meshFilter.sharedMesh;
			
			
			
			positionY = addChild(new MeshSprite3D(Mesh.load("Editor/Assets/Editor/Position.lm"))) as MeshSprite3D;
			positionY.transform.rotate(new Vector3( -90, 0, 0), false, false);
			
			var matY:BlinnPhongMaterial = new BlinnPhongMaterial();
			matY.albedoColor = new Vector4(0, 1, 0, 1);
			matY.renderQueue = 5000;
			var renderStateY:RenderState = matY.getRenderState();
			renderStateY.depthTest = RenderState.DEPTHTEST_OFF;
			positionY.meshRender.sharedMaterial = matY;
			
			var positionYCollider:MeshCollider = positionY.addComponent(MeshCollider) as MeshCollider;
			positionYCollider.mesh = positionY.meshFilter.sharedMesh;
			
			
			
			positionZ = addChild(new MeshSprite3D(Mesh.load("Editor/Assets/Editor/Position.lm"))) as MeshSprite3D;
			
			var matZ:BlinnPhongMaterial = new BlinnPhongMaterial();
			matZ.albedoColor = new Vector4(0, 0, 1, 1);
			matZ.renderQueue = 5000;
			var renderStateZ:RenderState = matZ.getRenderState();
			renderStateZ.depthTest = RenderState.DEPTHTEST_OFF;
			positionZ.meshRender.sharedMaterial = matZ;
			
			var positionZCollider:MeshCollider = positionZ.addComponent(MeshCollider) as MeshCollider;
			positionZCollider.mesh = positionZ.meshFilter.sharedMesh;
		}
	}
}