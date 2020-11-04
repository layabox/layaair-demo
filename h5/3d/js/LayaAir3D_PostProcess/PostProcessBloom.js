window.Laya=window.Laya||{};

(function (Laya) {
	'use strict';

	class CameraMoveScript extends Laya.Script3D {
	    constructor() {
	        super();
	        this._tempVector3 = new Laya.Vector3();
	        this.yawPitchRoll = new Laya.Vector3();
	        this.resultRotation = new Laya.Quaternion();
	        this.tempRotationZ = new Laya.Quaternion();
	        this.tempRotationX = new Laya.Quaternion();
	        this.tempRotationY = new Laya.Quaternion();
	        this.rotaionSpeed = 0.00006;
	        this.speed = 0.01;
	    }
	    _updateRotation() {
	        if (Math.abs(this.yawPitchRoll.y) < 1.50) {
	            Laya.Quaternion.createFromYawPitchRoll(this.yawPitchRoll.x, this.yawPitchRoll.y, this.yawPitchRoll.z, this.tempRotationZ);
	            this.tempRotationZ.cloneTo(this.camera.transform.localRotation);
	            this.camera.transform.localRotation = this.camera.transform.localRotation;
	        }
	    }
	    onAwake() {
	        Laya.Laya.stage.on(Laya.Event.RIGHT_MOUSE_DOWN, this, this.mouseDown);
	        Laya.Laya.stage.on(Laya.Event.RIGHT_MOUSE_UP, this, this.mouseUp);
	        this.camera = this.owner;
	    }
	    onUpdate() {
	        var elapsedTime = Laya.Laya.timer.delta;
	        if (!isNaN(this.lastMouseX) && !isNaN(this.lastMouseY) && this.isMouseDown) {
	            var scene = this.owner.scene;
	            Laya.KeyBoardManager.hasKeyDown(87) && this.moveForward(-this.speed * elapsedTime);
	            Laya.KeyBoardManager.hasKeyDown(83) && this.moveForward(this.speed * elapsedTime);
	            Laya.KeyBoardManager.hasKeyDown(65) && this.moveRight(-this.speed * elapsedTime);
	            Laya.KeyBoardManager.hasKeyDown(68) && this.moveRight(this.speed * elapsedTime);
	            Laya.KeyBoardManager.hasKeyDown(81) && this.moveVertical(this.speed * elapsedTime);
	            Laya.KeyBoardManager.hasKeyDown(69) && this.moveVertical(-this.speed * elapsedTime);
	            var offsetX = Laya.Laya.stage.mouseX - this.lastMouseX;
	            var offsetY = Laya.Laya.stage.mouseY - this.lastMouseY;
	            var yprElem = this.yawPitchRoll;
	            yprElem.x -= offsetX * this.rotaionSpeed * elapsedTime;
	            yprElem.y -= offsetY * this.rotaionSpeed * elapsedTime;
	            this._updateRotation();
	        }
	        this.lastMouseX = Laya.Laya.stage.mouseX;
	        this.lastMouseY = Laya.Laya.stage.mouseY;
	    }
	    onDestroy() {
	        Laya.Laya.stage.off(Laya.Event.RIGHT_MOUSE_DOWN, this, this.mouseDown);
	        Laya.Laya.stage.off(Laya.Event.RIGHT_MOUSE_UP, this, this.mouseUp);
	    }
	    mouseDown(e) {
	        this.camera.transform.localRotation.getYawPitchRoll(this.yawPitchRoll);
	        this.lastMouseX = Laya.Laya.stage.mouseX;
	        this.lastMouseY = Laya.Laya.stage.mouseY;
	        this.isMouseDown = true;
	    }
	    mouseUp(e) {
	        this.isMouseDown = false;
	    }
	    mouseOut(e) {
	        this.isMouseDown = false;
	    }
	    moveForward(distance) {
	        this._tempVector3.x = this._tempVector3.y = 0;
	        this._tempVector3.z = distance;
	        this.camera.transform.translate(this._tempVector3);
	    }
	    moveRight(distance) {
	        this._tempVector3.y = this._tempVector3.z = 0;
	        this._tempVector3.x = distance;
	        this.camera.transform.translate(this._tempVector3);
	    }
	    moveVertical(distance) {
	        this._tempVector3.x = this._tempVector3.z = 0;
	        this._tempVector3.y = distance;
	        this.camera.transform.translate(this._tempVector3, false);
	    }
	}

	class PostProcessBloom {
	    constructor() {
	        this.camera = null;
	        Laya.Laya3D.init(0, 0);
	        Laya.Stat.show();
	        Laya.Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
	        Laya.Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
	        Laya.Scene3D.load("res/threeDimen/scene/LayaScene_BloomScene/Conventional/BloomScene.ls", Laya.Handler.create(this, function (scene) {
	            Laya.Laya.stage.addChild(scene);
	            this.camera = scene.getChildByName("Main Camera");
	            this.camera.addComponent(CameraMoveScript);
	            var postProcess = new Laya.PostProcess();
	            var bloom = new Laya.BloomEffect();
	            postProcess.addEffect(bloom);
	            this.camera.postProcess = postProcess;
	            this.camera.enableHDR = true;
	            bloom.intensity = 5;
	            bloom.threshold = 0.9;
	            bloom.softKnee = 0.5;
	            bloom.clamp = 65472;
	            bloom.diffusion = 5;
	            bloom.anamorphicRatio = 0.0;
	            bloom.color = new Laya.Color(1, 1, 1, 1);
	            bloom.fastMode = true;
	            Laya.Texture2D.load("res/threeDimen/scene/LayaScene_BloomScene/Conventional/Assets/LensDirt01.png", Laya.Handler.create(null, function (tex) {
	                bloom.dirtTexture = tex;
	                bloom.dirtIntensity = 2.0;
	            }));
	            this.loadUI();
	        }));
	    }
	    loadUI() {
	        Laya.Laya.loader.load(["res/threeDimen/ui/button.png"], Laya.Handler.create(this, function () {
	            var button = Laya.Laya.stage.addChild(new Laya.Button("res/threeDimen/ui/button.png", "关闭HDR"));
	            button.size(200, 40);
	            button.labelBold = true;
	            button.labelSize = 30;
	            button.sizeGrid = "4,4,4,4";
	            button.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
	            button.pos(Laya.Laya.stage.width / 2 - button.width * Laya.Browser.pixelRatio / 2, Laya.Laya.stage.height - 60 * Laya.Browser.pixelRatio);
	            button.on(Laya.Event.CLICK, this, function () {
	                var enableHDR = this.camera.enableHDR;
	                if (enableHDR)
	                    button.label = "开启HDR";
	                else
	                    button.label = "关闭HDR";
	                this.camera.enableHDR = !enableHDR;
	            });
	        }));
	    }
	}

	new PostProcessBloom();

}(Laya));
