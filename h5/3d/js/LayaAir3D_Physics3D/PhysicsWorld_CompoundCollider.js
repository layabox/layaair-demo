class  PhysicsWorldCompoundCollider{
    constructor(){
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        this.scene = Laya.stage.addChild(new Laya.Scene3D());
        this.camera = this.scene.addChild(new Laya.Camera(0, 0.1, 100));
        this.camera.transform.translate(new Laya.Vector3(5.2, 4, 5.2));
        this.camera.transform.rotate(new Laya.Vector3(-25, 45, 0), true, false);
        this.camera.addComponent(CameraMoveScript);

        var directionLight = this.scene.addChild(new Laya.DirectionLight());
        directionLight.color = new Laya.Vector3(1, 1, 1);
        
        var mat = directionLight.transform.worldMatrix;
        mat.setForward(new Laya.Vector3(-1.0, -1.0, 1.0));
        directionLight.transform.worldMatrix = mat;

        var plane = this.scene.addChild(new Laya.MeshSprite3D(new Laya.PrimitiveMesh.createPlane(13, 13, 10, 10)));
        var planeMat = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("res/threeDimen/Physics/grass.png", Laya.Handler.create(null, function (tex) {
            planeMat.albedoTexture = tex;
        }));
        planeMat.tilingOffset = new Laya.Vector4(10, 10, 0, 0);
        planeMat.shininess = 1;
        plane.meshRenderer.material = planeMat;
        plane.meshRenderer.receiveShadow = true;

        var staticCollider = plane.addComponent(Laya.PhysicsCollider);
        var planeShape = new Laya.BoxColliderShape(13, 0, 13);
        staticCollider.colliderShape = planeShape;
        staticCollider.friction = 2;
        this.randomAddPhysicsSprite();
    }

    randomAddPhysicsSprite() {
        Laya.timer.loop(1000, this, function () {
            var random = Math.floor(Math.random() * 2) % 2;
            switch (random) {
                case 0:
                    this.addTable();
                    break;
                case 1:
                    this.addObject();
                    break;
                default:
                    break;
            }
        });
    }
    addTable() {
        var mat = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("res/threeDimen/Physics/wood.jpg", Laya.Handler.create(null, function (tex) {
            mat.albedoTexture = tex;
        }));
        mat.shininess = 1;
        Laya.Mesh.load("res/threeDimen/Physics/table.lm", Laya.Handler.create(this, function (mesh) {
            var table = this.scene.addChild(new Laya.MeshSprite3D(mesh));

            var transform = table.transform;
            var pos = transform.position;
            pos.setValue(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
            transform.position = pos;
            var rotationEuler = transform.rotationEuler;
            rotationEuler.setValue(Math.random() * 360, Math.random() * 360, Math.random() * 360);
            transform.rotationEuler = rotationEuler;
            var scale = transform.scale;
            scale.setValue(3, 3, 3);
            transform.scale = scale;

            table.meshRenderer.material = mat;
            var rigidBody = table.addComponent(Laya.Rigidbody3D);
            rigidBody.mass = 10;
            rigidBody.friction = 1;
            var compoundShape = new Laya.CompoundColliderShape();
            var boxShape = new Laya.BoxColliderShape(0.5, 0.4, 0.045);
            var boxLocalOffset = boxShape.localOffset;
            boxLocalOffset.setValue(0, 0, 0.125);
            boxShape.localOffset = boxLocalOffset;
            compoundShape.addChildShape(boxShape);
            var boxShape1 = new Laya.BoxColliderShape(0.1, 0.1, 0.3);
            var boxLocalOffset1 = boxShape1.localOffset;
            boxLocalOffset1.setValue(-0.2, -0.148, -0.048);
            boxShape1.localOffset = boxLocalOffset1;
            compoundShape.addChildShape(boxShape1);
            var boxShape2 = new Laya.BoxColliderShape(0.1, 0.1, 0.3);
            var boxLocalOffset2 = boxShape2.localOffset;
            boxLocalOffset2.setValue(0.2, -0.148, -0.048);
            boxShape2.localOffset = boxLocalOffset2;
            compoundShape.addChildShape(boxShape2);
            var boxShape3 = new Laya.BoxColliderShape(0.1, 0.1, 0.3);
            var boxLocalOffset3 = boxShape3.localOffset;
            boxLocalOffset3.setValue(-0.2, 0.153, -0.048);
            boxShape3.localOffset = boxLocalOffset3;
            compoundShape.addChildShape(boxShape3);
            var boxShape4 = new Laya.BoxColliderShape(0.1, 0.1, 0.3);
            var boxLocalOffset4 = boxShape4.localOffset;
            boxLocalOffset4.setValue(0.2, 0.153, -0.048);
            boxShape4.localOffset = boxLocalOffset4;
            compoundShape.addChildShape(boxShape4);
            rigidBody.colliderShape = compoundShape;
        }));
    }
    addObject() {
        var mat = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("res/threeDimen/Physics/rocks.jpg", Laya.Handler.create(this, function (tex) {
            mat.albedoTexture = tex;
        }));
        Laya.Mesh.load("res/threeDimen/Physics/object.lm", Laya.Handler.create(this, function (mesh) {
            var object = this.scene.addChild(new Laya.MeshSprite3D(mesh));
            object.transform.position = new Laya.Vector3(Math.random() * 4 - 2, 5, Math.random() * 4 - 2);
            object.transform.rotationEuler = new Laya.Vector3(Math.random() * 360, Math.random() * 360, Math.random() * 360);
            object.transform.scale = new Laya.Vector3(0.01, 0.01, 0.01);
            object.meshRenderer.material = mat;
            var rigidBody = object.addComponent(Laya.Rigidbody3D);
            rigidBody.mass = 3;
            rigidBody.friction = 0.3;
            var compoundShape = new Laya.CompoundColliderShape();
            var boxShape = new Laya.BoxColliderShape(40, 40, 40);
            var boxLocalOffset = boxShape.localOffset;
            boxLocalOffset.setValue(0, 0, -20);
            boxShape.localOffset = boxLocalOffset;
            compoundShape.addChildShape(boxShape);
            var sphereShape = new Laya.SphereColliderShape(25);
            var sphereLocalOffset = sphereShape.localOffset;
            sphereLocalOffset.setValue(0, 0, 24);
            sphereShape.localOffset = sphereLocalOffset;
            compoundShape.addChildShape(sphereShape);
            rigidBody.colliderShape = compoundShape;
        }));
    }
}


//激活启动类
new PhysicsWorldCompoundCollider();
