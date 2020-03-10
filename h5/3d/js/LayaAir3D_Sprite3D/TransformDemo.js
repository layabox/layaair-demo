class TransformDemo{
    constructor(){
        //初始化引擎
		Laya3D.init(0, 0);
		Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
		Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
		//显示性能面板
        Laya.Stat.show();
			
		//创建场景
        this._scene = Laya.stage.addChild(new Laya.Scene3D());
        //初始化变量
        this._position = new Laya.Vector3(0, 0, 0);
        this._position1 = new Laya.Vector3(0, 0, 0);
        this._rotate = new Laya.Vector3(0, 1, 0);
        this._rotate1 = new Laya.Vector3(0, 1, 0);
		this._scale = new Laya.Vector3();
		this.scaleDelta = 0;
        this.scaleValue = 0;
        this.layaMonkey_clone1 =null;
        this.layaMonkey_clone2 =null;
        this.layaMonkey_clone3 =null;

        this.clone1Transform = null;
        this.clone2Transform = null ;
        this.clone3Transform = null ;



		//添加相机
        let camera = (this._scene.addChild(new Laya.Camera(0, 0.1, 100)));
        camera.transform.translate(new Laya.Vector3(0, 0.8, 5));
        camera.transform.rotate(new Laya.Vector3( -15, 0, 0), true, false);
		camera.addComponent(CameraMoveScript);
			
		//添加光照
		let directionLight = this._scene.addChild(new Laya.DirectionLight());
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
        let grid = this._scene.addChild(Laya.Loader.getRes("res/threeDimen/staticModel/grid/plane.lh"));
        //加载静态小猴子
        let staticLayaMonkey = this._scene.addChild(new Laya.MeshSprite3D(Laya.Loader.getRes("res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/LayaMonkey-LayaMonkey.lm")));
        //设置材质
        staticLayaMonkey.meshRenderer.material = Laya.Loader.getRes("res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/Materials/T_Diffuse.lmat");
        //设置位置
        let staticMonkeyTrans = staticLayaMonkey.transform;
        let staticMonkeypos = staticMonkeyTrans.position;
        staticMonkeypos.setValue(0, 0, 0.5);
        staticMonkeyTrans.position = staticMonkeypos;
        //设置缩放
        let staticMonkeyScale = staticMonkeyTrans.localScale;
        staticMonkeyScale.setValue(0.3, 0.3, 0.3);
        staticMonkeyTrans.localScale = staticMonkeyScale;
        //设置旋转
        staticLayaMonkey.transform.rotation = new Laya.Quaternion(0.7071068, 0, 0, -0.7071067);

         
        //克隆sprite3d
        this.layaMonkey_clone1 = Laya.Sprite3D.instantiate(staticLayaMonkey, this._scene, false, this._position1);
        this.layaMonkey_clone2 = Laya.Sprite3D.instantiate(staticLayaMonkey, this._scene, false, this._position1);
        this.layaMonkey_clone3 = Laya.Sprite3D.instantiate(staticLayaMonkey, this._scene, false, this._position1);

        //得到三个transform
        this.clone1Transform = this.layaMonkey_clone1.transform;
        this.clone2Transform = this.layaMonkey_clone2.transform;
        this.clone3Transform = this.layaMonkey_clone3.transform;
        //平移
        this._position1.setValue(-1.5, 0, 0.0);
        this.clone2Transform.translate(this._position1);
        this._position1.setValue(1.0, 0, 0.0);
        this.clone3Transform.translate(this._position1);
        //旋转
        this._rotate1.setValue(0, 60, 0);
        this.clone2Transform.rotate(this._rotate1, false, false);
        //缩放
        let scale = this.clone3Transform.localScale;
        scale.setValue(0.1,0.1,0.1);
        this.clone3Transform.localScale = scale;

        staticLayaMonkey.removeSelf(); 

        //设置定时器执行,定时重复执行(基于帧率)
		Laya.timer.frameLoop(1, this, this.animate);
    }

    animate() {
        this.scaleValue = Math.sin(this.scaleDelta += 0.1);
        this._position.y = Math.max(0, this.scaleValue / 2);
        this.layaMonkey_clone1.transform.position = this._position;
        
        this.layaMonkey_clone2.transform.rotate(this._rotate, false, false);
        
        this._scale.x = this._scale.y = this._scale.z = Math.abs(this.scaleValue) / 5;
        this.layaMonkey_clone3.transform.localScale = this._scale;
    }

}
//激活启动类
new TransformDemo();