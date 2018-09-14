package advancedModule {
	import laya.d3.core.Camera;
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.light.DirectionLight;
	import laya.d3.core.material.BlinnPhongMaterial;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Vector3;
	import laya.d3.math.Vector4;
	import laya.d3.physics.PhysicsCollider;
	import laya.d3.physics.Rigidbody3D;
	import laya.d3.physics.shape.BoxColliderShape;
	import laya.d3.physics.shape.CapsuleColliderShape;
	import laya.d3.resource.models.BoxMesh;
	import laya.d3.resource.models.CapsuleMesh;
	import laya.d3.resource.models.PlaneMesh;
	import laya.display.Stage;
	import laya.display.Text;
	import laya.utils.Handler;
	import laya.webgl.resource.Texture2D;
	
	/**
	 * ...
	 * @author ...
	 */
	public class TouchScriptSample {
		private var text:Text;
		private var scene:Scene3D;
		private var camera:Camera;
		private var kinematicSphere:Sprite3D;
		
		public function TouchScriptSample() {
			Laya3D.init(0, 0, null);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			//Stat.show();
			scene = Laya.stage.addChild(new Scene3D()) as Scene3D;
			
			camera = scene.addChild(new Camera(0, 0.1, 100)) as Camera;
			camera.transform.translate(new Vector3(0, 8, 20));
			camera.transform.rotate(new Vector3(-30, 0, 0), true, false);
			camera.clearColor = null;
			
			var directionLight:DirectionLight = scene.addChild(new DirectionLight()) as DirectionLight;
			directionLight.color = new Vector3(1, 1, 1);
			directionLight.transform.worldMatrix.setForward(new Vector3(-1.0, -1.0, 1.0));
			
			var plane:MeshSprite3D = scene.addChild(new MeshSprite3D(new PlaneMesh(20, 20, 10, 10))) as MeshSprite3D;
			var planeMat:BlinnPhongMaterial = new BlinnPhongMaterial();
			Texture2D.load("../../../../res/threeDimen/Physics/wood.jpg", Handler.create(null, function(tex:Texture2D):void {
				planeMat.albedoTexture = tex;
			}));
			planeMat.tilingOffset = new Vector4(2, 2, 0, 0);
			plane.meshRenderer.material = planeMat;
			
			var rigidBody:PhysicsCollider = plane.addComponent(PhysicsCollider) as PhysicsCollider;
			var boxShape:BoxColliderShape = new BoxColliderShape(20, 0, 20);
			rigidBody.colliderShape = boxShape;
			
			text = new Text();
			text.pos(20, 20);
			text.fontSize = 16;
			text.color = "yellow";
			
			addBox();
			addCapsule();
			Laya.stage.addChild(text);
		}
		
		public function addBox():void {
			var mat1:BlinnPhongMaterial = new BlinnPhongMaterial();
			Texture2D.load("../../../../res/threeDimen/Physics/rocks.jpg", Handler.create(null, function(tex:Texture2D):void {
				mat1.albedoTexture = tex;
			}));
			
			var sX:int = Math.random() * 0.75 + 0.25;
			var sY:int = Math.random() * 0.75 + 0.25;
			var sZ:int = Math.random() * 0.75 + 0.25;
			var box:MeshSprite3D = scene.addChild(new MeshSprite3D(new BoxMesh(sX, sY, sZ))) as MeshSprite3D;
			box.meshRenderer.material = mat1;
			box.transform.position = new Vector3(Math.random() * 4 - 2, 2, Math.random() * 4 - 2);
			box.transform.rotationEuler = new Vector3(Math.random() * 360, Math.random() * 360, Math.random() * 360);
			
			var rigidBody:Rigidbody3D = box.addComponent(Rigidbody3D);
			var boxShape:BoxColliderShape = new BoxColliderShape(sX, sY, sZ);
			rigidBody.colliderShape = boxShape;
			rigidBody.mass = 10;
			
			var script:TouchScript = box.addComponent(TouchScript) as TouchScript;
			script.header = "BOX: ";
			script.text = text;
		}
		
		public function addCapsule():void {
			var mat3:BlinnPhongMaterial = new BlinnPhongMaterial();
			Texture2D.load("../../../../res/threeDimen/Physics/wood.jpg", Handler.create(null, function(tex:Texture2D):void {
				mat3.albedoTexture = tex;
			}));
			
			var raidius:int = Math.random() * 0.2 + 0.2;
			var height:int = Math.random() * 0.5 + 0.8;
			var capsule:MeshSprite3D = scene.addChild(new MeshSprite3D(new CapsuleMesh(raidius, height))) as MeshSprite3D;
			capsule.meshRenderer.material = mat3;
			capsule.transform.position = new Vector3(Math.random() * 4 - 2, 2, Math.random() * 4 - 2);
			capsule.transform.rotationEuler = new Vector3(Math.random() * 360, Math.random() * 360, Math.random() * 360);
			
			var rigidBody:Rigidbody3D = capsule.addComponent(Rigidbody3D);
			var sphereShape:CapsuleColliderShape = new CapsuleColliderShape(raidius, height);
			rigidBody.colliderShape = sphereShape;
			rigidBody.mass = 10;
			
			var script:TouchScript = capsule.addComponent(TouchScript) as TouchScript;
			script.header = "Capsule: ";
			script.text = text;
		}
	}
}

import laya.d3.component.Script3D;
import laya.display.Text;
import laya.utils.Stat;

class TouchScript extends Script3D {
	public var header:String;
	public var subText:String = "";
	public var count:int = 0;
	public var text:Text;
	
	override public function onUpdate():void {
		if (count === 24) {
			var t:String = text.text;
			var index:int = t.indexOf("\n");
			t = t.slice(index + 1, t.length);
			text.text = t;
			count--;
		}
		if (subText !== "") {
			text.text += header + subText + "\n";
			subText = "";
			count++;
		}
	}
	
	override public function onMouseEnter():void {
		subText += "onMouseEnter  ";
	}
	
	override public function onMouseOver():void {
		subText += "onMouseOver  ";
	}
	
	override public function onMouseOut():void {
		subText += "onMouseOut  ";
	}
	
	override public function onMouseDown():void {
		subText += "onMouseDown  ";
	}
	
	override public function onMouseUp():void {
		subText += "onMouseUp  ";
	}
	
	override public function onMouseClick():void {
		subText += "onMouseClick  ";
	}
	
	override public function onMouseDrag():void {
		subText += "onMouseDrag  ";
	}
}
