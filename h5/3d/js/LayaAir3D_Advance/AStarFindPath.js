/**
 * 本实例使用的A星算法，来源于开源A星算法:https://github.com/bgrins/javascript-astar
 */
class AStarFindPath{
  constructor(){
    //设置初始化引擎
    this.position = new Laya.Vector3(0, 0, 0);
    this.upVector3 = new Laya.Vector3(0, 1, 0);
    this.tarPosition = new Laya.Vector3(0, 0, 0);
    this.finalPosition = new Laya.Vector3(0, 0, 0);
    this.rotation = new Laya.Vector3(-45, 180, 0);
	  this.rotation2 = new Laya.Vector3(0, 180, 0);
    this.index = 0;
    this.curPathIndex = 0;
    this.nextPathIndex = 1;
    this.pointCount = 10;
    Laya3D.init(0, 0);
    Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
    Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
    Laya.Stat.show();
    this.path = [];
    //预加载所有资源
    let resource = [{url: "res/threeDimen/scene/TerrainScene/XunLongShi.ls", clas: Laya.Scene3D, priority: 1}, 
      {url: "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", clas: Laya.Sprite3D, priority: 1},
      {url: "res/threeDimen/scene/TerrainScene/Assets/HeightMap.png", clas: Laya.Texture2D, priority: 1, constructParams: [1024, 1024, 1, false, true]}, 
      {url: "res/threeDimen/scene/TerrainScene/Assets/AStarMap.png", clas: Laya.Texture2D, priority: 1, constructParams: [64, 64, 1, false, true]}];
    //加载函数
    Laya.loader.create(resource, Laya.Handler.create(this, this.onLoadFinish));
  }
  onLoadFinish(){
    //初始化3D场景
    this.scene = Laya.stage.addChild(Laya.Loader.getRes("res/threeDimen/scene/TerrainScene/XunLongShi.ls"));
    //删除原始资源中包含的默认相机
    //let camera = this.scene.getChildByName("Main Camera");
    //删除自身
    //camera.removeSelf();
    //根据场景中方块生成路径点
    this.initPath(this.scene);
    //获取可行走区域模型
    let meshSprite3D = this.scene.getChildByName('Scenes').getChildByName('HeightMap');
    //使可行走区域模型隐藏
    meshSprite3D.active = false;
    //加载图片
    let heightMap = Laya.Loader.getRes("res/threeDimen/scene/TerrainScene/Assets/HeightMap.png");
    //初始化MeshTerrainSprite3D
    this.terrainSprite = Laya.MeshTerrainSprite3D.createFromMeshAndHeightMap(meshSprite3D.meshFilter.sharedMesh, heightMap, 6.574996471405029, 10.000000953674316);

    //读取墙壁的数据
    this.aStarMap = Laya.Loader.getRes("res/threeDimen/scene/TerrainScene/Assets/AStarMap.png");
    this.resPath = [];
    this.startPoint = new Laya.Vector2();
    this.endPoint = new Laya.Vector2();
    for(var i = 0; i < 20; ++i){
			var newVec = new Laya.Vector2();
			this.resPath.push(newVec);
    }
    
    this.resPathLength = 0;

    //使用astar组织数据
    var aStarArr = this.createGridFromAStarMap( this.aStarMap);
    this.graph = new Graph(aStarArr);
    this.opts = [];
    this.opts.closest = true;
    this.opts.heuristic = astar.heuristics.diagonal;

    //初始化移动单元
    this.moveSprite3D = this.scene.addChild(new Laya.Sprite3D());
    this.moveSprite3D.transform.position = this.path[0];
    //初始化小猴子
    this.layaMonkey = this.moveSprite3D.addChild(Laya.Loader.getRes("res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh"));
    this.layaMonkey.transform.localScale = new Laya.Vector3(0.5, 0.5, 0.5);
    let aniSprite3d = this.layaMonkey.getChildAt(0);
    let animator = aniSprite3d.getComponent(Laya.Animator);
    let state = new Laya.AnimatorState();
    state.name = "run";
    state.clipStart = 40 / 150;
    state.clipEnd = 70 / 150;
    state.clip = animator.getDefaultState().clip;
    animator.getControllerLayer(0).addState(state);
    animator.play("run");
    let mat = this.layaMonkey.getChildAt(0).getChildAt(0).skinnedMeshRenderer.sharedMaterial;
    mat.albedoIntensity = 8;
    this.layaMonkey.transform.position.cloneTo(this.finalPosition);
    //初始化相机
    let moveCamera = this.moveSprite3D.addChild(new Laya.Camera());
    // camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;
    // Laya.BaseMaterial.load("res/threeDimen/skyBox/skyBox3/skyBox3.lmat", Laya.Handler.create(null, function (mat) {
    //     camera.skyboxMaterial = mat;
    // }));
    moveCamera.addComponent(CameraMoveScript);
    moveCamera.transform.localPosition = new Laya.Vector3(0, 7, -7);
    moveCamera.transform.rotate(this.rotation, true, false);
    Laya.stage.on(Laya.Event.MOUSE_UP, this, function () {
        this.index = 0;
        //获取每次生成路径
        var startPoint = this.getGridIndex(this.path[this.curPathIndex % this.pointCount].x, 
                                                  this.path[this.curPathIndex++ % this.pointCount].z);
        var endPoint = this.getGridIndex(this.path[this.nextPathIndex % this.pointCount].x, 
                                                  this.path[this.nextPathIndex++ % this.pointCount].z);
        var start = this.graph.grid[startPoint.x][startPoint.z];   
        var end = this.graph.grid[endPoint.x][endPoint.z];                  
        this._everyPath = astar.search(this.graph, start, end, {
          closest: this.opts.closest
        });
        if (this._everyPath && this._everyPath.length > 0) {
          this.getRealPosition(start, this._everyPath);
        }
    });
    Laya.timer.loop(40, this, this.loopfun);
  }

  /**
	 * 得到整数的网格索引
	 */   
	getGridIndex = function(x,z){
		var minX=this.terrainSprite.minX;
		var minZ=this.terrainSprite.minZ;
		var cellX=this.terrainSprite.width / this.aStarMap.width;
		var cellZ=this.terrainSprite.depth / this.aStarMap.height;
		var gridX=Math.floor((x-minX)/ cellX);
		var gridZ=Math.floor((z-minZ)/ cellZ);
		var boundWidth=this.aStarMap.width-1;
		var boundHeight=this.aStarMap.height-1;
		(gridX > boundWidth)&& (gridX=boundWidth);
		(gridZ > boundHeight)&& (gridZ=boundHeight);
		(gridX < 0)&& (gridX=0);
		(gridZ < 0)&& (gridZ=0);
		var res = [];
		res.x = gridX;
		res.z = gridZ;
		return res;
	}

  /**
   * 得到世界坐标系下的真实坐标
   */
  getRealPosition=function(start,path){
    this.resPathLength = path.length;
		var minX = this.terrainSprite.minX;
		var minZ = this.terrainSprite.minZ;
		var cellX = this.terrainSprite.width / this.aStarMap.width;
		var cellZ = this.terrainSprite.depth / this.aStarMap.height;
		var halfCellX = cellX / 2;
		var halfCellZ = cellZ / 2;

		this.resPath[0].x = start.x * cellX + halfCellX + minX;
		this.resPath[0].y = start.y * cellZ + halfCellZ + minZ;

		if(this.resPath.length < path.length ){
			var diff = path.length - this.resPath.length;
			for(var j = 0; j < diff; ++j){
				var newPoint = new Laya.Vector2();
				this.resPath.push(newPoint);
			}
			
		}

		for (var i = 1; i < path.length; i++) {
			var gridPos = path[i];
			this.resPath[i].x = gridPos.x * cellX + halfCellX + minX;
			this.resPath[i].y = gridPos.y * cellZ + halfCellZ + minZ;
		}
		return 0;
	}

  /**
   * 通过图片数据计算得到AStart网格
   */
  createGridFromAStarMap=function(texture){
		var textureWidth=texture.width;
		var textureHeight=texture.height;
		var pixelsInfo=texture.getPixels();
		var aStarArr=[];
		var index=0;
		for (var w=0;w < textureWidth;w++){
			var colaStarArr=aStarArr[w]=[];
			for (var h=0;h < textureHeight;h++){
				var r=pixelsInfo[index++];
				var g=pixelsInfo[index++];
				var b=pixelsInfo[index++];
				var a=pixelsInfo[index++];
				if (r==255 && g==255 && b==255 && a==255)
					colaStarArr[h]=1;
				else {
					colaStarArr[h]=0;
				}
			}
		};
		return aStarArr;
	}

  loopfun(){
    if (this.resPath && this.index < this.resPathLength) {
			//AStar寻路位置
			this.position.x = this.resPath[this.index].x;
			this.position.z = this.resPath[this.index++].y;
			//HeightMap获取高度数据
			this.position.y = this.terrainSprite.getHeight(this.position.x, this.position.z);
			if (isNaN(this.position.y)) {
				this.position.y = this.moveSprite3D.transform.position.y;
			}

			this.tarPosition.x = this.position.x;
			this.tarPosition.z = this.position.z;
			this.tarPosition.y = this.moveSprite3D.transform.position.y;

			//调整方向
			this.layaMonkey.transform.lookAt(this.tarPosition, this.upVector3, false);
			//因为资源规格,这里需要旋转180度
			this.layaMonkey.transform.rotate(this.rotation2, false, false);
			//调整位置
			Laya.Tween.to(this.finalPosition, { x: this.position.x, y: this.position.y, z: this.position.z }, 40);
			this.moveSprite3D.transform.position = this.finalPosition;
		}

  }
  initPath(scene){
    for (let i = 0; i < this.pointCount; i++) {
      let str = "path" + i;
      this.path.push(scene.getChildByName('Scenes').getChildByName('Area').getChildByName(str).transform.localPosition);

    }
  }

}

//激活启动类
new AStarFindPath();