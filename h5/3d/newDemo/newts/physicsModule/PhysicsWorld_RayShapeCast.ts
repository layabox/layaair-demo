import CameraMoveScript from "./common/CameraMoveScript"
class PhysicsWorld_RayShapeCast
{
    private castType:number = 0;
    private castAll:Boolean = false;
    
    private ray:Laya.Ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 0));
    private scene:Laya.Scene3D;
    private hitResult:Laya.HitResult = new Laya.HitResult();
    private hitResults:Array<Laya.HitResult> = new Array<Laya.HitResult>();
	private debugSprites:Array<Laya.Sprite3D> = new Array<Laya.Sprite3D>();
	private albedoColor:Laya.Vector4 = new Laya.Vector4(1.0, 1.0, 1.0, 1.0);
	private albedoColor2:Laya.Vector4 = new Laya.Vector4(1.0, 0.0, 0.0, 1.0);
	private tmpVector:Laya.Vector3 = new Laya.Vector3(0, 0, 0);
    constructor()
    {
		//初始化引擎
        Laya3D.init(0, 0);
		Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
		Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
		Laya.Stat.show();
		
		this.scene = Laya.stage.addChild(new Laya.Scene3D()) as Laya.Scene3D;
		
		var camera:Laya.Camera = this.scene.addChild(new Laya.Camera(0, 0.1, 100)) as Laya.Camera;
		camera.transform.translate(new Laya.Vector3(0, 8, 20));
		camera.transform.rotate(new Laya.Vector3(-30, 0, 0), true, false);
		camera.addComponent(CameraMoveScript);
		
		var directionLight:Laya.DirectionLight = this.scene.addChild(new Laya.DirectionLight()) as Laya.DirectionLight;
		directionLight.color = new Laya.Vector3(1, 1, 1);
		directionLight.transform.worldMatrix.setForward(new Laya.Vector3(-1.0, -1.0, 1.0));
		
		var plane:Laya.MeshSprite3D =this.scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createPlane(20, 20, 10, 10))) as Laya.MeshSprite3D;
		var planeMat:Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
		Laya.Texture2D.load("res/threeDimen/Physics/wood.jpg", Laya.Handler.create(null, function(tex:Laya.Texture2D):void {
			planeMat.albedoTexture = tex;
		}));
		planeMat.tilingOffset = new Laya.Vector4(2, 2, 0, 0);
		plane.meshRenderer.material = planeMat;
		
		var rigidBody:Laya.PhysicsCollider = plane.addComponent(Laya.PhysicsCollider) as Laya.PhysicsCollider;
		var boxCollider:Laya.BoxColliderShape = new Laya.BoxColliderShape(20, 0, 20);
		rigidBody.colliderShape = boxCollider;
		
		for (var i:number = 0; i < 60; i++) {
			this.addBox();
			this.addCapsule();
		}
		
		this.addButton(200, 200, 160, 40, "射线模式", function(e:Laya.Event):void {
			this.castType++;
			this.castType %= 4;
			switch (this.castType) {
			case 0: 
				(e.target as Laya.Button).label = "射线模式";
				break;
			case 1: 
				(e.target as Laya.Button).label = "盒子模式";
				break;
			case 2: 
				(e.target as Laya.Button).label = "球模式";
				break;
			case 3: 
				(e.target as Laya.Button).label = "胶囊模式";
				break;
			}
		});
		
		this.addButton(200, 300, 160, 40, "不穿透", function(e:Laya.Event):void {
			if (this.castAll) {
				(e.target as Laya.Button).label = "不穿透";
				this.castAll = false;
			} 
			else 
			{
				(e.target as Laya.Button).label = "穿透";
				this.castAll = true;
			}
		});
		
		this.addButton(200, 400, 160, 40, "检测", function(e:Event):void {
			if (this.hitResult.succeeded)
				((this.hitResult.collider.owner as Laya.MeshSprite3D).meshRenderer.sharedMaterial as Laya.BlinnPhongMaterial).albedoColor = this.albedoColor;
			
			if (this.hitResults.length > 0) {
				for (var i:number = 0, n:number = this.hitResults.length; i < n; i++)
					((this.hitResults[i].collider.owner as Laya.MeshSprite3D).meshRenderer.sharedMaterial as Laya.BlinnPhongMaterial).albedoColor = this.albedoColor;
				this.hitResults.length = 0;
			}
			
			if (this.debugSprites.length > 0) {
				for (i = 0, n = this.debugSprites.length; i < n; i++)
					this.debugSprites[i].destroy();
				this.debugSprites.length = 0;
			}
			
			var from:Laya.Vector3 = new Laya.Vector3(0, 1, 10);
			var to:Laya.Vector3 = new Laya.Vector3(0, 1, -5);
			switch (this.castType) {
			case 0: 
				var lineSprite:Laya.PixelLineSprite3D = this.scene.addChild(new Laya.PixelLineSprite3D(1)) as Laya.PixelLineSprite3D;
				lineSprite.addLine(from, to, Laya.Color.RED, Laya.Color.RED);
				this.debugSprites.push(lineSprite);
				if (this.castAll) {
					//射线发射方法
					this.scene.physicsSimulation.raycastAllFromTo(from, to, this.hitResults);
					for (i = 0, n = this.hitResults.length; i < n; i++)
						((this.hitResults[i].collider.owner as Laya.MeshSprite3D).meshRenderer.sharedMaterial as Laya.BlinnPhongMaterial).albedoColor = this.albedoColor2;
				} else {
					//射线发射方法
					this.scene.physicsSimulation.raycastFromTo(from, to, this.hitResult);
					((this.hitResult.collider.owner as Laya.MeshSprite3D).meshRenderer.sharedMaterial as Laya.BlinnPhongMaterial).albedoColor = this.albedoColor2;
				}
				break;
			case 1: 
				var boxCollider:Laya.BoxColliderShape = new Laya.BoxColliderShape(1.0, 1.0, 1.0);
				for (i = 0; i < 21; i++) {
					var boxSprite:Laya.MeshSprite3D = this.scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1.0, 1.0, 1.0))) as Laya.MeshSprite3D;
					var mat:Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
					mat.albedoColor = new Laya.Vector4(1.0, 1.0, 1.0, 0.5);
					mat.renderMode = Laya.BlinnPhongMaterial.RENDERMODE_TRANSPARENT;
					//mat.renderMode = 2;
					boxSprite.meshRenderer.material = mat;
					var position:Laya.Vector3 = new Laya.Vector3();
					Laya.Vector3.lerp(from, to, i / 20, position);
					boxSprite.transform.localPosition = position;
					this.debugSprites.push(boxSprite);
				}
				if (this.castAll) {
					this.scene.physicsSimulation.shapeCastAll(boxCollider, from, to, this.hitResults);
					for (i = 0, n = this.hitResults.length; i < n; i++)
						((this.hitResults[i].collider.owner as Laya.MeshSprite3D).meshRenderer.sharedMaterial as Laya.BlinnPhongMaterial).albedoColor = this.albedoColor2;
				} else {
					if (this.scene.physicsSimulation.shapeCast(boxCollider, from, to, this.hitResult))
						((this.hitResult.collider.owner as Laya.MeshSprite3D).meshRenderer.sharedMaterial as Laya.BlinnPhongMaterial).albedoColor = this.albedoColor2;
				}
				break;
			case 2: 
				var sphereCollider:Laya.SphereColliderShape = new Laya.SphereColliderShape(0.5);
				for (i = 0; i < 41; i++) {
					var sphereSprite:Laya.MeshSprite3D = this.scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createSphere(0.5))) as Laya.MeshSprite3D;
					var mat:Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
					mat.albedoColor = new Laya.Vector4(1.0, 1.0, 1.0, 0.5);
					mat.renderMode = 2;
					sphereSprite.meshRenderer.material = mat;
					var position:Laya.Vector3 = new Laya.Vector3();
					Laya.Vector3.lerp(from, to, i / 40, position);
					sphereSprite.transform.localPosition = position;
					this.debugSprites.push(sphereSprite);
				}
				
				if (this.castAll) {
					this.scene.physicsSimulation.shapeCastAll(sphereCollider, from, to, this.hitResults);
					for (i = 0, n = this.hitResults.length; i < n; i++)
						((this.hitResults[i].collider.owner as Laya.MeshSprite3D).meshRenderer.sharedMaterial as Laya.BlinnPhongMaterial).albedoColor = this.albedoColor2;
				} else {
					if (this.scene.physicsSimulation.shapeCast(sphereCollider, from, to, this.hitResult))
						((this.hitResult.collider.owner as Laya.MeshSprite3D).meshRenderer.sharedMaterial as Laya.BlinnPhongMaterial).albedoColor = this.albedoColor2;
				}
				break;
			case 3: 
				var capsuleCollider:Laya.CapsuleColliderShape = new Laya.CapsuleColliderShape(0.25, 1.0);
				for (i = 0; i < 41; i++) {
					var capsuleSprite:Laya.MeshSprite3D = this.scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCapsule(0.25, 1.0))) as Laya.MeshSprite3D;
					var mat:Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
					mat.albedoColor = new Laya.Vector4(1.0, 1.0, 1.0, 0.5);
					mat.renderMode = 2;
					capsuleSprite.meshRenderer.material = mat;
					var position:Laya.Vector3 = new Laya.Vector3();
					Laya.Vector3.lerp(from, to, i / 40, position);
					capsuleSprite.transform.localPosition = position;
					this.debugSprites.push(capsuleSprite);
				}
				if (this.castAll) {
					this.scene.physicsSimulation.shapeCastAll(capsuleCollider, from, to, this.hitResults);
					for (i = 0, n = this.hitResults.length; i < n; i++)
						((this.hitResults[i].collider.owner as Laya.MeshSprite3D).meshRenderer.sharedMaterial as Laya.BlinnPhongMaterial).albedoColor = this.albedoColor2;
				} else {
					if (this.scene.physicsSimulation.shapeCast(capsuleCollider, from, to, this.hitResult))
						((this.hitResult.collider.owner as Laya.MeshSprite3D).meshRenderer.sharedMaterial as Laya.BlinnPhongMaterial).albedoColor = this.albedoColor2;
				}
				break;
			}
		});
    }
    private addButton(x:number, y:number, width:number, height:number, text:string, clikFun:Function):void {
		Laya.loader.load(["res/threeDimen/ui/button.png"], Laya.Handler.create(this, function():void {
			var changeActionButton:Laya.Button = Laya.stage.addChild(new Laya.Button("res/threeDimen/ui/button.png", text)) as Laya.Button;
			changeActionButton.size(width, height);
			changeActionButton.labelBold = true;
			changeActionButton.labelSize = 30;
			changeActionButton.sizeGrid = "4,4,4,4";
			changeActionButton.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
			changeActionButton.pos(x, y);
			changeActionButton.on(Laya.Event.CLICK, this, clikFun);
		}));
    }
    
    public addBox():void {
        var mat1:Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
		Laya.Texture2D.load("res/threeDimen/Physics/rocks.jpg", Laya.Handler.create(null, function(tex:Laya.Texture2D):void {
			mat1.albedoTexture = tex;
		}));
        var sX:number = Math.random() * 0.75 + 0.25;
        var sY:number = Math.random() * 0.75 + 0.25;
        var sZ:number = Math.random() * 0.75 + 0.25;
        var box:Laya.MeshSprite3D = this.scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(sX, sY, sZ))) as Laya.MeshSprite3D;
		box.meshRenderer.material = mat1;
		this.tmpVector.setValue(Math.random() * 4 - 2, 2, Math.random() * 4 - 2);
		box.transform.position = this.tmpVector;
		this.tmpVector.setValue(Math.random() * 360, Math.random() * 360, Math.random() * 360);
        box.transform.rotationEuler = this.tmpVector;
        
        var rigidBody:Laya.Rigidbody3D = box.addComponent(Laya.Rigidbody3D);
        var boxShape:Laya.BoxColliderShape = new Laya.BoxColliderShape(sX, sY, sZ);
        rigidBody.colliderShape = boxShape;
        rigidBody.mass = 10;
    }
    
    public addCapsule():void {
        var mat3:Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
		Laya.Texture2D.load("res/threeDimen/Physics/wood.jpg", Laya.Handler.create(null, function(tex:Laya.Texture2D):void {
			mat3.albedoTexture = tex;
		}));
        
        var raidius:number = Math.random() * 0.2 + 0.2;
        var height:number = Math.random() * 0.5 + 0.8;
        var capsule:Laya.MeshSprite3D = this.scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCapsule(raidius, height))) as Laya.MeshSprite3D;
		capsule.meshRenderer.material = mat3;
		this.tmpVector.setValue(Math.random() * 4 - 2, 2, Math.random() * 4 - 2);
		capsule.transform.position = this.tmpVector;
		this.tmpVector.setValue(Math.random() * 360, Math.random() * 360, Math.random() * 360);
        capsule.transform.rotationEuler = this.tmpVector;
        
        var rigidBody:Laya.Rigidbody3D = capsule.addComponent(Laya.Rigidbody3D);
        var sphereShape:Laya.CapsuleColliderShape = new Laya.CapsuleColliderShape(raidius, height);
        rigidBody.colliderShape = sphereShape;
        rigidBody.mass = 10;
    }
}
new PhysicsWorld_RayShapeCast;