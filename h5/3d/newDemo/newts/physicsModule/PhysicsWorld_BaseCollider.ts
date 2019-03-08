import CameraMoveScript from "./common/CameraMoveScript"
class PhysicsWorld_BaseCollider
{
    //as的写法是var+名字+冒号加类名，在ts中不添加类名
    //上面这个是as写法 private var scene :Scene3D
    private scene:Laya.Scene3D;
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
        //camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SOLIDCOLOR;
        camera.clearColor = null;

        //方向光
        var directionlight:Laya.DirectionLight = this.scene.addChild(new Laya.DirectionLight())as Laya.DirectionLight;
        directionlight.diffuseColor = new Laya.Vector3(0.6,0.6,0.6);
        //矩阵前向量变成了-1.0，-1.0，-1.0
        //不清楚是否识别01
        directionlight.transform.worldMatrix.setForward(new Laya.Vector3(-1.0,-1.0,-1.0));
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
            default:
                break;
        }
    }
    public addBox():void
    {
        //设置BlinnPhong材质
        var mat1: Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
        //添加漫反射贴图
        Laya.Texture2D.load("res/threeDimen/Physics/rocks.jpg", Laya.Handler.create(null, function(tex:Laya.Texture2D):void {
            mat1.albedoTexture = tex;
        }));
        var sX:number = Math.random()*0.75+0.25;
        var sY:number = Math.random()*0.75+0.25;
        var sZ:number = Math.random()*0.75+0.25;
        //设置box模型
        var box:Laya.MeshSprite3D = this.scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(sX,sY,sZ)))as Laya.MeshSprite3D;
        //将box的模型赋予材质
        box.meshRenderer.material = mat1;
        //设置掉落位置
        box.transform.position = new Laya.Vector3(Math.random()*4-2,10,Math.random()*4-2);
        //设置旋转角度
        box.transform.rotationEuler = new Laya.Vector3(Math.random()*360,Math.random()*360,Math.random()*360);
        //添加刚体组件
        var rigidBody:Laya.Rigidbody3D = box.addComponent(Laya.Rigidbody3D);
        var boxShape: Laya.BoxColliderShape = new Laya.BoxColliderShape(sX,sY,sZ);
        rigidBody.colliderShape = boxShape;
        //添加重力加速度
        rigidBody.mass = 10;
    }
    public addSphere():void
    {
        var mat2:Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
        //
        Laya.Texture2D.load("res/threeDimen/Physics/plywood.jpg", Laya.Handler.create(null, function(tex:Laya.Texture2D):void {
            mat2.albedoTexture = tex;
        }));
        var radius:number = Math.random() * 0.2 + 0.2;
        var sphere: Laya.MeshSprite3D = this.scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createSphere(radius))) as Laya.MeshSprite3D;
        sphere.meshRenderer.material = mat2;
        sphere.transform.position = new Laya.Vector3(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
        
        var rigidBody:Laya.Rigidbody3D = sphere.addComponent(Laya.Rigidbody3D);
        var sphereShape:Laya.SphereColliderShape = new Laya.SphereColliderShape(radius);
        rigidBody.colliderShape = sphereShape;
        rigidBody.mass = 10;

    }
    public addCapsule():void
    {
        var mat3:Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("res/threeDimen/Physics/wood.jpg", Laya.Handler.create(null, function(tex:Laya.Texture2D):void {
            mat3.albedoTexture = tex;
        }));
        
        var raidius:number = Math.random() * 0.2 + 0.2;
        var height:number = Math.random() * 0.5 + 0.8;
        var capsule:Laya.MeshSprite3D = this.scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCapsule(raidius, height))) as Laya.MeshSprite3D;
        capsule.meshRenderer.material = mat3;
        capsule.transform.position = new Laya.Vector3(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
        capsule.transform.rotationEuler = new Laya.Vector3(Math.random() * 360, Math.random() * 360, Math.random() * 360);
        
        var rigidBody:Laya.Rigidbody3D = capsule.addComponent(Laya.Rigidbody3D);
        var sphereShape:Laya.CapsuleColliderShape = new Laya.CapsuleColliderShape(raidius, height);
        rigidBody.colliderShape = sphereShape;
        rigidBody.mass = 10;

    }
}
new PhysicsWorld_BaseCollider;