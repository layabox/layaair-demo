package LayaAir3D_Physics {
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
	import laya.d3.math.Matrix4x4;
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
	import laya.webgl.resource.Texture2D;
	
	public class PhysicsWorld_BuildingBlocks {
		
		private var scene:Scene3D;
		private var camera:Camera;
		private var ray:Ray = new Ray(new Vector3(0, 0, 0), new Vector3(0, 0, 0));
		private var point:Vector2 = new Vector2();
		private var _outHitResult:HitResult = new HitResult();
		private var hasSelectedSprite:Sprite3D;
		private var hasSelectedRigidBody:Rigidbody3D;
		private var posX:Number;
		private var posY:Number;
		private var delX:Number;
		private var delY:Number;
		
		public function PhysicsWorld_BuildingBlocks() {
			//初始化引擎
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			//显示性能面板
			Stat.show();
			
			//创建场景
			scene = Laya.stage.addChild(new Scene3D()) as Scene3D;
			
			//创建相机
			camera = scene.addChild(new Camera(0, 0.1, 100)) as Camera;
			camera.transform.translate(new Vector3(4.5, 6, 4.5));
			camera.transform.rotate(new Vector3(-30, 45, 0), true, false);
			//相机的清除颜色为空
			camera.clearColor = null;
			
			//创建平行光
			var directionLight:DirectionLight = scene.addChild(new DirectionLight()) as DirectionLight;
			directionLight.color = new Vector3(1, 1, 1);
			//设置平行光的方向
			var mat:Matrix4x4 = directionLight.transform.worldMatrix;
			mat.setForward(new Vector3(-1.0, -1.0, 1.0));
			directionLight.transform.worldMatrix=mat;
			
			//添加地面
			var plane:MeshSprite3D = scene.addChild(new MeshSprite3D(PrimitiveMesh.createPlane(13, 13, 10, 10))) as MeshSprite3D;
			//创建BlinnPhong材质
			var planeMat:BlinnPhongMaterial = new BlinnPhongMaterial();
			Texture2D.load("res/threeDimen/Physics/wood.jpg", Handler.create(null, function(tex:Texture2D):void {
				planeMat.albedoTexture = tex;
			}));
			//设置纹理平铺和偏移
			planeMat.tilingOffset = new Vector4(2, 2, 0, 0);
			//设置材质
			plane.meshRenderer.material = planeMat;
			//开启接收阴影
			plane.meshRenderer.receiveShadow = true;
			
			//地面添加物理碰撞器
			var rigidBody:PhysicsCollider = plane.addComponent(PhysicsCollider) as PhysicsCollider;
			//创建盒型碰撞器
			var boxShape:BoxColliderShape = new BoxColliderShape(13, 0, 13);
			//设置地面的物理碰撞器为盒型
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
			
			//创建BlinnPhong材质
			var mat:BlinnPhongMaterial = new BlinnPhongMaterial();
			Texture2D.load("res/threeDimen/Physics/plywood.jpg", Handler.create(null, function(tex:Texture2D):void {
				mat.albedoTexture = tex;
			}));
			
			//创建网格精灵MeshSprite3D
			var box:MeshSprite3D = scene.addChild(new MeshSprite3D(PrimitiveMesh.createBox(2, 0.33, 0.5))) as MeshSprite3D;
			//设置网格精灵的材质
			box.meshRenderer.material = mat;
			//产生阴影
			box.meshRenderer.castShadow = true;
			//接收阴影
			box.meshRenderer.receiveShadow = true;
			var pos:Vector3 = box.transform.position;
			pos.setValue(x, y, z);
			box.transform.position = pos;
			
			//创建刚体碰撞器
			var rigidBody:Rigidbody3D = box.addComponent(Rigidbody3D) as Rigidbody3D;
			//设置刚体的质量
			rigidBody.mass = 10;
			//设置刚体的摩擦力
			rigidBody.friction = 0.4;
			//设置刚体的弹力
			rigidBody.restitution = 0.2;
			//设置刚体的形状为盒型
			var boxShape:BoxColliderShape = new BoxColliderShape(2, 0.33, 0.5);
			rigidBody.colliderShape = boxShape;
		}
		
		public function addVerticalBox(x:Number, y:Number, z:Number):void {
			
			var mat:BlinnPhongMaterial = new BlinnPhongMaterial();
			Texture2D.load("res/threeDimen/Physics/plywood.jpg", Handler.create(null, function(tex:Texture2D):void {
				mat.albedoTexture = tex;
			}));
			
			var box:MeshSprite3D = scene.addChild(new MeshSprite3D(PrimitiveMesh.createBox(0.5, 0.33, 2))) as MeshSprite3D;
			box.meshRenderer.material = mat;
			box.meshRenderer.castShadow = true;
			box.meshRenderer.receiveShadow = true;
			var pos:Vector3 = box.transform.position;
			pos.setValue(x, y, z);
			box.transform.position = pos;
			
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
			//获取鼠标的位置
			posX = point.x = MouseManager.instance.mouseX;
			posY = point.y = MouseManager.instance.mouseY;
			//计算从屏幕空间生成的射线
			camera.viewportPointToRay(point, ray);
			//射线检测，检测第一个碰撞到的物体
			scene.physicsSimulation.rayCast(ray, _outHitResult);
			if (_outHitResult.succeeded) {
				//创建刚体碰撞器
				var collider:Rigidbody3D = _outHitResult.collider as Rigidbody3D;
				hasSelectedSprite = collider.owner as Sprite3D;
				hasSelectedRigidBody = collider;
				//设置刚体的角因子
				collider.angularFactor = Vector3._ZERO;
				//设置刚体的角速度
				collider.angularVelocity = Vector3._ZERO;
				//设置刚体的线性因子
				collider.linearFactor = Vector3._ZERO;
				//设置刚体的线速度
				collider.linearVelocity = Vector3._ZERO;
			}
			Laya.stage.on(Event.MOUSE_MOVE, this, onMouseMove);
		}
		
		public function onMouseMove():void {
			
			delX = MouseManager.instance.mouseX - posX;
			delY = MouseManager.instance.mouseY - posY;
			if (hasSelectedSprite) {
				var linearVelocity:Vector3 = hasSelectedRigidBody.linearVelocity;
				linearVelocity.setValue(delX / 4, 0, delY / 4);
				hasSelectedRigidBody.linearVelocity = linearVelocity;
			}
			posX = MouseManager.instance.mouseX;
			posY = MouseManager.instance.mouseY;
		}
		
		public function onMouseUp():void {
			Laya.stage.off(Event.MOUSE_MOVE, this, onMouseMove);
			if (hasSelectedSprite) {
				hasSelectedRigidBody.angularFactor = Vector3._ONE;
				hasSelectedRigidBody.linearFactor = Vector3._ONE;
				hasSelectedSprite = null;
			}
		}
		
		public function onMouseOut():void {
			Laya.stage.off(Event.MOUSE_MOVE, this, onMouseMove);
			if (hasSelectedSprite) {
				hasSelectedRigidBody.angularFactor = Vector3._ONE;
				hasSelectedRigidBody.linearFactor = Vector3._ONE;
				hasSelectedSprite = null;
			}
		}
	}
}