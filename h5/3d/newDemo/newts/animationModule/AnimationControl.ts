class AnimationControl{
    constructor(){
        Laya3D.init(0, 0);
	    Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
		Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
			
		//预加载所有资源
		var resource = [{url: "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", type: Laya3D.HIERARCHY, priority: 1}];
		Laya.loader.create(resource, Laya.Handler.create(this, this.onComplete));
    }

    onComplete(){
        //加载场景
			var scene = Laya.stage.addChild(new Laya.Scene3D());
			
			//加载相机
			var camera:Laya.Camera = scene.addChild(new Laya.Camera(0, 0.1, 100)) as Laya.Camera;
			camera.transform.translate(new Laya.Vector3(0, 0.8, 1.5));
			camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
			
			//添加平行光
			var directionLight:Laya.DirectionLight = new Laya.DirectionLight();
			scene.addChild(directionLight);
			directionLight.color = new Laya.Vector3(0.6, 0.6, 0.6);
			
			//获取精灵
			var monkey = Laya.Loader.getRes("res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh");
			scene.addChild(monkey);
			
			//获取角色动画组件
			var ani = monkey.getChildAt(0).getComponent(Laya.Animator);
			//创建一个动画动作状态
			var state1 = new Laya.AnimatorState();
			//设置动作状态的名称
			state1.name = "hello";
			//设置动作状态播放的起始时间（起始时间与结束时间的设置为0-1的百分比数值）  要截取的时间点 / 动画的总时长
			state1.clipStart = 10/40;
			//设置动作状态播放的结束时间
			state1.clipEnd = 20/40;
			//得到默认动画赋值给Clip（getDefaultState默认动画为Unity中animation的数组顺序0下标的动画）
			state1.clip = ani.getDefaultState().clip;
			//动画播放是否循环
			state1.clip.islooping = true;
			//添加动画状态到动画组件里
			ani.addState(state1);
			//播放动画
			ani.play("hello");
    }
}
//激活启动类
new AnimationControl();