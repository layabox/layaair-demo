import CameraMoveScript from "./common/CameraMoveScript"
import CartoonMaterial from "./customMaterials/cartoonMaterial"
class Shader_CartoonRender {
private kiana:Laya.Sprite3D;
    
    public constructor() {
        //初始化引擎
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        //显示性能面板
        Laya.Stat.show();
        
        //自定义材质初始化shader
        CartoonMaterial.initShader();
        
        //加载场景
        Laya.Scene3D.load("res/threeDimen/cartoon/CartoonTest.ls", Laya.Handler.create(this, function(scene:Laya.Scene3D) {
            Laya.stage.addChild(scene);
            //获取场景相机
            var camera = scene.getChildByName("Main Camera") as Laya.Camera;
            camera.addComponent(CameraMoveScript);
            //添加光照
            var directionLight = scene.addChild(new Laya.DirectionLight()) as Laya.DirectionLight;
            directionLight.color = new Laya.Vector3(1, 1, 1);
            directionLight.transform.rotate(new Laya.Vector3(-1.14 / 3, 0, 0));
            
            this.kiana = scene.getChildByName("Kiana") as Laya.Sprite3D;
            this.setkianaCartoon();
        }));
    }
    
    public setkianaCartoon():void {
        var kiana_Cartoon = this.kiana.getChildByName("Kiana_Cartoon") as Laya.Sprite3D;
        
        var kiana_cartoon_face = kiana_Cartoon.getChildByName("Face") as Laya.MeshSprite3D;
        var kiana_cartoon_hair = kiana_Cartoon.getChildByName("Hair") as Laya.MeshSprite3D;
        var kiana_cartoon_body = kiana_Cartoon.getChildByName("Body") as Laya.MeshSprite3D;
        
        //创建材质
        var faceMaterial:CartoonMaterial = new CartoonMaterial();
        //加载纹理
        Laya.Texture2D.load("res/threeDimen/cartoon/Assets/CartoonTest/Texture/Avatar_Kiana_C1_Texture_Face_Color_Common.png", Laya.Handler.create(null, function(tex:Laya.Texture2D):void {
            faceMaterial.albedoTexture = tex;
        }));
        Laya.Texture2D.load("res/threeDimen/cartoon/Assets/CartoonTest/Texture/Avatar_Kiana_C1_Texture_Face_LightMap_Common.png", Laya.Handler.create(null, function(tex:Laya.Texture2D):void {
            faceMaterial.blendTexture = tex;
        }));
        //设置材质属性
        faceMaterial.shadowColor = new Laya.Vector4(0.8, 0.8, 0.8, 1.0);
        faceMaterial.shadowRange = 0.188;
        faceMaterial.shadowIntensity = 0.88;
        faceMaterial.specularRange = 0.9955;
        faceMaterial.specularIntensity = 0.99;
        
        //faceMaterial.outlineTexture = Texture2D.load("CartoonRender2/Assets/CartoonTest/Texture/Avatar_Yae_sakura_C1_Texture_Body_LightMap_1ShadowColor.png");
        //设置描边线条的宽度
        faceMaterial.outlineWidth = 0.002;
        //设置描边线条的亮度
        faceMaterial.outlineLightness = 0.25;
        
        var hairMaterial:CartoonMaterial = new CartoonMaterial();
        Laya.Texture2D.load("res/threeDimen/cartoon/Assets/CartoonTest/Texture/Avatar_Kiana_C2_Texture_Hair_Color_Common.png", Laya.Handler.create(null, function(tex:Laya.Texture2D):void {
            hairMaterial.albedoTexture = tex;
        }));
        Laya.Texture2D.load("res/threeDimen/cartoon/Assets/CartoonTest/Texture/Avatar_Kiana_C2_Texture_Hair_LightMap_Common.png",Laya.Handler.create(null, function(tex:Laya.Texture2D):void {
            hairMaterial.blendTexture = tex;
        }));
        hairMaterial.shadowColor = new Laya.Vector4(0.8, 0.8, 0.8, 1.0);
        hairMaterial.shadowRange = 0.27;
        hairMaterial.shadowIntensity = 0.7956449;
        hairMaterial.specularRange = 0.9820514;
        hairMaterial.specularIntensity = 1.0;
        
        //hairMaterial.outlineTexture = Texture2D.load("CartoonRender2/Assets/CartoonTest/Texture/Avatar_Yae_sakura_C1_Texture_Body_LightMap_1ShadowColor.png");
        hairMaterial.outlineWidth = 0.002;
        hairMaterial.outlineLightness = 0.25;
        
        var bodyMaterial:CartoonMaterial = new CartoonMaterial();
        Laya.Texture2D.load("res/threeDimen/cartoon/Assets/CartoonTest/Texture/Avatar_Kiana_C2_Texture_Body_Color_RGB2048.png", Laya.Handler.create(null, function(tex:Laya.Texture2D):void {
            bodyMaterial.albedoTexture = tex;
        }));
        Laya.Texture2D.load("res/threeDimen/cartoon/Assets/CartoonTest/Texture/Avatar_Kiana_C2_Texture_Body_LightMap_Common.png", Laya.Handler.create(null, function(tex:Laya.Texture2D):void {
            bodyMaterial.blendTexture = tex;
        }));
        bodyMaterial.shadowColor = new Laya.Vector4(0.8, 0.8, 0.8, 1.0);
        bodyMaterial.shadowRange = 0.046;
        bodyMaterial.shadowIntensity = 0.816;
        bodyMaterial.specularRange = 0.985;
        bodyMaterial.specularIntensity = 0.938;
        
        //bodyMaterial.outlineTexture = Texture2D.load("CartoonRender2/Assets/CartoonTest/Texture/Avatar_Yae_sakura_C1_Texture_Body_LightMap_1ShadowColor.png");
        bodyMaterial.outlineWidth = 0.002;
        bodyMaterial.outlineLightness = 0.25;
        kiana_cartoon_face.meshRenderer.sharedMaterial = faceMaterial;
        kiana_cartoon_hair.meshRenderer.sharedMaterial = hairMaterial;
        kiana_cartoon_body.meshRenderer.sharedMaterial = bodyMaterial;
    }
}

new Shader_CartoonRender;