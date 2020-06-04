/**
 * 示例基本碰撞
 */
class CannonPhysicsWorld_BaseCollider{
    constructor(){
		
        Laya3D.init(0, 0, null, Laya.Handler.create(null, () => {
			Laya.Config3D.useCannonPhysics = true;
			Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
			Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
			//显示性能面板
			Laya.Stat.show();
			this.scene = Laya.stage.addChild(new Laya.Scene3D());
			//初始化照相机
			var camera = this.scene.addChild(new Laya.Camera(0, 0.1, 100));
			camera.transform.translate(new Laya.Vector3(0, 6, 9.5));
			camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
			camera.addComponent(CameraMoveScript);
			camera.clearColor = null;

			//方向光
			var directionLight = this.scene.addChild(new Laya.DirectionLight());
			directionLight.color = new Laya.Vector3(0.6, 0.6, 0.6);
			//设置平行光的方向
			var mat = directionLight.transform.worldMatrix;
			mat.setForward(new Laya.Vector3(-1.0, -1.0, -1.0));
            directionLight.transform.worldMatrix = mat;
            var plane = this.scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createPlane(10, 10, 10, 10)));
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
            var planeShape = new Laya.CannonBoxColliderShape(10,0.01,10);
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
            Laya.timer.loop(1000, this, function () {
				var random = Math.random();
				if(random<0.33)
				this.addCompoundColliderShape();
				else if(random<0.66)
				this.addSphere();
				else
				this.addBox();
            });
            
        }));
    }
    addBox(){
        var sX =1;
		var sY =1;
        var sZ =1;
         //创建盒型MeshSprite3D
         var box = this.scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(sX, sY, sZ)));
         //设置材质
         box.meshRenderer.material = this.mat1;
         var transform = box.transform;
         var pos = transform.position;
         pos.setValue(Math.random() * 2 - 2, 10, Math.random() * 2 - 2);
		 transform.position = pos;
		 
		 var scale = transform.getWorldLossyScale();
		 scale.setValue(Math.random(),Math.random(),Math.random());
		 transform.setWorldLossyScale( scale);
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
	   sphere.meshRenderer.material = this.mat2;
	   var sphereTransform = sphere.transform;
	   var pos =sphereTransform.position;
	   pos.setValue(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
	   var scale = sphereTransform.getWorldLossyScale();
	   scale.setValue(0.5,0.5,0.5);
	   sphereTransform.setWorldLossyScale(scale);

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
		var x = Math.random() * 4 - 2;
		var y = 10; 
		var z = Math.random() * 4 - 2;
		
		var mesh = this.addMeshBox(x,y,z);
		var scale = mesh.transform.getWorldLossyScale();
		//测试Scale
		scale.setValue(0.5,0.5,0.5);
		mesh.transform.setWorldLossyScale(scale) ;
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
}

new CannonPhysicsWorld_BaseCollider();