class TrailRender {
   constructor() {
    Laya3D.init(0, 0);
    Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
    Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
    Laya.Stat.show();
    
    var scene:Laya.Scene3D = Laya.stage.addChild(new Laya.Scene3D()) as Laya.Scene3D;
    
    var camera:Laya.Camera = (scene.addChild(new Laya.Camera(0, 0.1, 1000))) as Laya.Camera;
    camera.transform.translate(new Laya.Vector3(0, 8, 10));
    camera.transform.rotate(new Laya.Vector3(-45, 0, 0), true, false);
    camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SOLIDCOLOR;
    
    var directionLight:Laya.DirectionLight = scene.addChild(new Laya.DirectionLight()) as Laya.DirectionLight;
    directionLight.color = new Laya.Vector3(1, 1, 1);
    directionLight.transform.rotate(new Laya.Vector3(-Math.PI / 3, 0, 0));
    
    Laya.Sprite3D.load("../../res/threeDimen/staticModel/grid/plane.lh", Laya.Handler.create(this, function(plane:Laya.Sprite3D):void {
        scene.addChild(plane);
    }));
    
    Laya.Sprite3D.load("../../res/threeDimen/trail/Cube.lh", Laya.Handler.create(this, function(sprite:Laya.Sprite3D):void {
        scene.addChild(sprite);
    }));
    }
}
new TrailRender;

