

class PhysicsWorld_ConstraintFixedJoint{
    constructor() {
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        this.scene = Laya.stage.addChild(new Laya.Scene3D());
        this.camera = this.scene.addChild(new Laya.Camera(0, 0.1, 100));
        this.camera.transform.translate(new Laya.Vector3(0, 3, 10));
        this.camera.clearColor = null;
        var directionLight = this.scene.addChild(new Laya.DirectionLight());
        directionLight.color = new Laya.Vector3(1, 1, 1);
		//directionLight.transform.worldMatrix.setForward(new Vector3(1.0, -0.5, 0.5));
		//设置平行光的方向
		var mat = directionLight.transform.worldMatrix;
		mat.setForward(new Laya.Vector3(-1.0, -1.0, -1.0));
		directionLight.transform.worldMatrix = mat;
        this.addbox();
    }

    addbox(){
		
        //创建盒型MeshSprite3D
		var box = this.scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1, 1, 1)));
		//设置材质
		var transform = box.transform;
		var pos = transform.position;
		pos.setValue(0, 5, 0);
		transform.position = pos;

		//创建刚体碰撞器
		var rigidBody = box.addComponent(Laya.Rigidbody3D);
		//创建盒子形状碰撞器
		var boxShape = new Laya.BoxColliderShape(1, 1, 1);
		//设置盒子的碰撞形状
		rigidBody.colliderShape = boxShape;
		
		//设置刚体的质量
		rigidBody.mass = 10;
		rigidBody.isKinematic = true;

		//创建盒型MeshSprite3D
		var box2 = this.scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1, 1, 1)));
		//设置材质
		var transform2 = box2.transform;
		var pos2 = transform2.position;
		pos2.setValue(0, 3, 0);
		transform2.position = pos2;
		//创建刚体碰撞器
		var rigidBody2 = box2.addComponent(Laya.Rigidbody3D);
		//创建盒子形状碰撞器
		var boxShape2 = new Laya.BoxColliderShape(1, 1, 1);
		//设置盒子的碰撞形状
		rigidBody2.colliderShape = boxShape2;
		//设置刚体的质量
		rigidBody2.mass = 10;

		//漫反射贴图
		Laya.Texture2D.load("res/threeDimen/texture/layabox.png", Laya.Handler.create(this, function (texture) {
			var blinnMat = new Laya.BlinnPhongMaterial();
			blinnMat.albedoTexture = texture;
			box.meshRenderer.material = blinnMat;
			box2.meshRenderer.material = blinnMat;
		}));

        //创建FixedConstraint约束
        var fixedConstraint = box.addComponent(Laya.FixedConstraint);
        //设置约束锚点
        fixedConstraint.anchor = new Laya.Vector3(0,0,0);
        //设置约束连接锚点
		fixedConstraint.connectAnchor = new Laya.Vector3(0,2,0);
        box.addComponent(FixedEventTest);
        //为约束设置两个刚体
		fixedConstraint.setConnectRigidBody(rigidBody,rigidBody2);
		
    }
    
}

class FixedEventTest extends Laya.Script3D{
    constructor() {
        super();
        this.fixedConstraint = null;
	}

	onStart()
	{
        this.fixedConstraint = this.owner.getComponent(Laya.FixedConstraint);
        //设置约束的受力的最大阈值，当约束刚体受力大于此阈值时，约束将被打破，失效
		this.fixedConstraint.breakForce = 1000;
	}

	onUpdate()
	{
		if(this.fixedConstraint)
		{
			var mass = this.fixedConstraint.connectedBody.mass;
			this.fixedConstraint.connectedBody.mass = mass+1;
		}	

	}

	onJointBreak()
	{
		console.log("break");
	}
}

new PhysicsWorld_ConstraintFixedJoint();