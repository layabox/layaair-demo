//不知道是否正确
class TriggerCollisionScript extends Laya.Script3D {
    public kinematicSprite:Laya.Sprite3D;
    constructor() 
    {
        //父类
        super();
    }
    public TriggerCollisionScript()
    {

    }
    public onTriggerEnter(other: Laya.PhysicsComponent): void 
    {
       // super.onTriggerEnter(other);
        (((this.owner as Laya.MeshSprite3D).meshRenderer as Laya.MeshRender).sharedMaterial as Laya.BlinnPhongMaterial).albedoColor = new Laya.Vector4(0.0,1.0,0.0,1.0);
    }
    public onTriggerStay(other : Laya.PhysicsComponent):void
    {

    }
     public onTriggerExit(other:Laya.PhysicsComponent):void {
        (((this.owner as Laya.MeshSprite3D).meshRenderer as Laya.MeshRenderer).sharedMaterial as Laya.BlinnPhongMaterial).albedoColor = new Laya.Vector4(1.0, 1.0, 1.0, 1.0);
    }
    
    public onCollisionEnter(collision:Laya.Collision):void {
        if (collision.other.owner ===this.kinematicSprite)
            (((this.owner as Laya.MeshSprite3D).meshRenderer as Laya.MeshRenderer).sharedMaterial as Laya.BlinnPhongMaterial).albedoColor = new Laya.Vector4(0.0, 0.0, 0.0, 1.0);
    }
    
    public onCollisionStay(collision:Laya.Collision):void {

    }

    
    public onCollisionExit(collision:Laya.Collision):void {
        
    }
}