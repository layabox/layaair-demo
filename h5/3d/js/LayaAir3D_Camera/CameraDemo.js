class CameraDemo 
	{
		constructor() 
		{
			//初始化引擎
            Laya3D.init(1000, 500);            
            //适配模式
            Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
            Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
            //开启统计信息
            Laya.Stat.show();    
            //初始化变量
            this.camera = null;
			this.index = 0;    
			this.index2 = 0;    
			//预加载所有资源
			let resource = [  
				"res/threeDimen/texture/layabox.png",
				"res/threeDimen/skyBox/skyBox2/skyBox2.lmat"];
			Laya.loader.create(resource, Laya.Handler.create(this, this.onPreLoadFinish));	
		}
		
		onPreLoadFinish()
        {
			//创建场景
			let scene = new Laya.Scene3D();
			Laya.stage.addChild(scene);
			
			//创建相机，构造函数的三个参数为相机横纵比，近距裁剪，远距裁剪
			this.camera = new Laya.Camera(0, 0.1, 100);
			this.camera.transform.translate(new Laya.Vector3(0, 0.7, 5));
			this.camera.transform.rotate(new Laya.Vector3( -15, 0, 0), true, false);
			
			//相机设置清楚标记,使用固定颜色
			this.camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SOLIDCOLOR;
			//使用默认的颜色
			//this.camera.clearColor = new Laya.Vector4(0, 0.2, 0.6, 1);
			//设置摄像机视野范围（角度）
			this.camera.fieldOfView = 60;
			//为相机添加视角控制组件(脚本)
			this.camera.addComponent(CameraMoveScript);
			scene.addChild(this.camera);
			
			//添加平行光
			let directionLight = new Laya.DirectionLight();
			scene.addChild(directionLight);
			//设置平行光颜色
            directionLight.color = new Laya.Vector3(1, 1, 1);
            directionLight.transform.rotate(new Laya.Vector3( -3.14 / 3, 0, 0));
			
			let sprite = new Laya.Sprite3D();
			scene.addChild(sprite);
			
			//正方体
			let box = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(0.5, 0.5, 0.5));
			sprite.addChild(box);
			box.transform.position = new Laya.Vector3(0.0, 0.0, 2);
			box.transform.rotate(new Laya.Vector3(0, 45, 0), false, false);
			
			//创建linnPhong材质
			let materialBill = new Laya.BlinnPhongMaterial();
			box.meshRenderer.material = materialBill;
			//为材质加载纹理
			let tex = Laya.Loader.getRes("res/threeDimen/texture/layabox.png");
			//设置反照率贴图
			materialBill.albedoTexture = tex;
			
			this.loadUI();
	
        }
		loadUI() {
			
			Laya.loader.load(["res/threeDimen/ui/button.png"], Laya.Handler.create(this, function() {
				
				let changeActionButton = new Laya.Button("res/threeDimen/ui/button.png", "正透切换");
				Laya.stage.addChild(changeActionButton);
				changeActionButton.size(160, 40);
				changeActionButton.labelBold = true;
				changeActionButton.labelSize = 30;
				changeActionButton.sizeGrid = "4,4,4,4";
				changeActionButton.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
				changeActionButton.pos(Laya.stage.width / 2 - changeActionButton.width * Laya.Browser.pixelRatio / 2   - 100, Laya.stage.height - 100 * Laya.Browser.pixelRatio);
				
				changeActionButton.on(Laya.Event.CLICK, this, function(){
					this.index++;
					if (this.index % 2 === 1 ){
						//正交投影属性设置
						this.camera.orthographic = true;
						//正交垂直矩阵距离,控制3D物体远近与显示大小
						this.camera.orthographicVerticalSize = 7;
					}
					else{
						//正交投影属性设置,关闭
						this.camera.orthographic = false;
					}
				});
				
				let changeActionButton2 = new Laya.Button("res/threeDimen/ui/button.png", "切换背景");
				Laya.stage.addChild(changeActionButton2);
				changeActionButton2.size(160, 40);
				changeActionButton2.labelBold = true;
				changeActionButton2.labelSize = 30;
				changeActionButton2.sizeGrid = "4,4,4,4";
				changeActionButton2.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
				changeActionButton2.pos(Laya.stage.width / 2 - changeActionButton2.width * Laya.Browser.pixelRatio / 2 + 100, Laya.stage.height - 100 * Laya.Browser.pixelRatio);
				
				changeActionButton2.on(Laya.Event.CLICK, this, function(){
					this.index2++;
					if (this.index2 % 2 === 1 ){
						//设置相机的清除标识为天空盒
						this.camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;
						//使用加载天空盒材质
						let skyboxMaterial = Laya.Loader.getRes("res/threeDimen/skyBox/skyBox2/skyBox2.lmat");
						//获取相机的天空渲染器
						let skyRenderer = this.camera.skyRenderer;
						//设置相机的天空渲染器的mesh
						skyRenderer.mesh = Laya.SkyBox.instance;
						//设置相机的天空渲染器的material
						skyRenderer.material = skyboxMaterial;
					}
					else{
						//设置相机的清除标识为为固定颜色
						this.camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SOLIDCOLOR;
					}
				});
				
			}));
		}
		
	}

	new CameraDemo();
