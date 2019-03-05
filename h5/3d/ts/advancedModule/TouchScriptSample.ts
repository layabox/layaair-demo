class TouchScript extends Laya.Script3D {
	public header:string;
	public subText:string = "";
	public count:number = 0;
	public text:Laya.Text;
	
     public onUpdate():void {
		if (this.count === 24) {
			var t:string = this.text.text;
			var index:number = t.indexOf("\n");
			t = t.slice(index + 1, t.length);
			this.text.text = t;
			this.count--;
		}
		if (this.subText !== "") {
			this.text.text += this.header + this.subText + "\n";
			this.subText = "";
			this.count++;
		}
	}
	
    public onMouseEnter():void {
		this.subText += "onMouseEnter  ";
	}
	
	public onMouseOver():void {
		this.subText += "onMouseOver  ";
	}
	
	public onMouseOut():void {
		this.subText += "onMouseOut  ";
	}
	
	public onMouseDown():void {
		this.subText += "onMouseDown  ";
	}
	
	public onMouseUp():void {
		this.subText += "onMouseUp  ";
	}
	
	public onMouseClick():void {
		this.subText += "onMouseClick  ";
	}
	
	public onMouseDrag():void {
		this.subText += "onMouseDrag  ";
	}
}

class TouchScriptSample {
    private text:Laya.Text;
	private scene:Laya.Scene3D;
	private camera:Laya.Camera;
	private kinematicSphere:Laya.Sprite3D;
    constructor() {
            Laya3D.init(0, 0, null);
			Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
			Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
			//Stat.show();
			this.scene = Laya.stage.addChild(new Laya.Scene3D()) as Laya.Scene3D;
			
			this.camera = this.scene.addChild(new Laya.Camera(0, 0.1, 100)) as Laya.Camera;
			this.camera.transform.translate(new Laya.Vector3(0, 8, 20));
			this.camera.transform.rotate(new Laya.Vector3(-30, 0, 0), true, false);
			this.camera.clearColor = null;
			
			var directionLight:Laya.DirectionLight = this.scene.addChild(new Laya.DirectionLight()) as Laya.DirectionLight;
			directionLight.color = new Laya.Vector3(1, 1, 1);
			directionLight.transform.worldMatrix.setForward(new Laya.Vector3(-1.0, -1.0, 1.0));
			
			var plane:Laya.MeshSprite3D = this.scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createPlane(20, 20, 10, 10))) as Laya.MeshSprite3D;
			var planeMat:Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
			Laya.Texture2D.load("../res/threeDimen/Physics/wood.jpg", Laya.Handler.create(this, function(tex:Laya.Texture2D):void {
				planeMat.albedoTexture = tex;
			}));
			planeMat.tilingOffset = new Laya.Vector4(2, 2, 0, 0);
			plane.meshRenderer.material = planeMat;
			
			var rigidBody:Laya.PhysicsCollider = plane.addComponent(Laya.PhysicsCollider) as Laya.PhysicsCollider;
			var boxShape:Laya.BoxColliderShape = new Laya.BoxColliderShape(20, 0, 20);
			rigidBody.colliderShape = boxShape;
			
			this.text = new Laya.Text();
			this.text.pos(20, 20);
			this.text.fontSize = 16;
			this.text.color = "yellow";
			
			this.addBox();
			this.addCapsule();
			Laya.stage.addChild(this.text);
    }
    public addBox():void {
        var mat1:Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("../res/threeDimen/Physics/rocks.jpg", Laya.Handler.create(this, function(tex:Laya.Texture2D):void {
            mat1.albedoTexture = tex;
        }));
        
        var sX:number = Math.random() * 0.75 + 0.25;
        var sY:number = Math.random() * 0.75 + 0.25;
        var sZ:number = Math.random() * 0.75 + 0.25;
        var box:Laya.MeshSprite3D = this.scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(sX, sY, sZ))) as Laya.MeshSprite3D;
        box.meshRenderer.material = mat1;
        box.transform.position = new Laya.Vector3(Math.random() * 4 - 2, 2, Math.random() * 4 - 2);
        box.transform.rotationEuler = new Laya.Vector3(Math.random() * 360, Math.random() * 360, Math.random() * 360);
        
        var rigidBody:Laya.Rigidbody3D = box.addComponent(Laya.Rigidbody3D);
        var boxShape:Laya.BoxColliderShape = new Laya.BoxColliderShape(sX, sY, sZ);
        rigidBody.colliderShape = boxShape;
        rigidBody.mass = 10;
        
        var script:TouchScript = box.addComponent(TouchScript) as TouchScript;
        script.header = "BOX: ";
        script.text = this.text;
    }
    
    public addCapsule():void {
        var mat3:Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("../res/threeDimen/Physics/wood.jpg", Laya.Handler.create(null, function(tex:Laya.Texture2D):void {
            mat3.albedoTexture = tex;
        }));
        
        var raidius:number = Math.random() * 0.2 + 0.2;
        var height:number = Math.random() * 0.5 + 0.8;
        var capsule:Laya.MeshSprite3D = this.scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCapsule(raidius, height))) as Laya.MeshSprite3D;
        capsule.meshRenderer.material = mat3;
        capsule.transform.position = new Laya.Vector3(Math.random() * 4 - 2, 2, Math.random() * 4 - 2);
        capsule.transform.rotationEuler = new Laya.Vector3(Math.random() * 360, Math.random() * 360, Math.random() * 360);
        
        var rigidBody:Laya.Rigidbody3D = capsule.addComponent(Laya.Rigidbody3D);
        var sphereShape:Laya.CapsuleColliderShape = new Laya.CapsuleColliderShape(raidius, height);
        rigidBody.colliderShape = sphereShape;
        rigidBody.mass = 10;
        
        var script:TouchScript = capsule.addComponent(TouchScript) as TouchScript;
        script.header = "Capsule: ";
        script.text = this.text;
    }

}
new TouchScriptSample;


