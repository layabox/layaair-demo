class PBRStandardMaterialDemo
{
    constructor()
    {
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        Laya.Scene3D.load("../../res/threeDimen/scene/PBRMaterialScene/Showcase.ls", Laya.Handler.create(null, function(scene:Laya.Scene3D):void {
            Laya.stage.addChild(scene);
            var camera:Laya.Camera = scene.getChildByName("Main Camera") as Laya.Camera;
            camera.addComponent(CameraMoveScript);
            camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;
            Laya.BaseMaterial.load("../../res/threeDimen/skyBox/DawnDusk/SkyBox.lmat", Laya.Handler.create(null, function(skyMaterial:Laya.SkyBoxMaterial):void {
                camera.skyboxMaterial = skyMaterial;
            }));
            
            //实例PBR材质
            var mat:Laya.PBRStandardMaterial = new Laya.PBRStandardMaterial();
            //反射贴图
            Laya.Texture2D.load('../../res/threeDimen/scene/PBRMaterialScene/Assets/PBR Barrel/Materials/Textures/Barrel_AlbedoTransparency.png', Laya.Handler.create(this, function(texture:Laya.Texture2D):void {
                mat.albedoTexture = texture;
            }));
            
            //法线贴图
            Laya.Texture2D.load('../../res/threeDimen/scene/PBRMaterialScene/Assets/PBR Barrel/Materials/Textures/Barrel_Normal.png', Laya.Handler.create(null, function(texture:Laya.Texture2D):void {
                mat.normalTexture = texture;
            }));
            
            //金属光滑度贴图
            Laya.Texture2D.load('../../res/threeDimen/scene/PBRMaterialScene/Assets/PBR Barrel/Materials/Textures/Barrel_MetallicSmoothness.png', Laya.Handler.create(null, function(texture:Laya.Texture2D):void {
                mat.metallicGlossTexture = texture;
            }));
            
            //遮挡贴图
            Laya.Texture2D.load('../../res/threeDimen/scene/PBRMaterialScene/Assets/PBR Barrel/Materials/Textures/Barrel_Occlusion.png', Laya.Handler.create(null, function(texture:Laya.Texture2D):void {
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
            
            var barrel:Laya.MeshSprite3D = scene.getChildByName("Wooden_Barrel") as Laya.MeshSprite3D;
            var barrel1:Laya.MeshSprite3D = scene.getChildByName("Wooden_Barrel (1)") as Laya.MeshSprite3D;
            var barrel2:Laya.MeshSprite3D = scene.getChildByName("Wooden_Barrel (2)") as Laya.MeshSprite3D;
            var barrel3:Laya.MeshSprite3D = scene.getChildByName("Wooden_Barrel (3)") as Laya.MeshSprite3D;
            
            barrel.meshRenderer.sharedMaterial = mat;
            barrel1.meshRenderer.sharedMaterial = mat;
            barrel2.meshRenderer.sharedMaterial = mat;
            barrel3.meshRenderer.sharedMaterial = mat;
        }));
    
    }
}
new PBRStandardMaterialDemo;