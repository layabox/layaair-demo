package {
	import laya.display.Sprite;
	import laya.display.Stage;
	import laya.events.Event;
	import laya.physics.BoxCollider;
    import laya.physics.CircleCollider;
    import laya.physics.ChainCollider;
    import laya.physics.PolygonCollider;
	import laya.physics.joint.RevoluteJoint;
	import laya.physics.Physics;
	import laya.physics.PhysicsDebugDraw;
	import laya.physics.RigidBody;
	import laya.ui.Label;
	import laya.utils.Stat;
	import laya.webgl.WebGL;
	
	public class Physics_Physics_Bridge {
        private var ecount = 30;
        private var label: Label;
		public function Physics_Bridge() {
            Laya.Config.isAntialias = true;
			Laya.init(1200, 700, WebGL);
			Stat.show();
			Physics.enable();
			PhysicsDebugDraw.enable();
			Laya.stage.alignV = Stage.ALIGN_MIDDLE;
			Laya.stage.alignH = Stage.ALIGN_CENTER;
			Laya.stage.scaleMode = Stage.SCALE_FIXED_AUTO;
			Laya.stage.bgColor = "#232628";

            this.createBridge();
            this.eventListener();
		}

        private function createBridge() {
            const startPosX = 250, startPosY = 450;

            var ground = new Sprite();
            Laya.stage.addChild(ground);
            var groundBody: RigidBody = new RigidBody();
            groundBody.type = "static";
            ground.addComponentIntance(groundBody);
            var chainCollider: ChainCollider = ground.addComponent(ChainCollider);
            chainCollider.points = "50,600,1050,600";

            var point1 = new Sprite();
            Laya.stage.addChild(point1);
            point1.pos(startPosX, startPosY);
            var pointRB1 = new RigidBody();
            pointRB1.type = "static";
            point1.addComponentIntance(pointRB1);
            var preBody = pointRB1;

            // bridge
            var width = 20, height = 2.5;
            for (var i = 0; i < this.ecount; i++) {
                var sp = new Sprite();
                Laya.stage.addChild(sp);
                sp.pos(startPosX + i * width, startPosY);
                var rb: RigidBody = sp.addComponent(RigidBody);
                var bc: BoxCollider = sp.addComponent(BoxCollider);
                bc.width = width;
                bc.height = height;
                bc.density = 20;
                bc.friction = .2;
                bc.y = -height / 2;
                var rj = new RevoluteJoint();
                rj.otherBody = preBody;
                sp.addComponentIntance(rj);
                preBody = rb;
            }
            var point2 = new Sprite();
            Laya.stage.addChild(point2);
            point2.pos(startPosX + this.ecount * width, startPosY);
            var pointRB2 = new RigidBody();
            pointRB2.type = "static";
            point2.addComponentIntance(pointRB2);

            var rj = new RevoluteJoint();
            rj.otherBody = preBody;
            point2.addComponentIntance(rj);

            for (var i = 0; i < 2; i++) {
                var sp = new Sprite();
                Laya.stage.addChild(sp);
                sp.pos(350 + 100 * i, 300);
                var rb: RigidBody = sp.addComponent(RigidBody);
                rb.bulvar = true;
                var pc: PolygonCollider = sp.addComponent(PolygonCollider);
                pc.points = "-10,0,10,0,0,30";
                pc.density = 1.0;
            }

            for (var i = 0; i < 2; i++) {
                var sp = new Sprite();
                Laya.stage.addChild(sp);
                sp.pos(400 + 150 * i, 350);
                var rb: RigidBody = sp.addComponent(RigidBody);
                rb.bulvar = true;
                var pc: CircleCollider = sp.addComponent(CircleCollider);
                pc.radius = 10;
            }
        }

        private function eventListener() {
            // 单击产生新的小球刚体
            Laya.stage.on(Event.CLICK, this, () => {
                var 
                    targetX = (300 + Math.random() * 400) / Physics.PIXEL_RATIO, // [300, 700)
                    targetY = 500 / Physics.PIXEL_RATIO;
                var newBall = new Sprite();
                Laya.stage.addChild(newBall);
                var circleBody: RigidBody = newBall.addComponent(RigidBody);
                circleBody.bulvar = true;
                var circleCollider: CircleCollider = newBall.addComponent(CircleCollider);
                circleCollider.radius = 5;
                circleCollider.x = Laya.stage.mouseX;
                circleCollider.y = Laya.stage.mouseY;
                var circlePosx = circleCollider.x / Physics.PIXEL_RATIO;
                var circlePosy = circleCollider.y / Physics.PIXEL_RATIO;
                var velocityX = targetX - circlePosx;
                var velocityY = targetY - circlePosy;
                circleBody.linearVelocity = {x: velocityX * 3, y: velocityY * 3};
                Laya.timer.frameOnce(120, this, function() {
                    newBall.destroy();
                });
            });

            var label: Label = this.label = Laya.stage.addChild(new Label("单击屏幕产生新的小球刚体，击向bridge的随机位置")) as Label;
            label.top = 20;
            label.right = 20;
            label.fontSize = 16;
            label.color = "#e69999";
        }

        private function dispose() {
            Laya.stage.offAll(Event.CLICK);
            Laya.stage.removeChild(this.label);
        }  	
    }
}
