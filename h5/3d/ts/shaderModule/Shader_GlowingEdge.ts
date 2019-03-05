import CameraMoveScript from "./common/CameraMoveScript"
import CustomMaterial from "./customMaterials/CustomMaterial"
class Shader_GlowingEdge {
    private rotation:Laya.Vector3 = new Laya.Vector3(0, 0.01, 0);
    constructor() {
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        
        this.initShader();
        
        var scene:Laya.Scene3D = Laya.stage.addChild(new Laya.Scene3D()) as Laya.Scene3D;
        
        var camera:Laya.Camera = (scene.addChild(new Laya.Camera(0, 0.1, 1000))) as Laya.Camera;
        camera.transform.translate(new Laya.Vector3(0, 0.85, 1.7));
        camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
        camera.addComponent(CameraMoveScript);
        
        var directionLight:Laya.DirectionLight = scene.addChild(new Laya.DirectionLight()) as Laya.DirectionLight;
        directionLight.color = new Laya.Vector3(1, 1, 1);
        
        Laya.Sprite3D.load("../res/threeDimen/skinModel/dude/dude.lh", Laya.Handler.create(this, function(dude:Laya.Sprite3D):void {
            scene.addChild(dude);
            
            var customMaterial1:CustomMaterial = new CustomMaterial();
            Laya.Texture2D.load("../res/threeDimen/skinModel/dude/Assets/dude/head.png", Laya.Handler.create(this, function(tex:Laya.Texture2D):void {
                customMaterial1.diffuseTexture = tex;
            }));
            customMaterial1.marginalColor = new Laya.Vector3(1, 0.7, 0);
            
            var customMaterial2:CustomMaterial = new CustomMaterial();
            Laya.Texture2D.load("../res/threeDimen/skinModel/dude/Assets/dude/jacket.png", Laya.Handler.create(this, function(tex:Laya.Texture2D):void {
                customMaterial2.diffuseTexture = tex;
            }));
            customMaterial2.marginalColor = new Laya.Vector3(1, 0.7, 0);
            
            var customMaterial3:CustomMaterial = new CustomMaterial();
            Laya.Texture2D.load("../res/threeDimen/skinModel/dude/Assets/dude/pants.png",Laya.Handler.create(this,function(tex:Laya.Texture2D):void{
                customMaterial3.diffuseTexture = tex;
            }));
            customMaterial3.marginalColor = new Laya.Vector3(1, 0.7, 0);
            
            var customMaterial4:CustomMaterial = new CustomMaterial();
            Laya.Texture2D.load("../res/threeDimen/skinModel/dude/Assets/dude/upBodyC.png",Laya.Handler.create(this,function(tex:Laya.Texture2D):void{
                customMaterial4.diffuseTexture =tex ;
            }));
           
           
            customMaterial4.marginalColor = new Laya.Vector3(1, 0.7, 0);
            
            var baseMaterials:Array<Laya.BaseMaterial> = new Array<Laya.BaseMaterial>();
            baseMaterials[0] = customMaterial1;
            baseMaterials[1] = customMaterial2;
            baseMaterials[2] = customMaterial3;
            baseMaterials[3] = customMaterial4;
            
            (dude.getChildAt(0).getChildAt(0) as Laya.SkinnedMeshSprite3D).skinnedMeshRenderer.sharedMaterials = baseMaterials;
            dude.transform.position = new Laya.Vector3(0, 0.5, 0);
            dude.transform.scale = new Laya.Vector3(0.2, 0.2, 0.2);
            dude.transform.rotate(new Laya.Vector3(0, 180, 0), false, false);
        }));
        
        var earth:Laya.MeshSprite3D = scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createSphere(0.5, 128, 128))) as Laya.MeshSprite3D;
        
        var customMaterial:CustomMaterial = new CustomMaterial();
        Laya.Texture2D.load("../res/threeDimen/texture/earth.png", Laya.Handler.create(null, function(tex:Laya.Texture2D):void{
            customMaterial.diffuseTexture = tex;
        }));
        customMaterial.marginalColor = new Laya.Vector3(0.0, 0.3, 1.0);
        earth.meshRenderer.sharedMaterial = customMaterial;
        
        Laya.timer.frameLoop(1, this, function():void {
            earth.transform.rotate(this.rotation, true);
        });
    }
    private initShader():void {
        var attributeMap:Object = {
            'a_Position': Laya.VertexMesh.MESH_POSITION0, 
            'a_Normal': Laya.VertexMesh.MESH_NORMAL0, 
            'a_Texcoord': Laya.VertexMesh.MESH_TEXTURECOORDINATE0,
            'a_BoneWeights': Laya.VertexMesh.MESH_BLENDWEIGHT0, 
            'a_BoneIndices': Laya.VertexMesh.MESH_BLENDINDICES0
        };
        var uniformMap:Object = {
            'u_Bones': Laya.Shader3D.PERIOD_CUSTOM, 
            'u_CameraPos': Laya.Shader3D.PERIOD_CAMERA, 
            'u_MvpMatrix': Laya.Shader3D.PERIOD_SPRITE, 
            'u_WorldMat': Laya.Shader3D.PERIOD_SPRITE, 
            'u_texture': Laya.Shader3D.PERIOD_MATERIAL, 
            'u_marginalColor': Laya.Shader3D.PERIOD_MATERIAL, 
            'u_DirectionLight.Direction': Laya.Shader3D.PERIOD_SCENE, 
            'u_DirectionLight.Color': Laya.Shader3D.PERIOD_SCENE
        };
        var vs:string ="attribute vec4 a_Position;\n"+
        "attribute vec2 a_Texcoord;\n"+
        "attribute vec3 a_Normal;\n"+
        "uniform mat4 u_MvpMatrix;\n"+
        "uniform mat4 u_WorldMat;\n"+
        "varying vec2 v_Texcoord;\n"+
        "varying vec3 v_Normal;\n"+
        "#ifdef BONE\n"+
        "attribute vec4 a_BoneIndices;\n"+
        "attribute vec4 a_BoneWeights;\n"+
        "const int c_MaxBoneCount = 24;\n"+
        "uniform mat4 u_Bones[c_MaxBoneCount];\n"+
        "#endif\n"+
        "#if defined(DIRECTIONLIGHT)\n"+
        "varying vec3 v_PositionWorld;\n"+
        "#endif\n"+
        "void main()\n"+
        "{\n"+
        "#ifdef BONE\n"+
        "mat4 skinTransform=mat4(0.0);\n"+
        "skinTransform += u_Bones[int(a_BoneIndices.x)] * a_BoneWeights.x;\n"+
        "skinTransform += u_Bones[int(a_BoneIndices.y)] * a_BoneWeights.y;\n"+
        "skinTransform += u_Bones[int(a_BoneIndices.z)] * a_BoneWeights.z;\n"+
        "skinTransform += u_Bones[int(a_BoneIndices.w)] * a_BoneWeights.w;\n"+
        "vec4 position = skinTransform * a_Position;\n"+
        "gl_Position=u_MvpMatrix * position;\n"+
        "mat3 worldMat=mat3(u_WorldMat * skinTransform);\n"+
        "#else\n"+
        "gl_Position=u_MvpMatrix * a_Position;\n"+
        "mat3 worldMat=mat3(u_WorldMat);\n"+
        "#endif\n"+
        "v_Texcoord=a_Texcoord;\n"+
        "v_Normal=worldMat*a_Normal;\n"+
        "#if defined(DIRECTIONLIGHT)\n"+
        "#ifdef BONE\n"+
        "v_PositionWorld=(u_WorldMat*position).xyz;\n"+
        "#else\n"+
        "v_PositionWorld=(u_WorldMat*a_Position).xyz;\n"+
        "#endif\n"+
        "#endif\n"+
        "}";
        var ps:string = "#ifdef FSHIGHPRECISION\n"+
        "precision highp float;\n"+
        "#else\n"+
        "precision mediump float;\n"+
        "#endif\n"+
        "#include \"Lighting.glsl\";\n"+
        "varying vec2 v_Texcoord;\n"+
        "uniform sampler2D u_texture;\n"+
        "uniform vec3 u_marginalColor;\n"+
        "varying vec3 v_Normal;\n"+
        "#if defined(DIRECTIONLIGHT)\n"+
        "uniform vec3 u_CameraPos;\n"+
        "varying vec3 v_PositionWorld;\n"+
        "uniform DirectionLight u_DirectionLight;\n"+
        "#endif\n"+
        "void main()\n"+
        "{\n"+
        "gl_FragColor=texture2D(u_texture,v_Texcoord);\n"+
        "vec3 normal=normalize(v_Normal);\n"+
        "vec3 toEyeDir = normalize(u_CameraPos-v_PositionWorld);\n"+
        "float Rim = 1.0 - max(0.0,dot(toEyeDir, normal));\n"+
        "vec3 Emissive = 2.0 * u_DirectionLight.Color * u_marginalColor * pow(Rim,3.0);\n"+ 
        "gl_FragColor = texture2D(u_texture, v_Texcoord) + vec4(Emissive,1.0);\n"+
        "}";
        
		var customShader:Laya.Shader3D = Laya.Shader3D.add("CustomShader");
		var subShader:Laya.SubShader = new Laya.SubShader(attributeMap, uniformMap, Laya.SkinnedMeshSprite3D.shaderDefines);
		customShader.addSubShader(subShader);
		subShader.addShaderPass(vs,ps);
    }
}
new Shader_GlowingEdge;