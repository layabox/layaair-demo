class ScriptSample {
 
    constructor() {
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
      
       	//预加载所有资源
			var resource:Array<any> = [
                {url: "../../res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", type: Laya3D.HIERARCHY, priority: 1}];
			//加载函数
			Laya.loader.create(resource, Laya.Handler.create(this, this.onComplete));
    }
    private onComplete():void {
        var scene:Laya.Scene3D = Laya.stage.addChild(new Laya.Scene3D()) as Laya.Scene3D;
        
        var camera:Laya.Camera = scene.addChild(new Laya.Camera(0, 0.1, 100)) as Laya.Camera;
        camera.transform.translate(new Laya.Vector3(0, 0.8, 1.5));
        camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
        
        var directionLight:Laya.DirectionLight = scene.addChild(new Laya.DirectionLight()) as Laya.DirectionLight;
        directionLight.color = new Laya.Vector3(0.6, 0.6, 0.6);
        
        var monkey:Laya.Sprite3D = Laya.Loader.getRes("../../res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh");
        var scripts:MonkeyScript =monkey.addComponent(MonkeyScript) as MonkeyScript;
        scene.addChild(monkey);
    }
   
}
new ScriptSample;

class MonkeyScript extends Laya.Script3D{
    private rotation:Laya.Vector3 = new Laya.Vector3(0,0.01,0);
     public onAwake():void
     {
         console.log("onAwake");
     }
     public onStart():void
     {
        console.log("onStart")         ;
     }
     public onUpdate():void
     {
        (this.owner as Laya.Sprite3D).transform.rotate(this.rotation, false);
     }
     public onLateUpdate():void
     {
         console.log("onLateUpdate");
     }
}