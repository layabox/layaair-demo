package LayaAir3D_Material {
    import laya.d3.core.Camera;
    import laya.d3.core.material.BlinnPhongMaterial;
    import laya.d3.core.MeshSprite3D;
    import laya.d3.core.scene.Scene3D;
    import laya.d3.math.Vector4;
    import laya.d3.shader.Shader3D;
    import laya.display.Stage;
    import laya.net.Loader;
    import laya.utils.Handler;
    import laya.utils.Stat;
    import common.CameraMoveScript;
    import laya.Laya3D;

    public class Blinnphong_Transmission {

        private var rabbitModel: MeshSprite3D;
        private var monkeyModel: MeshSprite3D;
        private var rabbitMaterial: BlinnPhongMaterial;
        private var monkeyMaterial: BlinnPhongMaterial;
        private var resource = [
            "res/threeDimen/LayaScene_TransmissionScene/Conventional/Assets/monkeyThinkness.png",
            "res/threeDimen/LayaScene_TransmissionScene/Conventional/Assets/rabbitthickness.jpg"
        ]

        public function Blinnphong_Transmission() {
            Laya3D.init(0, 0);
            Laya.stage.scaleMode = Stage.SCALE_FULL;
            Laya.stage.screenMode = Stage.SCREEN_NONE;
            Stat.show();
            Shader3D.debugMode = true;

            //加载场景
            Scene3D.load("res/threeDimen/LayaScene_TransmissionScene/Conventional/TransmissionScene.ls", Handler.create(this, function (scene: Scene3D): void {
                (<Scene3D>Laya.stage.addChild(scene));
                //获取场景中的相机
                var camera: Camera = (<Camera>scene.getChildByName("Main Camera"));
                //加入摄像机移动控制脚本
                camera.addComponent(CameraMoveScript);
                this.rabbitModel = scene.getChildByName("rabbit");
                this.monkeyModel = scene.getChildByName("monkey");
                this.rabbitMaterial = (this.rabbitModel as MeshSprite3D).meshRenderer.sharedMaterial;
                this.monkeyMaterial = (this.monkeyModel as MeshSprite3D).meshRenderer.sharedMaterial;
                this.loadThinkNessTexture();
            }));
        }

        public function loadThinkNessTexture() {
            Laya.loader.create(this.resource, Handler.create(this, this.onPreLoadFinish));
        }

        public function onPreLoadFinish() {
            this.monkeyMaterial.thinknessTexture = Loader.getRes("res/threeDimen/LayaScene_TransmissionScene/Conventional/Assets/monkeyThinkness.png");
            this.rabbitMaterial.thinknessTexture = Loader.getRes("res/threeDimen/LayaScene_TransmissionScene/Conventional/Assets/rabbitthickness.jpg");
            this.rabbitMaterial.enableTransmission = true;
            this.rabbitMaterial.transmissionRata = 0.0;
            this.rabbitMaterial.backDiffuse = 4.88;
            this.rabbitMaterial.transmissionColor = new Vector4(1.0, 1.0, 1.0, 1.0);
            this.rabbitMaterial.backScale = 1.0;

            this.monkeyMaterial.enableTransmission = true;
            this.monkeyMaterial.transmissionRata = 0.0;
            this.monkeyMaterial.backDiffuse = 1.0;
            this.monkeyMaterial.transmissionColor = new Vector4(0.2, 1.0, 0.0, 1.0);
            this.monkeyMaterial.backScale = 1.0;


        }


    }
}