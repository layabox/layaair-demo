class RenderTarget3DTo2DSprite {
    constructor() {
        this._pos = new Laya.Vector3(310, 500, 0);
        this._translate = new Laya.Vector3(0, 0, 0);
        this._translate2 = new Laya.Vector3(5, -10, 1);
        this._translate3 = new Laya.Vector3(0, 0, -0.2);
        this._translate4 = new Laya.Vector3(0, 0, 0.2);
        this._translate5 = new Laya.Vector3(-0.2, 0, 0);
        this._translate6 = new Laya.Vector3(0.2, 0, 0);
        this._rotation = new Laya.Vector3(-45, 0, 0);
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        var dialog = new Laya.Image("res/threeDimen/secne.jpg");
        Laya.stage.addChild(dialog);
        var scene = Laya.stage.addChild(new Laya.Scene3D());
        var camera = scene.addChild(new Laya.Camera(0, 0.1, 1000));
        camera.transform.rotate(this._rotation, false, false);
        camera.addComponent(CameraMoveScript);
        camera.transform.translate(this._translate2);
        camera.orthographic = true;
        camera.clearFlag = Laya.CameraClearFlags.SolidColor;
        camera.clearColor = new Laya.Vector4(0.5, 0.0, 0.0, 0.5);
        var renderTexture = new Laya.RenderTexture(512, 512, Laya.RenderTextureFormat.R8G8B8A8, Laya.RenderTextureDepthFormat.DEPTHSTENCIL_NONE);
        camera.renderTarget = renderTexture;
        camera.orthographicVerticalSize = 10;
        scene.addChild(new Laya.DirectionLight());
        Laya.Sprite3D.load("res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", Laya.Handler.create(this, function (layaMonkey) {
            scene.addChild(layaMonkey);
            this._layaMonkey = layaMonkey;
            var transform = layaMonkey.transform;
            var localScale = transform.localScale;
            var rotationEuler = transform.rotationEuler;
            camera.convertScreenCoordToOrthographicCoord(this._pos, this._translate);
            transform.position = this._translate;
            localScale.setValue(0.5, 0.5, 0.5);
            transform.localScale = localScale;
            rotationEuler.setValue(-30, 0, 0);
            transform.rotationEuler = rotationEuler;
            var scene3DImage = new Laya.Image();
            scene3DImage.source = new Laya.Texture(renderTexture);
            Laya.stage.addChild(scene3DImage);
            Laya.timer.frameLoop(1, this, this.onKeyDown);
        }));
    }
    onKeyDown() {
        var transform = this._layaMonkey.transform;
        Laya.KeyBoardManager.hasKeyDown(87) && transform.translate(this._translate3);
        Laya.KeyBoardManager.hasKeyDown(83) && transform.translate(this._translate4);
        Laya.KeyBoardManager.hasKeyDown(65) && transform.translate(this._translate5);
        Laya.KeyBoardManager.hasKeyDown(68) && transform.translate(this._translate6);
    }
}
new RenderTarget3DTo2DSprite;