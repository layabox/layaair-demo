import CameraMoveScript from "./common/CameraMoveScript"
class MouseInteraction{
	private _scene:Laya.Scene3D;
	private _camera:Laya.Camera;
	private _ray:Laya.Ray;
	private _outHitResult:Laya.HitResult;
	private posX:number = 0.0;
	private posY:number = 0.0;
	private point:Laya.Vector2 = new Laya.Vector2();
	private text:Laya.Text = new Laya.Text();
    constructor(){
        	//初始化引擎
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
			Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
			//显示性能面板
            Laya.Stat.show();
				
			
			//创建场景
			this._scene = new Laya.Scene3D();
			Laya.stage.addChild(this._scene);

            //射线初始化（必须初始化）
            this._ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 0));
            
            //初始化变量
            this.point = new Laya.Vector2();
            this._outHitResult = new Laya.HitResult(); 
            
			//添加相机
			this._camera = new Laya.Camera(0, 0.1, 100);
			this._scene.addChild(this._camera);
            this._camera.transform.translate(new Laya.Vector3(0, 0.7, 5));
            this._camera.transform.rotate(new Laya.Vector3( -15, 0, 0), true, false);
			this._camera.addComponent(CameraMoveScript);
			
			//添加光照
			var directionLight = new Laya.DirectionLight();
			this._scene.addChild(directionLight);
            directionLight.color = new Laya.Vector3(1, 1, 1);
            directionLight.transform.rotate(new Laya.Vector3( -3.14 / 3, 0, 0));
			
			//灯光开启阴影
            directionLight.shadow = true;
			//可见阴影距离
			directionLight.shadowDistance = 3;
			//生成阴影贴图尺寸
			directionLight.shadowResolution = 2048;
			//生成阴影贴图数量
			directionLight.shadowPSSMCount = 1;
			//模糊等级,越大越高,更耗性能
			directionLight.shadowPCFType = 3;
			
			//批量预加载资源
			Laya.loader.create([
				"res/threeDimen/staticModel/grid/plane.lh", 
				"res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh"
			], Laya.Handler.create(this, this.onComplete));
    }

    onComplete(){
            //加载地面
            var grid = this._scene.addChild(Laya.Loader.getRes("res/threeDimen/staticModel/grid/plane.lh")) as Laya.Sprite3D;
            //指定精灵的图层
            grid.layer = 10;
            //地面接收阴影
            (grid.getChildAt(0) as Laya.MeshSprite3D).meshRenderer.receiveShadow = true;
            //加载静态小猴子
			var staticLayaMonkey = new Laya.MeshSprite3D(Laya.Loader.getRes("res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/LayaMonkey-LayaMonkey.lm"));
			this._scene.addChild(staticLayaMonkey);
            //设置材质
            staticLayaMonkey.meshRenderer.material = Laya.Loader.getRes("res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/Materials/T_Diffuse.lmat");
            //设置位置
            staticLayaMonkey.transform.position = new Laya.Vector3(0, 0, 0.5);
            //设置缩放
            staticLayaMonkey.transform.localScale = new Laya.Vector3(0.3, 0.3, 0.3);
            //设置旋转
            staticLayaMonkey.transform.rotation = new Laya.Quaternion(0.7071068, 0, 0, -0.7071067);
            //产生阴影
            staticLayaMonkey.meshRenderer.castShadow = true;
            
            
            //克隆sprite3d
            var layaMonkey_clone1 = Laya.Sprite3D.instantiate(staticLayaMonkey, this._scene, false, new Laya.Vector3(0.0, 0, 0.5)) as Laya.MeshSprite3D;
            var layaMonkey_clone2 = Laya.Sprite3D.instantiate(staticLayaMonkey, this._scene, false, new Laya.Vector3(0.0, 0, 0.5)) as Laya.MeshSprite3D;
            var layaMonkey_clone3 = Laya.Sprite3D.instantiate(staticLayaMonkey, this._scene, false, new Laya.Vector3(0.0, 0, 0.5)) as Laya.MeshSprite3D;
            //设置精灵名字
            staticLayaMonkey.name = "大熊";
            layaMonkey_clone1.name = "二熊";
            layaMonkey_clone2.name = "三熊";
            layaMonkey_clone3.name = "小小熊";
            
            //平移
            layaMonkey_clone1.transform.translate(new Laya.Vector3(1.5, 0, 0.0));
            layaMonkey_clone2.transform.translate(new Laya.Vector3( -1.5, 0, 0.0));
            layaMonkey_clone3.transform.translate(new Laya.Vector3( 2.5, 0, 0.0));
            //旋转
            layaMonkey_clone2.transform.rotate(new Laya.Vector3(0, 60, 0), false, false);
            //缩放
            var scale = new Laya.Vector3(0.1, 0.1, 0.1);
            layaMonkey_clone3.transform.localScale = scale;
            
            //给模型添加碰撞组件
            var meshCollider = staticLayaMonkey.addComponent(Laya.PhysicsCollider);
            //创建网格碰撞器
            var meshShape = new Laya.MeshColliderShape();
            //获取模型的mesh
            meshShape.mesh = staticLayaMonkey.meshFilter.sharedMesh;
            //设置模型的碰撞形状
            meshCollider.colliderShape = meshShape;
            
            var meshCollider1 = layaMonkey_clone1.addComponent(Laya.PhysicsCollider);
            var meshShape1 = new Laya.MeshColliderShape();
            meshShape1.mesh = layaMonkey_clone1.meshFilter.sharedMesh;
            meshCollider1.colliderShape = meshShape1;
            
            var meshCollider2 = layaMonkey_clone2.addComponent(Laya.PhysicsCollider);
            var meshShape2 = new Laya.MeshColliderShape();
            meshShape2.mesh = layaMonkey_clone2.meshFilter.sharedMesh;
            meshCollider2.colliderShape = meshShape2;
            
            var meshCollider3 = layaMonkey_clone3.addComponent(Laya.PhysicsCollider);
            var meshShape3 = new Laya.MeshColliderShape();
            meshShape3.mesh = layaMonkey_clone3.meshFilter.sharedMesh;
            meshCollider3.colliderShape = meshShape3;
            
            //设置文本显示框位置
            this.text.x = Laya.stage.width / 2 -50 ;
            //显示文本显示框
            this.text = new Laya.Text();
			this.text.overflow = Laya.Text.HIDDEN;
			this.text.color = "#FFFFFF";
			this.text.font = "Impact";
			this.text.fontSize = 20;
			this.text.x = Laya.stage.width / 2;
            Laya.stage.addChild(this.text);
            
            //添加鼠标事件
            this.addMouseEvent();
    }
    addMouseEvent(){
            //鼠标事件监听
		    Laya.stage.on(Laya.Event.MOUSE_DOWN,this, this.onMouseDown);
    }
    onMouseDown(){
            this.point.x = Laya.MouseManager.instance.mouseX;
			this.point.y = Laya.MouseManager.instance.mouseY;
			//产生射线
			this._camera.viewportPointToRay(this.point,this._ray);
			//拿到射线碰撞的物体
			this._scene.physicsSimulation.rayCast(this._ray,this._outHitResult);
			//如果碰撞到物体
			if (this._outHitResult.succeeded)
			{
				//删除碰撞到的物体
				this.text.text = "点击到了" + this._outHitResult.collider.owner.name ;
			}
    }
}
//激活启动类
new MouseInteraction();

class SceneScript extends Laya.Script3D{
    private box :Laya.MeshSprite3D;
    private _albedoColor:Laya.Vector4 = new Laya.Vector4(0.0,0.0,0.0,1.0)
    constructor(){
        super();
        this.box  = null;
    }
    onAwake(){
        this.box = this.owner as Laya.MeshSprite3D;
    }
    onUpdate(){
    }
    //物体必须拥有碰撞组件（Collider）
    //当被鼠标点击
    onMouseDown(){
    }
    //当产生碰撞
    onCollisionEnter(collision) {
        (this.box.meshRenderer.sharedMaterial as Laya.BlinnPhongMaterial).albedoColor = this._albedoColor;
    }
}