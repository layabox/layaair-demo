class Physics_Physics_Bridge {
    constructor() {
        this.ecount = 30;
        Laya.Laya.init(1200, 700, Laya.WebGL);
        Laya.Stat.show();
        Laya.Physics.enable();
        Laya.PhysicsDebugDraw.enable();
        Laya.Laya.stage.alignV = Laya.Stage.ALIGN_MIDDLE;
        Laya.Laya.stage.alignH = Laya.Stage.ALIGN_CENTER;
        Laya.Laya.stage.scaleMode = Laya.Stage.SCALE_FIXED_AUTO;
        Laya.Laya.stage.bgColor = "#232628";
        this.createBridge();
        this.eventListener();
    }
    createBridge() {
        const startPosX = 250, startPosY = 450;
        let ground = new Laya.Sprite();
        Laya.Laya.stage.addChild(ground);
        let groundBody = new Laya.RigidBody();
        groundBody.type = "static";
        ground.addComponentIntance(groundBody);
        let chainCollider = ground.addComponent(Laya.ChainCollider);
        chainCollider.points = "50,600,1050,600";
        let point1 = new Laya.Sprite();
        Laya.Laya.stage.addChild(point1);
        point1.pos(startPosX, startPosY);
        let pointRB1 = new Laya.RigidBody();
        pointRB1.type = "static";
        point1.addComponentIntance(pointRB1);
        let preBody = pointRB1;
        let width = 20, height = 2.5;
        for (let i = 0; i < this.ecount; i++) {
            let sp = new Laya.Sprite();
            Laya.Laya.stage.addChild(sp);
            sp.pos(startPosX + i * width, startPosY);
            let rb = sp.addComponent(Laya.RigidBody);
            let bc = sp.addComponent(Laya.BoxCollider);
            bc.width = width;
            bc.height = height;
            bc.density = 20;
            bc.friction = .2;
            bc.y = -height / 2;
            let rj = new Laya.RevoluteJoint();
            rj.otherBody = preBody;
            sp.addComponentIntance(rj);
            preBody = rb;
        }
        let point2 = new Laya.Sprite();
        Laya.Laya.stage.addChild(point2);
        point2.pos(startPosX + this.ecount * width, startPosY);
        let pointRB2 = new Laya.RigidBody();
        pointRB2.type = "static";
        point2.addComponentIntance(pointRB2);
        let rj = new Laya.RevoluteJoint();
        rj.otherBody = preBody;
        point2.addComponentIntance(rj);
        for (let i = 0; i < 2; i++) {
            let sp = new Laya.Sprite();
            Laya.Laya.stage.addChild(sp);
            sp.pos(350 + 100 * i, 300);
            let rb = sp.addComponent(Laya.RigidBody);
            rb.bullet = true;
            let pc = sp.addComponent(Laya.PolygonCollider);
            pc.points = "-10,0,10,0,0,30";
            pc.density = 1.0;
        }
        for (let i = 0; i < 2; i++) {
            let sp = new Laya.Sprite();
            Laya.Laya.stage.addChild(sp);
            sp.pos(400 + 150 * i, 350);
            let rb = sp.addComponent(Laya.RigidBody);
            rb.bullet = true;
            let pc = sp.addComponent(Laya.CircleCollider);
            pc.radius = 10;
        }
    }
    eventListener() {
        Laya.Laya.stage.on(Laya.Event.CLICK, this, () => {
            let targetX = (300 + Math.random() * 400) / Laya.Physics.PIXEL_RATIO, targetY = 500 / Laya.Physics.PIXEL_RATIO;
            let newBall = new Laya.Sprite();
            Laya.Laya.stage.addChild(newBall);
            let circleBody = newBall.addComponent(Laya.RigidBody);
            circleBody.bullet = true;
            let circleCollider = newBall.addComponent(Laya.CircleCollider);
            circleCollider.radius = 5;
            circleCollider.x = Laya.Laya.stage.mouseX;
            circleCollider.y = Laya.Laya.stage.mouseY;
            let circlePosx = circleCollider.x / Laya.Physics.PIXEL_RATIO;
            let circlePosy = circleCollider.y / Laya.Physics.PIXEL_RATIO;
            let velocityX = targetX - circlePosx;
            let velocityY = targetY - circlePosy;
            circleBody.linearVelocity = { x: velocityX * 3, y: velocityY * 3 };
            Laya.Laya.timer.frameOnce(120, this, function () {
                newBall.destroy();
            });
        });
        let label = this.label = Laya.Laya.stage.addChild(new Laya.Label("单击屏幕产生新的小球刚体，击向bridge的随机位置"));
        label.top = 20;
        label.right = 20;
        label.fontSize = 16;
        label.color = "#e69999";
    }
    dispose() {
        Laya.Laya.stage.offAll(Laya.Event.CLICK);
        Laya.Laya.stage.removeChild(this.label);
    }
}
new Physics_Physics_Bridge();