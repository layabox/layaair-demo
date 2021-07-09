package PostProcess_AO{
	import laya.d3.component.PostProcess;
	import laya.d3.core.Camera;
	import laya.d3.core.light.DirectionLight;
	import laya.d3.core.material.BlinnPhongMaterial;
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.core.Sprite3D;
	import laya.d3.math.Matrix4x4;
	import laya.d3.math.Vector3;
	import laya.d3.resource.models.Mesh;
	import laya.d3.component.PostProcess;
	import laya.d3.core.Camera;
	import laya.d3.core.light.DirectionLight;
	import laya.d3.core.material.BlinnPhongMaterial;
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.core.Sprite3D;
	import laya.d3.math.Matrix4x4;
	import laya.d3.math.Vector3;
	import laya.d3.resource.models.Mesh;
	import laya.d3.resource.models.PrimitiveMesh;
	import laya.d3.shader.Shader3D;
	import laya.display.Stage;
	import laya.ui.Button;
	import laya.utils.Browser;
	import laya.utils.Handler;
	import laya.utils.Stat;
	//import common.CameraMoveScript;
	import PostProcess_AO.ScalableAO;
	import laya.events.Event;


public class Main{
    public var scene:Scene3D;
    public var camera:Camera;
    public var postProcess:PostProcess;

    public function Main(){
        Laya3D.init(0,0);
        Laya.stage.scaleMode = Stage.SCALE_FULL;
        Laya.stage.screenMode = Stage.SCREEN_NONE;
        Stat.show();
        Shader3D.debugMode = true;
        this.onResComplate();
    }

    public function onResComplate() {
        this.scene = (Laya.stage.addChild(new Scene3D()));
		//this.scene.ambientColor = new Vector3(1, 1, 1);
		var camera: Camera = (this.scene.addChild(new Camera(0, 0.1, 1000)));
		camera.transform.translate(new Vector3(0, 1, 5));
		camera.transform.rotate(new Vector3(-15, 0, 0), true, false);
        //camera.addComponent(CameraMoveScript);
        this.camera = camera;
        var directionLight: DirectionLight = (this.scene.addChild(new DirectionLight()));
		//方向光的颜色
		directionLight.color.setValue(0.5,0.5, 0.5);
		//设置平行光的方向
		var mat: Matrix4x4 = directionLight.transform.worldMatrix;
		mat.setForward(new Vector3(-1.0, -1.0, -1.0));
		directionLight.transform.worldMatrix = mat;
        this.addObjectInScene(this.scene);
        this.addPostProcess(camera);
        this.loadUI();
    }

     /**
     * 场景添加测试对象
     * @param scene 
     */
        public function addObjectInScene(scene: Scene3D) {

        var sprite: Sprite3D = new  Laya.Sprite3D();
        scene.addChild(sprite);

        var planeMesh: Mesh = Laya.PrimitiveMesh.createPlane(10, 10,1,1);
        var plane: MeshSprite3D = new Laya.MeshSprite3D(planeMesh);
        scene.addChild(plane);

        var cubeMesh: Mesh = PrimitiveMesh.createBox();
        var sphere:Mesh = PrimitiveMesh.createSphere(0.3);
        var cube0: MeshSprite3D = new MeshSprite3D(cubeMesh);
        var cube1: MeshSprite3D = new MeshSprite3D(cubeMesh);
        var cube2: MeshSprite3D = new MeshSprite3D(cubeMesh);
        var cube3: MeshSprite3D = new MeshSprite3D(cubeMesh);
        var sphere0:MeshSprite3D = new MeshSprite3D(sphere);
        var sphere1:MeshSprite3D = new MeshSprite3D(sphere);
        var sphere2:MeshSprite3D = new MeshSprite3D(sphere);
        var sphere3:MeshSprite3D = new MeshSprite3D(sphere);

        cube0.meshRenderer.sharedMaterial = new BlinnPhongMaterial;

        sprite.addChild(cube0);
        sprite.addChild(cube1);
        sprite.addChild(cube2);
        sprite.addChild(cube3);
        sprite.addChild(sphere0);
        sprite.addChild(sphere1);
        sprite.addChild(sphere2);
        sprite.addChild(sphere3);

        
        

        cube1.transform.position = new Vector3(-1, 0, 0);
        cube2.transform.position = new Vector3(-1, 0, 1);
        cube3.transform.position = new Vector3(-1, 1, 0);

        sphere0.transform.position = new Vector3(-3,0,0);
        sphere1.transform.position = new Vector3(2,0,0);
        sphere2.transform.position = new Vector3(2,0.5,0);
        sphere3.transform.position = new Vector3(-1,0,2);
        
        
    }

     public function addPostProcess(camera: Camera) {
        var postProcess: PostProcess = new PostProcess();
        camera.postProcess = postProcess;
        this.postProcess = postProcess;
        var ao = new ScalableAO();
        ao.radius = 0.15;
        ao.aoColor = new Vector3(0.0,0.0,0.0);
        ao.instance = 0.5;
        postProcess.addEffect(ao);
    }

    /**
	 *@private
	 */
	 public function loadUI(): void {
		Laya.loader.load(["res/threeDimen/ui/button.png"], Handler.create(this, function (): void {
			var button: Button = (Laya.stage.addChild(new Button("res/threeDimen/ui/button.png", "关闭AO")));
			button.size(200, 40);
			button.labelBold = true;
			button.labelSize = 30;
			button.sizeGrid = "4,4,4,4";
			button.scale(Browser.pixelRatio, Browser.pixelRatio);
			button.pos(Laya.stage.width / 2 - button.width * Browser.pixelRatio / 2, Laya.stage.height - 60 * Browser.pixelRatio);
			button.on(Event.CLICK, this, function (): void {
				var enableHDR: boolean = !!this.camera.postProcess;
				if (enableHDR)
				{
					button.label = "开启AO";
					this.camera.postProcess = null;

				}
				else{
					button.label = "关闭AO";
					this.camera.postProcess = this.postProcess;
				}
					
				
			});

		}));
	}

}


}
