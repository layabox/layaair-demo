
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

	class HalfFloatTexture {
	    constructor() {
	        Laya.Laya3D.init(0, 0);
	        Laya.Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
	        Laya.Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
	        Laya.Stat.show();
	        var scene = Laya.Laya.stage.addChild(new Laya.Scene3D());
	        var camera = scene.addChild(new Laya.Camera(0, 0.1, 100));
	        camera.transform.translate(new Laya.Vector3(0, 2, 5));
	        camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
	        camera.addComponent(CameraMoveScript);
	        camera.clearColor = new Laya.Vector4(0.2, 0.2, 0.2, 1.0);
	        var directionLight = scene.addChild(new Laya.DirectionLight());
	        var mat = directionLight.transform.worldMatrix;
	        mat.setForward(new Laya.Vector3(-1.0, -1.0, -1.0));
	        directionLight.transform.worldMatrix = mat;
	        this.sprite3D = scene.addChild(new Laya.Sprite3D());
	        var box = this.sprite3D.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createPlane(1, 1)));
	        box.transform.position = new Laya.Vector3(0.0, 1.0, 2.5);
	        box.transform.rotate(new Laya.Vector3(90, 0, 0), false, false);
	        var material = new Laya.BlinnPhongMaterial();
	        material.albedoTexture = this.createHalfFloatTexture();
	        box.meshRenderer.sharedMaterial = material;
	    }
	    createHalfFloatTexture() {
	        var texture = new Laya.Texture2D(50, 50, Laya.TextureFormat.R16G16B16A16, false, true);
	        var pixelData = new Uint16Array(50 * 50 * 4);
	        var pixelIndex;
	        var step = 1.0 / 50;
	        for (var x = 0, n = 50; x < n; x++) {
	            for (var y = 0, m = 50; y < m; y++) {
	                pixelIndex = (x + y * 50) * 4;
	                pixelData[pixelIndex] = Laya.HalfFloatUtils.roundToFloat16Bits(1.0);
	                pixelData[pixelIndex + 1] = Laya.HalfFloatUtils.roundToFloat16Bits(x * step);
	                pixelData[pixelIndex + 2] = Laya.HalfFloatUtils.roundToFloat16Bits(y * step);
	                pixelData[pixelIndex + 3] = Laya.HalfFloatUtils.roundToFloat16Bits(1.0);
	            }
	        }
	        texture.setPixels(pixelData, 0);
	        texture.filterMode = Laya.FilterMode.Bilinear;
	        return texture;
	    }
	}

	new HalfFloatTexture();

