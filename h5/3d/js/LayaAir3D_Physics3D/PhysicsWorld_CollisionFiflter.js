class PhysicsWorldCollisionFiflter{
    constructor(){
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        this.scene = Laya.stage.addChild(new Laya.Scene3D());
        this.camera = this.scene.addChild(new Laya.Camera(0, 0.1, 100));
        this.camera.transform.translate(new Laya.Vector3(0, 8, 18));
        this.camera.transform.rotate(new Laya.Vector3(-30, 0, 0), true, false);

        //初始化变量
        this.translateW = new Laya.Vector3(0, 0, -0.2);
		this.translateS = new Laya.Vector3(0, 0, 0.2);
		this.translateA = new Laya.Vector3(-0.2, 0, 0);
		this.translateD = new Laya.Vector3(0.2, 0, 0);
		this.translateQ = new Laya.Vector3(-0.01, 0, 0);
        this.translateE = new Laya.Vector3(0.01, 0, 0);

        let directionLight = this.scene.addChild(new Laya.DirectionLight());
        directionLight.color = new Laya.Vector3(1, 1, 1);
        let mat = directionLight.transform.worldMatrix;
        mat.setForward(new Laya.Vector3(-1.0, -1.0, 1.0));
        directionLight.transform.worldMatrix = mat;

        //材质加载
        this.mat1 = new Laya.BlinnPhongMaterial;
        this.mat2 = new Laya.BlinnPhongMaterial;
        this.mat3 = new Laya.BlinnPhongMaterial;
        this.mat4 = new Laya.BlinnPhongMaterial;
        this.mat5 = new Laya.BlinnPhongMaterial;
        //添加漫反射贴图
        Laya.Texture2D.load("res/threeDimen/Physics/rocks.jpg", Laya.Handler.create(this, function (tex) {
            this.mat1.albedoTexture = tex;
        }));
        Laya.Texture2D.load("res/threeDimen/Physics/plywood.jpg", Laya.Handler.create(this, function (tex) {
            this.mat2.albedoTexture = tex;
        }));
        Laya.Texture2D.load("res/threeDimen/Physics/wood.jpg", Laya.Handler.create(this, function (tex) {
            this.mat3.albedoTexture = tex;
        }));
        Laya.Texture2D.load("res/threeDimen/Physics/steel2.jpg", Laya.Handler.create(this, function(tex) {
            this.mat4.albedoTexture = tex;
        }));
        Laya.Texture2D.load("res/threeDimen/Physics/steel.jpg", Laya.Handler.create(this, function(tex) {
            this.mat5.albedoTexture = tex;
        }));

        this.plane = this.scene.addChild(new Laya.MeshSprite3D(new Laya.PrimitiveMesh.createPlane(20, 20, 10, 10)));
        let planeMat = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("res/threeDimen/Physics/wood.jpg", Laya.Handler.create(null, function (tex) {
            planeMat.albedoTexture = tex;
        }));
        planeMat.tilingOffset = new Laya.Vector4(2, 2, 0, 0);
        this.plane.meshRenderer.material = planeMat;
        let staticCollider = this.plane.addComponent(Laya.PhysicsCollider);
        let boxShape = new Laya.BoxColliderShape(20, 0, 20);
        staticCollider.colliderShape = boxShape;
        this.addKinematicSphere();
        for (let i = 0; i < 20; i++) {
            this.addBox();
			this.addCapsule();
			this.addCone();
			this.addCylinder();
			this.addSphere();
        }
    }

    addKinematicSphere() {
        let mat2 = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("res/threeDimen/Physics/plywood.jpg", Laya.Handler.create(null, function (tex) {
            mat2.albedoTexture = tex;
        }));
        mat2.albedoColor = new Laya.Vector4(1.0, 0.0, 0.0, 1.0);
        let radius = 0.8;
        let sphere = this.scene.addChild(new Laya.MeshSprite3D(new Laya.PrimitiveMesh.createSphere(radius)));
        sphere.meshRenderer.material = mat2;
        sphere.transform.position = new Laya.Vector3(0, 0.8, 0);
        let rigidBody = sphere.addComponent(Laya.Rigidbody3D);
        let sphereShape = new Laya.SphereColliderShape(radius);
        rigidBody.colliderShape = sphereShape;
        rigidBody.mass = 60;
        rigidBody.isKinematic = true;
        rigidBody.canCollideWith = Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER1 | Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER3 | Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER5; //只与自定义组1碰撞(如果多组采用位操作）
        this.kinematicSphere = sphere;
        Laya.timer.frameLoop(1, this, this.onKeyDown);
    }
    onKeyDown() {
        Laya.KeyBoardManager.hasKeyDown(87) && kinematicSphere.transform.translate(this.translateW);//W
		Laya.KeyBoardManager.hasKeyDown(83) && kinematicSphere.transform.translate(this.translateS);//S
		Laya.KeyBoardManager.hasKeyDown(65) && kinematicSphere.transform.translate(this.translateA);//A
		Laya.KeyBoardManager.hasKeyDown(68) && kinematicSphere.transform.translate(this.translateD);//D
		Laya.KeyBoardManager.hasKeyDown(81) && plane.transform.translate(this.translateQ);//Q
		Laya.KeyBoardManager.hasKeyDown(69) && plane.transform.translate(this.translateE);//E
    }
    addBox() {
        this.mat1.albedoColor = new Laya.Vector4(1.0, 1.0, 1.0, 1.0);
        let sX = Math.random() * 0.75 + 0.25;
        let sY = Math.random() * 0.75 + 0.25;
        let sZ = Math.random() * 0.75 + 0.25;
        let box = this.scene.addChild(new Laya.MeshSprite3D(new Laya.PrimitiveMesh.createBox(sX, sY, sZ)));
        box.meshRenderer.material = this.mat1;

        let transform = box.transform;
        let pos = transform.position;
        pos.setValue(Math.random() * 16 - 8, sY / 2, Math.random() * 16 - 8);
        transform.position = pos;
        let rotationEuler = transform.rotationEuler;
        rotationEuler.setValue(0, Math.random() * 360, 0);
        box.transform.rotationEuler = rotationEuler;

        let rigidBody = box.addComponent(Laya.Rigidbody3D);
        let boxShape = new Laya.BoxColliderShape(sX, sY, sZ);
        rigidBody.colliderShape = boxShape;
        rigidBody.mass = 10;
        rigidBody.collisionGroup = Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER1; //自定义组1
    }
    addCapsule() {
        let raidius = Math.random() * 0.2 + 0.2;
        let height = Math.random() * 0.5 + 0.8;
        let capsule = this.scene.addChild(new Laya.MeshSprite3D(new Laya.PrimitiveMesh.createCapsule(raidius, height)));
        capsule.meshRenderer.material = this.mat3;

        let transform = capsule.transform;
        let pos = transform.position;
        pos.setValue(Math.random() * 4 - 2, 2, Math.random() * 4 - 2);
        transform.position = pos;
        let rotationEuler = transform.rotationEuler;
        rotationEuler.setValue(Math.random() * 360, Math.random() * 360, Math.random() * 360);
        transform.rotationEuler = rotationEuler;

        let rigidBody = capsule.addComponent(Laya.Rigidbody3D);
        let sphereShape = new Laya.CapsuleColliderShape(raidius, height);
        rigidBody.colliderShape = sphereShape;
        rigidBody.mass = 10;
        rigidBody.collisionGroup = Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER2; //自定义组2,会跳过碰撞
    }
    //添加球体
    addSphere(){
        let radius = Math.random() * 0.2 + 0.2;
        let sphere = this.scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createSphere(radius)));
        sphere.meshRenderer.material = this.mat2;
        let pos = sphere.transform.position;
        pos.setValue(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
        sphere.transform.position = pos;
        let rigidBody = sphere.addComponent(Laya.Rigidbody3D);
        let sphereShape = new Laya.SphereColliderShape(radius);
        rigidBody.colliderShape = sphereShape;
        rigidBody.mass = 10;
        rigidBody.collisionGroup = Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER3;//自定义组3
    }
    //添加圆锥
    addCone() {
        let raidius = Math.random() * 0.2 + 0.2;
        let height = Math.random() * 0.5 + 0.8;
        //创建圆锥MeshSprite3D
        let cone = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCone(raidius, height));
        this.scene.addChild(cone);
        //设置材质
        cone.meshRenderer.material = this.mat4;
        //设置位置
        let pos = cone.transform.position;
        pos.setValue(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
        cone.transform.position = pos;
        //创建刚体碰撞器
        let rigidBody = cone.addComponent(Laya.Rigidbody3D);
        //创建球型碰撞器
        let coneShape = new Laya.ConeColliderShape(raidius, height);
        //设置刚体碰撞器的形状
        rigidBody.colliderShape = coneShape;
        //设置刚体碰撞器的质量
        rigidBody.mass = 10;	
        rigidBody.collisionGroup = Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER4;//自定义组4
    }
    //添加圆柱
    addCylinder() {
        let raidius = Math.random() * 0.2 + 0.2;
        let height = Math.random() * 0.5 + 0.8;
        //创建圆锥MeshSprite3D
        let cylinder = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCylinder(raidius, height));
        this.scene.addChild(cylinder);
        //设置材质
        cylinder.meshRenderer.material = this.mat5;

        let transform = cylinder.transform;
        let pos = transform.position;
        pos.setValue(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
        transform.position = pos;
        let rotationEuler = transform.rotationEuler;
        rotationEuler.setValue(Math.random() * 360, Math.random() * 360, Math.random() * 360);
        transform.rotationEuler = rotationEuler;

        //创建刚体碰撞器
        let rigidBody = cylinder.addComponent(Laya.Rigidbody3D);
        //创建球型碰撞器
        let cylinderShape = new Laya.CylinderColliderShape(raidius, height);
        //设置刚体碰撞器的形状
        rigidBody.colliderShape = cylinderShape;
        //设置刚体碰撞器的质量
        rigidBody.mass = 10;
        rigidBody.collisionGroup = Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER5;//自定义组5
    }

}


//激活启动类
new PhysicsWorldCollisionFiflter();
