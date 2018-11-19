package common {
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.pixelLine.PixelLineSprite3D;
	import laya.d3.graphics.VertexBuffer3D;
	import laya.d3.math.Color;
	import laya.d3.math.Vector3;
	import laya.d3.math.Vector4;
	import laya.d3.resource.models.Mesh;
	import laya.d3.resource.models.PrimitiveMesh;
	
	/**
	 * ...
	 * @author
	 */
	public class Tool {
		
		public static function linearModel(sprite3D:Sprite3D, lineSprite3D:PixelLineSprite3D, color:Color):void {
			var vertex1:Vector3 = new Vector3();
			var vertex2:Vector3 = new Vector3();
			var vertex3:Vector3 = new Vector3();
			
			var lineCount:int = 0;
			if (sprite3D is MeshSprite3D) {
				var meshSprite3D:MeshSprite3D = sprite3D as MeshSprite3D;
				var mesh:Mesh = meshSprite3D.meshFilter.sharedMesh as Mesh;
				
				var vbBuffer:VertexBuffer3D = mesh._vertexBuffers ? mesh._vertexBuffers[0] : (mesh as PrimitiveMesh)._primitveGeometry._vertexBuffer;
				
				var vbBufferData:Float32Array = vbBuffer.getData();
				var ibBufferData:Uint16Array = mesh._indexBuffer ? mesh._indexBuffer.getData() : (mesh as PrimitiveMesh)._primitveGeometry._indexBuffer.getData();
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
		
		public function Tool() {
		
		}
	
	}

}