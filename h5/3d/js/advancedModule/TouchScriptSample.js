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
var TouchScript = /** @class */ (function (_super) {
    __extends(TouchScript, _super);
    function TouchScript() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.subText = "";
        _this.count = 0;
        return _this;
    }
    TouchScript.prototype.onUpdate = function () {
        if (this.count === 24) {
            var t = this.text.text;
            var index = t.indexOf("\n");
            t = t.slice(index + 1, t.length);
            this.text.text = t;
            this.count--;
        }
        if (this.subText !== "") {
            this.text.text += this.header + this.subText + "\n";
            this.subText = "";
            this.count++;
        }
    };
    TouchScript.prototype.onMouseEnter = function () {
        this.subText += "onMouseEnter  ";
    };
    TouchScript.prototype.onMouseOver = function () {
        this.subText += "onMouseOver  ";
    };
    TouchScript.prototype.onMouseOut = function () {
        this.subText += "onMouseOut  ";
    };
    TouchScript.prototype.onMouseDown = function () {
        this.subText += "onMouseDown  ";
    };
    TouchScript.prototype.onMouseUp = function () {
        this.subText += "onMouseUp  ";
    };
    TouchScript.prototype.onMouseClick = function () {
        this.subText += "onMouseClick  ";
    };
    TouchScript.prototype.onMouseDrag = function () {
        this.subText += "onMouseDrag  ";
    };
    return TouchScript;
}(Laya.Script3D));






        Laya3D.init(0, 0, null);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        //Stat.show();
        this.scene = Laya.stage.addChild(new Laya.Scene3D());
        this.camera = this.scene.addChild(new Laya.Camera(0, 0.1, 100));
        this.camera.transform.translate(new Laya.Vector3(0, 8, 20));
        this.camera.transform.rotate(new Laya.Vector3(-30, 0, 0), true, false);
        this.camera.clearColor = null;
        var directionLight = this.scene.addChild(new Laya.DirectionLight());
        directionLight.color = new Laya.Vector3(1, 1, 1);
        directionLight.transform.worldMatrix.setForward(new Laya.Vector3(-1.0, -1.0, 1.0));
        var plane = this.scene.addChild(new Laya.MeshSprite3D(new Laya.PlaneMesh(20, 20, 10, 10)));
        var planeMat = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("res/threeDimen/Physics/wood.jpg", Laya.Handler.create(this, function (tex) {
            planeMat.albedoTexture = tex;
        }));
        planeMat.tilingOffset = new Laya.Vector4(2, 2, 0, 0);
        plane.meshRenderer.material = planeMat;
        var rigidBody = plane.addComponent(Laya.PhysicsCollider);
        var boxShape = new Laya.BoxColliderShape(20, 0, 20);
        rigidBody.colliderShape = boxShape;
        this.text = new Laya.Text();
        this.text.pos(20, 20);
        this.text.fontSize = 16;
        this.text.color = "yellow";
        this.addBox();
        this.addCapsule();
        Laya.stage.addChild(this.text);
   
    function addBox() {
        var mat1 = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("res/threeDimen/Physics/rocks.jpg", Laya.Handler.create(this, function (tex) {
            mat1.albedoTexture = tex;
        }));
        var sX = Math.random() * 0.75 + 0.25;
        var sY = Math.random() * 0.75 + 0.25;
        var sZ = Math.random() * 0.75 + 0.25;
        var box = this.scene.addChild(new Laya.MeshSprite3D(new Laya.BoxMesh(sX, sY, sZ)));
        box.meshRenderer.material = mat1;
        box.transform.position = new Laya.Vector3(Math.random() * 4 - 2, 2, Math.random() * 4 - 2);
        box.transform.rotationEuler = new Laya.Vector3(Math.random() * 360, Math.random() * 360, Math.random() * 360);
        var rigidBody = box.addComponent(Laya.Rigidbody3D);
        var boxShape = new Laya.BoxColliderShape(sX, sY, sZ);
        rigidBody.colliderShape = boxShape;
        rigidBody.mass = 10;
        var script = box.addComponent(TouchScript);
        script.header = "BOX: ";
        script.text = this.text;
    };
    function addCapsule() {
        var mat3 = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("res/threeDimen/Physics/wood.jpg", Laya.Handler.create(null, function (tex) {
            mat3.albedoTexture = tex;
        }));
        var raidius = Math.random() * 0.2 + 0.2;
        var height = Math.random() * 0.5 + 0.8;
        var capsule = this.scene.addChild(new Laya.MeshSprite3D(new Laya.CapsuleMesh(raidius, height)));
        capsule.meshRenderer.material = mat3;
        capsule.transform.position = new Laya.Vector3(Math.random() * 4 - 2, 2, Math.random() * 4 - 2);
        capsule.transform.rotationEuler = new Laya.Vector3(Math.random() * 360, Math.random() * 360, Math.random() * 360);
        var rigidBody = capsule.addComponent(Laya.Rigidbody3D);
        var sphereShape = new Laya.CapsuleColliderShape(raidius, height);
        rigidBody.colliderShape = sphereShape;
        rigidBody.mass = 10;
        var script = capsule.addComponent(TouchScript);
        script.header = "Capsule: ";
        script.text = this.text;
    };

