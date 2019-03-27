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

	private tmpVector:Laya.Vector3;
	private albedoColor:Laya.Vector4;	

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
		//this.camera.clearColor = null;

		//初始化变量
		this.tmpVector = new Laya.Vector3(0, 0, 0)
		this.albedoColor = new Laya.Vector4(1.0, 0.0, 0.0, 1.0);	
		
		//方向光
		var directionLight = new Laya.DirectionLight();
		this.scene.addChild(directionLight);
		directionLight.color = new Laya.Vector3(0.6, 0.6, 0.6);
		directionLight.transform.worldMatrix.setForward(new Laya.Vector3(-1.0, -1.0, -1.0));
		
		//平面
		var plane = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createPlane(10, 10, 10, 10));
		this.scene.addChild(plane);
		var planeMat = new Laya.BlinnPhongMaterial();
		Laya.Texture2D.load("res/threeDimen/Physics/grass.png", Laya.Handler.create(null, function(tex):void {
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
		//添加鼠标事件
		this.addMouseEvent();
		//射线初始化（必须初始化）
		this._ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 0));
	}

	public addBoxXYZ(x, y, z):void {
		var mat1 = new Laya.BlinnPhongMaterial();
		Laya.Texture2D.load("res/threeDimen/Physics/rocks.jpg", Laya.Handler.create(null, function(tex) {
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
		this.tmpVector.setValue(x, y, z);
		box.transform.position = this.tmpVector;
		//设置欧拉角
		this.tmpVector.setValue(Math.random() * 360, Math.random() * 360, Math.random() * 360);
		box.transform.rotationEuler = this.tmpVector;
		//创建刚体碰撞器
		var rigidBody = box.addComponent(Laya.Rigidbody3D) as Laya.Rigidbody3D;
		//创建盒子形状碰撞器
		var boxShape = new Laya.BoxColliderShape(sX, sY, sZ);
		//设置盒子的碰撞形状
		rigidBody.colliderShape = boxShape; 
		//设置刚体的质量
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
				//在射线击中的位置添加一个立方体
				this.addBoxXYZ(this.outs[i].point.x, this.outs[i].point.y, this.outs[i].point.z );	
		}

	}

}
//激活启动类
new CameraRay;
