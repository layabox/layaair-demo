class CartoonMaterial extends Laya.Material {
	/**
	 * @private
	 */
	static __init__() {
		CartoonMaterial.SHADERDEFINE_ALBEDOTEXTURE = this.shaderDefines.registerDefine("ALBEDOTEXTURE");
		CartoonMaterial.SHADERDEFINE_BLENDTEXTURE = this.shaderDefines.registerDefine("BLENDTEXTURE");
		CartoonMaterial.SHADERDEFINE_OUTLINETEXTURE = this.shaderDefines.registerDefine("OUTLINETEXTURE");
		CartoonMaterial.SHADERDEFINE_TILINGOFFSET = this.shaderDefines.registerDefine("TILINGOFFSET");
	}
	
	static initShader() {
		
		CartoonMaterial.__init__();
		
		var attributeMap = 
		{
			'a_Position': Laya.VertexMesh.MESH_POSITION0, 
			'a_Normal': Laya.VertexMesh.MESH_NORMAL0, 
			'a_Texcoord0': Laya.VertexMesh.MESH_TEXTURECOORDINATE0
		};
		var uniformMap = 
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
		var subShader = new Laya.SubShader(attributeMap, uniformMap,Laya.SkinnedMeshSprite3D.shaderDefines,CartoonMaterial.shaderDefines);
		cartoonShader3D.addSubShader(subShader);
		var vs1 = `attribute vec4 a_Position;
		attribute vec3 a_Normal; 
		attribute vec2 a_Texcoord0;
		uniform mat4 u_MvpMatrix; 
		uniform float u_OutlineWidth; 
		varying vec2 v_Texcoord0;     
		void main() 
		{
		   v_Texcoord0 = a_Texcoord0; 
		   vec4 position = vec4(a_Position.xyz + a_Normal * u_OutlineWidth, 1.0); 
		   gl_Position = u_MvpMatrix * position; 
		}`;
		var ps1 = `
		#ifdef FSHIGHPRECISION 
		   precision highp float; 
		#else 
		   precision mediump float; 
		#endif 
	
		struct DirectionLight 
		{ 
		   vec3 Color; 
		   vec3 Direction; 
		}; 
	
		varying vec2 v_Texcoord0; 
	
		#ifdef OUTLINETEXTURE 
		   uniform sampler2D u_OutlineTexture; 
		#endif 
		   uniform float u_OutlineLightness; 
	
		void main() 
		{ 
		vec4 outlineTextureColor = vec4(1.0); 
		#ifdef OUTLINETEXTURE 
		   outlineTextureColor = texture2D(u_OutlineTexture, v_Texcoord0); 
		#endif 
		vec3 finalColor = outlineTextureColor.rgb * u_OutlineLightness; 
		gl_FragColor = vec4(finalColor,0.0); 
		}`;
	
		var pass1 = subShader.addShaderPass(vs1, ps1);
		pass1.renderState.cull = Laya.RenderState.CULL_FRONT;
		var vs2 = `attribute vec4 a_Position; 
		attribute vec3 a_Normal;
		attribute vec2 a_Texcoord0;	
		uniform mat4 u_MvpMatrix;
		uniform mat4 u_WorldMat;
		uniform vec3 u_CameraPos;	
		varying vec2 v_Texcoord0;
		varying vec3 v_Normal;
		varying vec3 v_PositionWorld;
		varying vec3 v_ViewDir;
		
		void main()
		{
		    gl_Position = u_MvpMatrix * a_Position;		
		    mat3 worldMat = mat3(u_WorldMat);
			v_PositionWorld = (u_WorldMat * a_Position).xyz;
			v_Normal = worldMat * a_Normal;
			v_Texcoord0 = a_Texcoord0;		
			v_ViewDir = u_CameraPos - v_PositionWorld; 
		}`;

		var ps2 = `
		#ifdef FSHIGHPRECISION
			precision highp float;
		#else
			precision mediump float;
		#endif
	
		struct DirectionLight
		{
			vec3 Color;
			vec3 Direction;
		};
	
		varying vec2 v_Texcoord0;
		varying vec3 v_Normal;
		varying vec3 v_PositionWorld;
		varying vec3 v_ViewDir;
	
		#ifdef ALBEDOTEXTURE
			uniform sampler2D u_AlbedoTexture;
		#endif
	
		#ifdef BLENDTEXTURE
			uniform sampler2D u_BlendTexture;
		#endif
	
		uniform vec4 u_ShadowColor;
		uniform float u_ShadowRange;
		uniform float u_ShadowIntensity;
		uniform float u_SpecularRange;
		uniform float u_SpecularIntensity;
	
		uniform DirectionLight u_DirectionLight;
	
		void main()
		{
			vec3 normal = normalize(v_Normal);
			vec3 viewdir = normalize(v_ViewDir);
			vec3 lightDir = normalize(u_DirectionLight.Direction);
		
			vec4 albedoTextureColor = vec4(1.0);
			#ifdef ALBEDOTEXTURE
				albedoTextureColor = texture2D(u_AlbedoTexture, v_Texcoord0);
			#endif
			
			vec4 blendTextureColor = vec4(1.0); 
			#ifdef BLENDTEXTURE
				blendTextureColor = texture2D(u_BlendTexture, v_Texcoord0);
			#endif
		
			float blendTexColorG = blendTextureColor.g;
			
			//Overlay BlendMode 叠加
			vec3 albedoColor;
			albedoColor.r = albedoTextureColor.r > 0.5 ? 1.0 - 2.0 * (1.0 - albedoTextureColor.r) * (1.0 - blendTexColorG) : 2.0 * albedoTextureColor.r * blendTexColorG;
			albedoColor.g = albedoTextureColor.g > 0.5 ? 1.0 - 2.0 * (1.0 - albedoTextureColor.g) * (1.0 - blendTexColorG) : 2.0 * albedoTextureColor.g * blendTexColorG;
			albedoColor.b = albedoTextureColor.b > 0.5 ? 1.0 - 2.0 * (1.0 - albedoTextureColor.b) * (1.0 - blendTexColorG) : 2.0 * albedoTextureColor.b * blendTexColorG;
			
			albedoColor = clamp(albedoColor, 0.0, 1.0);
			
			float nl = max(dot(normal, -lightDir), 0.0);
			
			float shadowValue = nl + blendTexColorG - 0.5;
			float shadow = step(shadowValue, u_ShadowRange);
			if(u_ShadowRange > (shadowValue + 0.015))
				shadow = 1.0;
			else if(u_ShadowRange < (shadowValue - 0.015))
				shadow = 0.0;
			else
				shadow = (u_ShadowRange - (shadowValue - 0.015)) / 0.03;
				
			shadow = clamp(shadow, 0.0, 1.0);
			
			//specularTextureColor.r 影响高光范围
			float specular = step(u_SpecularRange, clamp(pow(nl, blendTextureColor.r), 0.0, 1.0));
			//specularTextureColor.b 影响高光强度
			specular = step(0.1, specular * blendTextureColor.b);
			
			vec3 albedoAreaColor = (1.0 - shadow) * albedoColor;
			vec3 shadowAreaColor = shadow * albedoColor * u_ShadowColor.rgb * u_ShadowIntensity;
			vec3 speculAreaColor = (1.0 - shadow) * albedoColor * u_SpecularIntensity * specular;
			
			vec3 finalColor = albedoAreaColor + speculAreaColor + shadowAreaColor;
			
			gl_FragColor = vec4(finalColor, 1.0);
		}`;
	
		//var vs2:String = __INCLUDESTR__("shader/cartoon.vs");
		//var ps2:String = __INCLUDESTR__("shader/cartoon.ps");
		subShader.addShaderPass(vs2, ps2);
	}
	
	/**
	 * 获取漫反射贴图。
	 * @return 漫反射贴图。
	 */
	get albedoTexture() {
		return this._shaderValues.getTexture(CartoonMaterial.ALBEDOTEXTURE);
	}
	
	/**
	 * 设置漫反射贴图。
	 * @param value 漫反射贴图。
	 */
	set albedoTexture(value) {
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
	get blendTexture() {
		return this._shaderValues.getTexture(CartoonMaterial.BLENDTEXTURE);
	}
	
	/**
	 * 设置混合贴图。
	 * @param value 混合贴图。
	 */
	set blendTexture(value) {
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
	get outlineTexture() {
		return this._shaderValues.getTexture(CartoonMaterial.OUTLINETEXTURE);
	}
	
	/**
	 * 设置轮廓贴图。
	 * @param value 轮廓贴图。
	 */
	set outlineTexture(value) {
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
	get shadowColor() {
		return this._shaderValues.getVector(CartoonMaterial.SHADOWCOLOR);
	}
	
	/**
	 * 设置阴影颜色。
	 * @param value 阴影颜色。
	 */
	set shadowColor(value) {
		this._shaderValues.setVector(CartoonMaterial.SHADOWCOLOR, value);
	}
	
	/**
	 * 获取阴影范围。
	 * @return 阴影范围,范围为0到1。
	 */
	get shadowRange() {
		return this._shaderValues.getNumber(CartoonMaterial.SHADOWRANGE);
	}
	
	/**
	 * 设置阴影范围。
	 * @param value 阴影范围,范围为0到1。
	 */
	set shadowRange(value) {
		value = Math.max(0.0, Math.min(1.0, value));
		this._shaderValues.setNumber(CartoonMaterial.SHADOWRANGE, value);
	}
	
	/**
	 * 获取阴影强度。
	 * @return 阴影强度,范围为0到1。
	 */
	get shadowIntensity() {
		return this._shaderValues.getNumber(CartoonMaterial.SHADOWINTENSITY);
	}
	
	/**
	 * 设置阴影强度。
	 * @param value 阴影强度,范围为0到1。
	 */
	set shadowIntensity(value) {
		value = Math.max(0.0, Math.min(1.0, value));
		this._shaderValues.setNumber(CartoonMaterial.SHADOWINTENSITY, value);
	}
	
	/**
	 * 获取高光范围。
	 * @return 高光范围,范围为0.9到1。
	 */
	get specularRange() {
		return this._shaderValues.getNumber(CartoonMaterial.SPECULARRANGE);
	}
	
	/**
	 * 设置高光范围。
	 * @param value 高光范围,范围为0.9到1。
	 */
	set specularRange(value) {
		value = Math.max(0.9, Math.min(1.0, value));
		this._shaderValues.setNumber(CartoonMaterial.SPECULARRANGE, value);
	}
	
	
	
	/**
	 * 获取轮廓宽度。
	 * @return 轮廓宽度,范围为0到0.05。
	 */
	get outlineWidth() {
		return this._shaderValues.getNumber(CartoonMaterial.OUTLINEWIDTH);
	}
	
	/**
	 * 设置轮廓宽度。
	 * @param value 轮廓宽度,范围为0到0.05。
	 */
	set outlineWidth(value) {
		value = Math.max(0.0, Math.min(0.05, value));
		this._shaderValues.setNumber(CartoonMaterial.OUTLINEWIDTH, value);
	}
	
	/**
	 * 获取轮廓亮度。
	 * @return 轮廓亮度,范围为0到1。
	 */
	get outlineLightness() {
		return this._shaderValues.getNumber(CartoonMaterial.OUTLINELIGHTNESS);
	}
	
	/**
	 * 设置轮廓亮度。
	 * @param value 轮廓亮度,范围为0到1。
	 */
	set outlineLightness(value) {
		value = Math.max(0.0, Math.min(1.0, value));
		this._shaderValues.setNumber(CartoonMaterial.OUTLINELIGHTNESS, value);
	}
	
	/**
	 * 设置高光强度。
	 * @param value 高光范围,范围为0到1。
	 */
	set specularIntensity(value) {
		value = Math.max(0.0, Math.min(1.0, value));
		this._shaderValues.setNumber(CartoonMaterial.SPECULARINTENSITY, value);
	}
	/**
	 * 获取高光强度。
	 * @return 高光强度,范围为0到1。
	 */
	get specularIntensity() {
		return this._shaderValues.getNumber(CartoonMaterial.SPECULARINTENSITY);
	}
	
	/**
	 * 获取纹理平铺和偏移。
	 * @return 纹理平铺和偏移。
	 */
	get tilingOffset() {
		return this._shaderValues.getVector(CartoonMaterial.TILINGOFFSET);
	}
	
	/**
	 * 设置纹理平铺和偏移。
	 * @param value 纹理平铺和偏移。
	 */
	set tilingOffset(value) {
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

CartoonMaterial.ALBEDOTEXTURE = Laya.Shader3D.propertyNameToID("u_AlbedoTexture");
CartoonMaterial.BLENDTEXTURE = Laya.Shader3D.propertyNameToID("u_BlendTexture");
CartoonMaterial.OUTLINETEXTURE = Laya.Shader3D.propertyNameToID("u_OutlineTexture");
CartoonMaterial.SHADOWCOLOR = Laya.Shader3D.propertyNameToID("u_ShadowColor");
CartoonMaterial.SHADOWRANGE = Laya.Shader3D.propertyNameToID("u_ShadowRange");
CartoonMaterial.SHADOWINTENSITY = Laya.Shader3D.propertyNameToID("u_ShadowIntensity");
CartoonMaterial.SPECULARRANGE = Laya.Shader3D.propertyNameToID("u_SpecularRange");
CartoonMaterial.SPECULARINTENSITY = Laya.Shader3D.propertyNameToID("u_SpecularIntensity");
CartoonMaterial.OUTLINEWIDTH = Laya.Shader3D.propertyNameToID("u_OutlineWidth");
CartoonMaterial.OUTLINELIGHTNESS = Laya.Shader3D.propertyNameToID("u_OutlineLightness");
CartoonMaterial.TILINGOFFSET;
	
CartoonMaterial.SHADERDEFINE_ALBEDOTEXTURE ;
CartoonMaterial.SHADERDEFINE_BLENDTEXTURE;
CartoonMaterial.SHADERDEFINE_OUTLINETEXTURE;
CartoonMaterial.SHADERDEFINE_TILINGOFFSET;

CartoonMaterial.shaderDefines = new Laya.ShaderDefines(Laya.BaseMaterial.shaderDefines);