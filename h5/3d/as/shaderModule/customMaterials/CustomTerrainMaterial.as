package shaderModule.customMaterials {
	import laya.d3.core.material.BaseMaterial;
	import laya.d3.math.Vector2;
	import laya.d3.shader.Shader3D;
	import laya.d3.shader.ShaderDefines;
	import laya.webgl.resource.BaseTexture;
	
	/**
	 * ...
	 * @author
	 */
	public class CustomTerrainMaterial extends BaseMaterial {
		public static var SPLATALPHATEXTURE:int = Shader3D.propertyNameToID("u_SplatAlphaTexture");
		public static var DIFFUSETEXTURE1:int = Shader3D.propertyNameToID("u_DiffuseTexture1");
		public static var DIFFUSETEXTURE2:int = Shader3D.propertyNameToID("u_DiffuseTexture2");
		public static var DIFFUSETEXTURE3:int = Shader3D.propertyNameToID("u_DiffuseTexture3");
		public static var DIFFUSETEXTURE4:int = Shader3D.propertyNameToID("u_DiffuseTexture4");
		public static var DIFFUSETEXTURE5:int = Shader3D.propertyNameToID("u_DiffuseTexture5");
		public static var DIFFUSESCALE1:int = Shader3D.propertyNameToID("u_DiffuseScale1");
		public static var DIFFUSESCALE2:int = Shader3D.propertyNameToID("u_DiffuseScale2");
		public static var DIFFUSESCALE3:int = Shader3D.propertyNameToID("u_DiffuseScale3");
		public static var DIFFUSESCALE4:int = Shader3D.propertyNameToID("u_DiffuseScale4");
		public static var DIFFUSESCALE5:int = Shader3D.propertyNameToID("u_DiffuseScale5");
		
		/**自定义地形材质细节宏定义。*/
		public static var SHADERDEFINE_DETAIL_NUM1:int;
		public static var SHADERDEFINE_DETAIL_NUM2:int;
		public static var SHADERDEFINE_DETAIL_NUM3:int;
		public static var SHADERDEFINE_DETAIL_NUM4:int;
		public static var SHADERDEFINE_DETAIL_NUM5:int;
		
		/**@private */
		public static var shaderDefines:ShaderDefines = new ShaderDefines(BaseMaterial.shaderDefines);
		
		/**
		 * @private
		 */
		public static function __init__():void {
			
			SHADERDEFINE_DETAIL_NUM1 = shaderDefines.registerDefine("CUSTOM_DETAIL_NUM1");
			SHADERDEFINE_DETAIL_NUM2 = shaderDefines.registerDefine("CUSTOM_DETAIL_NUM2");
			SHADERDEFINE_DETAIL_NUM3 = shaderDefines.registerDefine("CUSTOM_DETAIL_NUM3");
			SHADERDEFINE_DETAIL_NUM4 = shaderDefines.registerDefine("CUSTOM_DETAIL_NUM4");
			SHADERDEFINE_DETAIL_NUM5 = shaderDefines.registerDefine("CUSTOM_DETAIL_NUM5");
		}
		
		/**
		 * 获取splatAlpha贴图。
		 * @return splatAlpha贴图。
		 */
		public function get splatAlphaTexture():BaseTexture {
			return _shaderValues.getTexture(SPLATALPHATEXTURE);
		}
		
		/**
		 * 设置splatAlpha贴图。
		 * @param value splatAlpha贴图。
		 */
		public function set splatAlphaTexture(value:BaseTexture):void {
			_shaderValues.setTexture(SPLATALPHATEXTURE, value);
		}
		
		/**
		 * 获取第一层贴图。
		 * @return 第一层贴图。
		 */
		public function get diffuseTexture1():BaseTexture {
			return _shaderValues.getTexture(DIFFUSETEXTURE1);
		}
		
		/**
		 * 设置第一层贴图。
		 * @param value 第一层贴图。
		 */
		public function set diffuseTexture1(value:BaseTexture):void {
			_shaderValues.setTexture(DIFFUSETEXTURE1, value);
			_setDetailNum(1);
		}
		
		/**
		 * 获取第二层贴图。
		 * @return 第二层贴图。
		 */
		public function get diffuseTexture2():BaseTexture {
			return _shaderValues.getTexture(DIFFUSETEXTURE2);
		}
		
		/**
		 * 设置第二层贴图。
		 * @param value 第二层贴图。
		 */
		public function set diffuseTexture2(value:BaseTexture):void {
			_shaderValues.setTexture(DIFFUSETEXTURE2, value);
			_setDetailNum(2);
		}
		
		/**
		 * 获取第三层贴图。
		 * @return 第三层贴图。
		 */
		public function get diffuseTexture3():BaseTexture {
			return _shaderValues.getTexture(DIFFUSETEXTURE3);
		}
		
		/**
		 * 设置第三层贴图。
		 * @param value 第三层贴图。
		 */
		public function set diffuseTexture3(value:BaseTexture):void {
			_shaderValues.setTexture(DIFFUSETEXTURE3, value);
			_setDetailNum(3);
		}
		
		/**
		 * 获取第四层贴图。
		 * @return 第四层贴图。
		 */
		public function get diffuseTexture4():BaseTexture {
			return _shaderValues.getTexture(DIFFUSETEXTURE4);
		}
		
		/**
		 * 设置第四层贴图。
		 * @param value 第四层贴图。
		 */
		public function set diffuseTexture4(value:BaseTexture):void {
			_shaderValues.setTexture(DIFFUSETEXTURE4, value);
			_setDetailNum(4);
		}
		
		/**
		 * 获取第五层贴图。
		 * @return 第五层贴图。
		 */
		public function get diffuseTexture5():BaseTexture {
			return _shaderValues.getTexture(DIFFUSETEXTURE5);
		}
		
		/**
		 * 设置第五层贴图。
		 * @param value 第五层贴图。
		 */
		public function set diffuseTexture5(value:BaseTexture):void {
			_shaderValues.setTexture(DIFFUSETEXTURE5, value);
			_setDetailNum(5);
		}
		
		public function setDiffuseScale1(scale1:Vector2):void {
			_shaderValues.setVector2(DIFFUSESCALE1, scale1);
		}
		
		public function setDiffuseScale2(scale2:Vector2):void {
			_shaderValues.setVector2(DIFFUSESCALE2, scale2);
		}
		
		public function setDiffuseScale3(scale3:Vector2):void {
			_shaderValues.setVector2(DIFFUSESCALE3, scale3);
		}
		
		public function setDiffuseScale4(scale4:Vector2):void {
			_shaderValues.setVector2(DIFFUSESCALE4, scale4);
		}
		
		public function setDiffuseScale5(scale5:Vector2):void {
			_shaderValues.setVector2(DIFFUSESCALE5, scale5);
		}
		
		private function _setDetailNum(value:int):void {
			switch (value) {
			case 1: 
				_defineDatas.add(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM1);
				_defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM2);
				_defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM3);
				_defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM4);
				_defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM5);
				break;
			case 2: 
				_defineDatas.add(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM2);
				_defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM1);
				_defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM3);
				_defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM4);
				_defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM5);
				break;
			case 3: 
				_defineDatas.add(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM3);
				_defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM1);
				_defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM2);
				_defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM4);
				_defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM5);
				break;
			case 4: 
				_defineDatas.add(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM4);
				_defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM1);
				_defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM2);
				_defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM3);
				_defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM5);
				break;
			case 5: 
				_defineDatas.add(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM5);
				_defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM1);
				_defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM2);
				_defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM3);
				_defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM4);
				break;
			}
		}
		
		public function CustomTerrainMaterial() {
			super();
			setShaderName("CustomTerrainShader");
		}
	
	}

}