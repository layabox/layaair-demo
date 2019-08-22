class CustomMesh{
    constructor(){  
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        let scene = Laya.stage.addChild(new Laya.Scene3D());
        let camera = scene.addChild(new Laya.Camera(0, 0.1, 100));
        camera.transform.translate(new Laya.Vector3(0, 2, 5));
        camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
        camera.addComponent(CameraMoveScript);
        camera.clearColor = new Laya.Vector4(0.2, 0.2, 0.2, 1.0);
        let directionLight = scene.addChild(new Laya.DirectionLight());
        let mat = directionLight.transform.worldMatrix;
        mat.setForward(new Laya.Vector3(1.0, -1.0, -1.0));
        directionLight.transform.worldMatrix = mat;
        this.sprite3D = scene.addChild(new Laya.Sprite3D());
        this.lineSprite3D = scene.addChild(new Laya.Sprite3D());
        this.curStateIndex = 0;
      
        this.drawBox();
        this.drawSphere();
        this.drawCylinder();
        this.drawCapsule();
        this.drawCone();
        this.drawPlane();

        this.lineSprite3D.active = false;
        this.loadUI();
    }
    //正方体
    drawBox(){
        let box = this.sprite3D.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(0.5, 0.5, 0.5)));
        box.transform.position = new Laya.Vector3(2.0, 0.25, 0.6);
        box.transform.rotate(new Laya.Vector3(0, 45, 0), false, false);
        let boxLineSprite3D = this.lineSprite3D.addChild(new Laya.PixelLineSprite3D(100));
        Tool.linearModel(box, boxLineSprite3D, Laya.Color.GREEN);
    }
    //球体
    drawSphere(){
        this.sphere = this.sprite3D.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createSphere(0.25, 20, 20)));
        this.sphere.transform.position = new Laya.Vector3(1.0, 0.25, 0.6);
        let sphereLineSprite3D = this.lineSprite3D.addChild(new Laya.PixelLineSprite3D(3500));
        Tool.linearModel(this.sphere, sphereLineSprite3D, Laya.Color.GREEN);
    }
    //圆柱体
    drawCylinder(){
        let cylinder = this.sprite3D.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCylinder(0.25, 1, 20)));
        cylinder.transform.position = new Laya.Vector3(0, 0.5, 0.6);
        let cylinderLineSprite3D = this.lineSprite3D.addChild(new Laya.PixelLineSprite3D(1000));
        Tool.linearModel(cylinder, cylinderLineSprite3D, Laya.Color.GREEN);
    }
    //胶囊体
    drawCapsule(){
        let capsule = this.sprite3D.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCapsule(0.25, 1, 10, 20)));
        capsule.transform.position = new Laya.Vector3(-1.0, 0.5, 0.6);
        let capsuleLineSprite3D = this.lineSprite3D.addChild(new Laya.PixelLineSprite3D(3000));
        Tool.linearModel(capsule, capsuleLineSprite3D, Laya.Color.GREEN);
    }
    //圆锥体
    drawCone(){
        let cone = this.sprite3D.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCone(0.25, 0.75)));
        cone.transform.position = new Laya.Vector3(-2.0, 0.375, 0.6);
        let coneLineSprite3D = this.lineSprite3D.addChild(new Laya.PixelLineSprite3D(500));
        Tool.linearModel(cone, coneLineSprite3D, Laya.Color.GREEN);
    }
    //平面
    drawPlane(){
        //平面
        let plane = this.sprite3D.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createPlane(10, 10, 256,256)));
        var mat = new Laya.BlinnPhongMaterial();
        plane.meshRenderer.sharedMaterial = mat;
        mat.albedoColor = new Laya.Vector4(1.0, 0.0, 0.0, 1.0);
        let planeLineSprite3D = this.lineSprite3D.addChild(new Laya.PixelLineSprite3D(500000));
        Tool.linearModel(plane, planeLineSprite3D, Laya.Color.GRAY);
    }
    loadUI(){
        Laya.loader.load(["res/threeDimen/ui/button.png"], Laya.Handler.create(this, function () {
            this.changeActionButton = Laya.stage.addChild(new Laya.Button("res/threeDimen/ui/button.png", "正常模式"));
            this.changeActionButton.size(160, 40);
            this.changeActionButton.labelBold = true;
            this.changeActionButton.labelSize = 30;
            this.changeActionButton.sizeGrid = "4,4,4,4";
            this.changeActionButton.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
            this.changeActionButton.pos(Laya.stage.width / 2 - this.changeActionButton.width * Laya.Browser.pixelRatio / 2, Laya.stage.height - 100 * Laya.Browser.pixelRatio);
            this.changeActionButton.on(Laya.Event.CLICK, this, this.onButtonClick);
        }));
    }

    onButtonClick(){
        if (++this.curStateIndex % 2 == 1) {
            this.sprite3D.active = false;
            this.lineSprite3D.active = true;
            this.changeActionButton.label = "网格模式";
        }else {
            this.sprite3D.active = true;
            this.lineSprite3D.active = false;
            this.changeActionButton.label = "正常模式";
        }
    }

}


//激活启动类
new CustomMesh();
