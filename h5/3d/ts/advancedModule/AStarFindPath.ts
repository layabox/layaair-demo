class AStarFindPath
{
        private  terrainSprite:Laya.MeshTerrainSprite3D;
	    private  layaMonkey:Laya.Sprite3D;
		private  path:Array<Laya.Vector3>;
		private  _everyPath:Array<number>;
		private  _position:Laya.Vector3 = new Laya.Vector3(0, 0, 0);
		private  _upVector3:Laya.Vector3 = new Laya.Vector3(0, 1, 0);
		private  _tarPosition:Laya.Vector3 = new Laya.Vector3(0, 0, 0);
		private  _finalPosition:Laya.Vector3 = new Laya.Vector3(0, 0, 0);
		private  index:number = 0;
		private  curPathIndex:number = 0;
		private  nextPathIndex:number = 1;
		private  moveSprite3D:Laya.Sprite3D;
		private  pointCount:number = 10;
		private  scene:Laya.Scene3D;
    constructor()
    {
        Laya3D.init(0,0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
		Laya.Stat.show();
			
	    this.path = new Array<Laya.Vector3>();
			
			//预加载所有资源
			var resource:Array<any> = [
				{url: "../../res/threeDimen/scene/TerrainScene/XunLongShi.ls", clas: Laya.Scene3D, priority: 1}, 
				{url: "../../res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", clas: Laya.Sprite3D, priority: 1}, 
				{url: "../../res/threeDimen/scene/TerrainScene/Assets/HeightMap.png", clas: Laya.Texture2D, priority: 1, constructParams: [1024, 1024, 1, false, true]}, 
				{url: "../../res/threeDimen/scene/TerrainScene/Assets/AStarMap.png", clas: Laya.Texture2D, priority: 1, constructParams: [64, 64, 1, false, true]}
			];
			//加载函数
			Laya.loader.create(resource, Laya.Handler.create(this, this.onLoadFinish));
    }

    private onLoadFinish():void
		{
			//初始化3D场景
			this.scene = Laya.stage.addChild(Laya.Loader.getRes("../../res/threeDimen/scene/TerrainScene/XunLongShi.ls")) as Laya.Scene3D;
			
			//删除原始资源中包含的默认相机
			var camera:Laya.Camera = this.scene.getChildByName("Main Camera") as Laya.Camera;
            //删除自身
            camera.removeSelf();
			
			//根据场景中方块生成路径点
			this.initPath(this.scene);
			
			//获取可行走区域模型
            var meshSprite3D:Laya.MeshSprite3D = this.scene.getChildByName('Scenes').getChildByName('HeightMap') as Laya.MeshSprite3D;
            //使可行走区域模型隐藏
            meshSprite3D.active = false;
            //加载图片
			var heightMap:Laya.Texture2D = Laya.Loader.getRes("../../res/threeDimen/scene/TerrainScene/Assets/HeightMap.png") as Laya.Texture2D;
			//初始化MeshTerrainSprite3D
			this.terrainSprite = Laya.MeshTerrainSprite3D.createFromMeshAndHeightMap(meshSprite3D.meshFilter.sharedMesh as Laya.Mesh, heightMap, 6.574996471405029, 10.000000953674316);
			//更新terrainSprite世界矩阵(为可行走区域世界矩阵)
			this.terrainSprite.transform.worldMatrix = meshSprite3D.transform.worldMatrix;
			
			//给terrainSprite添加PathFind组件
			var pathFingding:Laya.PathFind = this.terrainSprite.addComponent(Laya.PathFind) as Laya.PathFind;
			pathFingding.setting = {allowDiagonal: true, dontCrossCorners: false, heuristic: PathFinding.core.Heuristic.manhattan, weight: 1};
			var aStarMap:Laya.Texture2D = Laya.Loader.getRes("../../res/threeDimen/scene/TerrainScene/Assets/AStarMap.png") as Laya.Texture2D;
			pathFingding.grid = PathFinding.core.Grid.createGridFromAStarMap(aStarMap);
			
			//初始化移动单元
			this.moveSprite3D = this.scene.addChild(new Laya.Sprite3D()) as Laya.Sprite3D;
            this.moveSprite3D.transform.position = this.path[0];
            
            //初始化小猴子
			this.layaMonkey = this.moveSprite3D.addChild(Laya.Loader.getRes("../../res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh")) as Laya.Sprite3D;
			this.layaMonkey.transform.localScale = new Laya.Vector3(0.5, 0.5, 0.5);
			var aniSprite3d:Laya.Sprite3D = this.layaMonkey.getChildAt(0) as Laya.Sprite3D;
			var animator:Laya.Animator = aniSprite3d.getComponent(Laya.Animator) as Laya.Animator;
			var state:Laya.AnimatorState = new Laya.AnimatorState();
			state.name = "run";
			state.clipStart = 40 / 150;
			state.clipEnd = 70 / 150;
			state.clip = animator.getDefaultState().clip;
			animator.addState(state);
			animator.play("run");
			var mat:Laya.BlinnPhongMaterial = (this.layaMonkey.getChildAt(0).getChildAt(0) as Laya.SkinnedMeshSprite3D).skinnedMeshRenderer.sharedMaterial as Laya.BlinnPhongMaterial;
			mat.albedoIntensity = 8;
			this.layaMonkey.transform.position.cloneTo(this._finalPosition);
			//初始化相机
			var moveCamera:Laya.Camera = this.moveSprite3D.addChild(new Laya.Camera()) as Laya.Camera;
			camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;
			Laya.BaseMaterial.load("../../res/threeDimen/skyBox/skyBox3/skyBox3.lmat",Laya.Handler.create(null,function(mat:Laya.SkyBoxMaterial):void{
				camera.skyboxMaterial =mat ;
			}));
			moveCamera.transform.localPosition = new Laya.Vector3(0, 7, -7);
			moveCamera.transform.rotate(new Laya.Vector3(-45, 180, 0), true, false);
			
			Laya.stage.on(Laya.Event.MOUSE_UP, this, function():void{
				this.index = 0;
				//获取每次生成路径
				this._everyPath = pathFingding.findPath(this.path[this.curPathIndex%this.pointCount].x, this.path[this.curPathIndex++%this.pointCount].z, this.path[this.nextPathIndex%this.pointCount].x, this.path[this.nextPathIndex++%this.pointCount].z);
			});
			
			Laya.timer.loop(40, this, this.loopfun);
        }
        private loopfun():void
		{
			if (this._everyPath && this.index < this._everyPath.length)
			{
				//AStar寻路位置
				this._position.x = this._everyPath[this.index][0];
				this._position.z = this._everyPath[this.index++][1];
				//HeightMap获取高度数据
				this._position.y = this.terrainSprite.getHeight(this._position.x, this._position.z);
				if (isNaN(this._position.y)){
					this._position.y = this.moveSprite3D.transform.position.y;
				}
				
				this._tarPosition.x = this._position.x;
				this._tarPosition.z = this._position.z;
				this._tarPosition.y = this.moveSprite3D.transform.position.y;
				
				//调整方向
				this.layaMonkey.transform.lookAt(this._tarPosition, this._upVector3, false);
				//因为资源规格,这里需要旋转180度
				this.layaMonkey.transform.rotate(new Laya.Vector3(0, 180, 0), false, false);
				//调整位置
				Laya.Tween.to(this._finalPosition, {x: this._position.x, y: this._position.y, z: this._position.z}, 40);
				this.moveSprite3D.transform.position = this._finalPosition;
			}
		}
        private initPath(scene:Laya.Scene):void
		{
			for (var i:number = 0; i < this.pointCount; i++)
			{
                //as中的String变为了string
				var str:string = "path" + i;
				this.path.push((scene.getChildByName('Scenes').getChildByName('Area').getChildByName(str) as Laya.MeshSprite3D).transform.localPosition);
			}
		}
}
new AStarFindPath;