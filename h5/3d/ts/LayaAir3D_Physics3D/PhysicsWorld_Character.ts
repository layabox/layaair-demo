class PhysicsWorld_Character
{
    private scene:Laya.Scene3D;
	private camera:Laya.Camera;
    private kinematicSphere:Laya.Sprite3D;
    private translateW:Laya.Vector3 = new Laya.Vector3(0, 0, -0.2);
	private translateS:Laya.Vector3 = new Laya.Vector3(0, 0, 0.2);
	private translateA:Laya.Vector3 = new Laya.Vector3(-0.2, 0, 0);
    private translateD:Laya.Vector3 = new Laya.Vector3(0.2, 0, 0);
    
    private mat1:Laya.BlinnPhongMaterial;
    private mat3:Laya.BlinnPhongMaterial;
    constructor()
    {
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        
        this.scene = Laya.stage.addChild(new Laya.Scene3D()) as Laya.Scene3D;
        
        this.camera = this.scene.addChild(new Laya.Camera(0, 0.1, 100)) as Laya.Camera;
        this.camera.transform.translate(new Laya.Vector3(0, 8, 20));
        this.camera.transform.rotate(new Laya.Vector3(-30, 0, 0), true, false);
        //this.camera.clearColor = null;
        
        var directionLight:Laya.DirectionLight = this.scene.addChild(new Laya.DirectionLight()) as Laya.DirectionLight;
        directionLight.color = new Laya.Vector3(1, 1, 1);
        var mat = directionLight.transform.worldMatrix;
        mat.setForward(new Laya.Vector3(-1.0, -1.0, 1.0));
        directionLight.transform.worldMatrix = mat;
        this.mat1 = new Laya.BlinnPhongMaterial();
        this.mat3 = new Laya.BlinnPhongMaterial();
        //加载资源
        Laya.Texture2D.load("res/threeDimen/Physics/rocks.jpg", Laya.Handler.create(this, function(tex:Laya.Texture2D):void {
            this.mat1.albedoTexture = tex;
        }));
        Laya.Texture2D.load("res/threeDimen/Physics/wood.jpg", Laya.Handler.create(this, function(tex:Laya.Texture2D):void {
            this.mat3.albedoTexture = tex;
        }));
        
        var plane:Laya.MeshSprite3D = this.scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createPlane(20, 20, 10, 10))) as Laya.MeshSprite3D;
        var planeMat:Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("res/threeDimen/Physics/wood.jpg", Laya.Handler.create(null, function(tex:Laya.Texture2D):void {
            planeMat.albedoTexture = tex;
        }));
        planeMat.tilingOffset = new Laya.Vector4(2, 2, 0, 0);
        plane.meshRenderer.material = planeMat;
        
        var rigidBody:Laya.PhysicsCollider = plane.addComponent(Laya.PhysicsCollider) as Laya.PhysicsCollider;
        var boxShape:Laya.BoxColliderShape = new Laya.BoxColliderShape(20, 0, 20);
        rigidBody.colliderShape = boxShape;
        
        for (var i:number = 0; i < 60; i++) {
            this.addBox();
            this.addCapsule();
        }
        
        this.addCharacter();
    }
    public addCharacter():void {
       
        Laya.Sprite3D.load("res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", Laya.Handler.create(this, function(monkey:Laya.Sprite3D):void {
            this.scene.addChild(monkey);
            monkey.transform.localScale = new Laya.Vector3(1, 1, 1);
            var character:Laya.CharacterController = monkey.addComponent(Laya.CharacterController);
            var sphereShape:Laya.CapsuleColliderShape = new Laya.CapsuleColliderShape(1.0, 3.4);
            sphereShape.localOffset = new Laya.Vector3(0, 1.7, 0);
            character.colliderShape = sphereShape;
            this.kinematicSphere = monkey;
            Laya.timer.frameLoop(1, this, this.onKeyDown);
        }))
    
    }
    
    private onKeyDown():void {
        var character:Laya.CharacterController = this.kinematicSphere.getComponent(Laya.CharacterController) as Laya.CharacterController;
        Laya.KeyBoardManager.hasKeyDown(87) && character.move(this.translateW);//W
        Laya.KeyBoardManager.hasKeyDown(83) && character.move(this.translateS);//S
        Laya.KeyBoardManager.hasKeyDown(65) && character.move(this.translateA);//A
        Laya.KeyBoardManager.hasKeyDown(68) && character.move(this.translateD);//D
        Laya.KeyBoardManager.hasKeyDown(69) && character.jump();//E
    }
    
    public addBox():void {
        var sX:number = Math.random() * 0.75 + 0.25;
        var sY:number = Math.random() * 0.75 + 0.25;
        var sZ:number = Math.random() * 0.75 + 0.25;
        var box:Laya.MeshSprite3D = this.scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(sX, sY, sZ))) as Laya.MeshSprite3D;
        box.meshRenderer.material = this.mat1;
        box.transform.position = new Laya.Vector3(Math.random() * 4 - 2, 2, Math.random() * 4 - 2);
        box.transform.rotationEuler = new Laya.Vector3(Math.random() * 360, Math.random() * 360, Math.random() * 360);
        
        var rigidBody:Laya.Rigidbody3D = box.addComponent(Laya.Rigidbody3D);
        var boxShape:Laya.BoxColliderShape = new Laya.BoxColliderShape(sX, sY, sZ);
        rigidBody.colliderShape = boxShape;
        rigidBody.mass = 10;
    }
    
    public addCapsule():void {
        var raidius:number = Math.random() * 0.2 + 0.2;
        var height:number = Math.random() * 0.5 + 0.8;
        var capsule:Laya.MeshSprite3D = this.scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCapsule(raidius, height))) as Laya.MeshSprite3D;
        capsule.meshRenderer.material = this.mat3;
        capsule.transform.position = new Laya.Vector3(Math.random() * 4 - 2, 2, Math.random() * 4 - 2);
        capsule.transform.rotationEuler = new Laya.Vector3(Math.random() * 360, Math.random() * 360, Math.random() * 360);
        
        var rigidBody:Laya.Rigidbody3D = capsule.addComponent(Laya.Rigidbody3D);
        var sphereShape:Laya.CapsuleColliderShape = new Laya.CapsuleColliderShape(raidius, height);
        rigidBody.colliderShape = sphereShape;
        rigidBody.mass = 10;
    }
}
new PhysicsWorld_Character;