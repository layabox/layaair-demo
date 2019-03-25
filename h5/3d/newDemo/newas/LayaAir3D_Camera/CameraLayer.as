package LayaAir3D_Camera 
{
	import common.CameraMoveScript;
	import laya.d3.core.Camera;
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.light.DirectionLight;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Quaternion;
	import laya.d3.math.Vector3;
	import laya.display.Stage;
	import laya.events.Event;
	import laya.net.Loader;
	import laya.ui.Button;
	import laya.utils.Browser;
	import laya.utils.Handler;
	import laya.utils.Stat;
	/**
	 * 精灵图层示例
	 * @author ...
	 */
	public class CameraLayer 
	{
		private var _scene:Scene3D;
		private var changeActionButton:Button;
		private var layerIndex:int;
		private var camera:Camera;
		private var _translate:Vector3 = new Vector3(0, 0.7, 3);
		private var _rotation:Vector3 = new Vector3( -15, 0, 0);
		private var _rotation2:Vector3 = new Vector3( -3.14 / 3, 0, 0);
		private var _rotation3:Quaternion = new Quaternion(0.7071068, 0, 0, -0.7071067);
		private var _rotation4:Vector3 = new Vector3( 0, 60, 0);
		private var _position:Vector3 = new Vector3(0.0, 0, 0.5);
		public function CameraLayer() 
		{
			//初始化引擎
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			//显示性能面板
            Stat.show();
			
			//创建场景
			_scene = Laya.stage.addChild(new Scene3D()) as Scene3D;
            
			//添加相机
            camera = (_scene.addChild(new Camera(0, 0.1, 100))) as Camera;
            camera.transform.translate(_translate);
            camera.transform.rotate(_rotation, true, false);
			//相机添加视角控制组件(脚本)
			camera.addComponent(CameraMoveScript);
			
			//移除所有图层
			camera.removeAllLayers();
			//添加显示图层(为相机添加一个蒙版)
			camera.addLayer(5);
			
			//添加平行光
			var directionLight:DirectionLight = _scene.addChild(new DirectionLight()) as DirectionLight;
            directionLight.color.setValue(1, 1, 1);
            directionLight.transform.rotate(_rotation2);
			
			Laya.loader.create([
				"res/threeDimen/staticModel/grid/plane.lh", 
				"res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh"
			], Handler.create(this, onComplete));
		}
		private function onComplete():void {
            
			//添加地面
            var grid:Sprite3D = _scene.addChild(Loader.getRes("res/threeDimen/staticModel/grid/plane.lh")) as Sprite3D;
			//地面接收阴影
			(grid.getChildAt(0) as MeshSprite3D).meshRenderer.receiveShadow = true;
			//设置该精灵的蒙版为5(所属图层)
			(grid.getChildAt(0) as MeshSprite3D).layer = 5;
			
			//添加静态猴子
			var staticLayaMonkey:MeshSprite3D = _scene.addChild(new MeshSprite3D(Loader.getRes("res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/LayaMonkey-LayaMonkey.lm"))) as MeshSprite3D;
			//设置静态猴子的材质
			staticLayaMonkey.meshRenderer.material = Loader.getRes("res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/Materials/T_Diffuse.lmat");
			//设置静态猴子的蒙版为1(所属图层)
			staticLayaMonkey.layer = 1;
			staticLayaMonkey.transform.position.setValue(0, 0, 0.5);
            staticLayaMonkey.transform.localScale.setValue(0.3, 0.3, 0.3);
            staticLayaMonkey.transform.rotation = _rotation3;
			//产生阴影
			staticLayaMonkey.meshRenderer.castShadow = true;
			
			//克隆sprite3d
			var layaMonkey_clone1:Sprite3D = Sprite3D.instantiate(staticLayaMonkey, _scene, false, _position);
			var layaMonkey_clone2:Sprite3D = Sprite3D.instantiate(staticLayaMonkey, _scene, false, _position);
			var layaMonkey_clone3:Sprite3D = Sprite3D.instantiate(staticLayaMonkey, _scene, false, _position);
			
			//设置蒙版(所属图层)
			layaMonkey_clone1.layer = 2;
			layaMonkey_clone2.layer = 3;
			layaMonkey_clone3.layer = 0;
			//平移
			_translate.setValue(1.5, 0, 0.0);
			layaMonkey_clone1.transform.translate(_translate);
			_translate.setValue(-1.5, 0, 0.0);
			layaMonkey_clone2.transform.translate(_translate);
			_translate.setValue(2.5, 0, 0.0);
			layaMonkey_clone3.transform.translate(_translate);
			//旋转
			layaMonkey_clone2.transform.rotate(_rotation4, false, false);
			//缩放
			layaMonkey_clone3.transform.localScale.setValue(0.1, 0.1, 0.1);
			
			//生成UI
			loadUI();
        }
		
		private function loadUI():void {
			layerIndex = 0;
			Laya.loader.load(["res/threeDimen/ui/button.png"], Handler.create(null, function():void {
				
				changeActionButton = Laya.stage.addChild(new Button("res/threeDimen/ui/button.png", "切换图层")) as Button;
				changeActionButton.size(160, 40);
				changeActionButton.labelBold = true;
				changeActionButton.labelSize = 30;
				changeActionButton.sizeGrid = "4,4,4,4";
				changeActionButton.scale(Browser.pixelRatio, Browser.pixelRatio);
				changeActionButton.pos(Laya.stage.width / 2 - changeActionButton.width * Browser.pixelRatio / 2, Laya.stage.height - 100 * Browser.pixelRatio);
				changeActionButton.on(Event.CLICK, this, function():void {
					camera.removeAllLayers();
					layerIndex ++;
					camera.addLayer(layerIndex%4);
					camera.addLayer(5);
					
				});
			
			}));
		}
		
	}

}