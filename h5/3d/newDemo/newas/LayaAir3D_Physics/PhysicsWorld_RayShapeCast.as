package LayaAir3D_Physics {
	import common.CameraMoveScript;
	import laya.d3.core.Camera;
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.light.DirectionLight;
	import laya.d3.core.material.BlinnPhongMaterial;
	import laya.d3.core.pixelLine.PixelLineSprite3D;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Color;
	import laya.d3.math.Ray;
	import laya.d3.math.Vector3;
	import laya.d3.math.Vector4;
	import laya.d3.physics.HitResult;
	import laya.d3.physics.PhysicsCollider;
	import laya.d3.physics.Rigidbody3D;
	import laya.d3.physics.shape.BoxColliderShape;
	import laya.d3.physics.shape.CapsuleColliderShape;
	import laya.d3.physics.shape.SphereColliderShape;
	import laya.d3.resource.models.PrimitiveMesh;
	import laya.display.Stage;
	import laya.events.Event;
	import laya.ui.Button;
	import laya.utils.Browser;
	import laya.utils.Handler;
	import laya.utils.Stat;
	import laya.webgl.resource.Texture2D;
	
	public class PhysicsWorld_RayShapeCast {
		//声明一些使用到的全局变量
		private var castType:int = 0;
		private var castAll:Boolean = false;
		private var ray:Ray = new Ray(new Vector3(0, 0, 0), new Vector3(0, 0, 0));
		private var scene:Scene3D;
		private var hitResult:HitResult = new HitResult();
		private var hitResults:Vector.<HitResult> = new Vector.<HitResult>();
		private var debugSprites:Vector.<Sprite3D> = new Vector.<Sprite3D>();
		//创建射线的起始点
		private var from:Vector3 = new Vector3(0, 1, 10);
		private	var to:Vector3 = new Vector3(0, 1, -5);
		private var _albedoColor:Vector4 = new Vector4(1.0, 1.0, 1.0, 0.5);
		private var _position:Vector3 = new Vector3(0, 0, 0);
		
		public function PhysicsWorld_RayShapeCast() {
			//初始化引擎
			Laya3D.init(0, 0);
			//设置舞台
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			//显示性能面板
			Stat.show();
			var test:Boolean = Laya3D._enbalePhysics;
			//创建场景
			scene = Laya.stage.addChild(new Scene3D()) as Scene3D;
			
			//创建相机
			var camera:Camera = scene.addChild(new Camera(0, 0.1, 100)) as Camera;
			camera.transform.translate(new Vector3(0, 8, 20));
			camera.transform.rotate(new Vector3( -30, 0, 0), true, false);
			//为相机添加视角控制组件(脚本)
			camera.addComponent(CameraMoveScript);
			
			//添加平行光
			var directionLight:DirectionLight = scene.addChild(new DirectionLight()) as DirectionLight;
			directionLight.color = new Vector3(1, 1, 1);
			//设置平行光的方向
			var mat = directionLight.transform.worldMatrix;
			mat.setForward(new Vector3(-1.0, -1.0, 1.0));
			directionLight.transform.worldMatrix=mat;
			
			//添加地面
			var plane:MeshSprite3D = scene.addChild(new MeshSprite3D(PrimitiveMesh.createPlane(20, 20, 10, 10))) as MeshSprite3D;
			var planeMat:BlinnPhongMaterial = new BlinnPhongMaterial();
			//加载纹理
			Texture2D.load("res/threeDimen/Physics/wood.jpg", Handler.create(null, function(tex:Texture2D):void {
				planeMat.albedoTexture = tex;
			}));
			//设置材质
			var tilingOffset:Vector4 = planeMat.tilingOffset;
			tilingOffset.setValue(2, 2, 0, 0);
			planeMat.tilingOffset = tilingOffset;
			plane.meshRenderer.material = planeMat;
			
			//为地面创建物理碰撞器
			var planeBody:PhysicsCollider = plane.addComponent(PhysicsCollider) as PhysicsCollider;
			//创建盒型碰撞器
			var boxCollider:BoxColliderShape = new BoxColliderShape(20, 0, 20);
			//设置地面的碰撞器的形状为盒型
			planeBody.colliderShape = boxCollider;
			
			for (var i:int = 0; i < 60; i++) {
				addBox();
				addCapsule();
			}
			
			//创建按钮，以及绑定事件
			addButton(200, 200, 160, 40, "射线模式", function(e:Event):void {
				castType++;
				castType %= 4;
				switch (castType) {
				case 0: 
					(e.target as Button).label = "射线模式";
					break;
				case 1: 
					(e.target as Button).label = "盒子模式";
					break;
				case 2: 
					(e.target as Button).label = "球模式";
					break;
				case 3: 
					(e.target as Button).label = "胶囊模式";
					break;
				}
			});
			
			addButton(200, 300, 160, 40, "不穿透", function(e:Event):void {
				if (castAll) {
					(e.target as Button).label = "不穿透";
					castAll = false;
				} else {
					(e.target as Button).label = "穿透";
					castAll = true;
				}
			});
			
			addButton(200, 400, 160, 40, "检测", function(e:Event):void {
				if (hitResult.succeeded)
					((hitResult.collider.owner as MeshSprite3D).meshRenderer.sharedMaterial as BlinnPhongMaterial).albedoColor = new Vector4(1.0, 1.0, 1.0, 1.0);
				
				if (hitResults.length > 0) {
					for (var i:int = 0, n:int = hitResults.length; i < n; i++)
						((hitResults[i].collider.owner as MeshSprite3D).meshRenderer.sharedMaterial as BlinnPhongMaterial).albedoColor = new Vector4(1.0, 1.0, 1.0, 1.0);
					hitResults.length = 0;
				}
				
				if (debugSprites.length > 0) {
					for (i = 0, n = debugSprites.length; i < n; i++)
						debugSprites[i].destroy();
					debugSprites.length = 0;
				}
				
				
				switch (castType) {
				case 0: 
					//创建线性射线
					var lineSprite:PixelLineSprite3D = scene.addChild(new PixelLineSprite3D(1)) as PixelLineSprite3D;
					//设置射线的起始点和颜色
					lineSprite.addLine(from, to, Color.RED, Color.RED);
					debugSprites.push(lineSprite);
					if (castAll) {
						//进行射线检测,检测所有碰撞的物体
						scene.physicsSimulation.raycastAllFromTo(from, to, hitResults);
						//遍历射线检测的结果
						for (i = 0, n = hitResults.length; i < n; i++)
							//将射线碰撞到的物体设置为红色
							((hitResults[i].collider.owner as MeshSprite3D).meshRenderer.sharedMaterial as BlinnPhongMaterial).albedoColor = new Vector4(1.0, 0.0, 0.0, 1.0);
					} else {
						//进行射线检测,检测第一个碰撞物体
						scene.physicsSimulation.raycastFromTo(from, to, hitResult);
						//将检测到的物体设置为红色
						((hitResult.collider.owner as MeshSprite3D).meshRenderer.sharedMaterial as BlinnPhongMaterial).albedoColor = new Vector4(1.0, 0.0, 0.0, 1.0);
					}
					break;
				case 1: 
					//创建盒型碰撞器
					var boxCollider:BoxColliderShape = new BoxColliderShape(1.0, 1.0, 1.0);
					for (i = 0; i < 21; i++) {
						//创建进行射线检测的盒子精灵
						var boxSprite:MeshSprite3D = scene.addChild(new MeshSprite3D(PrimitiveMesh.createBox(1.0, 1.0, 1.0))) as MeshSprite3D;
						//创建BlinnPhong材质
						var mat:BlinnPhongMaterial = new BlinnPhongMaterial();
						//设置材质的颜色
						mat.albedoColor = _albedoColor;
						//设置材质的渲染模式
						mat.renderMode = BlinnPhongMaterial.RENDERMODE_TRANSPARENT;
						boxSprite.meshRenderer.material = mat;
						Vector3.lerp(from, to, i / 20, _position);
						boxSprite.transform.localPosition = _position;
						debugSprites.push(boxSprite);
					}
					//使用盒型碰撞器进行形状检测
					if (castAll) {
						//进行形状检测,检测所有碰撞的物体
						scene.physicsSimulation.shapeCastAll(boxCollider, from, to, hitResults);
						//遍历检测到的所有物体，并将其设置为红色
						for (i = 0, n = hitResults.length; i < n; i++)
							((hitResults[i].collider.owner as MeshSprite3D).meshRenderer.sharedMaterial as BlinnPhongMaterial).albedoColor = new Vector4(1.0, 0.0, 0.0, 1.0);
					} else {
						//进行形状检测,检测第一个碰撞物体
						if (scene.physicsSimulation.shapeCast(boxCollider, from, to, hitResult))
							((hitResult.collider.owner as MeshSprite3D).meshRenderer.sharedMaterial as BlinnPhongMaterial).albedoColor = new Vector4(1.0, 0.0, 0.0, 1.0);
					}
					break;
				case 2: 
					//创建球型碰撞器
					var sphereCollider:SphereColliderShape = new SphereColliderShape(0.5);
					for (i = 0; i < 41; i++) {
						var sphereSprite:MeshSprite3D = scene.addChild(new MeshSprite3D(PrimitiveMesh.createSphere(0.5))) as MeshSprite3D;
						var mat:BlinnPhongMaterial = new BlinnPhongMaterial();
						mat.albedoColor = _albedoColor;
						mat.renderMode = BlinnPhongMaterial.RENDERMODE_TRANSPARENT;
						sphereSprite.meshRenderer.material = mat;
						Vector3.lerp(from, to, i / 40, _position);
						sphereSprite.transform.localPosition = _position;
						debugSprites.push(sphereSprite);
					}
					//使用球型碰撞器进行形状检测
					if (castAll) {
						//进行形状检测,检测所有碰撞的物体
						scene.physicsSimulation.shapeCastAll(sphereCollider, from, to, hitResults);
						for (i = 0, n = hitResults.length; i < n; i++)
							((hitResults[i].collider.owner as MeshSprite3D).meshRenderer.sharedMaterial as BlinnPhongMaterial).albedoColor = new Vector4(1.0, 0.0, 0.0, 1.0);
					} else {
						//进行形状检测,检测第一个碰撞物体
						if (scene.physicsSimulation.shapeCast(sphereCollider, from, to, hitResult))
							((hitResult.collider.owner as MeshSprite3D).meshRenderer.sharedMaterial as BlinnPhongMaterial).albedoColor = new Vector4(1.0, 0.0, 0.0, 1.0);
					}
					break;
				case 3: 
					//创建胶囊型碰撞器
					var capsuleCollider:CapsuleColliderShape = new CapsuleColliderShape(0.25, 1.0);
					for (i = 0; i < 41; i++) {
						var capsuleSprite:MeshSprite3D = scene.addChild(new MeshSprite3D(PrimitiveMesh.createCapsule(0.25, 1.0))) as MeshSprite3D;
						var mat:BlinnPhongMaterial = new BlinnPhongMaterial();
						mat.albedoColor = _albedoColor;
						mat.renderMode = BlinnPhongMaterial.RENDERMODE_TRANSPARENT;
						capsuleSprite.meshRenderer.material = mat;
						Vector3.lerp(from, to, i / 40, _position);
						capsuleSprite.transform.localPosition = _position;
						debugSprites.push(capsuleSprite);
					}
					//使用胶囊碰撞器进行形状检测
					if (castAll) {
						//进行形状检测,检测所有碰撞的物体
						scene.physicsSimulation.shapeCastAll(capsuleCollider, from, to, hitResults);
						for (i = 0, n = hitResults.length; i < n; i++)
							((hitResults[i].collider.owner as MeshSprite3D).meshRenderer.sharedMaterial as BlinnPhongMaterial).albedoColor = new Vector4(1.0, 0.0, 0.0, 1.0);
					} else {
						//进行形状检测,检测第一个碰撞物体
						if (scene.physicsSimulation.shapeCast(capsuleCollider, from, to, hitResult))
							((hitResult.collider.owner as MeshSprite3D).meshRenderer.sharedMaterial as BlinnPhongMaterial).albedoColor = new Vector4(1.0, 0.0, 0.0, 1.0);
					}
					break;
				}
			});
		}
		
		private function addButton(x:Number, y:Number, width:Number, height:Number, text:String, clickFun:Function):void {
			Laya.loader.load(["res/threeDimen/ui/button.png"], Handler.create(null, function():void {
				var changeActionButton:Button = Laya.stage.addChild(new Button("res/threeDimen/ui/button.png", text)) as Button;
				changeActionButton.size(width, height);
				changeActionButton.labelBold = true;
				changeActionButton.labelSize = 30;
				changeActionButton.sizeGrid = "4,4,4,4";
				changeActionButton.scale(Browser.pixelRatio, Browser.pixelRatio);
				changeActionButton.pos(x, y);
				changeActionButton.on(Event.CLICK, this, clickFun);
			}));
		}
		
		public function addBox():void {
			var mat1:BlinnPhongMaterial = new BlinnPhongMaterial();
			Texture2D.load("res/threeDimen/Physics/rocks.jpg", Handler.create(null, function(tex:Texture2D):void {
				mat1.albedoTexture = tex;
			}));
			
			//随机生成盒子的位置
			var sX:int = Math.random() * 0.75 + 0.25;
			var sY:int = Math.random() * 0.75 + 0.25;
			var sZ:int = Math.random() * 0.75 + 0.25;
			//创建盒子 MeshSprite3D
			var box:MeshSprite3D = scene.addChild(new MeshSprite3D(PrimitiveMesh.createBox(sX, sY, sZ))) as MeshSprite3D;
			//设置盒子的材质
			box.meshRenderer.material = mat1;
			var transform:Transform3D = box.transform;
			var pos:Vector3 = transform.position;
			pos.setValue(Math.random() * 4 - 2, 2, Math.random() * 4 - 2);
			transform.position = pos;
			var rotationEuler:Vector3 = transform.rotationEuler;
			rotationEuler.setValue(Math.random() * 360, Math.random() * 360, Math.random() * 360);
			transform.rotationEuler = rotationEuler;
			
			//创建刚体碰撞器
			var rigidBody:Rigidbody3D = box.addComponent(Rigidbody3D);
			//创建盒型碰撞器
			var boxShape:BoxColliderShape = new BoxColliderShape(sX, sY, sZ);
			//设置碰撞器的形状
			rigidBody.colliderShape = boxShape;
			//设置刚体的质量
			rigidBody.mass = 10;
		}
		
		public function addCapsule():void {
			var mat3:BlinnPhongMaterial = new BlinnPhongMaterial();
			Texture2D.load("res/threeDimen/Physics/wood.jpg", Handler.create(null, function(tex:Texture2D):void {
				mat3.albedoTexture = tex;
			}));
			
			//随机生成胶囊的半径和高度
			var raidius:int = Math.random() * 0.2 + 0.2;
			var height:int = Math.random() * 0.5 + 0.8;
			//创建胶囊MeshSprite3D精灵
			var capsule:MeshSprite3D = scene.addChild(new MeshSprite3D(PrimitiveMesh.createCapsule(raidius, height))) as MeshSprite3D;
			//为胶囊精灵设置材质
			capsule.meshRenderer.material = mat3;
			var transform:Transform3D = capsule.transform;
			var pos:Vector3 = transform.position;
			pos.setValue(Math.random() * 4 - 2, 2, Math.random() * 4 - 2);
			transform.position = pos;
			var rotationEuler:Vector3 = transform.rotationEuler;
			rotationEuler.setValue(Math.random() * 360, Math.random() * 360, Math.random() * 360);
			transform.rotationEuler = rotationEuler;
			//创建刚体碰撞器
			var rigidBody:Rigidbody3D = capsule.addComponent(Rigidbody3D);
			//创建胶囊型碰撞器
			var sphereShape:CapsuleColliderShape = new CapsuleColliderShape(raidius, height);
			//设置碰撞器的形状
			rigidBody.colliderShape = sphereShape;
			//设置刚体的质量
			rigidBody.mass = 10;
		}
	}
}