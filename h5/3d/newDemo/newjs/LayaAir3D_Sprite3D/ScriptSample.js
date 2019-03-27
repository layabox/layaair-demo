class MonkeyScript extends Laya.Script3D{
    constructor(){
        super();
        this.rotation = new Laya.Vector3(0, 0.01, 0);
    }
    onAwake(){
        console.log("onAwake");
    }
    onStart(){
        console.log("onStart");
    }
    onUpdate(){
        this.owner.transform.rotate(this.rotation, false);
    }
    onLateUpdate(){
        console.log("onLateUpdate");
    }
}


class ScriptSample{
    constructor(){
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        //预加载所有资源
        var resource = ["res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh"];
        //加载函数
        Laya.loader.create(resource, Laya.Handler.create(this, this.onComplete));
    }

    onComplete(){
        var scene = Laya.stage.addChild(new Laya.Scene3D());
        var camera = scene.addChild(new Laya.Camera(0, 0.1, 100));
        camera.transform.translate(new Laya.Vector3(0, 0.8, 1.5));
        camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
        var directionLight = scene.addChild(new Laya.DirectionLight());
        directionLight.color = new Laya.Vector3(0.6, 0.6, 0.6);
        var monkey = Laya.Loader.getRes("res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh");
        var scripts = monkey.addComponent(MonkeyScript);
        scene.addChild(monkey);
    }
}

//激活启动类
new ScriptSample();
        

