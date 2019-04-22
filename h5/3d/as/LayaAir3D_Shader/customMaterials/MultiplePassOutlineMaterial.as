package LayaAir3D_Shader.customMaterials {
	import LayaAir3D_Shader.customMaterials.MultiplePassOutlineMaterial;
	import laya.d3.core.material.BaseMaterial;
	import laya.d3.core.material.RenderState;
	import laya.d3.graphics.Vertex.VertexMesh;
	import laya.d3.math.Vector3;
	import laya.d3.shader.Shader3D;
	import laya.d3.shader.ShaderDefines;
	import laya.d3.shader.ShaderPass;
	import laya.d3.shader.SubShader;
	import laya.debug.tools.StringTool;
	
	/**
	 * ...
	 * @author ...
	 */
	public class MultiplePassOutlineMaterial extends BaseMaterial {
		public static const ALBEDOTEXTURE:int = Shader3D.propertyNameToID("u_AlbedoTexture");
		public static const OUTLINEWIDTH:int = Shader3D.propertyNameToID("u_OutlineWidth");
		public static const OUTLINELIGHTNESS:int = Shader3D.propertyNameToID("u_OutlineLightness");
		
		public static var SHADERDEFINE_ALBEDOTEXTURE:int;
		/**@private */
		public static var shaderDefines:ShaderDefines = new ShaderDefines(BaseMaterial.shaderDefines);
		
		/**
		 * @private
		 */
		public static function __init__():void {
			SHADERDEFINE_ALBEDOTEXTURE = shaderDefines.registerDefine("ALBEDOTEXTURE");
		}
		/**
		 * 获取漫反射贴图。
		 * @return 漫反射贴图。
		 */
		public function get albedoTexture():BaseTexture {
			return _shaderValues.getTexture(ALBEDOTEXTURE);
		}
		
		/**
		 * 设置漫反射贴图。
		 * @param value 漫反射贴图。
		 */
		public function set albedoTexture(value:BaseTexture):void {
			if (value)
				_defineDatas.add(MultiplePassOutlineMaterial.SHADERDEFINE_ALBEDOTEXTURE);
			else
				_defineDatas.remove(MultiplePassOutlineMaterial.SHADERDEFINE_ALBEDOTEXTURE);
			_shaderValues.setTexture(ALBEDOTEXTURE, value);
		}
		/**
		 * 获取轮廓宽度。
		 * @return 轮廓宽度,范围为0到0.05。
		 */
		public function get outlineWidth():Number {
			return _shaderValues.getNumber(OUTLINEWIDTH);
		}
		
		/**
		 * 设置轮廓宽度。
		 * @param value 轮廓宽度,范围为0到0.05。
		 */
		public function set outlineWidth(value:Number):void {
			value = Math.max(0.0, Math.min(0.05, value));
			_shaderValues.setNumber(OUTLINEWIDTH, value);
		}
		
		/**
		 * 获取轮廓亮度。
		 * @return 轮廓亮度,范围为0到1。
		 */
		public function get outlineLightness():Number {
			return _shaderValues.getNumber(OUTLINELIGHTNESS);
		}
		
		/**
		 * 设置轮廓亮度。
		 * @param value 轮廓亮度,范围为0到1。
		 */
		public function set outlineLightness(value:Number):void {
			value = Math.max(0.0, Math.min(1.0, value));
			_shaderValues.setNumber(OUTLINELIGHTNESS, value);
		}
		
		
		public static function initShader():void {
			__init__();
			var attributeMap:Object = {'a_Position': VertexMesh.MESH_POSITION0, 
									   'a_Normal': VertexMesh.MESH_NORMAL0, 
									   'a_Texcoord0': VertexMesh.MESH_TEXTURECOORDINATE0
									};
			var uniformMap:Object = {'u_MvpMatrix': Shader3D.PERIOD_SPRITE, 
									 'u_WorldMat': Shader3D.PERIOD_SPRITE,
									 'u_OutlineWidth': Shader3D.PERIOD_MATERIAL, 
									 'u_OutlineLightness': Shader3D.PERIOD_MATERIAL,
									 'u_AlbedoTexture': Shader3D.PERIOD_MATERIAL
									};
									
			var customShader:Shader3D = Shader3D.add("MultiplePassOutlineShader");
			var subShader:SubShader = new SubShader(attributeMap, uniformMap,shaderDefines);
			customShader.addSubShader(subShader);
			var vs1:String = __INCLUDESTR__("../customShader/outline.vs");
			var ps1:String = __INCLUDESTR__("../customShader/outline.ps");
			var pass1:ShaderPass = subShader.addShaderPass(vs1, ps1);
			pass1.renderState.cull = RenderState.CULL_FRONT;
			
			var vs2:String = __INCLUDESTR__("../customShader/outline02.vs");
			var ps2:String = __INCLUDESTR__("../customShader/outline02.ps");
			subShader.addShaderPass(vs2, ps2);
		}
		
	
		
		public function MultiplePassOutlineMaterial() {
			super();
			setShaderName("MultiplePassOutlineShader");
			_shaderValues.setNumber(OUTLINEWIDTH, 0.01581197);
			_shaderValues.setNumber(OUTLINELIGHTNESS, 1);
		}
	}

}