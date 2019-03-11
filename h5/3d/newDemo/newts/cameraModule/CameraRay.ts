import CameraMoveScript from "./common/CameraMoveScript"
class CameraRay {
	private scene:Laya.Scene3D;
	private camera:Laya.Camera;
	private _ray:Laya.Ray;
	private _outHitResult:Laya.HitResult = new Laya.HitResult();
	private outs:Array<Laya.HitResult> = new Array<Laya.HitResult>();
	private posX:number = 0.0;
	private posY:number = 0.0;
	private point:Laya.Vector2 = new Laya.Vector2();
	constructor() {
		//初始化引擎
		Laya3D.init(0, 0);
		Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
		Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
		//显示性能面板
		Laya.Stat.show();
		
		this.scene = new Laya.Scene3D();
		Laya.stage.addChild(this.scene);
		
		//初始化照相机
		this.camera = new Laya.Camera(0, 0.1, 100);
		this.scene.addChild(this.camera);
		this.camera.transform.translate(new Laya.Vector3(0, 6, 9.5));
		this.camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
		this.camera.addComponent(CameraMoveScript);
		this.camera.clearColor = null;
		
		//方向光
		var directionLight = new Laya.DirectionLight();
		this.scene.addChild(directionLight);
		directionLight.color = new Laya.Vector3(0.6, 0.6, 0.6);
		directionLight.transform.worldMatrix.setForward(new Laya.Vector3(-1.0, -1.0, -1.0));
		
		//平面
		var plane = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createPlane(10, 10, 10, 10));
		this.scene.addChild(plane);
		var planeMat = new Laya.BlinnPhongMaterial();
		Laya.Texture2D.load("../res/threeDimen/Physics/grass.png", Laya.Handler.create(null, function(tex):void {
			planeMat.albedoTexture = tex;
		}));
		//设置纹理平铺和偏移
		planeMat.tilingOffset = new Laya.Vector4(10, 10, 0, 0);
		//设置材质
		plane.meshRenderer.material = planeMat;
		
		//平面添加物理碰撞体组件
		var planeStaticCollider = plane.addComponent(Laya.PhysicsCollider) as Laya.PhysicsCollider;
		//创建盒子形状碰撞器
		var planeShape = new Laya.BoxColliderShape(10, 0, 10);
		//物理碰撞体设置形状
		planeStaticCollider.colliderShape = planeShape;
		//物理碰撞体设置摩擦力
		planeStaticCollider.friction = 2;
		//物理碰撞体设置弹力
		planeStaticCollider.restitution = 0.3;
		
		//随机生成精灵
		this.randomAddPhysicsSprite();
		//添加鼠标事件
		this.addMouseEvent();
		//射线初始化（必须初始化）
		this._ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 0));
	}
	
	public randomAddPhysicsSprite() {
		Laya.timer.loop(1000, this, function() {
			var random:number = Math.floor(Math.random() * 5) % 5;
			switch (random) {
			case 0: 
				this.addBox();
				break;
			case 1: 
				this.addSphere();
				break;
			case 2: 
				this.addCapsule();
				break;
			case 3:
				this.addCone();
				break;
			case 4:
				this.addCylinder();
				break;
			default: 
				break;
			}
		});
	}
	
	public addBox():void {
		var mat1 = new Laya.BlinnPhongMaterial();
		Laya.Texture2D.load("../res/threeDimen/Physics/rocks.jpg", Laya.Handler.create(null, function(tex) {
			mat1.albedoTexture = tex;
		}));
		
		//随机生成坐标值
		var sX = Math.random() * 0.75 + 0.25;
		var sY = Math.random() * 0.75 + 0.25;
		var sZ = Math.random() * 0.75 + 0.25;
		//创建盒型MeshSprite3D
		var box = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(sX, sY, sZ));
		this.scene.addChild(box);
		//设置材质
		box.meshRenderer.material = mat1;
		box.transform.position = new Laya.Vector3(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
		//设置欧拉角
		box.transform.rotationEuler = new Laya.Vector3(Math.random() * 360, Math.random() * 360, Math.random() * 360);
		//创建刚体碰撞器
		var rigidBody = box.addComponent(Laya.Rigidbody3D) as Laya.Rigidbody3D;
		//创建盒子形状碰撞器
		var boxShape = new Laya.BoxColliderShape(sX, sY, sZ);
		//设置盒子的碰撞形状
		rigidBody.colliderShape = boxShape; 
		//设置刚体的质量
		rigidBody.mass = 10;
	}
	
	public addSphere():void {
		var mat2 = new Laya.BlinnPhongMaterial();
		Laya.Texture2D.load("../res/threeDimen/Physics/plywood.jpg", Laya.Handler.create(null, function(tex):void {
			mat2.albedoTexture = tex;
		}));
		
		//随机生成半径大小
		var radius:number = Math.random() * 0.2 + 0.2;
		//创建球型MeshSprite3D
		var sphere = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createSphere(radius));
		this.scene.addChild(sphere);
		//设置材质
		sphere.meshRenderer.material = mat2;
		sphere.transform.position = new Laya.Vector3(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
		
		//添加刚体碰撞器
		var rigidBody = sphere.addComponent(Laya.Rigidbody3D) as Laya.Rigidbody3D;
		//创建球型碰撞器
		var sphereShape = new Laya.SphereColliderShape(radius);
		//设置刚体碰撞器的形状
		rigidBody.colliderShape = sphereShape;
		//设置刚体的质量
		rigidBody.mass = 10;
	}
	
	public addCapsule():void {
		var mat3 = new Laya.BlinnPhongMaterial();
		Laya.Texture2D.load("../res/threeDimen/Physics/wood.jpg", Laya.Handler.create(null, function(tex):void {
			mat3.albedoTexture = tex;
		}));
		
		var raidius = Math.random() * 0.2 + 0.2;
		var height = Math.random() * 0.5 + 0.8;
		//创建胶囊MeshSprite3D
		var capsule = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCapsule(raidius, height));
		this.scene.addChild(capsule);
		//设置材质
		capsule.meshRenderer.material = mat3;
		capsule.transform.position = new Laya.Vector3(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
		//设置胶囊MeshSprite3D的欧拉角
		capsule.transform.rotationEuler = new Laya.Vector3(Math.random() * 360, Math.random() * 360, Math.random() * 360);
		
		//创建刚体碰撞器
		var rigidBody = capsule.addComponent(Laya.Rigidbody3D) as Laya.Rigidbody3D;
		//创建球型碰撞器
		var sphereShape = new Laya.CapsuleColliderShape(raidius, height);
		//设置刚体碰撞器的形状
		rigidBody.colliderShape = sphereShape;
		//设置刚体碰撞器的质量
		rigidBody.mass = 10;
	}
	public addCone() {
		var mat4 = new Laya.BlinnPhongMaterial();
		Laya.Texture2D.load("../res/threeDimen/Physics/steel2.jpg", Laya.Handler.create(null, function(tex) {
			mat4.albedoTexture = tex;
		}));
		var raidius = Math.random() * 0.2 + 0.2;
		var height = Math.random() * 0.5 + 0.8;
		//创建圆锥MeshSprite3D
		var cone = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCone(raidius, height));
		this.scene.addChild(cone);
		//设置材质
		cone.meshRenderer.material = mat4;
		//设置位置
		cone.transform.position = new Laya.Vector3(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
		//创建刚体碰撞器
		var rigidBody = cone.addComponent(Laya.Rigidbody3D) as Laya.Rigidbody3D;
		//创建球型碰撞器
		var coneShape = new Laya.ConeColliderShape(raidius, height);
		//设置刚体碰撞器的形状
		rigidBody.colliderShape = coneShape;
		//设置刚体碰撞器的质量
		rigidBody.mass = 10;	
	}
	public addCylinder() {
		var mat5 = new Laya.BlinnPhongMaterial();
		Laya.Texture2D.load("../res/threeDimen/Physics/steel.jpg", Laya.Handler.create(null, function(tex):void {
			mat5.albedoTexture = tex;
		}));
		var raidius = Math.random() * 0.2 + 0.2;
		var height = Math.random() * 0.5 + 0.8;
		//创建圆锥MeshSprite3D
		var cylinder = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCylinder(raidius, height));
		this.scene.addChild(cylinder);
		//设置材质
		cylinder.meshRenderer.material = mat5;
		//设置位置
		cylinder.transform.position = new Laya.Vector3(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
		//设置圆柱MeshSprite3D的欧拉角
		cylinder.transform.rotationEuler = new Laya.Vector3(Math.random() * 360, Math.random() * 360, Math.random() * 360);
		//创建刚体碰撞器
		var rigidBody = cylinder.addComponent(Laya.Rigidbody3D) as Laya.Rigidbody3D;
		//创建球型碰撞器
		var cylinderShape = new Laya.CylinderColliderShape(raidius, height);
		//设置刚体碰撞器的形状
		rigidBody.colliderShape = cylinderShape;
		//设置刚体碰撞器的质量
		rigidBody.mass = 10;
	}
	
	private addMouseEvent():void{
		//鼠标事件监听
		Laya.stage.on(Laya.Event.MOUSE_DOWN,this, this.onMouseDown);
	}
	private onMouseDown() {
		this.posX = this.point.x = Laya.MouseManager.instance.mouseX;
		this.posY = this.point.y = Laya.MouseManager.instance.mouseY;
		//产生射线
		this.camera.viewportPointToRay(this.point,this._ray);
		//拿到射线碰撞的物体
		this.scene.physicsSimulation.rayCastAll(this._ray,this.outs);
		//如果碰撞到物体
		if (this.outs.length != 0)
		{

			for (var i = 0; i <  this.outs.length; i++)
				//将射线碰撞到的物体设置为红色
				((this.outs[i].collider.owner as Laya.MeshSprite3D).meshRenderer.sharedMaterial as Laya.BlinnPhongMaterial).albedoColor = new Laya.Vector4(1.0, 0.0, 0.0, 1.0);		
		}

	}

}
//激活启动类
new CameraRay;
