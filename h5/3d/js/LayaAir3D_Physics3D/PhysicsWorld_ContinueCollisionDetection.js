class PhysicsWorldContinueCollisionDetection{
    constructor(){
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        this.scene = Laya.stage.addChild(new Laya.Scene3D());
        this.scene.physicsSimulation.gravity = new Laya.Vector3(0, -98.0, 0);
        //初始化照相机
        let camera = this.scene.addChild(new Laya.Camera(0, 0.1, 100));
        camera.transform.translate(new Laya.Vector3(0, 6, 9.5));
        camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
        camera.addComponent(CameraMoveScript);

        //方向光
        let directionLight = this.scene.addChild(new Laya.DirectionLight());
        directionLight.color = new Laya.Vector3(0.6, 0.6, 0.6);
        let mat = directionLight.transform.worldMatrix;
        mat.setForward(new Laya.Vector3(-1.0, -1.0, -1.0));
        directionLight.transform.worldMatrix = mat;

        //材质加载
        this.mat2 = new Laya.BlinnPhongMaterial;
        Laya.Texture2D.load("res/threeDimen/Physics/plywood.jpg", Laya.Handler.create(this, function (tex) {
            this.mat2.albedoTexture = tex;
        }));

        //平面
        let plane = this.scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createPlane(10, 10, 10, 10)));
        let planeMat = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("res/threeDimen/Physics/grass.png", Laya.Handler.create(null, function (tex) {
            planeMat.albedoTexture = tex;
        }));
        planeMat.tilingOffset = new Laya.Vector4(10, 10, 0, 0);
        plane.meshRenderer.material = planeMat;
        let planeStaticCollider = plane.addComponent(Laya.PhysicsCollider);
        let planeShape = new Laya.BoxColliderShape(10, 0, 10);
        planeStaticCollider.colliderShape = planeShape;
        planeStaticCollider.friction = 2;
        planeStaticCollider.restitution = 0.3;
        Laya.timer.loop(200, this, function () {
            this.addSphere();
        });
    
    }
    addSphere() {
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
        debugger;
        rigidBody.ccdSweptSphereRadius = radius;
        rigidBody.ccdMotionThreshold = 0.0001;
    }


}


//激活启动类
new PhysicsWorldContinueCollisionDetection();