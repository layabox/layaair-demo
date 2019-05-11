export default class  MultiplePassOutlineMaterial extends Laya.BaseMaterial {
		public static ALBEDOTEXTURE = Laya.Shader3D.propertyNameToID("u_AlbedoTexture");
		public static MARGINALCOLOR = Laya.Shader3D.propertyNameToID("u_marginalColor");
		public static OUTLINETEXTURE = Laya.Shader3D.propertyNameToID("u_OutlineTexture");
		public static OUTLINEWIDTH = Laya.Shader3D.propertyNameToID("u_OutlineWidth");
		public static OUTLINELIGHTNESS = Laya.Shader3D.propertyNameToID("u_OutlineLightness");
		public static OUTLINECOLOR = Laya.Shader3D.propertyNameToID("u_OutlineColor");
		
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
    	 * 获取线条颜色
    	 * @return 线条颜色
    	 */
    	public get outlineColor() {
        	return _shaderValues.getVector(MultiplePassOutlineMaterial.OUTLINECOLOR);
    	}
    
    	public set outlineColor(value) {
        	this._shaderValues.setVector(MultiplePassOutlineMaterial.OUTLINECOLOR, value);
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
									   'a_Texcoord0': Laya.VertexMesh.MESH_TEXTURECOORDINATE0
									};
			var uniformMap:Object = {'u_MvpMatrix': Laya.Shader3D.PERIOD_SPRITE, 
									 'u_WorldMat': Laya.Shader3D.PERIOD_SPRITE,
									 'u_OutlineColor': Laya.Shader3D.PERIOD_MATERIAL,
									 'u_OutlineWidth': Laya.Shader3D.PERIOD_MATERIAL, 
									 'u_OutlineLightness': Laya.Shader3D.PERIOD_MATERIAL,
									 'u_AlbedoTexture': Laya.Shader3D.PERIOD_MATERIAL
									};
									
			var customShader:Laya.Shader3D = Laya.Shader3D.add("MultiplePassOutlineShader");
			var subShader:Laya.SubShader = new Laya.SubShader(attributeMap, uniformMap,MultiplePassOutlineMaterial.shaderDefines);
            customShader.addSubShader(subShader);
			let vs1:string = `
			attribute vec4 a_Position; 
            attribute vec3 a_Normal; 
            attribute vec2 a_Texcoord0; 
            
            uniform mat4 u_MvpMatrix; 
            uniform float u_OutlineWidth; 
            
            void main() 
            {  
               vec4 position = vec4(a_Position.xyz + a_Normal * u_OutlineWidth, 1.0); 
               gl_Position = u_MvpMatrix * position; 
            }` ;

			let ps1:string = `
			#ifdef FSHIGHPRECISION 
            precision highp float; 
            #else 
               precision mediump float; 
			#endif 
			uniform vec4 u_OutlineColor; 
            uniform float u_OutlineLightness; 
        
            void main() 
        	{ 
        	   vec3 finalColor = u_OutlineColor.rgb * u_OutlineLightness; 
        
        	   gl_FragColor = vec4(finalColor,0.0); 
        	}`;
        
			var pass1 = subShader.addShaderPass(vs1, ps1);
			pass1.renderState.cull = Laya.RenderState.CULL_FRONT;
			let vs2:string = `
			#include "Lighting.glsl"; 

            attribute vec4 a_Position; 
            attribute vec2 a_Texcoord0; 
            
            uniform mat4 u_MvpMatrix; 
            uniform mat4 u_WorldMat; 
            
            
            attribute vec3 a_Normal; 
            varying vec3 v_Normal; 
            varying vec2 v_Texcoord0; 
            
            void main() 
            { 
               gl_Position = u_MvpMatrix * a_Position; 
                  
               mat3 worldMat=mat3(u_WorldMat); 
               v_Normal=worldMat*a_Normal; 
               v_Texcoord0 = a_Texcoord0; 
               gl_Position=remapGLPositionZ(gl_Position); 
            }`;
			let ps2:string = `
			#ifdef FSHIGHPRECISION 
            precision highp float;
            #else
            precision mediump float;
            #endif
            varying vec2 v_Texcoord0;
            varying vec3 v_Normal;
            
            uniform sampler2D u_AlbedoTexture;
            
            
            void main()
            {
               vec4 albedoTextureColor = vec4(1.0);
               
               albedoTextureColor = texture2D(u_AlbedoTexture, v_Texcoord0);
               gl_FragColor=albedoTextureColor;
            }`;
            
			subShader.addShaderPass(vs2, ps2);
		}
		
	
		
		constructor() {
			super();
			this.setShaderName("MultiplePassOutlineShader");
			this._shaderValues.setNumber(MultiplePassOutlineMaterial.OUTLINEWIDTH, 0.01581197);
			this._shaderValues.setNumber(MultiplePassOutlineMaterial.OUTLINELIGHTNESS, 1);
			this._shaderValues.setVector(MultiplePassOutlineMaterial.OUTLINECOLOR, new Laya.Vector4(1.0,1.0,1.0,0.0));
		}
	}
