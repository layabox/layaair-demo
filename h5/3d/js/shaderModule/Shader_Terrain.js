class Shader_Terrain{
    constructor(){
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        this.initShader();
        this.scene = Laya.stage.addChild(new Laya.Scene3D);
        var camera = this.scene.addChild(new Laya.Camera(0, 0.1, 1000));
        camera.transform.rotate(new Laya.Vector3(-18, 180, 0), false, false);
        camera.transform.translate(new Laya.Vector3(-28, 20, -18), false);
        camera.addComponent(CameraMoveScript);
        this.customMaterial = new CustomTerrainMaterial();
        Laya.Mesh.load("res/threeDimen/skinModel/Terrain/terrain_New-Part-01.lm", Laya.Handler.create(this, this.loadSprite3D));
    }

    loadSprite3D(mesh){
            var terrain = this.scene.addChild(new Laya.MeshSprite3D(mesh));
            Laya.Texture2D.load("res/threeDimen/skinModel/Terrain/splatAlphaTexture.png", Laya.Handler.create(this, this.loadSplatAlphaTexture));
            Laya.Texture2D.load("res/threeDimen/skinModel/Terrain/ground_01.jpg", Laya.Handler.create(this, this.loadDiffuseTexture1));
            Laya.Texture2D.load("res/threeDimen/skinModel/Terrain/ground_02.jpg", Laya.Handler.create(this, this.loadDiffuseTexture2));
            Laya.Texture2D.load("res/threeDimen/skinModel/Terrain/ground_03.jpg", Laya.Handler.create(this, this.loadDiffuseTexture3));
            Laya.Texture2D.load("res/threeDimen/skinModel/Terrain/ground_04.jpg", Laya.Handler.create(this, this.loadDiffuseTexture4));
            this.customMaterial.setDiffuseScale1(new Laya.Vector2(27.92727, 27.92727));
            this.customMaterial.setDiffuseScale2(new Laya.Vector2(13.96364, 13.96364));
            this.customMaterial.setDiffuseScale3(new Laya.Vector2(18.61818, 18.61818));
            this.customMaterial.setDiffuseScale4(new Laya.Vector2(13.96364, 13.96364));
            this.customMaterial.ambientColor = new Laya.Vector3(1, 1, 1);
            this.customMaterial.diffuseColor = new Laya.Vector3(1, 1, 1);
            this.customMaterial.specularColor = new Laya.Vector4(1, 1, 1, 8);
            terrain.meshRenderer.sharedMaterial = this.customMaterial;
    }
    loadSplatAlphaTexture(tex){
        this.customMaterial.splatAlphaTexture = tex;
    }
    loadDiffuseTexture1(tex){
        this.customMaterial.diffuseTexture1 = tex;
    }
    loadDiffuseTexture2(tex){
        this.customMaterial.diffuseTexture2 = tex;
    }
    loadDiffuseTexture3(tex){
        this.customMaterial.diffuseTexture3 = tex;
    }
    loadDiffuseTexture4(tex){
        this.customMaterial.diffuseTexture4 = tex;
    }
    initShader() {
        CustomTerrainMaterial.__init__();
        var attributeMap = {
            'a_Position': Laya.VertexMesh.MESH_POSITION0,
            'a_Normal': Laya.VertexMesh.MESH_NORMAL0,
            'a_Texcoord0': Laya.VertexMesh.MESH_TEXTURECOORDINATE0
        };
        var uniformMap = {
            'u_MvpMatrix': Laya.Shader3D.PERIOD_SPRITE,
            'u_WorldMat': Laya.Shader3D.PERIOD_SPRITE,
            'u_CameraPos':  Laya.Shader3D.PERIOD_CAMERA,
            'u_SplatAlphaTexture': Laya.Shader3D.PERIOD_MATERIAL,
            'u_DiffuseTexture1': Laya.Shader3D.PERIOD_MATERIAL,
            'u_DiffuseTexture2': Laya.Shader3D.PERIOD_MATERIAL,
            'u_DiffuseTexture3':  Laya.Shader3D.PERIOD_MATERIAL,
            'u_DiffuseTexture4':  Laya.Shader3D.PERIOD_MATERIAL,
            'u_DiffuseTexture5':  Laya.Shader3D.PERIOD_MATERIAL,
            'u_DiffuseScale1':  Laya.Shader3D.PERIOD_MATERIAL,
            'u_DiffuseScale2':  Laya.Shader3D.PERIOD_MATERIAL,
            'u_DiffuseScale3':  Laya.Shader3D.PERIOD_MATERIAL,
            'u_DiffuseScale4': Laya.Shader3D.PERIOD_MATERIAL,
            'u_DiffuseScale5': Laya.Shader3D.PERIOD_MATERIAL
        };
        var vs = "attribute vec4 a_Position;\n" +
            "attribute vec2 a_Texcoord0;\n" +
            "attribute vec3 a_Normal;\n" +
            "uniform mat4 u_MvpMatrix;\n" +
            "varying vec2 v_Texcoord0;\n" +
            "void main()\n" +
            "{\n" +
            "gl_Position = u_MvpMatrix * a_Position;\n" +
            "v_Texcoord0 = a_Texcoord0;\n" +
            "}";
        var ps = "#ifdef FSHIGHPRECISION\n" +
            "precision highp float;\n" +
            "#else\n" +
            "precision mediump float;\n" +
            "#endif\n" +
            "uniform sampler2D u_SplatAlphaTexture;\n" +
            "uniform sampler2D u_DiffuseTexture1;\n" +
            "uniform sampler2D u_DiffuseTexture2;\n" +
            "uniform sampler2D u_DiffuseTexture3;\n" +
            "uniform sampler2D u_DiffuseTexture4;\n" +
            "uniform sampler2D u_DiffuseTexture5;\n" +
            "uniform vec2 u_DiffuseScale1;\n" +
            "uniform vec2 u_DiffuseScale2;\n" +
            "uniform vec2 u_DiffuseScale3;\n" +
            "uniform vec2 u_DiffuseScale4;\n" +
            "uniform vec2 u_DiffuseScale5;\n" +
            "varying vec2 v_Texcoord0;\n" +
            "void main()\n" +
            "{\n" +
            "#ifdef CUSTOM_DETAIL_NUM1\n" +
            "vec4 splatAlpha = texture2D(u_SplatAlphaTexture, v_Texcoord);\n" +
            "vec4 color1 = texture2D(u_DiffuseTexture1, v_Texcoord0 * u_DiffuseScale1);\n" +
            "gl_FragColor.xyz = color1.xyz * splatAlpha.r;\n" +
            "#endif\n" +
            "#ifdef CUSTOM_DETAIL_NUM2\n" +
            "vec4 splatAlpha = texture2D(u_SplatAlphaTexture, v_Texcoord0);\n" +
            "vec4 color1 = texture2D(u_DiffuseTexture1, v_Texcoord0 * u_DiffuseScale1);\n" +
            "vec4 color2 = texture2D(u_DiffuseTexture2, v_Texcoord0 * u_DiffuseScale2);\n" +
            "gl_FragColor.xyz = color1.xyz * splatAlpha.r + color2.xyz * (1.0 - splatAlpha.r);\n" +
            "#endif\n" +
            "#ifdef CUSTOM_DETAIL_NUM3\n" +
            "vec4 splatAlpha = texture2D(u_SplatAlphaTexture, v_Texcoord0);\n" +
            "vec4 color1 = texture2D(u_DiffuseTexture1, v_Texcoord0 * u_DiffuseScale1);\n" +
            "vec4 color2 = texture2D(u_DiffuseTexture2, v_Texcoord0 * u_DiffuseScale2);\n" +
            "vec4 color3 = texture2D(u_DiffuseTexture3, v_Texcoord0 * u_DiffuseScale3);\n" +
            "gl_FragColor.xyz = color1.xyz * splatAlpha.r  + color2.xyz * splatAlpha.g + color3.xyz * (1.0 - splatAlpha.r - splatAlpha.g);\n" +
            "#endif\n" +
            "#ifdef CUSTOM_DETAIL_NUM4\n" +
            "vec4 splatAlpha = texture2D(u_SplatAlphaTexture, v_Texcoord0);\n" +
            "vec4 color1 = texture2D(u_DiffuseTexture1, v_Texcoord0 * u_DiffuseScale1);\n" +
            "vec4 color2 = texture2D(u_DiffuseTexture2, v_Texcoord0 * u_DiffuseScale2);\n" +
            "vec4 color3 = texture2D(u_DiffuseTexture3, v_Texcoord0 * u_DiffuseScale3);\n" +
            "vec4 color4 = texture2D(u_DiffuseTexture4, v_Texcoord0 * u_DiffuseScale4);\n" +
            "gl_FragColor.xyz = color1.xyz * splatAlpha.r  + color2.xyz * splatAlpha.g + color3.xyz * splatAlpha.b + color4.xyz * (1.0 - splatAlpha.r - splatAlpha.g - splatAlpha.b);\n" +
            "#endif\n" +
            "#ifdef CUSTOM_DETAIL_NUM5\n" +
            "vec4 splatAlpha = texture2D(u_SplatAlphaTexture, v_Texcoord0);\n" +
            "vec4 color1 = texture2D(u_DiffuseTexture1, v_Texcoord0 * u_DiffuseScale1);\n" +
            "vec4 color2 = texture2D(u_DiffuseTexture2, v_Texcoord0 * u_DiffuseScale2);\n" +
            "vec4 color3 = texture2D(u_DiffuseTexture3, v_Texcoord0 * u_DiffuseScale3);\n" +
            "vec4 color4 = texture2D(u_DiffuseTexture4, v_Texcoord0 * u_DiffuseScale4);\n" +
            "vec4 color5 = texture2D(u_DiffuseTexture5, v_Texcoord0 * u_DiffuseScale5);\n" +
            "gl_FragColor.xyz = color1.xyz * splatAlpha.r  + color2.xyz * splatAlpha.g + color3.xyz * splatAlpha.b + color4.xyz * splatAlpha.a + color5.xyz * (1.0 - splatAlpha.r - splatAlpha.g - splatAlpha.b - splatAlpha.a);\n" +
            "#endif\n" +
            "}";

			var customTerrianShader = Laya.Shader3D.add("CustomTerrainShader");
			var subShader =new Laya.SubShader(attributeMap, uniformMap, Laya.RenderableSprite3D.shaderDefines, CustomTerrainMaterial.shaderDefines);
			customTerrianShader.addSubShader(subShader);
			subShader.addShaderPass(vs, ps);
    };
}

//激活启动类
new Shader_Terrain();

