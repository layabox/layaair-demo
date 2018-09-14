
  
        var _quaternion = new Laya.Quaternion();
        var _direction = new Laya.Vector3();
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        var scene = Laya.stage.addChild(new Laya.Scene3D());
        var camera = (scene.addChild(new Laya.Camera(0, 0.1, 1000)));
        camera.transform.translate(new Laya.Vector3(0, 0.7, 1.3));
        camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
        camera.addComponent(CameraMoveScript);
        //方向光
        var directionLight = scene.addChild(new Laya.DirectionLight());
        directionLight.color = new Laya.Vector3(1, 1, 1);
        directionLight.transform.worldMatrix.setForward(new Laya.Vector3(-1.0, -1.0, -1.0));
        Laya.Sprite3D.load("res/threeDimen/staticModel/grid/plane.lh", Laya.Handler.create(this, function (sprite) {
            var grid = scene.addChild(sprite);
            Laya.Sprite3D.load("res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", Laya.Handler.create(this, function (layaMonkey) {
                var layaMonkey = scene.addChild(layaMonkey);
                var aniSprite3d = layaMonkey.getChildAt(0);
                var animator = aniSprite3d.getComponent(Laya.Animator);
                var state = new Laya.AnimatorState();
                state.name = "run";
                state.clipStart = 40 / 150;
                state.clipEnd = 70 / 150;
                state.clip = animator.getDefaultState().clip;
                animator.addState(state);
                animator.play("run");
                Laya.timer.frameLoop(1, this, function () {
                    Laya.Quaternion.createFromYawPitchRoll(0.025, 0, 0, this._quaternion);
                    directionLight.transform.worldMatrix.getForward(this._direction);
                    Laya.Vector3.transformQuat(this._direction, this._quaternion, this._direction);
                    directionLight.transform.worldMatrix.setForward(this._direction);
                });
            }));
        }));

