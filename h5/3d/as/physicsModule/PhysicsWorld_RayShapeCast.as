package physicsModule {
	import common.CameraMoveScript;
	import laya.d3.core.Camera;
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.light.DirectionLight;
	import laya.d3.core.material.BlinnPhongMaterial;
	import laya.d3.core.pixelLine.PixelLineSprite3D;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Color;
	import laya.d3.math.Ray;
	import laya.d3.math.Vector3;
	import laya.d3.math.Vector4;
	import laya.d3.physics.HitResult;
	import laya.d3.physics.PhysicsCollider;
	import laya.d3.physics.Rigidbody3D;
	import laya.d3.physics.shape.BoxColliderShape;
	import laya.d3.physics.shape.CapsuleColliderShape;
	import laya.d3.physics.shape.SphereColliderShape;
	import laya.d3.resource.models.PrimitiveMesh;
	import laya.display.Stage;
	import laya.events.Event;
	import laya.ui.Button;
	import laya.utils.Browser;
	import laya.utils.Handler;
	import laya.utils.Stat;
	import laya.webgl.resource.Texture2D;
	
	public class PhysicsWorld_RayShapeCast {
		private var castType:int = 0;
		private var castAll:Boolean = false;
		
		private var ray:Ray = new Ray(new Vector3(0, 0, 0), new Vector3(0, 0, 0));
		private var scene:Scene3D;
		private var hitResult:HitResult = new HitResult();
		private var hitResults:Vector.<HitResult> = new Vector.<HitResult>();
		private var debugSprites:Vector.<Sprite3D> = new Vector.<Sprite3D>();
		
		public function PhysicsWorld_RayShapeCast() {
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			Stat.show();
			
			scene = Laya.stage.addChild(new Scene3D()) as Scene3D;
			
			var camera:Camera = scene.addChild(new Camera(0, 0.1, 100)) as Camera;
			camera.transform.translate(new Vector3(0, 8, 20));
			camera.transform.rotate(new Vector3(-30, 0, 0), true, false);
			camera.addComponent(CameraMoveScript);
			
			var directionLight:DirectionLight = scene.addChild(new DirectionLight()) as DirectionLight;
			directionLight.color = new Vector3(1, 1, 1);
			directionLight.transform.worldMatrix.setForward(new Vector3(-1.0, -1.0, 1.0));
			
			var plane:MeshSprite3D = scene.addChild(new MeshSprite3D(PrimitiveMesh.createPlane(20, 20, 10, 10))) as MeshSprite3D;
			var planeMat:BlinnPhongMaterial = new BlinnPhongMaterial();
			Texture2D.load("../../../../res/threeDimen/Physics/wood.jpg", Handler.create(null, function(tex:Texture2D):void {
				planeMat.albedoTexture = tex;
			}));
			planeMat.tilingOffset = new Vector4(2, 2, 0, 0);
			plane.meshRenderer.material = planeMat;
			
			var rigidBody:PhysicsCollider = plane.addComponent(PhysicsCollider) as PhysicsCollider;
			var boxCollider:BoxColliderShape = new BoxColliderShape(20, 0, 20);
			rigidBody.colliderShape = boxCollider;
			
			for (var i:int = 0; i < 60; i++) {
				addBox();
				addCapsule();
			}
			
			addButton(200, 200, 160, 40, "射线模式", function(e:Event):void {
				castType++;
				castType %= 4;
				switch (castType) {
				case 0: 
					(e.target as Button).label = "射线模式";
					break;
				case 1: 
					(e.target as Button).label = "盒子模式";
					break;
				case 2: 
					(e.target as Button).label = "球模式";
					break;
				case 3: 
					(e.target as Button).label = "胶囊模式";
					break;
				}
			});
			
			addButton(200, 300, 160, 40, "不穿透", function(e:Event):void {
				if (castAll) {
					(e.target as Button).label = "不穿透";
					castAll = false;
				} else {
					(e.target as Button).label = "穿透";
					castAll = true;
				}
			});
			
			addButton(200, 400, 160, 40, "检测", function(e:Event):void {
				if (hitResult.succeeded)
					((hitResult.collider.owner as MeshSprite3D).meshRenderer.sharedMaterial as BlinnPhongMaterial).albedoColor = new Vector4(1.0, 1.0, 1.0, 1.0);
				
				if (hitResults.length > 0) {
					for (var i:int = 0, n:int = hitResults.length; i < n; i++)
						((hitResults[i].collider.owner as MeshSprite3D).meshRenderer.sharedMaterial as BlinnPhongMaterial).albedoColor = new Vector4(1.0, 1.0, 1.0, 1.0);
					hitResults.length = 0;
				}
				
				if (debugSprites.length > 0) {
					for (i = 0, n = debugSprites.length; i < n; i++)
						debugSprites[i].destroy();
					debugSprites.length = 0;
				}
				
				var from:Vector3 = new Vector3(0, 1, 10);
				var to:Vector3 = new Vector3(0, 1, -5);
				switch (castType) {
				case 0: 
					var lineSprite:PixelLineSprite3D = scene.addChild(new PixelLineSprite3D(1)) as PixelLineSprite3D;
					lineSprite.addLine(from, to, Color.RED, Color.RED);
					debugSprites.push(lineSprite);
					if (castAll) {
						scene.physicsSimulation.raycastAllFromTo(from, to, hitResults);
						for (i = 0, n = hitResults.length; i < n; i++)
							((hitResults[i].collider.owner as MeshSprite3D).meshRenderer.sharedMaterial as BlinnPhongMaterial).albedoColor = new Vector4(1.0, 0.0, 0.0, 1.0);
					} else {
						scene.physicsSimulation.raycastFromTo(from, to, hitResult);
						((hitResult.collider.owner as MeshSprite3D).meshRenderer.sharedMaterial as BlinnPhongMaterial).albedoColor = new Vector4(1.0, 0.0, 0.0, 1.0);
					}
					break;
				case 1: 
					var boxCollider:BoxColliderShape = new BoxColliderShape(1.0, 1.0, 1.0);
					for (i = 0; i < 21; i++) {
						var boxSprite:MeshSprite3D = scene.addChild(new MeshSprite3D(PrimitiveMesh.createBox(1.0, 1.0, 1.0))) as MeshSprite3D;
						var mat:BlinnPhongMaterial = new BlinnPhongMaterial();
						mat.albedoColor = new Vector4(1.0, 1.0, 1.0, 0.5);
						mat.renderMode = BlinnPhongMaterial.RENDERMODE_TRANSPARENT;
						boxSprite.meshRenderer.material = mat;
						var position:Vector3 = new Vector3();
						Vector3.lerp(from, to, i / 20, position);
						boxSprite.transform.localPosition = position;
						debugSprites.push(boxSprite);
					}
					if (castAll) {
						scene.physicsSimulation.shapeCastAll(boxCollider, from, to, hitResults);
						for (i = 0, n = hitResults.length; i < n; i++)
							((hitResults[i].collider.owner as MeshSprite3D).meshRenderer.sharedMaterial as BlinnPhongMaterial).albedoColor = new Vector4(1.0, 0.0, 0.0, 1.0);
					} else {
						if (scene.physicsSimulation.shapeCast(boxCollider, from, to, hitResult))
							((hitResult.collider.owner as MeshSprite3D).meshRenderer.sharedMaterial as BlinnPhongMaterial).albedoColor = new Vector4(1.0, 0.0, 0.0, 1.0);
					}
					break;
				case 2: 
					var sphereCollider:SphereColliderShape = new SphereColliderShape(0.5);
					for (i = 0; i < 41; i++) {
						var sphereSprite:MeshSprite3D = scene.addChild(new MeshSprite3D(PrimitiveMesh.createSphere(0.5))) as MeshSprite3D;
						var mat:BlinnPhongMaterial = new BlinnPhongMaterial();
						mat.albedoColor = new Vector4(1.0, 1.0, 1.0, 0.5);
						mat.renderMode = BlinnPhongMaterial.RENDERMODE_TRANSPARENT;
						sphereSprite.meshRenderer.material = mat;
						var position:Vector3 = new Vector3();
						Vector3.lerp(from, to, i / 40, position);
						sphereSprite.transform.localPosition = position;
						debugSprites.push(sphereSprite);
					}
					
					if (castAll) {
						scene.physicsSimulation.shapeCastAll(sphereCollider, from, to, hitResults);
						for (i = 0, n = hitResults.length; i < n; i++)
							((hitResults[i].collider.owner as MeshSprite3D).meshRenderer.sharedMaterial as BlinnPhongMaterial).albedoColor = new Vector4(1.0, 0.0, 0.0, 1.0);
					} else {
						if (scene.physicsSimulation.shapeCast(sphereCollider, from, to, hitResult))
							((hitResult.collider.owner as MeshSprite3D).meshRenderer.sharedMaterial as BlinnPhongMaterial).albedoColor = new Vector4(1.0, 0.0, 0.0, 1.0);
					}
					break;
				case 3: 
					var capsuleCollider:CapsuleColliderShape = new CapsuleColliderShape(0.25, 1.0);
					for (i = 0; i < 41; i++) {
						var capsuleSprite:MeshSprite3D = scene.addChild(new MeshSprite3D(PrimitiveMesh.createCapsule(0.25, 1.0))) as MeshSprite3D;
						var mat:BlinnPhongMaterial = new BlinnPhongMaterial();
						mat.albedoColor = new Vector4(1.0, 1.0, 1.0, 0.5);
						mat.renderMode = BlinnPhongMaterial.RENDERMODE_TRANSPARENT;
						capsuleSprite.meshRenderer.material = mat;
						var position:Vector3 = new Vector3();
						Vector3.lerp(from, to, i / 40, position);
						capsuleSprite.transform.localPosition = position;
						debugSprites.push(capsuleSprite);
					}
					if (castAll) {
						scene.physicsSimulation.shapeCastAll(capsuleCollider, from, to, hitResults);
						for (i = 0, n = hitResults.length; i < n; i++)
							((hitResults[i].collider.owner as MeshSprite3D).meshRenderer.sharedMaterial as BlinnPhongMaterial).albedoColor = new Vector4(1.0, 0.0, 0.0, 1.0);
					} else {
						if (scene.physicsSimulation.shapeCast(capsuleCollider, from, to, hitResult))
							((hitResult.collider.owner as MeshSprite3D).meshRenderer.sharedMaterial as BlinnPhongMaterial).albedoColor = new Vector4(1.0, 0.0, 0.0, 1.0);
					}
					break;
				}
			});
		}
		
		private function addButton(x:Number, y:Number, width:Number, height:Number, text:String, clickFun:Function):void {
			Laya.loader.load(["../../../../res/threeDimen/ui/button.png"], Handler.create(null, function():void {
				var changeActionButton:Button = Laya.stage.addChild(new Button("../../../../res/threeDimen/ui/button.png", text)) as Button;
				changeActionButton.size(width, height);
				changeActionButton.labelBold = true;
				changeActionButton.labelSize = 30;
				changeActionButton.sizeGrid = "4,4,4,4";
				changeActionButton.scale(Browser.pixelRatio, Browser.pixelRatio);
				changeActionButton.pos(x, y);
				changeActionButton.on(Event.CLICK, this, clickFun);
			}));
		}
		
		public function addBox():void {
			var mat1:BlinnPhongMaterial = new BlinnPhongMaterial();
			Texture2D.load("../../../../res/threeDimen/Physics/rocks.jpg", Handler.create(null, function(tex:Texture2D):void {
				mat1.albedoTexture = tex;
			}));
			
			var sX:int = Math.random() * 0.75 + 0.25;
			var sY:int = Math.random() * 0.75 + 0.25;
			var sZ:int = Math.random() * 0.75 + 0.25;
			var box:MeshSprite3D = scene.addChild(new MeshSprite3D(PrimitiveMesh.createBox(sX, sY, sZ))) as MeshSprite3D;
			box.meshRenderer.material = mat1;
			box.transform.position = new Vector3(Math.random() * 4 - 2, 2, Math.random() * 4 - 2);
			box.transform.rotationEuler = new Vector3(Math.random() * 360, Math.random() * 360, Math.random() * 360);
			
			var rigidBody:Rigidbody3D = box.addComponent(Rigidbody3D);
			var boxShape:BoxColliderShape = new BoxColliderShape(sX, sY, sZ);
			rigidBody.colliderShape = boxShape;
			rigidBody.mass = 10;
		}
		
		public function addCapsule():void {
			var mat3:BlinnPhongMaterial = new BlinnPhongMaterial();
			Texture2D.load("../../../../res/threeDimen/Physics/wood.jpg", Handler.create(null, function(tex:Texture2D):void {
				mat3.albedoTexture = tex;
			}));
			
			var raidius:int = Math.random() * 0.2 + 0.2;
			var height:int = Math.random() * 0.5 + 0.8;
			var capsule:MeshSprite3D = scene.addChild(new MeshSprite3D(PrimitiveMesh.createCapsule(raidius, height))) as MeshSprite3D;
			capsule.meshRenderer.material = mat3;
			capsule.transform.position = new Vector3(Math.random() * 4 - 2, 2, Math.random() * 4 - 2);
			capsule.transform.rotationEuler = new Vector3(Math.random() * 360, Math.random() * 360, Math.random() * 360);
			
			var rigidBody:Rigidbody3D = capsule.addComponent(Rigidbody3D);
			var sphereShape:CapsuleColliderShape = new CapsuleColliderShape(raidius, height);
			rigidBody.colliderShape = sphereShape;
			rigidBody.mass = 10;
		}
	}
}