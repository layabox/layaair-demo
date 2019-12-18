class Shader_GlowingEdge {
    constructor() {
        //初始化引擎
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        //初始化Shader
        this.initShader();
        
        //创建场景
        let scene = Laya.stage.addChild(new Laya.Scene3D());

        //初始化变量
        this.rotation = new Laya.Vector3(0, 0.01, 0);
        //创建相机
        let camera = (scene.addChild(new Laya.Camera(0, 0.1, 1000)));
        camera.transform.translate(new Laya.Vector3(0, 0.85, 1.7));
        camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
        camera.addComponent(CameraMoveScript);
        //创建平行光
        let directionLight = scene.addChild(new Laya.DirectionLight());
        directionLight.color = new Laya.Vector3(1, 1, 1);
        
        //加载精灵
        Laya.Sprite3D.load("res/threeDimen/skinModel/dude/dude.lh", Laya.Handler.create(this, function(dude) {
            scene.addChild(dude);
            
            //使用自定义材质
            let customMaterial1 = new CustomMaterial();
            Laya.Texture2D.load("res/threeDimen/skinModel/dude/Assets/dude/head.png", Laya.Handler.create(this, function(tex) {
                customMaterial1.diffuseTexture = tex;
            }));
            customMaterial1.marginalColor = new Laya.Vector3(1, 0.7, 0);
            
            let customMaterial2 = new CustomMaterial();
            Laya.Texture2D.load("res/threeDimen/skinModel/dude/Assets/dude/jacket.png", Laya.Handler.create(this, function(tex) {
                customMaterial2.diffuseTexture = tex;
            }));
            customMaterial2.marginalColor = new Laya.Vector3(1, 0.7, 0);
            
            let customMaterial3 = new CustomMaterial();
            Laya.Texture2D.load("res/threeDimen/skinModel/dude/Assets/dude/pants.png",Laya.Handler.create(this,function(tex){
                customMaterial3.diffuseTexture = tex;
            }));
            customMaterial3.marginalColor = new Laya.Vector3(1, 0.7, 0);
            
            let customMaterial4 = new CustomMaterial();
            Laya.Texture2D.load("res/threeDimen/skinModel/dude/Assets/dude/upBodyC.png",Laya.Handler.create(this,function(tex){
                customMaterial4.diffuseTexture =tex ;
            }));
           
            //设置边缘颜色
            customMaterial4.marginalColor = new Laya.Vector3(1, 0.7, 0);
            
            let baseMaterials = [];
            baseMaterials[0] = customMaterial1;
            baseMaterials[1] = customMaterial2;
            baseMaterials[2] = customMaterial3;
            baseMaterials[3] = customMaterial4;
            
            (dude.getChildAt(0).getChildAt(0)).skinnedMeshRenderer.sharedMaterials = baseMaterials;
            dude.transform.position = new Laya.Vector3(0, 0.5, 0);
            dude.transform.scale = new Laya.Vector3(0.2, 0.2, 0.2);
            dude.transform.rotate(new Laya.Vector3(0, 180, 0), false, false);
        }));
        
        //加载地球精灵
        let earth = scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createSphere(0.5, 128, 128)));
        
        let customMaterial = new CustomMaterial();
        Laya.Texture2D.load("res/threeDimen/texture/earth.png", Laya.Handler.create(null, function(tex){
            customMaterial.diffuseTexture = tex;
        }));
        customMaterial.marginalColor = new Laya.Vector3(0.0, 0.3, 1.0);
        earth.meshRenderer.sharedMaterial = customMaterial;
        
        Laya.timer.frameLoop(1, this, function() {
            earth.transform.rotate(this.rotation, true);
        });
    }
    initShader() {
        let attributeMap = {
            'a_Position': Laya.VertexMesh.MESH_POSITION0, 
            'a_Normal': Laya.VertexMesh.MESH_NORMAL0, 
            'a_Texcoord': Laya.VertexMesh.MESH_TEXTURECOORDINATE0,
            'a_BoneWeights': Laya.VertexMesh.MESH_BLENDWEIGHT0, 
            'a_BoneIndices': Laya.VertexMesh.MESH_BLENDINDICES0
        };
        let uniformMap = {
            'u_Bones': Laya.Shader3D.PERIOD_CUSTOM, 
            'u_CameraPos': Laya.Shader3D.PERIOD_CAMERA, 
            'u_MvpMatrix': Laya.Shader3D.PERIOD_SPRITE, 
            'u_WorldMat': Laya.Shader3D.PERIOD_SPRITE, 
            'u_texture': Laya.Shader3D.PERIOD_MATERIAL, 
            'u_marginalColor': Laya.Shader3D.PERIOD_MATERIAL, 
            'u_SunLight.color': Laya.Shader3D.PERIOD_SCENE,  
        };

        let vs = `
        #include "Lighting.glsl";
        attribute vec4 a_Position;
        attribute vec2 a_Texcoord;
        attribute vec3 a_Normal;
        uniform mat4 u_MvpMatrix;
        uniform mat4 u_WorldMat;
        varying vec2 v_Texcoord;
        varying vec3 v_Normal;
        #ifdef BONE
            attribute vec4 a_BoneIndices;
            attribute vec4 a_BoneWeights;
            const int c_MaxBoneCount = 24;
            uniform mat4 u_Bones[c_MaxBoneCount];
        #endif
        #if defined(DIRECTIONLIGHT)
            varying vec3 v_PositionWorld;
        #endif
        void main()
        {
            #ifdef BONE
                mat4 skinTransform=mat4(0.0);
                skinTransform += u_Bones[int(a_BoneIndices.x)] * a_BoneWeights.x;
                skinTransform += u_Bones[int(a_BoneIndices.y)] * a_BoneWeights.y;
                skinTransform += u_Bones[int(a_BoneIndices.z)] * a_BoneWeights.z;
                skinTransform += u_Bones[int(a_BoneIndices.w)] * a_BoneWeights.w;
                vec4 position = skinTransform * a_Position;
                gl_Position=u_MvpMatrix * position;
                mat3 worldMat=mat3(u_WorldMat * skinTransform);
            #else 
                gl_Position=u_MvpMatrix * a_Position;
                mat3 worldMat=mat3(u_WorldMat);
            #endif

            v_Texcoord=a_Texcoord;
            v_Normal=worldMat*a_Normal;

            #if defined(DIRECTIONLIGHT)
                #ifdef BONE
                    v_PositionWorld=(u_WorldMat*position).xyz;
                #else
                    v_PositionWorld=(u_WorldMat*a_Position).xyz;
                #endif
            #endif
            gl_Position=remapGLPositionZ(gl_Position);
        }`;


        let ps = `
        #ifdef FSHIGHPRECISION
            precision highp float;
        #else
            precision mediump float;
        #endif
        #include "Lighting.glsl";
        varying vec2 v_Texcoord;
        uniform sampler2D u_texture;
        uniform vec3 u_marginalColor;
        varying vec3 v_Normal;

        #if defined(DIRECTIONLIGHT)
            uniform vec3 u_CameraPos;
            varying vec3 v_PositionWorld;
            uniform DirectionLight u_SunLight;
        #endif

     
        void main()
        {
            gl_FragColor=texture2D(u_texture,v_Texcoord);
            vec3 normal=normalize(v_Normal);
            vec3 toEyeDir = normalize(u_CameraPos-v_PositionWorld);
            float Rim = 1.0 - max(0.0,dot(toEyeDir, normal));
            vec3 lightColor = u_SunLight.color;
            vec3 Emissive = 2.0 * lightColor * u_marginalColor * pow(Rim,3.0);  
            gl_FragColor = texture2D(u_texture, v_Texcoord) + vec4(Emissive,1.0);
        }`;


        //创建自定义Shader
        let customShader = Laya.Shader3D.add("CustomShader");
        //为Shader添加SubShader
		let subShader = new Laya.SubShader(attributeMap, uniformMap);
        customShader.addSubShader(subShader);
        //为SubShader添加ShaderPass
        subShader.addShaderPass(vs,ps);
    }
}
new Shader_GlowingEdge();