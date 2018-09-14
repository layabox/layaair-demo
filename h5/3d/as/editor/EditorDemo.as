package editor {
	import laya.d3.core.Camera;
	import laya.d3.core.RenderableSprite3D;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.render.RenderContext3D;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.graphics.Vertex.VertexMesh;
	import laya.d3.math.Vector2;
	import laya.d3.math.Vector3;
	import laya.d3.math.Vector4;
	import laya.d3.resource.RenderTexture;
	import laya.d3.shader.Shader3D;
	import laya.d3Editor.EditerScene3D;
	import laya.d3Editor.TransformSprite3D;
	import laya.d3Editor.component.EditerCameraScript;
	import laya.display.Sprite;
	import laya.display.Stage;
	import laya.events.Event;
	import laya.utils.Handler;
	import laya.utils.Stat;
	import laya.webgl.resource.BaseTexture;
	
	/**
	 * ...
	 * @author
	 */
	public class EditorDemo {
		
		private var camera:Camera;
		private var renderTargetCamera:Camera;
		private var editerScene3d:EditerScene3D;
		private var transformSprite3d:TransformSprite3D;
		
		private var shader:Shader3D;
		
		private var renderSizeWidth:int;
		private var renderSizeHeight:int;
		
		private var lastX:Number;
		private var lastY:Number;
		private var curX:Number;
		private var curY:Number;
		private var delX:Number;
		private var delY:Number;
		
		private var sprite:Sprite;
		
		public function EditorDemo() {
			
			Shader3D.debugMode = true;
			var config:Config3D = new Config3D();
			config._editerEnvironment = true;
			Laya3D.init(0, 0, config);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			Stat.show();
			
			Scene3D.load("../../../../res/threeDimen/GPUPick/New Scene.ls", Handler.create(this, onSceneLoaded));
		}
		
		public function onSceneLoaded(scene:Scene3D):void {
			
			Laya.stage.addChild(scene);
			editerScene3d = new EditerScene3D(scene);
			
			camera = scene.getChildByName("Main Camera") as Camera;
			var camScript:EditerCameraScript = camera.addComponent(EditerCameraScript) as EditerCameraScript;
			camScript.scene = editerScene3d;
			renderTargetCamera = scene.addChild(camera.clone()) as Camera;
			renderTargetCamera.enableRender = false;
			renderTargetCamera.renderingOrder = -1;
			renderTargetCamera.clearColor = new Vector4(0.0, 0.0, 0.0, 0.0);
			
			transformSprite3d = editerScene3d.transformSprite3D;
			transformSprite3d.curCamera = camera;
			
			initShader();
			
			onResize();
			
			addEvent();
			
			
		}
		
		private function addEvent():void{
			Laya.stage.on(Event.RESIZE, this, onResize);
			Laya.stage.on(Event.MOUSE_DOWN, this, onMouseDown);
			Laya.stage.on(Event.MOUSE_UP, this, onMouseUp);
			Laya.stage.on(Event.RIGHT_MOUSE_DOWN, this, onRightMouseDown);
			Laya.stage.on(Event.RIGHT_MOUSE_UP, this, onRightMouseUp);
			Laya.stage.on(Event.KEY_DOWN, this, onKeyDown);
		}
		
		private function initShader():void{
			var attributeMap:Object = {
				'a_Position': VertexMesh.MESH_POSITION0
			};
			var uniformMap:Object = {
				'u_MvpMatrix': [Sprite3D.MVPMATRIX, Shader3D.PERIOD_SPRITE], 
				'u_PickColor': [RenderableSprite3D.PICKCOLOR, Shader3D.PERIOD_SPRITE]
			};
			var vs:String = __INCLUDESTR__("shader/color.vs");
			var ps:String = __INCLUDESTR__("shader/color.ps");
			shader = Shader3D.add("color", attributeMap, uniformMap);
			shader.addShaderPass(vs, ps);
		}
		
		private function onResize(e:Event = null):void {
			
			renderSizeWidth = RenderContext3D.clientWidth;
			renderSizeHeight = RenderContext3D.clientHeight;
			renderTargetCamera.renderTarget && renderTargetCamera.renderTarget.destroy();
			renderTargetCamera.renderTarget = new RenderTexture(renderSizeWidth, renderSizeHeight, BaseTexture.FORMAT_RGB_8_8_8);
		}
		
		private var curSelectSprite:Sprite3D;
		private var curTransformType:int;
		private var vector:Vector3 = new Vector3();
		private var tempV:Vector2 = new Vector2();
		
		private var curPos:Vector2 = new Vector2();
		private var delPos:Vector2 = new Vector2();
		private var delPosNormalize:Vector2 = new Vector2();
		private var lastPos:Vector2 = new Vector2();
		
		private var _transform:Vector3 = new Vector3();
		
		private var pointA:Vector3 = new Vector3();
		private var pointB:Vector3 = new Vector3();
		
		private function onMouseDown(e:Event = null):void {
			renderTargetCamera.render(shader);
			var pickSprite:Sprite3D = pickSpriteByPickColors(e.stageX, e.stageY);
			var name:String;
			if (pickSprite) {
				transformSprite3d.reFresh();
				if (!pickSprite.transformType) {
					curSelectSprite = pickSprite;
					curSelectSprite.transform.position.cloneTo(transformSprite3d.transform.position);
					transformSprite3d.transform.position = transformSprite3d.transform.position;
					curSelectSprite.transform.rotation.cloneTo(transformSprite3d.transform.rotation);
					transformSprite3d.transform.rotation = transformSprite3d.transform.rotation;
					
					var distance:Number = Vector3.distance(camera.transform.position, curSelectSprite.transform.position);
					transformSprite3d.transform.scale = new Vector3(distance * 0.25, distance * 0.25, distance * 0.2);
					transformSprite3d.active = true;
				} else {
					curTransformType = pickSprite.transformType;
					switch (curTransformType) {
						case 1: 
							vector = curSelectSprite.transform.right;
							transformSprite3d.onSelectChangeColor(transformSprite3d.positionX);
							break;
						case 2: 
							vector = curSelectSprite.transform.up;
							transformSprite3d.onSelectChangeColor(transformSprite3d.positionY);
							break;
						case 3: 
							vector = curSelectSprite.transform.forward;
							transformSprite3d.onSelectChangeColor(transformSprite3d.positionZ);
							break;
						case 4: 
							vector = curSelectSprite.transform.up;
							transformSprite3d.onSelectChangeColor(transformSprite3d.rotationX);
							break;
						case 5: 
							vector = curSelectSprite.transform.right;
							transformSprite3d.onSelectChangeColor(transformSprite3d.rotationY);
							break;
						case 6: 
							vector = curSelectSprite.transform.up;
							transformSprite3d.onSelectChangeColor(transformSprite3d.rotationZ);
							break;
						case 7: 
							vector = curSelectSprite.transform.right;
							transformSprite3d.onSelectChangeColor(transformSprite3d.scalingX);
							break;
						case 8: 
							vector = curSelectSprite.transform.up;
							transformSprite3d.onSelectChangeColor(transformSprite3d.scalingY);
							break;
						case 9: 
							vector = curSelectSprite.transform.forward;
							transformSprite3d.onSelectChangeColor(transformSprite3d.scalingZ);
							break;
						default: 
							break;
					}
					
					debugger;
					camera.worldToViewportPoint(curSelectSprite.transform.position, pointA);
					Vector3.add(curSelectSprite.transform.position, vector, vector);
					camera.worldToViewportPoint(vector, pointB);
					tempV.x = pointB.x - pointA.x;
					tempV.y = pointB.y - pointA.y;
					Vector2.normalize(tempV, tempV);
					
					Laya.stage.on(Event.MOUSE_MOVE, this, onMouseMove);
				}
			} else {
				transformSprite3d.active = false;
			}
			lastX = e.stageX;
			lastY = e.stageY;
		}
		
		private function onMouseMove(e:Event = null):void {
			curX = e.stageX;
			curY = e.stageY;
			delPos.x = (lastX - curX);
			delPos.y = (lastY - curY);
			
			Vector3.ZERO.cloneTo(_transform);
			Vector2.normalize(delPos, delPosNormalize);
			var radius:Number = Math.acos(Vector2.dot(delPosNormalize, tempV));
			var length:Number = Vector2.scalarLength(delPos);
			var positionRatio:Number = 0.01;
			var rotationRatio:Number = 0.008;
			var scaleRatio:Number = 0.004;
			var offset:Number = length * Math.cos(radius);
			switch (curTransformType) {
				case 1: 
					_transform.x = -offset * positionRatio;
					curSelectSprite.transform.translate(_transform);
					transformSprite3d.transform.translate(_transform);
					break;
				case 2: 
					_transform.y = -offset * positionRatio;
					curSelectSprite.transform.translate(_transform);
					transformSprite3d.transform.translate(_transform);
					break;
				case 3: 
					_transform.z = offset * positionRatio;
					curSelectSprite.transform.translate(_transform);
					transformSprite3d.transform.translate(_transform);
					break;
				case 4: 
					_transform.x = offset * rotationRatio;
					curSelectSprite.transform.rotate(_transform);
					transformSprite3d.transform.rotate(_transform);
					break;
				case 5: 
					_transform.y = -offset * rotationRatio;
					curSelectSprite.transform.rotate(_transform);
					transformSprite3d.transform.rotate(_transform);
					break;
				case 6: 
					_transform.z = -offset * rotationRatio;
					curSelectSprite.transform.rotate(_transform);
					transformSprite3d.transform.rotate(_transform);
					break;
				case 7: 
					_transform.x = -offset * scaleRatio;
					Vector3.add(curSelectSprite.transform.scale, _transform, curSelectSprite.transform.scale);
					curSelectSprite.transform.scale = curSelectSprite.transform.scale;
					break;
				case 8: 
					_transform.y = -offset * scaleRatio;
					Vector3.add(curSelectSprite.transform.scale, _transform, curSelectSprite.transform.scale);
					curSelectSprite.transform.scale = curSelectSprite.transform.scale;
					break;
				case 9: 
					_transform.z = offset * scaleRatio;
					Vector3.add(curSelectSprite.transform.scale, _transform, curSelectSprite.transform.scale);
					curSelectSprite.transform.scale = curSelectSprite.transform.scale;
					break;
				default: 
					break;
			}
			lastX = curX;
			lastY = curY;
		}
		
		private function onMouseUp(e:Event = null):void {
			Laya.stage.off(Event.MOUSE_MOVE, this, onMouseMove);
		}
		
		public function pickSpriteByPickColors(posx:Number, posy:Number):Sprite3D {
			var pixels:Uint8Array = new Uint8Array(renderSizeWidth * renderSizeHeight * 4);
			renderTargetCamera.renderTarget.getData(0, 0, renderSizeWidth, renderSizeHeight, pixels);
			var tempSprite:Sprite3D;
			//posx, posy
			var pickSprite:Sprite3D = pickSpriteByPickColor(posx, posy, pixels);
			if (pickSprite) {
				if (pickSprite.transformType) {
					return pickSprite;
				}
				tempSprite = pickSprite;
			}
			//posx+1, posy
			pickSprite = pickSpriteByPickColor(posx + 1, posy, pixels);
			if (pickSprite) {
				if (pickSprite.transformType) {
					return pickSprite;
				}
				tempSprite = pickSprite;
			}
			//posx-1, posy
			pickSprite = pickSpriteByPickColor(posx - 1, posy, pixels);
			if (pickSprite) {
				if (pickSprite.transformType) {
					return pickSprite;
				}
				tempSprite = pickSprite;
			}
			//posx, posy+1
			pickSprite = pickSpriteByPickColor(posx, posy + 1, pixels);
			if (pickSprite) {
				if (pickSprite.transformType) {
					return pickSprite;
				}
				tempSprite = pickSprite;
			}
			//posx, posy-1
			pickSprite = pickSpriteByPickColor(posx, posy - 1, pixels);
			if (pickSprite) {
				if (pickSprite.transformType) {
					return pickSprite;
				}
				tempSprite = pickSprite;
			}
			//posx-1, posy-1
			pickSprite = pickSpriteByPickColor(posx - 1, posy - 1, pixels);
			if (pickSprite) {
				if (pickSprite.transformType) {
					return pickSprite;
				}
				tempSprite = pickSprite;
			}
			//posx+1, posy-1
			pickSprite = pickSpriteByPickColor(posx + 1, posy - 1, pixels);
			if (pickSprite) {
				if (pickSprite.transformType) {
					return pickSprite;
				}
				tempSprite = pickSprite;
			}
			//posx-1, posy+1
			pickSprite = pickSpriteByPickColor(posx - 1, posy + 1, pixels);
			if (pickSprite) {
				if (pickSprite.transformType) {
					return pickSprite;
				}
				tempSprite = pickSprite;
			}
			//posx+1, posy+1
			pickSprite = pickSpriteByPickColor(posx + 1, posy + 1, pixels);
			if (pickSprite) {
				if (pickSprite.transformType) {
					return pickSprite;
				}
				tempSprite = pickSprite;
			}
			
			//posx+2, posy
			pickSprite = pickSpriteByPickColor(posx + 2, posy, pixels);
			if (pickSprite && pickSprite.transformType) {
				return pickSprite;
			}
			//posx-2, posy
			pickSprite = pickSpriteByPickColor(posx - 2, posy, pixels);
			if (pickSprite && pickSprite.transformType) {
				return pickSprite;
			}
			//posx, posy+2
			pickSprite = pickSpriteByPickColor(posx, posy + 2, pixels);
			if (pickSprite && pickSprite.transformType) {
				return pickSprite;
			}
			//posx, posy-2
			pickSprite = pickSpriteByPickColor(posx, posy - 2, pixels);
			if (pickSprite && pickSprite.transformType) {
				return pickSprite;
			}
			
			//posx+2, posy-1
			pickSprite = pickSpriteByPickColor(posx + 2, posy - 1, pixels);
			if (pickSprite && pickSprite.transformType) {
				return pickSprite;
			}
			//posx+2, posy+1
			pickSprite = pickSpriteByPickColor(posx + 2, posy + 1, pixels);
			if (pickSprite && pickSprite.transformType) {
				return pickSprite;
			}
			//posx-2, posy-1
			pickSprite = pickSpriteByPickColor(posx - 2, posy - 1, pixels);
			if (pickSprite && pickSprite.transformType) {
				return pickSprite;
			}
			//posx-2, posy+1
			pickSprite = pickSpriteByPickColor(posx - 2, posy + 1, pixels);
			if (pickSprite && pickSprite.transformType) {
				return pickSprite;
			}
			//posx-1, posy+2
			pickSprite = pickSpriteByPickColor(posx - 1, posy + 2, pixels);
			if (pickSprite && pickSprite.transformType) {
				return pickSprite;
			}
			//posx+1, posy+2
			pickSprite = pickSpriteByPickColor(posx + 1, posy + 2, pixels);
			if (pickSprite && pickSprite.transformType) {
				return pickSprite;
			}
			//posx-1, posy-2
			pickSprite = pickSpriteByPickColor(posx - 1, posy - 2, pixels);
			if (pickSprite && pickSprite.transformType) {
				return pickSprite;
			}
			//posx+1, posy-2
			pickSprite = pickSpriteByPickColor(posx + 1, posy - 2, pixels);
			if (pickSprite && pickSprite.transformType) {
				return pickSprite;
			}
			
			//posx-2, posy-2
			pickSprite = pickSpriteByPickColor(posx - 2, posy - 2, pixels);
			if (pickSprite && pickSprite.transformType) {
				return pickSprite;
			}
			//posx+2, posy-2
			pickSprite = pickSpriteByPickColor(posx + 2, posy - 2, pixels);
			if (pickSprite && pickSprite.transformType) {
				return pickSprite;
			}
			//posx-2, posy+2
			pickSprite = pickSpriteByPickColor(posx - 2, posy + 2, pixels);
			if (pickSprite && pickSprite.transformType) {
				return pickSprite;
			}
			//posx+2, posy+2
			pickSprite = pickSpriteByPickColor(posx + 2, posy + 2, pixels);
			if (pickSprite && pickSprite.transformType) {
				return pickSprite;
			}
			
			return tempSprite;
		}
		
		public function pickSpriteByPickColor(posx:Number, posy:Number, pixels:Uint8Array):Sprite3D {
			
			if (posx < 0 || posy < 0) {
				return null;
			}
			
			var index:int = posy * renderSizeWidth * 4 + posx * 4;
			var color:Vector4 = new Vector4(pixels[index], pixels[index + 1], pixels[index + 2], 1.0);
			//debugger;
			var id:int = editerScene3d.scene._searchIDByPickColor(color);
			var pickSprite:Sprite3D = editerScene3d.scene._pickIdToSprite[id];
			if (pickSprite) {
				return pickSprite;
			}
			return null;
		}
		
		/**键盘按下处理*/
		private function onKeyDown(e:* = null):void {
			if (!keyBoardIsOk) {
				return;
			}
			if (e["keyCode"] == 87) {
				curSelectSprite && (transformSprite3d.positionSprite3D.active = true);
				curSelectSprite && (transformSprite3d.rotationSprite3D.active = false);
				curSelectSprite && (transformSprite3d.scaleSprite3D.active = false);
			} else if (e["keyCode"] == 69) {
				curSelectSprite && (transformSprite3d.positionSprite3D.active = false);
				curSelectSprite && (transformSprite3d.rotationSprite3D.active = true);
				curSelectSprite && (transformSprite3d.scaleSprite3D.active = false);
			} else if (e["keyCode"] == 82) {
				curSelectSprite && (transformSprite3d.positionSprite3D.active = false);
				curSelectSprite && (transformSprite3d.rotationSprite3D.active = false);
				curSelectSprite && (transformSprite3d.scaleSprite3D.active = true);
			}
		}
		private var keyBoardIsOk = true;
		
		private function onRightMouseDown():void {
			keyBoardIsOk = false;
		}
		
		private function onRightMouseUp():void {
			keyBoardIsOk = true;
		}
	}
}