class Tool{
	constructor(){

	}
	static linearModel(sprite3D, lineSprite3D, color){
		debugger;
		var vertex1 = new Laya.Vector3();
        var vertex2 = new Laya.Vector3();
        var vertex3 = new Laya.Vector3();
        var lineCount = 0;
        if (sprite3D instanceof Laya.MeshSprite3D) {
            var meshSprite3D = sprite3D;
            var mesh = meshSprite3D.meshFilter.sharedMesh;
         
            var vbBuffer = mesh._vertexBuffers ? mesh._vertexBuffers[0] : mesh._primitveGeometry._vertexBuffer;
            var vbBufferData = vbBuffer.getData();
            var ibBufferData = mesh._indexBuffer ? mesh._indexBuffer.getData() : mesh._primitveGeometry._indexBuffer.getData();
            var vertexStrideCount = vbBuffer.vertexDeclaration.vertexStride / 4;
            var loopCount = 0;
            var index = 0;
            for (var i = 0; i < ibBufferData.length; i += 3) {
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
                Laya.Vector3.transformCoordinate(vertex1, meshSprite3D.transform.worldMatrix, vertex1);
                Laya.Vector3.transformCoordinate(vertex2, meshSprite3D.transform.worldMatrix, vertex2);
                Laya.Vector3.transformCoordinate(vertex3, meshSprite3D.transform.worldMatrix, vertex3);
                lineSprite3D.setLine(lineCount++, vertex1, vertex2, color, color);
                lineSprite3D.setLine(lineCount++, vertex2, vertex3, color, color);
                lineSprite3D.setLine(lineCount++, vertex3, vertex1, color, color);
            }
        }
        for (var i = 0, n = sprite3D.numChildren; i < n; i++)
            this.linearModel(sprite3D.getChildAt(i), lineSprite3D, color);
	}
}
