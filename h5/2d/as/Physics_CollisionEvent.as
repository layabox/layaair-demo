package {
	import laya.display.Sprite;
	import laya.display.Stage;
	import laya.events.Event;
    import laya.physics.CircleCollider;
    import laya.physics.ChainCollider;
    import laya.physics.ColliderBase;
	import laya.physics.joint.RevoluteJoint;
    import laya.physics.joint.MouseJoint;
	import laya.physics.Physics;
	import laya.physics.PhysicsDebugDraw;
	import laya.physics.RigidBody;
	import laya.utils.Stat;
	import laya.webgl.WebGL;
	
	public class Physics_CollisionEvent {
        private var count: Number = 7;
        private var sensorCollider: CircleCollider;
        private var bodys: Array = [];
        private var touching: Array = [];
		public function Physics_CollisionEvent() {
			Laya.init(1200, 700, WebGL);
			Stat.show();
			Physics.enable();
			PhysicsDebugDraw.enable();
			Laya.stage.alignV = Stage.ALIGN_MIDDLE;
			Laya.stage.alignH = Stage.ALIGN_CENTER;
			Laya.stage.scaleMode = Stage.SCALE_FIXED_AUTO;
			Laya.stage.bgColor = "#232628";

            this.createSensor(); 
		}
        private function createSensor() {
            var ground = new Sprite();
            Laya.stage.addChild(ground);
            var groundBody: RigidBody = new RigidBody();
            groundBody.type = "static";
            ground.addComponentIntance(groundBody);
            var chainCollider: ChainCollider = ground.addComponent(ChainCollider);
            chainCollider.points = "50,400,50,600,1050,600,1050,400";

            var sensorCollider: CircleCollider = this.sensorCollider = ground.addComponent(CircleCollider);
            sensorCollider.isSensor = true;
            sensorCollider.radius = 100;
            sensorCollider.x = 450;
            sensorCollider.y = 300;

            for (var i = 0, len = this.count; i < len; i++) {
                var sp = new Sprite();
                Laya.stage.addChild(sp);
                sp.pos(350 + i * 50, 200).size(40, 40);
                var rb: RigidBody = sp.addComponent(RigidBody);
                this.bodys.push(rb);
                this.touching[i] = false;
                rb.getBody().SetUserData({pointer: i});
                var circleCollider: CircleCollider = sp.addComponent(CircleCollider);
                circleCollider.radius = 20;
                sp.addComponent(MouseJoint);
            }

            ground.on(Event.TRIGGER_ENTER, this, this.onTriggerEnter);
            ground.on(Event.TRIGGER_EXIT, this, this.onTriggerExit);
            Laya.physicsTimer.frameLoop(1, this, this.onTriggerStay);
        }

        private function onTriggerEnter(colliderB: ColliderBase, colliderA: ColliderBase, contact) {
            if (colliderA === this.sensorCollider) {
                var bodyB: RigidBody = colliderB.owner.getComponent(RigidBody);
                var index = bodyB.getBody().GetUserData().pointer;
                this.touching[index] = true;
            }
        }

        private function onTriggerStay() {
            const box2d = window.box2d;
            // 遍历所有刚体
            var bodys = this.bodys, body: RigidBody;
            for (var i = 0, len = this.count; i < len; i++) {
                body = bodys[i];
                if (!this.touching[i]) {
                    continue;
                }
                var bodyA: RigidBody = this.sensorCollider.owner.getComponent(RigidBody);
                var bodyB: RigidBody = body.owner.getComponent(RigidBody);
                var bodyOriA = bodyA.getBody();
                var bodyOriB = bodyB.getBody();
                var position = bodyOriB.GetPosition();
                // var center = bodyOriA.GetPosition();
                var center = new box2d.b2Vec2((450 + 100) / Physics.PIXEL_RATIO, (300 + 100) / Physics.PIXEL_RATIO);
                const d = box2d.b2Vec2.SubVV(center, position, new box2d.b2Vec2());
                if (d.LengthSquared() < 1E-5) {
                    continue;
                }
                d.Normalize();
                const F = new box2d.b2Vec2(d.x * 100, d.y * 100);
                bodyB.applyForce(position, F);
            }
        }

        private function onTriggerExit(colliderB: ColliderBase, colliderA: ColliderBase, contact) {
            if (colliderA === this.sensorCollider) {
                var bodyB: RigidBody = colliderB.owner.getComponent(RigidBody);
                var index = bodyB.getBody().GetUserData().pointer;
                this.touching[index] = false;
            }
        }

        private function dispose() {
            Laya.physicsTimer.clearAll(this);
        }
    }
}
