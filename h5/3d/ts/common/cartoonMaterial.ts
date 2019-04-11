export default class CartoonMaterial extends Laya.BaseMaterial {
		
	public static ALBEDOTEXTURE:number = Laya.Shader3D.propertyNameToID("u_AlbedoTexture");
	public static BLENDTEXTURE:number = Laya.Shader3D.propertyNameToID("u_BlendTexture");
	public static OUTLINETEXTURE:number = Laya.Shader3D.propertyNameToID("u_OutlineTexture");
	public static SHADOWCOLOR:number = Laya.Shader3D.propertyNameToID("u_ShadowColor");
	public static SHADOWRANGE:number = Laya.Shader3D.propertyNameToID("u_ShadowRange");
	public static SHADOWINTENSITY:number = Laya.Shader3D.propertyNameToID("u_ShadowIntensity");
	public static SPECULARRANGE:number = Laya.Shader3D.propertyNameToID("u_SpecularRange");
	public static SPECULARINTENSITY:number = Laya.Shader3D.propertyNameToID("u_SpecularIntensity");
	public static OUTLINEWIDTH:number = Laya.Shader3D.propertyNameToID("u_OutlineWidth");
	public static OUTLINELIGHTNESS:number = Laya.Shader3D.propertyNameToID("u_OutlineLightness");
	public static TILINGOFFSET:number;
	
	public static SHADERDEFINE_ALBEDOTEXTURE:number;
	public static SHADERDEFINE_BLENDTEXTURE:number;
	public static SHADERDEFINE_OUTLINETEXTURE:number;
	public static SHADERDEFINE_TILINGOFFSET:number;
	
	/**@private */
	public static shaderDefines:Laya.ShaderDefines = new Laya.ShaderDefines(Laya.BaseMaterial.shaderDefines);

	/**
	 * @private
	 */
	public static __init__():void {
		CartoonMaterial.SHADERDEFINE_ALBEDOTEXTURE = this.shaderDefines.registerDefine("ALBEDOTEXTURE");
		CartoonMaterial.SHADERDEFINE_BLENDTEXTURE = this.shaderDefines.registerDefine("BLENDTEXTURE");
		CartoonMaterial.SHADERDEFINE_OUTLINETEXTURE = this.shaderDefines.registerDefine("OUTLINETEXTURE");
		CartoonMaterial.SHADERDEFINE_TILINGOFFSET = this.shaderDefines.registerDefine("TILINGOFFSET");
	}
	
	public static initShader():void {
		
		CartoonMaterial.__init__();
		
		var attributeMap:Object = 
		{
			'a_Position': Laya.VertexMesh.MESH_POSITION0, 
			'a_Normal': Laya.VertexMesh.MESH_NORMAL0, 
			'a_Texcoord0': Laya.VertexMesh.MESH_TEXTURECOORDINATE0
		};
		var uniformMap:Object = 
		{
			'u_MvpMatrix': Laya.Shader3D.PERIOD_SPRITE, 
			'u_WorldMat': Laya.Shader3D.PERIOD_SPRITE, 
			'u_CameraPos': Laya.Shader3D.PERIOD_CAMERA, 
			'u_AlbedoTexture': Laya.Shader3D.PERIOD_MATERIAL, 
			'u_BlendTexture': Laya.Shader3D.PERIOD_MATERIAL, 
			'u_OutlineTexture': Laya.Shader3D.PERIOD_MATERIAL, 
			'u_ShadowColor': Laya.Shader3D.PERIOD_MATERIAL, 
			'u_ShadowRange': Laya.Shader3D.PERIOD_MATERIAL, 
			'u_ShadowIntensity': Laya.Shader3D.PERIOD_MATERIAL, 
			'u_SpecularRange': Laya.Shader3D.PERIOD_MATERIAL, 
			'u_SpecularIntensity': Laya.Shader3D.PERIOD_MATERIAL, 
			'u_OutlineWidth': Laya.Shader3D.PERIOD_MATERIAL, 
			'u_OutlineLightness': Laya.Shader3D.PERIOD_MATERIAL,
			'u_DirectionLight.Direction': Laya.Shader3D.PERIOD_SCENE, 
			'u_DirectionLight.Color': Laya.Shader3D.PERIOD_SCENE
		};
		var cartoonShader3D = Laya.Shader3D.add("CartoonShader");
		var subShader = new Laya.SubShader(attributeMap, uniformMap,Laya.SkinnedMeshSprite3D.shaderDefines,CartoonMaterial.shaderDefines) as Laya.SubShader;
		cartoonShader3D.addSubShader(subShader);
		//var vs1:String = __INCLUDESTR__("shader/outline.vs");
		var vs1:string = "attribute vec4 a_Position;\n" + 
		"attribute vec3 a_Normal;\n" + 
		"attribute vec2 a_Texcoord0;\n" +
		"uniform mat4 u_MvpMatrix;\n" + 
		"uniform float u_OutlineWidth;\n" + 
		"varying vec2 v_Texcoord0;\n" +     
		"void main()\n" + 
		"{\n"+ 
		"   v_Texcoord0 = a_Texcoord0;\n" + 
		"   vec4 position = vec4(a_Position.xyz + a_Normal * u_OutlineWidth, 1.0);\n" + 
		"   gl_Position = u_MvpMatrix * position;\n" + 
		"}\n";
		var ps1:string = "#ifdef FSHIGHPRECISION\n" + 
		"   precision highp float;\n" + 
		"#else\n" + 
		"   precision mediump float;\n" + 
		"#endif\n" + 
	
		"struct DirectionLight\n" + 
		"{\n" + 
		"   vec3 Color;\n" + 
		"   vec3 Direction;\n" + 
		"};\n" + 
	
		"varying vec2 v_Texcoord0;\n" + 
	
		"#ifdef OUTLINETEXTURE\n" + 
		"   uniform sampler2D u_OutlineTexture;\n" + 
		"#endif\n" + 
		"   uniform float u_OutlineLightness;\n" + 
	
		"void main()\n" + 
		"{\n" + 
		"vec4 outlineTextureColor = vec4(1.0);\n" + 
		"#ifdef OUTLINETEXTURE\n" + 
		"   outlineTextureColor = texture2D(u_OutlineTexture, v_Texcoord0);\n" + 
		"#endif\n" + 
		"vec3 finalColor = outlineTextureColor.rgb * u_OutlineLightness;\n" + 
		"gl_FragColor = vec4(finalColor,0.0);\n" + 
		"}\n";
	
		//var ps1:String = __INCLUDESTR__("shader/outline.ps");
		var pass1:Laya.ShaderPass = subShader.addShaderPass(vs1, ps1) as Laya.ShaderPass;
		pass1.renderState.cull = Laya.RenderState.CULL_FRONT;
		debugger;
		var vs2:string = "attribute vec4 a_Position;\n" + 
		"attribute vec3 a_Normal;\n" +
		"attribute vec2 a_Texcoord0;\n" +	
		"uniform mat4 u_MvpMatrix;\n" +
		"uniform mat4 u_WorldMat;\n" +
		"uniform vec3 u_CameraPos;\n" +	
		"varying vec2 v_Texcoord0;\n" +
		"varying vec3 v_Normal;\n" +
		"varying vec3 v_PositionWorld;\n" +
		"varying vec3 v_ViewDir;\n" +
		
		"void main()\n" +
		"{\n" +
		"    gl_Position = u_MvpMatrix * a_Position;\n" +		
		"    mat3 worldMat = mat3(u_WorldMat);\n" +
		"	v_PositionWorld = (u_WorldMat * a_Position).xyz;\n" +
		"	v_Normal = worldMat * a_Normal;\n" +
		"	v_Texcoord0 = a_Texcoord0;\n" +		
		"	v_ViewDir = u_CameraPos - v_PositionWorld;\n" + 
		"}\n";

		var ps2:string = "#ifdef FSHIGHPRECISION\n" +
		"	precision highp float;\n" +
		"#else\n" +
		"	precision mediump float;\n" +
		"#endif\n" +
	
		"struct DirectionLight\n" +
		"{\n" +
		"	vec3 Color;\n" +
		"	vec3 Direction;\n" +
		"};\n" +
	
		"varying vec2 v_Texcoord0;\n" +
		"varying vec3 v_Normal;\n" +
		"varying vec3 v_PositionWorld;\n" +
		"varying vec3 v_ViewDir;\n" +
	
		"#ifdef ALBEDOTEXTURE\n" +
		"	uniform sampler2D u_AlbedoTexture;\n" +
		"#endif\n" +
	
		"#ifdef BLENDTEXTURE\n" +
		"	uniform sampler2D u_BlendTexture;\n" +
		"#endif\n" +
	
		"uniform vec4 u_ShadowColor;\n" +
		"uniform float u_ShadowRange;\n" +
		"uniform float u_ShadowIntensity;\n" +
		"uniform float u_SpecularRange;\n" +
		"uniform float u_SpecularIntensity;\n" +
	
		"uniform DirectionLight u_DirectionLight;\n" +
	
		"void main()\n" +
		"{\n" +
		"	vec3 normal = normalize(v_Normal);\n" +
		"	vec3 viewdir = normalize(v_ViewDir);\n" +
		"	vec3 lightDir = normalize(u_DirectionLight.Direction);\n" +
		
		"	vec4 albedoTextureColor = vec4(1.0);\n" +
		"#ifdef ALBEDOTEXTURE\n" +
		"	albedoTextureColor = texture2D(u_AlbedoTexture, v_Texcoord0);\n" +
		"#endif\n" +
		
		"vec4 blendTextureColor = vec4(1.0);\n" + 
		"#ifdef BLENDTEXTURE\n" +
		"	blendTextureColor = texture2D(u_BlendTexture, v_Texcoord0);\n" +
		"#endif\n" +
		
		"float blendTexColorG = blendTextureColor.g;\n" +
		
		//Overlay BlendMode 叠加
		"vec3 albedoColor;\n" +
		"albedoColor.r = albedoTextureColor.r > 0.5 ? 1.0 - 2.0 * (1.0 - albedoTextureColor.r) * (1.0 - blendTexColorG) : 2.0 * albedoTextureColor.r * blendTexColorG;\n" +
		"albedoColor.g = albedoTextureColor.g > 0.5 ? 1.0 - 2.0 * (1.0 - albedoTextureColor.g) * (1.0 - blendTexColorG) : 2.0 * albedoTextureColor.g * blendTexColorG;\n" +
		"albedoColor.b = albedoTextureColor.b > 0.5 ? 1.0 - 2.0 * (1.0 - albedoTextureColor.b) * (1.0 - blendTexColorG) : 2.0 * albedoTextureColor.b * blendTexColorG;\n" +
		
		"albedoColor = clamp(albedoColor, 0.0, 1.0);\n" +
		
		"float nl = max(dot(normal, -lightDir), 0.0);\n" +
		
		"float shadowValue = nl + blendTexColorG - 0.5;\n" +
		"float shadow = step(shadowValue, u_ShadowRange);\n" +
		"if(u_ShadowRange > (shadowValue + 0.015))\n" +
		"	shadow = 1.0;\n" +
		"else if(u_ShadowRange < (shadowValue - 0.015))\n" +
		"	shadow = 0.0;\n" +
		"else\n" +
		"	shadow = (u_ShadowRange - (shadowValue - 0.015)) / 0.03;\n" +
			
		"shadow = clamp(shadow, 0.0, 1.0);\n" +
		
		//specularTextureColor.r 影响高光范围
		"float specular = step(u_SpecularRange, clamp(pow(nl, blendTextureColor.r), 0.0, 1.0));\n" +
		//specularTextureColor.b 影响高光强度
		"specular = step(0.1, specular * blendTextureColor.b);\n" +
		
		"vec3 albedoAreaColor = (1.0 - shadow) * albedoColor;\n" +
		"vec3 shadowAreaColor = shadow * albedoColor * u_ShadowColor.rgb * u_ShadowIntensity;\n" +
		"vec3 speculAreaColor = (1.0 - shadow) * albedoColor * u_SpecularIntensity * specular;\n" +
		
		"vec3 finalColor = albedoAreaColor + speculAreaColor + shadowAreaColor;\n" +
		
		"gl_FragColor = vec4(finalColor, 1.0);\n" +
		"}";
	
		//var vs2:String = __INCLUDESTR__("shader/cartoon.vs");
		//var ps2:String = __INCLUDESTR__("shader/cartoon.ps");
		subShader.addShaderPass(vs2, ps2);
	}
	
	/**
	 * 获取漫反射贴图。
	 * @return 漫反射贴图。
	 */
	public  get albedoTexture():Laya.BaseTexture {
		return this._shaderValues.getTexture(CartoonMaterial.ALBEDOTEXTURE);
	}
	
	/**
	 * 设置漫反射贴图。
	 * @param value 漫反射贴图。
	 */
	public  set albedoTexture(value:Laya.BaseTexture) {
		if (value)
			this._defineDatas.add(CartoonMaterial.SHADERDEFINE_ALBEDOTEXTURE);
		else
			this._defineDatas.remove(CartoonMaterial.SHADERDEFINE_ALBEDOTEXTURE);
		this._shaderValues.setTexture(CartoonMaterial.ALBEDOTEXTURE, value);
	}
	
	/**
	 * 获取混合贴图。
	 * @return 混合贴图。
	 */
	public get blendTexture():Laya.BaseTexture {
		return this._shaderValues.getTexture(CartoonMaterial.BLENDTEXTURE);
	}
	
	/**
	 * 设置混合贴图。
	 * @param value 混合贴图。
	 */
	public set blendTexture(value:Laya.BaseTexture) {
		if (value)
			this._defineDatas.add(CartoonMaterial.SHADERDEFINE_BLENDTEXTURE);
		else
			this._defineDatas.remove(CartoonMaterial.SHADERDEFINE_BLENDTEXTURE);
		this._shaderValues.setTexture(CartoonMaterial.BLENDTEXTURE, value);
	}
	
	/**
	 * 获取漫轮廓贴图。
	 * @return 轮廓贴图。
	 */
	public get outlineTexture():Laya.BaseTexture {
		return this._shaderValues.getTexture(CartoonMaterial.OUTLINETEXTURE);
	}
	
	/**
	 * 设置轮廓贴图。
	 * @param value 轮廓贴图。
	 */
	public set outlineTexture(value:Laya.BaseTexture) {
		if (value)
			this._defineDatas.add(CartoonMaterial.SHADERDEFINE_OUTLINETEXTURE);
		else
			this._defineDatas.remove(CartoonMaterial.SHADERDEFINE_OUTLINETEXTURE);
		this._shaderValues.setTexture(CartoonMaterial.OUTLINETEXTURE, value);
	}
	
	/**
	 * 获取阴影颜色。
	 * @return 阴影颜色。
	 */
	public get shadowColor():Laya.Vector4 {
		return this._shaderValues.getVector(CartoonMaterial.SHADOWCOLOR) as Laya.Vector4;
	}
	
	/**
	 * 设置阴影颜色。
	 * @param value 阴影颜色。
	 */
	public set shadowColor(value:Laya.Vector4) {
		this._shaderValues.setVector(CartoonMaterial.SHADOWCOLOR, value);
	}
	
	/**
	 * 获取阴影范围。
	 * @return 阴影范围,范围为0到1。
	 */
	public get shadowRange():number {
		return this._shaderValues.getNumber(CartoonMaterial.SHADOWRANGE);
	}
	
	/**
	 * 设置阴影范围。
	 * @param value 阴影范围,范围为0到1。
	 */
	public set shadowRange(value:number) {
		value = Math.max(0.0, Math.min(1.0, value));
		this._shaderValues.setNumber(CartoonMaterial.SHADOWRANGE, value);
	}
	
	/**
	 * 获取阴影强度。
	 * @return 阴影强度,范围为0到1。
	 */
	public get shadowIntensity():number {
		return this._shaderValues.getNumber(CartoonMaterial.SHADOWINTENSITY);
	}
	
	/**
	 * 设置阴影强度。
	 * @param value 阴影强度,范围为0到1。
	 */
	public set shadowIntensity(value:number) {
		value = Math.max(0.0, Math.min(1.0, value));
		this._shaderValues.setNumber(CartoonMaterial.SHADOWINTENSITY, value);
	}
	
	/**
	 * 获取高光范围。
	 * @return 高光范围,范围为0.9到1。
	 */
	public get specularRange():number {
		return this._shaderValues.getNumber(CartoonMaterial.SPECULARRANGE);
	}
	
	/**
	 * 设置高光范围。
	 * @param value 高光范围,范围为0.9到1。
	 */
	public set specularRange(value:number) {
		value = Math.max(0.9, Math.min(1.0, value));
		this._shaderValues.setNumber(CartoonMaterial.SPECULARRANGE, value);
	}
	
	
	
	/**
	 * 获取轮廓宽度。
	 * @return 轮廓宽度,范围为0到0.05。
	 */
	public get outlineWidth():number {
		return this._shaderValues.getNumber(CartoonMaterial.OUTLINEWIDTH);
	}
	
	/**
	 * 设置轮廓宽度。
	 * @param value 轮廓宽度,范围为0到0.05。
	 */
	public set outlineWidth(value:number) {
		value = Math.max(0.0, Math.min(0.05, value));
		this._shaderValues.setNumber(CartoonMaterial.OUTLINEWIDTH, value);
	}
	
	/**
	 * 获取轮廓亮度。
	 * @return 轮廓亮度,范围为0到1。
	 */
	public get outlineLightness():number {
		return this._shaderValues.getNumber(CartoonMaterial.OUTLINELIGHTNESS);
	}
	
	/**
	 * 设置轮廓亮度。
	 * @param value 轮廓亮度,范围为0到1。
	 */
	public set outlineLightness(value:number) {
		value = Math.max(0.0, Math.min(1.0, value));
		this._shaderValues.setNumber(CartoonMaterial.OUTLINELIGHTNESS, value);
	}
	
	/**
	 * 设置高光强度。
	 * @param value 高光范围,范围为0到1。
	 */
	public set specularIntensity(value:number) {
		value = Math.max(0.0, Math.min(1.0, value));
		this._shaderValues.setNumber(CartoonMaterial.SPECULARINTENSITY, value);
	}
	/**
	 * 获取高光强度。
	 * @return 高光强度,范围为0到1。
	 */
	public get specularIntensity():number {
		return this._shaderValues.getNumber(CartoonMaterial.SPECULARINTENSITY);
	}
	
	/**
	 * 获取纹理平铺和偏移。
	 * @return 纹理平铺和偏移。
	 */
	public get tilingOffset():Laya.Vector4 {
		return this._shaderValues.getVector(CartoonMaterial.TILINGOFFSET) as Laya.Vector4;
	}
	
	/**
	 * 设置纹理平铺和偏移。
	 * @param value 纹理平铺和偏移。
	 */
	public set tilingOffset(value:Laya.Vector4) {
		if (value) {
			if (value.x != 1 || value.y != 1 || value.z != 0 || value.w != 0)
			this._defineDatas.add(CartoonMaterial.SHADERDEFINE_TILINGOFFSET);
			else
			this._defineDatas.remove(CartoonMaterial.SHADERDEFINE_TILINGOFFSET);
		} else {
			this._defineDatas.remove(CartoonMaterial.SHADERDEFINE_TILINGOFFSET);
		}
		this._shaderValues.setVector(CartoonMaterial.TILINGOFFSET, value);
	}
	
	constructor() {
		super();
		this.setShaderName("CartoonShader");
		this._shaderValues.setVector(CartoonMaterial.SHADOWCOLOR, new Laya.Vector4(0.6663285, 0.6544118, 1, 1));
		this._shaderValues.setNumber(CartoonMaterial.SHADOWRANGE, 0);
		this._shaderValues.setNumber(CartoonMaterial.SHADOWINTENSITY, 0.7956449);
		this._shaderValues.setNumber(CartoonMaterial.SPECULARRANGE, 0.9820514);
		this._shaderValues.setNumber(CartoonMaterial.SPECULARINTENSITY, 1);
		this._shaderValues.setNumber(CartoonMaterial.OUTLINEWIDTH, 0.01581197);
		this._shaderValues.setNumber(CartoonMaterial.OUTLINELIGHTNESS, 1);
	}
}