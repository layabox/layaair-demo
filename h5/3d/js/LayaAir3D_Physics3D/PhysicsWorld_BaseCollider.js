class PhysicsWorldBaseCollider{
    constructor(){
        //初始化引擎
        Laya3D.init(0, 0);
        //设置画布模式
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        this.tmpVector = new Laya.Vector3(0, 0, 0);
        this.scene = Laya.stage.addChild(new Laya.Scene3D());
        //初始化照相机
        let camera = this.scene.addChild(new Laya.Camera(0, 0.1, 100));
        camera.transform.translate(new Laya.Vector3(0, 6, 9.5));
        camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
        camera.addComponent(CameraMoveScript);
        camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SOLIDCOLOR;
        //方向光
        let directionLight = this.scene.addChild(new Laya.DirectionLight());
        directionLight.diffuseColor = new Laya.Vector3(0.6, 0.6, 0.6);
        let mat = directionLight.transform.worldMatrix;
        mat.setForward(new Laya.Vector3(-1.0, -1.0, -1.0));
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


        //平面加载
        let plane = this.scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createPlane(10, 10, 10, 10)));
        let planeMat = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("res/threeDimen/Physics/grass.png", Laya.Handler.create(null, function (tex) {
            planeMat.albedoTexture = tex;
        }));
        //拉伸UV
        planeMat.tilingOffset = new Laya.Vector4(10, 10, 0, 0);
        //板的画面的渲染材质
        plane.meshRenderer.material = planeMat;
        //给板添加物理碰撞器
        let planeStaticCollider = plane.addComponent(Laya.PhysicsCollider);
        //设置碰撞器
        let planeShape = new Laya.BoxColliderShape(10, 0, 10);
        planeStaticCollider.colliderShape = planeShape;
        planeStaticCollider.friction = 2;
        planeStaticCollider.restitution = 0.3;
        //随机掉落物理物体的脚本
        this.randomAddPhysicsSprite();
    }

    randomAddPhysicsSprite(){
        Laya.timer.loop(1000, this, this.loopfun);
    }

    loopfun(){
        let random = Math.floor(Math.random() * 5) % 5;
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
            case 3:
                this.addCone();
                break;
            case 4:
                this.addCylinder();
                break;  
            default:
                break;
        }
    }
    //添加box
    addBox(){
        let sX = Math.random() * 0.75 + 0.25;
        let sY = Math.random() * 0.75 + 0.25;
        let sZ = Math.random() * 0.75 + 0.25;
        //设置box模型
        let box = this.scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(sX, sY, sZ)));
        //将box的模型赋予材质
        box.meshRenderer.material = this.mat1;
        //设置掉落位置
        this.tmpVector.setValue(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
        box.transform.position = this.tmpVector;
        //设置旋转角度
        this.tmpVector.setValue(Math.random() * 360, Math.random() * 360, Math.random() * 360);
        box.transform.rotationEuler = this.tmpVector;
        //添加刚体组件
        let rigidBody = box.addComponent(Laya.Rigidbody3D);
        let boxShape = new Laya.BoxColliderShape(sX, sY, sZ);
        rigidBody.colliderShape = boxShape;
        //添加重力加速度
        rigidBody.mass = 10;
    }
    //添加球体
    addSphere(){
        let radius = Math.random() * 0.2 + 0.2;
        let sphere = this.scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createSphere(radius)));
        sphere.meshRenderer.material = this.mat2;
        this.tmpVector.setValue(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
        sphere.transform.position = this.tmpVector;
        let rigidBody = sphere.addComponent(Laya.Rigidbody3D);
        let sphereShape = new Laya.SphereColliderShape(radius);
        rigidBody.colliderShape = sphereShape;
        rigidBody.mass = 10;
    }
    //添加胶囊
    addCapsule(){
        let raidius = Math.random() * 0.2 + 0.2;
        let height = Math.random() * 0.5 + 0.8;
        let capsule = this.scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCapsule(raidius, height)));
        capsule.meshRenderer.material = this.mat3;
        this.tmpVector.setValue(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
        capsule.transform.position = this.tmpVector;
        this.tmpVector.setValue(Math.random() * 360, Math.random() * 360, Math.random() * 360);
        capsule.transform.rotationEuler = this.tmpVector;
        let rigidBody = capsule.addComponent(Laya.Rigidbody3D);
        let sphereShape = new Laya.CapsuleColliderShape(raidius, height);
        rigidBody.colliderShape = sphereShape;
        rigidBody.mass = 10;
    }
    addCone() {
        let raidius = Math.random() * 0.2 + 0.2;
        let height = Math.random() * 0.5 + 0.8;
        //创建圆锥MeshSprite3D
        let cone = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCone(raidius, height));
        this.scene.addChild(cone);
        //设置材质
        cone.meshRenderer.material = this.mat4;
        //设置位置
        this.tmpVector.setValue(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
        cone.transform.position = this.tmpVector;
        //创建刚体碰撞器
        let rigidBody = cone.addComponent(Laya.Rigidbody3D);
        //创建球型碰撞器
        let coneShape = new Laya.ConeColliderShape(raidius, height);
        //设置刚体碰撞器的形状
        rigidBody.colliderShape = coneShape;
        //设置刚体碰撞器的质量
        rigidBody.mass = 10;	
    }
    addCylinder() {
        let raidius = Math.random() * 0.2 + 0.2;
        let height = Math.random() * 0.5 + 0.8;
        //创建圆锥MeshSprite3D
        let cylinder = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCylinder(raidius, height));
        this.scene.addChild(cylinder);
        //设置材质
        cylinder.meshRenderer.material = this.mat5;
        //设置位置
        this.tmpVector.setValue(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
        cylinder.transform.position = this.tmpVector;
        //设置圆柱MeshSprite3D的欧拉角
        this.tmpVector.setValue(Math.random() * 360, Math.random() * 360, Math.random() * 360);
        cylinder.transform.rotationEuler = this.tmpVector;
        //创建刚体碰撞器
        let rigidBody = cylinder.addComponent(Laya.Rigidbody3D);
        //创建球型碰撞器
        let cylinderShape = new Laya.CylinderColliderShape(raidius, height);
        //设置刚体碰撞器的形状
        rigidBody.colliderShape = cylinderShape;
        //设置刚体碰撞器的质量
        rigidBody.mass = 10;
    }

}


//激活启动类
new PhysicsWorldBaseCollider();



