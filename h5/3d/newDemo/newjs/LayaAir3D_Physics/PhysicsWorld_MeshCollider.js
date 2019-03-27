class PhysicsWorldMeshCollider{
    constructor(){
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        this.scene = Laya.stage.addChild(new Laya.Scene3D());
        //初始化照相机
        var camera = this.scene.addChild(new Laya.Camera(0, 0.1, 100));
        camera.transform.translate(new Laya.Vector3(0, 6, 9.5));
        camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
        camera.addComponent(CameraMoveScript);

        //方向光
        var directionLight = this.scene.addChild(new Laya.DirectionLight());
        directionLight.transform.worldMatrix.setForward(new Laya.Vector3(0.0, -0.8, -1.0));
        directionLight.color = new Laya.Vector3(1, 1, 1);
        Laya.loader.create(
            ["res/threeDimen/staticModel/lizard/Assets/Lizard/lizard-lizard_geo.lm", 
            "res/threeDimen/staticModel/lizard/Assets/Lizard/lizard_diff.png", 
            "res/threeDimen/staticModel/lizard/Assets/Lizard/lizard_norm.png"], Laya.Handler.create(this, this.complete));

    }

    complete() {
        var mesh = Laya.Loader.getRes("res/threeDimen/staticModel/lizard/Assets/Lizard/lizard-lizard_geo.lm");
        var albedo = Laya.Loader.getRes("res/threeDimen/staticModel/lizard/Assets/Lizard/lizard_diff.png");
        var normal = Laya.Loader.getRes("res/threeDimen/staticModel/lizard/Assets/Lizard/lizard_norm.png");
        var mat = new Laya.BlinnPhongMaterial();
        mat.specularColor = new Laya.Vector4(0.5, 0.5, 0.5, 0.5);
        mat.albedoTexture = albedo;
        mat.normalTexture = normal;
        var lizard = this.scene.addChild(new Laya.MeshSprite3D(mesh));
        lizard.transform.localPosition = new Laya.Vector3(-2, 0, 0);
        lizard.transform.localScale = new Laya.Vector3(0.01, 0.01, 0.01);
        lizard.meshRenderer.material = mat;
        var lizardCollider = lizard.addComponent(Laya.PhysicsCollider);
        var meshShape = new Laya.MeshColliderShape();
        meshShape.mesh = mesh;
        lizardCollider.colliderShape = meshShape;
        lizardCollider.friction = 2;
        lizardCollider.restitution = 0.3;
        var lizard1 = this.scene.addChild(new Laya.MeshSprite3D(mesh));
        lizard1.transform.localPosition = new Laya.Vector3(3, 0, 0);
        lizard1.transform.localRotationEuler = new Laya.Vector3(0, 80, 0);
        lizard1.transform.localScale = new Laya.Vector3(0.01, 0.01, 0.01);
        lizard1.meshRenderer.material = mat;
        var lizardCollider1 = lizard1.addComponent(Laya.PhysicsCollider);
        var meshShape1 = new Laya.MeshColliderShape();
        meshShape1.mesh = mesh;
        lizardCollider1.colliderShape = meshShape1;
        lizardCollider1.friction = 2;
        lizardCollider1.restitution = 0.3;
        this.randomAddPhysicsSprite();

    }
    randomAddPhysicsSprite() {
        Laya.timer.loop(1000, this, function () {
        var random = Math.floor(Math.random() * 3) % 3;
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
        var mat1 = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("res/threeDimen/Physics/rocks.jpg", Laya.Handler.create(this, function (tex) {
        mat1.albedoTexture = tex;
        }));
        var sX = Math.random() * 0.75 + 0.25;
        var sY = Math.random() * 0.75 + 0.25;
        var sZ = Math.random() * 0.75 + 0.25;
        var box = this.scene.addChild(new Laya.MeshSprite3D(new Laya.PrimitiveMesh.createBox(sX, sY, sZ)));
        box.meshRenderer.material = mat1;
        var transform = box.transform;
        var pos = transform.position;
        pos.setValue(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
        transform.position = pos;
        var rotationEuler = transform.rotationEuler;
        rotationEuler.setValue(Math.random() * 360, Math.random() * 360, Math.random() * 360);
        box.transform.rotationEuler = rotationEuler;

        var rigidBody = box.addComponent(Laya.Rigidbody3D);
        var boxShape = new Laya.BoxColliderShape(sX, sY, sZ);
        rigidBody.colliderShape = boxShape;
        rigidBody.mass = 10;
    }
    addSphere() {
        var mat2 = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("res/threeDimen/Physics/plywood.jpg", Laya.Handler.create(this, function (tex) {
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
    addCapsule() {
        var mat3 = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("res/threeDimen/Physics/wood.jpg", Laya.Handler.create(this, function (tex) {
            mat3.albedoTexture = tex;
        }))
        var raidius = Math.random() * 0.2 + 0.2;
        var height = Math.random() * 0.5 + 0.8;
        var capsule = this.scene.addChild(new Laya.MeshSprite3D(new Laya.PrimitiveMesh.createCapsule(raidius, height)));
        capsule.meshRenderer.material = mat3;

        var transform = capsule.transform;
        var pos = transform.position;
        pos.setValue(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
        transform.position = pos;
        var rotationEuler = transform.rotationEuler;
        rotationEuler.setValue(Math.random() * 360, Math.random() * 360, Math.random() * 360);
        box.transform.rotationEuler = rotationEuler;
        var rigidBody = capsule.addComponent(Laya.Rigidbody3D);
        var sphereShape = new Laya.CapsuleColliderShape(raidius, height);
        rigidBody.colliderShape = sphereShape;
        rigidBody.mass = 10;
    }        
}


//激活启动类
new PhysicsWorldMeshCollider();