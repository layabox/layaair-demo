class Shader_Terrain{
    constructor(){
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        this.initShader();
        this.scene = Laya.stage.addChild(new Laya.Scene3D());
        let camera = this.scene.addChild(new Laya.Camera(0, 0.1, 1000));
        camera.transform.rotate(new Laya.Vector3(-18, 180, 0), false, false);
        camera.transform.translate(new Laya.Vector3(-28, 20, -18), false);
        camera.addComponent(CameraMoveScript);
        this.customMaterial = new CustomTerrainMaterial();
        Laya.Mesh.load("res/threeDimen/skinModel/Terrain/terrain_New-Part-01.lm", Laya.Handler.create(this, this.loadSprite3D));
    }

    loadSprite3D(mesh){
            let terrain = this.scene.addChild(new Laya.MeshSprite3D(mesh));
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
        let attributeMap = {
            'a_Position': Laya.VertexMesh.MESH_POSITION0,
            'a_Normal': Laya.VertexMesh.MESH_NORMAL0,
            'a_Texcoord0': Laya.VertexMesh.MESH_TEXTURECOORDINATE0
        };
        let uniformMap = {
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
        let vs = `
            attribute vec4 a_Position;
            attribute vec2 a_Texcoord0;
            attribute vec3 a_Normal;
            uniform mat4 u_MvpMatrix;
            varying vec2 v_Texcoord0;
            void main()
            {
            gl_Position = u_MvpMatrix * a_Position;
            v_Texcoord0 = a_Texcoord0;
            }`;
        let ps = `
            #ifdef FSHIGHPRECISION
            precision highp float;
            #else
            precision mediump float;
            #endif
            uniform sampler2D u_SplatAlphaTexture;
            uniform sampler2D u_DiffuseTexture1;
            uniform sampler2D u_DiffuseTexture2;
            uniform sampler2D u_DiffuseTexture3;
            uniform sampler2D u_DiffuseTexture4;
            uniform sampler2D u_DiffuseTexture5;
            uniform vec2 u_DiffuseScale1;
            uniform vec2 u_DiffuseScale2;
            uniform vec2 u_DiffuseScale3;
            uniform vec2 u_DiffuseScale4;
            uniform vec2 u_DiffuseScale5;
            varying vec2 v_Texcoord0;
            void main()
            {
            #ifdef CUSTOM_DETAIL_NUM1
            vec4 splatAlpha = texture2D(u_SplatAlphaTexture, v_Texcoord);
            vec4 color1 = texture2D(u_DiffuseTexture1, v_Texcoord0 * u_DiffuseScale1);
            gl_FragColor.xyz = color1.xyz * splatAlpha.r;
            #endif
            #ifdef CUSTOM_DETAIL_NUM2
            vec4 splatAlpha = texture2D(u_SplatAlphaTexture, v_Texcoord0);
            vec4 color1 = texture2D(u_DiffuseTexture1, v_Texcoord0 * u_DiffuseScale1);
            vec4 color2 = texture2D(u_DiffuseTexture2, v_Texcoord0 * u_DiffuseScale2);
            gl_FragColor.xyz = color1.xyz * splatAlpha.r + color2.xyz * (1.0 - splatAlpha.r);
            #endif
            #ifdef CUSTOM_DETAIL_NUM3
            vec4 splatAlpha = texture2D(u_SplatAlphaTexture, v_Texcoord0);
            vec4 color1 = texture2D(u_DiffuseTexture1, v_Texcoord0 * u_DiffuseScale1);
            vec4 color2 = texture2D(u_DiffuseTexture2, v_Texcoord0 * u_DiffuseScale2);
            vec4 color3 = texture2D(u_DiffuseTexture3, v_Texcoord0 * u_DiffuseScale3);
            gl_FragColor.xyz = color1.xyz * splatAlpha.r  + color2.xyz * splatAlpha.g + color3.xyz * (1.0 - splatAlpha.r - splatAlpha.g);
            #endif
            #ifdef CUSTOM_DETAIL_NUM4
            vec4 splatAlpha = texture2D(u_SplatAlphaTexture, v_Texcoord0);
            vec4 color1 = texture2D(u_DiffuseTexture1, v_Texcoord0 * u_DiffuseScale1);
            vec4 color2 = texture2D(u_DiffuseTexture2, v_Texcoord0 * u_DiffuseScale2);
            vec4 color3 = texture2D(u_DiffuseTexture3, v_Texcoord0 * u_DiffuseScale3);
            vec4 color4 = texture2D(u_DiffuseTexture4, v_Texcoord0 * u_DiffuseScale4);
            gl_FragColor.xyz = color1.xyz * splatAlpha.r  + color2.xyz * splatAlpha.g + color3.xyz * splatAlpha.b + color4.xyz * (1.0 - splatAlpha.r - splatAlpha.g - splatAlpha.b);
            #endif
            #ifdef CUSTOM_DETAIL_NUM5
            vec4 splatAlpha = texture2D(u_SplatAlphaTexture, v_Texcoord0);
            vec4 color1 = texture2D(u_DiffuseTexture1, v_Texcoord0 * u_DiffuseScale1);
            vec4 color2 = texture2D(u_DiffuseTexture2, v_Texcoord0 * u_DiffuseScale2);
            vec4 color3 = texture2D(u_DiffuseTexture3, v_Texcoord0 * u_DiffuseScale3);
            vec4 color4 = texture2D(u_DiffuseTexture4, v_Texcoord0 * u_DiffuseScale4);
            vec4 color5 = texture2D(u_DiffuseTexture5, v_Texcoord0 * u_DiffuseScale5);
            gl_FragColor.xyz = color1.xyz * splatAlpha.r  + color2.xyz * splatAlpha.g + color3.xyz * splatAlpha.b + color4.xyz * splatAlpha.a + color5.xyz * (1.0 - splatAlpha.r - splatAlpha.g - splatAlpha.b - splatAlpha.a);
            #endif
            }`;

			let customTerrianShader = Laya.Shader3D.add("CustomTerrainShader");
			let subShader =new Laya.SubShader(attributeMap, uniformMap, Laya.RenderableSprite3D.shaderDefines, CustomTerrainMaterial.shaderDefines);
			customTerrianShader.addSubShader(subShader);
			subShader.addShaderPass(vs, ps);
    }
}

//激活启动类
new Shader_Terrain();

