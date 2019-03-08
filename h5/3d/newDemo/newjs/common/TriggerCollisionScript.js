// var __extends = (this && this.__extends) || (function () {
//     var extendStatics = Object.setPrototypeOf ||
//         ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
//         function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
//     return function (d, b) {
//         extendStatics(d, b);
//         function __() { this.constructor = d; }
//         d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
//     };
// })();
// //不知道是否正确
// var TriggerCollisionScript = /** @class */ (function (_super) {
//     __extends(TriggerCollisionScript, _super);
//     function TriggerCollisionScript() {
//         //父类
//         return _super.call(this) || this;
//     }
//     TriggerCollisionScript.prototype.TriggerCollisionScript = function () {
//     };
//     TriggerCollisionScript.prototype.onTriggerEnter = function (other) {
//         // super.onTriggerEnter(other);
//         this.owner.meshRenderer.sharedMaterial.albedoColor = new Laya.Vector4(0.0, 1.0, 0.0, 1.0);
//     };
//     TriggerCollisionScript.prototype.onTriggerStay = function (other) {
//     };
//     TriggerCollisionScript.prototype.onTriggerExit = function (other) {
//         this.owner.meshRenderer.sharedMaterial.albedoColor = new Laya.Vector4(1.0, 1.0, 1.0, 1.0);
//     };
//     TriggerCollisionScript.prototype.onCollisionEnter = function (collision) {
//         if (collision.other.owner === this.kinematicSprite)
//             this.owner.meshRenderer.sharedMaterial.albedoColor = new Laya.Vector4(0.0, 0.0, 0.0, 1.0);
//     };
//     TriggerCollisionScript.prototype.onCollisionStay = function (collision) {
//     };
//     TriggerCollisionScript.prototype.onCollisionExit = function (collision) {
//     };
//     return TriggerCollisionScript;
// }(Laya.Script3D));

class TriggerCollisionScript extends Laya.Script3D{
	constructor(){
        super();
    }
    onTriggerEnter(other) {
        this.owner.meshRenderer.sharedMaterial.albedoColor = new Laya.Vector4(0.0, 1.0, 0.0, 1.0);
    }

    onTriggerStay(other) {
    }

    onTriggerExit(other) {
        this.owner.meshRenderer.sharedMaterial.albedoColor = new Laya.Vector4(1.0, 1.0, 1.0, 1.0);
    }
    onCollisionEnter(collision) {
        if (collision.other.owner === this.kinematicSprite)
            this.owner.meshRenderer.sharedMaterial.albedoColor = new Laya.Vector4(0.0, 0.0, 0.0, 1.0);
    }
    onCollisionStay(collision) {
    }
    onCollisionExit(collision) {
    }
	
}