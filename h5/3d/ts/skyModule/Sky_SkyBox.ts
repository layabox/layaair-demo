class Sky_SkyBox {
	private scene:Laya.Scene3D;
	private camera:Laya.Camera;
    constructor() {
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        this.scene = Laya.stage.addChild(new Laya.Scene3D());
        
        this.camera = this.scene.addChild(new Laya.Camera(0, 0.1, 100));
        this.camera.transform.rotate(new Laya.Vector3( 10, 0, 0), true, false);
        this.camera.addComponent(CameraMoveScript);
        this.camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;
        
        //天空盒
        Laya.BaseMaterial.load("../../res/threeDimen/skyBox/DawnDusk/SkyBox.lmat", Laya.Handler.create(null, function(mat:Laya.SkyBoxMaterial):void {
			var skyRenderer:Laya.SkyRenderer = this.scene.skyRenderer;;
		    skyRenderer.mesh = Laya.SkyBox.instance;
		    skyRenderer.material = mat;
		    Laya.timer.frameLoop(1, this, this.onFrameLoop);
            Laya.timer.frameLoop(1, this, function():void {
				this.scene.skyRenderer.material.exposure = Math.sin(this.exposureNumber += 0.01) + 1;
				this.scene.skyRenderer.material.rotation += 0.01;
            });
        }))
    }
}
new Sky_SkyBox;