import CameraMoveScript from "./common/CameraMoveScript"
class BlinnPhong_SpecularMap {
    private scene:Laya.Scene3D;
    private rotation:Laya.Vector3 = new Laya.Vector3(0, 0.01, 0);
    private specularMapUrl:Array<string> = [
        "res/threeDimen/skinModel/dude/Assets/dude/headS.png", 
        "res/threeDimen/skinModel/dude/Assets/dude/jacketS.png", 
        "res/threeDimen/skinModel/dude/Assets/dude/pantsS.png", 
        "res/threeDimen/skinModel/dude/Assets/dude/upBodyS.png",
        "res/threeDimen/skinModel/dude/Assets/dude/upBodyS.png"
    ];
    constructor() {
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        
        this.scene = Laya.stage.addChild(new Laya.Scene3D()) as Laya.Scene3D;
        
        var camera:Laya.Camera = (this.scene.addChild(new Laya.Camera(0, 0.1, 1000))) as Laya.Camera;
        camera.transform.translate(new Laya.Vector3(0, 3, 5));
        camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
        camera.addComponent(CameraMoveScript);
        
        var directionLight:Laya.DirectionLight = this.scene.addChild(new Laya.DirectionLight()) as Laya.DirectionLight;
        directionLight.color = new Laya.Vector3(1, 1, 1);
        
        // var completeHandler:Laya.Handler = Laya.Handler.create(this, this.onComplete);
        
        Laya.loader.create("res/threeDimen/skinModel/dude/dude.lh", Laya.Handler.create(this, this.onComplete));
}
    public onComplete():void {
            
        Laya.Sprite3D.load("res/threeDimen/skinModel/dude/dude.lh", Laya.Handler.create(this, function(sprite:Laya.Sprite3D):void {
            var dude1:Laya.Sprite3D = this.scene.addChild(sprite) as Laya.Sprite3D;
            dude1.transform.position = new Laya.Vector3(-1.5, 0, 0);
            
            var dude2:Laya.Sprite3D = Laya.Sprite3D.instantiate(dude1, this.scene, false, new Laya.Vector3(1.5, 0, 0));
            var skinnedMeshSprite3d:Laya.SkinnedMeshSprite3D = dude2.getChildAt(0).getChildAt(0) as Laya.SkinnedMeshSprite3D;
            
            for (var i:number = 0; i < skinnedMeshSprite3d.skinnedMeshRenderer.materials.length; i++) {
                var material:Laya.BlinnPhongMaterial = skinnedMeshSprite3d.skinnedMeshRenderer.materials[i] as Laya.BlinnPhongMaterial;
                Laya.Texture2D.load(this.specularMapUrl[i], Laya.Handler.create(this, function(mat:Laya.BlinnPhongMaterial, tex:Laya.Texture2D):void {
                    mat.specularTexture = tex;//高光贴图
                }, [material]));
            }
            
            Laya.timer.frameLoop(1, this, function():void {
                dude1.transform.rotate(this.rotation);
                dude2.transform.rotate(this.rotation);
            });
        }));
    }
}
new BlinnPhong_SpecularMap;