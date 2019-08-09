class CustomTerrainMaterial extends Laya.BaseMaterial{
    constructor(){
        super(11);
        this.setShaderName("CustomTerrainShader");
    }
    //继承而来的静态函数
    static __init__(){
        CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM1 = CustomTerrainMaterial.shaderDefines.registerDefine("CUSTOM_DETAIL_NUM1");
        CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM2 = CustomTerrainMaterial.shaderDefines.registerDefine("CUSTOM_DETAIL_NUM2");
        CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM3 = CustomTerrainMaterial.shaderDefines.registerDefine("CUSTOM_DETAIL_NUM3");
        CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM4 = CustomTerrainMaterial.shaderDefines.registerDefine("CUSTOM_DETAIL_NUM4");
        CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM5 = CustomTerrainMaterial.shaderDefines.registerDefine("CUSTOM_DETAIL_NUM5");
    }
    //获取splatAlpha贴图
    get splatAlphaTexture(){
        return this._shaderValues.getTexture(CustomTerrainMaterial.SPLATALPHATEXTURE);
    }
    //设置splatAlpha贴图
    set splatAlphaTexture(value){
        this._shaderValues.setTexture(CustomTerrainMaterial.SPLATALPHATEXTURE, value);
    }
    //获取第一层diffuseTexture
    get diffuseTexture1(){
        return this._shaderValues.getTexture(CustomTerrainMaterial.DIFFUSETEXTURE1);
    }
    //设置第一层diffuseTexture
    set diffuseTexture1(value){
        this._shaderValues.setTexture(CustomTerrainMaterial.DIFFUSETEXTURE1, value);
        this._setDetailNum(1);
    }
    //获取第二层贴图
    get diffuseTexture2 () {
        return this._shaderValues.getTexture(CustomTerrainMaterial.DIFFUSETEXTURE2);
    }
    //设置第二层贴图。        
    set diffuseTexture2 (value) {
        this._shaderValues.setTexture(CustomTerrainMaterial.DIFFUSETEXTURE2, value);
        this._setDetailNum(2);
    }
    //获取第三层贴图
    get diffuseTexture3(){
        return this._shaderValues.getTexture(CustomTerrainMaterial.DIFFUSETEXTURE3);
    }
    //设置第三层贴图
    set diffuseTexture3(value){
        this._shaderValues.setTexture(CustomTerrainMaterial.DIFFUSETEXTURE3, value);
        this._setDetailNum(3);
    }
    //获取第四层贴图
    get diffuseTexture4(){
        return this._shaderValues.getTexture(CustomTerrainMaterial.DIFFUSETEXTURE4);
    }
    //设置第四层贴图
    set diffuseTexture4(value){
        this._shaderValues.setTexture(CustomTerrainMaterial.DIFFUSETEXTURE4, value);
        this._setDetailNum(4);
    } 
    //获取第五层贴图
    get diffuseTexture5(){
        return this._shaderValues.getTexture(CustomTerrainMaterial.DIFFUSETEXTURE5);
    }
    //设置第四层贴图
    set diffuseTexture5(value){
        this._shaderValues.setTexture(CustomTerrainMaterial.DIFFUSETEXTURE5, value);
        this._setDetailNum(5);
    } 

    setDiffuseScale1(scale1) {
        this._shaderValues.setVector(CustomTerrainMaterial.DIFFUSESCALE1, scale1);
    }
    setDiffuseScale2(scale2) {
        this._shaderValues.setVector(CustomTerrainMaterial.DIFFUSESCALE2, scale2);
    }
    setDiffuseScale3(scale3) {
        this._shaderValues.setVector(CustomTerrainMaterial.DIFFUSESCALE3, scale3);
    }
    setDiffuseScale4(scale4) {
        this._shaderValues.setVector(CustomTerrainMaterial.DIFFUSESCALE4, scale4);
    }
    setDiffuseScale5(scale5) {
        this._shaderValues.setVector(CustomTerrainMaterial.DIFFUSESCALE5, scale5);
    }

    _setDetailNum(value) {
        switch (value) {
            case 1:
                this._defineDatas.add(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM1);
                this._defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM2);
                this._defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM3);
                this._defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM4);
                this._defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM5);
                break;
            case 2:
                this._defineDatas.add(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM2);
                this._defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM1);
                this._defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM3);
                this._defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM4);
                this._defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM5);
                break;
            case 3:
                this._defineDatas.add(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM3);
                this._defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM1);
                this._defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM2);
                this._defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM4);
                this._defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM5);
                break;
            case 4:
                this._defineDatas.add(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM4);
                this._defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM1);
                this._defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM2);
                this._defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM3);
                this._defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM5);
                break;
            case 5:
                this._defineDatas.add(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM5);
                this._defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM1);
                this._defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM2);
                this._defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM3);
                this._defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM4);
                break;
        }
    }
    static initShader() {
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
            vec4 splatAlpha = texture2D(u_SplatAlphaTexture, v_Texcoord0);
            vec4 color1 = texture2D(u_DiffuseTexture1, v_Texcoord0 * u_DiffuseScale1);
            gl_FragColor.xyz = color1.xyz * splatAlpha.r;
            #elif  defined(CUSTOM_DETAIL_NUM2)
            vec4 splatAlpha = texture2D(u_SplatAlphaTexture, v_Texcoord0);
            vec4 color1 = texture2D(u_DiffuseTexture1, v_Texcoord0 * u_DiffuseScale1);
            vec4 color2 = texture2D(u_DiffuseTexture2, v_Texcoord0 * u_DiffuseScale2);
            gl_FragColor.xyz = color1.xyz * splatAlpha.r + color2.xyz * (1.0 - splatAlpha.r);
            #elif defined(CUSTOM_DETAIL_NUM3)
            vec4 splatAlpha = texture2D(u_SplatAlphaTexture, v_Texcoord0);
            vec4 color1 = texture2D(u_DiffuseTexture1, v_Texcoord0 * u_DiffuseScale1);
            vec4 color2 = texture2D(u_DiffuseTexture2, v_Texcoord0 * u_DiffuseScale2);
            vec4 color3 = texture2D(u_DiffuseTexture3, v_Texcoord0 * u_DiffuseScale3);
            gl_FragColor.xyz = color1.xyz * splatAlpha.r  + color2.xyz * splatAlpha.g + color3.xyz * (1.0 - splatAlpha.r - splatAlpha.g);
            #elif defined(CUSTOM_DETAIL_NUM4)
            vec4 splatAlpha = texture2D(u_SplatAlphaTexture, v_Texcoord0);
            vec4 color1 = texture2D(u_DiffuseTexture1, v_Texcoord0 * u_DiffuseScale1);
            vec4 color2 = texture2D(u_DiffuseTexture2, v_Texcoord0 * u_DiffuseScale2);
            vec4 color3 = texture2D(u_DiffuseTexture3, v_Texcoord0 * u_DiffuseScale3);
            vec4 color4 = texture2D(u_DiffuseTexture4, v_Texcoord0 * u_DiffuseScale4);
            gl_FragColor.xyz = color1.xyz * splatAlpha.r  + color2.xyz * splatAlpha.g + color3.xyz * splatAlpha.b + color4.xyz * (1.0 - splatAlpha.r - splatAlpha.g - splatAlpha.b);
            #elif defined(CUSTOM_DETAIL_NUM5)
            vec4 splatAlpha = texture2D(u_SplatAlphaTexture, v_Texcoord0);
            vec4 color1 = texture2D(u_DiffuseTexture1, v_Texcoord0 * u_DiffuseScale1);
            vec4 color2 = texture2D(u_DiffuseTexture2, v_Texcoord0 * u_DiffuseScale2);
            vec4 color3 = texture2D(u_DiffuseTexture3, v_Texcoord0 * u_DiffuseScale3);
            vec4 color4 = texture2D(u_DiffuseTexture4, v_Texcoord0 * u_DiffuseScale4);
            vec4 color5 = texture2D(u_DiffuseTexture5, v_Texcoord0 * u_DiffuseScale5);
            gl_FragColor.xyz = color1.xyz * splatAlpha.r  + color2.xyz * splatAlpha.g + color3.xyz * splatAlpha.b + color4.xyz * splatAlpha.a + color5.xyz * (1.0 - splatAlpha.r - splatAlpha.g - splatAlpha.b - splatAlpha.a);
            #else
            #endif
            }`;

			let customTerrianShader = Laya.Shader3D.add("CustomTerrainShader");
			let subShader =new Laya.SubShader(attributeMap, uniformMap, Laya.RenderableSprite3D.shaderDefines, CustomTerrainMaterial.shaderDefines);
			customTerrianShader.addSubShader(subShader);
			subShader.addShaderPass(vs, ps);
    }
}
//ES6可以定义静态属性，这些属性是CustomMaterial的属性，不属于CustomMaterial实例的属性。ES7提案将支持在class中使用static定义静态属性
CustomTerrainMaterial.SPLATALPHATEXTURE = Laya.Shader3D.propertyNameToID("u_SplatAlphaTexture");
CustomTerrainMaterial.DIFFUSETEXTURE1 = Laya.Shader3D.propertyNameToID("u_DiffuseTexture1");
CustomTerrainMaterial.DIFFUSETEXTURE2 = Laya.Shader3D.propertyNameToID("u_DiffuseTexture2");
CustomTerrainMaterial.DIFFUSETEXTURE3 = Laya.Shader3D.propertyNameToID("u_DiffuseTexture3");
CustomTerrainMaterial.DIFFUSETEXTURE4 = Laya.Shader3D.propertyNameToID("u_DiffuseTexture4");
CustomTerrainMaterial.DIFFUSETEXTURE5 = Laya.Shader3D.propertyNameToID("u_DiffuseTexture5");
CustomTerrainMaterial.DIFFUSESCALE1 = Laya.Shader3D.propertyNameToID("u_DiffuseScale1");
CustomTerrainMaterial.DIFFUSESCALE2 = Laya.Shader3D.propertyNameToID("u_DiffuseScale2");
CustomTerrainMaterial.DIFFUSESCALE3 = Laya.Shader3D.propertyNameToID("u_DiffuseScale3");
CustomTerrainMaterial.DIFFUSESCALE4 = Laya.Shader3D.propertyNameToID("u_DiffuseScale4");
CustomTerrainMaterial.DIFFUSESCALE5 = Laya.Shader3D.propertyNameToID("u_DiffuseScale5");
CustomTerrainMaterial.shaderDefines = new Laya.ShaderDefines(Laya.BaseMaterial.shaderDefines);


