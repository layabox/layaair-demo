class CameraMoveScript extends Laya.Script3D{
    constructor(){
        super();
        this._tempVector3 = new Laya.Vector3();
        this.yawPitchRoll = new Laya.Vector3();
        this.resultRotation = new Laya.Quaternion();
        this.tempRotationZ = new Laya.Quaternion();
        this.tempRotationX = new Laya.Quaternion();
        this.tempRotationY = new Laya.Quaternion();
        this.rotaionSpeed = 0.00006;
    }
	onAwake(){
		Laya.stage.on(Laya.Event.RIGHT_MOUSE_DOWN, this, this.mouseDown);
		Laya.stage.on(Laya.Event.RIGHT_MOUSE_UP, this, this.mouseUp);
		this.camera = this.owner;
	}
    _onDestroy() {
        //关闭监听函数
        Laya.stage.off(Laya.Event.RIGHT_MOUSE_DOWN, this, this.mouseDown);
        Laya.stage.off(Laya.Event.RIGHT_MOUSE_UP, this, this.mouseUp);
    }
    onUpdate(state) {
		var elapsedTime = Laya.timer.delta;
		if (!isNaN(this.lastMouseX) && !isNaN(this.lastMouseY) && this.isMouseDown) {
			var scene = this.owner.scene;
			Laya.KeyBoardManager.hasKeyDown(87) && this.moveForward(-0.01 * elapsedTime);//W
			Laya.KeyBoardManager.hasKeyDown(83) && this.moveForward(0.01 * elapsedTime);//S
			Laya.KeyBoardManager.hasKeyDown(65) && this.moveRight(-0.01 * elapsedTime);//A
			Laya.KeyBoardManager.hasKeyDown(68) && this.moveRight(0.01 * elapsedTime);//D
			Laya.KeyBoardManager.hasKeyDown(81) && this.moveVertical(0.01 * elapsedTime);//Q
			Laya.KeyBoardManager.hasKeyDown(69) && this.moveVertical(-0.01 * elapsedTime);//E
				
			var offsetX = Laya.stage.mouseX - this.lastMouseX;
			var offsetY = Laya.stage.mouseY - this.lastMouseY;
				
			var yprElem = this.yawPitchRoll.elements;
			yprElem[0] -= offsetX * this.rotaionSpeed * elapsedTime;
			yprElem[1] -= offsetY * this.rotaionSpeed * elapsedTime;
			this.updateRotation();
		}
		this.lastMouseX = Laya.stage.mouseX;
		this.lastMouseY = Laya.stage.mouseY;
		
     
    }
    mouseDown(e) {
        //获得鼠标的旋转值
        this.camera.transform.localRotation.getYawPitchRoll(this.yawPitchRoll);
        //获得鼠标的xy值
        this.lastMouseX = Laya.stage.mouseX;
        this.lastMouseY = Laya.stage.mouseY;
        //设置bool值
        this.isMouseDown = true;
     
    }
    mouseUp(e) {
        //设置bool值
        this.isMouseDown = false;
    }
    /**
     * 向前移动。
     */
    moveForward(distance) {
        this._tempVector3.elements[0] = 0;
        this._tempVector3.elements[1] = 0;
        this._tempVector3.elements[2] = distance;
        this.camera.transform.translate(this._tempVector3);
    }
    /**
     * 向右移动。
     */
    moveRight(distance) {
        this._tempVector3.elements[1] = 0;
        this._tempVector3.elements[2] = 0;
        this._tempVector3.elements[0] = distance;
        this.camera.transform.translate(this._tempVector3);
    }
    /**
     * 向上移动。
     */
    moveVertical(distance) {
        this._tempVector3.elements[0] = this._tempVector3.elements[2] = 0;
        this._tempVector3.elements[1] = distance;
        this.camera.transform.translate(this._tempVector3, false);
    }

    updateRotation() {
        var yprElem = this.yawPitchRoll.elements;
        if (Math.abs(yprElem[1]) < 1.50) {
            Laya.Quaternion.createFromYawPitchRoll(yprElem[0], yprElem[1], yprElem[2], this.tempRotationZ);
            this.tempRotationZ.cloneTo(this.camera.transform.localRotation);
            //？
            this.camera.transform.localRotation = this.camera.transform.localRotation;
        }
    }
}