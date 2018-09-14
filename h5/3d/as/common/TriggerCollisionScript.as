package common {
	import laya.d3.component.Script3D;
	import laya.d3.core.MeshRenderer;
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.material.BlinnPhongMaterial;
	import laya.d3.math.Vector4;
	import laya.d3.physics.Collision;
	import laya.d3.physics.PhysicsComponent;
	import laya.utils.Stat;
	
	/**
	 * ...
	 * @author ...
	 */
	public class TriggerCollisionScript extends Script3D {
		public var kinematicSprite:Sprite3D;
		
		public function TriggerCollisionScript() {
		
		}
		
		override public function onTriggerEnter(other:PhysicsComponent):void {
			(((owner as MeshSprite3D).meshRenderer as MeshRenderer).sharedMaterial as BlinnPhongMaterial).albedoColor = new Vector4(0.0, 1.0, 0.0, 1.0);
		}
		
		override public function onTriggerStay(other:PhysicsComponent):void {
		
		}
		
		override public function onTriggerExit(other:PhysicsComponent):void {
			(((owner as MeshSprite3D).meshRenderer as MeshRenderer).sharedMaterial as BlinnPhongMaterial).albedoColor = new Vector4(1.0, 1.0, 1.0, 1.0);
		}
		
		override public function onCollisionEnter(collision:Collision):void {
			if (collision.other.owner === kinematicSprite)
				(((owner as MeshSprite3D).meshRenderer as MeshRenderer).sharedMaterial as BlinnPhongMaterial).albedoColor = new Vector4(0.0, 0.0, 0.0, 1.0);
		}
		
		override public function onCollisionStay(collision:Collision):void {
		}
		
		override public function onCollisionExit(collision:Collision):void {
		}
	
	}

}