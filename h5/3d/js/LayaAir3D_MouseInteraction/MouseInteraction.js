class MouseInteraction{
    constructor(){
        //初始化引擎
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        //显示性能面板
        Laya.Stat.show();
        
        //创建场景
        this.scene = Laya.stage.addChild(new Laya.Scene3D());

        //射线初始化（必须初始化）
        this.ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 0));
        
        //初始化变量
        this.point = new Laya.Vector2();
        this.outHitResult = new Laya.HitResult(); 
        
        //添加相机
        this.camera = (this.scene.addChild(new Laya.Camera(0, 0.1, 100)));
        this.camera.transform.translate(new Laya.Vector3(0, 0.7, 5));
        this.camera.transform.rotate(new Laya.Vector3( -15, 0, 0), true, false);
        this.camera.addComponent(CameraMoveScript);
        
        //添加光照
        let directionLight = this.scene.addChild(new Laya.DirectionLight());
        directionLight.color = new Laya.Vector3(1, 1, 1);
        directionLight.transform.rotate(new Laya.Vector3( -3.14 / 3, 0, 0));
        
        //批量预加载资源
        Laya.loader.create([
            "res/threeDimen/staticModel/grid/plane.lh", 
            "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh"
        ], Laya.Handler.create(this, this.onComplete));

    }

    onComplete(){
        //加载地面
        let grid = this.scene.addChild(Laya.Loader.getRes("res/threeDimen/staticModel/grid/plane.lh"));
        //指定精灵的图层
        grid.layer = 10;
        //加载静态小猴子
        let staticLayaMonkey = this.scene.addChild(new Laya.MeshSprite3D(Laya.Loader.getRes("res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/LayaMonkey-LayaMonkey.lm")));
        //设置材质
        staticLayaMonkey.meshRenderer.material = Laya.Loader.getRes("res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/Materials/T_Diffuse.lmat");
        //设置位置
        staticLayaMonkey.transform.position = new Laya.Vector3(0, 0, 0.5);
        //设置缩放
        staticLayaMonkey.transform.localScale = new Laya.Vector3(0.3, 0.3, 0.3);
        //设置旋转
        staticLayaMonkey.transform.rotation = new Laya.Quaternion(0.7071068, 0, 0, -0.7071067);
        
        //克隆sprite3d
        let layaMonkey_clone1 = Laya.Sprite3D.instantiate(staticLayaMonkey, this.scene, false, new Laya.Vector3(0.0, 0, 0.5));
        let layaMonkey_clone2 = Laya.Sprite3D.instantiate(staticLayaMonkey, this.scene, false, new Laya.Vector3(0.0, 0, 0.5));
        let layaMonkey_clone3 = Laya.Sprite3D.instantiate(staticLayaMonkey, this.scene, false, new Laya.Vector3(0.0, 0, 0.5));
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
        let scale = new Laya.Vector3(0.1, 0.1, 0.1);
        layaMonkey_clone3.transform.localScale = scale;
        
        //给模型添加碰撞组件
        let meshCollider = staticLayaMonkey.addComponent(Laya.PhysicsCollider);
        //创建网格碰撞器
        let meshShape = new Laya.MeshColliderShape();
        //获取模型的mesh
        meshShape.mesh = staticLayaMonkey.meshFilter.sharedMesh;
        //设置模型的碰撞形状
        meshCollider.colliderShape = meshShape;

        let meshCollider1 = layaMonkey_clone1.addComponent(Laya.PhysicsCollider);
        let meshShape1 = new Laya.MeshColliderShape();
        meshShape1.mesh = layaMonkey_clone1.meshFilter.sharedMesh;
        meshCollider1.colliderShape = meshShape1;
        
        let meshCollider2 = layaMonkey_clone2.addComponent(Laya.PhysicsCollider);
        let meshShape2 = new Laya.MeshColliderShape();
        meshShape2.mesh = layaMonkey_clone2.meshFilter.sharedMesh;
        meshCollider2.colliderShape = meshShape2;
        
        let meshCollider3 = layaMonkey_clone3.addComponent(Laya.PhysicsCollider);
        let meshShape3 = new Laya.MeshColliderShape();
        meshShape3.mesh = layaMonkey_clone3.meshFilter.sharedMesh;
        meshCollider3.colliderShape = meshShape3;
        
        
        //添加鼠标事件
        this.addMouseEvent();

        
        //显示文本显示框
        this.text = new Laya.Text();
        this.text.name = "text";
        //设置文本显示框位置
        this.text.x = Laya.stage.width / 2 -50 ;
        this.text.overflow = Laya.Text.HIDDEN;
        this.text.color = "#FFFFFF";
        this.text.font = "Impact";
        this.text.fontSize = 20;
        this.text.x = Laya.stage.width / 2;
        Laya.stage.addChild(this.text);

        //添加脚本
        staticLayaMonkey.addComponent(SceneScript);
        layaMonkey_clone1.addComponent(SceneScript);
        layaMonkey_clone2.addComponent(SceneScript);
        layaMonkey_clone3.addComponent(SceneScript);
    }
    addMouseEvent(){
        //鼠标事件监听
        //Laya.stage.on(Laya.Event.MOUSE_DOWN,this, this.onMouseDown);
    }
    onMouseDown(){
        this.point.x = Laya.MouseManager.instance.mouseX;
        this.point.y = Laya.MouseManager.instance.mouseY;
        //产生射线
        this.camera.viewportPointToRay(this.point,this.ray);
        //拿到射线碰撞的物体
        this.scene.physicsSimulation.rayCast(this.ray,this.outHitResult);
        //如果碰撞到物体
        if (this.outHitResult.succeeded)
        {
            //删除碰撞到的物体
            this.text.text = "点击到了" + this.outHitResult.collider.owner.name ;
            trace("碰撞到物体！！")
        }
    }
}
//激活启动类
new MouseInteraction();

class SceneScript extends Laya.Script3D{
    constructor(){
        super();
        this.meshSprite = null;
        this.text = null;
    }
    onAwake(){
        this.meshSprite = this.owner;
		this.text = Laya.stage.getChildByName("text");
    }
    onUpdate(){
    }
    //物体必须拥有碰撞组件（Collider）
    //当被鼠标点击
    onMouseDown(e){
        this.text.text = "碰撞到了" + this.owner.name;
        //从父容器销毁我自己
        //box.removeSelf();
    }
    //当产生碰撞
    onCollisionEnter(collision) {
        box.meshRenderer.sharedMaterial.albedoColor = this.albedoColor;
        // box.removeSelf();
    }
}