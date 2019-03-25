class BlinnPhongMaterialLoad {
    private rotation:Laya.Vector3 = new Laya.Vector3(0, 0.01, 0);
    constructor() {
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        
        var scene:Laya.Scene3D = Laya.stage.addChild(new Laya.Scene3D()) as Laya.Scene3D;
        
        var camera:Laya.Camera = scene.addChild(new Laya.Camera(0, 0.1, 100)) as Laya.Camera;
        camera.transform.translate(new Laya.Vector3(0, 0.9, 1.5));
        camera.transform.rotate(new Laya.Vector3( -15, 0, 0), true, false);
        
        var directionLight:Laya.DirectionLight = scene.addChild(new Laya.DirectionLight()) as Laya.DirectionLight;
        directionLight.color = new Laya.Vector3(0.6, 0.6, 0.6);
        
        Laya.Mesh.load("res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/LayaMonkey-LayaMonkey.lm", Laya.Handler.create(this, function(mesh:Laya.Mesh):void {
            var layaMonkey:Laya.MeshSprite3D = scene.addChild(new Laya.MeshSprite3D(mesh)) as Laya.MeshSprite3D;
            //加载材质
            Laya.BaseMaterial.load("res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/Materials/T_Diffuse.lmat",  Laya.Handler.create(null, function(mat: Laya.BaseMaterial):void {
				layaMonkey.meshRenderer.material = mat;
			}));
            layaMonkey.transform.localScale = new Laya.Vector3(0.3, 0.3, 0.3);
            layaMonkey.transform.rotation = new Laya.Quaternion(0.7071068, 0, 0, -0.7071067);
            
            Laya.timer.frameLoop(1, this, function():void {
                layaMonkey.transform.rotate(this.rotation, false);
            });
        }))
    }
}
new BlinnPhongMaterialLoad;