class CustomMaterial extends Laya.BaseMaterial{
    constructor(){
        super(3);
        this.setShaderName("CustomShader");
    }
    //漫反射贴图的存取函数
    get diffuseTexture(){
        return this._shaderValues.getTexture(CustomMaterial.DIFFUSETEXTURE);
    }
    set diffuseTexture(value){
        this._shaderValues.setTexture(CustomMaterial.DIFFUSETEXTURE, value);
    }
    //设置marginalColor（边缘光照颜色）
    set marginalColor(value){
        this._shaderValues.setVector(CustomMaterial.MARGINALCOLOR, value);
    }

}
//ES6可以定义静态属性，这些属性是CustomMaterial的属性，不属于CustomMaterial实例的属性。ES7提案将支持在class中使用static定义静态属性
CustomMaterial.DIFFUSETEXTURE = 1;
CustomMaterial.MARGINALCOLOR = 2;

