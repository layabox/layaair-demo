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


