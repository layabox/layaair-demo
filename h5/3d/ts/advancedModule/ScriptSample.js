var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var ScriptSample = /** @class */ (function () {
    function ScriptSample() {
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        //预加载所有资源
        var resource = [
            { url: "../../res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", type: Laya3D.HIERARCHY, priority: 1 }
        ];
        //加载函数
        Laya.loader.create(resource, Laya.Handler.create(this, this.onComplete));
    }
    ScriptSample.prototype.onComplete = function () {
        var scene = Laya.stage.addChild(new Laya.Scene3D());
        var camera = scene.addChild(new Laya.Camera(0, 0.1, 100));
        camera.transform.translate(new Laya.Vector3(0, 0.8, 1.5));
        camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
        var directionLight = scene.addChild(new Laya.DirectionLight());
        directionLight.color = new Laya.Vector3(0.6, 0.6, 0.6);
        var monkey = Laya.Loader.getRes("../../res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh");
        var scripts = monkey.addComponent(MonkeyScript);
        scene.addChild(monkey);
    };
    return ScriptSample;
}());
new ScriptSample;
var MonkeyScript = /** @class */ (function (_super) {
    __extends(MonkeyScript, _super);
    function MonkeyScript() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.rotation = new Laya.Vector3(0, 0.01, 0);
        return _this;
    }
    MonkeyScript.prototype.onAwake = function () {
        console.log("onAwake");
    };
    MonkeyScript.prototype.onStart = function () {
        console.log("onStart");
    };
    MonkeyScript.prototype.onUpdate = function () {
        this.owner.transform.rotate(this.rotation, false);
    };
    MonkeyScript.prototype.onLateUpdate = function () {
        console.log("onLateUpdate");
    };
    return MonkeyScript;
}(Laya.Script3D));
