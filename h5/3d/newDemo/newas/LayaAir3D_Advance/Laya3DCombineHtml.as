package LayaAir3D_Advance
{
	import laya.d3.core.Camera;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.light.DirectionLight;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Vector3;
	import laya.display.Stage;
	import laya.utils.Handler;
	
	public class Laya3DCombineHtml
	{
		public function Laya3DCombineHtml()
		{
			__JS__("var div = document.createElement('div')");
			__JS__("div.innerHTML = '<h1 style=\'color: red;\'>此内容来源于HTML网页, 可直接在html代码中书写 - h1标签</h1>'");
			__JS__("document.body.appendChild(div)");
			
			//1.开启第四个参数
			var config3D:Config3D = new Config3D();
			config3D.isAlpha = true;
			Laya3D.init(0, 0, config3D);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			//2.设置舞台背景色为空
			Laya.stage.bgColor = null;
			
			var scene:Scene3D = Laya.stage.addChild(new Scene3D()) as Scene3D;
			
			var camera:Camera = scene.addChild(new Camera(0, 0.1, 100)) as Camera;
			camera.transform.translate(new Vector3(0, 0.5, 1));
			camera.transform.rotate(new Vector3( -15, 0, 0), true, false);
			//3.清除照相机颜色
			camera.clearColor = null;
			
			var directionLight:DirectionLight = scene.addChild(new DirectionLight()) as DirectionLight;
			directionLight.color = new Vector3(1, 1, 1);
			
			Sprite3D.load("res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh",Handler.create(null,function(layaMonkey:Sprite3D):void{
				scene.addChild(layaMonkey);
			}))
		}
	}
}