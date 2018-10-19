class PBRStandardMaterialDemo{
    constructor(){
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        Laya.Scene3D.load("res/threeDimen/scene/PBRMaterialScene/Showcase.ls", Laya.Handler.create(this, this.loadSprite3D));

		this.scene = Laya.stage.addChild(new Laya.Scene3D());
        this.camera = (this.scene.addChild(new Laya.Camera()));
        //实例PBR材质
        this.mat = new Laya.PBRStandardMaterial();
		
    }

    loadSprite3D(scene){
		this.scene = scene;
        Laya.stage.addChild(this.scene);
        this.camera = this.scene.getChildByName("Main Camera");
        this.camera.addComponent(CameraMoveScript);
        this.camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;
        Laya.BaseMaterial.load("res/threeDimen/skyBox/DawnDusk/SkyBox.lmat", Laya.Handler.create(this, this.loadMaterial));

        //为材质设置贴图
        this.setTexture();

        //为模型设置材质
        this.setMaterial();

    }

    loadMaterial(skyMaterial){
        this.camera.skyboxMaterial = skyMaterial;
    }

    setTexture(){
        //反射贴图
        Laya.Texture2D.load('res/threeDimen/scene/PBRMaterialScene/Assets/PBR Barrel/Materials/Textures/Barrel_AlbedoTransparency.png', Laya.Handler.create(this, function (texture) {
            this.mat.albedoTexture = texture;
        }));
        //法线贴图
        Laya.Texture2D.load('res/threeDimen/scene/PBRMaterialScene/Assets/PBR Barrel/Materials/Textures/Barrel_Normal.png', Laya.Handler.create(this, function (texture) {
            this.mat.normalTexture = texture;
        }));
        //金属光滑度贴图
        Laya.Texture2D.load('res/threeDimen/scene/PBRMaterialScene/Assets/PBR Barrel/Materials/Textures/Barrel_MetallicSmoothness.png', Laya.Handler.create(this, function (texture) {
            this.mat.metallicGlossTexture = texture;
        }));
        //遮挡贴图
        Laya.Texture2D.load('res/threeDimen/scene/PBRMaterialScene/Assets/PBR Barrel/Materials/Textures/Barrel_Occlusion.png', Laya.Handler.create(this, function (texture) {
            this.mat.occlusionTexture = texture;
        }));
    }

    setMaterial(){
        this.mat.albedoColor = new Laya.Vector4(1, 1, 1, 1);
        //光滑度缩放系数
        this.mat.smoothnessTextureScale = 1.0;
        //遮挡贴图强度
        this.mat.occlusionTextureStrength = 1.0;
        //法线贴图缩放洗漱
        this.mat.normalScale = 1;
        //光滑度数据源:从金属度贴图/反射贴图获取。
        this.mat.smoothnessSource = Laya.PBRStandardMaterial.SmoothnessSource_MetallicGlossTexture_Alpha;
        var barrel = this.scene.getChildByName("Wooden_Barrel");
        var barrel1 = this.scene.getChildByName("Wooden_Barrel (1)");
        var barrel2 = this.scene.getChildByName("Wooden_Barrel (2)");
        var barrel3 = this.scene.getChildByName("Wooden_Barrel (3)");
        barrel.meshRenderer.sharedMaterial = this.mat;
        barrel1.meshRenderer.sharedMaterial = this.mat;
        barrel2.meshRenderer.sharedMaterial = this.mat;
        barrel3.meshRenderer.sharedMaterial = this.mat;
    }

}


//激活启动类
new PBRStandardMaterialDemo();
