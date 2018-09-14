class Shader_Simple {
    private rotation:Laya.Vector3 = new Laya.Vector3(0, 0.01, 0);
    constructor() {
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        
        this.initShader();
        
        var scene:Laya.Scene3D = Laya.stage.addChild(new Laya.Scene3D()) as Laya.Scene3D;
        
        var camera:Laya.Camera = (scene.addChild(new Laya.Camera(0, 0.1, 100))) as Laya.Camera;
        camera.transform.translate(new Laya.Vector3(0, 0.5, 1.5));
        camera.addComponent(CameraMoveScript);
        
        Laya.Mesh.load("../../res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/LayaMonkey-LayaMonkey.lm", Laya.Handler.create(this, function(mesh:Laya.Mesh):void {
            var layaMonkey:Laya.MeshSprite3D = scene.addChild(new Laya.MeshSprite3D(mesh)) as Laya.MeshSprite3D;
            layaMonkey.transform.localScale = new Laya.Vector3(0.3, 0.3, 0.3);
            layaMonkey.transform.rotation = new Laya.Quaternion(0.7071068, 0, 0, -0.7071067);
            
            var customMaterial:CustomMaterial = new CustomMaterial();
            layaMonkey.meshRenderer.sharedMaterial = customMaterial;
            
            Laya.timer.frameLoop(1, this, function():void {
                layaMonkey.transform.rotate(this.rotation, false);
            });
        }));
        
    }
    private initShader(): void {
        var attributeMap:Object = {
            'a_Position': Laya.VertexMesh.MESH_POSITION0, 
            'a_Normal': Laya.VertexMesh.MESH_NORMAL0
        };
        var uniformMap:Object = {
            'u_MvpMatrix': [Laya.Sprite3D.MVPMATRIX, Laya.Shader3D.PERIOD_SPRITE], 
            'u_WorldMat': [Laya.Sprite3D.WORLDMATRIX, Laya.Shader3D.PERIOD_SPRITE]
        };
        var vs:string ="attribute vec4 a_Position;\n"+
        "uniform mat4 u_MvpMatrix;\n"+
        "uniform mat4 u_WorldMat;\n"+
        "attribute vec3 a_Normal;\n"+
        "varying vec3 v_Normal;\n"+
        "void main()\n"+
        "{\n"+
        "gl_Position = u_MvpMatrix * a_Position;\n"+
        "mat3 worldMat=mat3(u_WorldMat);\n"+
        "v_Normal=worldMat*a_Normal;\n"+
        "}";
        var ps:string = "#ifdef FSHIGHPRECISION\n"+
        "precision highp float;\n"+
        "#else\n"+
        "precision mediump float;\n"+
        "#endif\n"+
        "varying vec3 v_Normal;\n" +
        "void main()\n"+
        "{\n"+
        "gl_FragColor=vec4(v_Normal,1.0);\n"+
        "}";      
        var customShader:Laya.Shader3D = Laya.Shader3D.add("CustomShader", attributeMap, uniformMap);
        
        customShader.addShaderPass(vs, ps);
    }
}
new Shader_Simple;