package  {
	import common.CameraMoveScript;
	import laya.d3.core.Camera;
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.Transform3D;
	import laya.d3.core.light.DirectionLight;
	import laya.d3.core.material.BlinnPhongMaterial;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Matrix4x4;
	import laya.d3.math.Vector3;
	import laya.d3.math.Vector4;
	import laya.d3.physics.PhysicsCollider;
	import laya.d3.physics.Rigidbody3D;
	import laya.d3.physics.constraints.FixedConstraint;
	import laya.d3.physics.shape.BoxColliderShape;
	import laya.d3.physics.shape.CapsuleColliderShape;
	import laya.d3.physics.shape.ConeColliderShape;
	import laya.d3.physics.shape.CylinderColliderShape;
	import laya.d3.physics.shape.SphereColliderShape;
	import laya.d3.resource.models.PrimitiveMesh;
	import laya.display.Stage;
	import laya.resource.Texture2D;
	import laya.utils.Handler;
	import laya.utils.Stat;

	
	/**
	 * ...
	 * @author zqx
	 */
	public class Main {		
		private var scene:Scene3D;
		private var camera: Camera;
			
		public function Main() {
			 Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			Stat.show();
			this.scene = Laya.stage.addChild(new Scene3D());
			this.camera = this.scene.addChild(new Camera(0, 0.1, 100));
			this.camera.transform.translate(new Vector3(0, 3, 10));
			this.camera.clearColor = null;
			var directionLight: DirectionLight = this.scene.addChild(new DirectionLight());
			directionLight.color = new Vector3(1, 1, 1);
			//directionLight.transform.worldMatrix.setForward(new Vector3(1.0, -0.5, 0.5));
			//设置平行光的方向
			var mat: Matrix4x4 = directionLight.transform.worldMatrix;
			mat.setForward(new Vector3(-1.0, -1.0, -1.0));
			directionLight.transform.worldMatrix = mat;
			this.addbox();
		}
		
		
		
		public function addbox():void{
		
			//创建盒型MeshSprite3D
			var box: MeshSprite3D = this.scene.addChild(new MeshSprite3D(PrimitiveMesh.createBox(1, 1, 1))) as MeshSprite3D;
			//设置材质
			var transform: Transform3D = box.transform;
			var pos: Vector3 = transform.position;
			pos.setValue(0, 5, 0);
			transform.position = pos;

			//创建刚体碰撞器
			var rigidBody: Rigidbody3D = box.addComponent(Rigidbody3D);
			//创建盒子形状碰撞器
			var boxShape: BoxColliderShape = new BoxColliderShape(1, 1, 1);
			//设置盒子的碰撞形状
			rigidBody.colliderShape = boxShape;
			
			//设置刚体的质量
			rigidBody.mass = 10;
			rigidBody.isKinematic = true;

			//创建盒型MeshSprite3D
			var box2: MeshSprite3D = this.scene.addChild(new MeshSprite3D(PrimitiveMesh.createBox(1, 1, 1))) as MeshSprite3D;
			//设置材质
			var transform2: Transform3D = box2.transform;
			var pos2: Vector3 = transform2.position;
			pos2.setValue(0, 3, 0);
			transform2.position = pos2;
			//创建刚体碰撞器
			var rigidBody2: Rigidbody3D = box2.addComponent(Rigidbody3D);
			//创建盒子形状碰撞器
			var boxShape2: BoxColliderShape = new BoxColliderShape(1, 1, 1);
			//设置盒子的碰撞形状
			rigidBody2.colliderShape = boxShape2;
			//设置刚体的质量
			rigidBody2.mass = 10;

			//漫反射贴图
			Texture2D.load("res/threeDimen/texture/layabox.png", Handler.create(this, function (texture: Texture2D): void {
				var blinnMat:BlinnPhongMaterial = new BlinnPhongMaterial();
				blinnMat.albedoTexture = texture;
				box.meshRenderer.material = blinnMat;
				box2.meshRenderer.material = blinnMat;
			}));

			var fixedConstraint:FixedConstraint = box.addComponent(FixedConstraint);
			fixedConstraint.anchor = new Vector3(0,0,0);
			fixedConstraint.connectAnchor = new Vector3(0,2,0);
			box.addComponent(FixedEventTest);
			fixedConstraint.setConnectRigidBody(rigidBody,rigidBody2);
		
    	}

	
	}
	import laya.d3.component.Script3D;
	import laya.d3.physics.constraints.FixedConstraint;

	class FixedEventTest extends Script3D {
		private var fixedConstraint:FixedConstraint;
		
		public function FixedEventTest() {
		}
		
		override public function onStart():void
		{
			this.fixedConstraint = this.owner.getComponent(FixedConstraint);
			this.fixedConstraint.breakForce = 1000;
		}

		override public function onUpdate():void
		{
			if(this.fixedConstraint)
			{
				var mass = this.fixedConstraint.connectedBody.mass;
				this.fixedConstraint.connectedBody.mass = mass+1;
			}	

		}

		override public function onJointBreak():void
		{
			console.log("break");
		}
	}

}