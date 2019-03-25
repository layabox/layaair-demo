package LayaAir3D_MouseInteraction {
	import common.CameraMoveScript;
	import laya.d3.core.Camera;
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.light.DirectionLight;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Quaternion;
	import laya.d3.math.Ray;
	import laya.d3.math.Vector2;
	import laya.d3.math.Vector3;
	import laya.d3.physics.HitResult;
	import laya.d3.physics.PhysicsCollider;
	import laya.d3.physics.shape.MeshColliderShape;
	import laya.d3.resource.models.Mesh;
	import laya.display.Stage;
	import laya.display.Text;
	import laya.events.Event;
	import laya.events.MouseManager;
	import laya.net.Loader;
	import laya.utils.Handler;
	import laya.utils.Stat;
	
	/**
	 * ...
	 * @author ...
	 */
	public class MouseInteraction {
		
		private var _scene:Scene3D;
		private var _camera:Camera;
		private var _ray:Ray;
		private var _outHitResult:HitResult = new HitResult();
		private var posX:Number = 0.0;
		private var posY:Number = 0.0;
		private var point:Vector2 = new Vector2();
		private var text:Text = new Text();
		private var tmpVector:Vector3 = new Vector3(0, 0, 0);
		
		public function MouseInteraction() {
			//初始化引擎
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			//显示性能面板
			Stat.show();
			
			//创建场景
			_scene = Laya.stage.addChild(new Scene3D()) as Scene3D;
			
			//添加相机
			_camera = (_scene.addChild(new Camera(0, 0.1, 100))) as Camera;
			_camera.transform.translate(new Vector3(0, 0.7, 5));
			_camera.transform.rotate(new Vector3(-15, 0, 0), true, false);
			_camera.addComponent(CameraMoveScript);
			
			//添加光照
			var directionLight:DirectionLight = _scene.addChild(new DirectionLight()) as DirectionLight;
			directionLight.color = new Vector3(1, 1, 1);
			directionLight.transform.rotate(new Vector3(-3.14 / 3, 0, 0));
			
			//灯光开启阴影
			//directionLight.shadow = true;
			//可见阴影距离
			directionLight.shadowDistance = 3;
			//生成阴影贴图尺寸
			directionLight.shadowResolution = 2048;
			//生成阴影贴图数量
			directionLight.shadowPSSMCount = 1;
			//模糊等级,越大越高,更耗性能
			directionLight.shadowPCFType = 3;
			
			//批量预加载资源
			Laya.loader.create(["res/threeDimen/staticModel/grid/plane.lh", "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh"], Handler.create(this, onComplete));
		
			//显示文本显示框
			text.name = "text";
			text.overflow = Text.HIDDEN;
			text.color = "#FFFFFF";
			text.font = "Impact";
			text.fontSize = 20;
			//text.borderColor = "#FFFF00";
			text.x = Laya.stage.width / 2;
			Laya.stage.addChild(text);
			
		}
		
		private function onComplete():void {
			//加载地面
			var grid:Sprite3D = _scene.addChild(Loader.getRes("res/threeDimen/staticModel/grid/plane.lh")) as Sprite3D;
			//指定精灵的图层
			grid.layer = 10;
			//地面接收阴影
			(grid.getChildAt(0) as MeshSprite3D).meshRenderer.receiveShadow = true;
			//加载静态小猴子
			var staticLayaMonkey:MeshSprite3D = _scene.addChild(new MeshSprite3D(Loader.getRes("res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/LayaMonkey-LayaMonkey.lm"))) as MeshSprite3D;
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
			tmpVector.setValue(0.0, 0, 0.5);
			var layaMonkey_clone1:MeshSprite3D = Sprite3D.instantiate(staticLayaMonkey, _scene, false, tmpVector) as MeshSprite3D;
			var layaMonkey_clone2:MeshSprite3D = Sprite3D.instantiate(staticLayaMonkey, _scene, false, tmpVector) as MeshSprite3D;
			var layaMonkey_clone3:MeshSprite3D = Sprite3D.instantiate(staticLayaMonkey, _scene, false, tmpVector) as MeshSprite3D;
			//设置精灵名字
			staticLayaMonkey.name = "大熊";
			layaMonkey_clone1.name = "二熊";
			layaMonkey_clone2.name = "三熊";
			layaMonkey_clone3.name = "小小熊";
			staticLayaMonkey.addComponent(SceneScript);
			layaMonkey_clone1.addComponent(SceneScript);
			layaMonkey_clone2.addComponent(SceneScript);
			layaMonkey_clone3.addComponent(SceneScript);
			
			//平移
			tmpVector.setValue(1.5, 0, 0.0);
			layaMonkey_clone1.transform.translate(tmpVector);
			tmpVector.setValue(-1.5, 0, 0.0);
			layaMonkey_clone2.transform.translate(tmpVector);
			tmpVector.setValue(2.5, 0, 0.0);
			layaMonkey_clone3.transform.translate(tmpVector);
			//旋转
			tmpVector.setValue(0, 60, 0);
			layaMonkey_clone2.transform.rotate(tmpVector, false, false);
			//缩放
			tmpVector.setValue(0.1, 0.1, 0.1);
			var scale:Vector3 = new Vector3(0.1, 0.1, 0.1);
			layaMonkey_clone3.transform.localScale = tmpVector;
			
			//给模型添加碰撞组件
			var meshCollider:PhysicsCollider = staticLayaMonkey.addComponent(PhysicsCollider);
			//创建网格碰撞器
			var meshShape:MeshColliderShape = new MeshColliderShape();
			//获取模型的mesh
			meshShape.mesh = staticLayaMonkey.meshFilter.sharedMesh as Mesh;
			//设置模型的碰撞形状
			meshCollider.colliderShape = meshShape;
			
			var meshCollider1:PhysicsCollider = layaMonkey_clone1.addComponent(PhysicsCollider);
			var meshShape1:MeshColliderShape = new MeshColliderShape();
			meshShape1.mesh = layaMonkey_clone1.meshFilter.sharedMesh as Mesh;
			meshCollider1.colliderShape = meshShape1;
			
			var meshCollider2:PhysicsCollider = layaMonkey_clone2.addComponent(PhysicsCollider);
			var meshShape2:MeshColliderShape = new MeshColliderShape();
			meshShape2.mesh = layaMonkey_clone2.meshFilter.sharedMesh as Mesh;
			meshCollider2.colliderShape = meshShape2;
			
			var meshCollider3:PhysicsCollider = layaMonkey_clone3.addComponent(PhysicsCollider);
			var meshShape3:MeshColliderShape = new MeshColliderShape();
			meshShape3.mesh = layaMonkey_clone3.meshFilter.sharedMesh as Mesh;
			meshCollider3.colliderShape = meshShape3;
			
			//设置文本显示框位置
			text.x = Laya.stage.width / 2 - 50;
			text.y = 50;
			
			//射线初始化（必须初始化）
			_ray = new Ray(new Vector3(0, 0, 0), new Vector3(0, 0, 0));
			//添加鼠标事件
			addMouseEvent();
		
		}
		
		private function addMouseEvent():void {
			//鼠标事件监听
			Laya.stage.on(Event.MOUSE_DOWN, this, onMouseDown);
		}
		
		private function onMouseDown():void {
			posX = point.x = MouseManager.instance.mouseX;
			posY = point.y = MouseManager.instance.mouseY;
			//产生射线
			_camera.viewportPointToRay(point, _ray);
			//拿到射线碰撞的物体
			_scene.physicsSimulation.rayCast(_ray, _outHitResult);
			//如果碰撞到物体
			if (_outHitResult.succeeded) {
				//删除碰撞到的物体
				text.text = "碰撞到了" + _outHitResult.collider.owner.name;
				trace("碰撞到物体！！")
			}
		
		}
	}

}
import laya.d3.component.Script3D;
import laya.d3.core.MeshSprite3D;
import laya.d3.core.material.BlinnPhongMaterial;
import laya.d3.math.Vector4;
import laya.d3.physics.Collision;
import laya.display.Text;

class SceneScript extends Script3D {
	private var meshSprite:MeshSprite3D;
	private var text:Text;
	private var _albedoColor:Vector4 = new Vector4(0.0, 0.0, 0.0, 1.0);
	
	public function SceneScript() {
	
	}
	
	/**
	 * 覆写3D对象组件被激活后执行，此时所有节点和组件均已创建完毕，此方法只执行一次
	 */
	override public function onAwake():void {
		meshSprite = this.owner as MeshSprite3D;
		text = Laya.stage.getChildByName("text") as Text;
	}
	
	/**
	 * 覆写组件更新方法（相当于帧循环）
	 */
	override public function onUpdate():void {
	}
	
	//物体必须拥有碰撞组件（Collider）
	//当被鼠标点击
	override public function onMouseDown():void {
		text.text = "碰撞到了" + this.owner.name;
		//从父容器销毁我自己
		//box.removeSelf();
	}
	
	//当产生碰撞
	override public function onCollisionEnter(collision:Collision):void {
		(meshSprite.meshRenderer.sharedMaterial as BlinnPhongMaterial).albedoColor = _albedoColor;
		// box.removeSelf();
	}
}

