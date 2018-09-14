package physicsModule {
	import common.CameraMoveScript;
	import laya.d3.core.Camera;
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.light.DirectionLight;
	import laya.d3.core.material.BlinnPhongMaterial;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Quaternion;
	import laya.d3.math.Vector3;
	import laya.d3.math.Vector4;
	import laya.d3.physics.Rigidbody3D;
	import laya.d3.physics.PhysicsCollider;
	import laya.d3.physics.shape.BoxColliderShape;
	import laya.d3.physics.shape.CompoundColliderShape;
	import laya.d3.physics.shape.SphereColliderShape;
	import laya.d3.physics.shape.StaticPlaneColliderShape;
	import laya.d3.resource.models.Mesh;
	import laya.d3.resource.models.PlaneMesh;
	import laya.display.Stage;
	import laya.utils.Handler;
	import laya.utils.Stat;
	import laya.webgl.resource.Texture2D;
	
	public class PhysicsWorld_CompoundCollider {
		private var scene:Scene3D;
		private var camera:Camera;
		
		public function PhysicsWorld_CompoundCollider() {
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			Stat.show();
			
			scene = Laya.stage.addChild(new Scene3D()) as Scene3D;
			
			camera = scene.addChild(new Camera(0, 0.1, 100)) as Camera;
			camera.transform.translate(new Vector3(5.2, 4, 5.2));
			camera.transform.rotate(new Vector3(-25, 45, 0), true, false);
			camera.addComponent(CameraMoveScript);
			camera.clearColor = null;
			
			var directionLight:DirectionLight = scene.addChild(new DirectionLight()) as DirectionLight;
			directionLight.color = new Vector3(1, 1, 1);
			directionLight.transform.worldMatrix.setForward(new Vector3(-1.0, -1.0, 1.0));
			
			var plane:MeshSprite3D = scene.addChild(new MeshSprite3D(new PlaneMesh(13, 13, 10, 10))) as MeshSprite3D;
			var planeMat:BlinnPhongMaterial = new BlinnPhongMaterial();
			Texture2D.load("../../../../res/threeDimen/Physics/grass.png", Handler.create(null, function(tex:Texture2D):void {
				planeMat.albedoTexture = tex;
			}));
			planeMat.tilingOffset = new Vector4(10, 10, 0, 0);
			planeMat.shininess = 1;
			plane.meshRenderer.material = planeMat;
			plane.meshRenderer.receiveShadow = true;
			var staticCollider:PhysicsCollider = plane.addComponent(PhysicsCollider) as PhysicsCollider;
			var planeShape:BoxColliderShape = new BoxColliderShape(13, 0, 13);
			//var planeShape:StaticPlaneColliderShape = new StaticPlaneColliderShape(new Vector3(0,1,0),0);
			staticCollider.colliderShape = planeShape;
			staticCollider.friction = 2;
			
			randomAddPhysicsSprite();
		}
		
		public function randomAddPhysicsSprite():void {
			
			Laya.timer.loop(1000, this, function():void {
				
				var random:Number = Math.floor(Math.random() * 2) % 2;
				switch (random) {
				case 0: 
					addTable();
					break;
				case 1: 
					addObject();
					break;
				default: 
					break;
				}
			});
		}
		
		public function addTable():void {
			var mat:BlinnPhongMaterial = new BlinnPhongMaterial();
			Texture2D.load("../../../../res/threeDimen/Physics/wood.jpg", Handler.create(null, function(tex:Texture2D):void {
				mat.albedoTexture = tex;
			}));
			mat.shininess = 1;
			
			Mesh.load("../../../../res/threeDimen/Physics/table.lm", Handler.create(null, function(mesh:Mesh):void {
				var table:MeshSprite3D = scene.addChild(new MeshSprite3D(mesh)) as MeshSprite3D;
				table.transform.position = new Vector3(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
				table.transform.rotationEuler = new Vector3(Math.random() * 360, Math.random() * 360, Math.random() * 360);
				table.transform.scale = new Vector3(3, 3, 3);
				table.meshRenderer.material = mat;
				
				var rigidBody:Rigidbody3D = table.addComponent(Rigidbody3D) as Rigidbody3D;
				rigidBody.mass = 10;
				rigidBody.friction = 1;
				
				var compoundShape:CompoundColliderShape = new CompoundColliderShape();
				
				var boxShape:BoxColliderShape = new BoxColliderShape(0.5, 0.4, 0.045);
				boxShape.localOffset = new Vector3(0, 0, 0.125);
				compoundShape.addChildShape(boxShape);
				
				var boxShape1:BoxColliderShape = new BoxColliderShape(0.1, 0.1, 0.3);
				boxShape1.localOffset = new Vector3(-0.2, -0.148, -0.048);
				compoundShape.addChildShape(boxShape1);
				
				var boxShape2:BoxColliderShape = new BoxColliderShape(0.1, 0.1, 0.3);
				boxShape2.localOffset = new Vector3(0.2, -0.148, -0.048);
				compoundShape.addChildShape(boxShape2);
				
				var boxShape3:BoxColliderShape = new BoxColliderShape(0.1, 0.1, 0.3);
				boxShape3.localOffset = new Vector3(-0.2, 0.153, -0.048);
				compoundShape.addChildShape(boxShape3);
				
				var boxShape4:BoxColliderShape = new BoxColliderShape(0.1, 0.1, 0.3);
				boxShape4.localOffset = new Vector3(0.2, 0.153, -0.048);
				compoundShape.addChildShape(boxShape4);
				
				rigidBody.colliderShape = compoundShape;
			}));
		}
		
		public function addObject():void {
			var mat:BlinnPhongMaterial = new BlinnPhongMaterial();
			Texture2D.load("../../../../res/threeDimen/Physics/rocks.jpg", Handler.create(null, function(tex:Texture2D):void {
				mat.albedoTexture = tex;
			}));
			Mesh.load("../../../../res/threeDimen/Physics/object.lm", Handler.create(null, function(mesh:Mesh):void {
				
				var object:MeshSprite3D = scene.addChild(new MeshSprite3D(mesh)) as MeshSprite3D;
				object.transform.position = new Vector3(Math.random() * 4 - 2, 5, Math.random() * 4 - 2);
				object.transform.rotationEuler = new Vector3(Math.random() * 360, Math.random() * 360, Math.random() * 360);
				object.transform.scale = new Vector3(0.01, 0.01, 0.01);
				object.meshRenderer.material = mat;
				
				var rigidBody:Rigidbody3D = object.addComponent(Rigidbody3D) as Rigidbody3D;
				rigidBody.mass = 3;
				rigidBody.friction = 0.3;
				
				var compoundShape:CompoundColliderShape = new CompoundColliderShape();
				
				var boxShape:BoxColliderShape = new BoxColliderShape(40, 40, 40);
				boxShape.localOffset = new Vector3(0, 0, -20);
				compoundShape.addChildShape(boxShape);
				
				var sphereShape:SphereColliderShape = new SphereColliderShape(25);
				sphereShape.localOffset = new Vector3(0, 0, 24);
				compoundShape.addChildShape(sphereShape);
				
				rigidBody.colliderShape = compoundShape;
			}))
		
		}
	
	}

}