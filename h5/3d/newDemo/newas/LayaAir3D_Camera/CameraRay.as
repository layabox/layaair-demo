package LayaAir3D_Camera {
	import common.CameraMoveScript;
	import laya.d3.core.Camera;
	import laya.d3.core.MeshSprite3D;
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
	import laya.d3.physics.shape.CapsuleColliderShape;
	import laya.d3.physics.shape.ConeColliderShape;
	import laya.d3.physics.shape.CylinderColliderShape;
	import laya.d3.physics.shape.SphereColliderShape;
	import laya.d3.resource.models.PrimitiveMesh;
	import laya.display.Stage;
	import laya.events.Event;
	import laya.events.MouseManager;
	import laya.utils.Handler;
	import laya.utils.Stat;
	import laya.webgl.resource.Texture2D;
	
	/**
	 * ...
	 * @author zqx
	 */
	public class CameraRay {
		private var scene:Scene3D;
		private var camera:Camera;
		private var _ray:Ray;
		private var _outHitResult:HitResult = new HitResult();
		private var outs:Vector.<HitResult> = new Vector.<HitResult>;
		private var posX:Number = 0.0;
		private var posY:Number = 0.0;
		private var point:Vector2 = new Vector2();
		
		private var _translate:Vector3 = new Vector3(0, 6, 9.5);
		private var _rotation:Vector3 = new Vector3( -15, 0, 0);
		private var _forward:Vector3 = new Vector3( -1.0, -1.0, -1.0);
		private var _tilingOffset:Vector4 = new Vector4(10, 10, 0, 0);

		private var tmpVector:Vector3 = new Vector3(0, 0, 0);
		private var tmpVector2:Vector3 = new Vector3(0, 0, 0);
		
		public function CameraRay() {
			//初始化引擎
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			//显示性能面板
			Stat.show();
			
			scene = Laya.stage.addChild(new Scene3D()) as Scene3D;
			
			//初始化照相机
			camera = scene.addChild(new Camera(0, 0.1, 100)) as Camera;
			camera.transform.translate(_translate);
			camera.transform.rotate(_rotation, true, false);
			camera.addComponent(CameraMoveScript);
			camera.clearColor = null;
			
			//方向光
			var directionLight:DirectionLight = scene.addChild(new DirectionLight()) as DirectionLight;
			directionLight.color.setValue(0.6, 0.6, 0.6);
			//设置平行光的方向
			var mat:Matrix4x = directionLight.transform.worldMatrix;
			mat.setForward(_forward);
			directionLight.transform.worldMatrix=mat;
			
			//平面
			var plane:MeshSprite3D = scene.addChild(new MeshSprite3D(PrimitiveMesh.createPlane(10, 10, 10, 10))) as MeshSprite3D;
			var planeMat:BlinnPhongMaterial = new BlinnPhongMaterial();
			Texture2D.load("res/threeDimen/Physics/grass.png", Handler.create(null, function(tex:Texture2D):void {
				planeMat.albedoTexture = tex;
			}));
			//设置纹理平铺和偏移
			planeMat.tilingOffset = _tilingOffset;
			//设置材质
			plane.meshRenderer.material = planeMat;
			
			//平面添加物理碰撞体组件
			var planeStaticCollider:PhysicsCollider = plane.addComponent(PhysicsCollider);
			//创建盒子形状碰撞器
			var planeShape:BoxColliderShape = new BoxColliderShape(10, 0, 10);
			//物理碰撞体设置形状
			planeStaticCollider.colliderShape = planeShape;
			//物理碰撞体设置摩擦力
			planeStaticCollider.friction = 2;
			//物理碰撞体设置弹力
			planeStaticCollider.restitution = 0.3;
			
			//添加鼠标事件
			addMouseEvent();
			//射线初始化（必须初始化）
			_ray = new Ray(new Vector3(0, 0, 0), new Vector3(0, 0, 0));
		}
		
		public function addBoxXYZ(x:int, y:int, z:int ):void {
			var mat1:BlinnPhongMaterial = new BlinnPhongMaterial();
			Texture2D.load("res/threeDimen/Physics/rocks.jpg", Handler.create(null, function(tex:Texture2D):void {
				mat1.albedoTexture = tex;
			}));
			
			//随机生成坐标值
			var sX:int = Math.random() * 0.75 + 0.25;
			var sY:int = Math.random() * 0.75 + 0.25;
			var sZ:int = Math.random() * 0.75 + 0.25;
			//创建盒型MeshSprite3D
			var box:MeshSprite3D = scene.addChild(new MeshSprite3D(PrimitiveMesh.createBox(sX, sY, sZ))) as MeshSprite3D;
			//设置材质
			box.meshRenderer.material = mat1;
			tmpVector.setValue(x, y, z);
			box.transform.position = tmpVector;
			//设置欧拉角
			tmpVector2.setValue(Math.random() * 360, Math.random() * 360, Math.random() * 360);
			box.transform.rotationEuler = tmpVector2;
			//创建刚体碰撞器
			var rigidBody:Rigidbody3D = box.addComponent(Rigidbody3D);
			//创建盒子形状碰撞器
			var boxShape:BoxColliderShape = new BoxColliderShape(sX, sY, sZ);
			//设置盒子的碰撞形状
			rigidBody.colliderShape = boxShape;
			//设置刚体的质量
			rigidBody.mass = 10;
		}
		
		private function addMouseEvent():void {
			//鼠标事件监听
			Laya.stage.on(Event.MOUSE_DOWN, this, onMouseDown);
		}
		
		private function onMouseDown():void {
			posX = point.x = MouseManager.instance.mouseX;
			posY = point.y = MouseManager.instance.mouseY;
			//产生射线
			camera.viewportPointToRay(point, _ray);
			//拿到射线碰撞的物体
			scene.physicsSimulation.rayCastAll(_ray, outs);
			
			debugger;
			//如果碰撞到物体
			if (outs.length != 0) {
				
				for (var i:int = 0; i < outs.length; i++){
					//在射线击中的位置添加一个立方体
					addBoxXYZ(outs[i].point.x, outs[i].point.y, outs[i].point.z );
				}		
			}
		
		}
	
	}

}