class EnvironmentalReflection {
    constructor() {
        
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();

        //创建场景
        this.scene = new Laya.Scene3D();
        Laya.stage.addChild(this.scene);
        //设置场景的反射模式(全局有效)
        this.scene.reflectionMode = Laya.Scene3D.REFLECTIONMODE_CUSTOM;
        
        //初始化照相机
        let camera = new Laya.Camera(0, 0.1, 100);
        this.scene.addChild(camera);
        camera.transform.translate(new Laya.Vector3(0, 2, 3));
        camera.transform.rotate(new Laya.Vector3( -15, 0, 0), true, false);
        //为相机添加视角控制组件(脚本)
        camera.addComponent(CameraMoveScript);
        //设置相机的清除标识为天空盒
        camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;
        
        //天空盒
        Laya.BaseMaterial.load("res/threeDimen/skyBox/DawnDusk/SkyBox.lmat", Laya.Handler.create(this, function(mat) {
            //获取相机的天空盒渲染体
            let skyRenderer = camera.skyRenderer;
            //设置天空盒mesh
            skyRenderer.mesh = Laya.SkyBox.instance;
            //设置天空盒材质
            skyRenderer.material = mat;
            //设置场景的反射贴图
            this.scene.customReflection = mat.textureCube;
            //设置曝光强度
            mat.exposure = 1.6;
        }));
        //创建平行光
        let directionLight = new Laya.DirectionLight();
        this.scene.addChild(directionLight);
        directionLight.color = new Laya.Vector3(1, 1, 1);
        
        //添加一个精灵
        this.sprite3D = new Laya.Sprite3D();
        this.scene.addChild(this.sprite3D );
        
        //加载Mesh
        Laya.Mesh.load("res/threeDimen/staticModel/teapot/teapot-Teapot001.lm", Laya.Handler.create(this, function(mesh) {
            this.teapot = this.sprite3D.addChild(new Laya.MeshSprite3D(mesh));
            this.teapot.transform.position = new Laya.Vector3(0, 1.75, 2);
            this.teapot.transform.rotate(new Laya.Vector3(-90, 0, 0), false, false);
            this.sprite3D.addChild(this.teapot);
            //实例PBR材质
            let pbrMat = new Laya.PBRStandardMaterial();
            //开启该材质的反射
            pbrMat.enableReflection = true;
            //设置材质的金属度，尽量高点，反射效果更明显
            pbrMat.metallic = 1;
            this.teapot.meshRenderer.material = pbrMat;
        }));
    }
}
new EnvironmentalReflection();
