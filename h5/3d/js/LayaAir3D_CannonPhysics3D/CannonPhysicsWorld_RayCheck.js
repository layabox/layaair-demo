/**
 * 射线示例测试   点击左键 选中的物体会变红
 */
class CannonPhysicsWorld_RayCheck{
    constructor(){
		
        Laya3D.init(0, 0, null, Laya.Handler.create(null, () => {
			Laya.Config3D.useCannonPhysics = true;
			Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
			Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
			//显示性能面板
			Laya.Stat.show();
			this.point = new Laya.Vector2();
			this.ray = new Laya.Ray(new Laya.Vector3(),new Laya.Vector3());
			this.colorRed = new Laya.Vector4(1,0,0,1);
			this.colorWrite = new Laya.Vector4(1,1,1,1);

			this.scene = Laya.stage.addChild(new Laya.Scene3D());

			//初始化照相机
			this.camera = this.scene.addChild(new Laya.Camera(0, 0.1, 100));
			this.camera.transform.translate(new Laya.Vector3(0, 6, 9.5));
			this.camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
			this.camera.addComponent(CameraMoveScript);
			this.camera.clearColor = null;

			//方向光
			var directionLight = this.scene.addChild(new Laya.DirectionLight());
			directionLight.color = new Laya.Vector3(0.6, 0.6, 0.6);
			//设置平行光的方向
			var mat = directionLight.transform.worldMatrix;
			mat.setForward(new Laya.Vector3(-1.0, -1.0, -1.0));
            directionLight.transform.worldMatrix = mat;
            var plane = this.scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createPlane(20, 20, 10, 10)));
			var planeMat = new Laya.BlinnPhongMaterial();
			Laya.Texture2D.load("res/threeDimen/Physics/grass.png", Laya.Handler.create(this, function (tex) {
				planeMat.albedoTexture = tex;
            }));
            //设置纹理平铺和偏移
			var tilingOffset = planeMat.tilingOffset;
			tilingOffset.setValue(5, 5, 0, 0);
			planeMat.tilingOffset = tilingOffset;
			//设置材质
            plane.meshRenderer.material = planeMat;
            var planeCollider = plane.addComponent(Laya.CannonPhysicsCollider);
            var planeShape = new Laya.CannonBoxColliderShape(20,0.01,20);
            planeCollider.colliderShape = planeShape;
            planeCollider.friction = 2;
            planeCollider.restitution = 0.3;
            this.mat1 = new Laya.BlinnPhongMaterial();
			this.mat2 = new Laya.BlinnPhongMaterial();
			this.mat3 = new Laya.BlinnPhongMaterial();
            Laya.Texture2D.load("res/threeDimen/Physics/rocks.jpg", Laya.Handler.create(this, function (tex) {
				this.mat1.albedoTexture = tex;
			}));

			Laya.Texture2D.load("res/threeDimen/Physics/plywood.jpg", Laya.Handler.create(this, function (tex) {
				this.mat2.albedoTexture = tex;
			}));

			Laya.Texture2D.load("res/threeDimen/Physics/wood.jpg", Laya.Handler.create(this, function (tex) {
				this.mat3.albedoTexture = tex;
			}));
            
			this.addBox();
			this.addSphere();
			this.addCompoundColliderShape();
			Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
        }));
    }
    addBox(){
        var sX =1;
		var sY =1;
        var sZ =1;
         //创建盒型MeshSprite3D
		 var box = this.scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(sX, sY, sZ)));
		 box.name = "box";
         //设置材质
         box.meshRenderer.material = this.mat1;
         var transform = box.transform;
         var pos = transform.position;
         pos.setValue(-5,5,0);
		 transform.position = pos;
         //创建刚体碰撞器
         var rigidBody = box.addComponent(Laya.CannonRigidbody3D);
         //创建盒子形状碰撞器
         var boxShape = new Laya.CannonBoxColliderShape(sX, sY, sZ);
         //设置盒子的碰撞形状
         rigidBody.colliderShape = boxShape;
         //设置刚体的质量
         rigidBody.mass = 10;
    }
    addSphere(){
	   var radius = 1;
	   var sphere = this.scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createSphere(1)));
	   sphere.name = "sphere";
	   sphere.meshRenderer.material = this.mat2;
	   var sphereTransform = sphere.transform;
	   var pos =sphereTransform.position;
	   pos.setValue(0,5,0);
	
	   sphereTransform.position = pos;
	     //创建刚体碰撞器
         var rigidBody = sphere.addComponent(Laya.CannonRigidbody3D);
         //创建盒子形状碰撞器
         var sphereShape = new Laya.CannonSphereColliderShape(radius);
         //设置盒子的碰撞形状
         rigidBody.colliderShape = sphereShape;
         //设置刚体的质量
         rigidBody.mass = 10;
	}
	addCompoundColliderShape(){
		var mesh = this.addMeshBox(5,5,0);
		mesh.name = "compound"
		var scale = mesh.transform.getWorldLossyScale();
		//测试Scale
		scale.setValue(0.5,0.5,0.5);
		mesh.transform.setWorldLossyScale(scale);
		this.scene.addChild(mesh);
		//创建刚体碰撞器
         var rigidBody = mesh.addComponent(Laya.CannonRigidbody3D);
         //创建盒子形状碰撞器
		 var boxShape0 = new Laya.CannonBoxColliderShape(1, 1, 1);
		 var boxShape1 = new Laya.CannonBoxColliderShape(1, 1, 1);
		 var boxShape2 = new Laya.CannonBoxColliderShape(1, 1, 1);
		 var boxShape3 = new Laya.CannonBoxColliderShape(1, 1, 1);

		var boxCompoundShape = new Laya.CannonCompoundColliderShape();
		boxCompoundShape.addChildShape(boxShape0,new Laya.Vector3(0.5,0.5,0));
		boxCompoundShape.addChildShape(boxShape1,new Laya.Vector3(0.5,-0.5,0));
		boxCompoundShape.addChildShape(boxShape2,new Laya.Vector3(-0.5,0.5,0));
		boxCompoundShape.addChildShape(boxShape3,new Laya.Vector3(-0.5,-0.5));
         //设置盒子的碰撞形状
         rigidBody.colliderShape = boxCompoundShape;
         //设置刚体的质量
         rigidBody.mass = 10;
	}
	addMeshBox(x,y,z){
		var sX =2;
		var sY =2;
        var sZ =1;
         //创建盒型MeshSprite3D
         var box = this.scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(sX, sY, sZ)));
         //设置材质
         box.meshRenderer.material = this.mat3;
         var transform = box.transform;
         var pos = transform.position;
         pos.setValue(x,y,z);
		 transform.position = pos;
		 return box;
	}

	mouseDown(){
		this.point.x = Laya.MouseManager.instance.mouseX;
		this.point.y = Laya.MouseManager.instance.mouseY;
		//产生射线
		this.camera.viewportPointToRay(this.point, this.ray);
		var out = new Laya.CannonHitResult();
		this.scene.cannonPhysicsSimulation.rayCast(this.ray,out);
		if(out.succeeded)
		{

			var selectSprite3D = out.collider.owner;
			selectSprite3D.meshRenderer.sharedMaterial.albedoColor = this.colorRed;
			if(this.oldSelectMesh)
			if(selectSprite3D!=this.oldSelectMesh)
			this.oldSelectMesh.meshRenderer.sharedMaterial.albedoColor = this.colorWrite;
			this.oldSelectMesh = selectSprite3D;
		}
		
	}
}

new CannonPhysicsWorld_RayCheck();