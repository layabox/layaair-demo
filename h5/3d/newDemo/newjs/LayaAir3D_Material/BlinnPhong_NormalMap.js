class BlinnPhong_NormalMap{
    constructor(){
        this.rotation = new Laya.Vector3(0, 0.01, 0);
        this.normalMapUrl = [
            "res/threeDimen/staticModel/lizard/Assets/Lizard/lizardeye_norm.png",
            "res/threeDimen/staticModel/lizard/Assets/Lizard/lizard_norm.png",
            "res/threeDimen/staticModel/lizard/Assets/Lizard/rock_norm.png"
        ];
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        this.scene = Laya.stage.addChild(new Laya.Scene3D());
        var camera = (this.scene.addChild(new Laya.Camera(0, 0.1, 100)));
        camera.transform.translate(new Laya.Vector3(0, 0.6, 1.1));
        camera.transform.rotate(new Laya.Vector3(-30, 0, 0), true, false);
        var directionLight = this.scene.addChild(new Laya.DirectionLight());
        var mat = directionLight.transform.worldMatrix;
        mat.setForward(new Laya.Vector3(0.0, -0.8, -1.0));
        directionLight.transform.worldMatrix = mat;
        directionLight.color = new Laya.Vector3(1, 1, 1);
        Laya.loader.create("res/threeDimen/staticModel/lizard/lizard.lh", Laya.Handler.create(this, this.onComplete), this, Laya3D.HIERARCHY);
    }

    onComplete(){
        Laya.Sprite3D.load("res/threeDimen/staticModel/lizard/lizard.lh", Laya.Handler.create(this, this.loadSprite3D));
    }
    //加载精灵
    loadSprite3D(sprite){
        this.monster1 = this.scene.addChild(sprite);
        this. monster1.transform.position = new Laya.Vector3(-0.6, 0, 0);
        this.monster1.transform.localScale = new Laya.Vector3(0.075, 0.075, 0.075);
        this.monster2 = Laya.Sprite3D.instantiate(this.monster1, this.scene, false, new Laya.Vector3(0.6, 0, 0));
        this.monster2.transform.localScale = new Laya.Vector3(0.075, 0.075, 0.075);

        for (var i = 0; i < this.monster2.getChildByName("lizard").numChildren; i++) {
                var meshSprite3D = this.monster2.getChildByName("lizard").getChildAt(i);
                var material = meshSprite3D.meshRenderer.material;
                //法线贴图
                Laya.Texture2D.load(this.normalMapUrl[i], Laya.Handler.create(this, this.loadTexture, [material]));
        }   

        Laya.timer.frameLoop(1, this, this.rotateSprite);
    }

    //设置纹理
    loadTexture(mat, texture){
        mat.normalTexture = texture;
    }
    //旋转精灵
    rotateSprite(){
        this.monster1.transform.rotate(this.rotation);
        this.monster2.transform.rotate(this.rotation);
    }
}


//激活启动类
new BlinnPhong_NormalMap();
