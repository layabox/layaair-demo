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
        var camera = this.scene.addChild(new Laya.Camera(0, 0.1, 100));
        camera.transform.translate(new Laya.Vector3(0, 6, 9.5));
        camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
        camera.addComponent(CameraMoveScript);
        camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SOLIDCOLOR;
        //使用默认颜色
        //camera.clearColor = null;
        //方向光
        var directionlight = this.scene.addChild(new Laya.DirectionLight());
        directionlight.diffuseColor = new Laya.Vector3(0.6, 0.6, 0.6);
        var mat = directionLight.transform.worldMatrix;
        mat.setForward(new Laya.Vector3(-1.0, -1.0, -1.0));
        directionLight.transform.worldMatrix = mat;
        //平面加载
        var plane = this.scene.addChild(new Laya.MeshSprite3D(new Laya.PrimitiveMesh.createPlane(10, 10, 10, 10)));
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
    }

    randomAddPhysicsSprite(){
        Laya.timer.loop(1000, this, this.loopfun);
    }

    loopfun(){
        var random = Math.floor(Math.random() * 5) % 5;
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
        var box = this.scene.addChild(new Laya.MeshSprite3D(new Laya.PrimitiveMesh.createBox(sX, sY, sZ)));
        //将box的模型赋予材质
        box.meshRenderer.material = mat1;
        //设置掉落位置
        this.tmpVector.setValue(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
        box.transform.position = this.tmpVector;
        //设置旋转角度
        this.tmpVector.setValue(Math.random() * 360, Math.random() * 360, Math.random() * 360);
        box.transform.rotationEuler = this.tmpVector;
        //添加刚体组件
        var rigidBody = box.addComponent(Laya.Rigidbody3D);
        var boxShape = new Laya.BoxColliderShape(sX, sY, sZ);
        rigidBody.colliderShape = boxShape;
        //添加重力加速度
        rigidBody.mass = 10;
    }
    //添加球体
    addSphere(){
        var mat2 = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("res/threeDimen/Physics/plywood.jpg", Laya.Handler.create(null, function (tex) {
            mat2.albedoTexture = tex;
        }));
        var radius = Math.random() * 0.2 + 0.2;
        var sphere = this.scene.addChild(new Laya.MeshSprite3D(new Laya.PrimitiveMesh.createSphere(radius)));
        sphere.meshRenderer.material = mat2;
        this.tmpVector.setValue(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
        sphere.transform.position = this.tmpVector;
        var rigidBody = sphere.addComponent(Laya.Rigidbody3D);
        var sphereShape = new Laya.SphereColliderShape(radius);
        rigidBody.colliderShape = sphereShape;
        rigidBody.mass = 10;
    }
    //添加胶囊
    addCapsule(){
        var mat3 = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("res/threeDimen/Physics/wood.jpg", Laya.Handler.create(null, function (tex) {
            mat3.albedoTexture = tex;
        }));
        var raidius = Math.random() * 0.2 + 0.2;
        var height = Math.random() * 0.5 + 0.8;
        var capsule = this.scene.addChild(new Laya.MeshSprite3D(new Laya.PrimitiveMesh.createCapsule(raidius, height)));
        capsule.meshRenderer.material = mat3;
        this.tmpVector.setValue(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
        capsule.transform.position = this.tmpVector;
        this.tmpVector.setValue(Math.random() * 360, Math.random() * 360, Math.random() * 360);
        capsule.transform.rotationEuler = this.tmpVector;
        var rigidBody = capsule.addComponent(Laya.Rigidbody3D);
        var sphereShape = new Laya.CapsuleColliderShape(raidius, height);
        rigidBody.colliderShape = sphereShape;
        rigidBody.mass = 10;
    }
    addCone() {
        var mat4 = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("res/threeDimen/Physics/steel2.jpg", Laya.Handler.create(this, function(tex) {
            mat4.albedoTexture = tex;
        }));
        var raidius = Math.random() * 0.2 + 0.2;
        var height = Math.random() * 0.5 + 0.8;
        //创建圆锥MeshSprite3D
        var cone = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCone(raidius, height));
        this.scene.addChild(cone);
        //设置材质
        cone.meshRenderer.material = mat4;
        //设置位置
        this.tmpVector.setValue(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
        cone.transform.position = this.tmpVector;
        //创建刚体碰撞器
        var rigidBody = cone.addComponent(Laya.Rigidbody3D);
        //创建球型碰撞器
        var coneShape = new Laya.ConeColliderShape(raidius, height);
        //设置刚体碰撞器的形状
        rigidBody.colliderShape = coneShape;
        //设置刚体碰撞器的质量
        rigidBody.mass = 10;	
    }
    addCylinder() {
        var mat5 = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("res/threeDimen/Physics/steel.jpg", Laya.Handler.create(this, function(tex) {
            mat5.albedoTexture = tex;
        }));
        var raidius = Math.random() * 0.2 + 0.2;
        var height = Math.random() * 0.5 + 0.8;
        //创建圆锥MeshSprite3D
        var cylinder = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCylinder(raidius, height));
        this.scene.addChild(cylinder);
        //设置材质
        cylinder.meshRenderer.material = mat5;
        //设置位置
        this.tmpVector.setValue(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
        cylinder.transform.position = this.tmpVector;
        //设置圆柱MeshSprite3D的欧拉角
        this.tmpVector.setValue(Math.random() * 360, Math.random() * 360, Math.random() * 360);
        cylinder.transform.rotationEuler = this.tmpVector;
        //创建刚体碰撞器
        var rigidBody = cylinder.addComponent(Laya.Rigidbody3D);
        //创建球型碰撞器
        var cylinderShape = new Laya.CylinderColliderShape(raidius, height);
        //设置刚体碰撞器的形状
        rigidBody.colliderShape = cylinderShape;
        //设置刚体碰撞器的质量
        rigidBody.mass = 10;
    }

}


//激活启动类
new PhysicsWorldBaseCollider();



