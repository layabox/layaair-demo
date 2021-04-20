class Physics_Physics_CollisionEvent {
    constructor() {
        this.count = 7;
        this.bodys = [];
        this.touching = [];
        Laya.Laya.init(1200, 700, Laya.WebGL);
        Laya.Stat.show();
        Laya.Physics.enable();
        Laya.PhysicsDebugDraw.enable();
        Laya.Laya.stage.alignV = Laya.Stage.ALIGN_MIDDLE;
        Laya.Laya.stage.alignH = Laya.Stage.ALIGN_CENTER;
        Laya.Laya.stage.scaleMode = Laya.Stage.SCALE_FIXED_AUTO;
        Laya.Laya.stage.bgColor = "#232628";
        this.createSensor();
    }
    createSensor() {
        let ground = new Laya.Sprite();
        Laya.Laya.stage.addChild(ground);
        let groundBody = new Laya.RigidBody();
        groundBody.type = "static";
        ground.addComponentIntance(groundBody);
        let chainCollider = ground.addComponent(Laya.ChainCollider);
        chainCollider.points = "50,400,50,600,1050,600,1050,400";
        let sensorCollider = this.sensorCollider = ground.addComponent(Laya.CircleCollider);
        sensorCollider.isSensor = true;
        sensorCollider.radius = 100;
        sensorCollider.x = 450;
        sensorCollider.y = 300;
        for (let i = 0, len = this.count; i < len; i++) {
            let sp = new Laya.Sprite();
            Laya.Laya.stage.addChild(sp);
            sp.pos(350 + i * 50, 200).size(40, 40);
            let rb = sp.addComponent(Laya.RigidBody);
            this.bodys.push(rb);
            this.touching[i] = false;
            rb.getBody().SetUserData({ pointer: i });
            let circleCollider = sp.addComponent(Laya.CircleCollider);
            circleCollider.radius = 20;
            sp.addComponent(Laya.MouseJoint);
        }
        ground.on(Laya.Event.TRIGGER_ENTER, this, this.onTriggerEnter);
        ground.on(Laya.Event.TRIGGER_EXIT, this, this.onTriggerExit);
        Laya.Laya.physicsTimer.frameLoop(1, this, this.onTriggerStay);
    }
    onTriggerEnter(colliderB, colliderA, contact) {
        if (colliderA === this.sensorCollider) {
            let bodyB = colliderB.owner.getComponent(Laya.RigidBody);
            let index = bodyB.getBody().GetUserData().pointer;
            this.touching[index] = true;
        }
    }
    onTriggerStay() {
        const box2d = window.box2d;
        let bodys = this.bodys, body;
        for (let i = 0, len = this.count; i < len; i++) {
            body = bodys[i];
            if (!this.touching[i]) {
                continue;
            }
            let bodyA = this.sensorCollider.owner.getComponent(Laya.RigidBody);
            let bodyB = body.owner.getComponent(Laya.RigidBody);
            let bodyOriA = bodyA.getBody();
            let bodyOriB = bodyB.getBody();
            let position = bodyOriB.GetPosition();
            let center = new box2d.b2Vec2((450 + 100) / Laya.Physics.PIXEL_RATIO, (300 + 100) / Laya.Physics.PIXEL_RATIO);
            const d = box2d.b2Vec2.SubVV(center, position, new box2d.b2Vec2());
            if (d.LengthSquared() < 1E-5) {
                continue;
            }
            d.Normalize();
            const F = new box2d.b2Vec2(d.x * 100, d.y * 100);
            bodyB.applyForce(position, F);
        }
    }
    onTriggerExit(colliderB, colliderA, contact) {
        if (colliderA === this.sensorCollider) {
            let bodyB = colliderB.owner.getComponent(Laya.RigidBody);
            let index = bodyB.getBody().GetUserData().pointer;
            this.touching[index] = false;
        }
    }
    dispose() {
        Laya.Laya.physicsTimer.clearAll(this);
    }
}
new Physics_Physics_CollisionEvent();