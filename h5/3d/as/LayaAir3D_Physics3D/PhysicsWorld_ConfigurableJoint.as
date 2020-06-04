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
	import laya.d3.physics.constraints.ConfigurableJoint;
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
			Config3D.useCannonPhysics = false;
			this.scene = Laya.stage.addChild(new Scene3D()) as Scene3D;
			this.camera = this.scene.addChild(new Camera(0, 0.1, 100)) as Camera;
			this.camera.transform.translate(new Vector3(0, 3, 30));
			//this.camera.addComponent(CameraMoveScript)
			var directionLight: DirectionLight = this.scene.addChild(new DirectionLight()) as DirectionLight;
			directionLight.color = new Vector3(1, 1, 1);
			directionLight.transform.worldMatrix.setForward(new Vector3(-1.0, -1.0, 1.0));
			//平面
			var plane: MeshSprite3D = this.scene.addChild(new MeshSprite3D(PrimitiveMesh.createPlane(40, 40, 40, 40))) as MeshSprite3D;
			plane.transform.position = new Vector3(0, -2.0, 0);
			var planeMat: BlinnPhongMaterial = new BlinnPhongMaterial();
			Texture2D.load("res/threeDimen/Physics/grass.png", Handler.create(this, function (tex: Texture2D): void {
				planeMat.albedoTexture = tex;
			}));
			//设置纹理平铺和偏移
			var tilingOffset: Vector4 = planeMat.tilingOffset;
			tilingOffset.setValue(5, 5, 0, 0);
			planeMat.tilingOffset = tilingOffset;
			//设置材质
			plane.meshRenderer.material = planeMat;

			this.springTest();
			this.bounceTest();
			// this.bounceTestY();

			this.alongZAixs();
			//this.alongXAixs();
			//this.alongYAixs();

			this.freeRotate();
			this.rotateAngularX();
			// this.rotateAngularZ();
			// this.rotateAngularY();
			this.rotateAngularPoint();
		}
		
		

		public function springTest(): void {
			var boxA:MeshSprite3D = this.addRigidBodySphere(new Vector3(7, 3, 0),1);
			var boxARigid:Rigidbody3D = boxA.getComponent(Rigidbody3D);
			boxARigid.overrideGravity = true;
			boxARigid.isKinematic = true;

			var boxB:MeshSprite3D = this.addRigidBodyBox(new Vector3(10, 0, 0),1);
			boxB.meshRenderer.material.albedoColor = new Vector4(1, 0, 0, 1);
			var boxBRigid:Rigidbody3D = boxB.getComponent(Rigidbody3D);
			var configurableJoint:ConfigurableJoint = boxA.addComponent(ConfigurableJoint); 
			configurableJoint.setConnectRigidBody(boxARigid,boxBRigid);
			configurableJoint.anchor = new Vector3(0, -3, 0);
			configurableJoint.connectAnchor = new Vector3(0,0,0);

			configurableJoint.minLinearLimit = new Vector3(-3,0,0);
			configurableJoint.maxLinearLimit = new Vector3(3,0,0);
			configurableJoint.XMotion = ConfigurableJoint.CONFIG_MOTION_TYPE_LIMITED;
			configurableJoint.YMotion = ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
			configurableJoint.ZMotion = ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
			configurableJoint.angularXMotion= ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
			configurableJoint.angularYMotion= ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
			configurableJoint.angularZMotion= ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
			configurableJoint.linearLimitSpring = new Vector3(100,0,0);
			configurableJoint.linearDamp = new Vector3(0,0,0);
		}



		public function bounceTest(): void {
			var boxA:MeshSprite3D = this.addRigidBodySphere(new Vector3(7, 3, 3),1);
			var boxARigid:Rigidbody3D = boxA.getComponent(Rigidbody3D);

			var boxB:MeshSprite3D = this.addRigidBodyBox(new Vector3(7, 0, 3),1);
			boxB.meshRenderer.material.albedoColor = new Vector4(1, 0, 0, 1);
			var boxBRigid:Rigidbody3D = boxB.getComponent(Rigidbody3D);
			
			var configurableJoint:ConfigurableJoint = boxA.addComponent(ConfigurableJoint); 
			configurableJoint.setConnectRigidBody(boxARigid,boxBRigid);
			configurableJoint.anchor = new Vector3(0, -3, 0);
			configurableJoint.connectAnchor = new Vector3(0,0,0);
			
			configurableJoint.minLinearLimit = new Vector3(-2,0,0);
			configurableJoint.maxLinearLimit = new Vector3(2,0,0);
			configurableJoint.XMotion = ConfigurableJoint.CONFIG_MOTION_TYPE_LIMITED;
			configurableJoint.YMotion = ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
			configurableJoint.ZMotion = ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
			configurableJoint.angularXMotion= ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
			configurableJoint.angularYMotion= ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
			configurableJoint.angularZMotion= ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;

			configurableJoint.linearBounce = new Vector3(0.5, 0, 0);
			boxBRigid.applyImpulse(new Vector3(100, 0, 0));

		}

		public function bounceTestY(): void {
			var boxA:MeshSprite3D = this.addRigidBodySphere(new Vector3(0, 4, 0),1);
			var boxARigid:Rigidbody3D = boxA.getComponent(Rigidbody3D);

			var boxB:MeshSprite3D = this.addRigidBodyBox(new Vector3(0, 2, 0),1);
			boxB.meshRenderer.material.albedoColor = new Vector4(1, 0, 0, 1);
			var boxBRigid:Rigidbody3D = boxB.getComponent(Rigidbody3D);
			
			var configurableJoint:ConfigurableJoint = boxA.addComponent(ConfigurableJoint); 
			configurableJoint.setConnectRigidBody(boxARigid,boxBRigid);
			configurableJoint.anchor = new Vector3(0, -2, 0);
			configurableJoint.connectAnchor = new Vector3(0,0,0);
			
			configurableJoint.minLinearLimit = new Vector3(0,-2,0);
			configurableJoint.maxLinearLimit = new Vector3(0,10,0);
			configurableJoint.XMotion = ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
			configurableJoint.YMotion = ConfigurableJoint.CONFIG_MOTION_TYPE_LIMITED;
			configurableJoint.ZMotion = ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
			configurableJoint.angularXMotion= ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
			configurableJoint.angularYMotion= ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
			configurableJoint.angularZMotion= ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
		}

		public function rotateAngularX():void{
			var boxA:MeshSprite3D = this.addRigidBodySphere(new Vector3(-2, 3, 0),1);
			var boxARigid:Rigidbody3D = boxA.getComponent(Rigidbody3D);

			var boxB:MeshSprite3D = this.addRigidBodyBox(new Vector3(-2, 1, 0),1);
			boxB.meshRenderer.material.albedoColor = new Vector4(1, 0, 0, 1);
			var boxBRigid:Rigidbody3D = boxB.getComponent(Rigidbody3D);
			
			var configurableJoint:ConfigurableJoint = boxA.addComponent(ConfigurableJoint); 
			configurableJoint.setConnectRigidBody(boxARigid,boxBRigid);
			configurableJoint.anchor = new Vector3(0, -2, 0);
			configurableJoint.connectAnchor = new Vector3(0,0,0);

			configurableJoint.minAngularLimit = new Vector3(-2, 0,0);
			configurableJoint.maxAngularLimit = new Vector3(2, 0,0);
			configurableJoint.XMotion = ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
			configurableJoint.YMotion = ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
			configurableJoint.ZMotion = ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
			configurableJoint.angularXMotion= ConfigurableJoint.CONFIG_MOTION_TYPE_FREE;
			configurableJoint.angularYMotion= ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
			configurableJoint.angularZMotion= ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
			boxBRigid.angularVelocity = new Vector3(5, 0, 0);

		}

		public function  rotateAngularZ():void{
			var boxA:MeshSprite3D = this.addRigidBodySphere(new Vector3(-7, 6, 0),1);
			var boxARigid:Rigidbody3D = boxA.getComponent(Rigidbody3D);

			var boxB:MeshSprite3D = this.addRigidBodyBox(new Vector3(-7, 4, 0),1);
			boxB.meshRenderer.material.albedoColor = new Vector4(1, 0, 0, 1);
			var boxBRigid:Rigidbody3D = boxB.getComponent(Rigidbody3D);
			
			var configurableJoint:ConfigurableJoint = boxA.addComponent(ConfigurableJoint); 
			configurableJoint.setConnectRigidBody(boxARigid,boxBRigid);
			configurableJoint.anchor = new Vector3(0, -2, 0);
			configurableJoint.connectAnchor = new Vector3(0,0,0);

			configurableJoint.minAngularLimit = new Vector3(0, 0, -1);
			configurableJoint.maxAngularLimit = new Vector3(0, 0, 1);
			configurableJoint.XMotion = ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
			configurableJoint.YMotion = ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
			configurableJoint.ZMotion = ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
			configurableJoint.angularXMotion= ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
			configurableJoint.angularYMotion= ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
			configurableJoint.angularZMotion= ConfigurableJoint.CONFIG_MOTION_TYPE_LIMITED;
			boxBRigid.angularVelocity = new Vector3(0.0, 0, 0.5);

		}

		public function  rotateAngularY():void{
			var boxA:MeshSprite3D = this.addRigidBodySphere(new Vector3(-5, 6, 0),1);
			var boxARigid:Rigidbody3D = boxA.getComponent(Rigidbody3D);

			var boxB:MeshSprite3D = this.addRigidBodyBox(new Vector3(-5, 4, 0),1);
			boxB.meshRenderer.material.albedoColor = new Vector4(1, 0, 0, 1);
			var boxBRigid:Rigidbody3D = boxB.getComponent(Rigidbody3D);
			
			var configurableJoint:ConfigurableJoint = boxA.addComponent(ConfigurableJoint); 
			configurableJoint.setConnectRigidBody(boxARigid,boxBRigid);
			configurableJoint.anchor = new Vector3(0, -2, 0);
			configurableJoint.connectAnchor = new Vector3(0,0,0);

			configurableJoint.minAngularLimit = new Vector3(0, -1, 0);
			configurableJoint.maxAngularLimit = new Vector3(0, 1, 0);
			configurableJoint.XMotion = ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
			configurableJoint.YMotion = ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
			configurableJoint.ZMotion = ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
			configurableJoint.angularXMotion= ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
			configurableJoint.angularYMotion= ConfigurableJoint.CONFIG_MOTION_TYPE_LIMITED;
			configurableJoint.angularZMotion= ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
			boxBRigid.angularVelocity = new Vector3(0.0, 0.5, 0);

		}

		public function  freeRotate(){
			var boxA:MeshSprite3D = this.addRigidBodySphere(new Vector3(-6, 3, 0),1);
			var boxARigid:Rigidbody3D = boxA.getComponent(Rigidbody3D);

			var boxB:MeshSprite3D = this.addRigidBodyBox(new Vector3(-6, 1, 0),1);
			boxB.meshRenderer.material.albedoColor = new Vector4(1, 0, 0, 1);
			var boxBRigid:Rigidbody3D = boxB.getComponent(Rigidbody3D);
			
			var configurableJoint:ConfigurableJoint = boxA.addComponent(ConfigurableJoint); 
			configurableJoint.setConnectRigidBody(boxARigid,boxBRigid);
			configurableJoint.anchor = new Vector3(0, -1, 0);
			configurableJoint.connectAnchor = new Vector3(0,1,0);

			configurableJoint.XMotion = ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
			configurableJoint.YMotion = ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
			configurableJoint.ZMotion = ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
			configurableJoint.angularXMotion= ConfigurableJoint.CONFIG_MOTION_TYPE_FREE;
			configurableJoint.angularYMotion= ConfigurableJoint.CONFIG_MOTION_TYPE_FREE;
			configurableJoint.angularZMotion= ConfigurableJoint.CONFIG_MOTION_TYPE_FREE;
			boxBRigid.angularVelocity = new Vector3(20, 2, 10);
		}

		public function  rotateAngularPoint():void{
			var boxA:MeshSprite3D = this.addRigidBodySphere(new Vector3(0, 15, 0),1);
			var boxARigid:Rigidbody3D = boxA.getComponent(Rigidbody3D);

			var boxB:MeshSprite3D = this.addRigidBodyBox(new Vector3(6, 15, 0),1);
			boxB.meshRenderer.material.albedoColor = new Vector4(1, 0, 0, 1);
			var boxBRigid:Rigidbody3D = boxB.getComponent(Rigidbody3D);
		
			var configurableJoint:ConfigurableJoint = boxA.addComponent(ConfigurableJoint); 
			configurableJoint.setConnectRigidBody(boxARigid,boxBRigid);
			configurableJoint.anchor = new Vector3(0, 0, 0);
			configurableJoint.connectAnchor = new Vector3(-6,0,0);

			configurableJoint.XMotion = ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
			configurableJoint.YMotion = ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
			configurableJoint.ZMotion = ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
			configurableJoint.angularXMotion= ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
			configurableJoint.angularYMotion= ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
			configurableJoint.angularZMotion= ConfigurableJoint.CONFIG_MOTION_TYPE_FREE;
		
		}

		public function alongXAixs():void{
			var boxA:MeshSprite3D = this.addRigidBodySphere(new Vector3(0, 0, -4),1);
			var boxARigid:Rigidbody3D = boxA.getComponent(Rigidbody3D);

			var boxB:MeshSprite3D = this.addRigidBodyBox(new Vector3(5, 0, -4),1);
			boxB.meshRenderer.material.albedoColor = new Vector4(1, 0, 0, 1);
			var boxBRigid:Rigidbody3D = boxB.getComponent(Rigidbody3D);
			var configurableJoint:ConfigurableJoint = boxA.addComponent(ConfigurableJoint); 
			configurableJoint.setConnectRigidBody(boxARigid,boxBRigid);
			configurableJoint.anchor = new Vector3(0,0,0);
			configurableJoint.connectAnchor = new Vector3(-5,0,0);
			
			configurableJoint.minLinearLimit = new Vector3(-2,0,0);
			configurableJoint.maxLinearLimit = new Vector3(2,0,0);
			configurableJoint.XMotion = ConfigurableJoint.CONFIG_MOTION_TYPE_LIMITED;
			configurableJoint.YMotion = ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
			configurableJoint.ZMotion = ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
			configurableJoint.angularXMotion= ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
			configurableJoint.angularYMotion= ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
			configurableJoint.angularZMotion= ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;

			boxBRigid.linearVelocity = new Vector3(1.0, 0.0, 0);

		}

		public function  alongYAixs():void{
			var boxA:MeshSprite3D = this.addRigidBodySphere(new Vector3(0, 0, 0),1);
			var boxARigid:Rigidbody3D = boxA.getComponent(Rigidbody3D);


			var boxB:MeshSprite3D = this.addRigidBodyBox(new Vector3(5, 0, 0),1);
			boxB.meshRenderer.material.albedoColor = new Vector4(1, 0, 0, 1);
			var boxBRigid:Rigidbody3D = boxB.getComponent(Rigidbody3D);
			var configurableJoint:ConfigurableJoint = boxA.addComponent(ConfigurableJoint); 
			configurableJoint.setConnectRigidBody(boxARigid,boxBRigid);
			configurableJoint.anchor = new Vector3(0,0,0);
			configurableJoint.connectAnchor = new Vector3(-5,0,0);
			
			configurableJoint.minLinearLimit = new Vector3(0,-3,0);
			configurableJoint.maxLinearLimit = new Vector3(0,3,0);
			configurableJoint.XMotion = ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
			configurableJoint.YMotion = ConfigurableJoint.CONFIG_MOTION_TYPE_LIMITED;
			configurableJoint.ZMotion = ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
			configurableJoint.angularXMotion= ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
			configurableJoint.angularYMotion= ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
			configurableJoint.angularZMotion= ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;

			boxBRigid.linearVelocity = new Vector3(0.0, 1.0, 0);

		}

		public function alongZAixs():void{
			var boxA:MeshSprite3D = this.addRigidBodySphere(new Vector3(2, 3, 0),1);
			var boxARigid:Rigidbody3D = boxA.getComponent(Rigidbody3D);

			var boxB:MeshSprite3D = this.addRigidBodyBox(new Vector3(2, 0, 0),1);
			boxB.meshRenderer.material.albedoColor = new Vector4(1, 0, 0, 1);
			var boxBRigid:Rigidbody3D = boxB.getComponent(Rigidbody3D);

			var configurableJoint:ConfigurableJoint = boxA.addComponent(ConfigurableJoint); 
			configurableJoint.setConnectRigidBody(boxARigid,boxBRigid);
			configurableJoint.anchor = new Vector3(0,0,0);
			configurableJoint.connectAnchor = new Vector3(0,3,0);
			
			configurableJoint.minLinearLimit = new Vector3(0,0,-4);
			configurableJoint.maxLinearLimit = new Vector3(0,0,4);
			configurableJoint.XMotion = ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
			configurableJoint.YMotion = ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
			configurableJoint.ZMotion = ConfigurableJoint.CONFIG_MOTION_TYPE_LIMITED;
			configurableJoint.angularXMotion= ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
			configurableJoint.angularYMotion= ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
			configurableJoint.angularZMotion= ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;

			boxBRigid.linearVelocity = new Vector3(0.0, 0.0, 4);

		}

		public function addRigidBodyBox(pos:Vector3, scale:number):MeshSprite3D{
			//创建盒型MeshSprite3D
			var box: MeshSprite3D = this.scene.addChild(new MeshSprite3D(PrimitiveMesh.createBox(scale, scale, scale))) as MeshSprite3D;
			box.transform.position = pos;
			//box.addComponent(TriggerCollisionScript);

			var mat:BlinnPhongMaterial = new BlinnPhongMaterial();
			box.meshRenderer.material = mat;

			//创建刚体碰撞器
			var rigidBody: Rigidbody3D = box.addComponent(Rigidbody3D);
			//创建盒子形状碰撞器
			var boxShape: BoxColliderShape = new BoxColliderShape(scale, scale, scale);
			//设置盒子的碰撞形状
			rigidBody.colliderShape = boxShape;
			//设置刚体的质量
			rigidBody.mass = 1;
			//物理碰撞体设置摩擦力
			rigidBody.friction = 0.5;
			//物理碰撞体设置弹力
			rigidBody.restitution = 10.0;
			return box;	
		}   
		public function addRigidBodySphere(pos:Vector3, scale:number):MeshSprite3D{
			//创建盒型MeshSprite3D
			var sphere: MeshSprite3D =this.scene.addChild(new MeshSprite3D(PrimitiveMesh.createSphere(0.2))) as MeshSprite3D;
			sphere.transform.position = pos;

			var mat:BlinnPhongMaterial = new BlinnPhongMaterial();
			mat.albedoColor = new Vector4(0, 1, 0, 1);
			sphere.meshRenderer.material = mat;

			//创建刚体碰撞器
			var rigidBody: Rigidbody3D = sphere.addComponent(Rigidbody3D);
			//创建盒子形状碰撞器
			var boxShape: SphereColliderShape = new SphereColliderShape(0.2);
			//设置盒子的碰撞形状
			rigidBody.colliderShape = boxShape;
			//设置刚体的质量
			rigidBody.mass = 1;
			//物理碰撞体设置摩擦力
			rigidBody.friction = 0.5;
			//物理碰撞体设置弹力
			rigidBody.restitution = 0.0;
			rigidBody.isKinematic = true;
			return sphere;	
		}  

	
	}


}