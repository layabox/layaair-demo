class MultiTouch{
	constructor(){
		//初始化引擎
		Laya3D.init(0, 0);
		Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
		Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
	
		this.upVector3 = new Laya.Vector3(0, 1, 0);
		//预加载所有资源
		let resource = ["res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh"];
		Laya.loader.create(resource, Laya.Handler.create(this, this.onComplete));
	}

	onComplete(){
		//创建场景
		let scene = Laya.stage.addChild(new Laya.Scene3D());
		//创建相机
		let camera = scene.addChild(new Laya.Camera(0, 0.1, 100));
		//设置相机的名称
		camera.name = "camera";
		//相机平移位置
		camera.transform.translate(new Laya.Vector3(0, 0.8, 1.5));
		//旋转相机
		camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
			
		//创建平行光
		let directionLight = scene.addChild(new Laya.DirectionLight());
		//设置平行光颜色
		directionLight.color = new Laya.Vector3(0.6, 0.6, 0.6);
			
		//加载小猴子精灵
		let monkey = Laya.Loader.getRes("res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh");
		//猴子精灵添加组件（脚本）
		monkey.addComponent(MonkeyScript);
		scene.addChild(monkey);
		//设置相机的观察目标为小猴子
		camera.transform.lookAt(monkey.transform.position, new Laya.Vector3(0, 1, 0));
			
		//显示文本显示框
		this.text = new Laya.Text();
		this.text.y = 50;
		this.text.name = "ceshi";
		this.text.x = Laya.stage.width / 2 -100 ;
		this.text.text = "触控点归零";
		//显示文本显示框
		this.text.overflow = Laya.Text.HIDDEN;
		this.text.color = "#FFFFFF";
		this.text.font = "Impact";
		this.text.fontSize = 20;
		this.text.borderColor = "#FFFF00";
		Laya.stage.addChild(this.text);

		//设置操作提示框
		this.infoText = new Laya.Text();
		this.infoText.x = Laya.stage.width / 2 - 100;
		this.infoText.text = "单指旋转，双指缩放";
		this.infoText.overflow = Laya.Text.HIDDEN;
		this.infoText.color = "#FFFFFF";
		this.infoText.font = "Impact";
		this.infoText.fontSize = 20;
		this.infoText.borderColor = "#FFFF00";
		Laya.stage.addChild(this.infoText);
}

}
//激活启动类
new MultiTouch();
class MonkeyScript extends Laya.Script3D{
	constructor(){
		super();
		this.scene = null;
		this.text = null;
		this.camera = null;
		this.lastPosition = new Laya.Vector2(0, 0);
		this.distance = 0.0;
		this.disVector1 = new Laya.Vector2(0, 0);
		this.disVector2 = new Laya.Vector2(0, 0);
		this.isTwoTouch = false;
		this.first = true;
		this.twoFirst = true;
		this.rotate = new Laya.Vector3(0,0,0);
		this.translate = new Laya.Vector3(0,0,0);
		this.sprite3DSacle = new Laya.Vector3(0,0,0);
	}
	onStart(){
		this.scene =  this.owner.parent;
		this.text = this.scene.parent.getChildByName("ceshi");
		this.camera = this.scene.getChildByName("camera");
	}
	onUpdate(){
		let touchCount = this.scene.input.touchCount();
		if (1 === touchCount){
			//判断是否为两指触控，撤去一根手指后引发的touchCount===1
			if(this.isTwoTouch){
				return;
			}
			this.text.text = "触控点为1";
			//获取当前的触控点，数量为1
			let touch = this.scene.input.getTouch(0);
			//是否为新一次触碰，并未发生移动
			if (this.first){
				//获取触碰点的位置
				this.lastPosition.x = touch._position.x;
				this.lastPosition.y = touch._position.y;
				this.first = false;
			}
			else{
				//移动触碰点
				let deltaY = touch._position.y - this.lastPosition.y;
				let deltaX = touch._position.x - this.lastPosition.x;
				this.lastPosition.x = touch._position.x;
				this.lastPosition.y = touch._position.y;
				//根据移动的距离进行旋转
				this.rotate.setValue(1 * deltaY /2, 1 * deltaX / 2, 0);
				this.owner.transform.rotate(this.rotate, true, false);
			}
		}
		else if (2 === touchCount){
			this.text.text = "触控点为2";
			this.isTwoTouch = true;
			//获取两个触碰点
			let touch = this.scene.input.getTouch(0);
			let touch2 = this.scene.input.getTouch(1);
			//是否为新一次触碰，并未发生移动
			if (this.twoFirst){
				//获取触碰点的位置
				this.disVector1.x = touch.position.x - touch2.position.x;
				this.disVector1.y = touch.position.y - touch2.position.y;
				this.distance = Laya.Vector2.scalarLength(this.disVector1);
				this.sprite3DSacle = this.owner.transform.scale;
				this.twoFirst = false;
			}
			else{
				this.disVector2.x = touch.position.x - touch2.position.x;
				this.disVector2.y = touch.position.y - touch2.position.y;
				let distance2 = Laya.Vector2.scalarLength(this.disVector2);
				//根据移动的距离进行缩放
				let factor =  0.001 * (distance2 - this.distance);
				this.sprite3DSacle.x += factor;
				this.sprite3DSacle.y += factor;
				this.sprite3DSacle.z += factor;
				this.owner.transform.scale = this.sprite3DSacle;
				this.distance = distance2;
			}	
		}
		else if (0 === touchCount){
			this.text.text = "触控点归零";
			this.first = true;
			this.twoFirst = true;
			this.lastPosition.x = 0;
			this.lastPosition.y = 0;
			this.isTwoTouch = false;
		}
	}
 	onLateUpdate() {
	}
}