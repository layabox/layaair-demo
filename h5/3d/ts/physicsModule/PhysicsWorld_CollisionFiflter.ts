class PhysicsWorld_CollisionFiflter
{
    private  plane:Laya.MeshSprite3D;
    private  scene:Laya.Scene3D;
    private  camera:Laya.Camera;
    private  kinematicSphere:Laya.Sprite3D;
    constructor()
    {
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        
        this.scene = Laya.stage.addChild(new Laya.Scene3D()) as Laya.Scene3D;
        
        this.camera = this.scene.addChild(new Laya.Camera(0, 0.1, 100)) as Laya.Camera;
        this.camera.transform.translate(new Laya.Vector3(0, 8, 18));
        this.camera.transform.rotate(new Laya.Vector3(-30, 0, 0), true, false);
        
        this.camera.clearColor = null;
        
        var directionLight:Laya.DirectionLight = this.scene.addChild(new Laya.DirectionLight()) as Laya.DirectionLight;
        directionLight.color = new Laya.Vector3(1, 1, 1);
        directionLight.transform.worldMatrix.setForward(new Laya.Vector3(-1.0, -1.0, 1.0));
        
        this.plane = this.scene.addChild(new Laya.MeshSprite3D(new Laya.PlaneMesh(20, 20, 10, 10))) as Laya.MeshSprite3D;
        var planeMat:Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("../../res/threeDimen/Physics/wood.jpg", Laya.Handler.create(null, function(tex:Laya.Texture2D):void {
            planeMat.albedoTexture = tex;
        }));
        planeMat.tilingOffset = new Laya.Vector4(2, 2, 0, 0);
        this.plane.meshRenderer.material = planeMat;
        
        var staticCollider:Laya.PhysicsCollider = this.plane.addComponent(Laya.PhysicsCollider) as Laya.PhysicsCollider;
        var boxShape:Laya.BoxColliderShape = new Laya.BoxColliderShape(20, 0, 20);
        staticCollider.colliderShape = boxShape;
        
        this.addKinematicSphere();
        for (var i:number = 0; i < 30; i++) {
            this.addBox();
            this.addCapsule();
        }
    }
    public addKinematicSphere():void {
        var mat2:Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("../../res/threeDimen/Physics/plywood.jpg", Laya.Handler.create(null, function(tex:Laya.Texture2D):void {
            mat2.albedoTexture = tex;
        }));
        mat2.albedoColor = new Laya.Vector4(1.0, 0.0, 0.0, 1.0);
        
        var radius:number = 0.8;
        var sphere:Laya.MeshSprite3D = this.scene.addChild(new Laya.MeshSprite3D(new Laya.SphereMesh(radius))) as Laya.MeshSprite3D;
        sphere.meshRenderer.material = mat2;
        sphere.transform.position = new Laya.Vector3(0, 0.8, 0);
        
        var rigidBody:Laya.Rigidbody3D = sphere.addComponent(Laya.Rigidbody3D);
        var sphereShape:Laya.SphereColliderShape = new Laya.SphereColliderShape(radius);
        rigidBody.colliderShape = sphereShape;
        rigidBody.mass = 60;
        rigidBody.isKinematic = true;
        rigidBody.canCollideWith = Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER1;//只与自定义组1碰撞(如果多组采用位操作）
        
        this.kinematicSphere = sphere;
        Laya.timer.frameLoop(1, this, this.onKeyDown);
    }
    
    private onKeyDown():void {
        Laya.KeyBoardManager.hasKeyDown(87) && this.kinematicSphere.transform.translate(new Laya.Vector3(0, 0, -0.2));//W
        Laya.KeyBoardManager.hasKeyDown(83) && this.kinematicSphere.transform.translate(new Laya.Vector3(0, 0, 0.2));//S
        Laya.KeyBoardManager.hasKeyDown(65) && this.kinematicSphere.transform.translate(new Laya.Vector3(-0.2, 0, 0));//A
        Laya.KeyBoardManager.hasKeyDown(68) && this.kinematicSphere.transform.translate(new Laya.Vector3(0.2, 0, 0));//D
        Laya.KeyBoardManager.hasKeyDown(81) && this.plane.transform.translate(new Laya.Vector3(-0.01, 0, 0));;//Q
        Laya.KeyBoardManager.hasKeyDown(69) && this.plane.transform.translate(new Laya.Vector3(0.01, 0, 0));;//E
    }
    
    public addBox():void {
        var mat1:Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("../../res/threeDimen/Physics/rocks.jpg", Laya.Handler.create(null, function(tex:Laya.Texture2D):void {
            mat1.albedoTexture = tex;
        }));
        mat1.albedoColor = new Laya.Vector4(1.0, 1.0, 1.0, 1.0);
        
        var sX:number = Math.random() * 0.75 + 0.25;
        var sY:number = Math.random() * 0.75 + 0.25;
        var sZ:number = Math.random() * 0.75 + 0.25;
        var box:Laya.MeshSprite3D = this.scene.addChild(new Laya.MeshSprite3D(new Laya.BoxMesh(sX, sY, sZ))) as Laya.MeshSprite3D;
        box.meshRenderer.material = mat1;
        box.transform.position = new Laya.Vector3(Math.random() * 16 - 8, sY / 2, Math.random() * 16 - 8);
        box.transform.rotationEuler = new Laya.Vector3(0, Math.random() * 360, 0);
        
        var rigidBody:Laya.Rigidbody3D = box.addComponent(Laya.Rigidbody3D);
        var boxShape:Laya.BoxColliderShape = new Laya.BoxColliderShape(sX, sY, sZ);
        rigidBody.colliderShape = boxShape;
        rigidBody.mass = 10;
        rigidBody.collisionGroup = Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER1;//自定义组1
    }
    
    public addCapsule():void {
        var mat3:Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("../../res/threeDimen/Physics/wood.jpg", Laya.Handler.create(null, function(tex:Laya.Texture2D):void {
            mat3.albedoTexture = tex;
        }));
        
        var raidius:number = Math.random() * 0.2 + 0.2;
        var height:number = Math.random() * 0.5 + 0.8;
        var capsule:Laya.MeshSprite3D = this.scene.addChild(new Laya.MeshSprite3D(new Laya.CapsuleMesh(raidius, height))) as Laya.MeshSprite3D;
        capsule.meshRenderer.material = mat3;
        capsule.transform.position = new Laya.Vector3(Math.random() * 4 - 2, 2, Math.random() * 4 - 2);
        capsule.transform.rotationEuler = new Laya.Vector3(Math.random() * 360, Math.random() * 360, Math.random() * 360);
        
        var rigidBody:Laya.Rigidbody3D = capsule.addComponent(Laya.Rigidbody3D);
        var sphereShape:Laya.CapsuleColliderShape = new Laya.CapsuleColliderShape(raidius, height);
        rigidBody.colliderShape = sphereShape;
        rigidBody.mass = 10;
        rigidBody.collisionGroup = Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER2;//自定义组2,会跳过碰撞
    
    }
}
new PhysicsWorld_CollisionFiflter;