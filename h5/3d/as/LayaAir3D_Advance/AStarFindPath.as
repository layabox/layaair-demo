package LayaAir3D_Advance {
	import laya.d3.component.Animator;
	import laya.d3.component.AnimatorState;
	import laya.d3.core.Camera;
	import laya.d3.core.material.BlinnPhongMaterial;
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.MeshTerrainSprite3D;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.core.SkinnedMeshSprite3D;
	import laya.d3.core.Sprite3D;
	import laya.d3.math.Quaternion;
	import laya.d3.math.Vector3;
	import laya.d3.math.Vector2;
	import laya.d3.resource.models.Mesh;
	import laya.display.Stage;
	import laya.events.Event;
	import laya.net.Loader;
	import laya.resource.Texture2D;
	import laya.utils.Handler;
	import laya.utils.Stat;
	import laya.utils.Tween;
	import laya.resource.Texture;
    
    public class AStarFindPath {
        private var terrainSprite:MeshTerrainSprite3D;
        private var layaMonkey:Sprite3D;
        private var path:Vector.<Vector3> = new Vector.<Vector3>();
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
        
        //AStar使用的全局变量
        private var aStarMap:*;
        private var graph:*;
        private var opts:*;
        private var resPath:*;

		private var startPoint:Vector2 = new Vector2();
		private var endPoint:Vector2 = new Vector2();
		private var resPath: Vector.<Vector2> = new Vector.<Vector2>();
		private var resPathLength:Number;
        
        public function AStarFindPath() {
            //初始化引擎
            Laya3D.init(0, 0);
            Laya.stage.scaleMode = Stage.SCALE_FULL;
            Laya.stage.screenMode = Stage.SCREEN_NONE;
            //显示性能面板
            Stat.show();
            
			for(var i:Number = 0; i < 20; ++i){
				var newVec:Vector2 = new Vector2();
				resPath.push(newVec);
			}
            
            //预加载所有资源
            var resource = [{url: "res/threeDimen/scene/TerrainScene/XunLongShi.ls", clas: Laya.Scene3D, priority: 1}, {url: "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", clas: Laya.Sprite3D, priority: 1}, {url: "res/threeDimen/scene/TerrainScene/Assets/HeightMap.png", clas: Laya.Texture2D, priority: 1, constructParams: [1024, 1024, 1, false, true]}, {url: "res/threeDimen/scene/TerrainScene/Assets/AStarMap.png", clas: Laya.Texture2D, priority: 1, constructParams: [64, 64, 1, false, true]}];
            
            Laya.loader.create(resource, Handler.create(this, onLoadFinish));
        }
        
        private function onLoadFinish():void {
            //初始化3D场景
            scene = Laya.stage.addChild(Loader.getRes("res/threeDimen/scene/TerrainScene/XunLongShi.ls")) as Scene3D;
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
            //读取墙壁的数据
            aStarMap = Loader.getRes("res/threeDimen/scene/TerrainScene/Assets/AStarMap.png");
            
            //使用astar组织数据
            var aStarArr:Array = createGridFromAStarMap(aStarMap);
            graph = new (window as *).Graph(aStarArr);
            opts = {};
            opts.closest = true;
            opts.heuristic = (window as *).astar.heuristics.diagonal;
            
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
            tmpLocalPosition.setValue(-1.912066, 10.07926, -10.11014);
            
            //_rotation.setValue( -0.01462472, -0.9652351, -0.2550373);
            moveCamera.transform.rotate(_rotation, true, false);
            
            //设置鼠标弹起事件响应
            Laya.stage.on(Event.MOUSE_UP, this, function():void {
                index = 0;
                //获取每次生成路径
				getGridIndex(path[curPathIndex % pointCount].x, path[curPathIndex++ % pointCount].z, startPoint);
				getGridIndex(path[nextPathIndex % pointCount].x, path[nextPathIndex++ % pointCount].z, endPoint);
				var start = graph.grid[startPoint.x][startPoint.y];   
				var end = graph.grid[endPoint.x][endPoint.y];       		

				_everyPath = (window as *).astar.search(graph, start, end, {
					closest: opts.closest
				});
				if (_everyPath && _everyPath.length > 0) {
					getRealPosition(start, _everyPath);
				}
            });
            //开启定时重复执行
            Laya.timer.loop(40, this, loopfun);
        }
        
        private function loopfun():void {
            if (resPath && index < resPathLength) {
				//AStar寻路位置
				_position.x = resPath[index].x;
				_position.z = resPath[index++].y;
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
				Tween.to(_finalPosition, { x: _position.x, y: _position.y, z: _position.z }, 40);
				moveSprite3D.transform.position = _finalPosition;
            }
        }
        
        /**
         * 得到整数的网格索引
         */
       private function getGridIndex(x:Number, z:Number, out:Vector2) {
            var minX = terrainSprite.minX;
			var minZ = terrainSprite.minZ;
			var cellX = terrainSprite.width / aStarMap.width;
			var cellZ = terrainSprite.depth / aStarMap.height;
			var gridX = Math.floor((x - minX) / cellX);
			var gridZ = Math.floor((z - minZ) / cellZ);
			var boundWidth = aStarMap.width - 1;
			var boundHeight = aStarMap.height - 1;
			(gridX > boundWidth) && (gridX = boundWidth);
			(gridZ > boundHeight) && (gridZ = boundHeight);
			(gridX < 0) && (gridX = 0);
			(gridZ < 0) && (gridZ = 0);
			out.x = gridX;
			out.y = gridZ;
        }
        
        /**
         * 得到世界坐标系下的真实坐标
         */
        private function getRealPosition(start, path): Number {
			resPathLength = path.length;
			var minX = terrainSprite.minX;
			var minZ = terrainSprite.minZ;
			var cellX = terrainSprite.width / aStarMap.width;
			var cellZ = terrainSprite.depth / aStarMap.height;
			var halfCellX = cellX / 2;
			var halfCellZ = cellZ / 2;

			resPath[0].x = start.x * cellX + halfCellX + minX;
			resPath[0].y = start.y * cellZ + halfCellZ + minZ;

			if(resPath.length < path.length ){
				var diff:number = path.length - resPath.length;
				for(var j:Number = 0; j < diff; ++j){
					var newPoint:Vector2 = new Vector2();
					resPath.push(newPoint);
				}
				
			}

			for (var i = 1; i < path.length; i++) {
				var gridPos = path[i];
				resPath[i].x = gridPos.x * cellX + halfCellX + minX;
				resPath[i].y = gridPos.y * cellZ + halfCellZ + minZ;
			}
			return 0;
		}
        
        /**
         * 通过图片数据计算得到AStart网格
         */
        private function createGridFromAStarMap(texture:Texture):Array {
            var textureWidth:int = texture.width;
            var textureHeight:int = texture.height;
            var pixelsInfo:Uint8Array = texture.getPixels();
            var aStarArr:Array = new Array();
            var index:int = 0;
            for (var w:int = 0; w < textureWidth; w++) {
                var colaStarArr:Array = new Array();
				aStarArr[w] = colaStarArr;
                for (var h = 0; h < textureHeight; h++) {
                    var r:int = pixelsInfo[index++];
                    var g:int = pixelsInfo[index++];
                    var b:int = pixelsInfo[index++];
                    var a:int = pixelsInfo[index++];
                    if (r == 255 && g == 255 && b == 255 && a == 255)
                        colaStarArr[h] = 1;
                    else {
                        colaStarArr[h] = 0;
                    }
                }
            }
            return aStarArr;
        }
        
        private function initPath(scene:Scene3D):void {
            for (var i:int = 0; i < pointCount; i++) {
                var str:String = "path" + i;
                path.push((scene.getChildByName('Scenes').getChildByName('Area').getChildByName(str) as MeshSprite3D).transform.localPosition);
            }
        }
    }
}        