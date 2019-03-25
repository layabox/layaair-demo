class Scene2DPlayer3D {
		
		/**
		 * (pos.x pos.y) 屏幕位置
		 *  pos.z 深度取值范围(-1,1);
		 * */
		
		
		constructor() {
			
			Laya3D.init(1024, 768);
			Laya.stage.scaleMode = Laya.Stage.SCALE_FIXED_HEIGHT;
			Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
			Laya.Stat.show();
			
            var dialog = new Laya.Image("res/threeDimen/secne.jpg");
            Laya.stage.addChild(dialog);
			
            var scene = new Laya.Scene3D();
            Laya.stage.addChild(scene);
            //初始化变量
            this.pos = new Laya.Vector3(310, 500, 0);
			this._translate = new Laya.Vector3(0, 0, 0);
			this._translateW = new Laya.Vector3(0, 0, -0.2);
			this._translateS = new Laya.Vector3(0, 0, 0.2);
			this._translateA = new Laya.Vector3(-0.2, 0, 0);
			this._translateD = new Laya.Vector3(0.2, 0, 0);
		    this._layaMonkey = null;
			
            var camera = new Laya.Camera(0, 0.1, 1000);
            scene.addChild(camera);
			camera.transform.rotate(new Laya.Vector3(-45, 0, 0), false, false);
			camera.transform.translate(new Laya.Vector3(5, -10, 1));
			camera.orthographic = true;
			//正交投影垂直矩阵尺寸
			camera.orthographicVerticalSize = 10;
			
            var directionLight = new Laya.DirectionLight();
            scene.addChild(directionLight);
			
			Laya.Sprite3D.load("res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", Laya.Handler.create(this, function(layaMonkey) {
				scene.addChild(layaMonkey);
				this._layaMonkey = layaMonkey;
				layaMonkey.transform.localScale = new Laya.Vector3(0.3, 0.3, 0.3);
				//转换2D屏幕坐标系统到3D正交投影下的坐标系统
				camera.convertScreenCoordToOrthographicCoord(this.pos, this._translate);
				layaMonkey.transform.position = this._translate;
				layaMonkey.transform.rotationEuler = new Laya.Vector3(-30, 0, 0);
				Laya.timer.frameLoop(1, this, this.onKeyDown);
			
			}));
		
		}
		onKeyDown() {
			Laya.KeyBoardManager.hasKeyDown(87) && this._layaMonkey.transform.translate(this._translateW);//W
			Laya.KeyBoardManager.hasKeyDown(83) && this._layaMonkey.transform.translate(this._translateS);//S
			Laya.KeyBoardManager.hasKeyDown(65) && this._layaMonkey.transform.translate(this._translateA);//A
			Laya.KeyBoardManager.hasKeyDown(68) && this._layaMonkey.transform.translate(this._translateD);//D
		}
	}
new Scene2DPlayer3D;