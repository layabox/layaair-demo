class ScriptDemo {
	constructor() {
		//初始化引擎
		Laya3D.init(0, 0);
		//适配模式
		Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
		Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
		//开启统计信息
		Laya.Stat.show();
		//添加3D场景
        var scene = Laya.stage.addChild(new Laya.Scene3D());
        
        //初始化变量
        this.translate = new Laya.Vector3(0, 3, 3);
        this.rotation = new Laya.Vector3(-30, 0, 0);
        this.rotation2 = new Laya.Vector3(0, 45, 0);
        this.forward = new Laya.Vector3(1, -1, 0);

		//添加照相机
		var camera = (scene.addChild(new Laya.Camera(0, 0.1, 100)));
		//移动摄影机位置
		camera.transform.translate(this.translate);
		//旋转摄影机方向
		camera.transform.rotate(this.rotation, true, false);
		//设置背景颜色
		camera.clearColor = null;
		//添加方向光
		var directionLight = scene.addChild(new Laya.DirectionLight());
		//设置灯光漫反射颜色
		var lightColor = directionLight.color;
		lightColor.setValue(0.6, 0.6, 0.6);
		//设置灯光的方向（弧度）
		var mat = directionLight.transform.worldMatrix;
		mat.setForward(this.forward);
		directionLight.transform.worldMatrix = mat;
		//添加自定义模型
		var box = scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1, 1, 1), "MOs"));
		//设置模型的旋转
		box.transform.rotate(this.rotation2, false, false);
		//创建材质
		var material = new Laya.PBRSpecularMaterial();
		//加载模型的材质贴图
		Laya.Texture2D.load("res/threeDimen/layabox.png", Laya.Handler.create(this, function(text) {
			material.albedoTexture = text;
			//给模型添加材质
			box.meshRenderer.material = material;
			//给box添加自定义脚本组件
			box.addComponent(BoxControlScript);
		}));
		//4秒后删除自定义组件
		Laya.timer.once(4000, this, this.onLoop, [box]);
	}
	
	onLoop(box) {
		console.log("移除组件");
		// 获取到组件
		var boxContro = box.getComponent(BoxControlScript);
		// 移除组件
		boxContro.destroy();
		//如不想移除组件，可设置为不启用能达到同样效果（组件_update方法将不会被更新）
		//boxContro.enabled = false;
	}
}

new ScriptDemo();


class BoxControlScript extends Laya.Script3D {
	constructor() {
        super();
        this._box = null;
        this._albedoColor = new Laya.Vector4(1, 0, 0, 1);
        this.rotation = new Laya.Vector3(0, 0.5, 0);
	}
	
	/**
	 * 覆写3D对象组件被激活后执行，此时所有节点和组件均已创建完毕，此方法只执行一次
	 */
	onAwake() {
		//得到3D对象
		this._box = this.owner;
	}
	
    onStart() {
		//得到3D对象的材质
		var material = this._box.meshRenderer.material;
		//更改3D对象的材质反射率 （偏红）
		material.albedoColor = this._albedoColor;
	}
	
	/**
	 * 覆写组件更新方法（相当于帧循环）
	 */
	onUpdate() {
		//所属脚本对象旋转更新
		this._box.transform.rotate(this.rotation, false, false)
	}
	
	onDisable() {
		console.log("组件设置为不可用");
	}
}