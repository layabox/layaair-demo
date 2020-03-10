
class DrawTextTexture {
    constructor() {
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();

        var scene = Laya.stage.addChild(new Laya.Scene3D());
        var camera = scene.addChild(new Laya.Camera(0, 0.1, 100));
        camera.transform.translate(new Laya.Vector3(0, 0, 15));
        camera.transform.rotate(new Laya.Vector3(0, 0, 0), true, false);
        camera.clearColor = new Laya.Vector4(0.2, 0.2, 0.2, 1.0);
        camera.addComponent(CameraMoveScript);

        //设置一个面板用来渲染
        this.plane = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createPlane(10, 10));
        this.plane.transform.rotate(new Laya.Vector3(90, 0, 0), true, false);
        scene.addChild(this.plane);
        //材质
        this.mat = new Laya.UnlitMaterial();
        this.plane.meshRenderer.sharedMaterial = this.mat;

        //画布cavans
        this.cav = Laya.Browser.createElement("canvas");
        var cxt = this.cav.getContext("2d");
        this.cav.width = 256;
        this.cav.height = 256;
        cxt.fillStyle = 'rgb(' + '132' + ',' + '240' + ',109)';
        cxt.font = "bold 50px 宋体";
        cxt.textAlign = "center";//文本的对齐方式
        cxt.textBaseline = "center";//文本相对于起点的位置
        //设置文字,位置
        cxt.fillText("LayaAir", 100, 50, 200);//有填充cxt.font="bold 60px 宋体";

        cxt.strokeStyle = 'rgb(' + '200' + ',' + '125' + ',0)';
        cxt.font = "bold 40px 黑体";
        cxt.strokeText("runtime", 100, 100, 200);//只有边框

        //文字边框结合
        cxt.strokeStyle = 'rgb(' + '255' + ',' + '240' + ',109)';
        cxt.font = "bold 30px 黑体";
        cxt.fillText("LayaBox", 100, 150, 200);

        cxt.strokeStyle = "yellow";
        cxt.font = "bold 30px 黑体";
        cxt.strokeText("LayaBox", 100, 150, 200);//只有边框
        this.texture2D = new Laya.Texture2D(256, 256);
        this.texture2D.loadImageSource(this.cav);
        this.mat.renderMode = Laya.UnlitMaterial.RENDERMODE_TRANSPARENT;

        //给材质贴图
        this.mat.albedoTexture = this.texture2D;
        this.plane.meshRenderer.sharedMaterial.cull = Laya.RenderState.CULL_NONE;
        var rotate = new Laya.Vector3(0,0,1);
        Laya.timer.frameLoop(1, this, function() {
            this.plane.transform.rotate(rotate, true, false);
            
        });
    }

}
new DrawTextTexture();