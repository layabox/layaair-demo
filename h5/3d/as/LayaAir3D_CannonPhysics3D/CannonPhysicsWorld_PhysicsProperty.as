package  {
	//import common.CameraMoveScript;
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
	import laya.d3.physics.constraints.ConfigurableJoint;
	import laya.d3.physics.constraints.FixedConstraint;
	import laya.d3.physics.shape.BoxColliderShape;
	import laya.d3.physics.shape.CapsuleColliderShape;
	import laya.d3.physics.shape.ConeColliderShape;
	import laya.d3.physics.shape.CylinderColliderShape;
	import laya.d3.physics.shape.SphereColliderShape;
	import laya.d3.physicsCannon.CannonPhysicsCollider;
	import laya.d3.physicsCannon.CannonRigidbody3D;
	import laya.d3.physicsCannon.shape.CannonBoxColliderShape;
	import laya.d3.physicsCannon.shape.CannonCompoundColliderShape;
	import laya.d3.physicsCannon.shape.CannonSphereColliderShape;
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

		public function Main() {
			Laya3D.init(0, 0, null, Handler.create(null, () => {
				Config3D.useCannonPhysics = true;
				Laya.stage.scaleMode = Stage.SCALE_FULL;
				Laya.stage.screenMode = Stage.SCREEN_NONE;
				Stat.show();

				this.scene = Laya.stage.addChild(new Scene3D()) as Scene3D;

				//初始化照相机
				var camera: Camera = this.scene.addChild(new Camera(0, 0.1, 100)) as Camera;
				camera.transform.translate(new Vector3(0, 6, 9.5));
				camera.transform.rotate(new Vector3(-15, 0, 0), true, false);
				//camera.addComponent(CameraMoveScript);
				camera.clearColor = null;

				//方向光
				var directionLight: DirectionLight = this.scene.addChild(new DirectionLight()) as DirectionLight;
				directionLight.color = new Vector3(0.6, 0.6, 0.6);
				//设置平行光的方向
				var mat: Matrix4x4 = directionLight.transform.worldMatrix;
				mat.setForward(new Vector3(-1.0, -1.0, -1.0));
				directionLight.transform.worldMatrix = mat;
				var plane: MeshSprite3D = this.scene.addChild(new MeshSprite3D(PrimitiveMesh.createPlane(20, 20, 10, 10))) as MeshSprite3D;
				var planeMat: BlinnPhongMaterial = new BlinnPhongMaterial();
				Texture2D.load("res/threeDimen/Physics/grass.png", Handler.create(this, function (tex: Texture2D): void {
					planeMat.albedoTexture = tex;
				}));
				//设置材质
				plane.meshRenderer.material = planeMat;
				var planeCollider:CannonPhysicsCollider = plane.addComponent(CannonPhysicsCollider);
				var planeShape:CannonBoxColliderShape = new CannonBoxColliderShape(20,0.01,20);
				planeCollider.restitution = 1.0;
				planeCollider.colliderShape = planeShape;
				planeCollider.friction = 0.1;
				//测试弹力
				//实际弹力是两个解除物理组件的弹力乘积
				this.addSphere(-4,5,0,0,0);
				this.addSphere(-2,5,0,0.5,0);
				this.addSphere(0,5,0,0.9,0);
				//测试滚动阻尼
				this.addSphere(2,1,0,0,0.5).linearVelocity=new Vector3(0,0,-5);
				this.addSphere(4,1,0,0,0.8).linearVelocity=(new Vector3(0,0,-5));
				//测试摩擦力区别于阻尼  是两个基础物理物体的摩擦力之和
				this.addBox(6,0.6,0,0.1).linearVelocity = new Vector3(0,0,-10);
				this.addBox(8,0.6,0,0.5).linearVelocity = new Vector3(0,0,-10);
            
        	}));
		}
		
		public function addSphere(x:Number,y:Number,z:Number,restitution:Number,damp:Number){
			var radius:Number = 1;
			var sphere:MeshSprite3D = this.scene.addChild(new MeshSprite3D(PrimitiveMesh.createSphere(1))) as MeshSprite3D;
			var sphereTransform:Transform3D = sphere.transform;
			var pos:Vector3 =sphereTransform.position;
			pos.setValue(x, y,z);
			var scale:Vector3 = sphereTransform.getWorldLossyScale();
			scale.setValue(0.5,0.5,0.5);
			sphereTransform.setWorldLossyScale(scale);

			sphereTransform.position = pos;
				//创建刚体碰撞器
				var rigidBody: CannonRigidbody3D = sphere.addComponent(CannonRigidbody3D);
				//创建盒子形状碰撞器
				var sphereShape: CannonSphereColliderShape = new CannonSphereColliderShape(radius);
				//设置盒子的碰撞形状
				rigidBody.colliderShape = sphereShape;
				//设置刚体的质量
				rigidBody.mass = 10;
				rigidBody.restitution = restitution;
				rigidBody.angularDamping = damp;
				rigidBody.linearDamping = 0.1;
				return rigidBody;
		}
		public function  addBox(x:Number,y:Number,z:Number,friction:Number){
			var sX: Number =1;
			var sY: Number =1;
			var sZ: Number =1;
			var box: MeshSprite3D = this.scene.addChild(new MeshSprite3D(PrimitiveMesh.createBox(sX, sY, sZ))) as MeshSprite3D;
			var transform: Transform3D = box.transform;
			var pos: Vector3 = transform.position;
			pos.setValue(x,y,z);
			transform.position = pos;
			//创建刚体碰撞器
			var rigidBody: CannonRigidbody3D = box.addComponent(CannonRigidbody3D);
			//创建盒子形状碰撞器
			var boxShape: CannonBoxColliderShape = new CannonBoxColliderShape(sX, sY, sZ);
			//设置盒子的碰撞形状
			rigidBody.colliderShape = boxShape;
			//设置刚体的质量
			rigidBody.mass = 10;
			rigidBody.friction = friction;
			return rigidBody;
    	}
		

	}


}