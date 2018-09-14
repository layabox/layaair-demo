
        //初始化引擎
        Laya3D.init(0, 0);
        //设置画布模式
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        this.scene = Laya.stage.addChild(new Laya.Scene3D());
        //初始化照相机
        var camera = this.scene.addChild(new Laya.Camera(0, 0.1, 100));
        camera.transform.translate(new Laya.Vector3(0, 6, 9.5));
        camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
        camera.addComponent(CameraMoveScript);
        //camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SOLIDCOLOR;
        camera.clearColor = null;
        //方向光
        var directionlight = this.scene.addChild(new Laya.DirectionLight());
        directionlight.diffuseColor = new Laya.Vector3(0.6, 0.6, 0.6);
        //矩阵前向量变成了-1.0，-1.0，-1.0
        //不清楚是否识别01
        directionlight.transform.worldMatrix.setForward(new Laya.Vector3(-1.0, -1.0, -1.0));
        //平面加载
        var plane = this.scene.addChild(new Laya.MeshSprite3D(new Laya.PlaneMesh(10, 10, 10, 10)));
        var planeMat = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("res/threeDimen/Physics/grass.png", Laya.Handler.create(null, function (tex) {
            planeMat.albedoTexture = tex;
        }));
        //拉伸UV
        planeMat.tilingOffset = new Laya.Vector4(10, 10, 0, 0);
        //板的画面的渲染材质
        plane.meshRenderer.material = planeMat;
        //给板添加物理碰撞器
        var planeStaticCollider = plane.addComponent(Laya.PhysicsCollider);
        //设置碰撞器
        var planeShape = new Laya.BoxColliderShape(10, 0, 10);
        planeStaticCollider.colliderShape = planeShape;
        planeStaticCollider.friction = 2;
        planeStaticCollider.restitution = 0.3;
        //随机掉落物理物体的脚本
        this.randomAddPhysicsSprite();
    function randomAddPhysicsSprite() {
        Laya.timer.loop(1000, this, this.loopfun);
    };
    function loopfun() {
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
            default:
                break;
        }
    };
    function addBox() {
        //设置BlinnPhong材质
        var mat1 = new Laya.BlinnPhongMaterial();
        //添加漫反射贴图
        Laya.Texture2D.load("res/threeDimen/Physics/rocks.jpg", Laya.Handler.create(null, function (tex) {
            mat1.albedoTexture = tex;
        }));
        var sX = Math.random() * 0.75 + 0.25;
        var sY = Math.random() * 0.75 + 0.25;
        var sZ = Math.random() * 0.75 + 0.25;
        //设置box模型
        var box = this.scene.addChild(new Laya.MeshSprite3D(new Laya.BoxMesh(sX, sY, sZ)));
        //将box的模型赋予材质
        box.meshRenderer.material = mat1;
        //设置掉落位置
        box.transform.position = new Laya.Vector3(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
        //设置旋转角度
        box.transform.rotationEuler = new Laya.Vector3(Math.random() * 360, Math.random() * 360, Math.random() * 360);
        //添加刚体组件
        var rigidBody = box.addComponent(Laya.Rigidbody3D);
        var boxShape = new Laya.BoxColliderShape(sX, sY, sZ);
        rigidBody.colliderShape = boxShape;
        //添加重力加速度
        rigidBody.mass = 10;
    };
    function addSphere() {
        var mat2 = new Laya.BlinnPhongMaterial();
        //
        Laya.Texture2D.load("res/threeDimen/Physics/plywood.jpg", Laya.Handler.create(null, function (tex) {
            mat2.albedoTexture = tex;
        }));
        var radius = Math.random() * 0.2 + 0.2;
        var sphere = this.scene.addChild(new Laya.MeshSprite3D(new Laya.SphereMesh(radius)));
        sphere.meshRenderer.material = mat2;
        sphere.transform.position = new Laya.Vector3(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
        var rigidBody = sphere.addComponent(Laya.Rigidbody3D);
        var sphereShape = new Laya.SphereColliderShape(radius);
        rigidBody.colliderShape = sphereShape;
        rigidBody.mass = 10;
    };
    function addCapsule() {
        var mat3 = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("res/threeDimen/Physics/wood.jpg", Laya.Handler.create(null, function (tex) {
            mat3.albedoTexture = tex;
        }));
        var raidius = Math.random() * 0.2 + 0.2;
        var height = Math.random() * 0.5 + 0.8;
        var capsule = this.scene.addChild(new Laya.MeshSprite3D(new Laya.CapsuleMesh(raidius, height)));
        capsule.meshRenderer.material = mat3;
        capsule.transform.position = new Laya.Vector3(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
        capsule.transform.rotationEuler = new Laya.Vector3(Math.random() * 360, Math.random() * 360, Math.random() * 360);
        var rigidBody = capsule.addComponent(Laya.Rigidbody3D);
        var sphereShape = new Laya.CapsuleColliderShape(raidius, height);
        rigidBody.colliderShape = sphereShape;
        rigidBody.mass = 10;
    };

