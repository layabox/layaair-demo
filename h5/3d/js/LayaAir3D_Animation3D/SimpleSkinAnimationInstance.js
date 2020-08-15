class SimpleSkinAnimationInstance {
    constructor() {
        this.animatorName = ["run", "chongci", "dead", "xuli", "stand"];
        this.widthNums = 30;
        this.step = 10;
        Laya.Laya3D.init(0, 0);
        Laya.Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        Laya.Shader3D.debugMode = true;
        this.scene = Laya.Laya.stage.addChild(new Laya.Scene3D());
        this.scene.ambientColor = new Laya.Vector3(0.5, 0.5, 0.5);
        Laya.Sprite3D.load("res/threeDimen/texAnimation/Conventional/LayaMonkey.lh", Laya.Handler.create(this, function (sprite) {
            this.scene.addChild(sprite);
            this.oriSprite3D = this.scene.getChildAt(0).getChildAt(2);
            this.sceneBuild();
            var animate = this.oriSprite3D.getComponent(Laya.Animator);
            animate.play("chongci");
        }));
    }
    cloneSprite(pos, quaterial) {
        var clonesprite = this.oriSprite3D.clone();
        this.scene.addChild(clonesprite);
        var animate = clonesprite.getComponent(Laya.Animator);
        var nums = Math.round(Math.random() * 4);
        animate.play(this.animatorName[nums], 0, Math.random());
        clonesprite.transform.position = pos;
        clonesprite.transform.rotationEuler = quaterial;
    }
    sceneBuild() {
        var left = -0.5 * this.step * (this.widthNums);
        var right = -1 * left;
        for (var i = left; i < right; i += this.step)
            for (var j = left; j < right; j += this.step) {
                var xchange = (Math.random() - 0.5) * 10;
                var zchange = (Math.random() - 0.5) * 10;
                var quaterial = new Laya.Vector3(0, Math.random() * 180, 0);
                this.cloneSprite(new Laya.Vector3(i + xchange, 0, j + zchange), quaterial);
            }
    }
}

new SimpleSkinAnimationInstance();