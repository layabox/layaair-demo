class EffectMaterialDemo{
    constructor(){
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        
        var scene = Laya.stage.addChild(new Laya.Scene3D());
        this.rotation = new Laya.Vector3(0, 0.01, 0);
        
        var camera = (scene.addChild(new Laya.Camera(0, 0.1, 100)));
        camera.transform.translate(new Laya.Vector3(0, 0.5, 1.5));
        camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
        camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;
        
        var directionLight = scene.addChild(new Laya.DirectionLight());
        directionLight.color = new Laya.Vector3(1, 1, 1);
        
        var earth = scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createSphere()));
        earth.transform.position = new Laya.Vector3(0, 0, 0);
        //创建EffectMaterial材质
        var material = new Laya.EffectMaterial();
        Laya.Texture2D.load("res/threeDimen/texture/earth.png", Laya.Handler.create(this, function(texture) {
            //设置纹理
            material.texture = texture;
            //设置材质颜色
            material.color = new Laya.Vector4(0, 0, 0.6, 1);
        }));
        earth.meshRenderer.material = material;
        
        Laya.timer.frameLoop(1, this, function() {
            earth.transform.rotate(this.rotation, false);
        });
    }
}
//激活启动类
new EffectMaterialDemo();