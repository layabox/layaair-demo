class Tool{
	constructor(){

	}
	static linearModel(sprite3D, lineSprite3D, color){
		if (sprite3D instanceof Laya.MeshSprite3D) {
			var meshSprite3D = sprite3D;
			var mesh = meshSprite3D.meshFilter.sharedMesh;
			var positions = [];
			mesh.getPositions(positions);
			var indices = mesh.getSubMesh(0).getIndices();

			for (var i = 0; i < indices.length; i += 3) {
				var vertex0 = positions[indices[i]];
				var vertex1 = positions[indices[i + 1]];
				var vertex2 = positions[indices[i + 2]];
				Laya.Vector3.transformCoordinate(vertex0, meshSprite3D.transform.worldMatrix, this.transVertex0);
				Laya.Vector3.transformCoordinate(vertex1, meshSprite3D.transform.worldMatrix, this.transVertex1);
				Laya.Vector3.transformCoordinate(vertex2, meshSprite3D.transform.worldMatrix, this.transVertex2);
				lineSprite3D.addLine(this.transVertex0, this.transVertex1, color, color);
				lineSprite3D.addLine(this.transVertex1, this.transVertex2, color, color);
				lineSprite3D.addLine(this.transVertex2, this.transVertex0, color, color);
			}
		}

		for (var i = 0, n = sprite3D.numChildren; i < n; i++)
			Tool.linearModel((sprite3D.getChildAt(i)), lineSprite3D, color);
    }

}
Tool.transVertex0 = new Laya.Vector3();
Tool.transVertex1 = new Laya.Vector3();
Tool.transVertex2 = new Laya.Vector3();