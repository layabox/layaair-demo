class CustomTerrainMaterial extends Laya.BaseMaterial {
    public static SPLATALPHATEXTURE:number = 0;
    public static DIFFUSETEXTURE1:number = 1;
    public static DIFFUSETEXTURE2:number = 2;
    public static DIFFUSETEXTURE3:number = 3;
    public static DIFFUSETEXTURE4:number = 4;
    public static DIFFUSETEXTURE5:number = 5;
    public static DIFFUSESCALE1:number = 6;
    public static DIFFUSESCALE2:number = 7;
    public static DIFFUSESCALE3:number = 8;
    public static DIFFUSESCALE4:number = 9;
    public static DIFFUSESCALE5:number = 10;
    
    /**自定义地形材质细节宏定义。*/
    public static SHADERDEFINE_DETAIL_NUM1:number;
    public static SHADERDEFINE_DETAIL_NUM2:number;
    public static SHADERDEFINE_DETAIL_NUM3:number;
    public static SHADERDEFINE_DETAIL_NUM4:number;
    public static SHADERDEFINE_DETAIL_NUM5:number;
    constructor() {
        super();
        this.setShaderName("CustomTerrainShader");
    }
    public static shaderDefines:Laya.ShaderDefines = new Laya.ShaderDefines(Laya.BaseMaterial.shaderDefines);
    public static __init__():void {
			
        CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM1 = CustomTerrainMaterial.shaderDefines.registerDefine("CUSTOM_DETAIL_NUM1");
        CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM2 = CustomTerrainMaterial.shaderDefines.registerDefine("CUSTOM_DETAIL_NUM2");
        CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM3 = CustomTerrainMaterial.shaderDefines.registerDefine("CUSTOM_DETAIL_NUM3");
        CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM4 = CustomTerrainMaterial.shaderDefines.registerDefine("CUSTOM_DETAIL_NUM4");
        CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM5 = CustomTerrainMaterial.shaderDefines.registerDefine("CUSTOM_DETAIL_NUM5");
    }
    /**
     * 获取splatAlpha贴图。
     * @return splatAlpha贴图。
     */
    public get splatAlphaTexture():Laya.BaseTexture {
        return this._shaderValues.getTexture(CustomTerrainMaterial.SPLATALPHATEXTURE);
    }


  //____________________________________________
    	/**
		 * 设置splatAlpha贴图。
		 * @param value splatAlpha贴图。
		 */
		public set splatAlphaTexture(value:Laya.BaseTexture):void {
			this._shaderValues.setTexture(CustomTerrainMaterial.SPLATALPHATEXTURE, value);
		}
		
		/**
		 * 获取第一层贴图。
		 * @return 第一层贴图。
		 */
		public get diffuseTexture1():Laya.BaseTexture {
			return this._shaderValues.getTexture(CustomTerrainMaterial.DIFFUSETEXTURE1);
		}
		
		/**
		 * 设置第一层贴图。
		 * @param value 第一层贴图。
		 */
		public set diffuseTexture1(value:Laya.BaseTexture):void {
			this._shaderValues.setTexture(CustomTerrainMaterial.DIFFUSETEXTURE1, value);
			this._setDetailNum(1);
		}
		
		/**
		 * 获取第二层贴图。
		 * @return 第二层贴图。
		 */
		public get diffuseTexture2():Laya.BaseTexture {
			return this._shaderValues.getTexture(CustomTerrainMaterial.DIFFUSETEXTURE2);
		}
		
		/**
		 * 设置第二层贴图。
		 * @param value 第二层贴图。
		 */
		public set diffuseTexture2(value:Laya.BaseTexture):void {
			this._shaderValues.setTexture(CustomTerrainMaterial.DIFFUSETEXTURE2, value);
			this._setDetailNum(2);
		}
		
		/**
		 * 获取第三层贴图。
		 * @return 第三层贴图。
		 */
		public get diffuseTexture3():Laya.BaseTexture {
			return this._shaderValues.getTexture(CustomTerrainMaterial.DIFFUSETEXTURE3);
		}
		
		/**
		 * 设置第三层贴图。
		 * @param value 第三层贴图。
		 */
		public set diffuseTexture3(value:Laya.BaseTexture):void {
			this._shaderValues.setTexture(CustomTerrainMaterial.DIFFUSETEXTURE3, value);
			this._setDetailNum(3);
		}
		
		/**
		 * 获取第四层贴图。
		 * @return 第四层贴图。
		 */
		public get diffuseTexture4():Laya.BaseTexture {
			return this._shaderValues.getTexture(CustomTerrainMaterial.DIFFUSETEXTURE4);
		}
		
		/**
		 * 设置第四层贴图。
		 * @param value 第四层贴图。
		 */
		public set diffuseTexture4(value:Laya.BaseTexture):void {
			this._shaderValues.setTexture(CustomTerrainMaterial.DIFFUSETEXTURE4, value);
			this._setDetailNum(4);
		}
		
		/**
		 * 获取第五层贴图。
		 * @return 第五层贴图。
		 */
		public get diffuseTexture5():Laya.BaseTexture {
			return this._shaderValues.getTexture(CustomTerrainMaterial.DIFFUSETEXTURE5);
		}
		
		/**
		 * 设置第五层贴图。
		 * @param value 第五层贴图。
		 */
		public set diffuseTexture5(value:Laya.BaseTexture):void {
			this._shaderValues.setTexture(CustomTerrainMaterial.DIFFUSETEXTURE5, value);
			this._setDetailNum(5);
		}
		
		public setDiffuseScale1(scale1:Laya.Vector2):void {
			this._shaderValues.setVector(CustomTerrainMaterial.DIFFUSESCALE1, scale1);
		}
		
		public setDiffuseScale2(scale2:Laya.Vector2):void {
			this._shaderValues.setVector(CustomTerrainMaterial.DIFFUSESCALE2, scale2);
		}
		
		public setDiffuseScale3(scale3:Laya.Vector2):void {
			this._shaderValues.setVector(CustomTerrainMaterial.DIFFUSESCALE3, scale3);
		}
		
		public setDiffuseScale4(scale4:Laya.Vector2):void {
			this._shaderValues.setVector(CustomTerrainMaterial.DIFFUSESCALE4, scale4);
		}
		
		public setDiffuseScale5(scale5:Laya.Vector2):void {
			this._shaderValues.setVector(CustomTerrainMaterial.DIFFUSESCALE5, scale5);
		}
		
		private _setDetailNum(value:number):void {
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