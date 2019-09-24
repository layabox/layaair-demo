package LayaAir3D_Advance 
{
	import laya.display.Stage;
	import laya.d3.math.Vector3;
	import laya.d3.math.Vector4;
	import laya.d3.resource.models.PrimitiveMesh;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.core.Camera;
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.material.UnlitMaterial;
	import laya.utils.Stat;
	import laya.utils.Browser;
	import laya.resource.Texture2D;
	import laya.d3.core.material.BlinnPhongMaterial;
	import laya.d3.core.material.RenderState;
	import laya.utils.Handler;
	public class DrawTextTexture 
	{
		
		private var plane:MeshSprite3D;
		private var mat:UnlitMaterial;
		private var cav:*;
		public function DrawTextTexture() 
		{
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			Stat.show();

			var scene: Scene3D =  Laya.stage.addChild(new Scene3D()) as Scene3D;
			var camera: Camera = scene.addChild(new Camera(0, 0.1, 100)) as Camera;
			camera.transform.translate(new Vector3(0, 0, 15));
			camera.transform.rotate(new Vector3(0, 0, 0), true, false);
			camera.clearColor = new Vector4(0.2, 0.2, 0.2, 1.0);
			//camera.addComponent(CameraMoveScript);

			//设置一个面板用来渲染
			plane = new MeshSprite3D(PrimitiveMesh.createPlane(10, 10));
			plane.transform.rotate(new Vector3(90, 0, 0), true, true);
			scene.addChild(plane);
			//材质
			mat = new UnlitMaterial();
			plane.meshRenderer.sharedMaterial = mat;

			//画布cavans
			cav = Browser.createElement("canvas");
			var cxt = cav.getContext("2d");
			cav.width = 256;
			cav.height = 256;
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
			texture2D = new Texture2D(256, 256);
			texture2D.loadImageSource(cav);
			mat.renderMode = UnlitMaterial.RENDERMODE_TRANSPARENT;

			//给材质贴图
			mat.albedoTexture = texture2D;
			(plane.meshRenderer.sharedMaterial as BlinnPhongMaterial).cull = RenderState.CULL_NONE;
			var rotate:Vector3 = new Vector3(0,0,1);
			Laya.timer.frameLoop(1, this, function(): void {
				plane.transform.rotate(rotate, true, false);
				
			});


		}
		
	}

}