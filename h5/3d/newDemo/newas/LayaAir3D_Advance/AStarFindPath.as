package LayaAir3D_Advance {
	import PathFinding.core.Grid;
	import PathFinding.core.Heuristic;
	import laya.d3.component.Animator;
	import laya.d3.component.AnimatorState;
	import laya.d3.component.PathFind;
	import laya.d3.core.Camera;
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.MeshTerrainSprite3D;
	import laya.d3.core.SkinnedMeshSprite3D;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.material.BlinnPhongMaterial;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Quaternion;
	import laya.d3.math.Vector3;
	import laya.d3.resource.models.Mesh;
	import laya.display.Stage;
	import laya.events.Event;
	import laya.net.Loader;
	import laya.utils.Handler;
	import laya.utils.Stat;
	import laya.utils.Tween;
	import laya.webgl.resource.Texture2D;
	
	public class AStarFindPath {
		private var terrainSprite:MeshTerrainSprite3D;
		private var layaMonkey:Sprite3D;
		private var path:Vector.<Vector3>;
		private var _everyPath:Array;
		private var _position:Vector3 = new Vector3(0, 0, 0);
		private var _upVector3:Vector3 = new Vector3(0, 1, 0);
		private var _tarPosition:Vector3 = new Vector3(0, 0, 0);
		private var _finalPosition:Vector3 = new Vector3(0, 0, 0);
		private var _rotation:Vector3 = new Vector3(-45, 180, 0);
		private var _rotation2:Vector3 = new Vector3(0, 180, 0);
		private var _quaternion:Quaternion = new Quaternion();
		private var index:int = 0;
		private var curPathIndex:int = 0;
		private var nextPathIndex:int = 1;
		private var moveSprite3D:Sprite3D;
		private var pointCount:int = 10;
		private var scene:Scene3D;
		
		public function AStarFindPath() {
			//初始化引擎
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			//显示性能面板
			Stat.show();
			
			path = new Vector.<Vector3>();
			
			//预加载所有资源
			var resource = [{url: "res/threeDimen/scene/TerrainScene/XunLongShi.ls", clas: Laya.Scene3D, priority: 1}, 
			{url: "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", clas: Laya.Sprite3D, priority: 1},
			{url: "res/threeDimen/scene/TerrainScene/Assets/HeightMap.png", clas: Laya.Texture2D, priority: 1, constructParams: [1024, 1024, 1, false, true]}, 
			{url: "res/threeDimen/scene/TerrainScene/Assets/AStarMap.png", clas: Laya.Texture2D, priority: 1, constructParams: [64, 64, 1, false, true]}];
			
			Laya.loader.create(resource, Handler.create(this, onLoadFinish));
		}
		
		private function onLoadFinish():void {
			//初始化3D场景
			scene = Laya.stage.addChild(Loader.getRes("res/threeDimen/scene/TerrainScene/XunLongShi.ls")) as Scene3D;
			
			//删除原始资源中包含的默认相机
			var camera:Camera = scene.getChildByName("Main Camera") as Camera;
			camera.removeSelf();
			
			//根据场景中方块生成路径点
			initPath(scene);
			
			//获取可行走区域模型
			var meshSprite3D:MeshSprite3D = scene.getChildByName('Scenes').getChildByName('HeightMap') as MeshSprite3D;
			//使可行走区域模型隐藏
			meshSprite3D.active = false;
			var heightMap:Texture2D = Loader.getRes("res/threeDimen/scene/TerrainScene/Assets/HeightMap.png") as Texture2D;
			//初始化MeshTerrainSprite3D
			terrainSprite = MeshTerrainSprite3D.createFromMeshAndHeightMap(meshSprite3D.meshFilter.sharedMesh as Mesh, heightMap, 6.574996471405029, 10.000000953674316);
			//更新terrainSprite世界矩阵(为可行走区域世界矩阵)
			terrainSprite.transform.worldMatrix = meshSprite3D.transform.worldMatrix;
			
			//给terrainSprite添加PathFind组件
			var pathFingding:PathFind = terrainSprite.addComponent(PathFind) as PathFind;
			pathFingding.setting = {allowDiagonal: true, dontCrossCorners: false, heuristic: Heuristic.manhattan, weight: 1};
			var aStarMap:Texture2D = Loader.getRes("res/threeDimen/scene/TerrainScene/Assets/AStarMap.png") as Texture2D;
			pathFingding.grid = Grid.createGridFromAStarMap(aStarMap);
			
			//初始化移动单元
			moveSprite3D = scene.addChild(new Sprite3D()) as Sprite3D;
			moveSprite3D.transform.position = path[0];
			
			//初始化小猴子
			layaMonkey = moveSprite3D.addChild(Loader.getRes("res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh")) as Sprite3D;
			
			var tmpLocalScale:Vector3 = layaMonkey.transform.localScale;
			tmpLocalScale.setValue(0.5, 0.5, 0.5);
			var aniSprite3d:Sprite3D = layaMonkey.getChildAt(0) as Sprite3D;
			
			//获取动画组件
			var animator:Animator = aniSprite3d.getComponent(Animator) as Animator;
			//创建动作状态
			var state:AnimatorState = new AnimatorState();
			//动作名称
			state.name = "run";
			//动作播放起始时间
			state.clipStart = 40 / 150;
			//动作播放结束时间
			state.clipEnd = 70 / 150;
			//设置动作
			state.clip = animator.getDefaultState().clip;
			//为动画组件添加一个动作状态
			animator.addState(state);
			//播放动画
			animator.play("run");
			
			//创建BlinnPhong材质
			var mat:BlinnPhongMaterial = (layaMonkey.getChildAt(0).getChildAt(0) as SkinnedMeshSprite3D).skinnedMeshRenderer.sharedMaterial as BlinnPhongMaterial;
			//设置反照率强度
			mat.albedoIntensity = 8;
			//设置猴子精灵的位置
			layaMonkey.transform.position.cloneTo(_finalPosition);
			
			//初始化相机
			var moveCamera:Camera = moveSprite3D.addChild(new Camera()) as Camera;
			var tmpLocalPosition:Vector3 = moveCamera.transform.localPosition;
			tmpLocalPosition.setValue(0, 7, -7);
			moveCamera.transform.rotate(_rotation, true, false);
			
			//设置鼠标弹起事件响应
			Laya.stage.on(Event.MOUSE_UP, this, function():void {
				index = 0;
				//获取每次生成路径
				_everyPath = pathFingding.findPath(path[curPathIndex % pointCount].x, path[curPathIndex++ % pointCount].z, path[nextPathIndex % pointCount].x, path[nextPathIndex++ % pointCount].z);
			});
			
			//开启定时重复执行
			Laya.timer.loop(40, this, loopfun);
		}
		
		private function loopfun():void {
			if (_everyPath && index < _everyPath.length) {
				//AStar寻路位置
				_position.x = _everyPath[index][0];
				_position.z = _everyPath[index++][1];
				//HeightMap获取高度数据
				_position.y = terrainSprite.getHeight(_position.x, _position.z);
				if (isNaN(_position.y)) {
					_position.y = moveSprite3D.transform.position.y;
				}
				
				_tarPosition.x = _position.x;
				_tarPosition.z = _position.z;
				_tarPosition.y = moveSprite3D.transform.position.y;
				
				//调整方向
				layaMonkey.transform.lookAt(_tarPosition, _upVector3, false);
				//因为资源规格,这里需要旋转180度
				layaMonkey.transform.rotate(_rotation2, false, false);
				//调整位置
				Tween.to(_finalPosition, {x: _position.x, y: _position.y, z: _position.z}, 40);
				moveSprite3D.transform.position = _finalPosition;
			}
		}
		
		private function initPath(scene:Scene3D):void {
			for (var i:int = 0; i < pointCount; i++) {
				var str:String = "path" + i;
				path.push((scene.getChildByName('Scenes').getChildByName('Area').getChildByName(str) as MeshSprite3D).transform.localPosition);
			}
		}
	}
}