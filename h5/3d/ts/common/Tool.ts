class Tool {
    constructor() {

    }
    public static linearModel(sprite3D:Laya.Sprite3D, lineSprite3D:Laya.PixelLineSprite3D, color:Laya.Vector4):void 
    {
        var vertex1:Laya.Vector3 = new Laya.Vector3();
        var vertex2:Laya.Vector3 = new Laya.Vector3();
        var vertex3:Laya.Vector3 = new Laya.Vector3();
        
        var lineCount:number = 0;
        if (sprite3D instanceof Laya.MeshSprite3D) {
            var meshSprite3D:Laya.MeshSprite3D = sprite3D as Laya.MeshSprite3D;
            var mesh:Laya.Mesh = meshSprite3D.meshFilter.sharedMesh as Laya.Mesh;
            
         
            var vbBuffer:Laya.VertexBuffer3D = mesh._vertexBuffers ? mesh._vertexBuffers[0] : mesh._primitveGeometry._vertexBuffer;
            
            var vbBufferData:Float32Array = vbBuffer.getData();
            var ibBufferData:Uint16Array = mesh._indexBuffer ? mesh._indexBuffer.getData() : mesh._primitveGeometry._indexBuffer.getData();
            var vertexStrideCount:number = vbBuffer.vertexDeclaration.vertexStride / 4;
            var loopCount:number = 0;
            var index:number = 0;
            
            for (var i:number = 0; i < ibBufferData.length; i += 3) {
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
        
        for (var i:number = 0, n:number = sprite3D.numChildren; i < n; i++)
            this.linearModel(sprite3D.getChildAt(i), lineSprite3D, color);
    
    }
    public Tool() {
		
    }

       
}