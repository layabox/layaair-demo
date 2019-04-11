export default class  MultiplePassOutlineMaterial extends Laya.BaseMaterial {
		public static ALBEDOTEXTURE = Laya.Shader3D.propertyNameToID("u_AlbedoTexture");
		public static MARGINALCOLOR = Laya.Shader3D.propertyNameToID("u_marginalColor");
		public static OUTLINETEXTURE = Laya.Shader3D.propertyNameToID("u_OutlineTexture");
		public static OUTLINEWIDTH = Laya.Shader3D.propertyNameToID("u_OutlineWidth");
		public static OUTLINELIGHTNESS = Laya.Shader3D.propertyNameToID("u_OutlineLightness");
		
		public static SHADERDEFINE_ALBEDOTEXTURE;
		/**@private */
		public static shaderDefines:Laya.ShaderDefines = new Laya.ShaderDefines(Laya.BaseMaterial.shaderDefines);
		
		/**
		 * @private
		 */
		public static __init__():void {
			MultiplePassOutlineMaterial.SHADERDEFINE_ALBEDOTEXTURE = MultiplePassOutlineMaterial.shaderDefines.registerDefine("ALBEDOTEXTURE");
		}
		/**
		 * 获取漫反射贴图。
		 * @return 漫反射贴图。
		 */
		public get albedoTexture():Laya.BaseTexture {
			return this._shaderValues.getTexture(MultiplePassOutlineMaterial.ALBEDOTEXTURE);
		}
		
		/**
		 * 设置漫反射贴图。
		 * @param value 漫反射贴图。
		 */
		public  set albedoTexture(value:Laya.BaseTexture) {
			if (value)
				this._defineDatas.add(MultiplePassOutlineMaterial.SHADERDEFINE_ALBEDOTEXTURE);
			else
				this._defineDatas.remove(MultiplePassOutlineMaterial.SHADERDEFINE_ALBEDOTEXTURE);
			this._shaderValues.setTexture(MultiplePassOutlineMaterial.ALBEDOTEXTURE, value);
		}
		/**
		 * 设置边缘光照颜色。
		 * @param value 边缘光照颜色。
		 */
		public set marginalColor(value:Laya.Vector3) {
			//this._shaderValues.setVector3(MultiplePassOutlineMaterial.MARGINALCOLOR, value);
		}
		
		
		/**
		 * 获取漫轮廓贴图。
		 * @return 轮廓贴图。
		 */
		public get outlineTexture():Laya.BaseTexture {
			return this._shaderValues.getTexture(MultiplePassOutlineMaterial.OUTLINETEXTURE);
		}
		
		/**
		 * 设置轮廓贴图。
		 * @param value 轮廓贴图。
		 */
		public set outlineTexture(value:Laya.BaseTexture) {
			//if (value)
				//this._defineDatas.add(MultiplePassOutlineMaterial.SHADERDEFINE_OUTLINETEXTURE);
			//else
				//this._defineDatas.remove(MultiplePassOutlineMaterial.SHADERDEFINE_OUTLINETEXTURE);
			//this._shaderValues.setTexture(MultiplePassOutlineMaterial.OUTLINETEXTURE, value);
		}
		/**
		 * 获取轮廓宽度。
		 * @return 轮廓宽度,范围为0到0.05。
		 */
		public get outlineWidth():number {
			return this._shaderValues.getNumber(MultiplePassOutlineMaterial.OUTLINEWIDTH);
		}
		
		/**
		 * 设置轮廓宽度。
		 * @param value 轮廓宽度,范围为0到0.05。
		 */
		public set outlineWidth(value:number) {
			value = Math.max(0.0, Math.min(0.05, value));
			this._shaderValues.setNumber(MultiplePassOutlineMaterial.OUTLINEWIDTH, value);
		}
		
		/**
		 * 获取轮廓亮度。
		 * @return 轮廓亮度,范围为0到1。
		 */
		public get outlineLightness():number {
			return this._shaderValues.getNumber(MultiplePassOutlineMaterial.OUTLINELIGHTNESS);
		}
		
		/**
		 * 设置轮廓亮度。
		 * @param value 轮廓亮度,范围为0到1。
		 */
		public set outlineLightness(value:number) {
			value = Math.max(0.0, Math.min(1.0, value));
			this._shaderValues.setNumber(MultiplePassOutlineMaterial.OUTLINELIGHTNESS, value);
		}
		
		
		public static initShader():void {
			MultiplePassOutlineMaterial.__init__();
			var attributeMap:Object = {'a_Position': Laya.VertexMesh.MESH_POSITION0, 
									   'a_Normal': Laya.VertexMesh.MESH_NORMAL0, 
									   'a_Texcoord0': Laya.VertexMesh.MESH_TEXTURECOORDINATE0,
									   'a_BoneWeights': Laya.VertexMesh.MESH_BLENDWEIGHT0, 
									   'a_BoneIndices': Laya.VertexMesh.MESH_BLENDINDICES0
									};
			var uniformMap:Object = {'u_MvpMatrix': Laya.Shader3D.PERIOD_SPRITE, 
									 'u_WorldMat': Laya.Shader3D.PERIOD_SPRITE,
									 'u_OutlineWidth': Laya.Shader3D.PERIOD_MATERIAL, 
			                         'u_OutlineTexture': Laya.Shader3D.PERIOD_MATERIAL,
									 'u_OutlineLightness': Laya.Shader3D.PERIOD_MATERIAL,
									 'u_Bones': Laya.Shader3D.PERIOD_CUSTOM, 
									 'u_CameraPos': Laya.Shader3D.PERIOD_CAMERA,
									 'u_texture': Laya.Shader3D.PERIOD_MATERIAL, 
									 'u_DirectionLight.Direction': Laya.Shader3D.PERIOD_SCENE, 
									 'u_DirectionLight.Color': Laya.Shader3D.PERIOD_SCENE
									};
									
			var customShader:Laya.Shader3D = Laya.Shader3D.add("MultiplePassOutlineShader");
			var subShader:Laya.SubShader = new Laya.SubShader(attributeMap, uniformMap,MultiplePassOutlineMaterial.shaderDefines);
            customShader.addSubShader(subShader);
            let vs1:string = "attribute vec4 a_Position;\n" + 
            "attribute vec3 a_Normal;\n" + 
            "attribute vec2 a_Texcoord0;\n" + 
            
            "uniform mat4 u_MvpMatrix;\n" + 
            "uniform float u_OutlineWidth;\n" + 
            
            "varying vec2 v_Texcoord0;\n" + 
            
            "void main()\n" + 
            "{\n" + 
            "   v_Texcoord0 = a_Texcoord0;\n" +     
            "   vec4 position = vec4(a_Position.xyz + a_Normal * u_OutlineWidth, 1.0);\n" + 
            "   gl_Position = u_MvpMatrix * position;\n" + 
            "}\n" ;

			let ps1:string = "#ifdef FSHIGHPRECISION\n" + 
            "precision highp float;\n" + 
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
            "uniform float u_OutlineLightness;\n" + 
        
            "void main()\n" + 
            "{\n" + 
            "   vec4 outlineTextureColor = vec4(1.0);\n" + 
            "   #ifdef OUTLINETEXTURE\n" + 
            "       outlineTextureColor = texture2D(u_OutlineTexture, v_Texcoord0);\n" + 
            "   #endif\n" + 
            
            "   vec3 finalColor = outlineTextureColor.rgb * u_OutlineLightness;\n" + 
            
            "   gl_FragColor = vec4(finalColor,0.0);\n" + 
            "}";
        
			var pass1 = subShader.addShaderPass(vs1, ps1);
			pass1.renderState.cull = Laya.RenderState.CULL_FRONT;
			let vs2:string = '#include "Lighting.glsl";\n' + 

            "attribute vec4 a_Position;\n" + 
            "attribute vec2 a_Texcoord0;\n" + 
            
            "uniform mat4 u_MvpMatrix;\n" + 
            "uniform mat4 u_WorldMat;\n" + 
            
            
            "attribute vec3 a_Normal;\n" + 
            "varying vec3 v_Normal;\n" + 
            "varying vec2 v_Texcoord0;\n" + 
            
            "void main()\n" + 
            "{\n" + 
            "   gl_Position = u_MvpMatrix * a_Position;\n" + 
                  
            "   mat3 worldMat=mat3(u_WorldMat);\n" + 
            "   v_Normal=worldMat*a_Normal;\n" + 
            "   v_Texcoord0 = a_Texcoord0;\n" + 
            "   gl_Position=remapGLPositionZ(gl_Position);\n" + 
            "}\n" 
			let ps2:string = "#ifdef FSHIGHPRECISION\n" + 
            "precision highp float;\n" +
            "#else\n" +
            "precision mediump float;\n" +
            "#endif\n" +
            "varying vec2 v_Texcoord0;\n" +
            "varying vec3 v_Normal;\n" +
            
            "uniform sampler2D u_AlbedoTexture;\n" +
            
            
            "void main()\n" +
            "{\n" +
            "   vec4 albedoTextureColor = vec4(1.0);\n" +
               
            "   albedoTextureColor = texture2D(u_AlbedoTexture, v_Texcoord0);\n" +
            "   gl_FragColor=albedoTextureColor;\n" +
            "}\n" 
            
			subShader.addShaderPass(vs2, ps2);
		}
		
	
		
		constructor() {
			super();
			this.setShaderName("MultiplePassOutlineShader");
			this._shaderValues.setNumber(MultiplePassOutlineMaterial.OUTLINEWIDTH, 0.01581197);
			this._shaderValues.setNumber(MultiplePassOutlineMaterial.OUTLINELIGHTNESS, 1);
		}
	}
