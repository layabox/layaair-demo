class BlinnPhong_DiffuseMap{
    constructor(){
        this.rotation = new Laya.Vector3(0, 0.01, 0);
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        let scene = Laya.stage.addChild(new Laya.Scene3D());
        let camera = (scene.addChild(new Laya.Camera(0, 0.1, 100)));
        camera.transform.translate(new Laya.Vector3(0, 0.5, 1.5));
        camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
        camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;
        let directionLight = scene.addChild(new Laya.DirectionLight());
        directionLight.direction = new Laya.Vector3(0, -0.8, -1);
        directionLight.color = new Laya.Vector3(1, 1, 1);
        //创建公用的mesh
        var sphereMesh = Laya.PrimitiveMesh.createSphere();
        this.earth1 = scene.addChild(new Laya.MeshSprite3D(sphereMesh));
        this.earth1.transform.position = new Laya.Vector3(-0.6, 0, 0);
        this.earth2 = scene.addChild(new Laya.MeshSprite3D(sphereMesh));
        this.earth2.transform.position = new Laya.Vector3(0.6, 0, 0);
        this.material = new Laya.BlinnPhongMaterial();
        //漫反射贴图
        Laya.Texture2D.load("res/threeDimen/texture/earth.png", Laya.Handler.create(this,this.loadTexture));
        this.earth2.meshRenderer.material = this.material;
        Laya.timer.frameLoop(1, this, this.rotatEarth);
    }

    loadTexture(texture){
        this.material.albedoTexture = texture;
    }

    rotatEarth(){
        this.earth1.transform.rotate(this.rotation, false);
        this.earth2.transform.rotate(this.rotation, false);
    }

}


//激活启动类
new BlinnPhong_DiffuseMap();
