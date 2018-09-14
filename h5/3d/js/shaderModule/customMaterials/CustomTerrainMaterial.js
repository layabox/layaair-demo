var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var CustomTerrainMaterial = /** @class */ (function (_super) {
    __extends(CustomTerrainMaterial, _super);
    function CustomTerrainMaterial() {
        var _this = _super.call(this, 11) || this;
        _this.setShaderName("CustomTerrainShader");
        return _this;
    }
    CustomTerrainMaterial.__init__ = function () {
        CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM1 = CustomTerrainMaterial.shaderDefines.registerDefine("CUSTOM_DETAIL_NUM1");
        CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM2 = CustomTerrainMaterial.shaderDefines.registerDefine("CUSTOM_DETAIL_NUM2");
        CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM3 = CustomTerrainMaterial.shaderDefines.registerDefine("CUSTOM_DETAIL_NUM3");
        CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM4 = CustomTerrainMaterial.shaderDefines.registerDefine("CUSTOM_DETAIL_NUM4");
        CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM5 = CustomTerrainMaterial.shaderDefines.registerDefine("CUSTOM_DETAIL_NUM5");
    };
    Object.defineProperty(CustomTerrainMaterial.prototype, "splatAlphaTexture", {
        /**
         * 获取splatAlpha贴图。
         * @return splatAlpha贴图。
         */
        get: function () {
            return this._shaderValues.getTexture(CustomTerrainMaterial.SPLATALPHATEXTURE);
        },
        //____________________________________________
        /**
         * 设置splatAlpha贴图。
         * @param value splatAlpha贴图。
         */
        set: function (value) {
            this._shaderValues.setTexture(CustomTerrainMaterial.SPLATALPHATEXTURE, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CustomTerrainMaterial.prototype, "diffuseTexture1", {
        /**
         * 获取第一层贴图。
         * @return 第一层贴图。
         */
        get: function () {
            return this._shaderValues.getTexture(CustomTerrainMaterial.DIFFUSETEXTURE1);
        },
        /**
         * 设置第一层贴图。
         * @param value 第一层贴图。
         */
        set: function (value) {
            this._shaderValues.setTexture(CustomTerrainMaterial.DIFFUSETEXTURE1, value);
            this._setDetailNum(1);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CustomTerrainMaterial.prototype, "diffuseTexture2", {
        /**
         * 获取第二层贴图。
         * @return 第二层贴图。
         */
        get: function () {
            return this._shaderValues.getTexture(CustomTerrainMaterial.DIFFUSETEXTURE2);
        },
        /**
         * 设置第二层贴图。
         * @param value 第二层贴图。
         */
        set: function (value) {
            this._shaderValues.setTexture(CustomTerrainMaterial.DIFFUSETEXTURE2, value);
            this._setDetailNum(2);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CustomTerrainMaterial.prototype, "diffuseTexture3", {
        /**
         * 获取第三层贴图。
         * @return 第三层贴图。
         */
        get: function () {
            return this._shaderValues.getTexture(CustomTerrainMaterial.DIFFUSETEXTURE3);
        },
        /**
         * 设置第三层贴图。
         * @param value 第三层贴图。
         */
        set: function (value) {
            this._shaderValues.setTexture(CustomTerrainMaterial.DIFFUSETEXTURE3, value);
            this._setDetailNum(3);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CustomTerrainMaterial.prototype, "diffuseTexture4", {
        /**
         * 获取第四层贴图。
         * @return 第四层贴图。
         */
        get: function () {
            return this._shaderValues.getTexture(CustomTerrainMaterial.DIFFUSETEXTURE4);
        },
        /**
         * 设置第四层贴图。
         * @param value 第四层贴图。
         */
        set: function (value) {
            this._shaderValues.setTexture(CustomTerrainMaterial.DIFFUSETEXTURE4, value);
            this._setDetailNum(4);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CustomTerrainMaterial.prototype, "diffuseTexture5", {
        /**
         * 获取第五层贴图。
         * @return 第五层贴图。
         */
        get: function () {
            return this._shaderValues.getTexture(CustomTerrainMaterial.DIFFUSETEXTURE5);
        },
        /**
         * 设置第五层贴图。
         * @param value 第五层贴图。
         */
        set: function (value) {
            this._shaderValues.setTexture(CustomTerrainMaterial.DIFFUSETEXTURE5, value);
            this._setDetailNum(5);
        },
        enumerable: true,
        configurable: true
    });
    CustomTerrainMaterial.prototype.setDiffuseScale1 = function (scale1) {
        this._shaderValues.setVector(CustomTerrainMaterial.DIFFUSESCALE1, scale1);
    };
    CustomTerrainMaterial.prototype.setDiffuseScale2 = function (scale2) {
        this._shaderValues.setVector(CustomTerrainMaterial.DIFFUSESCALE2, scale2);
    };
    CustomTerrainMaterial.prototype.setDiffuseScale3 = function (scale3) {
        this._shaderValues.setVector(CustomTerrainMaterial.DIFFUSESCALE3, scale3);
    };
    CustomTerrainMaterial.prototype.setDiffuseScale4 = function (scale4) {
        this._shaderValues.setVector(CustomTerrainMaterial.DIFFUSESCALE4, scale4);
    };
    CustomTerrainMaterial.prototype.setDiffuseScale5 = function (scale5) {
        this._shaderValues.setVector(CustomTerrainMaterial.DIFFUSESCALE5, scale5);
    };
    CustomTerrainMaterial.prototype._setDetailNum = function (value) {
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
    };
    CustomTerrainMaterial.SPLATALPHATEXTURE = 0;
    CustomTerrainMaterial.DIFFUSETEXTURE1 = 1;
    CustomTerrainMaterial.DIFFUSETEXTURE2 = 2;
    CustomTerrainMaterial.DIFFUSETEXTURE3 = 3;
    CustomTerrainMaterial.DIFFUSETEXTURE4 = 4;
    CustomTerrainMaterial.DIFFUSETEXTURE5 = 5;
    CustomTerrainMaterial.DIFFUSESCALE1 = 6;
    CustomTerrainMaterial.DIFFUSESCALE2 = 7;
    CustomTerrainMaterial.DIFFUSESCALE3 = 8;
    CustomTerrainMaterial.DIFFUSESCALE4 = 9;
    CustomTerrainMaterial.DIFFUSESCALE5 = 10;
    CustomTerrainMaterial.shaderDefines = new Laya.ShaderDefines(Laya.BaseMaterial.shaderDefines);
    return CustomTerrainMaterial;
}(Laya.BaseMaterial));
