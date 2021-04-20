class Physics_CollisionFiltering {
	constructor() {
		this.preMovementX = 0;
		this.preMovementY = 0;
		Laya.Laya.init(1200, 700, Laya.WebGL);
		Laya.Stat.show();
		Laya.Physics.enable();
		Laya.PhysicsDebugDraw.enable();
		Laya.Laya.stage.alignV = Laya.Stage.ALIGN_MIDDLE;
		Laya.Laya.stage.alignH = Laya.Stage.ALIGN_CENTER;
		Laya.Laya.stage.scaleMode = Laya.Stage.SCALE_FIXED_AUTO;
		Laya.Laya.stage.bgColor = "#232628";
		this.createHouse();
		for (let i = 1; i <= 3; i++) {
			this.createBox(300, 300, 20, 20, i);
			this.createTriangle(500, 300, 20, i);
			this.createCircle(700, 300, 10, i);
		}
	}
	createHouse() {
		let house = new Laya.Sprite();
		Laya.Laya.stage.addChild(house);
		let rigidbody = house.addComponent(Laya.RigidBody);
		rigidbody.type = "static";
		let chainCollider = house.addComponent(Laya.ChainCollider);
		chainCollider.loop = true;
		chainCollider.points = "600,50,100,200,100,600,1100,600,1100,200";
	}
	createBox(posx, posy, width, height, ratio) {
		let box = new Laya.Sprite();
		box.on(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
		Laya.Laya.stage.addChild(box);
		box.pos(posx, posy).size(width * ratio, height * ratio);
		let rigidbody = box.addComponent(Laya.RigidBody);
		rigidbody.category = Physics_CollisionFiltering.k_boxCategory;
		rigidbody.mask = Physics_CollisionFiltering.k_boxMask;
		let boxCollider = box.addComponent(Laya.BoxCollider);
		boxCollider.width = width * ratio;
		boxCollider.height = height * ratio;
		this.addGroup(rigidbody, ratio);
	}
	createTriangle(posx, posy, side, ratio) {
		let triangle = new Laya.Sprite();
		triangle.on(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
		Laya.Laya.stage.addChild(triangle);
		triangle.pos(posx, posy).size(side * ratio, side * ratio);
		let rigidbody = triangle.addComponent(Laya.RigidBody);
		rigidbody.category = Physics_CollisionFiltering.k_triangleCategory;
		rigidbody.mask = Physics_CollisionFiltering.k_triangleMask;
		let polygonCollider = triangle.addComponent(Laya.PolygonCollider);
		polygonCollider.points = `0,0,0,${side * ratio},${side * ratio},0`;
		this.addGroup(rigidbody, ratio);
	}
	createCircle(posx, posy, radius, ratio) {
		let circle = new Laya.Sprite();
		circle.on(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
		Laya.Laya.stage.addChild(circle);
		circle.pos(posx, posy).size(radius * 2 * ratio, radius * 2 * ratio);
		let rigidbody = circle.addComponent(Laya.RigidBody);
		rigidbody.category = Physics_CollisionFiltering.k_circleCategory;
		rigidbody.mask = Physics_CollisionFiltering.k_circleMask;
		let circleCollider = circle.addComponent(Laya.CircleCollider);
		circleCollider.radius = radius * ratio;
		this.addGroup(rigidbody, ratio);
	}
	addGroup(rigidbody, ratio) {
		switch (ratio) {
			case 1:
				rigidbody.group = Physics_CollisionFiltering.k_smallGroup;
				break;
			case 2:
				rigidbody.group = Physics_CollisionFiltering.k_middleGroup;
				break;
			case 3:
				rigidbody.group = Physics_CollisionFiltering.k_largeGroup;
				break;
		}
	}
	mouseDown(e) {
		this.curTarget = e.target;
		let mouseJoint = this.curTarget.addComponent(Laya.MouseJoint);
		Laya.Laya.timer.callLater(mouseJoint, mouseJoint.onMouseDown);
		Laya.Laya.stage.on(Laya.Event.MOUSE_UP, this, this.destoryJoint);
		Laya.Laya.stage.on(Laya.Event.MOUSE_OUT, this, this.destoryJoint);
	}
	mouseMove(e) {
		let movementX = e.nativeEvent.movementX;
		let movementY = e.nativeEvent.movementY;
		this.preMovementX = movementX;
		this.preMovementY = movementY;
		this.curTarget.pos(Laya.Laya.stage.mouseX, Laya.Laya.stage.mouseY);
	}
	mouseUp() {
		Laya.Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
		Laya.Laya.stage.off(Laya.Event.MOUSE_UP, this, this.mouseUp);
		Laya.Laya.stage.off(Laya.Event.MOUSE_OUT, this, this.mouseUp);
		let rigidbody = this.curTarget.getComponent(Laya.RigidBody);
		rigidbody.type = "dynamic";
		rigidbody.linearVelocity = [this.preMovementX, this.preMovementY];
		this.curTarget = null;
	}
	destoryJoint() {
		Laya.Laya.stage.off(Laya.Event.MOUSE_UP, this, this.destoryJoint);
		Laya.Laya.stage.off(Laya.Event.MOUSE_OUT, this, this.destoryJoint);
		let mouseJoint = this.curTarget.getComponent(Laya.MouseJoint);
		mouseJoint.destroy();
		this.curTarget = null;
	}
	dispose() {
		Laya.Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
		Laya.Laya.stage.off(Laya.Event.MOUSE_UP, this, this.mouseUp);
		Laya.Laya.stage.off(Laya.Event.MOUSE_OUT, this, this.mouseUp);
		Laya.Laya.stage.off(Laya.Event.MOUSE_UP, this, this.destoryJoint);
		Laya.Laya.stage.off(Laya.Event.MOUSE_OUT, this, this.destoryJoint);
	}
}
new Physics_CollisionFiltering();