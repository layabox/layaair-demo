/**
 * 示例基本碰撞
 */
class CannonPhysicsWorld_PhysicsProperty{
    constructor(){
        Laya3D.init(0, 0, null, Laya.Handler.create(null, () => {
			Laya.Config3D.useCannonPhysics = true;
			Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
			Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
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
            var plane = this.scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createPlane(20, 20, 10, 10)));
			var planeMat = new Laya.BlinnPhongMaterial();
			Laya.Texture2D.load("res/threeDimen/Physics/grass.png", Laya.Handler.create(this, function (tex) {
				planeMat.albedoTexture = tex;
            }));
			//设置材质
            plane.meshRenderer.material = planeMat;
            var planeCollider = plane.addComponent(Laya.CannonPhysicsCollider);
			var planeShape = new Laya.CannonBoxColliderShape(20,0.01,20);
			planeCollider.restitution = 1.0;
			planeCollider.colliderShape = planeShape;
			planeCollider.friction = 0.1;
			//测试弹力
			//实际弹力是两个解除物理组件的弹力乘积
			this.addSphere(-4,5,0,0,0);
			this.addSphere(-2,5,0,0.5,0);
			this.addSphere(0,5,0,0.9,0);
			//测试滚动阻尼
			this.addSphere(2,1,0,0,0.5).linearVelocity=new Laya.Vector3(0,0,-5);
			this.addSphere(4,1,0,0,0.8).linearVelocity=(new Laya.Vector3(0,0,-5));
			//测试摩擦力区别于阻尼  是两个基础物理物体的摩擦力之和
			this.addBox(6,0.6,0,0.1).linearVelocity = new Laya.Vector3(0,0,-10);
			this.addBox(8,0.6,0,0.5).linearVelocity = new Laya.Vector3(0,0,-10);
		}));
    }
  
    addSphere(x,y,z,restitution,damp){
	   var radius = 1;
	   var sphere = this.scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createSphere(1)));
	   var sphereTransform = sphere.transform;
	   var pos =sphereTransform.position;
	   pos.setValue(x, y,z);
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
		 rigidBody.restitution = restitution;
		 rigidBody.angularDamping = damp;
		 rigidBody.linearDamping = 0.1;
		 return rigidBody;
	}
	addBox(x,y,z,friction) {
        var sX =1;
		var sY =1;
        var sZ =1;
         var box = this.scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(sX, sY, sZ)));
         var transform = box.transform;
         var pos = transform.position;
         pos.setValue(x,y,z);
		 transform.position = pos;
         //创建刚体碰撞器
         var rigidBody = box.addComponent(Laya.CannonRigidbody3D);
         //创建盒子形状碰撞器
         var boxShape = new Laya.CannonBoxColliderShape(sX, sY, sZ);
         //设置盒子的碰撞形状
         rigidBody.colliderShape = boxShape;
         //设置刚体的质量
		 rigidBody.mass = 10;
		 rigidBody.friction = friction;
		 return rigidBody;
    }

}

new CannonPhysicsWorld_PhysicsProperty();