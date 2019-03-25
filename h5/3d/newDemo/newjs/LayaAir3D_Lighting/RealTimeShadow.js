class RealTimeShadow{
    constructor(){
        this._quaternion = new Laya.Quaternion();
        this._direction = new Laya.Vector3();
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        this.scene = Laya.stage.addChild(new Laya.Scene3D());
        this.camera = (this.scene.addChild(new Laya.Camera(0, 0.1, 100)));
        this.camera.transform.translate(new Laya.Vector3(0, 0.7, 1.2));
        this.camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
        this.directionLight = this.scene.addChild(new Laya.DirectionLight());
        this.directionLight.color = new Laya.Vector3(1, 1, 1);
        this.directionLight.transform.rotate(new Laya.Vector3(-3.14 / 3, 0, 0.0));
        //灯光开启阴影
        this.directionLight.shadow = true;
        //可见阴影距离
        this.directionLight.shadowDistance = 3;
        //生成阴影贴图尺寸
        this.directionLight.shadowResolution = 2048;
        //生成阴影贴图数量
        this.directionLight.shadowPSSMCount = 1;
        //模糊等级,越大越高,更耗性能
        this.directionLight.shadowPCFType = 3;
        Laya.loader.create([
            "res/threeDimen/staticModel/grid/plane.lh",
            "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh"
        ], Laya.Handler.create(this, this.onComplete));
        Laya.timer.frameLoop(1, this, this.onFrameLoop);
    }
    onComplete(){
        var grid = this.scene.addChild(Laya.Loader.getRes("res/threeDimen/staticModel/grid/plane.lh"));
        //地面接收阴影
        grid.getChildAt(0).meshRenderer.receiveShadow = true;
        var staticLayaMonkey = this.scene.addChild(new Laya.MeshSprite3D(Laya.Loader.getRes("res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/LayaMonkey-LayaMonkey.lm")));
        staticLayaMonkey.meshRenderer.material = Laya.Loader.getRes("res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/Materials/T_Diffuse.lmat");
        staticLayaMonkey.transform.position = new Laya.Vector3(0, 0, -0.5);
        staticLayaMonkey.transform.localScale = new Laya.Vector3(0.3, 0.3, 0.3);
        staticLayaMonkey.transform.rotation = new Laya.Quaternion(0.7071068, 0, 0, -0.7071067);
        //产生阴影
        staticLayaMonkey.meshRenderer.castShadow = true;
        var layaMonkey = this.scene.addChild(Laya.Loader.getRes("res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh"));
        //产生阴影
        layaMonkey.getChildAt(0).getChildAt(0).skinnedMeshRenderer.castShadow = true;
    }
    onFrameLoop(){
        Laya.Quaternion.createFromYawPitchRoll(0.025, 0, 0, this._quaternion);
        this.directionLight.transform.worldMatrix.getForward(this._direction);
            Laya.Vector3.transformQuat(this._direction, this._quaternion, this._direction);
        this.directionLight.transform.worldMatrix.setForward(this._direction);
    }
}

//激活启动类
new RealTimeShadow();
