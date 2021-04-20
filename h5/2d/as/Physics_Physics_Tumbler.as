package {
	import laya.display.Sprite;
	import laya.display.Stage;
	import laya.events.Event;
    import laya.utils.Browser;
	import laya.physics.BoxCollider;
	import laya.physics.joint.DistanceJoint;
	import laya.physics.joint.RevoluteJoint;
	import laya.physics.Physics;
	import laya.physics.PhysicsDebugDraw;
	import laya.physics.RigidBody;
	import laya.ui.Label;
	import laya.utils.Stat;
	import laya.webgl.WebGL;
	
	public class Physics_Physics_Tumbler {
        private var count = 0;
        private var box: Sprite;
        private var totalBox = 200;
        private var label: Label;
		public function Physics_Tumbler() {
			Laya.init(1200, 700, WebGL);
			Stat.show();
			Physics.enable();
			PhysicsDebugDraw.enable();
			Laya.stage.alignV = Stage.ALIGN_MIDDLE;
			Laya.stage.alignH = Stage.ALIGN_CENTER;
			Laya.stage.scaleMode = Stage.SCALE_FIXED_AUTO;
			Laya.stage.bgColor = "#232628";

			this.createBox();
            this.eventListener();
		}

        private function createBox() {
            const width = 300, height = 20;
            const 
                posx = Browser.width / 2,
                posy = Browser.height / 2;

            var box = this.box = new Sprite();
            box.size(width + height * 2, width + height * 2);
            box.pivot(box.width / 2, box.height / 2);
            box.pos(posx, posy);
            Laya.stage.addChild(box);
            var boxBody: RigidBody = box.addComponent(RigidBody);
            // boxBody.gravityScale = 0;
            var box1Shape: BoxCollider = box.addComponent(BoxCollider);
            var box2Shape: BoxCollider = box.addComponent(BoxCollider);
            var box3Shape: BoxCollider = box.addComponent(BoxCollider);
            var box4Shape: BoxCollider = box.addComponent(BoxCollider);
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

            var revoluteJoint = new RevoluteJoint();
            revoluteJoint.anchor = [box.width / 2, box.width / 2];
            revoluteJoint.motorSpeed = .05 * Math.PI;
            revoluteJoint.maxMotorTorque = 1e8;
            revoluteJoint.enableMotor = true;
            box.addComponentIntance(revoluteJoint);
            Laya.timer.frameLoop(1, this, this.addMiniBox);
        }

        private function addMiniBox() {
            var box = this.box;
            if (this.count >= this.totalBox) {
                return;
            }
            var sp = new Sprite();
            Laya.stage.addChild(sp);
            sp.x = box.x;
            sp.y=  box.y;
            sp.addComponent(RigidBody);
            var collider = sp.addComponent(BoxCollider);
            collider.width = 5;
            collider.height = 5;
            this.count++;
        }
		private function eventListener() {
            var label: Label = this.label = Laya.stage.addChild(new Label("双击屏幕，将会产生100个新的小刚体")) as Label;
            label.top = 20;
            label.right = 20;
            label.fontSize = 16;
            label.color = "#e69999";
            Laya.stage.on(Event.DOUBLE_CLICK, this, () => {
                this.totalBox += 100;
            });
            Laya.timer.frameLoop(1, this, this.addMiniBox);
        }

		private function dispose() {
			Laya.stage.offAll(Event.DOUBLE_CLICK);
            Laya.stage.removeChild(this.label);
		}
    }
}
