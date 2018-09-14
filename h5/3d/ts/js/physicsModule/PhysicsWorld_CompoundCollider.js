var PhysicsWorld_CompoundCollider = /** @class */ (function () {
    function PhysicsWorld_CompoundCollider() {
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        this.scene = Laya.stage.addChild(new Laya.Scene3D());
        this.camera = this.scene.addChild(new Laya.Camera(0, 0.1, 100));
        this.camera.transform.translate(new Laya.Vector3(5.2, 4, 5.2));
        this.camera.transform.rotate(new Laya.Vector3(-25, 45, 0), true, false);
        this.camera.addComponent(CameraMoveScript);
        this.camera.clearColor = null;
        var directionLight = this.scene.addChild(new Laya.DirectionLight());
        directionLight.color = new Laya.Vector3(1, 1, 1);
        directionLight.transform.worldMatrix.setForward(new Laya.Vector3(-1.0, -1.0, 1.0));
        var plane = this.scene.addChild(new Laya.MeshSprite3D(new Laya.PlaneMesh(13, 13, 10, 10)));
        var planeMat = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("../../res/threeDimen/Physics/grass.png", Laya.Handler.create(null, function (tex) {
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
    PhysicsWorld_CompoundCollider.prototype.randomAddPhysicsSprite = function () {
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
    };
    PhysicsWorld_CompoundCollider.prototype.addTable = function () {
        var mat = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("../../res/threeDimen/Physics/wood.jpg", Laya.Handler.create(null, function (tex) {
            mat.albedoTexture = tex;
        }));
        mat.shininess = 1;
        Laya.Mesh.load("../../res/threeDimen/Physics/table.lm", Laya.Handler.create(this, function (mesh) {
            var table = this.scene.addChild(new Laya.MeshSprite3D(mesh));
            table.transform.position = new Laya.Vector3(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
            table.transform.rotationEuler = new Laya.Vector3(Math.random() * 360, Math.random() * 360, Math.random() * 360);
            table.transform.scale = new Laya.Vector3(3, 3, 3);
            table.meshRenderer.material = mat;
            var rigidBody = table.addComponent(Laya.Rigidbody3D);
            rigidBody.mass = 10;
            rigidBody.friction = 1;
            var compoundShape = new Laya.CompoundColliderShape();
            var boxShape = new Laya.BoxColliderShape(0.5, 0.4, 0.045);
            boxShape.localOffset = new Laya.Vector3(0, 0, 0.125);
            compoundShape.addChildShape(boxShape);
            var boxShape1 = new Laya.BoxColliderShape(0.1, 0.1, 0.3);
            boxShape1.localOffset = new Laya.Vector3(-0.2, -0.148, -0.048);
            compoundShape.addChildShape(boxShape1);
            var boxShape2 = new Laya.BoxColliderShape(0.1, 0.1, 0.3);
            boxShape2.localOffset = new Laya.Vector3(0.2, -0.148, -0.048);
            compoundShape.addChildShape(boxShape2);
            var boxShape3 = new Laya.BoxColliderShape(0.1, 0.1, 0.3);
            boxShape3.localOffset = new Laya.Vector3(-0.2, 0.153, -0.048);
            compoundShape.addChildShape(boxShape3);
            var boxShape4 = new Laya.BoxColliderShape(0.1, 0.1, 0.3);
            boxShape4.localOffset = new Laya.Vector3(0.2, 0.153, -0.048);
            compoundShape.addChildShape(boxShape4);
            rigidBody.colliderShape = compoundShape;
        }));
    };
    PhysicsWorld_CompoundCollider.prototype.addObject = function () {
        var mat = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("../../res/threeDimen/Physics/rocks.jpg", Laya.Handler.create(this, function (tex) {
            mat.albedoTexture = tex;
        }));
        Laya.Mesh.load("../../res/threeDimen/Physics/object.lm", Laya.Handler.create(this, function (mesh) {
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
            boxShape.localOffset = new Laya.Vector3(0, 0, -20);
            compoundShape.addChildShape(boxShape);
            var sphereShape = new Laya.SphereColliderShape(25);
            sphereShape.localOffset = new Laya.Vector3(0, 0, 24);
            compoundShape.addChildShape(sphereShape);
            rigidBody.colliderShape = compoundShape;
        }));
    };
    return PhysicsWorld_CompoundCollider;
}());
new PhysicsWorld_CompoundCollider;
