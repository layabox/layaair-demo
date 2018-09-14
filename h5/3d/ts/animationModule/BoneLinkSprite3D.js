var BoneLinkSprite3D = /** @class */ (function () {
    function BoneLinkSprite3D() {
        this._dragonScale = new Laya.Vector3(1.5, 1.5, 1.5);
        this._rotation = new Laya.Quaternion(-0.5, -0.5, 0.5, -0.5);
        this._position = new Laya.Vector3(-0.2, 0.0, 0.0);
        this._scale = new Laya.Vector3(0.75, 0.75, 0.75);
        this.curStateIndex = 0;
        //初始化引擎
        Laya3D.init(0, 0);
        //适配模式
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        //开启统计信息
        Laya.Stat.show();
        //预加载所有资源
        var resource = [
            { url: "../../res/threeDimen/skinModel/BoneLinkScene/R_kl_H_001.lh", clas: Laya3D.HIERARCHY, priority: 1 },
            { url: "../../res/threeDimen/skinModel/BoneLinkScene/R_kl_S_009.lh", clas: Laya3D.HIERARCHY, priority: 1 },
            { url: "../../res/threeDimen/skinModel/BoneLinkScene/PangZi.lh", clas: Laya3D.HIERARCHY, priority: 1 }
        ];
        Laya.loader.create(resource, Laya.Handler.create(this, this.onLoadFinish));
    }
    BoneLinkSprite3D.prototype.onLoadFinish = function () {
        //初始化场景
        this.scene = Laya.stage.addChild(new Laya.Scene3D());
        this.scene.ambientColor = new Laya.Vector3(0.5, 0.5, 0.5);
        //初始化相机
        var camera = this.scene.addChild(new Laya.Camera(0, 0.1, 100));
        camera.transform.translate(new Laya.Vector3(0, 3, 5));
        camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
        camera.addComponent(CameraMoveScript);
        var directionLight = this.scene.addChild(new Laya.DirectionLight());
        directionLight.transform.worldMatrix.setForward(new Laya.Vector3(-1.0, -1.0, -1.0));
        //初始化角色精灵
        this.role = this.scene.addChild(new Laya.Sprite3D());
        //初始化胖子
        this.pangzi = this.role.addChild(Laya.Loader.getRes("../../res/threeDimen/skinModel/BoneLinkScene/PangZi.lh"));
        //获取动画组件
        this.animator = this.pangzi.getChildAt(0).getComponent(Laya.Animator);
        var state1 = new Laya.AnimatorState();
        state1.name = "hello";
        state1.clipStart = 296 / 581;
        state1.clipEnd = 346 / 581;
        state1.clip = this.animator.getDefaultState().clip;
        state1.clip.islooping = true;
        this.animator.addState(state1);
        this.animator.play("hello");
        var state2 = new Laya.AnimatorState();
        state2.name = "ride";
        state2.clipStart = 3 / 581;
        state2.clipEnd = 33 / 581;
        state2.clip = this.animator.getDefaultState().clip;
        state2.clip.islooping = true;
        this.animator.addState(state2);
        this.dragon1 = Laya.Loader.getRes("../../res/threeDimen/skinModel/BoneLinkScene/R_kl_H_001.lh");
        this.dragon1.transform.localScale = this._dragonScale;
        this.aniSprte3D1 = this.dragon1.getChildAt(0);
        this.dragonAnimator1 = this.aniSprte3D1.getComponent(Laya.Animator);
        var state3 = new Laya.AnimatorState();
        state3.name = "run";
        state3.clipStart = 50 / 644;
        state3.clipEnd = 65 / 644;
        state3.clip = this.dragonAnimator1.getDefaultState().clip;
        state3.clip.islooping = true;
        this.dragonAnimator1.addState(state3);
        this.dragon2 = Laya.Loader.getRes("../../res/threeDimen/skinModel/BoneLinkScene/R_kl_S_009.lh");
        this.dragon2.transform.localScale = this._dragonScale;
        this.aniSprte3D2 = this.dragon2.getChildAt(0);
        this.dragonAnimator2 = this.aniSprte3D2.getComponent(Laya.Animator);
        var state4 = new Laya.AnimatorState();
        state4.name = "run";
        state4.clipStart = 50 / 550;
        state4.clipEnd = 65 / 550;
        state4.clip = this.dragonAnimator2.getDefaultState().clip;
        state4.clip.islooping = true;
        this.dragonAnimator2.addState(state4);
        this.loadUI();
    };
    BoneLinkSprite3D.prototype.loadUI = function () {
        Laya.loader.load(["../../res/threeDimen/ui/button.png"], Laya.Handler.create(this, function () {
            this.changeActionButton = Laya.stage.addChild(new Laya.Button("../../res/threeDimen/ui/button.png", "乘骑坐骑"));
            this.changeActionButton.size(160, 40);
            this.changeActionButton.labelBold = true;
            this.changeActionButton.labelSize = 30;
            this.changeActionButton.sizeGrid = "4,4,4,4";
            this.changeActionButton.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
            this.changeActionButton.pos(Laya.stage.width / 2 - this.changeActionButton.width * Laya.Browser.pixelRatio / 2, Laya.stage.height - 100 * Laya.Browser.pixelRatio);
            this.changeActionButton.on(Laya.Event.CLICK, this, function () {
                this.curStateIndex++;
                if (this.curStateIndex % 3 == 1) {
                    this.changeActionButton.label = "切换坐骑";
                    this.scene.addChild(this.dragon1);
                    this.aniSprte3D1.addChild(this.role);
                    //骨骼关联节点
                    this.dragonAnimator1.linkSprite3DToAvatarNode("point", this.role);
                    this.animator.play("ride");
                    this.dragonAnimator1.play("run");
                    this.pangzi.transform.localRotation = this._rotation;
                    this.pangzi.transform.localPosition = this._position;
                    this.pangzi.transform.localScale = this._scale;
                }
                else if (this.curStateIndex % 3 == 2) {
                    this.changeActionButton.label = "卸下坐骑";
                    //骨骼取消关联节点
                    this.dragonAnimator1.unLinkSprite3DToAvatarNode(this.role);
                    this.aniSprte3D1.removeChild(this.role);
                    this.dragon1.removeSelf();
                    this.scene.addChild(this.dragon2);
                    this.aniSprte3D2.addChild(this.role);
                    //骨骼关联节点
                    this.dragonAnimator2.linkSprite3DToAvatarNode("point", this.role);
                    this.animator.play("ride");
                    this.dragonAnimator2.play("run");
                    this.pangzi.transform.localRotation = this._rotation;
                    this.pangzi.transform.localPosition = this._position;
                    this.pangzi.transform.localScale = this._scale;
                }
                else {
                    this.changeActionButton.label = "乘骑坐骑";
                    //骨骼取消关联节点
                    this.dragonAnimator2.unLinkSprite3DToAvatarNode(this.role);
                    this.aniSprte3D2.removeChild(this.role);
                    this.dragon2.removeSelf();
                    this.scene.addChild(this.role);
                    this.animator.play("hello");
                }
            });
        }));
    };
    return BoneLinkSprite3D;
}());
new BoneLinkSprite3D;
