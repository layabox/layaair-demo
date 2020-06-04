package  {
	//import common.CameraMoveScript;
	import laya.d3.core.Camera;
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.Transform3D;
	import laya.d3.core.light.DirectionLight;
	import laya.d3.core.material.BlinnPhongMaterial;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Matrix4x4;
	import laya.d3.math.Ray;
	import laya.d3.math.Vector2;
	import laya.d3.math.Vector3;
	import laya.d3.math.Vector4;
	import laya.d3.physicsCannon.CannonHitResult;
	import laya.d3.physicsCannon.CannonPhysicsCollider;
	import laya.d3.physicsCannon.CannonRigidbody3D;
	import laya.d3.physicsCannon.shape.CannonBoxColliderShape;
	import laya.d3.physicsCannon.shape.CannonCompoundColliderShape;
	import laya.d3.physicsCannon.shape.CannonSphereColliderShape;
	import laya.d3.resource.models.PrimitiveMesh;
	import laya.display.Stage;
	import laya.events.Event;
	import laya.events.MouseManager;
	import laya.resource.Texture2D;
	import laya.utils.Handler;
	import laya.utils.Stat;

	
	/**
	 * ...
	 * @author zqx
	 */
	public class Main {		
		private var scene:Scene3D;
		private var mat1:BlinnPhongMaterial;
		private var mat2: BlinnPhongMaterial;
		private var mat3: BlinnPhongMaterial;
		private var camera:Camera;
		private var point:Vector2 = new Vector2();
		private var ray: Ray = new Ray(new Vector3(),new Vector3());
		private var colorRed:Vector4 = new Vector4(1,0,0,1);
		private var colorWrite:Vector4 = new Vector4(1,1,1,1);
		private var oldSelectMesh:MeshSprite3D;
			
		public function Main() {
			Laya3D.init(0, 0, null, Handler.create(null, () => {
				Config3D.useCannonPhysics = true;
				Laya.stage.scaleMode = Stage.SCALE_FULL;
				Laya.stage.screenMode = Stage.SCREEN_NONE;
				//显示性能面板
				Stat.show();
				this.scene = Laya.stage.addChild(new Scene3D()) as Scene3D;
				//初始化照相机
				camera = this.scene.addChild(new Camera(0, 0.1, 100)) as Camera;
				camera.transform.translate(new Vector3(0, 6, 9.5));
				camera.transform.rotate(new Vector3(-15, 0, 0), true, false);
				//camera.addComponent(CameraMoveScript);
				camera.clearColor = null;

				//方向光
				var directionLight: DirectionLight = this.scene.addChild(new DirectionLight()) as DirectionLight;
				directionLight.color = new Vector3(0.6, 0.6, 0.6);
				//设置平行光的方向
				var mat: Matrix4x4 = directionLight.transform.worldMatrix;
				mat.setForward(new Vector3(-1.0, -1.0, -1.0));
				directionLight.transform.worldMatrix = mat;
				var plane: MeshSprite3D = this.scene.addChild(new MeshSprite3D(PrimitiveMesh.createPlane(10, 10, 10, 10))) as MeshSprite3D;
				var planeMat: BlinnPhongMaterial = new BlinnPhongMaterial();
				Texture2D.load("res/threeDimen/Physics/grass.png", Handler.create(this, function (tex: Texture2D): void {
					planeMat.albedoTexture = tex;
				}));
				//设置纹理平铺和偏移
				var tilingOffset: Vector4 = planeMat.tilingOffset;
				tilingOffset.setValue(5, 5, 0, 0);
				planeMat.tilingOffset = tilingOffset;
				//设置材质
				plane.meshRenderer.material = planeMat;
				var planeCollider:CannonPhysicsCollider = plane.addComponent(CannonPhysicsCollider);
				var planeShape:CannonBoxColliderShape = new CannonBoxColliderShape(10,0.01,10);
				planeCollider.colliderShape = planeShape;
				planeCollider.friction = 2;
				planeCollider.restitution = 0.3;
				this.mat1 = new BlinnPhongMaterial();
				this.mat2 = new BlinnPhongMaterial();
				this.mat3 = new BlinnPhongMaterial();
				Texture2D.load("res/threeDimen/Physics/rocks.jpg", Handler.create(this, function (tex: Texture2D): void {
					this.mat1.albedoTexture = tex;
				}));

				Texture2D.load("res/threeDimen/Physics/plywood.jpg", Handler.create(this, function (tex: Texture2D): void {
					this.mat2.albedoTexture = tex;
				}));

				Texture2D.load("res/threeDimen/Physics/wood.jpg", Handler.create(this, function (tex: Texture2D): void {
					this.mat3.albedoTexture = tex;
				}));

				this.addBox();
				this.addSphere();
				this.addCompoundColliderShape();
				Laya.stage.on(Event.MOUSE_DOWN, this, this.mouseDown);
            
        	}));
		}
		
		public function addBox():void{
			var sX: Number =1;
			var sY: Number =1;
			var sZ: Number =1;
			//创建盒型MeshSprite3D
			var box: MeshSprite3D = this.scene.addChild(new MeshSprite3D(PrimitiveMesh.createBox(sX, sY, sZ))) as MeshSprite3D;
			box.name = "box";
			//设置材质
			box.meshRenderer.material = this.mat1;
			var transform: Transform3D = box.transform;
			var pos: Vector3 = transform.position;
			pos.setValue(-2,5,0);
			transform.position = pos;
			//创建刚体碰撞器
			var rigidBody: CannonRigidbody3D = box.addComponent(CannonRigidbody3D);
			//创建盒子形状碰撞器
			var boxShape: CannonBoxColliderShape = new CannonBoxColliderShape(sX, sY, sZ);
			//设置盒子的碰撞形状
			rigidBody.colliderShape = boxShape;
			//设置刚体的质量
			rigidBody.mass = 10;
		}

		public function addSphere():void {
			var radius:Number = 1;
			var sphere:MeshSprite3D = this.scene.addChild(new MeshSprite3D(PrimitiveMesh.createSphere(1))) as MeshSprite3D;
			sphere.name = "sphere";
			sphere.meshRenderer.material = this.mat2;
			var sphereTransform:Transform3D = sphere.transform;
			var pos:Vector3 =sphereTransform.position;
			pos.setValue(0,5,0);
			
			sphereTransform.position = pos;
			//创建刚体碰撞器
			var rigidBody: CannonRigidbody3D = sphere.addComponent(CannonRigidbody3D);
			//创建盒子形状碰撞器
			var sphereShape: CannonSphereColliderShape = new CannonSphereColliderShape(radius);
			//设置盒子的碰撞形状
			rigidBody.colliderShape = sphereShape;
			//设置刚体的质量
			rigidBody.mass = 10;
		}
		public function addCompoundColliderShape():void{
			var x = Math.random() * 4 - 2;
			var y = 10; 
			var z = Math.random() * 4 - 2;
			
			var mesh:MeshSprite3D = this.addMeshBox(x,y,z);
			var scale:Vector3 = mesh.transform.getWorldLossyScale();
			//测试Scale
			scale.setValue(0.5,0.5,0.5);
			mesh.transform.setWorldLossyScale(scale) ;
			this.scene.addChild(mesh);
			//创建刚体碰撞器
			var rigidBody: CannonRigidbody3D = mesh.addComponent(CannonRigidbody3D);
			//创建盒子形状碰撞器
			var boxShape0: CannonBoxColliderShape = new CannonBoxColliderShape(1, 1, 1);
			var boxShape1: CannonBoxColliderShape = new CannonBoxColliderShape(1, 1, 1);
			var boxShape2: CannonBoxColliderShape = new CannonBoxColliderShape(1, 1, 1);
			var boxShape3: CannonBoxColliderShape = new CannonBoxColliderShape(1, 1, 1);

			var boxCompoundShape:CannonCompoundColliderShape = new CannonCompoundColliderShape();
			boxCompoundShape.addChildShape(boxShape0,new Vector3(0.5,0.5,0));
			boxCompoundShape.addChildShape(boxShape1,new Vector3(0.5,-0.5,0));
			boxCompoundShape.addChildShape(boxShape2,new Vector3(-0.5,0.5,0));
			boxCompoundShape.addChildShape(boxShape3,new Vector3(-0.5,-0.5));
			//设置盒子的碰撞形状
			rigidBody.colliderShape = boxCompoundShape;
			//设置刚体的质量
			rigidBody.mass = 10;
		}
		public function addMeshBox(x:number,y:number,z:number):MeshSprite3D{
			var sX: number =2;
			var sY: number =2;
			var sZ: number =1;
			//创建盒型MeshSprite3D
			var box: MeshSprite3D = this.scene.addChild(new MeshSprite3D(PrimitiveMesh.createBox(sX, sY, sZ))) as MeshSprite3D;
			//设置材质
			box.meshRenderer.material = this.mat3;
			var transform: Transform3D = box.transform;
			var pos: Vector3 = transform.position;
			pos.setValue(x,y,z);
			transform.position = pos;
			return box;
		}

		public function  mouseDown(){
			this.point.x = MouseManager.instance.mouseX;
			this.point.y = MouseManager.instance.mouseY;
			//产生射线
			this.camera.viewportPointToRay(this.point, this.ray);
			var out: CannonHitResult = new CannonHitResult();
			this.scene.cannonPhysicsSimulation.rayCast(this.ray,out);
			if(out.succeeded)
			{

				var selectSprite3D:MeshSprite3D = out.collider.owner;
				selectSprite3D.meshRenderer.sharedMaterial.albedoColor = this.colorRed;
				if(this.oldSelectMesh)
				if(selectSprite3D!=this.oldSelectMesh)
				this.oldSelectMesh.meshRenderer.sharedMaterial.albedoColor = this.colorWrite;
				this.oldSelectMesh = selectSprite3D;
			}
		
		}
		

	}


}