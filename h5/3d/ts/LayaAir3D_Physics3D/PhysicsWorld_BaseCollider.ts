import CameraMoveScript from "./common/CameraMoveScript"
class PhysicsWorld_BaseCollider
{
    private scene:Laya.Scene3D;
    private tmpVector:Laya.Vector3;

    private mat1:Laya.BlinnPhongMaterial;
    private mat2:Laya.BlinnPhongMaterial;
    private mat3:Laya.BlinnPhongMaterial;
    private mat4:Laya.BlinnPhongMaterial;
    private mat5:Laya.BlinnPhongMaterial;
    constructor()
    {
        //初始化引擎
        Laya3D.init(0,0);
        //设置画布模式
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();

        this.scene =Laya.stage.addChild(new Laya.Scene3D())as Laya.Scene3D;

        //初始化照相机
        var camera : Laya.Camera = this.scene.addChild(new Laya.Camera(0,0.1,100))as Laya.Camera;
        camera.transform.translate(new Laya.Vector3(0,6,9.5));
        camera.transform.rotate(new Laya.Vector3(-15,0,0),true,false);
        camera.addComponent(CameraMoveScript);
        this.tmpVector = new Laya.Vector3(0,0,0);
        //方向光
        var directionlight:Laya.DirectionLight = this.scene.addChild(new Laya.DirectionLight())as Laya.DirectionLight;
        directionlight.diffuseColor = new Laya.Vector3(0.6,0.6,0.6);
        //矩阵前向量变成了-1.0，-1.0，-1.0
        //不清楚是否识别01
        var mat = directionlight.transform.worldMatrix;
        mat.setForward(new Laya.Vector3(-1.0, -1.0, -1.0));
        directionlight.transform.worldMatrix = mat;

        //初始化资源
        this.mat1 = new Laya.BlinnPhongMaterial();
        this.mat2 = new Laya.BlinnPhongMaterial();
        this.mat3 = new Laya.BlinnPhongMaterial();
        this.mat4 = new Laya.BlinnPhongMaterial();
        this.mat5 = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("res/threeDimen/Physics/rocks.jpg", Laya.Handler.create(this, function(tex:Laya.Texture2D):void {
            this.mat1.albedoTexture = tex;
        }));
        this.mat1.albedoColor = new Laya.Vector4(1.0, 1.0, 1.0, 1.0);
        Laya.Texture2D.load("res/threeDimen/Physics/wood.jpg", Laya.Handler.create(this, function(tex:Laya.Texture2D):void {
            this.mat3.albedoTexture = tex;
        }));
        Laya.Texture2D.load("res/threeDimen/Physics/plywood.jpg", Laya.Handler.create(this, function (tex) {
            this.mat2.albedoTexture = tex;
        }));
        Laya.Texture2D.load("res/threeDimen/Physics/steel2.jpg", Laya.Handler.create(this, function(tex) {
            this.mat4.albedoTexture = tex;
        }));
        Laya.Texture2D.load("res/threeDimen/Physics/steel.jpg", Laya.Handler.create(this, function(tex) {
            this.mat5.albedoTexture = tex;
        }));

        //平面加载
        var plane : Laya.MeshSprite3D = this.scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createPlane(10,10,10,10))) as Laya.MeshSprite3D;
        var planeMat: Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("res/threeDimen/Physics/grass.png", Laya.Handler.create(null, function(tex:Laya.Texture2D):void {
            planeMat.albedoTexture = tex;
        }));
        //拉伸UV
        planeMat.tilingOffset = new Laya.Vector4(10,10,0,0);
        //板的画面的渲染材质
        plane.meshRenderer.material = planeMat;
        //给板添加物理碰撞器

        var planeStaticCollider : Laya.PhysicsCollider = plane.addComponent(Laya.PhysicsCollider);
        //设置碰撞器
        var planeShape : Laya.BoxColliderShape = new Laya.BoxColliderShape(10,0,10);
        planeStaticCollider.colliderShape = planeShape;
        planeStaticCollider.friction = 2;
        planeStaticCollider.restitution = 0.3;
        //随机掉落物理物体的脚本
        this.randomAddPhysicsSprite();    
    }
    public randomAddPhysicsSprite() : void
    {
        Laya.timer.loop(1000,this,this.loopfun);
        
    }
    private loopfun():void
    {
        var random : Number = Math.floor(Math.random()*3)%3;
        switch(random)
        {
            case 0:
                this.addBox();
                break;
            case 1:
                this.addSphere();
                break;
            case 2:
                this.addCapsule();
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
    private addBox():void
    {
        var sX:number = Math.random()*0.75+0.25;
        var sY:number = Math.random()*0.75+0.25;
        var sZ:number = Math.random()*0.75+0.25;
        //设置box模型
        var box:Laya.MeshSprite3D = this.scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(sX,sY,sZ)))as Laya.MeshSprite3D;
        //将box的模型赋予材质
        box.meshRenderer.material = this.mat1;
        //设置掉落位置
        this.tmpVector.setValue(Math.random()*4-2,10,Math.random()*4-2);
        box.transform.position = this.tmpVector;
        //设置旋转角度
        this.tmpVector.setValue(Math.random()*360,Math.random()*360,Math.random()*360);
        box.transform.rotationEuler = this.tmpVector;
        //添加刚体组件
        var rigidBody:Laya.Rigidbody3D = box.addComponent(Laya.Rigidbody3D);
        var boxShape: Laya.BoxColliderShape = new Laya.BoxColliderShape(sX,sY,sZ);
        rigidBody.colliderShape = boxShape;
        //添加重力加速度
        rigidBody.mass = 10;
    }
    private addSphere():void
    {
        var radius:number = Math.random() * 0.2 + 0.2;
        var sphere: Laya.MeshSprite3D = this.scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createSphere(radius))) as Laya.MeshSprite3D;
        sphere.meshRenderer.material = this.mat2;
        this.tmpVector.setValue(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
        sphere.transform.position = this.tmpVector;
        
        var rigidBody:Laya.Rigidbody3D = sphere.addComponent(Laya.Rigidbody3D);
        var sphereShape:Laya.SphereColliderShape = new Laya.SphereColliderShape(radius);
        rigidBody.colliderShape = sphereShape;
        rigidBody.mass = 10;

    }
    private addCapsule():void
    {
        var raidius:number = Math.random() * 0.2 + 0.2;
        var height:number = Math.random() * 0.5 + 0.8;
        var capsule:Laya.MeshSprite3D = this.scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCapsule(raidius, height))) as Laya.MeshSprite3D;
        capsule.meshRenderer.material = this.mat3;
        this.tmpVector.setValue(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
        capsule.transform.position = this.tmpVector;
        this.tmpVector.setValue(Math.random() * 360, Math.random() * 360, Math.random() * 360);
        capsule.transform.rotationEuler = this.tmpVector;
        
        var rigidBody:Laya.Rigidbody3D = capsule.addComponent(Laya.Rigidbody3D);
        var sphereShape:Laya.CapsuleColliderShape = new Laya.CapsuleColliderShape(raidius, height);
        rigidBody.colliderShape = sphereShape;
        rigidBody.mass = 10;

    }
    private addCone():void {
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
    private addCylinder():void {
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
new PhysicsWorld_BaseCollider;