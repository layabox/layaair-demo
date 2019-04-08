package LayaAir3D_Physics {
	import laya.d3.core.Camera;
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.Sprite3D;
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
	import laya.d3.physics.shape.ConeColliderShape;
	import laya.d3.physics.shape.CylinderColliderShape;
	import laya.d3.physics.shape.SphereColliderShape;
	import laya.d3.resource.models.PrimitiveMesh;
	import laya.d3.utils.Physics3DUtils;
	import laya.display.Stage;
	import laya.events.KeyBoardManager;
	import laya.utils.Handler;
	import laya.utils.Stat;
	import laya.webgl.resource.Texture2D;
	
	public class PhysicsWorld_CollisionFiflter {
		
		private var plane:MeshSprite3D;
		private var scene:Scene3D;
		private var camera:Camera;
		private var kinematicSphere:Sprite3D;
		
		private var translateW:Vector3 = new Vector3(0, 0, -0.2);
		private var translateS:Vector3 = new Vector3(0, 0, 0.2);
		private var translateA:Vector3 = new Vector3(-0.2, 0, 0);
		private var translateD:Vector3 = new Vector3(0.2, 0, 0);
		private var translateQ:Vector3 = new Vector3(-0.01, 0, 0);
		private var translateE:Vector3 = new Vector3(0.01, 0, 0);
		
		private var _albedoColor:Vector4 = new Vector4(1.0, 0.0, 0.0, 1.0);
		private var tmpVector:Vector3 = new Vector3(0, 0, 0);
		
		public function PhysicsWorld_CollisionFiflter() {
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
			camera.transform.translate(new Vector3(0, 8, 18));
			camera.transform.rotate(new Vector3(-30, 0, 0), true, false);
			//设置相机的清除颜色
			camera.clearColor = null;
			//创建平行光
			var directionLight:DirectionLight = scene.addChild(new DirectionLight()) as DirectionLight;
			directionLight.color = new Vector3(1, 1, 1);
			//设置平行光的方向
			var mat:Matrix4x4 = directionLight.transform.worldMatrix;
			mat.setForward(new Vector3(-1.0, -1.0, 1.0));
			directionLight.transform.worldMatrix=mat;
			
			//创建平面
			plane = scene.addChild(new MeshSprite3D(PrimitiveMesh.createPlane(20, 20, 10, 10))) as MeshSprite3D;
			var planeMat:BlinnPhongMaterial = new BlinnPhongMaterial();
			//加载纹理
			Texture2D.load("res/threeDimen/Physics/wood.jpg", Handler.create(this, function(tex:Texture2D):void {
				planeMat.albedoTexture = tex;
			}));
			//设置材质
			planeMat.tilingOffset = new Vector4(2, 2, 0, 0);
			plane.meshRenderer.material = planeMat;
			//为平面设置盒型碰撞器
			var staticCollider:PhysicsCollider = plane.addComponent(PhysicsCollider) as PhysicsCollider;
			var boxShape:BoxColliderShape = new BoxColliderShape(20, 0, 20);
			staticCollider.colliderShape = boxShape;
			
			addKinematicSphere();
			for (var i:int = 0; i < 20; i++) {
				addBox();
				addCapsule();
				addCone();
				addCylinder();
				addSphere();
			}
		}
		
		public function addKinematicSphere():void {
			//创建BlinnPhong材质
			var mat2:BlinnPhongMaterial = new BlinnPhongMaterial();
			//加载纹理
			Texture2D.load("res/threeDimen/Physics/plywood.jpg", Handler.create(this, function(tex:Texture2D):void {
				mat2.albedoTexture = tex;
			}));
			mat2.albedoColor = _albedoColor;
			//创建一个球
			var radius:Number = 0.8;
			var sphere:MeshSprite3D = scene.addChild(new MeshSprite3D(PrimitiveMesh.createSphere(radius))) as MeshSprite3D;
			sphere.meshRenderer.material = mat2;
			var pos:Vector3 = sphere.transform.position;
			pos.setValue(0, 0.8, 0);
			sphere.transform.position = pos;
			
			//创建刚体碰撞器
			var rigidBody:Rigidbody3D = sphere.addComponent(Rigidbody3D);
			//创建球形碰撞器
			var sphereShape:SphereColliderShape = new SphereColliderShape(radius);
			//设置刚体的碰撞形状
			rigidBody.colliderShape = sphereShape;
			//设置刚体的质量
			rigidBody.mass = 60;
			//设置当前刚体为运动学物体,仅可通过transform属性移动物体,而非其他力相关属性。
			rigidBody.isKinematic = true;
			//设置可以与其发生碰撞的碰撞组
			rigidBody.canCollideWith = Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER1 | Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER3 | Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER5;//只与自定义组135碰撞(如果多组采用位操作）
			
			kinematicSphere = sphere;
			//开启定时重复执行
			Laya.timer.frameLoop(1, this, onKeyDown);
		}
		
		private function onKeyDown():void {
			KeyBoardManager.hasKeyDown(87) && kinematicSphere.transform.translate(translateW);//W
			KeyBoardManager.hasKeyDown(83) && kinematicSphere.transform.translate(translateS);//S
			KeyBoardManager.hasKeyDown(65) && kinematicSphere.transform.translate(translateA);//A
			KeyBoardManager.hasKeyDown(68) && kinematicSphere.transform.translate(translateD);//D
			KeyBoardManager.hasKeyDown(81) && plane.transform.translate(translateQ);//Q
			KeyBoardManager.hasKeyDown(69) && plane.transform.translate(translateE);//E
		}
		
		public function addBox():void {
			var mat1:BlinnPhongMaterial = new BlinnPhongMaterial();
			Texture2D.load("res/threeDimen/Physics/rocks.jpg", Handler.create(this, function(tex:Texture2D):void {
				mat1.albedoTexture = tex;
			}));
			
			//随机生成盒子的位置
			var sX:int = Math.random() * 0.75 + 0.25;
			var sY:int = Math.random() * 0.75 + 0.25;
			var sZ:int = Math.random() * 0.75 + 0.25;
			//创建盒型MeshSprite3D
			var box:MeshSprite3D = scene.addChild(new MeshSprite3D(PrimitiveMesh.createBox(sX, sY, sZ))) as MeshSprite3D;
			//设置材质
			box.meshRenderer.material = mat1;
			var transform:Transform3D = box.transform;
			var pos:Vector3 = transform.position;
			pos.setValue(Math.random() * 16 - 8, sY / 2, Math.random() * 16 - 8);
			transform.position = pos;
			//设置欧拉旋转角
			var rotationEuler:Vector3 = transform.rotationEuler;
			rotationEuler.setValue(0, Math.random() * 360, 0);
			transform.rotationEuler = rotationEuler;
			//创建刚体碰撞器
			var rigidBody:Rigidbody3D = box.addComponent(Rigidbody3D);
			//创建盒型碰撞器
			var boxShape:BoxColliderShape = new BoxColliderShape(sX, sY, sZ);
			//设置刚体的碰撞形状
			rigidBody.colliderShape = boxShape;
			//设置刚体的质量
			rigidBody.mass = 10;
			//设置刚体所属的碰撞组
			rigidBody.collisionGroup = Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER1;//自定义组1
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
			pos.setValue(Math.random() * 4 - 2, 2, Math.random() * 4 - 2);
			transform.position = pos;
			//设置欧拉旋转角
			var rotationEuler:Vector3 = transform.rotationEuler;
			rotationEuler.setValue(Math.random() * 360, Math.random() * 360, Math.random() * 360);
			transform.rotationEuler = rotationEuler;
			
			var rigidBody:Rigidbody3D = capsule.addComponent(Rigidbody3D);
			var sphereShape:CapsuleColliderShape = new CapsuleColliderShape(raidius, height);
			rigidBody.colliderShape = sphereShape;
			rigidBody.mass = 10;
			rigidBody.collisionGroup = Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER2;//自定义组2,会跳过碰撞
		
		}
		
		public function addCone():void {
			var mat4:BlinnPhongMaterial = new BlinnPhongMaterial();
			Texture2D.load("res/threeDimen/Physics/steel2.jpg", Handler.create(this, function(tex:Texture2D):void {
				mat4.albedoTexture = tex;
			}));
			var raidius:int = Math.random() * 0.2 + 0.2;
			var height:int = Math.random() * 0.5 + 0.8;
			//创建圆锥MeshSprite3D
			var cone:MeshSprite3D = new MeshSprite3D(PrimitiveMesh.createCone(raidius, height));
			scene.addChild(cone);
			//设置材质
			cone.meshRenderer.material = mat4;
			//设置位置
			var transform:Transform3D = cone.transform;
			var pos:Vector3 = transform.position;
			pos.setValue(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
			transform.position = pos;
			
			//创建刚体碰撞器
			var rigidBody:Rigidbody3D = cone.addComponent(Rigidbody3D);
			//创建球型碰撞器
			var coneShape:ConeColliderShape = new ConeColliderShape(raidius, height);
			//设置刚体碰撞器的形状
			rigidBody.colliderShape = coneShape;
			//设置刚体碰撞器的质量
			rigidBody.mass = 10;
			rigidBody.collisionGroup = Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER3;//自定义组3
		}
		
		public function addCylinder():void {
			var mat5:BlinnPhongMaterial = new BlinnPhongMaterial();
			Texture2D.load("res/threeDimen/Physics/steel.jpg", Handler.create(this, function(tex:Texture2D):void {
				mat5.albedoTexture = tex;
			}));
			var raidius:int = Math.random() * 0.2 + 0.2;
			var height:int = Math.random() * 0.5 + 0.8;
			//创建圆锥MeshSprite3D
			var cylinder:MeshSprite3D = new MeshSprite3D(PrimitiveMesh.createCylinder(raidius, height));
			scene.addChild(cylinder);
			//设置材质
			cylinder.meshRenderer.material = mat5;
			var transform:Transform3D = cylinder.transform;
			var pos:Vector3 = transform.position;
			pos.setValue(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
			transform.position = pos;
			//设置欧拉旋转角
			var rotationEuler:Vector3 = transform.rotationEuler;
			rotationEuler.setValue(Math.random() * 360, Math.random() * 360, Math.random() * 360);
			transform.rotationEuler = rotationEuler;
			
			//创建刚体碰撞器
			var rigidBody:Rigidbody3D = cylinder.addComponent(Rigidbody3D);
			//创建球型碰撞器
			var cylinderShape:CylinderColliderShape = new CylinderColliderShape(raidius, height);
			//设置刚体碰撞器的形状
			rigidBody.colliderShape = cylinderShape;
			//设置刚体碰撞器的质量
			rigidBody.mass = 10;
			rigidBody.collisionGroup = Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER4;//自定义组4
		}
		
		public function addSphere():void {
			var mat2:BlinnPhongMaterial = new BlinnPhongMaterial();
			Texture2D.load("res/threeDimen/Physics/plywood.jpg", Handler.create(this, function(tex:Texture2D):void {
				mat2.albedoTexture = tex;
			}));
			
			//随机生成半径大小
			var radius:Number = Math.random() * 0.2 + 0.2;
			//创建球型MeshSprite3D
			var sphere:MeshSprite3D = scene.addChild(new MeshSprite3D(PrimitiveMesh.createSphere(radius))) as MeshSprite3D;
			//设置材质
			sphere.meshRenderer.material = mat2;
			var pos:Vector3 = sphere.transform.position;
			pos.setValue(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
			sphere.transform.position = pos;
			
			//添加刚体碰撞器
			var rigidBody:Rigidbody3D = sphere.addComponent(Rigidbody3D);
			//创建球型碰撞器
			var sphereShape:SphereColliderShape = new SphereColliderShape(radius);
			//设置刚体碰撞器的形状
			rigidBody.colliderShape = sphereShape;
			//设置刚体的质量
			rigidBody.mass = 10;
			rigidBody.collisionGroup = Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER5;//自定义组5
		}
	}
}