package {
	import laya.display.Sprite;
	import laya.display.Stage;
	import laya.events.Event;
	import laya.physics.BoxCollider;
	import laya.physics.ChainCollider;
	import laya.physics.CircleCollider;
	import laya.physics.joint.MouseJoint;
	import laya.physics.Physics;
	import laya.physics.PhysicsDebugDraw;
	import laya.physics.PolygonCollider;
	import laya.physics.RigidBody;
	import laya.utils.Stat;
	import laya.webgl.WebGL;
	
	public class Physics_Physics_CollisionFiltering {
		public static const k_smallGroup = 1;
		public static const k_middleGroup = 0;
		public static const k_largeGroup = -1;
		public static const k_triangleCategory = 0x2;
		public static const k_boxCategory = 0x4;
		public static const k_circleCategory = 0x8;
		public static const k_triangleMask = 0xF;
		public static const k_boxMask = 0xF ^ Physics_Physics_CollisionFiltering.k_circleCategory;
		public static const k_circleMask = Physics_Physics_CollisionFiltering.k_triangleCategory | Physics_Physics_CollisionFiltering.k_boxCategory | 0x01; // 0x01为house刚体默认的category，若不设置，则会穿透house
		private var curTarget: Sprite;
		private var preMovementX: Number = 0;
		private var preMovementY: Number = 0;
		public function Physics_Physics_CollisionFiltering() {
			Laya.Config.isAntialias = true;
			Laya.init(1200, 700, WebGL);
			Stat.show();
			Physics.enable();
			PhysicsDebugDraw.enable();
			Laya.stage.alignV = Stage.ALIGN_MIDDLE;
			Laya.stage.alignH = Stage.ALIGN_CENTER;
			Laya.stage.scaleMode = Stage.SCALE_FIXED_AUTO;
			Laya.stage.bgColor = "#232628";

			this.createHouse();
			for (var i = 1; i <= 3; i++) {
				this.createBox(300, 300, 20, 20, i);
				this.createTriangle(500, 300, 20, i);
				this.createCircle(700, 300, 10, i);
			}
		}
		private function createHouse() {
			var house=  new Sprite();
			Laya.stage.addChild(house);
			var rigidbody: RigidBody = house.addComponent(RigidBody);
			rigidbody.type = "static";
			var chainCollider: ChainCollider = house.addComponent(ChainCollider);
			chainCollider.loop = true;
			chainCollider.points = "600,50,100,200,100,600,1100,600,1100,200";
        }

		private function createBox(posx, posy, width, height, ratio) {
			var box = new Sprite();
			box.on(Event.MOUSE_DOWN, this, this.mouseDown);
			Laya.stage.addChild(box);
			box.pos(posx, posy).size(width * ratio, height * ratio);
			var rigidbody: RigidBody = box.addComponent(RigidBody);
			rigidbody.category = Physics_Physics_CollisionFiltering.k_boxCategory;
			rigidbody.mask = Physics_Physics_CollisionFiltering.k_boxMask;
			var boxCollider: BoxCollider = box.addComponent(BoxCollider);
			boxCollider.width = width * ratio;
			boxCollider.height = height * ratio;
			this.addGroup(rigidbody, ratio);
		}

		private function createTriangle(posx, posy, side, ratio) {
			var triangle = new Sprite();
			var total = side * ratio;
			triangle.on(Event.MOUSE_DOWN, this, this.mouseDown);
			Laya.stage.addChild(triangle);
			triangle.pos(posx, posy).size(side * ratio, side * ratio);
			var rigidbody: RigidBody = triangle.addComponent(RigidBody);
			rigidbody.category = Physics_Physics_CollisionFiltering.k_triangleCategory;
			rigidbody.mask = Physics_Physics_CollisionFiltering.k_triangleMask;
			var polygonCollider: PolygonCollider = triangle.addComponent(PolygonCollider);
			polygonCollider.points = "0,0,0," + total+ "," + total+ ",0";
			this.addGroup(rigidbody, ratio);
		}

		private function createCircle(posx, posy, radius, ratio) {
			var circle = new Sprite();
			circle.on(Event.MOUSE_DOWN, this, this.mouseDown);
			Laya.stage.addChild(circle);
			circle.pos(posx, posy).size(radius * 2 * ratio, radius * 2 * ratio);
			var rigidbody: RigidBody = circle.addComponent(RigidBody);
			rigidbody.category = Physics_Physics_CollisionFiltering.k_circleCategory;
			rigidbody.mask = Physics_Physics_CollisionFiltering.k_circleMask;
			var circleCollider: CircleCollider = circle.addComponent(CircleCollider);
			circleCollider.radius = radius * ratio;
			this.addGroup(rigidbody, ratio);
		}

		private function addGroup(rigidbody, ratio) {
			switch(ratio) {
				case 1:
					rigidbody.group = Physics_Physics_CollisionFiltering.k_smallGroup;
					break;
				case 2:
					rigidbody.group = Physics_Physics_CollisionFiltering.k_middleGroup;
					break;
				case 3:
					rigidbody.group = Physics_Physics_CollisionFiltering.k_largeGroup;
					break;
			}
		}

		private function mouseDown(e) {
			this.curTarget = e.target;
			// 方案一，使用 MouseJoint
			var mouseJoint: MouseJoint = this.curTarget.addComponent(MouseJoint);
			Laya.timer.callLater(mouseJoint, mouseJoint.onMouseDown);
			Laya.stage.on(Event.MOUSE_UP, this, this.destoryJoint);
			Laya.stage.on(Event.MOUSE_OUT, this, this.destoryJoint);
			// 方案二，自己实现，可以实现更大程度的控制
			// Laya.stage.on(Event.MOUSE_MOVE, this, this.mouseMove);
			// Laya.stage.on(Event.MOUSE_UP, this, this.mouseUp);
			// Laya.stage.on(Event.MOUSE_OUT, this, this.mouseUp);
			// var rigidbody = this.curTarget.getComponent(RigidBody);
			// rigidbody.type = "kinematic";
		}

		private function mouseMove(e) {
			var movementX = e.nativeEvent.movementX;
			var movementY = e.nativeEvent.movementY;
			this.preMovementX = movementX;
			this.preMovementY = movementY;
			this.curTarget.pos(Laya.stage.mouseX, Laya.stage.mouseY);
		}

		private function mouseUp() {
			Laya.stage.off(Event.MOUSE_MOVE, this, this.mouseMove);
			Laya.stage.off(Event.MOUSE_UP, this, this.mouseUp);
			Laya.stage.off(Event.MOUSE_OUT, this, this.mouseUp);
			var rigidbody: RigidBody = this.curTarget.getComponent(RigidBody);
			rigidbody.type = "dynamic";
			rigidbody.linearVelocity = [this.preMovementX, this.preMovementY];
			this.curTarget = null;
		}

		private function destoryJoint() {
			Laya.stage.off(Event.MOUSE_UP, this, this.destoryJoint);
			Laya.stage.off(Event.MOUSE_OUT, this, this.destoryJoint);
			var mouseJoint: MouseJoint = this.curTarget.getComponent(MouseJoint);
			mouseJoint.destroy();
			this.curTarget = null;
		}

		private function dispose() {
			Laya.stage.off(Event.MOUSE_MOVE, this, this.mouseMove);
			Laya.stage.off(Event.MOUSE_UP, this, this.mouseUp);
			Laya.stage.off(Event.MOUSE_OUT, this, this.mouseUp);
			Laya.stage.off(Event.MOUSE_UP, this, this.destoryJoint);
			Laya.stage.off(Event.MOUSE_OUT, this, this.destoryJoint);
		}
		
	}
}