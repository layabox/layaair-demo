import CameraMoveScript from "./common/CameraMoveScript"
class Sprite3DParent 
{
	private sprite3D:Laya.Sprite3D;
	private scene:Laya.Scene3D;
	constructor() 
	{
		//初始化引擎
		Laya3D.init(0, 0);
		Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
		Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
		//显示性能面板
		Laya.Stat.show();
		
		//创建场景
		this.scene = new Laya.Scene3D();
		Laya.stage.addChild(this.scene);
		
		//创建相机
		var camera = new Laya.Camera(0, 0.1, 100);
		this.scene.addChild(camera);
		camera.transform.translate(new Laya.Vector3(0, 0.5, 1));
		camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
		camera.addComponent(CameraMoveScript);
		
		//添加光照
		var directionLight = new Laya.DirectionLight();
		this.scene.addChild(directionLight);
		directionLight.color = new Laya.Vector3(1, 1, 1);
		directionLight.transform.rotate(new Laya.Vector3( -3.14 / 3, 0, 0));

		//预加载所有资源
		var resource = [
		{url: "res/threeDimen/skinModel/LayaMonkey2/LayaMonkey.lh", clas: Laya.Sprite3D, priority: 1, constructParams: [1024, 512, 1, true, true]},
		{url: "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", clas: Laya.Sprite3D, priority: 1, constructParams: [1024, 512, 1, true, true]},];
		Laya.loader.create(resource, Laya.Handler.create(this, this.onPreLoadFinish));
	}
	public onPreLoadFinish() {
		//添加父级猴子
		var layaMonkeyParent = this.scene.addChild(Laya.Loader.getRes("res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh")) as Laya.Sprite3D;
		//克隆猴子，作为子猴子
		var layaMonkeySon = Laya.Loader.getRes("res/threeDimen/skinModel/LayaMonkey2/LayaMonkey.lh") as Laya.Sprite3D;
		layaMonkeySon.transform.translate(new Laya.Vector3(2.5, 0, 0));
		//缩放
		var scale = new Laya.Vector3(0.5, 0.5, 0.5);
		layaMonkeySon.transform.localScale = scale;
		
		layaMonkeyParent.addChild(layaMonkeySon);
		
		this.addButton(100, 120, 160, 30, "移动父级猴子", 20, function(e:Event):void {
			layaMonkeyParent.transform.translate(new Laya.Vector3(-0.1, 0, 0));
		});
		this.addButton(100, 160, 160, 30, "放大父级猴子", 20, function(e:Event):void {
			var scale = new Laya.Vector3(0.2, 0.2, 0.2);
			layaMonkeyParent.transform.localScale = scale;
		});
		this.addButton(100, 200, 160, 30, "旋转父级猴子", 20, function(e:Event):void {
			layaMonkeyParent.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
		});
		
		
		this.addButton(100, 250, 160, 30, "移动子级猴子", 20, function(e:Event):void {
			layaMonkeySon.transform.translate(new Laya.Vector3(-0.1, 0, 0));
		});
		this.addButton(100, 290, 160, 30, "放大子级猴子", 20, function(e:Event):void {
			var scale = new Laya.Vector3(1, 1, 1);
			layaMonkeySon.transform.localScale = scale;
		});
		this.addButton(100, 330, 160, 30, "旋转子级猴子", 20, function(e:Event):void {
			layaMonkeySon.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
		});
	}
	
	private addButton(x:number, y:number, width:number, height:number, text:string, size, clickFun:Function):void {
		Laya.loader.load(["res/threeDimen/ui/button.png"], Laya.Handler.create(null, function():void {
			var changeActionButton = Laya.stage.addChild(new Laya.Button("res/threeDimen/ui/button.png", text)) as Laya.Button;
			changeActionButton.size(width, height);
			changeActionButton.labelBold = true;
			changeActionButton.labelSize = size;
			changeActionButton.sizeGrid = "4,4,4,4";
			changeActionButton.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
			changeActionButton.pos(x, y);
			changeActionButton.on(Laya.Event.CLICK, this, clickFun);
		}));
	}
	
}

//激活启动类
new Sprite3DParent;