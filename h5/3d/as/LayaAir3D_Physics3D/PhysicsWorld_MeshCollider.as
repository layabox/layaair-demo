package LayaAir3D_Physics3D {
	import common.CameraMoveScript;
	import laya.d3.core.Camera;
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.Transform3D;
	import laya.d3.core.light.DirectionLight;
	import laya.d3.core.material.BlinnPhongMaterial;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Vector3;
	import laya.d3.math.Vector4;
	import laya.d3.math.Matrix4x4;
	import laya.d3.physics.PhysicsCollider;
	import laya.d3.physics.Rigidbody3D;
	import laya.d3.physics.shape.BoxColliderShape;
	import laya.d3.physics.shape.CapsuleColliderShape;
	import laya.d3.physics.shape.MeshColliderShape;
	import laya.d3.physics.shape.SphereColliderShape;
	import laya.d3.resource.models.Mesh;
	import laya.d3.resource.models.PrimitiveMesh;
	import laya.display.Stage;
	import laya.net.Loader;
	import laya.utils.Handler;
	import laya.utils.Stat;
	import laya.resource.Texture2D;
	
	/**
	 * ...
	 * @author wzy
	 */
	public class PhysicsWorld_MeshCollider {
		
		private var scene:Scene3D;
		private var tmpVector:Vector3 = new Vector3(0, 0, 0);
		
		public function PhysicsWorld_MeshCollider() {
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			Stat.show();
			
			scene = Laya.stage.addChild(new Scene3D()) as Scene3D;
			
			//初始化照相机
			var camera:Camera = scene.addChild(new Camera(0, 0.1, 100)) as Camera;
			camera.transform.translate(new Vector3(0, 6, 9.5));
			camera.transform.rotate(new Vector3(-15, 0, 0), true, false);
			camera.addComponent(CameraMoveScript);
			camera.clearColor = null;
			
			//方向光
			var directionLight:DirectionLight = scene.addChild(new DirectionLight()) as DirectionLight;
			//设置平行光的方向
			var mat:Matrix4x4 = directionLight.transform.worldMatrix;
			mat.setForward(new Vector3(0.0, -0.8, -1.0));
			directionLight.transform.worldMatrix=mat;
			directionLight.color = new Vector3(1, 1, 1);
			
			Laya.loader.create(["res/threeDimen/staticModel/lizard/Assets/Lizard/lizard-lizard_geo.lm", "res/threeDimen/staticModel/lizard/Assets/Lizard/lizard_diff.png", "res/threeDimen/staticModel/lizard/Assets/Lizard/lizard_norm.png"], Handler.create(this, complete));
		}
		
		public function complete():void {
			var mesh:Mesh = Loader.getRes("res/threeDimen/staticModel/lizard/Assets/Lizard/lizard-lizard_geo.lm");
			var albedo:Texture2D = Loader.getRes("res/threeDimen/staticModel/lizard/Assets/Lizard/lizard_diff.png");
			var normal:Texture2D = Loader.getRes("res/threeDimen/staticModel/lizard/Assets/Lizard/lizard_norm.png");
			var mat:BlinnPhongMaterial = new BlinnPhongMaterial();
			mat.specularColor = new Vector4(0.5, 0.5, 0.5, 0.5);
			mat.albedoTexture = albedo;
			mat.normalTexture = normal;
			
			var lizard:MeshSprite3D = scene.addChild(new MeshSprite3D(mesh)) as MeshSprite3D;
			lizard.transform.localPosition = new Vector3(-2, 0, 0);
			lizard.transform.localScale = new Vector3(0.01, 0.01, 0.01);
			lizard.meshRenderer.material = mat;
			var lizardCollider:PhysicsCollider = lizard.addComponent(PhysicsCollider);
			var meshShape:MeshColliderShape = new MeshColliderShape();
			meshShape.mesh = mesh;
			lizardCollider.colliderShape = meshShape;
			lizardCollider.friction = 2;
			lizardCollider.restitution = 0.3;
			
			var lizard1:MeshSprite3D = scene.addChild(new MeshSprite3D(mesh)) as MeshSprite3D;
			var transform:Transform3D = lizard1.transform;
			var localPosition:Vector3 = transform.localPosition;
			var localRotationEuler:Vector3 = transform.localRotationEuler;
			var localScale:Vector3 = transform.localScale;
			localPosition.setValue(3, 0, 0);
			localRotationEuler.setValue(0, 80, 0);
			localScale.setValue(0.01, 0.01, 0.01);
			transform.localPosition = localPosition;
			transform.localRotationEuler = localRotationEuler;
			transform.localScale = localScale;
			
			lizard1.meshRenderer.material = mat;
			var lizardCollider1:PhysicsCollider = lizard1.addComponent(PhysicsCollider);
			var meshShape1:MeshColliderShape = new MeshColliderShape();
			meshShape1.mesh = mesh;
			lizardCollider1.colliderShape = meshShape1;
			lizardCollider1.friction = 2;
			lizardCollider1.restitution = 0.3;
			
			randomAddPhysicsSprite();
		}
		
		public function randomAddPhysicsSprite():void {
			Laya.timer.loop(1000, this, function():void {
				var random:Number = Math.floor(Math.random() * 3) % 3;
				switch (random) {
				case 0: 
					addBox();
					break;
				case 1: 
					addSphere();
					break;
				case 2: 
					addCapsule();
					break;
				default: 
					break;
				}
			});
		}
		
		public function addBox():void {
			var mat1:BlinnPhongMaterial = new BlinnPhongMaterial();
			Texture2D.load("res/threeDimen/Physics/rocks.jpg", Handler.create(this, function(tex:Texture2D):void {
				mat1.albedoTexture = tex;
			}));
			
			var sX:int = Math.random() * 0.75 + 0.25;
			var sY:int = Math.random() * 0.75 + 0.25;
			var sZ:int = Math.random() * 0.75 + 0.25;
			var box:MeshSprite3D = scene.addChild(new MeshSprite3D(PrimitiveMesh.createBox(sX, sY, sZ))) as MeshSprite3D;
			box.meshRenderer.material = mat1;
			var transform:Transform3D = box.transform;
			var pos:Vector3 = transform.position;
			pos.setValue(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
			transform.position = pos;
			var rotationEuler:Vector3 = transform.rotationEuler;
			rotationEuler.setValue(Math.random() * 360, Math.random() * 360, Math.random() * 360);
			transform.rotationEuler = rotationEuler;
			
			var rigidBody:Rigidbody3D = box.addComponent(Rigidbody3D);
			var boxShape:BoxColliderShape = new BoxColliderShape(sX, sY, sZ);
			rigidBody.colliderShape = boxShape;
			rigidBody.mass = 10;
		}
		
		public function addSphere():void {
			var mat2:BlinnPhongMaterial = new BlinnPhongMaterial();
			Texture2D.load("res/threeDimen/Physics/plywood.jpg", Handler.create(this, function(tex:Texture2D):void {
				mat2.albedoTexture = tex;
			}));
			
			var radius:Number = Math.random() * 0.2 + 0.2;
			var sphere:MeshSprite3D = scene.addChild(new MeshSprite3D(PrimitiveMesh.createSphere(radius))) as MeshSprite3D;
			sphere.meshRenderer.material = mat2;
			var pos:Vector3 = sphere.transform.position;
			pos.setValue(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
			sphere.transform.position = pos;
			
			var rigidBody:Rigidbody3D = sphere.addComponent(Rigidbody3D);
			var sphereShape:SphereColliderShape = new SphereColliderShape(radius);
			rigidBody.colliderShape = sphereShape;
			rigidBody.mass = 10;
		}
		
		public function addCapsule():void {
			var mat3:BlinnPhongMaterial = new BlinnPhongMaterial();
			Texture2D.load("res/threeDimen/Physics/wood.jpg", Handler.create(this, function(tex:Texture2D):void {
				mat3.albedoTexture = tex;
			}));
			
			var raidius:int = Math.random() * 0.2 + 0.2;
			var height:int = Math.random() * 0.5 + 0.8;
			var capsule:MeshSprite3D = scene.addChild(new MeshSprite3D(PrimitiveMesh.createCapsule(raidius, height))) as MeshSprite3D;
			capsule.meshRenderer.material = mat3;
			var transform:Transform3D = capsule.transform;
			var pos:Vector3 = transform.position;
			pos.setValue(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
			transform.position = pos;
			var rotationEuler:Vector3 = transform.rotationEuler;
			rotationEuler.setValue(Math.random() * 360, Math.random() * 360, Math.random() * 360);
			transform.rotationEuler = rotationEuler;
			
			var rigidBody:Rigidbody3D = capsule.addComponent(Rigidbody3D);
			var sphereShape:CapsuleColliderShape = new CapsuleColliderShape(raidius, height);
			rigidBody.colliderShape = sphereShape;
			rigidBody.mass = 10;
		}
	
	}

}