class PhysicsWorld_MeshCollider
{
    private scene:Scene3D;
    constructor()
    {
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode =  Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        
        this.scene = Laya.stage.addChild(new Laya.Scene3D()) as Laya.Scene3D;
        
        //初始化照相机
        var camera:Laya.Camera = this.scene.addChild(new Laya.Camera(0, 0.1, 100)) as Laya.Camera;
        camera.transform.translate(new Laya.Vector3(0, 6, 9.5));
        camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
        camera.addComponent(CameraMoveScript);
        camera.clearColor = null;
        
        //方向光
        var directionLight:Laya.DirectionLight = this.scene.addChild(new Laya.DirectionLight()) as Laya.DirectionLight;
        directionLight.transform.worldMatrix.setForward(new Laya.Vector3(0.0, -0.8, -1.0));
        directionLight.color = new Laya.Vector3(1, 1, 1);
        
        Laya.loader.create(["../../res/threeDimen/staticModel/lizard/Assets/Lizard/lizard-lizard_geo.lm", "../../res/threeDimen/staticModel/lizard/Assets/Lizard/lizard_diff.png", "../../res/threeDimen/staticModel/lizard/Assets/Lizard/lizard_norm.png"], Laya.Handler.create(this, this.complete));      
    }

    public complete():void {
        var mesh:Laya.Mesh = Laya.Loader.getRes("../../res/threeDimen/staticModel/lizard/Assets/Lizard/lizard-lizard_geo.lm");
        var albedo:Laya.Texture2D = Laya.Loader.getRes("../../res/threeDimen/staticModel/lizard/Assets/Lizard/lizard_diff.png");
        var normal:Laya.Texture2D = Laya.Loader.getRes("../../res/threeDimen/staticModel/lizard/Assets/Lizard/lizard_norm.png");
        var mat:Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
        mat.specularColor = new Laya.Vector4(0.5,0.5,0.5,0.5);
        mat.albedoTexture = albedo;
        mat.normalTexture = normal;
        
        var lizard:Laya.MeshSprite3D = this.scene.addChild(new Laya.MeshSprite3D(mesh)) as Laya.MeshSprite3D;
        lizard.transform.localPosition = new Laya.Vector3(-2, 0, 0);
        lizard.transform.localScale = new Laya.Vector3(0.01, 0.01, 0.01);
        lizard.meshRenderer.material = mat;
        var lizardCollider:Laya.PhysicsCollider = lizard.addComponent(Laya.PhysicsCollider);
        var meshShape:Laya.MeshColliderShape = new Laya.MeshColliderShape();
        meshShape.mesh = mesh;
        lizardCollider.colliderShape = meshShape;
        lizardCollider.friction = 2;
        lizardCollider.restitution = 0.3;
        
        var lizard1:Laya.MeshSprite3D = this.scene.addChild(new Laya.MeshSprite3D(mesh)) as Laya.MeshSprite3D;
        lizard1.transform.localPosition = new Laya.Vector3(3, 0, 0);
        lizard1.transform.localRotationEuler = new Laya.Vector3(0, 80, 0);
        lizard1.transform.localScale = new Laya.Vector3(0.01, 0.01, 0.01);
        lizard1.meshRenderer.material = mat;
        var lizardCollider1:Laya.PhysicsCollider = lizard1.addComponent(Laya.PhysicsCollider);
        var meshShape1:Laya.MeshColliderShape = new Laya.MeshColliderShape();
        meshShape1.mesh = mesh;
        lizardCollider1.colliderShape = meshShape1;
        lizardCollider1.friction = 2;
        lizardCollider1.restitution = 0.3;
        
        this.randomAddPhysicsSprite();
    }
    
    public randomAddPhysicsSprite():void {
        Laya.timer.loop(1000, this, function():void {
            var random:number = Math.floor(Math.random() * 3) % 3;
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
    
    public addBox():void {
        var mat1:Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("../../res/threeDimen/Physics/rocks.jpg", Laya.Handler.create(this, function(tex:Laya.exture2D):void {
            mat1.albedoTexture = tex;
        }));
        
        var sX:number = Math.random() * 0.75 + 0.25;
        var sY:number = Math.random() * 0.75 + 0.25;
        var sZ:number = Math.random() * 0.75 + 0.25;
        var box:Laya.MeshSprite3D = this.scene.addChild(new Laya.MeshSprite3D(new Laya.PrimitiveMesh.createBox(sX, sY, sZ))) as Laya.MeshSprite3D;
        box.meshRenderer.material = mat1;
        box.transform.position = new Laya.Vector3(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
        box.transform.rotationEuler = new Laya.Vector3(Math.random() * 360, Math.random() * 360, Math.random() * 360);
        
        var rigidBody:Laya.Rigidbody3D = box.addComponent(Laya.Rigidbody3D);
        var boxShape:Laya.BoxColliderShape = new Laya.BoxColliderShape(sX, sY, sZ);
        rigidBody.colliderShape = boxShape;
        rigidBody.mass = 10;
    }
    
    public addSphere():void {
        var mat2:Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("../../res/threeDimen/Physics/plywood.jpg", Laya.Handler.create(this, function(tex:Laya.Texture2D):void {
            mat2.albedoTexture = tex;
        }));
        
        var radius:number = Math.random() * 0.2 + 0.2;
        var sphere:Laya.MeshSprite3D = this.scene.addChild(new Laya.MeshSprite3D(new Laya.PrimitiveMesh.createSphere(radius))) as Laya.MeshSprite3D;
        sphere.meshRenderer.material = mat2;
        sphere.transform.position = new Laya.Vector3(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
        
        var rigidBody:Laya.Rigidbody3D = sphere.addComponent(Laya.Rigidbody3D);
        var sphereShape:Laya.SphereColliderShape = new Laya.SphereColliderShape(radius);
        rigidBody.colliderShape = sphereShape;
        rigidBody.mass = 10;
    }
    
    public addCapsule():void {
        var mat3:Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("../../res/threeDimen/Physics/wood.jpg", Laya.Handler.create(this, function(tex:Laya.Texture2D):void {
            mat3.albedoTexture = tex;
        }));
        
        var raidius:number = Math.random() * 0.2 + 0.2;
        var height:number = Math.random() * 0.5 + 0.8;
        var capsule:Laya.MeshSprite3D = this.scene.addChild(new Laya.MeshSprite3D(new Laya.PrimitiveMesh.createCapsule(raidius, height))) as Laya.MeshSprite3D;
        capsule.meshRenderer.material = mat3;
        capsule.transform.position = new Laya.Vector3(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
        capsule.transform.rotationEuler = new Laya.Vector3(Math.random() * 360, Math.random() * 360, Math.random() * 360);
        
        var rigidBody:Laya.Rigidbody3D = capsule.addComponent(Laya.Rigidbody3D);
        var sphereShape:Laya.CapsuleColliderShape = new Laya.CapsuleColliderShape(raidius, height);
        rigidBody.colliderShape = sphereShape;
        rigidBody.mass = 10;
    }


}
new PhysicsWorld_MeshCollider;