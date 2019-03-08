class CameraDemo{
    constructor(){
        //初始化引擎
        Laya3D.init(1000, 500);            
        //适配模式
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        //开启统计信息
        Laya.Stat.show();            
        //预加载角色动画资源
        Laya.loader.create("res/threeDimen/scene/CameraDemo/CamerDemo.ls",Laya.Handler.create(this,this.onSceneOK));	
    }
    onSceneOK(){
        //添加3D场景
        var scene = Laya.loader.getRes("res/threeDimen/scene/CameraDemo/CamerDemo.ls");
        Laya.stage.addChild(scene);  
                    
        //从场景中获取摄像机
        var camera = scene.getChildByName("Main Camera");
        //从场景中获取精灵
        var box = scene.getChildByName("Cube");
                    
        //移动摄像机位置
        camera.transform.translate(new Laya.Vector3(0, 0, 0));
        //旋转摄像机角度
        camera.transform.rotate(new Laya.Vector3(0, 0, 0), true, false);
        //设置相机横纵比
        camera.aspectRatio = 0;
        //设置相机近距裁剪
        camera.nearPlane = 0.1;
        //设置相机远距裁剪
        camera.farPlane = 100;
        //相机设置清楚标记
        camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;
        //设置摄像机视野范围（角度）
        camera.fieldOfView = 60;
        //正交投影属性设置
        camera.orthographic = true;
        //正交垂直矩阵距离,控制3D物体远近与显示大小
        camera.orthographicVerticalSize = 7;
        //摄像机捕捉模型目标
        camera.transform.lookAt(box.transform.position, new Laya.Vector3(0, -1, 0));
        //添加视角控制脚本
        camera.addComponent(CameraMoveScript);
                    
        //设置背景颜色
        //camera.clearColor = new Laya.Vector4(0,0,0.6,1);  
                    
        //设置相机天空盒
        /*Laya.BaseMaterial.load("../../../../res/threeDimen/skyBox/DawnDusk/SkyBox.lmat", Laya.Handler.create(null, function(mat) {
        //获取相机的天空渲染器
        var skyRenderer = camera.skyRenderer;
        //创建天空盒的mesh
        skyRenderer.mesh = Laya.SkyBox.instance;
        //设置天空盒材质
        skyRenderer.material = mat;
        var exposureNumber = 0;
        Laya.timer.frameLoop(1, this, function() {
            //设置曝光强度
            mat.exposure = Math.sin(exposureNumber += 0.01) + 1;
            mat.rotation += 0.01;
            });
        }));*/
    }
}

//激活启动类
new CameraDemo();