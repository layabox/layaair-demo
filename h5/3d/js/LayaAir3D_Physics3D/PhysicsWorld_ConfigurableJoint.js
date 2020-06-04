class PhysicsWorld_ConfigurableJoint{
    constructor() {
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
		Laya.Stat.show();
        this.scene = Laya.stage.addChild(new Laya.Scene3D());
        this.camera = this.scene.addChild(new Laya.Camera(0, 0.1, 100));
		this.camera.transform.translate(new Laya.Vector3(0, 3, 30));
		this.camera.addComponent(CameraMoveScript)
        var directionLight = this.scene.addChild(new Laya.DirectionLight());
        directionLight.color = new Laya.Vector3(1, 1, 1);
		directionLight.transform.worldMatrix.setForward(new Laya.Vector3(-1.0, -1.0, 1.0));
		//平面
		var plane = this.scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createPlane(40, 40, 40, 40)));
		plane.transform.position = new Laya.Vector3(0, -2.0, 0);
		var planeMat = new Laya.BlinnPhongMaterial();
		Laya.Texture2D.load("res/threeDimen/Physics/grass.png", Laya.Handler.create(this, function (tex) {
			planeMat.albedoTexture = tex;
		}));
		//设置纹理平铺和偏移
		var tilingOffset = planeMat.tilingOffset;
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

	springTest() {
		var boxA = this.addRigidBodySphere(new Laya.Vector3(7, 3, 0),1);
		var boxARigid = boxA.getComponent(Laya.Rigidbody3D);
		boxARigid.overrideGravity = true;
		boxARigid.isKinematic = true;

		var boxB = this.addRigidBodyBox(new Laya.Vector3(10, 0, 0),1);
		boxB.meshRenderer.material.albedoColor = new Laya.Vector4(1, 0, 0, 1);
		var boxBRigid = boxB.getComponent(Laya.Rigidbody3D);
		var configurableJoint = boxA.addComponent(Laya.ConfigurableJoint); 
		configurableJoint.setConnectRigidBody(boxARigid,boxBRigid);
	    configurableJoint.anchor = new Laya.Vector3(0, -3, 0);
		configurableJoint.connectAnchor = new Laya.Vector3(0,0,0);

		configurableJoint.minLinearLimit = new Laya.Vector3(-3,0,0);
		configurableJoint.maxLinearLimit = new Laya.Vector3(3,0,0);
		configurableJoint.XMotion = Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LIMITED;
		configurableJoint.YMotion = Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
		configurableJoint.ZMotion = Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
		configurableJoint.angularXMotion= Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
		configurableJoint.angularYMotion= Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
		configurableJoint.angularZMotion= Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
		configurableJoint.linearLimitSpring = new Laya.Vector3(100,0,0);
		configurableJoint.linearDamp = new Laya.Vector3(0,0,0);
	}



	bounceTest() {
		var boxA = this.addRigidBodySphere(new Laya.Vector3(7, 3, 3),1);
		var boxARigid = boxA.getComponent(Laya.Rigidbody3D);

		var boxB = this.addRigidBodyBox(new Laya.Vector3(7, 0, 3),1);
		boxB.meshRenderer.material.albedoColor = new Laya.Vector4(1, 0, 0, 1);
		var boxBRigid = boxB.getComponent(Laya.Rigidbody3D);
		
		var configurableJoint = boxA.addComponent(Laya.ConfigurableJoint); 
		configurableJoint.setConnectRigidBody(boxARigid,boxBRigid);
	    configurableJoint.anchor = new Laya.Vector3(0, -3, 0);
		configurableJoint.connectAnchor = new Laya.Vector3(0,0,0);
		
		configurableJoint.minLinearLimit = new Laya.Vector3(-2,0,0);
		configurableJoint.maxLinearLimit = new Laya.Vector3(2,0,0);
		configurableJoint.XMotion = Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LIMITED;
		configurableJoint.YMotion = Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
		configurableJoint.ZMotion = Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
		configurableJoint.angularXMotion= Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
		configurableJoint.angularYMotion= Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
		configurableJoint.angularZMotion= Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;

		configurableJoint.linearBounce = new Laya.Vector3(0.8, 0, 0);
		boxBRigid.applyImpulse(new Laya.Vector3(50, 0, 0));

	}

	bounceTestY() {
		var boxA = this.addRigidBodySphere(new Laya.Vector3(0, 4, 0),1);
		var boxARigid = boxA.getComponent(Laya.Rigidbody3D);

		var boxB = this.addRigidBodyBox(new Laya.Vector3(0, 2, 0),1);
		boxB.meshRenderer.material.albedoColor = new Laya.Vector4(1, 0, 0, 1);
		var boxBRigid = boxB.getComponent(Laya.Rigidbody3D);
		
		var configurableJoint = boxA.addComponent(Laya.ConfigurableJoint); 
		configurableJoint.setConnectRigidBody(boxARigid,boxBRigid);
	    configurableJoint.anchor = new Laya.Vector3(0, -2, 0);
		configurableJoint.connectAnchor = new Laya.Vector3(0,0,0);
		
		configurableJoint.minLinearLimit = new Laya.Vector3(0,-2,0);
		configurableJoint.maxLinearLimit = new Laya.Vector3(0,10,0);
		configurableJoint.XMotion = Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
		configurableJoint.YMotion = Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LIMITED;
		configurableJoint.ZMotion = Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
		configurableJoint.angularXMotion= Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
		configurableJoint.angularYMotion= Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
		configurableJoint.angularZMotion= Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
	}

	rotateAngularX(){
		var boxA = this.addRigidBodySphere(new Laya.Vector3(-2, 3, 0),1);
		var boxARigid = boxA.getComponent(Laya.Rigidbody3D);

		var boxB = this.addRigidBodyBox(new Laya.Vector3(-2, 1, 0),1);
		boxB.meshRenderer.material.albedoColor = new Laya.Vector4(1, 0, 0, 1);
		var boxBRigid = boxB.getComponent(Laya.Rigidbody3D);
		
		var configurableJoint = boxA.addComponent(Laya.ConfigurableJoint); 
		configurableJoint.setConnectRigidBody(boxARigid,boxBRigid);
	    configurableJoint.anchor = new Laya.Vector3(0, -2, 0);
		configurableJoint.connectAnchor = new Laya.Vector3(0,0,0);

		configurableJoint.minAngularLimit = new Laya.Vector3(-2, 0,0);
		configurableJoint.maxAngularLimit = new Laya.Vector3(2, 0,0);
		configurableJoint.XMotion = Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
		configurableJoint.YMotion = Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
		configurableJoint.ZMotion = Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
		configurableJoint.angularXMotion= Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_FREE;
		configurableJoint.angularYMotion= Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
		configurableJoint.angularZMotion= Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
		boxBRigid.angularVelocity = new Laya.Vector3(5, 0, 0);

	}

	rotateAngularZ(){
		var boxA = this.addRigidBodySphere(new Laya.Vector3(-7, 6, 0),1);
		var boxARigid = boxA.getComponent(Laya.Rigidbody3D);

		var boxB = this.addRigidBodyBox(new Laya.Vector3(-7, 4, 0),1);
		boxB.meshRenderer.material.albedoColor = new Laya.Vector4(1, 0, 0, 1);
		var boxBRigid = boxB.getComponent(Laya.Rigidbody3D);
		
		var configurableJoint = boxA.addComponent(Laya.ConfigurableJoint); 
		configurableJoint.setConnectRigidBody(boxARigid,boxBRigid);
	    configurableJoint.anchor = new Laya.Vector3(0, -2, 0);
		configurableJoint.connectAnchor = new Laya.Vector3(0,0,0);

		configurableJoint.minAngularLimit = new Laya.Vector3(0, 0, -1);
		configurableJoint.maxAngularLimit = new Laya.Vector3(0, 0, 1);
		configurableJoint.XMotion = Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
		configurableJoint.YMotion = Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
		configurableJoint.ZMotion = Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
		configurableJoint.angularXMotion= Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
		configurableJoint.angularYMotion= Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
		configurableJoint.angularZMotion= Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LIMITED;
		boxBRigid.angularVelocity = new Laya.Vector3(0.0, 0, 0.5);

	}

	rotateAngularY(){
		var boxA = this.addRigidBodySphere(new Laya.Vector3(-5, 6, 0),1);
		var boxARigid = boxA.getComponent(Laya.Rigidbody3D);

		var boxB = this.addRigidBodyBox(new Laya.Vector3(-5, 4, 0),1);
	    boxB.meshRenderer.material.albedoColor = new Laya.Vector4(1, 0, 0, 1);
		var boxBRigid = boxB.getComponent(Laya.Rigidbody3D);
		
		var configurableJoint = boxA.addComponent(Laya.ConfigurableJoint); 
		configurableJoint.setConnectRigidBody(boxARigid,boxBRigid);
	    configurableJoint.anchor = new Laya.Vector3(0, -2, 0);
		configurableJoint.connectAnchor = new Laya.Vector3(0,0,0);

		configurableJoint.minAngularLimit = new Laya.Vector3(0, -1, 0);
		configurableJoint.maxAngularLimit = new Laya.Vector3(0, 1, 0);
		configurableJoint.XMotion = Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
		configurableJoint.YMotion = Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
		configurableJoint.ZMotion = Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
		configurableJoint.angularXMotion= Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
		configurableJoint.angularYMotion= Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LIMITED;
		configurableJoint.angularZMotion= Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
		boxBRigid.angularVelocity = new Laya.Vector3(0.0, 0.5, 0);

	}

	freeRotate(){
		var boxA = this.addRigidBodySphere(new Laya.Vector3(-6, 3, 0),1);
		var boxARigid = boxA.getComponent(Laya.Rigidbody3D);

		var boxB = this.addRigidBodyBox(new Laya.Vector3(-6, 1, 0),1);
		boxB.meshRenderer.material.albedoColor = new Laya.Vector4(1, 0, 0, 1);
		var boxBRigid = boxB.getComponent(Laya.Rigidbody3D);
		
		var configurableJoint = boxA.addComponent(Laya.ConfigurableJoint); 
		configurableJoint.setConnectRigidBody(boxARigid,boxBRigid);
	    configurableJoint.anchor = new Laya.Vector3(0, -1, 0);
		configurableJoint.connectAnchor = new Laya.Vector3(0,1,0);

		configurableJoint.XMotion = Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
		configurableJoint.YMotion = Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
		configurableJoint.ZMotion = Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
		configurableJoint.angularXMotion= Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_FREE;
		configurableJoint.angularYMotion= Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_FREE;
		configurableJoint.angularZMotion= Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_FREE;
		boxBRigid.angularVelocity = new Laya.Vector3(20, 2, 10);
	}

	rotateAngularPoint(){
		var boxA = this.addRigidBodySphere(new Laya.Vector3(0, 15, 0),1);
		var boxARigid = boxA.getComponent(Laya.Rigidbody3D);

		var boxB = this.addRigidBodyBox(new Laya.Vector3(6, 15, 0),1);
		boxB.meshRenderer.material.albedoColor = new Laya.Vector4(1, 0, 0, 1);
		var boxBRigid = boxB.getComponent(Laya.Rigidbody3D);
	
		var configurableJoint = boxA.addComponent(Laya.ConfigurableJoint); 
		configurableJoint.setConnectRigidBody(boxARigid,boxBRigid);
	    configurableJoint.anchor = new Laya.Vector3(0, 0, 0);
		configurableJoint.connectAnchor = new Laya.Vector3(-6,0,0);

		configurableJoint.XMotion = Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
		configurableJoint.YMotion = Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
		configurableJoint.ZMotion = Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
		configurableJoint.angularXMotion= Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
		configurableJoint.angularYMotion= Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
		configurableJoint.angularZMotion= Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_FREE;
	
	}

	alongXAixs(){
		var boxA = this.addRigidBodySphere(new Laya.Vector3(0, 0, -4),1);
		var boxARigid = boxA.getComponent(Laya.Rigidbody3D);

		var boxB = this.addRigidBodyBox(new Laya.Vector3(5, 0, -4),1);
		boxB.meshRenderer.material.albedoColor = new Laya.Vector4(1, 0, 0, 1);
		var boxBRigid = boxB.getComponent(Laya.Rigidbody3D);
		var configurableJoint = boxA.addComponent(Laya.ConfigurableJoint); 
		configurableJoint.setConnectRigidBody(boxARigid,boxBRigid);
	    configurableJoint.anchor = new Laya.Vector3(0,0,0);
		configurableJoint.connectAnchor = new Laya.Vector3(-5,0,0);
		
		configurableJoint.minLinearLimit = new Laya.Vector3(-2,0,0);
		configurableJoint.maxLinearLimit = new Laya.Vector3(2,0,0);
		configurableJoint.XMotion = Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LIMITED;
		configurableJoint.YMotion = Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
		configurableJoint.ZMotion = Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
		configurableJoint.angularXMotion= Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
		configurableJoint.angularYMotion= Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
		configurableJoint.angularZMotion= Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;

		boxBRigid.linearVelocity = new Laya.Vector3(1.0, 0.0, 0);

	}

	alongYAixs(){
		var boxA = this.addRigidBodySphere(new Laya.Vector3(0, 0, 0),1);
		var boxARigid = boxA.getComponent(Laya.Rigidbody3D);


		var boxB = this.addRigidBodyBox(new Laya.Vector3(5, 0, 0),1);
		boxB.meshRenderer.material.albedoColor = new Laya.Vector4(1, 0, 0, 1);
		var boxBRigid = boxB.getComponent(Laya.Rigidbody3D);
		var configurableJoint = boxA.addComponent(Laya.ConfigurableJoint); 
		configurableJoint.setConnectRigidBody(boxARigid,boxBRigid);
	    configurableJoint.anchor = new Laya.Vector3(0,0,0);
		configurableJoint.connectAnchor = new Laya.Vector3(-5,0,0);
		
		configurableJoint.minLinearLimit = new Laya.Vector3(0,-3,0);
		configurableJoint.maxLinearLimit = new Laya.Vector3(0,3,0);
		configurableJoint.XMotion = Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
		configurableJoint.YMotion = Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LIMITED;
		configurableJoint.ZMotion = Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
		configurableJoint.angularXMotion= Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
		configurableJoint.angularYMotion= Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
		configurableJoint.angularZMotion= Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;

		boxBRigid.linearVelocity = new Laya.Vector3(0.0, 1.0, 0);

	}

	alongZAixs(){
		var boxA = this.addRigidBodySphere(new Laya.Vector3(2, 3, 0),1);
		var boxARigid = boxA.getComponent(Laya.Rigidbody3D);

		var boxB= this.addRigidBodyBox(new Laya.Vector3(2, 0, 0),1);
		boxB.meshRenderer.material.albedoColor = new Laya.Vector4(1, 0, 0, 1);
		var boxBRigid = boxB.getComponent(Laya.Rigidbody3D);

		var configurableJoint = boxA.addComponent(Laya.ConfigurableJoint); 
		configurableJoint.setConnectRigidBody(boxARigid,boxBRigid);
	    configurableJoint.anchor = new Laya.Vector3(0,0,0);
		configurableJoint.connectAnchor = new Laya.Vector3(0,3,0);
		
		configurableJoint.minLinearLimit = new Laya.Vector3(0,0,-4);
		configurableJoint.maxLinearLimit = new Laya.Vector3(0,0,4);
		configurableJoint.XMotion = Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
		configurableJoint.YMotion = Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
		configurableJoint.ZMotion = Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LIMITED;
		configurableJoint.angularXMotion= Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
		configurableJoint.angularYMotion= Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;
		configurableJoint.angularZMotion= Laya.ConfigurableJoint.CONFIG_MOTION_TYPE_LOCKED;

		boxBRigid.linearVelocity = new Laya.Vector3(0.0, 0.0, 4);

	}

	addRigidBodyBox(pos, scale){
        //创建盒型MeshSprite3D
		var box = this.scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(scale, scale, scale)));
		box.transform.position = pos;
		//box.addComponent(TriggerCollisionScript);

		var mat = new Laya.BlinnPhongMaterial();
		box.meshRenderer.material = mat;

		//创建刚体碰撞器
		var rigidBody = box.addComponent(Laya.Rigidbody3D);
		//创建盒子形状碰撞器
		var boxShape = new Laya.BoxColliderShape(scale, scale, scale);
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
	addRigidBodySphere(pos, scale) {
        //创建盒型MeshSprite3D
		var sphere = this.scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createSphere(0.2)));
		sphere.transform.position = pos;

		var mat = new Laya.BlinnPhongMaterial();
		mat.albedoColor = new Laya.Vector4(0, 1, 0, 1);
		sphere.meshRenderer.material = mat;

		//创建刚体碰撞器
		var rigidBody = sphere.addComponent(Laya.Rigidbody3D);
		//创建盒子形状碰撞器
		var boxShape = new Laya.SphereColliderShape(0.2);
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

new PhysicsWorld_ConfigurableJoint();


