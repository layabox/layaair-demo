package OfficialExample.LayaAir3D_Physics {
	import laya.d3.core.Camera;
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.light.DirectionLight;
	import laya.d3.core.material.BlinnPhongMaterial;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Vector3;
	import laya.d3.math.Vector4;
	import laya.d3.physics.PhysicsCollider;
	import laya.d3.physics.Rigidbody3D;
	import laya.d3.physics.shape.BoxColliderShape;
	import laya.d3.physics.shape.CapsuleColliderShape;
	import laya.d3.physics.shape.SphereColliderShape;
	import laya.d3.resource.models.PrimitiveMesh;
	import laya.display.Stage;
	import laya.events.KeyBoardManager;
	import laya.utils.Handler;
	import laya.utils.Stat;
	import laya.webgl.resource.Texture2D;
	
	public class PhysicsWorld_TriggerAndCollisionEvent {
		
		private var scene:Scene3D;
		private var camera:Camera;
		private var kinematicSphere:Sprite3D;
		
		public function PhysicsWorld_TriggerAndCollisionEvent() {
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			Stat.show();
			
			scene = Laya.stage.addChild(new Scene3D()) as Scene3D;
			
			camera = scene.addChild(new Camera(0, 0.1, 100)) as Camera;
			camera.transform.translate(new Vector3(0, 8, 18));
			camera.transform.rotate(new Vector3(-30, 0, 0), true, false);
			camera.clearColor = null;
			
			var directionLight:DirectionLight = scene.addChild(new DirectionLight()) as DirectionLight;
			directionLight.color = new Vector3(1, 1, 1);
			directionLight.transform.worldMatrix.setForward(new Vector3(-1.0, -1.0, 1.0));
			
			var plane:MeshSprite3D = scene.addChild(new MeshSprite3D(PrimitiveMesh.createPlane(20, 20, 10, 10))) as MeshSprite3D;
			var planeMat:BlinnPhongMaterial = new BlinnPhongMaterial();
			Texture2D.load("res/threeDimen/Physics/wood.jpg", Handler.create(null, function(tex:Texture2D):void {
				planeMat.albedoTexture = tex;
			}));
			planeMat.tilingOffset = new Vector4(2, 2, 0, 0);
			plane.meshRenderer.material = planeMat;
			
			var staticCollider:PhysicsCollider = plane.addComponent(PhysicsCollider) as PhysicsCollider;
			var boxShape:BoxColliderShape = new BoxColliderShape(20, 0, 20);
			staticCollider.colliderShape = boxShape;
			
			addKinematicSphere();
			for (var i:int = 0; i < 30; i++) {
				addBoxAndTrigger();
				addCapsuleCollision();
			}
		}
		
		public function addKinematicSphere():void {
			var mat2:BlinnPhongMaterial = new BlinnPhongMaterial();
			Texture2D.load("res/threeDimen/Physics/plywood.jpg", Handler.create(null, function(tex:Texture2D):void {
				mat2.albedoTexture = tex;
			}));
			mat2.albedoColor = new Vector4(1.0, 0.0, 0.0, 1.0);
			
			var radius:Number = 0.8;
			var sphere:MeshSprite3D = scene.addChild(new MeshSprite3D(PrimitiveMesh.createSphere(radius))) as MeshSprite3D;
			sphere.meshRenderer.material = mat2;
			sphere.transform.position = new Vector3(0, 0.8, 0);
			
			var rigidBody:Rigidbody3D = sphere.addComponent(Rigidbody3D);
			var sphereShape:SphereColliderShape = new SphereColliderShape(radius);
			rigidBody.colliderShape = sphereShape;
			rigidBody.mass = 60;
			rigidBody.isKinematic = true;
			
			kinematicSphere = sphere;
			Laya.timer.frameLoop(1, this, onKeyDown);
		}
		
		private function onKeyDown():void {
			KeyBoardManager.hasKeyDown(87) && kinematicSphere.transform.translate(new Vector3(0, 0, -0.2));//W
			KeyBoardManager.hasKeyDown(83) && kinematicSphere.transform.translate(new Vector3(0, 0, 0.2));//S
			KeyBoardManager.hasKeyDown(65) && kinematicSphere.transform.translate(new Vector3(-0.2, 0, 0));//A
			KeyBoardManager.hasKeyDown(68) && kinematicSphere.transform.translate(new Vector3(0.2, 0, 0));//D
			KeyBoardManager.hasKeyDown(81) && kinematicSphere.transform.translate(new Vector3(0, 0.2, 0));//Q
			KeyBoardManager.hasKeyDown(69) && kinematicSphere.transform.translate(new Vector3(0, -0.2, 0));//E
		}
		
		public function addBoxAndTrigger():void {
			//创建BlinnPhong材质
			var mat1:BlinnPhongMaterial = new BlinnPhongMaterial();
			Texture2D.load("res/threeDimen/Physics/rocks.jpg", Handler.create(null, function(tex:Texture2D):void {
				mat1.albedoTexture = tex;
			}));
			//设置反照率颜色
			mat1.albedoColor = new Vector4(1.0, 1.0, 1.0, 1.0);
			
			//随机生成坐标
			var sX:int = Math.random() * 0.75 + 0.25;
			var sY:int = Math.random() * 0.75 + 0.25;
			var sZ:int = Math.random() * 0.75 + 0.25;
			//创建盒型MeshSprite3D
			var box:MeshSprite3D = scene.addChild(new MeshSprite3D(PrimitiveMesh.createBox(sX, sY, sZ))) as MeshSprite3D;
			//设置材质
			box.meshRenderer.material = mat1;
			//设置位置
			box.transform.position = new Vector3(Math.random() * 16 - 8, sY / 2, Math.random() * 16 - 8);
			//设置欧拉角
			box.transform.rotationEuler = new Vector3(0, Math.random() * 360, 0);
			
			//创建物理碰撞器
			var staticCollider:PhysicsCollider = box.addComponent(PhysicsCollider);//StaticCollider可与非Kinematic类型RigidBody3D产生碰撞
			//创建盒型碰撞器
			var boxShape:BoxColliderShape = new BoxColliderShape(sX, sY, sZ);
			staticCollider.colliderShape = boxShape;
			//标记为触发器,取消物理反馈
			staticCollider.isTrigger = true;
			//添加触发器组件脚本
			var script:TriggerCollisionScript = box.addComponent(TriggerCollisionScript);
			script.kinematicSprite = kinematicSphere;
		}
		
		public function addCapsuleCollision():void {
			var mat3:BlinnPhongMaterial = new BlinnPhongMaterial();
			Texture2D.load("res/threeDimen/Physics/wood.jpg", Handler.create(null, function(tex:Texture2D):void {
				mat3.albedoTexture = tex;
			}));
			
			var raidius:int = Math.random() * 0.2 + 0.2;
			var height:int = Math.random() * 0.5 + 0.8;
			var capsule:MeshSprite3D = scene.addChild(new MeshSprite3D(PrimitiveMesh.createCapsule(raidius, height))) as MeshSprite3D;
			capsule.meshRenderer.material = mat3;
			capsule.transform.position = new Vector3(Math.random() * 4 - 2, 2, Math.random() * 4 - 2);
			capsule.transform.rotationEuler = new Vector3(Math.random() * 360, Math.random() * 360, Math.random() * 360);
			
			var rigidBody:Rigidbody3D = capsule.addComponent(Rigidbody3D);//Rigidbody3D可与StaticCollider和RigidBody3D产生碰撞
			var sphereShape:CapsuleColliderShape = new CapsuleColliderShape(raidius, height);
			rigidBody.colliderShape = sphereShape;
			rigidBody.mass = 10;
			var script:TriggerCollisionScript = capsule.addComponent(TriggerCollisionScript);
			script.kinematicSprite = kinematicSphere;
		
		}
		
		public function addSphere():void {
			var mat2:BlinnPhongMaterial = new BlinnPhongMaterial();
			Texture2D.load("res/threeDimen/Physics/plywood.jpg", Handler.create(null, function(tex:Texture2D):void {
				mat2.albedoTexture = tex;
			}));
			
			var radius:Number = Math.random() * 0.2 + 0.2;
			var sphere:MeshSprite3D = scene.addChild(new MeshSprite3D(PrimitiveMesh.createSphere(radius))) as MeshSprite3D;
			sphere.meshRenderer.material = mat2;
			sphere.transform.position = new Vector3(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
			
			var rigidBody:Rigidbody3D = sphere.addComponent(Rigidbody3D);
			var sphereShape:SphereColliderShape = new SphereColliderShape(radius);
			rigidBody.colliderShape = sphereShape;
			rigidBody.mass = 10;
		}
	}
}

import laya.d3.component.Script3D;
import laya.d3.core.MeshRenderer;
import laya.d3.core.MeshSprite3D;
import laya.d3.core.Sprite3D;
import laya.d3.core.material.BlinnPhongMaterial;
import laya.d3.math.Vector4;
import laya.d3.physics.Collision;
import laya.d3.physics.PhysicsComponent;

class TriggerCollisionScript extends Script3D {
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