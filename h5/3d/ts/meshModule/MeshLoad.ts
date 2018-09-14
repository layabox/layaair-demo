class MeshLoad {
    private sprite3D:Laya.Sprite3D;
    private lineSprite3D:Laya.Sprite3D;
    private rotation:Laya.Vector3 = new Laya.Vector3(0, 0.01, 0);
    constructor() {
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        
        var scene:Laya.Scene3D = Laya.stage.addChild(new Laya.Scene3D()) as Laya.Scene3D;
        
        var camera:Laya.Camera = scene.addChild(new Laya.Camera(0, 0.1, 100)) as Laya.Camera;
        camera.transform.translate(new Laya.Vector3(0, 0.8, 1.5));
        camera.transform.rotate(new Laya.Vector3( -15, 0, 0), true, false);
        
        var directionLight:Laya.DirectionLight = scene.addChild(new Laya.DirectionLight()) as Laya.DirectionLight;
        directionLight.color = new Laya.Vector3(0.6, 0.6, 0.6);
        directionLight.direction = new Laya.Vector3(1, -1, -1);
        
        this.sprite3D = scene.addChild(new Laya.Sprite3D()) as Laya.Sprite3D;
        this.lineSprite3D = scene.addChild(new Laya.Sprite3D()) as Laya.Sprite3D;
        
        Laya.Mesh.load("../../res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/LayaMonkey-LayaMonkey.lm", Laya.Handler.create(this, function(mesh:Laya.Mesh):void {
            var layaMonkey:Laya.MeshSprite3D = this.sprite3D.addChild(new Laya.MeshSprite3D(mesh)) as Laya.MeshSprite3D;
            layaMonkey.transform.localScale = new Laya.Vector3(0.3, 0.3, 0.3);
            layaMonkey.transform.rotation = new Laya.Quaternion(0.7071068, 0, 0, -0.7071067);
            var layaMonkeyLineSprite3D:Laya.PixelLineSprite3D = this.lineSprite3D.addChild(new Laya.PixelLineSprite3D(5000)) as Laya.PixelLineSprite3D;
            
            var plane:Laya.MeshSprite3D = this.sprite3D.addChild(new Laya.MeshSprite3D(new Laya.PlaneMesh(6, 6, 10, 10))) as Laya.MeshSprite3D;
            plane.transform.position = new Laya.Vector3(0, 0, -1);
            var planeLineSprite3D:Laya.PixelLineSprite3D = this.lineSprite3D.addChild(new Laya.PixelLineSprite3D(1000)) as Laya.PixelLineSprite3D;
            Tool.linearModel(plane, planeLineSprite3D, Laya.Color.GRAY);
            
            Laya.timer.frameLoop(1, this, function():void {
                Tool.linearModel(layaMonkey, layaMonkeyLineSprite3D, Laya.Color.GREEN);
                layaMonkey.transform.rotate(this.rotation, false);
            });
            
            this.lineSprite3D.active = false;
            this.loadUI();
        }));
    }
    
    private curStateIndex:number = 0;
    private loadUI():void {
        Laya.loader.load(["../../res/threeDimen/ui/button.png"], Laya.Handler.create(this, function():void {
            var changeActionButton:Laya.Button = Laya.stage.addChild(new Laya.Button("../../res/threeDimen/ui/button.png", "正常模式")) as Laya.Button;
            changeActionButton.size(160, 40);
            changeActionButton.labelBold = true;
            changeActionButton.labelSize = 30;
            changeActionButton.sizeGrid = "4,4,4,4";
            changeActionButton.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
            changeActionButton.pos(Laya.stage.width / 2 - changeActionButton.width * Laya.Browser.pixelRatio / 2, Laya.stage.height - 100 * Laya.Browser.pixelRatio);
            changeActionButton.on(Laya.Event.CLICK, this, function():void {
                if (++this.curStateIndex % 2 == 1) {
                    this.sprite3D.active = false;
                    this.lineSprite3D.active = true;
                    changeActionButton.label = "网格模式";
                }
                else {
                    this.sprite3D.active = true;
                    this.lineSprite3D.active = false;
                    changeActionButton.label = "正常模式";
                }
            });
        }));
    }
}
new MeshLoad;