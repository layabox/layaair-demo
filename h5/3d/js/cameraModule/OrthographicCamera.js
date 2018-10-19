class OrthographicCamera{
    constructor(){
        this.pos = new Laya.Vector3(310, 500, 0);
        this._translate = new Laya.Vector3(0, 0, 0);
        Laya3D.init(1024, 768);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FIXED_HEIGHT;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        var dialog = Laya.stage.addChild(new Laya.Image("res/cartoon2/background.jpg"));
        this.scene = Laya.stage.addChild(new Laya.Scene3D());
        this.camera = this.scene.addChild(new Laya.Camera(0, 0.1, 1000));
        this.camera.transform.rotate(new Laya.Vector3(-45, 0, 0), false, false);
        this.camera.transform.translate(new Laya.Vector3(5, -10, 1));
        this.camera.orthographic = true;
        //正交投影垂直矩阵尺寸
        this.camera.orthographicVerticalSize = 10;
        var directionLight = this.scene.addChild(new Laya.DirectionLight());
        Laya.Sprite3D.load("res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", Laya.Handler.create(this, this.loadSprite));
    }

    loadSprite(layaMonkey){
        this.layaMonkey =  this.scene.addChild(layaMonkey);
        this.layaMonkey.transform.localScale = new Laya.Vector3(0.3, 0.3, 0.3);
        //转换2D屏幕坐标系统到3D正交投影下的坐标系统
        this.camera.convertScreenCoordToOrthographicCoord(this.pos, this._translate);
        this.layaMonkey.transform.position = this._translate;
        Laya.stage.on(Laya.Event.RESIZE, this,this.convertSCToOC);
    }
    convertSCToOC(){
        this.camera.convertScreenCoordToOrthographicCoord(this.pos, this._translate);
        this.layaMonkey.transform.position = this._translate;
    }

}      
//激活启动类
new OrthographicCamera();


