package LayaAir3D_Texture {
	import common.CameraMoveScript;
	import laya.d3.core.BaseCamera;
	import laya.d3.core.Camera;
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.material.BlinnPhongMaterial;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Vector3;
	import laya.d3.resource.RenderTexture;
	import laya.d3.resource.models.PrimitiveMesh;
	import laya.display.Stage;
	import laya.events.Event;
	import laya.net.Loader;
	import laya.ui.Button;
	import laya.utils.Browser;
	import laya.utils.Handler;
	import laya.utils.Stat;
	import laya.webgl.resource.BaseTexture;
	import laya.webgl.resource.Texture2D;
	
	public class RenderTextureDemo {
		private var box:MeshSprite3D;
		
		public function RenderTextureDemo() {
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			Stat.show();
			
			Laya.loader.create(["res/threeDimen/scene/CourtyardScene/Courtyard.ls"], Handler.create(this, onComplete));
		}
		
		private function onComplete():void {
			
			//加载场景
			var scene:Scene3D = Laya.stage.addChild(Loader.getRes("/res/threeDimen/scene/CourtyardScene/Courtyard.ls")) as Scene3D;
			//添加相机
			var camera:Camera = scene.addChild(new Camera(0, 0.1, 1000)) as Camera;
			camera.transform.translate(new Vector3(57, 2.5, 58));
			camera.transform.rotate(new Vector3(-10, 150, 0), true, false);
			//设置相机清除标识
			camera.clearFlag = BaseCamera.CLEARFLAG_SKY;
			//相机添加视角控制组件(脚本)
			camera.addComponent(CameraMoveScript);
			
			//渲染到纹理的相机
			var renderTargetCamera:Camera = scene.addChild(new Camera(0, 0.1, 1000)) as Camera;
			renderTargetCamera.transform.translate(new Vector3(57, 2.5, 58));
			renderTargetCamera.transform.rotate(new Vector3(-10, 150, 0), true, false);
			//选择渲染目标为纹理
			renderTargetCamera.renderTarget = new RenderTexture(2048, 2048);
			//设置深度格式
			renderTargetCamera.renderTarget.depthStencilFormat = BaseTexture.FORMAT_DEPTH_16;
			//渲染顺序
			renderTargetCamera.renderingOrder = -1;
			//相机添加视角控制组件(脚本)
			renderTargetCamera.addComponent(CameraMoveScript);
			
			//创建精灵
			var sprite3D:Sprite3D = scene.addChild(new Sprite3D()) as Sprite3D;
			//创建MeshSprite3D
			box = sprite3D.addChild(new MeshSprite3D(PrimitiveMesh.createBox(4, 4, 4))) as MeshSprite3D;
			//精灵进行平移
			sprite3D.transform.translate(new Vector3(55, 2, 65));
			//创建BlinnPhong材质
			var boxMaterial:BlinnPhongMaterial = new BlinnPhongMaterial();
			//创建纹理
			var boxTexture:Texture2D = new Texture2D(2048, 2048);
			//设置材质的纹理
			boxMaterial.albedoTexture = boxTexture;
			box.meshRenderer.material = boxMaterial;
			
			var renderTargetObj:MeshSprite3D = scene.getChildAt(0).getChildByName("RenderTarget") as MeshSprite3D;
			
			Laya.loader.load(["res/threeDimen/ui/button.png"], Handler.create(null, function():void {
				var changeActionButton:Button = Laya.stage.addChild(new Button("res/threeDimen/ui/button.png", "渲染目标")) as Button;
				changeActionButton.size(160, 40);
				changeActionButton.labelBold = true;
				changeActionButton.labelSize = 30;
				changeActionButton.sizeGrid = "4,4,4,4";
				changeActionButton.scale(Browser.pixelRatio, Browser.pixelRatio);
				changeActionButton.pos(Laya.stage.width / 2 - changeActionButton.width * Browser.pixelRatio / 2, Laya.stage.height - 100 * Browser.pixelRatio);
				changeActionButton.on(Event.CLICK, this, function():void {
					//将相机的渲染目标作为纹理传递给BlinnPhong材质的纹理
					(renderTargetObj.meshRenderer.material as BlinnPhongMaterial).albedoTexture = renderTargetCamera.renderTarget;
					var boxMaterial:BlinnPhongMaterial = box.meshRenderer.material as BlinnPhongMaterial;
					//获取BlinnPhong材质的纹理
					var tex:Texture2D = boxMaterial.albedoTexture as Texture2D;
					//获取相机渲染目标的像素数据,默认renderTarget的颜色为RGBA
					var out:Uint8Array = new Uint8Array(2048 * 2048 * 4);
					renderTargetCamera.renderTarget.getData(0, 0, 2048, 2048, out);
					//设置纹理的填充像素像素
					tex.setPixels(out);
					tex.generateMipmap();
				});
			}));
		}
	}

}