class CustomMesh {
    private sprite3D:Laya.Sprite3D;
    private lineSprite3D:Laya.Sprite3D;
    constructor() {
        Laya.Shader3D.debugMode = true;
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        
        var scene:Laya.Scene3D = Laya.stage.addChild(new Laya.Scene3D()) as Laya.Scene3D;
        
        var camera:Laya.Camera = scene.addChild(new Laya.Camera(0, 0.1, 100)) as Laya.Camera;
        camera.transform.translate(new Laya.Vector3(0, 2, 5));
        camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
        camera.addComponent(CameraMoveScript);
        camera.clearColor = new Laya.Vector4(0.2, 0.2, 0.2, 1.0);
        
        var directionLight:Laya.DirectionLight = scene.addChild(new Laya.DirectionLight()) as Laya.DirectionLight;
        directionLight.transform.worldMatrix.setForward(new Laya.Vector3(1.0, -1.0, -1.0));
        
        this.sprite3D = scene.addChild(new Laya.Sprite3D()) as Laya.Sprite3D;
        this.lineSprite3D = scene.addChild(new Laya.Sprite3D()) as Laya.Sprite3D;
        
        //正方体
        var box:Laya.MeshSprite3D = this.sprite3D.addChild(new Laya.MeshSprite3D(new Laya.BoxMesh(0.5, 0.5, 0.5))) as Laya.MeshSprite3D;
        box.transform.position = new Laya.Vector3(2.0, 0.25, 0.6);
        box.transform.rotate(new Laya.Vector3(0, 45, 0), false, false);
        var boxLineSprite3D:Laya.PixelLineSprite3D = this.lineSprite3D.addChild(new Laya.PixelLineSprite3D(100)) as Laya.PixelLineSprite3D;
        Tool.linearModel(box, boxLineSprite3D, Laya.Color.GREEN);
        
        //球体
        var sphere:Laya.MeshSprite3D = this.sprite3D.addChild(new Laya.MeshSprite3D(new Laya.SphereMesh(0.25, 20, 20))) as Laya.MeshSprite3D;
        sphere.transform.position = new Laya.Vector3(1.0, 0.25, 0.6);
        var sphereLineSprite3D:Laya.PixelLineSprite3D = this.lineSprite3D.addChild(new Laya.PixelLineSprite3D(2500)) as Laya.PixelLineSprite3D;
        Tool.linearModel(sphere, sphereLineSprite3D, Laya.Color.GREEN);
        
        //圆柱体
        var cylinder:Laya.MeshSprite3D = this.sprite3D.addChild(new Laya.MeshSprite3D(new Laya.CylinderMesh(0.25, 1, 20))) as Laya.MeshSprite3D;
        cylinder.transform.position = new Laya.Vector3(0, 0.5, 0.6);
        var cylinderLineSprite3D:Laya.PixelLineSprite3D = this.lineSprite3D.addChild(new Laya.PixelLineSprite3D(1000)) as Laya.PixelLineSprite3D;
        Tool.linearModel(cylinder, cylinderLineSprite3D, Laya.Color.GREEN);
        
        //胶囊体
        var capsule:Laya.MeshSprite3D = this.sprite3D.addChild(new Laya.MeshSprite3D(new Laya.CapsuleMesh(0.25, 1, 10, 20))) as Laya.MeshSprite3D;
        capsule.transform.position = new Laya.Vector3( -1.0, 0.5, 0.6);
        var capsuleLineSprite3D:Laya.PixelLineSprite3D = this.lineSprite3D.addChild(new Laya.PixelLineSprite3D(3000)) as Laya.PixelLineSprite3D;
        Tool.linearModel(capsule, capsuleLineSprite3D, Laya.Color.GREEN);
        
        //圆锥体
        var cone:Laya.MeshSprite3D = this.sprite3D.addChild(new Laya.MeshSprite3D(new Laya.ConeMesh(0.25, 0.75))) as Laya.MeshSprite3D;
        cone.transform.position = new Laya.Vector3( -2.0, 0.375, 0.6);
        var coneLineSprite3D:Laya.PixelLineSprite3D = this.lineSprite3D.addChild(new Laya.PixelLineSprite3D(500)) as Laya.PixelLineSprite3D;
        Tool.linearModel(cone, coneLineSprite3D, Laya.Color.GREEN);
        
        //平面
        var plane:Laya.MeshSprite3D = this.sprite3D.addChild(new Laya.MeshSprite3D(new Laya.PlaneMesh(6, 6, 10, 10))) as Laya.MeshSprite3D;
        var planeLineSprite3D:Laya.PixelLineSprite3D = this.lineSprite3D.addChild(new Laya.PixelLineSprite3D(1000)) as Laya.PixelLineSprite3D;
        Tool.linearModel(plane, planeLineSprite3D, Laya.Color.GRAY);
        
        this.lineSprite3D.active = false;
        this.loadUI();
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
new CustomMesh;