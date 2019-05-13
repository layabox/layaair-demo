class PhysicsWorld_BuildingBlocks
{
   
    private scene:Laya.Scene3D;
    private camera: Laya.Camera;
    private ray:Laya.Ray = new Laya.Ray(new Laya.Vector3(0,0,0),new Laya.Vector3(0,0,0));
    private point: Laya.Vector2 = new Laya.Vector2();
    private _outHitResult:Laya.HitResult = new Laya.HitResult();
    private hasSelectedSprite:Laya.Sprite3D;
    private hasSelectedRigidBody:Laya.Rigidbody3D;
    private posX:number;
    private posY:number;
    private delX:number;
    private delY:number;
    private ZERO:Laya.Vector3 = new Laya.Vector3(0,0,0);
    private ONE:Laya.Vector3 = new Laya.Vector3(0,0,0);
    private tmpVector:Laya.Vector3;

    private mat1:Laya.BlinnPhongMaterial; 
    private mesh1:Laya.Mesh;
    private mesh2:Laya.Mesh;
    constructor()
    {
        Laya3D.init(0,0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();

        this.scene =Laya.stage.addChild(new Laya.Scene3D())as Laya.Scene3D;

        this.camera = this.scene.addChild(new Laya.Camera(0,0.1,100)) as Laya.Camera;
        this.camera.transform.translate(new Laya.Vector3(4.5,6,4.5));
        this.camera.transform.rotate(new Laya.Vector3(-30,45,0),true,false);
        this.tmpVector = new Laya.Vector3(0,0,0);

        var directionLight:Laya.DirectionLight = this.scene.addChild(new Laya.DirectionLight()) as Laya.DirectionLight;
        directionLight.color = new Laya.Vector3(1,1,1);
        var mat = directionLight.transform.worldMatrix;
        mat.setForward(new Laya.Vector3(-1.0, -1.0, 1.0));
        directionLight.transform.worldMatrix = mat;

        //资源加载
        this.mat1 = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("res/threeDimen/Physics/plywood.jpg", Laya.Handler.create(this, function(tex:Laya.Texture2D):void {
            this.mat1.albedoTexture = tex;
        }));
        this.mesh1 = Laya.PrimitiveMesh.createBox(0.5, 0.33, 2); 
        this.mesh2 = Laya.PrimitiveMesh.createBox(2, 0.33, 0.5);
        var plane:Laya.MeshSprite3D = this.scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createPlane(13,13,10,10))) as Laya.MeshSprite3D;
        var planeMat:Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();

        Laya.Texture2D.load("res/threeDimen/Physics/wood.jpg", Laya.Handler.create(null, function(tex:Laya.Texture2D):void {
				planeMat.albedoTexture = tex;
		}));
        planeMat.tilingOffset = new Laya.Vector4(2,2,0,0);
        plane.meshRenderer.material = planeMat;
        plane.meshRenderer.receiveShadow = true;
        
        var rigidBody: Laya.PhysicsCollider = plane.addComponent(Laya.PhysicsCollider) as Laya.PhysicsCollider; 
        var boxShape:Laya.BoxColliderShape = new Laya.BoxColliderShape(13,0,13);
        rigidBody.colliderShape = boxShape;
        this.addMouseEvent();
        this.addBox();

    }
 
    public addBox():void
    {
        for (let i:number = 0; i < 8; i++) {
            this.addVerticalBox(-0.65, 0.165 + i * 0.33 * 2, 0);
            this.addVerticalBox(0, 0.165 + i * 0.33 * 2, 0);
            this.addVerticalBox(0.65, 0.165 + i * 0.33 * 2, 0);
            
            this.addHorizontalBox(0, 0.165 + 0.33 + i * 0.33 * 2, -0.65);
            this.addHorizontalBox(0, 0.165 + 0.33 + i * 0.33 * 2, 0);
            this.addHorizontalBox(0, 0.165 + 0.33 + i * 0.33 * 2, 0.65);
        }
    }
    public addVerticalBox(x:number, y:number, z:number):void
    {
        var box:Laya.MeshSprite3D = this.scene.addChild(new Laya.MeshSprite3D(this.mesh1)) as Laya.MeshSprite3D;
        box.meshRenderer.material = this.mat1;
        box.meshRenderer.castShadow = true;
        box.meshRenderer.receiveShadow = true;
        box.transform.position = new Laya.Vector3(x, y, z);
        
        var rigidBody:Laya.Rigidbody3D = box.addComponent(Laya.Rigidbody3D) as Laya.Rigidbody3D;
        rigidBody.mass = 10;
        rigidBody.friction = 0.4;
        rigidBody.restitution = 0.2;
        var boxShape:Laya.BoxColliderShape = new Laya.BoxColliderShape(0.5, 0.33, 2);
        rigidBody.colliderShape = boxShape;
    }
    public addHorizontalBox(x:number, y:number, z:number):void
    {
        var box:Laya.MeshSprite3D = this.scene.addChild(new Laya.MeshSprite3D(this.mesh2)) as Laya.MeshSprite3D;
        box.meshRenderer.material = this.mat1;
        box.meshRenderer.castShadow = true;
        box.meshRenderer.receiveShadow = true;
        this.tmpVector.setValue(x, y, z);
        box.transform.position = this.tmpVector;
        
        var rigidBody:Laya.Rigidbody3D = box.addComponent(Laya.Rigidbody3D) as Laya.Rigidbody3D;
        rigidBody.mass = 10;
        rigidBody.friction = 1.0;
        rigidBody.restitution = 0.2;
        var boxShape:Laya.BoxColliderShape = new Laya.BoxColliderShape(2, 0.33, 0.5);
        rigidBody.colliderShape = boxShape;
    }
    public addMouseEvent():void
    {
        Laya.stage.on(Laya.Event.MOUSE_DOWN,this,this.onMouseDown);
        Laya.stage.on(Laya.Event.MOUSE_UP,this,this.onMouseUp);
        Laya.stage.on(Laya.Event.MOUSE_OUT,this,onmouseout);
    }
    public onMouseDown():void
    {
        this.posX = this.point.x= Laya.MouseManager.instance.mouseX;
        this.posY = this.point.y = Laya.MouseManager.instance.mouseY;
        this.camera.viewportPointToRay(this.point, this.ray);
        this.scene.physicsSimulation.rayCast(this.ray, this._outHitResult);
        if (this._outHitResult.succeeded) {
            var collider:Laya.Rigidbody3D = this._outHitResult.collider as Laya.Rigidbody3D;
            this.hasSelectedSprite = collider.owner as Laya.Sprite3D;
            this.hasSelectedRigidBody = collider;
            collider.angularFactor = this.ZERO;
            collider.angularVelocity = this.ZERO;
            collider.linearFactor = this.ZERO;
            collider.linearVelocity = this.ZERO;
        }
        Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
    }
    public onMouseMove():void
    {
        this.delX = Laya.MouseManager.instance.mouseX - this.posX;
		this.delY = Laya.MouseManager.instance.mouseY - this.posY;
        if (this.hasSelectedSprite) {
            this.tmpVector.setValue(this.delX / 4, 0, this.delY / 4);
            this.hasSelectedRigidBody.linearVelocity = this.tmpVector;
        }
        this.posX = Laya.MouseManager.instance.mouseX;
        this.posY = Laya.MouseManager.instance.mouseY;
    }
    public onMouseUp():void
    {
        Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
        if (this.hasSelectedSprite) {
            this.hasSelectedRigidBody.angularFactor = this.ONE;
            this.hasSelectedRigidBody.linearFactor = this.ONE;
            this.hasSelectedSprite = null;
        }
    }
    public onMouseOut():void
    {
        Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
        if (this.hasSelectedSprite) {
            this.hasSelectedRigidBody.angularFactor = this.ONE;
            this.hasSelectedRigidBody.linearFactor = this.ONE;
            this.hasSelectedSprite = null;
        }
    }

}
new PhysicsWorld_BuildingBlocks;