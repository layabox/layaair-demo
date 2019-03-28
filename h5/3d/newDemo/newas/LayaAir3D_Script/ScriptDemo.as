package LayaAir3D_Script {
	import laya.d3.core.Camera;
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.light.DirectionLight;
	import laya.d3.core.material.PBRSpecularMaterial;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Vector3;
	import laya.d3.resource.models.PrimitiveMesh;
	import laya.display.Stage;
	import laya.utils.Handler;
	import laya.utils.Stat;
	import laya.webgl.resource.Texture2D;
	
	public class ScriptDemo {
		private var _translate:Vector3 = new Vector3(0, 3, 3);
		private var _rotation:Vector3 = new Vector3(-30, 0, 0);
		private var _rotation2:Vector3 = new Vector3(0, 45, 0);
		private var _forward:Vector3 = new Vector3(1, -1, 0);
		
		public function ScriptDemo() {
			//初始化引擎
			Laya3D.init(0, 0);
			//适配模式
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			//开启统计信息
			Stat.show();
			//添加3D场景
			var scene:Scene3D = Laya.stage.addChild(new Scene3D()) as Scene3D;
			//添加照相机
			var camera:Camera = (scene.addChild(new Camera(0, 0.1, 100))) as Camera;
			//移动摄影机位置
			camera.transform.translate(_translate);
			//旋转摄影机方向
			camera.transform.rotate(_rotation, true, false);
			//设置背景颜色
			camera.clearColor = null;
			//添加方向光
			var directionLight:DirectionLight = scene.addChild(new DirectionLight()) as DirectionLight;
			//设置灯光漫反射颜色
			var lightColor:Vector3 = directionLight.color;
			lightColor.setValue(0.6, 0.6, 0.6);
			//设置平行光的方向
			var mat = directionLight.transform.worldMatrix;
			mat.setForward(_forward);
			directionLight.transform.worldMatrix=mat;
			//添加自定义模型
			var box:MeshSprite3D = scene.addChild(new MeshSprite3D(PrimitiveMesh.createBox(1, 1, 1), "MOs")) as MeshSprite3D;
			//设置模型的旋转
			box.transform.rotate(_rotation2, false, false);
			//创建材质
			var material:PBRSpecularMaterial = new PBRSpecularMaterial();
			//加载模型的材质贴图
			Texture2D.load("res/threeDimen/layabox.png", Handler.create(this, function(text:Texture2D):void {
				material.albedoTexture = text;
				//给模型添加材质
				box.meshRenderer.material = material;
				//给box添加自定义脚本组件
				box.addComponent(BoxControlScript);
			}));
			//4秒后删除自定义组件
			Laya.timer.once(4000, this, onLoop, [box]);
		}
		
		private function onLoop(box:MeshSprite3D):void {
			trace("移除组件");
			// 获取到组件
			var boxContro:BoxControlScript = box.getComponent(BoxControlScript);
			// 移除组件
			boxContro.destroy();
			//如不想移除组件，可设置为不启用能达到同样效果（组件_update方法将不会被更新）
			//boxContro.enabled = false;
		}
	}

}

import laya.d3.component.Script3D;
import laya.d3.core.MeshSprite3D;
import laya.d3.core.material.PBRSpecularMaterial;
import laya.d3.math.Vector3;
import laya.d3.math.Vector4;

class BoxControlScript extends Script3D {
	private var box:MeshSprite3D;
	private var _albedoColor:Vector4 = new Vector4(1, 0, 0, 1);
	private var _rotation:Vector3 = new Vector3(0, 0.5, 0);
	
	public function BoxControlScript() {
	}
	
	/**
	 * 覆写3D对象组件被激活后执行，此时所有节点和组件均已创建完毕，此方法只执行一次
	 */
	override public function onAwake():void {
		//得到3D对象
		box = this.owner as MeshSprite3D;
	}
	
	override public function onStart():void {
		//得到3D对象的材质
		var material:PBRSpecularMaterial = box.meshRenderer.material as PBRSpecularMaterial;
		//更改3D对象的材质反射率 （偏红）
		material.albedoColor = _albedoColor;
	}
	
	/**
	 * 覆写组件更新方法（相当于帧循环）
	 */
	override public function onUpdate():void {
		//所属脚本对象旋转更新
		box.transform.rotate(_rotation, false, false)
	}
	
	override public function onDisable() {
		trace("组件设置为不可用");
	}
}