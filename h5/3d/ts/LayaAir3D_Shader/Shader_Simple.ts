import CameraMoveScript from "./common/CameraMoveScript"
import CustomMaterial from "./customMaterials/CustomMaterial"
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
        
        Laya.Mesh.load("res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/LayaMonkey-LayaMonkey.lm", Laya.Handler.create(this, function(mesh:Laya.Mesh):void {
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
            'u_MvpMatrix': Laya.Shader3D.PERIOD_SPRITE, 
            'u_WorldMat': Laya.Shader3D.PERIOD_SPRITE
        };
        var vs:string = `
        #include "Lighting.glsl"; 
        attribute vec4 a_Position;
        uniform mat4 u_MvpMatrix;
        uniform mat4 u_WorldMat;
        attribute vec3 a_Normal;
        varying vec3 v_Normal;
        void main()
        {
        gl_Position = u_MvpMatrix * a_Position;
        mat3 worldMat=mat3(u_WorldMat);
        v_Normal=worldMat*a_Normal;
        gl_Position=remapGLPositionZ(gl_Position); 
        }`;
        var ps:string = `
        #ifdef FSHIGHPRECISION
        precision highp float;
        #else
        precision mediump float;
        #endif
        varying vec3 v_Normal;
        void main()
        {
        gl_FragColor=vec4(v_Normal,1.0);
        }`;      

		var customShader:Laya.Shader3D = Laya.Shader3D.add("CustomShader");
		var subShader:Laya.SubShader =new Laya.SubShader(attributeMap, uniformMap);
		customShader.addSubShader(subShader);
		subShader.addShaderPass(vs, ps);
    }
}
new Shader_Simple;