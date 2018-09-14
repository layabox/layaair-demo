var AnimationLayerBlend = /** @class */ (function () {
    function AnimationLayerBlend() {
        this.motionCross = false;
        this.blendType = 0;
        this.motionIndex = 0;
        this.motions = ["run", "run_2", "attack", "attack_1", "attack_2", "dead", "idle_2", "idle_3", "idle_4", "idle4", "reload", "replace", "replace_2", "stop"];
        Laya.Shader3D.debugMode = true;
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        Laya.Scene3D.load("../../res/threeDimen/scene/LayaScene_Sniper/Sniper.ls", Laya.Handler.create(this, this.sceneLoaded));
    }
    AnimationLayerBlend.prototype.sceneLoaded = function (scene) {
        Laya.stage.addChild(scene);
        var animator = scene.getChildAt(2).getComponent(Laya.Animator);
        this.addButton(100, 100, 160, 30, "动画过渡:否", 20, function (e) {
            this.motionCross = !this.motionCross;
            if (this.motionCross)
                e.target.label = "动画过渡:是";
            else
                e.target.label = "动画过渡:否";
        });
        this.addButton(100, 160, 160, 30, "混合模式:全身", 20, function (e) {
            this.blendType++;
            (this.blendType === 3) && (this.blendType = 0);
            switch (this.blendType) {
                case 0:
                    e.target.label = "混合模式:全身";
                    break;
                case 1:
                    e.target.label = "混合模式:上身";
                    break;
                case 2:
                    e.target.label = "混合模式:下身";
                    break;
            }
        });
        this.addButton(100, 220, 260, 40, "切换动作:attack_2", 28, function (e) {
            switch (this.blendType) {
                case 0:
                    if (this.motionCross) {
                        animator.crossFade(this.motions[this.motionIndex], 0.2, 0);
                        animator.crossFade(this.motions[this.motionIndex], 0.2, 1);
                    }
                    else {
                        animator.play(this.motions[this.motionIndex], 0);
                        animator.play(this.motions[this.motionIndex], 1);
                    }
                    break;
                case 1:
                    if (this.motionCross)
                        animator.crossFade(this.motions[this.motionIndex], 0.2, 0);
                    else
                        animator.play(this.motions[this.motionIndex], 0);
                    break;
                case 2:
                    if (this.motionCross)
                        animator.crossFade(this.motions[this.motionIndex], 0.2, 1);
                    else
                        animator.play(this.motions[this.motionIndex], 1);
                    break;
            }
            e.target.label = "切换动作:" + this.motions[this.motionIndex];
            this.motionIndex++;
            (this.motionIndex === this.motions.length) && (this.motionIndex = 0);
        });
    };
    AnimationLayerBlend.prototype.addButton = function (x, y, width, height, text, size, clickFun) {
        var thiss = this;
        Laya.loader.load(["../../res/threeDimen/ui/button.png"], Laya.Handler.create(null, function () {
            var changeActionButton = Laya.stage.addChild(new Laya.Button("../../res/threeDimen/ui/button.png", text));
            changeActionButton.size(width, height);
            changeActionButton.labelBold = true;
            changeActionButton.labelSize = size;
            changeActionButton.sizeGrid = "4,4,4,4";
            changeActionButton.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
            changeActionButton.pos(x, y);
            changeActionButton.on(Laya.Event.CLICK, thiss, clickFun);
        }));
    };
    return AnimationLayerBlend;
}());
new AnimationLayerBlend;
