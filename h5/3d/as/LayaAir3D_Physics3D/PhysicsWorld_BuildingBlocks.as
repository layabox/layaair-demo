package LayaAir3D_Physics3D {
	import laya.d3.core.Camera;
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.light.DirectionLight;
	import laya.d3.core.material.BlinnPhongMaterial;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Ray;
	import laya.d3.math.Vector2;
	import laya.d3.math.Vector3;
	import laya.d3.math.Vector4;
	import laya.d3.physics.HitResult;
	import laya.d3.physics.PhysicsCollider;
	import laya.d3.physics.Rigidbody3D;
	import laya.d3.physics.shape.BoxColliderShape;
	import laya.d3.resource.models.PrimitiveMesh;
	import laya.display.Stage;
	import laya.events.Event;
	import laya.events.MouseManager;
	import laya.utils.Handler;
	import laya.utils.Stat;
	import laya.resource.Texture2D;
	
	public class PhysicsWorld_BuildingBlocks {
		
		private var scene:Scene3D;
		private var camera:Camera;
		private var ray:Ray = new Ray(new Vector3(0, 0, 0), new Vector3(0, 0, 0));
		private var point:Vector2 = new Vector2();
		private var _outHitResult:HitResult = new HitResult();
		private var hasSelectedSprite:Sprite3D;
		private var hasSelectedRigidBody:Rigidbody3D;
		private var ZERO:Laya.Vector3 = new Laya.Vector3(0,0,0);
		private var ONE:Laya.Vector3 = new Laya.Vector3(0,0,0);
		private var posX:Number;
		private var posY:Number;
		private var delX:Number;
		private var delY:Number;
		
		public function PhysicsWorld_BuildingBlocks() {
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			Stat.show();
			
			scene = Laya.stage.addChild(new Scene3D()) as Scene3D;
			
			camera = scene.addChild(new Camera(0, 0.1, 100)) as Camera;
			camera.transform.translate(new Vector3(4.5, 6, 4.5));
			camera.transform.rotate(new Vector3(-30, 45, 0), true, false);
			camera.clearColor = null;
			
			var directionLight:DirectionLight = scene.addChild(new DirectionLight()) as DirectionLight;
			directionLight.color = new Vector3(1, 1, 1);
			directionLight.transform.worldMatrix.setForward(new Vector3(-1.0, -1.0, 1.0));
			
			var plane:MeshSprite3D = scene.addChild(new MeshSprite3D(PrimitiveMesh.createPlane(13, 13, 10, 10))) as MeshSprite3D;
			var planeMat:BlinnPhongMaterial = new BlinnPhongMaterial();
			Texture2D.load("res/threeDimen/Physics/wood.jpg", Handler.create(this, function(tex:Texture2D):void {
				planeMat.albedoTexture = tex;
			}));
			
			planeMat.tilingOffset = new Vector4(2, 2, 0, 0);
			plane.meshRenderer.material = planeMat;
			plane.meshRenderer.receiveShadow = true;
			
			var rigidBody:PhysicsCollider = plane.addComponent(PhysicsCollider) as PhysicsCollider;
			var boxShape:BoxColliderShape = new BoxColliderShape(13, 0, 13);
			rigidBody.colliderShape = boxShape;
			addMouseEvent();
			
			addBox();
		}
		
		public function addBox():void {
			
			for (var i:int = 0; i < 8; i++) {
				addVerticalBox(-0.65, 0.165 + i * 0.33 * 2, 0);
				addVerticalBox(0, 0.165 + i * 0.33 * 2, 0);
				addVerticalBox(0.65, 0.165 + i * 0.33 * 2, 0);
				
				addHorizontalBox(0, 0.165 + 0.33 + i * 0.33 * 2, -0.65);
				addHorizontalBox(0, 0.165 + 0.33 + i * 0.33 * 2, 0);
				addHorizontalBox(0, 0.165 + 0.33 + i * 0.33 * 2, 0.65);
			}
		}
		
		public function addHorizontalBox(x:Number, y:Number, z:Number):void {
			
			var mat:BlinnPhongMaterial = new BlinnPhongMaterial();
			Texture2D.load("res/threeDimen/Physics/plywood.jpg", Handler.create(this, function(tex:Texture2D):void {
				mat.albedoTexture = tex;
			}));
			
			var box:MeshSprite3D = scene.addChild(new MeshSprite3D(PrimitiveMesh.createBox(2, 0.33, 0.5))) as MeshSprite3D;
			box.meshRenderer.material = mat;
			box.meshRenderer.castShadow = true;
			box.meshRenderer.receiveShadow = true;
			box.transform.position = new Vector3(x, y, z);
			
			var rigidBody:Rigidbody3D = box.addComponent(Rigidbody3D) as Rigidbody3D;
			rigidBody.mass = 10;
			rigidBody.friction = 0.4;
			rigidBody.restitution = 0.2;
			var boxShape:BoxColliderShape = new BoxColliderShape(2, 0.33, 0.5);
			rigidBody.colliderShape = boxShape;
		}
		
		public function addVerticalBox(x:Number, y:Number, z:Number):void {
			
			var mat:BlinnPhongMaterial = new BlinnPhongMaterial();
			Texture2D.load("res/threeDimen/Physics/plywood.jpg", Handler.create(this, function(tex:Texture2D):void {
				mat.albedoTexture = tex;
			}));
			
			var box:MeshSprite3D = scene.addChild(new MeshSprite3D(PrimitiveMesh.createBox(0.5, 0.33, 2))) as MeshSprite3D;
			box.meshRenderer.material = mat;
			box.meshRenderer.castShadow = true;
			box.meshRenderer.receiveShadow = true;
			box.transform.position = new Vector3(x, y, z);
			
			var rigidBody:Rigidbody3D = box.addComponent(Rigidbody3D) as Rigidbody3D;
			rigidBody.mass = 10;
			rigidBody.friction = 0.4;
			rigidBody.restitution = 0.2;
			var boxShape:BoxColliderShape = new BoxColliderShape(0.5, 0.33, 2);
			rigidBody.colliderShape = boxShape;
		}
		
		public function addMouseEvent():void {
			Laya.stage.on(Event.MOUSE_DOWN, this, onMouseDown);
			Laya.stage.on(Event.MOUSE_UP, this, onMouseUp);
			Laya.stage.on(Event.MOUSE_OUT, this, onMouseOut);
		}
		
		public function onMouseDown():void {
			posX = point.x = MouseManager.instance.mouseX;
			posY = point.y = MouseManager.instance.mouseY;
			camera.viewportPointToRay(point, ray);
			scene.physicsSimulation.rayCast(ray, _outHitResult);
			if (_outHitResult.succeeded) {
				var collider:Rigidbody3D = _outHitResult.collider as Rigidbody3D;
				hasSelectedSprite = collider.owner as Sprite3D;
				hasSelectedRigidBody = collider;
				collider.angularFactor = ZERO;
				collider.angularVelocity = ZERO;
				collider.linearFactor = ZERO;
				collider.linearVelocity = ZERO;
			}
			Laya.stage.on(Event.MOUSE_MOVE, this, onMouseMove);
		}
		
		public function onMouseMove():void {
			
			delX = MouseManager.instance.mouseX - posX;
			delY = MouseManager.instance.mouseY - posY;
			if (hasSelectedSprite) {
				hasSelectedRigidBody.linearVelocity = new Vector3(delX / 4, 0, delY / 4);
			}
			posX = MouseManager.instance.mouseX;
			posY = MouseManager.instance.mouseY;
		}
		
		public function onMouseUp():void {
			Laya.stage.off(Event.MOUSE_MOVE, this, onMouseMove);
			if (hasSelectedSprite) {
				hasSelectedRigidBody.angularFactor = ONE;
				hasSelectedRigidBody.linearFactor = ONE;
				hasSelectedSprite = null;
			}
		}
		
		public function onMouseOut():void {
			Laya.stage.off(Event.MOUSE_MOVE, this, onMouseMove);
			if (hasSelectedSprite) {
				hasSelectedRigidBody.angularFactor = ONE;
				hasSelectedRigidBody.linearFactor = ONE;
				hasSelectedSprite = null;
			}
		}
	}
}