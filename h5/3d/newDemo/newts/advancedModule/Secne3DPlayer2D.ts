class Secne3DPlayer2D {
		
    private scene:Laya.Scene3D;
    private camera:Laya.Camera;
    private layaMonkey3D:Laya.Sprite3D;
    private layaMonkey2D:Laya.Image;
    private _position = new Laya.Vector3();
    private _outPos = new Laya.Vector3();
    private scaleDelta:number = 0;
		
	constructor() {
        //初始化引擎
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        //显示性能面板
        Laya.Stat.show();
        
        //创建场景
        this.scene = new Laya.Scene3D();
         Laya.stage.addChild(this.scene);
        
        //创建相机
        this.camera = new Laya.Camera(0, 0.1, 100);
        this.scene.addChild(this.camera);
        this.camera.transform.translate(new Laya.Vector3(0, 0.35, 1));
        this.camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
        
        //创建平行光
        var directionLight = new Laya.DirectionLight();
        this.scene.addChild(directionLight);
        directionLight.color = new Laya.Vector3(1, 1, 1);
        directionLight.transform.rotate(new Laya.Vector3(-3.14/3, 0,0));
        //加载精灵
        Laya.loader.create("../res/threeDimen/staticModel/grid/plane.lh", Laya.Handler.create(this, this.onComplete));
    }	
		
	private onComplete() {
        //加载三维地面
        var grid = this.scene.addChild(Laya.Loader.getRes("../res/threeDimen/staticModel/grid/plane.lh")) as Laya.Sprite3D;
        //加载二维猴子
        this.layaMonkey2D = Laya.stage.addChild(new Laya.Image("../res/threeDimen/monkey.png")) as Laya.Image;
        //开启定时器循环
        Laya.timer.frameLoop(1, this, this.animate);
    }
		
	private animate() {
        //变换位置
        this._position.x = Math.sin(this.scaleDelta += 0.01);
        //计算位置
        this.camera.viewport.project(this._position, this.camera.projectionViewMatrix, this._outPos);
        this.layaMonkey2D.pos(this._outPos.x / Laya.stage.clientScaleX, this._outPos.y / Laya.stage.clientScaleY);
    }	
	
}

new Secne3DPlayer2D;
