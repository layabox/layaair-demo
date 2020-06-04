class SpotLightShadowMap{
    constructor(){
        Laya3D.init(0,0);
        Laya.Stat.show();
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Shader3D.debugMode = true;
    
        Laya.Scene3D.load("res/threeDimen/testNewFunction/LayaScene_depthScene/Conventional/depthScene.ls", Laya.Handler.create(this, function (scene) {
            this.demoScene = Laya.stage.addChild(scene);  
            this.camera= scene.getChildByName("Camera");
            this.camera.addComponent(CameraMoveScript);
            this.camera.active = true; 
            this.receaveRealShadow(this.demoScene);
        }));
    }
    receaveRealShadow(scene3d)
    {
        var childLength = scene3d.numChildren;
        for(var i = 0;i<childLength;i++)
        {
            var childSprite = scene3d.getChildAt(i);
            if(childSprite instanceof Laya.MeshSprite3D)
            {
                childSprite.meshRenderer.receiveShadow = true;
                childSprite.meshRenderer.castShadow = true;
            }
            else if(childSprite instanceof Laya.SpotLight)
            {
                childSprite.shadowMode = Laya.ShadowMode.Hard;
                // Set shadow max distance from camera.
                childSprite.shadowDistance = 3;
                // Set shadow resolution.
                childSprite.shadowResolution = 512;
                // set shadow Bias
                childSprite.shadowDepthBias = 1.0;
            }
        }
        return ;  
    }
   
}

new SpotLightShadowMap();