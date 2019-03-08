
export default class Tool {
    constructor() {

    }
		
    static linearModel(sprite3D:Laya.Sprite3D, lineSprite3D:Laya.PixelLineSprite3D, color:Laya.Color):void {
        var vertex1:Laya.Vector3 = new Laya.Vector3();
        var vertex2:Laya.Vector3 = new Laya.Vector3();
        var vertex3:Laya.Vector3 = new Laya.Vector3();
        
        var lineCount = 0;
        if (sprite3D instanceof Laya.MeshSprite3D) {
            var meshSprite3D:Laya.MeshSprite3D = sprite3D as Laya.MeshSprite3D;
            var mesh:Laya.Mesh = meshSprite3D.meshFilter.sharedMesh as Laya.Mesh;
            
            var vbBuffer:Laya.VertexBuffer3D = mesh._vertexBuffers[0];
            
            var vbBufferData:Float32Array = vbBuffer.getData();
            var ibBufferData:Uint16Array = mesh._indexBuffer.getData();
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
                lineSprite3D.addLine(vertex1, vertex2, color, color);
                lineSprite3D.addLine(vertex2, vertex3, color, color);
                lineSprite3D.addLine(vertex3, vertex1, color, color);
            }
        }
        
        for (var i = 0, n = sprite3D.numChildren; i < n; i++)
            this.linearModel(sprite3D.getChildAt(i) as Laya.Sprite3D, lineSprite3D, color);
    
    }
    
    Tool() {
    
    }

}
