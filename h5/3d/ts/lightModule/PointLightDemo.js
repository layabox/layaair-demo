var PointLightDemo = /** @class */ (function () {
    function PointLightDemo() {
        this._temp_position = new Laya.Vector3();
        this._temp_quaternion = new Laya.Quaternion();
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        var scene = Laya.stage.addChild(new Laya.Scene3D());
        scene.ambientColor = new Laya.Vector3(0.1, 0.1, 0.1);
        var camera = (scene.addChild(new Laya.Camera(0, 0.1, 1000)));
        camera.transform.translate(new Laya.Vector3(0, 0.7, 1.3));
        camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
        camera.addComponent(CameraMoveScript);
        //点光
        var pointLight = scene.addChild(new Laya.PointLight());
        pointLight.color = new Laya.Vector3(1.0, 0.5, 0.0);
        pointLight.transform.position = new Laya.Vector3(0.4, 0.4, 0.0);
        pointLight.range = 3.0;
        Laya.Sprite3D.load("../../res/threeDimen/staticModel/grid/plane.lh", Laya.Handler.create(this, function (sprite) {
            var grid = scene.addChild(sprite);
            Laya.Sprite3D.load("../../res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", Laya.Handler.create(this, function (layaMonkey) {
                scene.addChild(layaMonkey);
                var aniSprite3d = layaMonkey.getChildAt(0);
                var animator = aniSprite3d.getComponent(Laya.Animator);
                var state = new Laya.AnimatorState();
                state.name = "attack";
                state.clipStart = 75 / 150;
                state.clipEnd = 110 / 150;
                state.clip = animator.getDefaultState().clip;
                animator.addState(state);
                animator.play("attack");
                Laya.timer.frameLoop(1, this, function () {
                    Laya.Quaternion.createFromYawPitchRoll(0.025, 0, 0, this._temp_quaternion);
                    Laya.Vector3.transformQuat(pointLight.transform.position, this._temp_quaternion, this._temp_position);
                    pointLight.transform.position = this._temp_position;
                });
            }));
        }));
    }
    return PointLightDemo;
}());
new PointLightDemo;
