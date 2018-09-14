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
var CustomMaterial = /** @class */ (function (_super) {
    __extends(CustomMaterial, _super);
    function CustomMaterial() {
        var _this = _super.call(this, 3) || this;
        _this.setShaderName("CustomShader");
        return _this;
    }
    Object.defineProperty(CustomMaterial.prototype, "diffuseTexture", {
        /**
         * 获取漫反射贴图。
         *  漫反射贴图。
         */
        get: function () {
            return this._shaderValues.getTexture(CustomMaterial.DIFFUSETEXTURE);
        },
        /**
         * 设置漫反射贴图。
         * 漫反射贴图。
         */
        set: function (value) {
            this._shaderValues.setTexture(CustomMaterial.DIFFUSETEXTURE, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CustomMaterial.prototype, "marginalColor", {
        /**
         * 设置边缘光照颜色。
         * 边缘光照颜色。
         */
        set: function (value) {
            this._shaderValues.setVector(CustomMaterial.MARGINALCOLOR, value);
        },
        enumerable: true,
        configurable: true
    });
    CustomMaterial.DIFFUSETEXTURE = 1;
    CustomMaterial.MARGINALCOLOR = 2;
    return CustomMaterial;
}(Laya.BaseMaterial));
