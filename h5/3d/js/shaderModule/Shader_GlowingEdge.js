
        // this.rotation = new Laya.Vector3(0, 0.01, 0);
        // //Laya.Shader3D.debugMode = true;
        // Laya3D.init(0, 0);
        // Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        // Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        // Laya.Stat.show();
        // this.initShader();
        // var scene = Laya.stage.addChild(new Laya.Scene3D());
        // var camera = (scene.addChild(new Laya.Camera(0, 0.1, 1000)));
        // camera.transform.translate(new Laya.Vector3(0, 0.85, 1.7));
        // camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
        // camera.addComponent(CameraMoveScript);
        // var directionLight = scene.addChild(new Laya.DirectionLight());
        // directionLight.color = new Laya.Vector3(1, 1, 1);
        // directionLight.direction = new Laya.Vector3(1, -1, 0);
        // Laya.Sprite3D.load("res/threeDimen/skinModel/dude/dude.lh", Laya.Handler.create(this, this.loadSprite3D));
        // var earth = scene.addChild(new Laya.MeshSprite3D(new Laya.SphereMesh(0.5, 128, 128)));
        // var customMaterial = new CustomMaterial();
        // Laya.Texture2D.load("res/threeDimen/texture/earth.png", Laya.Handler.create(null, function (tex) {
        //     customMaterial.diffuseTexture = tex;
        // }));
        // customMaterial.marginalColor = new Laya.Vector3(0.0, 0.3, 1.0);
        // earth.meshRenderer.sharedMaterial = customMaterial;
        // Laya.timer.frameLoop(1, this, function () {
        //     earth.transform.rotate(this.rotation, true);
        // });



class Shader_GlowingEdge{
    constructor(){
        this.rotation = new Laya.Vector3(0, 0.01, 0);
        //Laya.Shader3D.debugMode = true;
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        this.initShader();
        this.scene = Laya.stage.addChild(new Laya.Scene3D());
        var camera = (this.scene.addChild(new Laya.Camera(0, 0.1, 1000)));
        camera.transform.translate(new Laya.Vector3(0, 0.85, 1.7));
        camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
        camera.addComponent(CameraMoveScript);
        var directionLight = this.scene.addChild(new Laya.DirectionLight());
        directionLight.color = new Laya.Vector3(1, 1, 1);
        directionLight.direction = new Laya.Vector3(1, -1, 0);
        this.customMaterial1 = new CustomMaterial();
        this.customMaterial2 = new CustomMaterial();
        this.customMaterial3 = new CustomMaterial();
        this.customMaterial4 = new CustomMaterial();

        Laya.Sprite3D.load("res/threeDimen/skinModel/dude/dude.lh", Laya.Handler.create(this, this.loadSprite3D));
        this.earth = this.scene.addChild(new Laya.MeshSprite3D(new Laya.SphereMesh(0.5, 128, 128)));
        var customMaterial = new CustomMaterial();
        Laya.Texture2D.load("res/threeDimen/texture/earth.png", Laya.Handler.create(null, function (tex) {
            customMaterial.diffuseTexture = tex;
        }));
        customMaterial.marginalColor = new Laya.Vector3(0.0, 0.3, 1.0);
        this.earth.meshRenderer.sharedMaterial = customMaterial;
        Laya.timer.frameLoop(1, this, this.onFrameLoop);

    }

    loadSprite3D(dude){
            this.scene.addChild(dude);
            var customMaterial1 = new CustomMaterial();
            Laya.Texture2D.load("res/threeDimen/skinModel/dude/Assets/dude/head.png", Laya.Handler.create(null, function (tex) {
                customMaterial1.diffuseTexture = tex;
            }));
            customMaterial1.marginalColor = new Laya.Vector3(1, 0.7, 0);
            var customMaterial2 = new CustomMaterial();
            Laya.Texture2D.load("res/threeDimen/skinModel/dude/Assets/dude/jacket.png", Laya.Handler.create(null, function (tex) {
                customMaterial2.diffuseTexture = tex;
            }));
            customMaterial2.marginalColor = new Laya.Vector3(1, 0.7, 0);
            var customMaterial3 = new CustomMaterial();
            Laya.Texture2D.load("res/threeDimen/skinModel/dude/Assets/dude/pants.png", Laya.Handler.create(null, function (tex) {
                customMaterial3.diffuseTexture = tex;
            }));
            customMaterial3.marginalColor = new Laya.Vector3(1, 0.7, 0);
            var customMaterial4 = new CustomMaterial();
            Laya.Texture2D.load("res/threeDimen/skinModel/dude/Assets/dude/upBodyC.png", Laya.Handler.create(null, function (tex) {
                customMaterial4.diffuseTexture = tex;
            }));
            customMaterial4.marginalColor = new Laya.Vector3(1, 0.7, 0);
            var baseMaterials = new Array();
            baseMaterials[0] = customMaterial1;
            baseMaterials[1] = customMaterial2;
            baseMaterials[2] = customMaterial3;
            baseMaterials[3] = customMaterial4;
            dude.getChildAt(0).getChildAt(0).skinnedMeshRenderer.sharedMaterials = baseMaterials;
            dude.transform.position = new Laya.Vector3(0, 0.5, 0);
            dude.transform.scale = new Laya.Vector3(0.2, 0.2, 0.2);
            dude.transform.rotate(new Laya.Vector3(0, 180, 0), false, false);
    }

    onFrameLoop(){
        this.earth.transform.rotate(this.rotation, true);
    }


    initShader() {
        var attributeMap = {
            'a_Position': Laya.VertexMesh.MESH_POSITION0,
            'a_Normal': Laya.VertexMesh.MESH_NORMAL0,
            'a_Texcoord': Laya.VertexMesh.MESH_TEXTURECOORDINATE0,
            'a_BoneWeights': Laya.VertexMesh.MESH_BLENDWEIGHT0,
            'a_BoneIndices': Laya.VertexMesh.MESH_BLENDINDICES0
        };
        var uniformMap = {
            'u_Bones': [Laya.SkinnedMeshSprite3D.BONES, Laya.Shader3D.PERIOD_CUSTOM],
            'u_CameraPos': [Laya.BaseCamera.CAMERAPOS, Laya.Shader3D.PERIOD_CAMERA],
            'u_MvpMatrix': [Laya.Sprite3D.MVPMATRIX, Laya.Shader3D.PERIOD_SPRITE],
            'u_WorldMat': [Laya.Sprite3D.WORLDMATRIX, Laya.Shader3D.PERIOD_SPRITE],
            'u_texture': [CustomMaterial.DIFFUSETEXTURE, Laya.Shader3D.PERIOD_MATERIAL],
            'u_marginalColor': [CustomMaterial.MARGINALCOLOR, Laya.Shader3D.PERIOD_MATERIAL],
            'u_DirectionLight.Direction': [Laya.Scene3D.LIGHTDIRECTION, Laya.Shader3D.PERIOD_SCENE],
            'u_DirectionLight.Color': [Laya.Scene3D.LIGHTDIRCOLOR, Laya.Shader3D.PERIOD_SCENE]
        };
        var vs = "attribute vec4 a_Position;\n" +
            "attribute vec2 a_Texcoord;\n" +
            "attribute vec3 a_Normal;\n" +
            "uniform mat4 u_MvpMatrix;\n" +
            "uniform mat4 u_WorldMat;\n" +
            "varying vec2 v_Texcoord;\n" +
            "varying vec3 v_Normal;\n" +
            "#ifdef BONE\n" +
            "attribute vec4 a_BoneIndices;\n" +
            "attribute vec4 a_BoneWeights;\n" +
            "const int c_MaxBoneCount = 24;\n" +
            "uniform mat4 u_Bones[c_MaxBoneCount];\n" +
            "#endif\n" +
            "#if defined(DIRECTIONLIGHT)\n" +
            "varying vec3 v_PositionWorld;\n" +
            "#endif\n" +
            "void main()\n" +
            "{\n" +
            "#ifdef BONE\n" +
            "mat4 skinTransform=mat4(0.0);\n" +
            "skinTransform += u_Bones[int(a_BoneIndices.x)] * a_BoneWeights.x;\n" +
            "skinTransform += u_Bones[int(a_BoneIndices.y)] * a_BoneWeights.y;\n" +
            "skinTransform += u_Bones[int(a_BoneIndices.z)] * a_BoneWeights.z;\n" +
            "skinTransform += u_Bones[int(a_BoneIndices.w)] * a_BoneWeights.w;\n" +
            "vec4 position = skinTransform * a_Position;\n" +
            "gl_Position=u_MvpMatrix * position;\n" +
            "mat3 worldMat=mat3(u_WorldMat * skinTransform);\n" +
            "#else\n" +
            "gl_Position=u_MvpMatrix * a_Position;\n" +
            "mat3 worldMat=mat3(u_WorldMat);\n" +
            "#endif\n" +
            "v_Texcoord=a_Texcoord;\n" +
            "v_Normal=worldMat*a_Normal;\n" +
            "#if defined(DIRECTIONLIGHT)\n" +
            "#ifdef BONE\n" +
            "v_PositionWorld=(u_WorldMat*position).xyz;\n" +
            "#else\n" +
            "v_PositionWorld=(u_WorldMat*a_Position).xyz;\n" +
            "#endif\n" +
            "#endif\n" +
            "}";
        var ps = "#ifdef FSHIGHPRECISION\n" +
            "precision highp float;\n" +
            "#else\n" +
            "precision mediump float;\n" +
            "#endif\n" +
            "#include \"Lighting.glsl\";\n" +
            "varying vec2 v_Texcoord;\n" +
            "uniform sampler2D u_texture;\n" +
            "uniform vec3 u_marginalColor;\n" +
            "varying vec3 v_Normal;\n" +
            "#if defined(DIRECTIONLIGHT)\n" +
            "uniform vec3 u_CameraPos;\n" +
            "varying vec3 v_PositionWorld;\n" +
            "uniform DirectionLight u_DirectionLight;\n" +
            "#endif\n" +
            "void main()\n" +
            "{\n" +
            "gl_FragColor=texture2D(u_texture,v_Texcoord);\n" +
            "vec3 normal=normalize(v_Normal);\n" +
            "vec3 toEyeDir = normalize(u_CameraPos-v_PositionWorld);\n" +
            "float Rim = 1.0 - max(0.0,dot(toEyeDir, normal));\n" +
            "vec3 Emissive = 2.0 * u_DirectionLight.Color * u_marginalColor * pow(Rim,3.0);\n" +
            "gl_FragColor = texture2D(u_texture, v_Texcoord) + vec4(Emissive,1.0);\n" +
            "}";
        var customShader = Laya.Shader3D.add("CustomShader", attributeMap, uniformMap, Laya.SkinnedMeshSprite3D.shaderDefines);
        customShader.addShaderPass(vs, ps);
    }
}

//激活启动类
new Shader_GlowingEdge();

