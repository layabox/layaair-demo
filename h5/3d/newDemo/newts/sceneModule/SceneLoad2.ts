import CameraMoveScript from "./common/CameraMoveScript"
class TerrainScene {
    constructor() {
        Laya.Shader3D.debugMode = true;
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        
    	Laya.Scene3D.load("res/threeDimen/scene/TerrainScene/XunLongShi.ls", Laya.Handler.create(null, function(scene:Laya.Scene3D):void {
            Laya.stage.addChild(scene);
            var camera:Laya.Camera = scene.getChildByName("Main Camera") as Laya.Camera;
            camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;
            camera.addComponent(CameraMoveScript);
            
            Laya.BaseMaterial.load("res/threeDimen/skyBox/skyBox3/skyBox3.lmat", Laya.Handler.create(null, function(mat:Laya.BaseMaterial):void {
				var skyRenderer:Laya.SkyRenderer = camera.skyRenderer;
				skyRenderer.mesh = Laya.SkyBox.instance;
				skyRenderer.material = mat;
            }));
            
            (scene.getChildByName('Scenes').getChildByName('HeightMap') as Laya.MeshSprite3D).active = false;
            (scene.getChildByName('Scenes').getChildByName('Area') as Laya.MeshSprite3D).active = false;
        }))
    }
    
}
new TerrainScene;