class Shader_Terrain{
    constructor(){
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        CustomTerrainMaterial.initShader();
        this.scene = Laya.stage.addChild(new Laya.Scene3D());
        let camera = this.scene.addChild(new Laya.Camera(0, 0.1, 1000));
        camera.transform.rotate(new Laya.Vector3(-18, 180, 0), false, false);
        camera.transform.translate(new Laya.Vector3(-28, 20, -18), false);
        camera.addComponent(CameraMoveScript);
        this.customMaterial = new CustomTerrainMaterial();
        Laya.Mesh.load("res/threeDimen/skinModel/Terrain/terrain_New-Part-01.lm", Laya.Handler.create(this, this.loadSprite3D));
    }

    loadSprite3D(mesh){
            let terrain = this.scene.addChild(new Laya.MeshSprite3D(mesh));
            var line = this.scene.addChild(new Laya.PixelLineSprite3D(100000));
            Tool.linearModel(terrain, line, Laya.Color.GREEN);
            terrain.active = false;
            Laya.Texture2D.load("res/threeDimen/skinModel/Terrain/splatAlphaTexture.png", Laya.Handler.create(this, this.loadSplatAlphaTexture));
            Laya.Texture2D.load("res/threeDimen/skinModel/Terrain/ground_01.jpg", Laya.Handler.create(this, this.loadDiffuseTexture1));
            Laya.Texture2D.load("res/threeDimen/skinModel/Terrain/ground_02.jpg", Laya.Handler.create(this, this.loadDiffuseTexture2));
            Laya.Texture2D.load("res/threeDimen/skinModel/Terrain/ground_03.jpg", Laya.Handler.create(this, this.loadDiffuseTexture3));
            Laya.Texture2D.load("res/threeDimen/skinModel/Terrain/ground_04.jpg", Laya.Handler.create(this, this.loadDiffuseTexture4));
            this.customMaterial.setDiffuseScale1(new Laya.Vector2(27.92727, 27.92727));
            this.customMaterial.setDiffuseScale2(new Laya.Vector2(13.96364, 13.96364));
            this.customMaterial.setDiffuseScale3(new Laya.Vector2(18.61818, 18.61818));
            this.customMaterial.setDiffuseScale4(new Laya.Vector2(13.96364, 13.96364));
            this.customMaterial.ambientColor = new Laya.Vector3(1, 1, 1);
            this.customMaterial.diffuseColor = new Laya.Vector3(1, 1, 1);
            this.customMaterial.specularColor = new Laya.Vector4(1, 1, 1, 8);
            terrain.meshRenderer.sharedMaterial = this.customMaterial;
    }
    loadSplatAlphaTexture(tex){
        this.customMaterial.splatAlphaTexture = tex;
    }
    loadDiffuseTexture1(tex){
        this.customMaterial.diffuseTexture1 = tex;
    }
    loadDiffuseTexture2(tex){
        this.customMaterial.diffuseTexture2 = tex;
    }
    loadDiffuseTexture3(tex){
        this.customMaterial.diffuseTexture3 = tex;
    }
    loadDiffuseTexture4(tex){
        this.customMaterial.diffuseTexture4 = tex;
    }
}

//激活启动类
new Shader_Terrain();

