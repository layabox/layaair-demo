package LayaAir3D_MouseInteraction {
	import laya.d3.core.Camera;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.light.DirectionLight;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Vector3;
	import laya.display.Stage;
	import laya.display.Text;
	import laya.net.Loader;
	import laya.utils.Handler;
	
	/**
	 * ...
	 * @author ...
	 */
	public class MultiTouch {
		
		private var text:Text = new Text();
		private var _upVector3:Vector3 = new Vector3(0, 1, 0);
		
		public function MultiTouch() {
			//初始化引擎
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			
			//预加载所有资源
			var resource:Array = ["res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh"];
			Laya.loader.create(resource, Handler.create(this, onComplete));
		}
		
		private function onComplete():void {
			//创建场景
			var scene:Scene3D = Laya.stage.addChild(new Scene3D()) as Scene3D;
			//创建相机
			var camera:Camera = scene.addChild(new Camera(0, 0.1, 100)) as Camera;
			//设置相机的名称
			camera.name = "camera";
			//相机平移位置
			camera.transform.translate(new Vector3(0, 0.8, 1.5));
			//旋转相机
			camera.transform.rotate(new Vector3(-15, 0, 0), true, false);
			
			//创建平行光
			var directionLight:DirectionLight = scene.addChild(new DirectionLight()) as DirectionLight;
			//设置平行光颜色
			directionLight.color = new Vector3(0.6, 0.6, 0.6);
			
			//加载小猴子精灵
			var monkey:Sprite3D = Loader.getRes("res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh");
			//猴子精灵添加组件（脚本）
			monkey.addComponent(MonkeyScript);
			scene.addChild(monkey);
			//设置相机的观察目标为小猴子
			camera.transform.lookAt(monkey.transform.position, new Vector3(0, 1, 0));
			
			//设置文本显示框位置
			text.x = Laya.stage.width / 2 - 50;
			text.text = "触控点归零";
			//显示文本显示框
			text.name = "ceshi";
			text.overflow = Text.HIDDEN;
			text.color = "#FFFFFF";
			text.font = "Impact";
			text.fontSize = 20;
			text.borderColor = "#FFFF00";
			text.x = Laya.stage.width / 2;
			Laya.stage.addChild(text);
		}
	}
}

import laya.d3.Touch;
import laya.d3.component.Script3D;
import laya.d3.core.Camera;
import laya.d3.core.Sprite3D;
import laya.d3.core.scene.Scene3D;
import laya.d3.math.Vector2;
import laya.d3.math.Vector3;
import laya.display.Text;

class MonkeyScript extends Script3D {
	
	private var _scene:Scene3D;
	private var _text:Text;
	private var _camera:Camera;
	private var rotation:Vector3 = new Vector3(0, 0.01, 0);
	private var lastPosition:Vector2 = new Vector2(0, 0);
	private var distance:Number = 0.0;
	private var disVector1:Vector2 = new Vector2(0, 0);
	private var disVector2:Vector2 = new Vector2(0, 0);
	private var isTwoTouch:Boolean = false;
	private var first:Boolean = true;
	private var twoFirst:Boolean = true;
	private var tmpVector:Vector3 = new Vector3(0, 0, 0);
	
	override public function onAwake():void {
	}
	
	override public function onStart():void {
		_scene = (owner as Sprite3D).parent as Scene3D;
		_text = (_scene.parent as Laya.stage).getChildByName("ceshi");
		_camera = _scene.getChildByName("camera") as Camera;
	}
	
	override public function onUpdate():void {
		var touchCount:int = _scene.input.touchCount();
		if (1 === touchCount) {
			//判断是否为两指触控，撤去一根手指后引发的touchCount===1
			if (isTwoTouch) {
				return;
			}
			_text.text = "触控点为1";
			//获取当前的触控点，数量为1
			var touch:Touch = _scene.input.getTouch(0);
			//是否为新一次触碰，并未发生移动
			if (first) {
				//获取触碰点的位置
				lastPosition.x = touch._position.x;
				lastPosition.y = touch._position.y;
				first = false;
			} else {
				//移动触碰点
				var deltaY:int = touch._position.y - lastPosition.y;
				var deltaX:int = touch._position.x - lastPosition.x;
				lastPosition.x = touch._position.x;
				lastPosition.y = touch._position.y;
				//根据移动的距离进行旋转
				tmpVector.setValue(1 * deltaY / 2, 1 * deltaX / 2, 0);
				(owner as Sprite3D).transform.rotate(tmpVector, true, false);
			}
		} else if (2 === touchCount) {
			_text.text = "触控点为2";
			isTwoTouch = true;
			//获取两个触碰点
			var touch:Touch = _scene.input.getTouch(0);
			var touch2:Touch = _scene.input.getTouch(1);
			//是否为新一次触碰，并未发生移动
			if (twoFirst) {
				//获取触碰点的位置
				disVector1.x = touch.position.x - touch2.position.x;
				disVector1.y = touch.position.y - touch2.position.y;
				distance = Vector2.scalarLength(disVector1);
				twoFirst = false;
			} else {
				disVector2.x = touch.position.x - touch2.position.x;
				disVector2.y = touch.position.y - touch2.position.y;
				var distance2:Number = Vector2.scalarLength(disVector2);
				//根据移动的距离进行缩放
				tmpVector.setValue(0, 0, -0.01 * (distance2 - distance));
				_camera.transform.translate(tmpVector);
				distance = distance2;
			}
		} else if (0 === touchCount) {
			_text.text = "触控点归零";
			first = true;
			twoFirst = true;
			lastPosition.x = 0;
			lastPosition.y = 0;
			isTwoTouch = false;
		}
	}
	
	override public function onLateUpdate():void {
	}

}

