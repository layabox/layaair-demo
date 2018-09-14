var PBRStandardMaterialDemo = /** @class */ (function () {
    function PBRStandardMaterialDemo() {
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        Laya.Scene3D.load("../../res/threeDimen/scene/PBRMaterialScene/Showcase.ls", Laya.Handler.create(null, function (scene) {
            Laya.stage.addChild(scene);
            var camera = scene.getChildByName("Main Camera");
            camera.addComponent(CameraMoveScript);
            camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;
            Laya.BaseMaterial.load("../../res/threeDimen/skyBox/DawnDusk/SkyBox.lmat", Laya.Handler.create(null, function (skyMaterial) {
                camera.skyboxMaterial = skyMaterial;
            }));
            //实例PBR材质
            var mat = new Laya.PBRStandardMaterial();
            //反射贴图
            Laya.Texture2D.load('../../res/threeDimen/scene/PBRMaterialScene/Assets/PBR Barrel/Materials/Textures/Barrel_AlbedoTransparency.png', Laya.Handler.create(this, function (texture) {
                mat.albedoTexture = texture;
            }));
            //法线贴图
            Laya.Texture2D.load('../../res/threeDimen/scene/PBRMaterialScene/Assets/PBR Barrel/Materials/Textures/Barrel_Normal.png', Laya.Handler.create(null, function (texture) {
                mat.normalTexture = texture;
            }));
            //金属光滑度贴图
            Laya.Texture2D.load('../../res/threeDimen/scene/PBRMaterialScene/Assets/PBR Barrel/Materials/Textures/Barrel_MetallicSmoothness.png', Laya.Handler.create(null, function (texture) {
                mat.metallicGlossTexture = texture;
            }));
            //遮挡贴图
            Laya.Texture2D.load('../../res/threeDimen/scene/PBRMaterialScene/Assets/PBR Barrel/Materials/Textures/Barrel_Occlusion.png', Laya.Handler.create(null, function (texture) {
                mat.occlusionTexture = texture;
            }));
            //反射颜色
            mat.albedoColor = new Laya.Vector4(1, 1, 1, 1);
            //光滑度缩放系数
            mat.smoothnessTextureScale = 1.0;
            //遮挡贴图强度
            mat.occlusionTextureStrength = 1.0;
            //法线贴图缩放洗漱
            mat.normalScale = 1;
            //光滑度数据源:从金属度贴图/反射贴图获取。
            mat.smoothnessSource = Laya.PBRStandardMaterial.SmoothnessSource_MetallicGlossTexture_Alpha;
            var barrel = scene.getChildByName("Wooden_Barrel");
            var barrel1 = scene.getChildByName("Wooden_Barrel (1)");
            var barrel2 = scene.getChildByName("Wooden_Barrel (2)");
            var barrel3 = scene.getChildByName("Wooden_Barrel (3)");
            barrel.meshRenderer.sharedMaterial = mat;
            barrel1.meshRenderer.sharedMaterial = mat;
            barrel2.meshRenderer.sharedMaterial = mat;
            barrel3.meshRenderer.sharedMaterial = mat;
        }));
    }
    return PBRStandardMaterialDemo;
}());
new PBRStandardMaterialDemo;
