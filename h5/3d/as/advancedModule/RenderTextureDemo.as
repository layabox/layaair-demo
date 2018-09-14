package advancedModule
{
	import common.CameraMoveScript;
	import laya.d3.core.BaseCamera;
	import laya.d3.core.Camera;
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.material.BlinnPhongMaterial;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Vector3;
	import laya.d3.resource.RenderTexture;
	import laya.display.Stage;
	import laya.events.Event;
	import laya.net.Loader;
	import laya.ui.Button;
	import laya.utils.Browser;
	import laya.utils.Handler;
	import laya.utils.Stat;
	
	public class RenderTextureDemo
	{
		public function RenderTextureDemo()
		{
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			Stat.show();
			
			 Laya.loader.create([
				"../../../../res/threeDimen/scene/CourtyardScene/Courtyard.ls"
			], Handler.create(this, onComplete));
		}
		
		private function onComplete():void {
			
			var scene:Scene3D = Laya.stage.addChild(Loader.getRes("../../../../res/threeDimen/scene/CourtyardScene/Courtyard.ls")) as Scene3D;
			
			var camera:Camera = scene.addChild(new Camera(0, 0.1, 1000)) as Camera;
			camera.transform.translate(new Vector3(57, 2.5, 58));
			camera.transform.rotate(new Vector3( -10, 150, 0), true, false);
			camera.clearFlag = BaseCamera.CLEARFLAG_SKY;
			camera.addComponent(CameraMoveScript);
			
			var renderTargetCamera:Camera = scene.addChild(new Camera(0, 0.1, 1000)) as Camera;
			renderTargetCamera.transform.translate(new Vector3(57, 2.5, 58));
			renderTargetCamera.transform.rotate(new Vector3( -10, 150, 0), true, false);
			renderTargetCamera.renderTarget = new RenderTexture(2048, 2048);
			renderTargetCamera.renderingOrder = -1;
			renderTargetCamera.addComponent(CameraMoveScript);
			
			var renderTargetObj:MeshSprite3D = scene.getChildAt(0).getChildByName("RenderTarget") as MeshSprite3D;
			
            Laya.loader.load(["../../../../res/threeDimen/ui/button.png"], Handler.create(null, function():void {
                var changeActionButton:Button = Laya.stage.addChild(new Button("../../../../res/threeDimen/ui/button.png", "渲染目标")) as Button;
                changeActionButton.size(160, 40);
                changeActionButton.labelBold = true;
                changeActionButton.labelSize = 30;
                changeActionButton.sizeGrid = "4,4,4,4";
                changeActionButton.scale(Browser.pixelRatio, Browser.pixelRatio);
                changeActionButton.pos(Laya.stage.width / 2 - changeActionButton.width * Browser.pixelRatio / 2, Laya.stage.height - 100 * Browser.pixelRatio);
                changeActionButton.on(Event.CLICK, this, function():void {
					(renderTargetObj.meshRenderer.material as BlinnPhongMaterial).albedoTexture = renderTargetCamera.renderTarget;
                });
            }));
        }
	}
}