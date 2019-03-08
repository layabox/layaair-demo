class PlayAndPauseAnimation{
    constructor(){
        Laya.alertGlobalError = true;
        //初始化引擎
			Laya3D.init(0, 0);
			
			//适配模式
			Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
			Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
			
			//开启统计信息
            Laya.Stat.show();
            //创建场景
            this.scene = null;
            this.role = null;
            this.pangzi = null;
            this.animator = null;
            this.changeActionButton = null;
            this.curStateIndex = 0;

            this.text = new Laya.Text();
            this.text.overflow = Laya.Text.HIDDEN;
            this.text.color = "#FFFFFF";
            this.text.font = "Impact";
            this.text.fontSize = 20;
            this.text.borderColor = "#FFFF00";
            this.text.x = Laya.stage.width / 2;
			
			Laya.stage.addChild(this.text);
            this.text.text = "当前运动状态：";
			
			//预加载所有资源
			var resource = [
				{url: "res/threeDimen/skinModel/BoneLinkScene/R_kl_H_001.lh", type: Laya3D.HIERARCHY, priority: 1}, 
				{url: "res/threeDimen/skinModel/BoneLinkScene/R_kl_S_009.lh", type: Laya3D.HIERARCHY, priority: 1}, 
				{url: "res/threeDimen/skinModel/BoneLinkScene/PangZi.lh", type: Laya3D.HIERARCHY, priority: 1}
			];
			
			Laya.loader.create(resource, Laya.Handler.create(this, this.onLoadFinish));
    }
    onLoadFinish(){
        //初始化场景
        this.scene = Laya.stage.addChild(new Laya.Scene3D());
		this.scene.ambientColor = new Laya.Vector3(0.5, 0.5, 0.5);
			
		//初始化相机
		var camera = this.scene.addChild(new Laya.Camera(0, 0.1, 100));
		camera.transform.translate(new Laya.Vector3(0, 3, 5));
		camera.transform.rotate(new Laya.Vector3( -15, 0, 0), true, false);
		camera.addComponent(CameraMoveScript);
			
		var directionLight = this.scene.addChild(new Laya.DirectionLight());
		directionLight.transform.worldMatrix.setForward(new Laya.Vector3(-1.0, -1.0, -1.0));
			
		//初始化角色精灵
		this.role = this.scene.addChild(new Laya.Sprite3D());
			
		//初始化胖子
		this.pangzi = this.role.addChild(Laya.Loader.getRes("res/threeDimen/skinModel/BoneLinkScene/PangZi.lh"));
		//获取动画组件
		this.animator = this.pangzi.getChildAt(0).getComponent(Laya.Animator);
		//创建动作状态
		var state1 = new Laya.AnimatorState();
		//动作名称
		state1.name = "hello";
		//动作播放起始时间
		state1.clipStart = 296 / 581;
		//动作播放结束时间
		state1.clipEnd = 346 / 581;
		//设置动作
		state1.clip = this.animator.getDefaultState().clip;
		//循环模式
		state1.clip.islooping = true;
		//为动画组件添加一个动作状态
		this.animator.addState(state1);
			
		var state2 = new Laya.AnimatorState();
		state2.name = "ride";
		state2.clipStart = 3 / 581;
		state2.clipEnd = 33 / 581;
		state2.clip = this.animator.getDefaultState().clip;
		state2.clip.islooping = true;
		this.animator.addState(state2);
		this.animator.speed = 0.0;
		this.loadUI();
		this.text.x = Laya.stage.width / 2 -50 ;
			
		Laya.timer.frameLoop(1, this, this.onFrame);    
    }
    loadUI(){
        Laya.loader.load(["res/threeDimen/ui/button.png"], Laya.Handler.create(this, function() {	
            this.changeActionButton = Laya.stage.addChild(new Laya.Button("res/threeDimen/ui/button.png", "播放动画"));
            this.changeActionButton.size(160, 40);
            this.changeActionButton.labelBold = true;
            this.changeActionButton.labelSize = 30;
            this.changeActionButton.sizeGrid = "4,4,4,4";
            this.changeActionButton.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
            this.changeActionButton.pos(Laya.stage.width / 2 - this.changeActionButton.width * Laya.Browser.pixelRatio / 2 , Laya.stage.height - 100 * Laya.Browser.pixelRatio);
            
            this.changeActionButton.on(Laya.Event.CLICK, this, function(){
                
                this.curStateIndex++;
                if (this.curStateIndex % 2 == 0){
                    this.changeActionButton.label = "播放动画";
                    //暂停动画
                    this.animator.speed = 0.0;
                }
                else if (this.curStateIndex % 2 == 1){
                    this.changeActionButton.label = "暂停动画";
                    //播放动画
                    this.animator.play();
                    this.animator.speed = 1.0;
                }
            });

        }));
    }

    onFrame(){
        if (this.animator.speed > 0.0){
            //获取播放状态的归一化时间
            var curNormalizedTime = this.animator.getCurrentAnimatorPlayState(0).normalizedTime;
            this.text.text = "当前运动进度：" + curNormalizedTime;
        }
    }
        
}
//激活启动类
new PlayAndPauseAnimation();