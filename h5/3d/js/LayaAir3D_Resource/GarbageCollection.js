class GarbageCollection{
		constructor(){
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
			Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
			Laya.Stat.show();
			this._castType = 0;
			this.scene = null;
			
			this.loadScene();
			this.addButton(200, 200, 160, 40, "释放显存", function(e) {
				this._castType++;
				this._castType %= 2;
				switch (this._castType) {
				case 0: 
					(e.target).label = "释放显存";
					this.loadScene();
					break;
				case 1: 
					(e.target).label = "加载场景";
					this.garbageCollection();
					break;
				}
			});
		}
		addButton(x, y, width, height, text, clickFun){
			Laya.loader.load(["res/threeDimen/ui/button.png"], Laya.Handler.create(this, function() {
				let changeActionButton = Laya.stage.addChild(new Laya.Button("res/threeDimen/ui/button.png", text));
				changeActionButton.size(width, height);
				changeActionButton.labelBold = true;
				changeActionButton.labelSize = 30;
				changeActionButton.sizeGrid = "4,4,4,4";
				changeActionButton.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
				changeActionButton.pos(x, y);
				changeActionButton.on(Laya.Event.CLICK, this, clickFun);
			}));
		}
		loadScene(){
			Laya.Scene3D.load("res/threeDimen/scene/ParticleScene/Example_01.ls", Laya.Handler.create(this, function(scene) {
				this.scene = Laya.stage.addChildAt(scene, 0);
				let camera = this.scene.addChild(new Laya.Camera(0, 0.1, 100));
				camera.transform.translate(new Laya.Vector3(0, 1, 0));
				camera.addComponent(CameraMoveScript);
			}));
		}
		garbageCollection(){
			this.scene.destroy();//销毁场景
			Laya.Resource.destroyUnusedResources();//销毁无用资源(没有被场景树引用,并且没有加资源锁的)
		}
	}
	
	//激活启动类
new GarbageCollection();

