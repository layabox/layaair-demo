package LayaAir3D_Shader.customMaterials {
	import laya.d3.core.material.BaseMaterial;
	import laya.d3.math.Vector3;
	import laya.d3.shader.Shader3D;
	import laya.resource.BaseTexture;
	
	/**
	 * ...
	 * @author ...
	 */
	public class CustomMaterial extends Material {
		public static var DIFFUSETEXTURE:int = Shader3D.propertyNameToID("u_texture");
		public static var MARGINALCOLOR:int = Shader3D.propertyNameToID("u_marginalColor");
		
		/**
		 * 获取漫反射贴图。
		 * @return 漫反射贴图。
		 */
		public function get diffuseTexture():BaseTexture {
			return _shaderValues.getTexture(DIFFUSETEXTURE);
		}
		
		/**
		 * 设置漫反射贴图。
		 * @param value 漫反射贴图。
		 */
		public function set diffuseTexture(value:BaseTexture):void {
			_shaderValues.setTexture(DIFFUSETEXTURE, value);
		}
		
		/**
		 * 设置边缘光照颜色。
		 * @param value 边缘光照颜色。
		 */
		public function set marginalColor(value:Vector3):void {
			_shaderValues.setVector3(MARGINALCOLOR, value);
		}
		
		
	
		
		public function CustomMaterial() {
			super();
			setShaderName("CustomShader");
		}
	}

}