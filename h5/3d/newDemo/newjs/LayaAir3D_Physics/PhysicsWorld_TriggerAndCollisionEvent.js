class PhysicsWorldTriggerAndCollisionEvent{
    constructor(){
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        this.scene = Laya.stage.addChild(new Laya.Scene3D());
        this.camera = this.scene.addChild(new Laya.Camera(0, 0.1, 100));
        this.camera.transform.translate(new Laya.Vector3(0, 8, 18));
        this.camera.transform.rotate(new Laya.Vector3(-30, 0, 0), true, false);
        //this.camera.clearColor = null;

        //初始化变量
        this.translateW = new Laya.Vector3(0, 0, -0.2);
		this.translateS = new Laya.Vector3(0, 0, 0.2);
		this.translateA = new Laya.Vector3(-0.2, 0, 0);
		this.translateD = new Laya.Vector3(0.2, 0, 0);
		this.translateQ = new Laya.Vector3(-0.01, 0, 0);
        this.translateE = new Laya.Vector3(0.01, 0, 0);

        var directionLight = this.scene.addChild(new Laya.DirectionLight());
        directionLight.color = new Laya.Vector3(1, 1, 1);
        directionLight.transform.worldMatrix.setForward(new Laya.Vector3(-1.0, -1.0, 1.0));
        var plane = this.scene.addChild(new Laya.MeshSprite3D(new Laya.PrimitiveMesh.createPlane(20, 20, 10, 10)));
        var planeMat = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("res/threeDimen/Physics/wood.jpg", Laya.Handler.create(null, function (tex) {
            planeMat.albedoTexture = tex;
        }));
        planeMat.tilingOffset = new Laya.Vector4(2, 2, 0, 0);
        plane.meshRenderer.material = planeMat;
        var staticCollider = plane.addComponent(Laya.PhysicsCollider);
        var boxShape = new Laya.BoxColliderShape(20, 0, 20);
        staticCollider.colliderShape = boxShape;
        this.addKinematicSphere();
        for (var i = 0; i < 30; i++) {
            this.addBoxAndTrigger();
            this.addCapsuleCollision();
        }
    }

    addKinematicSphere() {
        var mat2 = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("res/threeDimen/Physics/plywood.jpg", Laya.Handler.create(null, function (tex) {
            mat2.albedoTexture = tex;
        }));
        mat2.albedoColor = new Laya.Vector4(1.0, 0.0, 0.0, 1.0);
        var radius = 0.8;
        var sphere = this.scene.addChild(new Laya.MeshSprite3D(new Laya.PrimitiveMesh.createSphere(radius)));
        sphere.meshRenderer.material = mat2;
        sphere.transform.position = new Laya.Vector3(0, 0.8, 0);
        var rigidBody = sphere.addComponent(Laya.Rigidbody3D);
        var sphereShape = new Laya.SphereColliderShape(radius);
        rigidBody.colliderShape = sphereShape;
        rigidBody.mass = 60;
        rigidBody.isKinematic = true;
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
    addBoxAndTrigger() {
        var mat1 = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("res/threeDimen/Physics/rocks.jpg", Laya.Handler.create(null, function (tex) {
            mat1.albedoTexture = tex;
        }));
        mat1.albedoColor = new Laya.Vector4(1.0, 1.0, 1.0, 1.0);
        var sX = Math.random() * 0.75 + 0.25;
        var sY = Math.random() * 0.75 + 0.25;
        var sZ = Math.random() * 0.75 + 0.25;
        var box = this.scene.addChild(new Laya.MeshSprite3D(new Laya.PrimitiveMesh.createBox(sX, sY, sZ)));
        box.meshRenderer.material = mat1;

        var transform = box.transform;
        var pos = transform.position;
        pos.setValue(Math.random() * 16 - 8, sY / 2, Math.random() * 16 - 8);
        transform.position = pos;
        var rotationEuler = transform.rotationEuler;
        rotationEuler.setValue(Math.random() * 16 - 8, sY / 2, Math.random() * 16 - 8);
        box.transform.rotationEuler = rotationEuler;

        var staticCollider = box.addComponent(Laya.PhysicsCollider); //StaticCollider可与非Kinematic类型RigidBody3D产生碰撞
        var boxShape = new Laya.BoxColliderShape(sX, sY, sZ);
        staticCollider.colliderShape = boxShape;
        staticCollider.isTrigger = true; //标记为触发器,取消物理反馈
        var script = box.addComponent(TriggerCollisionScript);
        script.kinematicSprite = this.kinematicSphere;
    }
  
    addCapsuleCollision() {
        var mat3 = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("res/threeDimen/Physics/wood.jpg", Laya.Handler.create(null, function (tex) {
            mat3.albedoTexture = tex;
        }));
        var raidius = Math.random() * 0.2 + 0.2;
        var height = Math.random() * 0.5 + 0.8;
        var capsule = this.scene.addChild(new Laya.MeshSprite3D(new Laya.PrimitiveMesh.createCapsule(raidius, height)));
        capsule.meshRenderer.material = mat3;

        var transform = capsule.transform;
        var pos = transform.position;
        pos.setValue(Math.random() * 4 - 2, 2, Math.random() * 4 - 2);
        transform.position = pos;
        var rotationEuler = transform.rotationEuler;
        rotationEuler.setValue(Math.random() * 360, Math.random() * 360, Math.random() * 360);
        box.transform.rotationEuler = rotationEuler;

        var rigidBody = capsule.addComponent(Laya.Rigidbody3D); //Rigidbody3D可与StaticCollider和RigidBody3D产生碰撞
        var sphereShape = new Laya.CapsuleColliderShape(raidius, height);
        rigidBody.colliderShape = sphereShape;
        rigidBody.mass = 10;
        var script = capsule.addComponent(TriggerCollisionScript);
        script.kinematicSprite = this.kinematicSphere;
    }
    addSphere() {
        var mat2 = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("res/threeDimen/Physics/plywood.jpg", Laya.Handler.create(null, function (tex) {
            mat2.albedoTexture = tex;
        }));
        var radius = Math.random() * 0.2 + 0.2;
        var sphere = this.scene.addChild(new Laya.MeshSprite3D(new Laya.PrimitiveMesh.createSphere(radius)));
        sphere.meshRenderer.material = mat2;
        var pos = sphere.transform.position;
        pos.setValue(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
        sphere.transform.position = pos;
        var rigidBody = sphere.addComponent(Laya.Rigidbody3D);
        var sphereShape = new Laya.SphereColliderShape(radius);
        rigidBody.colliderShape = sphereShape;
        rigidBody.mass = 10;
    }
}


//激活启动类
new PhysicsWorldTriggerAndCollisionEvent();
