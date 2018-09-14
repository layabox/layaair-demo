var StandardMaterial_NormalMap = /** @class */ (function () {
    function StandardMaterial_NormalMap() {
        this.rotation = new Laya.Vector3(0, 0.01, 0);
        this.normalMapUrl = [
            "../../res/threeDimen/threeDimen/staticModel/lizard/Assets/Lizard/lizardeye_norm.png",
            "../../res/threeDimen/threeDimen/staticModel/lizard/Assets/Lizard/lizard_norm.png",
            "../../res/threeDimen/threeDimen/staticModel/lizard/Assets/Lizard/rock_norm.png"
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
        directionLight.transform.worldMatrix.setForward(new Laya.Vector3(0.0, -0.8, -1.0));
        directionLight.color = new Laya.Vector3(1, 1, 1);
        Laya.loader.create("../../res/threeDimen/threeDimen/staticModel/lizard/lizard.lh", Laya.Handler.create(this, this.onComplete));
    }
    StandardMaterial_NormalMap.prototype.onComplete = function () {
        var monster1 = this.scene.addChild(Laya.Sprite3D.load("../../res/threeDimen/threeDimen/staticModel/lizard/lizard.lh"));
        monster1.transform.position = new Laya.Vector3(-0.6, 0, 0);
        monster1.transform.localScale = new Laya.Vector3(0.075, 0.075, 0.075);
        var monster2 = Laya.Sprite3D.instantiate(monster1, this.scene, false, new Laya.Vector3(0.6, 0, 0));
        monster2.transform.localScale = new Laya.Vector3(0.075, 0.075, 0.075);
        for (var i = 0; i < monster2.getChildByName("lizard").numChildren; i++) {
            var meshSprite3D = monster2.getChildByName("lizard").getChildAt(i);
            var material = meshSprite3D.meshRenderer.material;
            //法线贴图
            material.normalTexture = Laya.Texture2D.load(this.normalMapUrl[i]);
        }
        Laya.timer.frameLoop(1, this, function () {
            monster1.transform.rotate(this.rotation);
            monster2.transform.rotate(this.rotation);
        });
    };
    return StandardMaterial_NormalMap;
}());
new StandardMaterial_NormalMap;
