class ScriptDemo {
	private _translate = new Laya.Vector3(0, 3, 3);
	private _rotation = new Laya.Vector3(-30, 0, 0);
	private _rotation2 = new Laya.Vector3(0, 45, 0);
	private _forward = new Laya.Vector3(1, -1, 0);
	
	constructor() {
		//初始化引擎
		Laya3D.init(0, 0);
		//适配模式
		Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
		Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
		//开启统计信息
		Laya.Stat.show();
		//添加3D场景
		var scene = Laya.stage.addChild(new Laya.Scene3D()) as Laya.Scene3D;
		//添加照相机
		var camera = (scene.addChild(new Laya.Camera(0, 0.1, 100))) as Laya.Camera;
		//移动摄影机位置
		camera.transform.translate(this._translate);
		//旋转摄影机方向
		camera.transform.rotate(this._rotation, true, false);
		//设置背景颜色
		camera.clearColor = null;
		//添加方向光
		var directionLight = scene.addChild(new Laya.DirectionLight()) as Laya.DirectionLight;
		//设置灯光漫反射颜色
		var lightColor = directionLight.color;
		lightColor.setValue(0.6, 0.6, 0.6);
		//设置灯光的方向（弧度）
		var mat = directionLight.transform.worldMatrix;
		mat.setForward(this._forward);
		directionLight.transform.worldMatrix = mat;
		//添加自定义模型
		var box = scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1, 1, 1), "MOs")) as Laya.MeshSprite3D;
		//设置模型的旋转
		box.transform.rotate(this._rotation2, false, false);
		//创建材质
		var material = new Laya.PBRSpecularMaterial();
		//加载模型的材质贴图
		Laya.Texture2D.load("res/threeDimen/layabox.png", Laya.Handler.create(this, function(text:Laya.Texture2D):void {
			material.albedoTexture = text;
			//给模型添加材质
			box.meshRenderer.material = material;
			//给box添加自定义脚本组件
			box.addComponent(BoxControlScript);
		}));
		//4秒后删除自定义组件
		Laya.timer.once(4000, this, this.onLoop, [box]);
	}
	
	private onLoop(box:Laya.MeshSprite3D):void {
		console.log("移除组件");
		// 获取到组件
		var boxContro = box.getComponent(BoxControlScript);
		// 移除组件
		boxContro.destroy();
		//如不想移除组件，可设置为不启用能达到同样效果（组件_update方法将不会被更新）
		//boxContro.enabled = false;
	}
}

new ScriptDemo;


class BoxControlScript extends Laya.Script3D {
	private box:Laya.MeshSprite3D;
	private _albedoColor = new Laya.Vector4(1, 0, 0, 1);
	private _rotation = new Laya.Vector3(0, 0.5, 0);
	
	constructor() {
		super();
	}
	
	/**
	 * 覆写3D对象组件被激活后执行，此时所有节点和组件均已创建完毕，此方法只执行一次
	 */
	public onAwake():void {
		//得到3D对象
		this.box = this.owner as  Laya.MeshSprite3D;
	}
	
	public onStart():void {
		//得到3D对象的材质
		var material = this.box.meshRenderer.material as Laya.PBRSpecularMaterial;
		//更改3D对象的材质反射率 （偏红）
		material.albedoColor = this._albedoColor;
	}
	
	/**
	 * 覆写组件更新方法（相当于帧循环）
	 */
	public onUpdate():void {
		//所属脚本对象旋转更新
		this.box.transform.rotate(this._rotation, false, false)
	}
	
	public onDisable() {
		console.log("组件设置为不可用");
	}
}