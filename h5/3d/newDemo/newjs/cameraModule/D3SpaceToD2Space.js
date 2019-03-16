class D3SpaceToD2Space{
    constructor(){
        this._position = new Laya.Vector3();
        this._outPos = new Laya.Vector3();
        this.scaleDelta = 0;
        this.scale = new Laya.Vector3(0.1, 0.1, 0.1);
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        this.scene = Laya.stage.addChild(new Laya.Scene3D());
        this.camera = this.scene.addChild(new Laya.Camera(0, 0.1, 100));
        this.camera.transform.translate(new Laya.Vector3(0, 0.35, 1));
        this.camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
        var directionLight = this.scene.addChild(new Laya.DirectionLight());
        var completeHandler = Laya.Handler.create(this, this.onComplete);
        Laya.loader.create("res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", completeHandler);
    }

    onComplete(){
        Laya.Sprite3D.load("res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", Laya.Handler.create(this, function (layaMonkey3D) {
            this.layaMonkey3D = layaMonkey3D;
            this.scene.addChild(layaMonkey3D);
            this.layaMonkey2D = Laya.stage.addChild(new Laya.Image("res/threeDimen/monkey.png"));
            Laya.timer.frameLoop(1, this, this.animate);
        }));
    }

    animate(){
        this._position.x = Math.sin(this.scaleDelta += 0.01);
        this.layaMonkey3D.transform.position = this._position;
        this.layaMonkey3D.transform.scale = this.scale;
        //转换坐标
        this.camera.viewport.project(this.layaMonkey3D.transform.position, this.camera.projectionViewMatrix, this._outPos);
        //赋值给2D
        this.layaMonkey2D.pos(this._outPos.x / Laya.stage.clientScaleX, this._outPos.y / Laya.stage.clientScaleY);
    }
}

//激活启动类
new D3SpaceToD2Space();

    
