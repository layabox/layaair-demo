var BlinnPhong_SpecularMap = /** @class */ (function () {
    function BlinnPhong_SpecularMap() {
        this.rotation = new Laya.Vector3(0, 0.01, 0);
        this.specularMapUrl = [
            "../../res/threeDimen/skinModel/dude/Assets/dude/headS.png",
            "../../res/threeDimen/skinModel/dude/Assets/dude/jacketS.png",
            "../../res/threeDimen/skinModel/dude/Assets/dude/pantsS.png",
            "../../res/threeDimen/skinModel/dude/Assets/dude/upBodyS.png",
            "../../res/threeDimen/skinModel/dude/Assets/dude/upBodyS.png"
        ];
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        this.scene = Laya.stage.addChild(new Laya.Scene3D());
        var camera = (this.scene.addChild(new Laya.Camera(0, 0.1, 1000)));
        camera.transform.translate(new Laya.Vector3(0, 3, 5));
        camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
        camera.addComponent(CameraMoveScript);
        var directionLight = this.scene.addChild(new Laya.DirectionLight());
        directionLight.direction = new Laya.Vector3(0, -0.8, -1);
        directionLight.color = new Laya.Vector3(1, 1, 1);
        // var completeHandler:Laya.Handler = Laya.Handler.create(this, this.onComplete);
        Laya.loader.create("../../res/threeDimen/skinModel/dude/dude.lh", Laya.Handler.create(this, this.onComplete));
    }
    BlinnPhong_SpecularMap.prototype.onComplete = function () {
        Laya.Sprite3D.load("../../res/threeDimen/skinModel/dude/dude.lh", Laya.Handler.create(this, function (sprite) {
            var dude1 = this.scene.addChild(sprite);
            dude1.transform.position = new Laya.Vector3(-1.5, 0, 0);
            var dude2 = Laya.Sprite3D.instantiate(dude1, this.scene, false, new Laya.Vector3(1.5, 0, 0));
            var skinnedMeshSprite3d = dude2.getChildAt(0).getChildAt(0);
            for (var i = 0; i < skinnedMeshSprite3d.skinnedMeshRenderer.materials.length; i++) {
                var material = skinnedMeshSprite3d.skinnedMeshRenderer.materials[i];
                Laya.Texture2D.load(this.specularMapUrl[i], Laya.Handler.create(this, function (mat, tex) {
                    mat.specularTexture = tex; //高光贴图
                }, [material]));
            }
            Laya.timer.frameLoop(1, this, function () {
                dude1.transform.rotate(this.rotation);
                dude2.transform.rotate(this.rotation);
            });
        }));
    };
    return BlinnPhong_SpecularMap;
}());
new BlinnPhong_SpecularMap;
