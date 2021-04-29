class Physics_Physics_Tumbler {
    constructor() {
        this.count = 0;
        this.totalBox = 200;
        Laya.Config.isAntialias = true;
        Laya.Laya.init(Laya.Browser.clientWidth, Laya.Browser.clientHeight, Laya.WebGL);
        Laya.Stat.show();
        Laya.Physics.enable({
            gravity: 0
        });
        Laya.PhysicsDebugDraw.enable();
        Laya.Laya.stage.alignV = Laya.Stage.ALIGN_MIDDLE;
        Laya.Laya.stage.alignH = Laya.Stage.ALIGN_CENTER;
        Laya.Laya.stage.scaleMode = Laya.Stage.SCALE_FIXED_AUTO;
        Laya.Laya.stage.bgColor = "#232628";
        this.createBox();
        this.eventListener();
    }
    createBox() {
        const width = 300, height = 20;
        const posx = Laya.Browser.width / 2, posy = Laya.Browser.height / 2;
        let box = this.box = new Laya.Sprite();
        box.size(width + height * 2, width + height * 2);
        box.pivot(box.width / 2, box.height / 2);
        box.pos(posx, posy);
        Laya.Laya.stage.addChild(box);
        let boxBody = box.addComponent(Laya.RigidBody);
        let box1Shape = box.addComponent(Laya.BoxCollider);
        let box2Shape = box.addComponent(Laya.BoxCollider);
        let box3Shape = box.addComponent(Laya.BoxCollider);
        let box4Shape = box.addComponent(Laya.BoxCollider);
        box1Shape.width = width + height * 2;
        box1Shape.height = height;
        box1Shape.x = 0;
        box1Shape.y = 0;
        box2Shape.width = width + height * 2;
        box2Shape.height = height;
        box2Shape.x = 0;
        box2Shape.y = width + height;
        box3Shape.width = height;
        box3Shape.height = width + height * 2;
        box3Shape.x = 0;
        box3Shape.y = 0;
        box4Shape.width = height;
        box4Shape.height = width + height * 2;
        box4Shape.x = width + height;
        box4Shape.y = 0;
        let revoluteJoint = new Laya.RevoluteJoint();
        revoluteJoint.anchor = [box.width / 2, box.width / 2];
        revoluteJoint.motorSpeed = .05 * Math.PI;
        revoluteJoint.maxMotorTorque = 1e8;
        revoluteJoint.enableMotor = true;
        box.addComponentIntance(revoluteJoint);
        Laya.Laya.timer.frameLoop(1, this, this.addMiniBox);
    }
    addMiniBox() {
        let box = this.box;
        if (this.count >= this.totalBox) {
            return;
        }
        let sp = new Laya.Sprite();
        Laya.Laya.stage.addChild(sp);
        sp.x = box.x;
        sp.y = box.y;
        sp.addComponent(Laya.RigidBody);
        let collider = sp.addComponent(Laya.BoxCollider);
        collider.width = 5;
        collider.height = 5;
        this.count++;
    }
    eventListener() {
        let label = this.label = Laya.Laya.stage.addChild(new Laya.Label("双击屏幕，将会产生100个新的小刚体"));
        label.top = 20;
        label.right = 20;
        label.fontSize = 16;
        label.color = "#e69999";
        Laya.Laya.stage.on(Laya.Event.DOUBLE_CLICK, this, () => {
            this.totalBox += 100;
        });
        Laya.Laya.timer.frameLoop(1, this, this.addMiniBox);
    }
    dispose() {
        Laya.Laya.stage.offAll(Laya.Event.DOUBLE_CLICK);
        Laya.Laya.stage.removeChild(this.label);
    }
}
new Physics_Physics_Tumbler();
