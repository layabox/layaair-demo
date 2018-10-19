class RenderTextureDemo{
    constructor(){
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
         //添加场景
        Laya.loader.create([
            "res/threeDimen/scene/CourtyardScene/Courtyard.ls"
        ], Laya.Handler.create(this, this.onComplete));
    }
    onComplete(){
        this.scene = Laya.stage.addChild(Laya.Loader.getRes("res/threeDimen/scene/CourtyardScene/Courtyard.ls"));
        //添加摄像机，并渲染天空盒
        this.camera = this.scene.addChild(new Laya.Camera(0, 0.1, 1000));
        this.camera.transform.translate(new Laya.Vector3(57, 2.5, 58));
        this.camera.transform.rotate(new Laya.Vector3(-10, 150, 0), true, false);
        this.camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;
        this.camera.addComponent(CameraMoveScript);
        this.renderTargetCamera = this.scene.addChild(new Laya.Camera(0, 0.1, 1000));
        this.renderTargetCamera.transform.translate(new Laya.Vector3(57, 2.5, 58));
        this.renderTargetCamera.transform.rotate(new Laya.Vector3(-10, 150, 0), true, false);
        //设置质量
        this.renderTargetCamera.renderTarget = new Laya.RenderTexture(2048, 2048);
        //渲染顺序
        this.renderTargetCamera.renderingOrder = -1;
        //添加移动脚本
        this.renderTargetCamera.addComponent(CameraMoveScript);
        //得到场景中的要渲染的板 
        this.renderTargetObj = this.scene.getChildAt(0).getChildByName("RenderTarget");
        //添加按钮
        Laya.loader.load(["res/threeDimen/ui/button.png"], Laya.Handler.create(this, this.onLoadFinish));
    }
    onLoadFinish(){
        var changeActionButton = Laya.stage.addChild(new Laya.Button("res/threeDimen/ui/button.png", "渲染目标"));
            changeActionButton.size(160, 40);
            changeActionButton.labelBold = true;
            changeActionButton.labelSize = 30;
            changeActionButton.sizeGrid = "4,4,4,4";
            changeActionButton.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
            changeActionButton.pos(Laya.stage.width / 2 - changeActionButton.width * Laya.Browser.pixelRatio / 2, Laya.stage.height - 100 * Laya.Browser.pixelRatio);
            changeActionButton.on(Laya.Event.CLICK, this, onClicked);

        }

   
}
function onClicked(){
        //按下后渲染到板上
        this.renderTargetObj.meshRenderer.material.albedoTexture = this.renderTargetCamera.renderTarget;
    }

//激活启动类
new RenderTextureDemo();
        
