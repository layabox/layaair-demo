package LayaAir3D_Advance{
    import laya.d3.core.CameraEventFlags;
	import laya.d3.core.Camera;
    import laya.d3.core.light.DirectionLight;
    import laya.d3.core.material.BlinnPhongMaterial;
    import laya.d3.core.MeshSprite3D;
    import laya.d3.core.scene.Scene3D;
    import laya.d3.math.Matrix4x4;
    import laya.d3.math.Vector3;
    import laya.d3.math.Vector4;
    import laya.d3.resource.models.PrimitiveMesh;
    import laya.d3.shader.Shader3D;
    import laya.display.Stage;
    import laya.net.Loader;
    import laya.utils.Handler;
    import laya.utils.Stat;
    import common.CameraMoveScript;
    import laya.Laya3D;

    public class GrassDemo{ 
        camera:Camera;
        grassManager:GrassRenderManager;

        public function GrassDemo() {
            Laya3D.init(0, 0);
            Laya.stage.scaleMode = Stage.SCALE_FULL;
            Laya.stage.screenMode = Stage.SCREEN_NONE;
            Stat.show();
            Shader3D.debugMode = true;
            this.PreloadingRes();
        }

        public function initScene(){

            //初始化3D场景
            var scene: Scene3D =Loader.getRes("res/LayaScene_GrassScene/Conventional/GrassScene.ls");
            Laya.stage.addChild(scene);
            // //初始化天空渲染器
            // var skyRenderer: SkyRenderer = scene.skyRenderer;
            // //创建天空盒mesh
            // skyRenderer.mesh = SkyDome.instance;
            // //使用程序化天空盒
            // skyRenderer.material = new SkyProceduralMaterial();
    
            //初始化相机并设置清除标记为天空
            this.camera = (<Camera>scene.addChild(new Camera(0, 0.1, 1000)));
            this.camera.addComponent(CameraMoveScript);
            //设置相机的清除标识为天空盒(这个参数必须设置为CLEARFLAG_SKY，否则无法使用天空盒)
            this.camera.clearFlag = CameraClearFlags.Sky;
            this.camera.transform.position = new Vector3( -45.56605299366802, 7.79715240971953,9.329663960933718);
    
            //初始化平行光
            var directionLight: DirectionLight = (<DirectionLight>scene.addChild(new DirectionLight()));
            //设置平行光的方向
            var mat: Matrix4x4 = directionLight.transform.worldMatrix;
            mat.setForward(new Vector3(-1.0, -1.0, -1.0));
            directionLight.transform.worldMatrix = mat;
            
            var plane = new MeshSprite3D(PrimitiveMesh.createPlane(1000,0,1000));
            var planeMat = plane.meshRenderer.sharedMaterial = new BlinnPhongMaterial();
            planeMat.albedoColor = new Vector4(0.06,0.31,0.14,1.0);
        }


        //批量预加载方式
        public function PreloadingRes() {
            //预加载所有资源
            var resource: any[] = ["res/InstancedIndirectGrassVertexColor.jpg",
                                    "res/LayaScene_GrassScene/Conventional/GrassScene.ls"];
            Laya.loader.create(resource, Handler.create(this, this.onPreLoadFinish));
        }

        public function onPreLoadFinish(){
            this.initScene();
            //渲染草
            this.grassManager=new GrassRenderManager(this.camera);
            var grasssize = this.grassManager.grassCellsize;
    
            for (let x = -100; x < 100; x+=grasssize) {
                for (let z = -100; z < 100; z+=grasssize) {
                    this.grassManager.addGrassCell(new Vector3(x,0,z));
                }
            }
    
            this.grassManager.enable = true;
    
            Laya.timer.loop(1,this,this.update,[this.camera]);
        }

        public function update(camera:Camera){
            this.grassManager.update(camera);
        }

    }

}