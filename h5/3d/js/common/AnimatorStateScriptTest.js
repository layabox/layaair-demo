//继承自AnimatorStateScript(动画状态脚本)
class AnimatorStateScriptTest extends Laya.AnimatorStateScript{
	
	constructor(){
		super();
	}

		
	/**
	 * 动画状态开始时执行。
	 */
	onStateEnter() {
		console.log("动画开始播放了");
	}
		
	/**
	 * 动画状态更新时执行。
	 */
    onStateUpdate() {
		console.log("动画状态更新了");
	}
		
	/**
	 * 动画状态退出时执行。
	 */
	onStateExit() {
		console.log("动画退出了");
	}
}