class Performance{
    constructor(){
        this.curStateIndex = 0;
		this.changeActionButton = null;
		this.planeSprite = null;
		this.planeSprite = null;
		this.cubeSprite = null;
		this.sphereSprite = null;
		this.capsuleSprite = null;
		this.cylinderSprite = null;
        this.renderableSprite3Ds = new Array;

        Laya3D.init(0, 0);
		Laya.Stat.show();
		Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
		Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
		
		Laya.Scene3D.load("res/threeDimen/scene/StaticBatching/staticBatching.ls", Laya.Handler.create(this, function(scene) {
			Laya.stage.addChild(scene);
			var camera = scene.getChildByName("Main Camera");
			camera.addComponent(CameraMoveScript);
				
			//获取相同材质的精灵
			this.planeSprite = scene.getChildByName("Plane");
			this.cubeSprite = scene.getChildByName("Cube");
			this.sphereSprite = scene.getChildByName("Sphere");
			this.capsuleSprite = scene.getChildByName("Capsule");
			this.cylinderSprite = scene.getChildByName("Cylinder");
				
			//精灵设置不开启合并
			this.planeSprite._isStatic = false;
			this.cubeSprite._isStatic = false;
			this.sphereSprite._isStatic = false;
			this.capsuleSprite._isStatic = false;
			this.cylinderSprite._isStatic = false;
				
			//加入到合并数组
			this.renderableSprite3Ds.push(this.planeSprite);
			this.renderableSprite3Ds.push(this.cubeSprite);
			this.renderableSprite3Ds.push(this.sphereSprite);
			this.renderableSprite3Ds.push(this.capsuleSprite);
			this.renderableSprite3Ds.push(this.cylinderSprite);
				
			//生成按钮
			this.loadUI();
				
		}));
    }
    loadUI(){
        Laya.loader.load(["res/threeDimen/ui/button.png"], Laya.Handler.create(this, function() {
				
            this.changeActionButton = Laya.stage.addChild(new Laya.Button("res/threeDimen/ui/button.png", "静态合并"));
            this.changeActionButton.size(160, 40);
            this.changeActionButton.labelBold = true;
            this.changeActionButton.labelSize = 30;
            this.changeActionButton.sizeGrid = "4,4,4,4";
            this.changeActionButton.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
            this.changeActionButton.pos(Laya.stage.width / 2 - this.changeActionButton.width * Laya.Browser.pixelRatio / 2, Laya.stage.height - 100 * Laya.Browser.pixelRatio);
            
            this.changeActionButton.on(Laya.Event.CLICK, this, function(){
				//精灵设置开启静态合并
				this.planeSprite._isStatic = true;
				this.cubeSprite._isStatic = true;
				this.sphereSprite._isStatic = true;
				this.capsuleSprite._isStatic = true;
				this.cylinderSprite._isStatic = true;
				//进行静态合并
				Laya.StaticBatchManager.combine(null, this.renderableSprite3Ds);				
            });	
        }));
    }

}
//激活启动类
new Performance();