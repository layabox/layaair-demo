class BlinnPhongMaterialLoad{
    constructor(){
        this.rotation = new Laya.Vector3(0, 0.01, 0);
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        this.scene = Laya.stage.addChild(new Laya.Scene3D());
        var camera = this.scene.addChild(new Laya.Camera(0, 0.1, 100));
        camera.transform.translate(new Laya.Vector3(0, 0.9, 1.5));
        camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
        var directionLight = this.scene.addChild(new Laya.DirectionLight());
        directionLight.color = new Laya.Vector3(0.6, 0.6, 0.6);
        directionLight.direction = new Laya.Vector3(1, -1, -1);
        Laya.Mesh.load("res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/LayaMonkey-LayaMonkey.lm", Laya.Handler.create(this, this.loadSprite3D));
    }

    loadSprite3D(sp){
        this.layaMonkey = this.scene.addChild(new Laya.MeshSprite3D(sp));
        //加载材质
        this.layaMonkey.meshRenderer.material = Laya.BlinnPhongMaterial.load("res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/Materials/T_Diffuse.lmat");
        this.layaMonkey.transform.localScale = new Laya.Vector3(0.3, 0.3, 0.3);
        this.layaMonkey.transform.rotation = new Laya.Quaternion(0.7071068, 0, 0, -0.7071067);
        Laya.timer.frameLoop(1, this, this.rotateSprite3D);
    }

    rotateSprite3D(){
        this.layaMonkey.transform.rotate(this.rotation, false);
    }
}


//激活启动类
new BlinnPhongMaterialLoad();