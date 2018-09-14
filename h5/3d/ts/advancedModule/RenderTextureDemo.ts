class RenderTextureDemo {
 

    private layaPlane: Laya.Sprite3D;
    constructor() {
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        //添加场景
         Laya.loader.create([
            "../../res/threeDimen/scene/CourtyardScene/Courtyard.ls"
        ], Laya.Handler.create(this, this.onComplete));
    }
    private onComplete():void {
			
        var scene:Laya.Scene3D = Laya.stage.addChild(Laya.Loader.getRes("../../res/threeDimen/scene/CourtyardScene/Courtyard.ls")) as Laya.Scene3D;
        //添加摄像机，并渲染天空盒
        var camera:Laya.Camera = scene.addChild(new Laya.Camera(0, 0.1, 1000)) as Laya.Camera;
        camera.transform.translate(new Laya.Vector3(57, 2.5, 58));
        camera.transform.rotate(new Laya.Vector3( -10, 150, 0), true, false);
        camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;
        camera.addComponent(CameraMoveScript);
        
        var renderTargetCamera:Laya.Camera = scene.addChild(new Laya.Camera(0, 0.1, 1000)) as Laya.Camera;
        renderTargetCamera.transform.translate(new Laya.Vector3(57, 2.5, 58));
        renderTargetCamera.transform.rotate(new Laya.Vector3( -10, 150, 0), true, false);
        //设置质量
        renderTargetCamera.renderTarget = new Laya.RenderTexture(2048, 2048);
        //渲染顺序
        renderTargetCamera.renderingOrder = -1;
        //添加移动脚本
        renderTargetCamera.addComponent(CameraMoveScript);
       //得到场景中的要渲染的板 
        var renderTargetObj:Laya.MeshSprite3D = scene.getChildAt(0).getChildByName("RenderTarget") as Laya.MeshSprite3D;
        //添加按钮
        Laya.loader.load(["../../res/threeDimen/ui/button.png"], Laya.Handler.create(null, function():void {
            var changeActionButton:Laya.Button = Laya.stage.addChild(new Laya.Button("../../res/threeDimen/ui/button.png", "渲染目标")) as Laya.Button;
            changeActionButton.size(160, 40);
            changeActionButton.labelBold = true;
            changeActionButton.labelSize = 30;
            changeActionButton.sizeGrid = "4,4,4,4";
            changeActionButton.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
            changeActionButton.pos(Laya.stage.width / 2 - changeActionButton.width * Laya.Browser.pixelRatio / 2, Laya.stage.height - 100 * Laya.Browser.pixelRatio);
            changeActionButton.on(Laya.Event.CLICK, this, function():void {
                //按下后渲染到板上
                renderTargetObj.meshRenderer.material.albedoTexture = renderTargetCamera.renderTarget;
            });
        }));
    }
}
new RenderTextureDemo;