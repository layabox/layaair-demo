class PhysicsWorld_CompoundCollider
{
    private  scene:Laya.Scene3D;
	private  camera:Laya.Camera;
    constructor()
    {
            Laya3D.init(0, 0);
			Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
			Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
			Laya.Stat.show();
			
			this.scene = Laya.stage.addChild(new Laya.Scene3D()) as Laya.Scene3D;
			
			this.camera = this.scene.addChild(new Laya.Camera(0, 0.1, 100)) as Laya.Camera;
			this.camera.transform.translate(new Laya.Vector3(5.2, 4, 5.2));
			this.camera.transform.rotate(new Laya.Vector3(-25, 45, 0), true, false);
			this.camera.addComponent(CameraMoveScript);
			this.camera.clearColor = null;
			
			var directionLight:Laya.DirectionLight = this.scene.addChild(new Laya.DirectionLight()) as Laya.DirectionLight;
			directionLight.color = new Laya.Vector3(1, 1, 1);
			directionLight.transform.worldMatrix.setForward(new Laya.Vector3(-1.0, -1.0, 1.0));
			
			var plane:Laya.MeshSprite3D = this.scene.addChild(new Laya.MeshSprite3D(new Laya.PrimitiveMesh.createPlane(13, 13, 10, 10))) as Laya.MeshSprite3D;
			var planeMat:Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
			Laya.Texture2D.load("../../res/threeDimen/Physics/grass.png", Laya.Handler.create(null, function(tex:Laya.Texture2D):void {
				planeMat.albedoTexture = tex;
			}));
			planeMat.tilingOffset = new Laya.Vector4(10, 10, 0, 0);
			planeMat.shininess = 1;
			plane.meshRenderer.material = planeMat;
			plane.meshRenderer.receiveShadow = true;
			var staticCollider:Laya.PhysicsCollider = plane.addComponent(Laya.PhysicsCollider) as Laya.PhysicsCollider;
			var planeShape:Laya.BoxColliderShape = new Laya.BoxColliderShape(13, 0, 13);
			
			staticCollider.colliderShape = planeShape;
			staticCollider.friction = 2;
			
			this.randomAddPhysicsSprite();
    }
    public randomAddPhysicsSprite():void {
			
        Laya.timer.loop(1000, this, function():void {
            
            var random:Number = Math.floor(Math.random() * 2) % 2;
            switch (random) {
            case 0: 
                this.addTable();
                break;
            case 1: 
                this.addObject();
                break;
            default: 
                break;
            }
        });
    }
    
    public addTable():void {
        var mat:Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("../../res/threeDimen/Physics/wood.jpg", Laya.Handler.create(null, function(tex:Laya.Texture2D):void {
            mat.albedoTexture = tex;
        }));
        mat.shininess = 1;
        
        Laya.Mesh.load("../../res/threeDimen/Physics/table.lm", Laya.Handler.create(this, function(mesh:Laya.Mesh):void {
            var table:Laya.MeshSprite3D = this.scene.addChild(new Laya.MeshSprite3D(mesh)) as Laya.MeshSprite3D;
            table.transform.position = new Laya.Vector3(Math.random() * 4 - 2, 10,Math.random() * 4 - 2);
            table.transform.rotationEuler = new Laya.Vector3(Math.random() * 360, Math.random() * 360, Math.random() * 360);
            table.transform.scale = new Laya.Vector3(3, 3, 3);
            table.meshRenderer.material = mat;
            
            var rigidBody:Laya.Rigidbody3D = table.addComponent(Laya.Rigidbody3D) as Laya.Rigidbody3D;
            rigidBody.mass = 10;
            rigidBody.friction = 1;
            
            var compoundShape:Laya.CompoundColliderShape = new Laya.CompoundColliderShape();
            
            var boxShape:Laya.BoxColliderShape = new Laya.BoxColliderShape(0.5, 0.4, 0.045);
            boxShape.localOffset = new Laya.Vector3(0, 0, 0.125);
            compoundShape.addChildShape(boxShape);
            
            var boxShape1:Laya.BoxColliderShape = new Laya.BoxColliderShape(0.1, 0.1, 0.3);
            boxShape1.localOffset = new Laya.Vector3(-0.2, -0.148, -0.048);
            compoundShape.addChildShape(boxShape1);
            
            var boxShape2:Laya.BoxColliderShape = new Laya.BoxColliderShape(0.1, 0.1, 0.3);
            boxShape2.localOffset = new Laya.Vector3(0.2, -0.148, -0.048);
            compoundShape.addChildShape(boxShape2);
            
            var boxShape3:Laya.BoxColliderShape = new Laya.BoxColliderShape(0.1, 0.1, 0.3);
            boxShape3.localOffset = new Laya.Vector3(-0.2, 0.153, -0.048);
            compoundShape.addChildShape(boxShape3);
            
            var boxShape4:Laya.BoxColliderShape = new Laya.BoxColliderShape(0.1, 0.1, 0.3);
            boxShape4.localOffset = new Laya.Vector3(0.2, 0.153, -0.048);
            compoundShape.addChildShape(boxShape4);
            
            rigidBody.colliderShape = compoundShape;
        }));
    }
    
    public addObject():void {
        var mat:Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("../../res/threeDimen/Physics/rocks.jpg", Laya.Handler.create(this, function(tex:Laya.Texture2D):void {
            mat.albedoTexture = tex;
        }));
        
        Laya.Mesh.load("../../res/threeDimen/Physics/object.lm", Laya.Handler.create(this, function(mesh:Laya.Mesh):void {
				
            var object:Laya.MeshSprite3D = this.scene.addChild(new Laya.MeshSprite3D(mesh)) as Laya.MeshSprite3D;
            object.transform.position = new Laya.Vector3(Math.random() * 4 - 2, 5, Math.random() * 4 - 2);
            object.transform.rotationEuler = new Laya.Vector3(Math.random() * 360, Math.random() * 360, Math.random() * 360);
            object.transform.scale = new Laya.Vector3(0.01, 0.01, 0.01);
            object.meshRenderer.material = mat;
            
            var rigidBody:Laya.Rigidbody3D = object.addComponent(Laya.Rigidbody3D) as Laya.Rigidbody3D;
            rigidBody.mass = 3;
            rigidBody.friction = 0.3;
            
            var compoundShape:Laya.CompoundColliderShape = new Laya.CompoundColliderShape();
            
            var boxShape:Laya.BoxColliderShape = new Laya.BoxColliderShape(40, 40, 40);
            boxShape.localOffset = new Laya.Vector3(0, 0, -20);
            compoundShape.addChildShape(boxShape);
            
            var sphereShape:Laya.SphereColliderShape = new Laya.SphereColliderShape(25);
            sphereShape.localOffset = new Laya.Vector3(0, 0, 24);
            compoundShape.addChildShape(sphereShape);
            
            rigidBody.colliderShape = compoundShape;
        }))
    }
}
new PhysicsWorld_CompoundCollider;