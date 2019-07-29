//继承自AnimatorStateScript(动画状态脚本)
class CustomAnimatorStateScript extends Laya.AnimatorStateScript{
	
	constructor(){
        super();
        this.text = null;
	}

		
	/**
	 * 动画状态开始时执行。
	 */
	onStateEnter() {
        console.log("动画开始播放了");
        this.text.text = "动画状态：动画开始播放";
	}
		
	/**
	 * 动画状态更新时执行。
	 */
    onStateUpdate() {
        console.log("动画状态更新了");
        this.text.text = "动画状态：动画更新中";
	}
		
	/**
	 * 动画状态退出时执行。
	 */
	onStateExit() {
        console.log("动画退出了");
        this.text.text = "动画状态：动画开始退出";
	}
}