class CustomMaterial extends Laya.Material {
    public static DIFFUSETEXTURE: number =  Laya.Shader3D.propertyNameToID("u_texture");
    public static MARGINALCOLOR: number = Laya.Shader3D.propertyNameToID("u_marginalColor");
    constructor() {
        super();
        this.setShaderName("CustomShader");
    }
    /**
     * 获取漫反射贴图。
     *  漫反射贴图。
     */
    public get diffuseTexture(): Laya.BaseTexture {
        return this._shaderValues.getTexture(CustomMaterial.DIFFUSETEXTURE);
    }

    /**
     * 设置漫反射贴图。
     * 漫反射贴图。
     */
    public set diffuseTexture(value: Laya.BaseTexture) {
        this._shaderValues.setTexture(CustomMaterial.DIFFUSETEXTURE,value);
    }

    /**
     * 设置边缘光照颜色。
     * 边缘光照颜色。
     */
    public set marginalColor(value: Laya.Vector3) {
        this._shaderValues.setVector3(CustomMaterial.MARGINALCOLOR, value);
    }
}