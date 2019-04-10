class SpotLightDemo{
    constructor(){
        this.quaternion = new Laya.Quaternion();
        this.direction = new Laya.Vector3();
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        this.scene = Laya.stage.addChild(new Laya.Scene3D());
        var camera = (this.scene.addChild(new Laya.Camera(0, 0.1, 1000)));
        camera.transform.translate(new Laya.Vector3(0, 0.7, 1.3));
        camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
        camera.addComponent(CameraMoveScript);
        //聚光灯
        this.spotLight = this.scene.addChild(new Laya.SpotLight());
        this.spotLight.color = new Laya.Vector3(1, 1, 0);
        this.spotLight.transform.position = new Laya.Vector3(0.0, 1.2, 0.0);
        var mat = this.spotLight.transform.worldMatrix;
        mat.setForward(new Laya.Vector3(0.15, -1.0, 0.0));
        this.spotLight.transform.worldMatrix = mat;
        this.spotLight.range = 6.0;
        this.spotLight.spotAngle = 32;
        Laya.Sprite3D.load("res/threeDimen/staticModel/grid/plane.lh", Laya.Handler.create(this, function (sprite) {
            this.scene.addChild(sprite);
            Laya.Sprite3D.load("res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", Laya.Handler.create(this, this.loadSprite3D));
        }));
    }

    loadSprite3D(sp){   
        this.scene.addChild(sp);
        var aniSprite3d = sp.getChildAt(0);
        var animator = aniSprite3d.getComponent(Laya.Animator);
        var state = new Laya.AnimatorState();
        state.name = "happy";
        state.clipStart = 115 / 150;
        state.clipEnd = 150 / 150;
        state.clip = animator.getDefaultState().clip;
        animator.addState(state);
        animator.play("happy");
        Laya.timer.frameLoop(1, this, this.onFrameLoop);
    }

    onFrameLoop(){    
        Laya.Quaternion.createFromYawPitchRoll(0.025, 0, 0, this.quaternion);
        this.spotLight.transform.worldMatrix.getForward(this.direction);
        Laya.Vector3.transformQuat(this.direction, this.quaternion, this.direction);
        var mat = this.spotLight.transform.worldMatrix;
        mat.setForward(this.direction);
        this.spotLight.transform.worldMatrix = mat;

    }
}

//激活启动类
new SpotLightDemo();
