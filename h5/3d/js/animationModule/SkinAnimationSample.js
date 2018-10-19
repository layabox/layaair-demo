class SkinAnimationSample{
    constructor(){
        this.curStateIndex = 0;
        this.clipName = ["idle", "fallingback", "idle", "walk", "Take 001"];
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        var scene = Laya.stage.addChild(new Laya.Scene3D());
        var camera = (scene.addChild(new Laya.Camera(0, 0.1, 1000)));
        camera.transform.translate(new Laya.Vector3(0, 1.5, 4));
        camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
        camera.addComponent(CameraMoveScript);
        var directionLight = scene.addChild(new Laya.DirectionLight());
        directionLight.transform.worldMatrix.setForward(new Laya.Vector3(-1.0, -1.0, -1.0));
        directionLight.color = new Laya.Vector3(1, 1, 1);
        Laya.Sprite3D.load("res/threeDimen/skinModel/Zombie/Plane.lh", Laya.Handler.create(null, function (plane) {
            scene.addChild(plane);
        }));
        Laya.Sprite3D.load("res/threeDimen/skinModel/Zombie/Zombie.lh", Laya.Handler.create(this, function (zombie) {
            scene.addChild(zombie);
            this.zombieAnimator = zombie.getChildAt(0).getComponent(Laya.Animator); //获取Animator动画组件
            this.loadUI();
        }));
    }

    loadUI(){
        Laya.loader.load(["res/threeDimen/ui/button.png"], Laya.Handler.create(this, this.motionSwitch));
    }

    motionSwitch(){
        this.changeActionButton = Laya.stage.addChild(new Laya.Button("res/threeDimen/ui/button.png", "切换动作"));
        this.changeActionButton.size(160, 40);
        this.changeActionButton.labelBold = true;
        this.changeActionButton.labelSize = 30;
        this.changeActionButton.sizeGrid = "4,4,4,4";
        this.changeActionButton.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
        this.changeActionButton.pos(Laya.stage.width / 2 - this.changeActionButton.width * Laya.Browser.pixelRatio / 2, Laya.stage.height - 100 * Laya.Browser.pixelRatio);
        this.changeActionButton.on(Laya.Event.CLICK, this, function () {
                //根据名称播放动画
                this.zombieAnimator.play(this.clipName[++this.curStateIndex % this.clipName.length]);
                });

     }
}

//激活启动类
new SkinAnimationSample();
