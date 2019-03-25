import CameraMoveScript from "./common/CameraMoveScript"
class AnimatorStateScriptDemo 
{	
	private scene:Laya.Scene3D; 
	private animator:Laya.Animator;
	private changeActionButton:Laya.Button;
	private changeActionButton2:Laya.Button;
	private PlayStopIndex = 0;
	private curStateIndex = 0;
	private text:Laya.Text = new Laya.Text();
	private textName:Laya.Text = new Laya.Text();
	private curActionName:string = null;
	
	constructor()
	{
		//初始化引擎
		Laya3D.init(0, 0);
		
		//适配模式
		Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
		Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
		
		//开启统计信息
		Laya.Stat.show();
		
		//预加载所有资源
		var resource = [
			{url: "res/threeDimen/skinModel/BoneLinkScene/R_kl_H_001.lh", type: Laya3D.HIERARCHY, priority: 1}, 
			{url: "res/threeDimen/skinModel/BoneLinkScene/R_kl_S_009.lh", type: Laya3D.HIERARCHY, priority: 1}, 
			{url: "res/threeDimen/skinModel/BoneLinkScene/PangZi.lh", type: Laya3D.HIERARCHY, priority: 1}
		];
		
		Laya.loader.create(resource, Laya.Handler.create(this, this.onLoadFinish));
	}
	
	private onLoadFinish()
	{
		//初始化场景
		this.scene = new Laya.Scene3D();
		Laya.stage.addChild(this.scene);
		this.scene.ambientColor = new Laya.Vector3(0.5, 0.5, 0.5);
		
		//初始化相机
		var camera = new Laya.Camera(0, 0.1, 100);
		this.scene.addChild(camera);
		camera.transform.translate(new Laya.Vector3(0, 3, 5));
		camera.transform.rotate(new Laya.Vector3( -15, 0, 0), true, false);
		camera.addComponent(CameraMoveScript);
		
		var directionLight = new Laya.DirectionLight();
		this.scene.addChild(directionLight);
		directionLight.transform.worldMatrix.setForward(new Laya.Vector3(-1.0, -1.0, -1.0));
		
		//初始化角色精灵
		var role = new Laya.Sprite3D();
		this.scene.addChild(role);
		
		//初始化胖子
		var pangzi = role.addChild(Laya.Loader.getRes("res/threeDimen/skinModel/BoneLinkScene/PangZi.lh")) as Laya.Sprite3D;
		//获取动画组件
		this.animator = pangzi.getChildAt(0).getComponent(Laya.Animator) as Laya.Animator;
		debugger;
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
		//为动画状态添加动画状态脚本
		var asst1 = state1.addScript(AnimatorStateScriptTest) as AnimatorStateScriptTest;
		asst1.text = this.text;
		//为动画组件添加一个动作状态
		this.animator.addState(state1);
		
		var state2 = new Laya.AnimatorState();
		state2.name = "ride";
		state2.clipStart = 0 / 581;
		state2.clipEnd = 33 / 581;
		state2.clip = this.animator.getDefaultState().clip;
		state2.clip.islooping = true;
		var asst2 = state2.addScript(AnimatorStateScriptTest) as AnimatorStateScriptTest;
		asst2.text = this.text;
		this.animator.addState(state2);
		this.animator.speed = 0.0;
		
		var state3 = new Laya.AnimatorState();
		state3.name = "动作状态三";
		state3.clipStart = 34 / 581;
		state3.clipEnd = 100 / 581;
		state3.clip = this.animator.getDefaultState().clip;
		state3.clip.islooping = true;
		var asst3 = state3.addScript(AnimatorStateScriptTest) as AnimatorStateScriptTest;
		asst3.text = this.text;
		this.animator.addState(state3);
		this.animator.speed = 0.0;

		this.loadUI();
				
		this.textName.overflow = Laya.Text.HIDDEN;
		this.textName.color = "#FFFFFF";
		this.textName.font = "Impact";
		this.textName.fontSize = 20;
		this.textName.borderColor = "#FFFF00";
		this.textName.x = Laya.stage.width / 2;
		this.textName.text = "当前动作状态名称：";
		Laya.stage.addChild(this.textName);
		
		this.text.overflow = Laya.Text.HIDDEN;
		this.text.color = "#FFFFFF";
		this.text.font = "Impact";
		this.text.fontSize = 20;
		this.text.borderColor = "#FFFF00";
		this.text.x = Laya.stage.width / 2;
		this.text.text = "当前动作状态进度：";
		Laya.stage.addChild(this.text);
		this.textName.x = Laya.stage.width / 2 -50 ;
		this.text.x = Laya.stage.width / 2 -50 ;
		this.text.y = 50;
		
		
	}
	
	private loadUI() {
		
		Laya.loader.load(["res/threeDimen/ui/button.png"], Laya.Handler.create(this, function() {		
			this.changeActionButton = new Laya.Button("res/threeDimen/ui/button.png", "切换动作状态");
			Laya.stage.addChild(this.changeActionButton);
			this.changeActionButton.size(200, 40);
			this.changeActionButton.labelBold = true;
			this.changeActionButton.labelSize = 30;
			this.changeActionButton.sizeGrid = "4,4,4,4";
			this.changeActionButton.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
			this.changeActionButton.pos(Laya.stage.width / 2 - this.changeActionButton.width * Laya.Browser.pixelRatio / 2, Laya.stage.height - 100 * Laya.Browser.pixelRatio);
			
			this.changeActionButton.on(Laya.Event.CLICK, this, function(){
				
				this.curStateIndex++;
				if (this.curStateIndex % 3 == 0){
					this.animator.speed = 0.0;
					this.animator.play("hello");
					this.curActionName = "hello";
					this.textName.text = "当前动作状态名称:" + "hello";
					this.animator.speed = 1.0;
				}
				else if (this.curStateIndex % 3 == 1){
					this.animator.speed = 0.0;
					this.animator.play("ride");
					this.curActionName = "ride";
					this.textName.text = "当前动作状态名称:" + "ride";
					this.animator.speed = 1.0;
				}
				else if (this.curStateIndex % 3 == 2){
					this.animator.speed = 0.0;
					this.animator.play("动作状态三");
					this.curActionName = "动作状态三";
					this.textName.text = "当前动作状态名称:" + "动作状态三";
					this.animator.speed = 1.0;
				}

			});

		}));
	}
}

//继承自AnimatorStateScript(动画状态脚本)
class AnimatorStateScriptTest extends Laya.AnimatorStateScript{
	private _text:Laya.Text = null;
	public get text():Laya.Text {
		return this._text;
	}
	public set text(value:Laya.Text) {
		this._text = value;
	}
	constructor(){
		super();
	}

		
	/**
	 * 动画状态开始时执行。
	 */
	public onStateEnter():void {
		console.log("动画开始播放了");
		this._text.text = "动画状态：动画开始播放";
	}
		
	/**
	 * 动画状态更新时执行。
	 */
	public onStateUpdate():void {
		console.log("动画状态更新了");
		this._text.text = "动画状态：动画更新中";
	}
		
	/**
	 * 动画状态退出时执行。
	 */
	public onStateExit():void {
		console.log("动画退出了");
		this._text.text = "动画状态：动画开始退出";
	}
}

new AnimatorStateScriptDemo;