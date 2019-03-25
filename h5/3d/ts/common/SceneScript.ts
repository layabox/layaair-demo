class SceneScript extends Laya.Script3D{

    private originPosition:Vector3 = new Vector3(0, -1, 1);
	private phasorSpriter3D:PhasorSpriter3D;
	private _color:Vector4 = new Vector4(1, 0, 0, 1);
	private point:Vector2 = new Vector2();
	private camera:Camera;
	private ray:Ray = new Ray(new Vector3(0, 0, 0), new Vector3(0, 0, 0));
		
    constructor(){
        //父类
        super();
    }
    public _start(state:RenderState):void {
        super._start(state);	
		phasorSpriter3D = new PhasorSpriter3D();
        camera = _owner.getChildByName("camera");
        
    }
    public _postRenderUpdate(state:RenderState):void {
        super._update(state);
			
		point.x = Laya.stage.mouseX;
        point.y = Laya.stage.mouseY;
        camera.viewportPointToRay(point, ray);
			
		phasorSpriter3D.begin(WebGLContext.LINES, camera);
            
        //绘出射线
        phasorSpriter3D.line(ray.origin, _color, originPosition, _color);
			
		phasorSpriter3D.end();
    }

}