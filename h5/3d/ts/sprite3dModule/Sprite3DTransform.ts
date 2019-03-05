class Sprite3DTransform {
    private scene:Laya.Scene3D;
    private layaMonkey1:Laya.Sprite3D;
    private layaMonkey2:Laya.Sprite3D;
    private layaMonkey3:Laya.Sprite3D;
    private _position:Laya.Vector3 = new Laya.Vector3(-0.6, 0, 0);
    private _rotate:Laya.Vector3 = new Laya.Vector3(0, 1, 0);
    private _scale:Laya.Vector3 = new Laya.Vector3();
    private scaleDelta:number = 0;
    private scaleValue:number = 0;
    
    constructor() {
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        
        this.scene = Laya.stage.addChild(new Laya.Scene3D()) as Laya.Scene3D;
        this.scene.ambientColor = new Laya.Vector3(1, 1, 1);
        
        var camera:Laya.Camera = this.scene.addChild(new Laya.Camera(0, 0.1, 100)) as Laya.Camera;
        camera.transform.translate(new Laya.Vector3(0, 0.5, 1));
        camera.transform.rotate(new Laya.Vector3( -15, 0, 0), true, false);
        
        Laya.loader.create("../res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", Laya.Handler.create(this, this.onComplete));
    }
    
    public onComplete():void
    {
        
        this.layaMonkey1 = this.scene.addChild(Laya.Loader.getRes("../res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh")) as Laya.Sprite3D;
        this.layaMonkey2 = Laya.Sprite3D.instantiate(this.layaMonkey1, this.scene, false, new Laya.Vector3(0, 0, 0));
        this.layaMonkey3 = this.scene.addChild(Laya.Sprite3D.instantiate(this.layaMonkey1, null, false, new Laya.Vector3(0.6, 0, 0))) as Laya.Sprite3D;
        
        Laya.timer.frameLoop(1, this, this.animate);
    }
    
    private animate():void
    {
        this.scaleValue = Math.sin(this.scaleDelta += 0.1);
        
        this._position.y = this.scaleValue / 2;
        this.layaMonkey1.transform.position = this._position;
        
        this.layaMonkey2.transform.rotate(this._rotate, false, false);
        
        this._scale.x = this._scale.y = this._scale.z = Math.abs(this.scaleValue) / 5;
        this.layaMonkey3.transform.localScale = this._scale;
    }
}
new Sprite3DTransform;