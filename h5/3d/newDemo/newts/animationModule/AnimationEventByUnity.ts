
class AnimationEventByUnity 
{
	
	constructor() 
	{
		//初始化引擎
		Laya3D.init(0, 0);
		Laya.Stat.show();
		Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
		Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
		
		//加载场景
		Laya.Scene3D.load("res/threeDimen/scene/LayaScene_AnimationEvent/Conventional/layaScene.ls", Laya.Handler.create(this, function(scene:Laya.Scene3D):void {
			Laya.stage.addChild(scene) as Laya.Scene3D;
			var cube:Laya.Sprite3D = scene.getChildByName("Cube") as Laya.Sprite3D;
			//添加组件(脚本)
			cube.addComponent(SceneScript);	
		}));
	
	}

}	

new AnimationEventByUnity;

class SceneScript extends Laya.Script3D{
	constructor() {
		super();
	}

	//对应unity添加的AnimationEvent的动画事件函数，名字是可以对应上的
	public ShowMsg():void{
		console.log("TTTTTTT");
	}
}
