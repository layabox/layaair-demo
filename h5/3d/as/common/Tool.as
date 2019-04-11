package common {
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.pixelLine.PixelLineSprite3D;
	import laya.d3.graphics.VertexBuffer3D;
	import laya.d3.math.Color;
	import laya.d3.math.Vector3;
	import laya.d3.resource.models.Mesh;
	import laya.d3.resource.models.PrimitiveMesh;
	
	/**
	 * ...
	 * @author
	 */
	public class Tool {
		private static var corners:Vector.<Vector3> = new Vector.<Vector3>;
		private static var lineWidth:int = 0.1;
		public static function linearModel(sprite3D:Sprite3D, lineSprite3D:PixelLineSprite3D, color:Color):void {
			var vertex1:Vector3 = new Vector3();
			var vertex2:Vector3 = new Vector3();
			var vertex3:Vector3 = new Vector3();
			var lineCount:int = 0;
			if (sprite3D is MeshSprite3D) {
				var meshSprite3D:MeshSprite3D = sprite3D as MeshSprite3D;
				var mesh:Mesh = meshSprite3D.meshFilter.sharedMesh as Mesh;
				
				var vbBuffer:VertexBuffer3D = mesh._vertexBuffers[0];
				
				var vbBufferData:Float32Array = vbBuffer.getData();
				var ibBufferData:Uint16Array = mesh._indexBuffer.getData();
				var vertexStrideCount:int = vbBuffer.vertexDeclaration.vertexStride / 4;
				var loopCount:int = 0;
				var index:int = 0;
				
				for (var i:int = 0; i < ibBufferData.length; i += 3) {
					loopCount = 0;
					index = 0;
					vertex1.x = vbBufferData[ibBufferData[i + loopCount] * vertexStrideCount + index++];
					vertex1.y = vbBufferData[ibBufferData[i + loopCount] * vertexStrideCount + index++];
					vertex1.z = vbBufferData[ibBufferData[i + loopCount] * vertexStrideCount + index++];
					loopCount++;
					
					index = 0;
					vertex2.x = vbBufferData[ibBufferData[i + loopCount] * vertexStrideCount + index++];
					vertex2.y = vbBufferData[ibBufferData[i + loopCount] * vertexStrideCount + index++];
					vertex2.z = vbBufferData[ibBufferData[i + loopCount] * vertexStrideCount + index++];
					loopCount++;
					
					index = 0;
					vertex3.x = vbBufferData[ibBufferData[i + loopCount] * vertexStrideCount + index++];
					vertex3.y = vbBufferData[ibBufferData[i + loopCount] * vertexStrideCount + index++];
					vertex3.z = vbBufferData[ibBufferData[i + loopCount] * vertexStrideCount + index++];
					loopCount++;
					Vector3.transformCoordinate(vertex1, meshSprite3D.transform.worldMatrix, vertex1);
					Vector3.transformCoordinate(vertex2, meshSprite3D.transform.worldMatrix, vertex2);
					Vector3.transformCoordinate(vertex3, meshSprite3D.transform.worldMatrix, vertex3);
					lineSprite3D.addLine(vertex1, vertex2, color, color);
					lineSprite3D.addLine(vertex2, vertex3, color, color);
					lineSprite3D.addLine(vertex3, vertex1, color, color);
				}
			}
			
			for (var i:int = 0, n:int = sprite3D.numChildren; i < n; i++)
				linearModel(sprite3D.getChildAt(i) as Sprite3D, lineSprite3D, color);
		
		}
		
		public static function DrawBoundingBox(sprite3D:Sprite3D, sprite:Sprite3D, color:Color):void {
			var boundingBox:BoundBox = sprite3D.meshRenderer.boundingBox;
			boundingBox.getCorners(corners);
			/*lineSprite3D.addLine(corners[0], corners[1], Color.RED, Color.RED);
			lineSprite3D.addLine(corners[1], corners[2], Color.RED, Color.RED);
			lineSprite3D.addLine(corners[2], corners[3], Color.RED, Color.RED);
			lineSprite3D.addLine(corners[3], corners[0], Color.RED, Color.RED);
			lineSprite3D.addLine(corners[4], corners[5], Color.RED, Color.RED);
			lineSprite3D.addLine(corners[5], corners[6], Color.RED, Color.RED);
			lineSprite3D.addLine(corners[6], corners[7], Color.RED, Color.RED);
			lineSprite3D.addLine(corners[7], corners[4], Color.RED, Color.RED);
			lineSprite3D.addLine(corners[0], corners[4], Color.RED, Color.RED);
			lineSprite3D.addLine(corners[1], corners[5], Color.RED, Color.RED);
			lineSprite3D.addLine(corners[2], corners[6], Color.RED, Color.RED);
			lineSprite3D.addLine(corners[3], corners[7], Color.RED, Color.RED);*/
			
			var rotate:Vector3 = new Vector3(0, 0, 90);
			DrawTwelveLines(corners[0], corners[1], rotate,sprite );
			rotate.setValue(0, 0, 0);
			DrawTwelveLines(corners[1], corners[2], rotate ,sprite);
			rotate.setValue(0, 0, 90);
			DrawTwelveLines(corners[2], corners[3], rotate ,sprite);
			rotate.setValue(0, 0, 0);
			DrawTwelveLines(corners[3], corners[0], rotate , sprite);
			
			rotate.setValue(0, 0, 90);
			DrawTwelveLines(corners[4], corners[5], rotate ,sprite);
			rotate.setValue(0, 0, 0);
			DrawTwelveLines(corners[5], corners[6], rotate , sprite);
			rotate.setValue(0, 0, 90);
			DrawTwelveLines(corners[6], corners[7], rotate ,sprite);
			rotate.setValue(0, 0, 0);
			DrawTwelveLines(corners[7], corners[4], rotate , sprite);
			
			rotate.setValue(90, 0, 0);
			DrawTwelveLines(corners[0], corners[4], rotate ,sprite);
			rotate.setValue(90, 0, 0);
			DrawTwelveLines(corners[1], corners[5], rotate , sprite);
			
			rotate.setValue(90, 0, 0);
			DrawTwelveLines(corners[2], corners[6], rotate ,sprite);
			rotate.setValue(90, 0, 0);
			DrawTwelveLines(corners[3], corners[7], rotate ,sprite);
			
			
			
			/*for (var i:int = 0; i < 12; i++ ){
				
			}
			var length:Number = Math.abs(corners[0].x - corners[1].x);
			var cylinder:MeshSprite3D = scene.addChild(new MeshSprite3D(PrimitiveMesh.createCylinder(0.004, length, 8))) as MeshSprite3D;
			cylinder.transform.rotate(new Vector3(0, 0, 90), false, false);
			var cylPos:Vector3 = cylinder.transform.position;
			var x:Number = corners[0].x + corners[1].x; 
			var y:Number = corners[0].y + corners[1].y;
			var z:Number = corners[0].z + corners[1].z;
			cylPos.setValue(x / 2, y / 2, z / 2);
			cylinder.transform.position = cylPos;*/
			
			
		}
		private static function DrawTwelveLines(start:Vector3, end:Vector3, rotate:Vector3 ,sprite3D:Sprite3D):void {
			var length:Number = Vector3.distance(start, end);
			var cylinder:MeshSprite3D = sprite3D.addChild(new MeshSprite3D(PrimitiveMesh.createCylinder(0.004, length, 3))) as MeshSprite3D;
			cylinder.transform.rotate(rotate, true, false);
			var cylPos:Vector3 = cylinder.transform.position;
			var x:Number = start.x + end.x; 
			var y:Number = start.y + end.y;
			var z:Number = start.z + end.z;
			cylPos.setValue(x / 2, y / 2, z / 2);
			cylinder.transform.position = cylPos;
		}
		
		public function Tool() {
		
		}
	
	}

}