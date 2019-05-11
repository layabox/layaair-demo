class PhysicsWorldMeshCollider{
    constructor(){
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        this.scene = Laya.stage.addChild(new Laya.Scene3D());
        //初始化照相机
        let camera = this.scene.addChild(new Laya.Camera(0, 0.1, 100));
        camera.transform.translate(new Laya.Vector3(0, 6, 9.5));
        camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
        camera.addComponent(CameraMoveScript);

        //方向光
        let directionLight = this.scene.addChild(new Laya.DirectionLight());
        let mat = directionLight.transform.worldMatrix;
        mat.setForward(new Laya.Vector3(0.0, -0.8, -1.0));
        directionLight.transform.worldMatrix = mat;
        directionLight.color = new Laya.Vector3(1, 1, 1);


        //材质加载
        this.mat1 = new Laya.BlinnPhongMaterial;
        this.mat2 = new Laya.BlinnPhongMaterial;
        this.mat3 = new Laya.BlinnPhongMaterial;

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

        Laya.loader.create([
            "res/threeDimen/staticModel/lizard/Assets/Lizard/lizard-lizard_geo.lm", 
            "res/threeDimen/staticModel/lizard/Assets/Lizard/lizard_diff.png", 
            "res/threeDimen/staticModel/lizard/Assets/Lizard/lizard_norm.png"
        ], Laya.Handler.create(this, this.complete));

    }

    complete() {
        let mesh = Laya.Loader.getRes("res/threeDimen/staticModel/lizard/Assets/Lizard/lizard-lizard_geo.lm");
        let albedo = Laya.Loader.getRes("res/threeDimen/staticModel/lizard/Assets/Lizard/lizard_diff.png");
        let normal = Laya.Loader.getRes("res/threeDimen/staticModel/lizard/Assets/Lizard/lizard_norm.png");
        let mat = new Laya.BlinnPhongMaterial();
        mat.specularColor = new Laya.Vector4(0.5, 0.5, 0.5, 0.5);
        mat.albedoTexture = albedo;
        mat.normalTexture = normal;
        let lizard = this.scene.addChild(new Laya.MeshSprite3D(mesh));
        lizard.transform.localPosition = new Laya.Vector3(-2, 0, 0);
        lizard.transform.localScale = new Laya.Vector3(0.01, 0.01, 0.01);
        lizard.meshRenderer.material = mat;
        let lizardCollider = lizard.addComponent(Laya.PhysicsCollider);
        let meshShape = new Laya.MeshColliderShape();
        meshShape.mesh = mesh;
        lizardCollider.colliderShape = meshShape;
        lizardCollider.friction = 2;
        lizardCollider.restitution = 0.3;
        let lizard1 = this.scene.addChild(new Laya.MeshSprite3D(mesh));
        lizard1.transform.localPosition = new Laya.Vector3(3, 0, 0);
        lizard1.transform.localRotationEuler = new Laya.Vector3(0, 80, 0);
        lizard1.transform.localScale = new Laya.Vector3(0.01, 0.01, 0.01);
        lizard1.meshRenderer.material = mat;
        let lizardCollider1 = lizard1.addComponent(Laya.PhysicsCollider);
        let meshShape1 = new Laya.MeshColliderShape();
        meshShape1.mesh = mesh;
        lizardCollider1.colliderShape = meshShape1;
        lizardCollider1.friction = 2;
        lizardCollider1.restitution = 0.3;
        this.randomAddPhysicsSprite();

    }
    randomAddPhysicsSprite() {
        Laya.timer.loop(1000, this, function () {
        let random = Math.floor(Math.random() * 3) % 3;
        switch (random) {
            case 0:
                this.addBox();
                break;
            case 1:
                this.addSphere();
                break;
            case 2:
                this.addCapsule();
                break;
            default:
                break;
            }
        });
    }

    addBox() {
        let sX = Math.random() * 0.75 + 0.25;
        let sY = Math.random() * 0.75 + 0.25;
        let sZ = Math.random() * 0.75 + 0.25;
        let box = this.scene.addChild(new Laya.MeshSprite3D(new Laya.PrimitiveMesh.createBox(sX, sY, sZ)));
        box.meshRenderer.material = this.mat1;
        let transform = box.transform;
        let pos = transform.position;
        pos.setValue(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
        transform.position = pos;
        let rotationEuler = transform.rotationEuler;
        rotationEuler.setValue(Math.random() * 360, Math.random() * 360, Math.random() * 360);
        box.transform.rotationEuler = rotationEuler;

        let rigidBody = box.addComponent(Laya.Rigidbody3D);
        let boxShape = new Laya.BoxColliderShape(sX, sY, sZ);
        rigidBody.colliderShape = boxShape;
        rigidBody.mass = 10;
    }
    addSphere() {
        let mat2 = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("res/threeDimen/Physics/plywood.jpg", Laya.Handler.create(this, function (tex) {
        mat2.albedoTexture = tex;
        }));
        let radius = Math.random() * 0.2 + 0.2;
        let sphere = this.scene.addChild(new Laya.MeshSprite3D(new Laya.PrimitiveMesh.createSphere(radius)));
        sphere.meshRenderer.material = this.mat2;
        let pos = sphere.transform.position;
        pos.setValue(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
        sphere.transform.position = pos;

        let rigidBody = sphere.addComponent(Laya.Rigidbody3D);
        let sphereShape = new Laya.SphereColliderShape(radius);
        rigidBody.colliderShape = sphereShape;
        rigidBody.mass = 10;
    }   
    addCapsule() {
        let mat3 = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("res/threeDimen/Physics/wood.jpg", Laya.Handler.create(this, function (tex) {
            mat3.albedoTexture = tex;
        }))
        let raidius = Math.random() * 0.2 + 0.2;
        let height = Math.random() * 0.5 + 0.8;
        let capsule = this.scene.addChild(new Laya.MeshSprite3D(new Laya.PrimitiveMesh.createCapsule(raidius, height)));
        capsule.meshRenderer.material = this.mat3;

        let transform = capsule.transform;
        let pos = transform.position;
        pos.setValue(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
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
new PhysicsWorldMeshCollider();