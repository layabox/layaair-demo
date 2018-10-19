class TrailRender{
	constructor(){
		Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        this.scene = Laya.stage.addChild(new Laya.Scene3D());
        var camera = (this.scene.addChild(new Laya.Camera(0, 0.1, 1000)));
        camera.transform.translate(new Laya.Vector3(0, 8, 10));
        camera.transform.rotate(new Laya.Vector3(-45, 0, 0), true, false);
        camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SOLIDCOLOR;
        var directionLight = this.scene.addChild(new Laya.DirectionLight());
        directionLight.color = new Laya.Vector3(1, 1, 1);
        directionLight.transform.rotate(new Laya.Vector3(-Math.PI / 3, 0, 0));
        Laya.Sprite3D.load("res/threeDimen/staticModel/grid/plane.lh", Laya.Handler.create(this, this.onLoadFinish));
        Laya.Sprite3D.load("res/threeDimen/trail/Cube.lh", Laya.Handler.create(this, this.onLoadFinish));
	}
	onLoadFinish(sprite){
       this.scene.addChild(sprite);
    }
}

//激活启动类
new TrailRender();