
        Laya.Shader3D.debugMode = true;
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        Laya.Scene3D.load("res/threeDimen/scene/TerrainScene/XunLongShi.ls", Laya.Handler.create(null, function (scene) {
            Laya.stage.addChild(scene);
            var camera = scene.getChildByName("Main Camera");
            camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;
            camera.addComponent(CameraMoveScript);
            Laya.BaseMaterial.load("res/threeDimen/skyBox/skyBox3/skyBox3.lmat", Laya.Handler.create(null, function (mat) {
                camera.skyboxMaterial = mat;
            }));
            scene.getChildByName('Scenes').getChildByName('HeightMap').active = false;
            scene.getChildByName('Scenes').getChildByName('Area').active = false;
        }));