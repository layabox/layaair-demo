import CameraMoveScript from "./common/CameraMoveScript"
class PhysicsWorld_ContinueCollisionDetection
{
    private scene:Laya.Scene3D;
    constructor()
    {
            Laya3D.init(0, 0);
			Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
			Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
			Laya.Stat.show();
			
			this.scene = Laya.stage.addChild(new Laya.Scene3D()) as Laya.Scene3D;
			this.scene.physicsSimulation.gravity = new Laya.Vector3(0, -98.0, 0);
			
			//初始化照相机
			var camera:Laya.Camera = this.scene.addChild(new Laya.Camera(0, 0.1, 100)) as Laya.Camera;
			camera.transform.translate(new Laya.Vector3(0, 6, 9.5));
			camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
			camera.addComponent(CameraMoveScript);
			camera.clearColor = null;
			
			//方向光
			var directionLight:Laya.DirectionLight = this.scene.addChild(new Laya.DirectionLight()) as Laya.DirectionLight;
			directionLight.color = new Laya.Vector3(0.6, 0.6, 0.6);
			directionLight.transform.worldMatrix.setForward(new Laya.Vector3(-1.0, -1.0, -1.0));
			
			//平面
			var plane:Laya.MeshSprite3D = this.scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createPlane(10, 10, 10, 10))) as Laya.MeshSprite3D;
			var planeMat:Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
			Laya.Texture2D.load("res/threeDimen/Physics/grass.png", Laya.Handler.create(null, function(tex:Laya.Texture2D):void {
				planeMat.albedoTexture = tex;
			}));
			planeMat.tilingOffset = new Laya.Vector4(10, 10, 0, 0);
			plane.meshRenderer.material = planeMat;
			
			var planeStaticCollider:Laya.PhysicsCollider = plane.addComponent(Laya.PhysicsCollider);
			var planeShape:Laya.BoxColliderShape = new Laya.BoxColliderShape(10, 0, 10);
			planeStaticCollider.colliderShape = planeShape;
			planeStaticCollider.friction = 2;
			planeStaticCollider.restitution = 0.3;
			Laya.timer.loop(200, this, function():void {
				this.addSphere();
            });
            
    }
    public addSphere():void {
        var mat2:Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
		Laya.Texture2D.load("res/threeDimen/Physics/plywood.jpg", Laya.Handler.create(null, function(tex:Laya.Texture2D):void {
			mat2.albedoTexture = tex;
		}));
        
        var radius:number = Math.random() * 0.2 + 0.2;
        var sphere:Laya.MeshSprite3D = this.scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createSphere(radius))) as Laya.MeshSprite3D;
        sphere.meshRenderer.material = mat2;
        sphere.transform.position = new Laya.Vector3(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
        
        var rigidBody:Laya.Rigidbody3D = sphere.addComponent(Laya.Rigidbody3D);
        var sphereShape:Laya.SphereColliderShape = new Laya.SphereColliderShape(radius);
        rigidBody.colliderShape = sphereShape;
        rigidBody.mass = 10;
        rigidBody.ccdSweptSphereRadius = radius;
        rigidBody.ccdMotionThreshold = 0.0001;
    }
}
new PhysicsWorld_ContinueCollisionDetection;