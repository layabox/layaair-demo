class Physics_Physics_Strandbeests {
	constructor() {
		this.scale = 2.5;
		this.pos = [500, 400];
		this.m_offset = [0, -80 * this.scale];
		this.pivot = [0, 8 * this.scale];
		Laya.Config.isAntialias = true;
		Laya.Laya.init(1200, 700, Laya.WebGL);
		Laya.Stat.show();
		Laya.Physics.enable();
		Laya.PhysicsDebugDraw.enable();
		Laya.Laya.stage.alignV = Laya.Stage.ALIGN_MIDDLE;
		Laya.Laya.stage.alignH = Laya.Stage.ALIGN_CENTER;
		Laya.Laya.stage.scaleMode = Laya.Stage.SCALE_FIXED_AUTO;
		Laya.Laya.stage.bgColor = "#232628";
		this.Construct();
		this.eventListener();
	}
	Construct() {
		let ground = new Laya.Sprite();
		Laya.Laya.stage.addChild(ground);
		let rigidbody = new Laya.RigidBody();
		rigidbody.type = "static";
		ground.addComponentIntance(rigidbody);
		let chainCollider = ground.addComponent(Laya.ChainCollider);
		chainCollider.points = "50,200,50,570,1050,570,1050,200";
		for (let i = 1; i <= 32; i++) {
			let small = new Laya.Sprite();
			small.pos(i * 30 + 50, 570 - 5 * this.scale);
			Laya.Laya.stage.addChild(small);
			let sBody = small.addComponent(Laya.RigidBody);
			let sCollider = small.addComponent(Laya.CircleCollider);
			sCollider.radius = 2.5 * this.scale;
		}
		let chassis = this.chassis = new Laya.Sprite();
		chassis.pos(this.pos[0] + this.pivot[0] + this.m_offset[0], this.pos[1] + this.pivot[1] + this.m_offset[1]).size(50 * this.scale, 20 * this.scale);
		Laya.Laya.stage.addChild(chassis);
		let chassisBody = chassis.addComponent(Laya.RigidBody);
		chassisBody.group = -1;
		let chassisCollider = chassis.addComponent(Laya.BoxCollider);
		chassisCollider.density = 1;
		chassisCollider.width = 50 * this.scale;
		chassisCollider.height = 20 * this.scale;
		chassisCollider.x = -25 * this.scale;
		chassisCollider.y = -10 * this.scale;
		let wheel = this.wheel = new Laya.Sprite();
		wheel.pos(this.pos[0] + this.pivot[0] + this.m_offset[0], this.pos[1] + this.pivot[1] + this.m_offset[1]);
		Laya.Laya.stage.addChild(wheel);
		let wheelBody = wheel.addComponent(Laya.RigidBody);
		wheelBody.group = -1;
		let wheelCollider = wheel.addComponent(Laya.CircleCollider);
		wheelCollider.density = 1;
		wheelCollider.radius = 16 * this.scale;
		wheelCollider.x = -16 * this.scale;
		wheelCollider.y = -16 * this.scale;
		let motorJoint = this.motorJoint = new Laya.RevoluteJoint();
		motorJoint.otherBody = wheelBody;
		motorJoint.motorSpeed = 2.0;
		motorJoint.maxMotorTorque = 400.0;
		motorJoint.enableMotor = true;
		chassis.addComponentIntance(motorJoint);
		let wheelOriBody = wheelBody.getBody();
		let wheelAnchor = [this.pivot[0], this.pivot[1] - 8 * this.scale];
		this.createLeg(-1, wheelAnchor);
		this.createLeg(1, wheelAnchor);
		wheelOriBody.SetTransform(wheelOriBody.GetPosition(), 120.0 * Math.PI / 180.0);
		this.createLeg(-1.0, wheelAnchor);
		this.createLeg(1.0, wheelAnchor);
		wheelOriBody.SetTransform(wheelOriBody.GetPosition(), -120.0 * Math.PI / 180.0);
		this.createLeg(-1.0, wheelAnchor);
		this.createLeg(1.0, wheelAnchor);
	}
	createLeg(s, wheelAnchor) {
		const box2d = window.box2d;
		const wheelBody = this.wheel.getComponent(Laya.RigidBody);
		const chassisBody = this.chassis.getComponent(Laya.RigidBody);
		const p1 = [54 * s * this.scale, -61 * -1 * this.scale];
		const p2 = [72 * s * this.scale, -12 * -1 * this.scale];
		const p3 = [43 * s * this.scale, -19 * -1 * this.scale];
		const p4 = [31 * s * this.scale, 8 * -1 * this.scale];
		const p5 = [60 * s * this.scale, 15 * -1 * this.scale];
		const p6 = [25 * s * this.scale, 37 * -1 * this.scale];
		let leg1 = new Laya.Sprite();
		leg1.pos(this.pos[0] + this.m_offset[0], this.pos[1] + this.m_offset[1] + 16 * this.scale);
		Laya.Laya.stage.addChild(leg1);
		let legBody1 = leg1.addComponent(Laya.RigidBody);
		legBody1.angularDamping = 10;
		legBody1.group = -1;
		let legCollider1 = leg1.addComponent(Laya.PolygonCollider);
		legCollider1.density = 1;
		let leg2 = new Laya.Sprite();
		leg2.pos(this.pos[0] + this.m_offset[0] + p4[0], this.pos[1] + this.m_offset[1] + p4[1] + 16 * this.scale);
		Laya.Laya.stage.addChild(leg2);
		let legBody2 = leg2.addComponent(Laya.RigidBody);
		legBody2.angularDamping = 10;
		legBody2.group = -1;
		let legCollider2 = leg2.addComponent(Laya.PolygonCollider);
		legCollider2.density = 1;
		if (s > 0) {
			legCollider1.points = p1.concat(p2).concat(p3).join(",");
			legCollider2.points = [0, 0].concat(B2Math.SubVV(p5, p4)).concat(B2Math.SubVV(p6, p4)).join(",");
		}
		else {
			legCollider1.points = p1.concat(p3).concat(p2).join(",");
			legCollider2.points = [0, 0].concat(B2Math.SubVV(p6, p4)).concat(B2Math.SubVV(p5, p4)).join(",");
		}
		const dampingRatio = 0.5;
		const frequencyHz = 10.0;
		let distanceJoint1 = new Laya.DistanceJoint();
		distanceJoint1.otherBody = legBody2;
		distanceJoint1.selfAnchor = p2;
		distanceJoint1.otherAnchor = B2Math.SubVV(p5, p4);
		distanceJoint1.frequency = frequencyHz;
		distanceJoint1.damping = dampingRatio;
		leg1.addComponentIntance(distanceJoint1);
		let distanceJoint2 = new Laya.DistanceJoint();
		distanceJoint2.otherBody = legBody2;
		distanceJoint2.selfAnchor = p3;
		distanceJoint2.frequency = frequencyHz;
		distanceJoint2.damping = dampingRatio;
		leg1.addComponentIntance(distanceJoint2);
		let localAnchor = new box2d.b2Vec2();
		wheelBody.getBody().GetLocalPoint({ x: (this.pos[0] + this.m_offset[0]) / Laya.Physics.PIXEL_RATIO, y: (this.pos[1] + this.m_offset[1]) / Laya.Physics.PIXEL_RATIO }, localAnchor);
		let anchor = [-localAnchor.x * Laya.Physics.PIXEL_RATIO, -localAnchor.y * Laya.Physics.PIXEL_RATIO];
		let distanceJoint3 = new Laya.DistanceJoint();
		distanceJoint3.otherBody = wheelBody;
		distanceJoint3.selfAnchor = p3;
		distanceJoint3.otherAnchor = anchor;
		distanceJoint3.frequency = frequencyHz;
		distanceJoint3.damping = dampingRatio;
		leg1.addComponentIntance(distanceJoint3);
		let distanceJoint4 = new Laya.DistanceJoint();
		distanceJoint4.otherBody = wheelBody;
		distanceJoint4.selfAnchor = B2Math.SubVV(p6, p4);
		distanceJoint4.otherAnchor = anchor;
		distanceJoint4.frequency = frequencyHz;
		distanceJoint4.damping = dampingRatio;
		leg2.addComponentIntance(distanceJoint4);
		let revoluteJoint = new Laya.RevoluteJoint();
		revoluteJoint.otherBody = legBody2;
		revoluteJoint.anchor = B2Math.AddVV(p4, this.pivot);
		this.chassis.addComponentIntance(revoluteJoint);
	}
	eventListener() {
		Laya.Laya.stage.on(Laya.Event.DOUBLE_CLICK, this, () => {
			this.motorJoint.motorSpeed = -this.motorJoint.motorSpeed;
		});
		Laya.Laya.stage.on(Laya.Event.CLICK, this, () => {
			const chassisBody = this.chassis.getComponent(Laya.RigidBody);
			const chassisPos = chassisBody.getBody().GetPosition();
			let newBall = new Laya.Sprite();
			Laya.Laya.stage.addChild(newBall);
			let circleBody = newBall.addComponent(Laya.RigidBody);
			let circleCollider = newBall.addComponent(Laya.CircleCollider);
			circleCollider.radius = 3 * this.scale;
			circleCollider.x = Laya.Laya.stage.mouseX;
			circleCollider.y = Laya.Laya.stage.mouseY;
			let circlePosx = circleCollider.x / Laya.Physics.PIXEL_RATIO;
			let circlePosy = circleCollider.y / Laya.Physics.PIXEL_RATIO;
			let velocityX = chassisPos.x - circlePosx;
			let velocityY = chassisPos.y - circlePosy;
			circleBody.linearVelocity = { x: velocityX * 5, y: velocityY * 5 };
			Laya.Laya.timer.frameOnce(120, this, function () {
				newBall.destroy();
			});
		});
		let label = this.label = Laya.Laya.stage.addChild(new Laya.Label("双击屏幕，仿生机器人向相反方向运动\n单击产生新的小球刚体"));
		label.top = 20;
		label.right = 20;
		label.fontSize = 16;
		label.color = "#e69999";
	}
	dispose() {
		Laya.Laya.stage.offAll(Laya.Event.CLICK);
		Laya.Laya.stage.offAll(Laya.Event.DOUBLE_CLICK);
		Laya.Laya.stage.removeChild(this.label);
	}
}
class B2Math {
	static AddVV(a, b) {
		return [a[0] + b[0], a[1] + b[1]];
	}
	static SubVV(a, b) {
		return [a[0] - b[0], a[1] - b[1]];
	}
}
new Physics_Physics_Strandbeests();