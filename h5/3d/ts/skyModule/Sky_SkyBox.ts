class Sky_SkyBox {
	var camera:Laya.Camera;
    constructor() {
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        var scene:Laya.Scene3D = Laya.stage.addChild(new Laya.Scene3D()) as Laya.Scene3D;
        
        this.camera = scene.addChild(new Laya.Camera(0, 0.1, 100)) as Laya.Camera;
        this.camera.transform.rotate(new Laya.Vector3( 10, 0, 0), true, false);
        this.camera.addComponent(CameraMoveScript);
        this.camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;
        
        //天空盒
        Laya.BaseMaterial.load("../../res/threeDimen/skyBox/DawnDusk/SkyBox.lmat", Laya.Handler.create(null, function(mat:Laya.SkyBoxMaterial):void {
			var skyRenderer = new Laya.SkyRenderer();
		    skyRenderer.mesh = Laya.SkyBox.instance;
		    skyRenderer.material = mat;
		    this.camera.skyRenderer = skyRenderer;
		    Laya.timer.frameLoop(1, this, this.onFrameLoop);
            Laya.timer.frameLoop(1, this, function():void {
				this.camera.skyRenderer.material.exposure = Math.sin(this.exposureNumber += 0.01) + 1;
		        this.camera.skyRenderer.material.rotation += 0.01;
            });
        }))
    }
}
new Sky_SkyBox;