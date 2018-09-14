package advancedModule {
	import PathFinding.core.Grid;
	import PathFinding.core.Heuristic;
	import common.CameraMoveScript;
	import laya.d3.component.Animator;
	import laya.d3.component.AnimatorState;
	import laya.d3.component.PathFind;
	import laya.d3.core.BaseCamera;
	import laya.d3.core.Camera;
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.MeshTerrainSprite3D;
	import laya.d3.core.SkinnedMeshSprite3D;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.material.BaseMaterial;
	import laya.d3.core.material.BlinnPhongMaterial;
	import laya.d3.core.material.SkyBoxMaterial;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Quaternion;
	import laya.d3.math.Vector3;
	import laya.d3.resource.models.Mesh;
	import laya.d3.shader.Shader3D;
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
		private var _quaternion:Quaternion = new Quaternion();
		private var index:int = 0;
		private var curPathIndex:int = 0;
		private var nextPathIndex:int = 1;
		private var moveSprite3D:Sprite3D;
		private var pointCount:int = 10;
		private var scene:Scene3D;
		
		public function AStarFindPath() {
			Shader3D.debugMode = true;
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			//tat.show();
			
			path = new Vector.<Vector3>();
			
			//预加载所有资源
			var resource:Array = [
			{url: "../../../../res/threeDimen/scene/TerrainScene/XunLongShi.ls", clas: Scene3D, priority: 1}, 
			{url: "../../../../res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", clas: Sprite3D, priority: 1}, 
			{url: "../../../../res/threeDimen/scene/TerrainScene/Assets/HeightMap.png", clas: Texture2D, priority: 1, constructParams: [1024, 1024, 1, false, true]}, 
			{url: "../../../../res/threeDimen/scene/TerrainScene/Assets/AStarMap.png", clas: Texture2D, priority: 1, constructParams: [64, 64, 1, false, true]}];
			
			Laya.loader.create(resource, Handler.create(this, onLoadFinish));
		}
		
		private function onLoadFinish():void {
			//初始化3D场景
			scene = Laya.stage.addChild(Loader.getRes("../../../../res/threeDimen/scene/TerrainScene/XunLongShi.ls")) as Scene3D;
			
			//删除原始资源中包含的默认相机
			var camera:Camera = scene.getChildByName("Main Camera") as Camera;
			camera.addComponent(CameraMoveScript);
			camera.removeSelf();
			
			//根据场景中方块生成路径点
			initPath(scene);
			
			//获取可行走区域模型
			var meshSprite3D:MeshSprite3D = scene.getChildByName('Scenes').getChildByName('HeightMap') as MeshSprite3D;
			//使可行走区域模型隐藏
			meshSprite3D.active = false;
			var heightMap:Texture2D = Loader.getRes("../../../../res/threeDimen/scene/TerrainScene/Assets/HeightMap.png") as Texture2D;
			//初始化MeshTerrainSprite3D
			terrainSprite = MeshTerrainSprite3D.createFromMeshAndHeightMap(meshSprite3D.meshFilter.sharedMesh as Mesh, heightMap, 6.574996471405029, 10.000000953674316);
			//更新terrainSprite世界矩阵(为可行走区域世界矩阵)
			terrainSprite.transform.worldMatrix = meshSprite3D.transform.worldMatrix;
			
			//给terrainSprite添加PathFind组件
			var pathFingding:PathFind = terrainSprite.addComponent(PathFind) as PathFind;
			pathFingding.setting = {allowDiagonal: true, dontCrossCorners: false, heuristic: Heuristic.manhattan, weight: 1};
			var aStarMap:Texture2D = Loader.getRes("../../../../res/threeDimen/scene/TerrainScene/Assets/AStarMap.png") as Texture2D;
			pathFingding.grid = Grid.createGridFromAStarMap(aStarMap);
			
			//初始化移动单元
			moveSprite3D = scene.addChild(new Sprite3D()) as Sprite3D;
			moveSprite3D.transform.position = path[0];
			
			//初始化小猴子
			layaMonkey = moveSprite3D.addChild(Loader.getRes("../../../../res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh")) as Sprite3D;
			layaMonkey.transform.localScale = new Vector3(0.5, 0.5, 0.5);
			var aniSprite3d:Sprite3D = layaMonkey.getChildAt(0) as Sprite3D;
			var animator:Animator = aniSprite3d.getComponent(Animator) as Animator;
			var state:AnimatorState = new AnimatorState();
			state.name = "run";
			state.clipStart = 40 / 150;
			state.clipEnd = 70 / 150;
			state.clip = animator.getDefaultState().clip;
			animator.addState(state);
			animator.play("run");
			var mat:BlinnPhongMaterial = (layaMonkey.getChildAt(0).getChildAt(0) as SkinnedMeshSprite3D).skinnedMeshRenderer.sharedMaterial as BlinnPhongMaterial;
			mat.albedoIntensity = 8;
			layaMonkey.transform.position.cloneTo(_finalPosition);
			
			//初始化相机
			var moveCamera:Camera = moveSprite3D.addChild(new Camera()) as Camera;
			camera.clearFlag = BaseCamera.CLEARFLAG_SKY;
			BaseMaterial.load("../../../../res/threeDimen/skyBox/skyBox3/skyBox3.lmat",Handler.create(null,function(mat:SkyBoxMaterial):void{
				camera.skyboxMaterial =mat ;
			}));
			moveCamera.transform.localPosition = new Vector3(0, 7, -7);
			moveCamera.transform.rotate(new Vector3(-45, 180, 0), true, false);
			
			Laya.stage.on(Event.MOUSE_UP, this, function():void {
				index = 0;
				//获取每次生成路径
				_everyPath = pathFingding.findPath(path[curPathIndex % pointCount].x, path[curPathIndex++ % pointCount].z, path[nextPathIndex % pointCount].x, path[nextPathIndex++ % pointCount].z);
			});
			
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
				layaMonkey.transform.rotate(new Vector3(0, 180, 0), false, false);
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