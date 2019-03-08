package OfficialExample.LayaAir3D_Graphics 
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
	import laya.net.Loader;
	import laya.utils.Handler;
	import laya.utils.Stat;
	/**
	 * ...
	 * @author ...
	 */
	public class TransformDemo 
	{
		
		private var _scene:Scene3D;
		
		public function TransformDemo() 
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
            var camera:Camera = (_scene.addChild(new Camera(0, 0.1, 100))) as Camera;
            camera.transform.translate(new Vector3(0, 0.7, 1.2));
            camera.transform.rotate(new Vector3( -15, 0, 0), true, false);
			camera.addComponent(CameraMoveScript);
			
			//添加光照
			var directionLight:DirectionLight = _scene.addChild(new DirectionLight()) as DirectionLight;
            directionLight.color = new Vector3(1, 1, 1);
            directionLight.transform.rotate(new Vector3( -3.14 / 3, 0, 0));
			
			//灯光开启阴影
            directionLight.shadow = true;
			//可见阴影距离
			directionLight.shadowDistance = 3;
			//生成阴影贴图尺寸
			directionLight.shadowResolution = 2048;
			//生成阴影贴图数量
			directionLight.shadowPSSMCount = 1;
			//模糊等级,越大越高,更耗性能
			directionLight.shadowPCFType = 3;
			
			//批量预加载资源
			Laya.loader.create([
				"res/threeDimen/staticModel/grid/plane.lh", 
				"res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh"
			], Handler.create(this, onComplete));
			
		}
		private function onComplete():void {
            //加载地面
            var grid:Sprite3D = _scene.addChild(Loader.getRes("res/threeDimen/staticModel/grid/plane.lh")) as Sprite3D;
			//地面接收阴影
			(grid.getChildAt(0) as MeshSprite3D).meshRenderer.receiveShadow = true;
			//加载静态小猴子
			var staticLayaMonkey:MeshSprite3D = _scene.addChild(new MeshSprite3D(Loader.getRes("../../../../res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/LayaMonkey-LayaMonkey.lm"))) as MeshSprite3D;
			//设置材质
			staticLayaMonkey.meshRenderer.material = Loader.getRes("res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/Materials/T_Diffuse.lmat");
			//设置位置
			staticLayaMonkey.transform.position = new Vector3(0, 0, 0.5);
			//设置缩放
            staticLayaMonkey.transform.localScale = new Vector3(0.3, 0.3, 0.3);
			//设置旋转
            staticLayaMonkey.transform.rotation = new Quaternion(0.7071068, 0, 0, -0.7071067);
			//产生阴影
			staticLayaMonkey.meshRenderer.castShadow = true;
			
			//克隆sprite3d
			var layaMonkey_clone1:Sprite3D = Sprite3D.instantiate(staticLayaMonkey, _scene, false, new Vector3(0.0, 0, 0.5));
			var layaMonkey_clone2:Sprite3D = Sprite3D.instantiate(staticLayaMonkey, _scene, false, new Vector3(0.0, 0, 0.5));
			var layaMonkey_clone3:Sprite3D = Sprite3D.instantiate(staticLayaMonkey, _scene, false, new Vector3(0.0, 0, 0.5));
			//平移
			layaMonkey_clone1.transform.translate(new Vector3(1.5, 0, 0.0));
			layaMonkey_clone2.transform.translate(new Vector3( -1.5, 0, 0.0));
			layaMonkey_clone3.transform.translate(new Vector3( 2.5, 0, 0.0));
			//旋转
			layaMonkey_clone2.transform.rotate(new Vector3(0, 60, 0), false, false);
			//缩放
			var scale:Vector3 = new Vector3(0.1, 0.1, 0.1);
			layaMonkey_clone3.transform.localScale = scale;
			
			//!!!!!!
			//Quaternion.createFromYawPitchRoll(0.025, 0, 0, _temp_quaternion);
			//Vector3.transformQuat(pointLight.transform.position, _temp_quaternion, _temp_position);
			//pointLight.transform.position = _temp_position;
			
			
        }
		
	}

}