class PhysicsWorldKinematic{
    constructor(){
        Laya3D.init(0, 0, null);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        this.scene = Laya.stage.addChild(new Laya.Scene3D());
        this.camera = this.scene.addChild(new Laya.Camera(0, 0.1, 100));
        this.camera.transform.translate(new Laya.Vector3(0, 8, 20));
        this.camera.transform.rotate(new Laya.Vector3(-30, 0, 0), true, false);

        this.translateW = new Laya.Vector3(0, 0, -0.2);
		this.translateS = new Laya.Vector3(0, 0, 0.2);
		this.translateA = new Laya.Vector3(-0.2, 0, 0);
		this.translateD = new Laya.Vector3(0.2, 0, 0);
		this.translateQ = new Laya.Vector3(-0.01, 0, 0);
        this.translateE = new Laya.Vector3(0.01, 0, 0);
        this.tmpVector = new Laya.Vector3(0, 0, 0);

        let directionLight = this.scene.addChild(new Laya.DirectionLight());
        directionLight.color = new Laya.Vector3(1, 1, 1);
        let mat = directionLight.transform.worldMatrix;
        mat.setForward(new Laya.Vector3(-1.0, -1.0, 1.0));
        directionLight.transform.worldMatrix = mat;

        //材质加载
        this.mat1 = new Laya.BlinnPhongMaterial;
        this.mat3 = new Laya.BlinnPhongMaterial;

        //添加漫反射贴图
        Laya.Texture2D.load("res/threeDimen/Physics/rocks.jpg", Laya.Handler.create(this, function (tex) {
            this.mat1.albedoTexture = tex;
        }));
        Laya.Texture2D.load("res/threeDimen/Physics/wood.jpg", Laya.Handler.create(this, function (tex) {
            this.mat3.albedoTexture = tex;
        }));


        let plane = this.scene.addChild(new Laya.MeshSprite3D(new Laya.PrimitiveMesh.createPlane(20, 20, 10, 10)));
        let planeMat = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("res/threeDimen/Physics/wood.jpg", Laya.Handler.create(this, function (tex) {
            planeMat.albedoTexture = tex;
        }));
        planeMat.tilingOffset = new Laya.Vector4(2, 2, 0, 0);
        plane.meshRenderer.material = planeMat;
        let rigidBody = plane.addComponent(Laya.PhysicsCollider);
        let boxShape = new Laya.BoxColliderShape(20, 0, 20);
        rigidBody.colliderShape = boxShape;
        for (let i = 0; i < 60; i++) {
            this.addBox();
            this.addCapsule();
        }
        this.addKinematicSphere();
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
        this.kinematicSphere = sphere;
        Laya.timer.frameLoop(1, this, this.onKeyDown);
    }
    onKeyDown() {
        Laya.KeyBoardManager.hasKeyDown(87) && this.kinematicSphere.transform.translate(this.translateW);//W
		Laya.KeyBoardManager.hasKeyDown(83) && this.kinematicSphere.transform.translate(this.translateS);//S
		Laya.KeyBoardManager.hasKeyDown(65) && this.kinematicSphere.transform.translate(this.translateA);//A
		Laya.KeyBoardManager.hasKeyDown(68) && this.kinematicSphere.transform.translate(this.translateD);//D
		Laya.KeyBoardManager.hasKeyDown(81) && this.kinematicSphere.transform.translate(this.translateQ);//Q
		Laya.KeyBoardManager.hasKeyDown(69) && this.kinematicSphere.transform.translate(this.translateE);//E
    }
    addBox() {
        let sX = Math.random() * 0.75 + 0.25;
        let sY = Math.random() * 0.75 + 0.25;
        let sZ = Math.random() * 0.75 + 0.25;
        let box = this.scene.addChild(new Laya.MeshSprite3D(new Laya.PrimitiveMesh.createBox(sX, sY, sZ)));
        box.meshRenderer.material = this.mat1;
        let transform = box.transform;
        let pos = transform.position;
        pos.setValue(Math.random() * 4 - 2, 2, Math.random() * 4 - 2);
        transform.position = pos;
        let rotationEuler = transform.rotationEuler;
        rotationEuler.setValue(Math.random() * 360, Math.random() * 360, Math.random() * 360);
        box.transform.rotationEuler = rotationEuler;
        
        let rigidBody = box.addComponent(Laya.Rigidbody3D);
        let boxShape = new Laya.BoxColliderShape(sX, sY, sZ);
        rigidBody.colliderShape = boxShape;
        rigidBody.mass = 10;
    }
    addCapsule() {
        let mat3 = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("res/threeDimen/Physics/wood.jpg", Laya.Handler.create(null, function (tex) {
            mat3.albedoTexture = tex;
        }));
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
    }
}


//激活启动类
new PhysicsWorldKinematic();
