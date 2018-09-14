var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var CameraMoveScript = /** @class */ (function (_super) {
    __extends(CameraMoveScript, _super);
    function CameraMoveScript() {
        var _this = 
        //父类
        _super.call(this) || this;
        _this._tempVector3 = new Laya.Vector3();
        _this.yawPitchRoll = new Laya.Vector3();
        _this.resultRotation = new Laya.Quaternion();
        _this.tempRotationZ = new Laya.Quaternion();
        _this.tempRotationX = new Laya.Quaternion();
        _this.tempRotationY = new Laya.Quaternion();
        _this.rotaionSpeed = 0.00006;
        return _this;
    }
    CameraMoveScript.prototype._onAdded = function () {
        //点击鼠标右键
        Laya.stage.on(Laya.Event.RIGHT_MOUSE_DOWN, this, this.mouseDown);
        //松开鼠标右键
        Laya.stage.on(Laya.Event.RIGHT_MOUSE_UP, this, this.mouseUp);
        //将本组件的父类定义为Camera
        this.camera = this.owner;
    };
    CameraMoveScript.prototype._onDestroy = function () {
        //关闭监听函数
        Laya.stage.off(Laya.Event.RIGHT_MOUSE_DOWN, this, this.mouseDown);
        Laya.stage.off(Laya.Event.RIGHT_MOUSE_UP, this, this.mouseUp);
    };
    CameraMoveScript.prototype.onUpdate = function (state) {
        _super.prototype.onUpdate.call(this, state);
        //每帧调用的函数，传入参数每帧的时间值
        this.updateCamera(Laya.timer.delta);
        console.log(this.isMouseDown);
    };
    CameraMoveScript.prototype.mouseDown = function (e) {
        //获得鼠标的旋转值
        this.camera.transform.localRotation.getYawPitchRoll(this.yawPitchRoll);
        //获得鼠标的xy值
        this.lastMouseX = Laya.stage.mouseX;
        this.lastMouseY = Laya.stage.mouseY;
        //设置bool值
        this.isMouseDown = true;
        console.log(this.isMouseDown);
    };
    CameraMoveScript.prototype.mouseUp = function (e) {
        //设置bool值
        this.isMouseDown = false;
    };
    /**
     * 向前移动。
     */
    CameraMoveScript.prototype.moveForward = function (distance) {
        this._tempVector3.elements[0] = 0;
        this._tempVector3.elements[1] = 0;
        this._tempVector3.elements[2] = distance;
        this.camera.transform.translate(this._tempVector3);
    };
    /**
     * 向右移动。
     */
    CameraMoveScript.prototype.moveRight = function (distance) {
        this._tempVector3.elements[1] = 0;
        this._tempVector3.elements[2] = 0;
        this._tempVector3.elements[0] = distance;
        this.camera.transform.translate(this._tempVector3);
    };
    /**
     * 向上移动。
     */
    CameraMoveScript.prototype.moveVertical = function (distance) {
        this._tempVector3.elements[0] = this._tempVector3.elements[2] = 0;
        this._tempVector3.elements[1] = distance;
        this.camera.transform.translate(this._tempVector3, false);
    };
    CameraMoveScript.prototype.updateCamera = function (elapsedTime) {
        //是否得到了mouseX的值和mouseY的值
        if (this.isMouseDown) { //!isNaN(this.lastMouseX) && !isNaN(this.lastMouseY) &&
            var scene = this.owner.scene;
            //摄像机移动
            Laya.KeyBoardManager.hasKeyDown(87) && this.moveForward(-0.005 * elapsedTime); //W
            Laya.KeyBoardManager.hasKeyDown(83) && this.moveForward(0.005 * elapsedTime); //S
            Laya.KeyBoardManager.hasKeyDown(65) && this.moveRight(-0.005 * elapsedTime); //A
            Laya.KeyBoardManager.hasKeyDown(68) && this.moveRight(0.005 * elapsedTime); //D
            Laya.KeyBoardManager.hasKeyDown(81) && this.moveVertical(0.005 * elapsedTime); //Q
            Laya.KeyBoardManager.hasKeyDown(69) && this.moveVertical(-0.005 * elapsedTime); //E
            //判断鼠标偏移
            var offsetX = Laya.stage.mouseX - this.lastMouseX;
            var offsetY = Laya.stage.mouseY - this.lastMouseY;
            var yprElem = this.yawPitchRoll.elements;
            yprElem[0] -= offsetX * this.rotaionSpeed * elapsedTime;
            yprElem[1] -= offsetY * this.rotaionSpeed * elapsedTime;
            //调用旋转方法
            this.updateRotation();
        }
        this.lastMouseX = Laya.stage.mouseX;
        this.lastMouseY = Laya.stage.mouseY;
    };
    CameraMoveScript.prototype.updateRotation = function () {
        var yprElem = this.yawPitchRoll.elements;
        if (Math.abs(yprElem[1]) < 1.50) {
            Laya.Quaternion.createFromYawPitchRoll(yprElem[0], yprElem[1], yprElem[2], this.tempRotationZ);
            this.tempRotationZ.cloneTo(this.camera.transform.localRotation);
            //？
            this.camera.transform.localRotation = this.camera.transform.localRotation;
        }
    };
    return CameraMoveScript;
}(Laya.Script3D));
