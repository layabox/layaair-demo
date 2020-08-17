package LayaAir3D_Animation3D {

import laya.d3.core.Camera;
import laya.d3.core.scene.Scene3D;
import laya.d3.core.Sprite3D;
import laya.d3.math.Vector3;
import laya.display.Stage;
import laya.utils.Handler;
import laya.utils.Stat;
import laya.d3.component.Animator;
import laya.d3.shader.Shader3D;

public class SimpleSkinAnimationInstance {
	private var animatorName:Array = ["run","chongci","dead","xuli","stand"];
	private var oriSprite3D:Sprite3D;
	private var scene:Scene3D;
	private var widthNums:Number = 30;
	private var step:Number = 10;
	public function SimpleSkinAnimationInstance() {
		Laya3D.init(0, 0);
		Laya.stage.scaleMode = Stage.SCALE_FULL;
		Laya.stage.screenMode = Stage.SCREEN_NONE;
		Stat.show();
		Shader3D.debugMode = true;
		this.scene = Laya.stage.addChild(new Scene3D()) as Scene3D;
		this.scene.ambientColor = new Vector3(0.5, 0.5, 0.5);

		Sprite3D.load("res/threeDimen/texAnimation/Conventional/LayaMonkey.lh", Handler.create(this, function (sprite: Sprite3D): void {
			this.scene.addChild(sprite);
			this.oriSprite3D = this.scene.getChildAt(0).getChildAt(2) as Sprite3D;
			this.sceneBuild();
			var animate:Animator = this.oriSprite3D.getComponent(Animator);
			animate.play("chongci");
		}));
	}
	function cloneSprite(pos:Vector3,quaterial:Vector3){
		var clonesprite:Sprite3D = this.oriSprite3D.clone() as Sprite3D;
		this.scene.addChild(clonesprite);
		var animate:Animator = clonesprite.getComponent(Animator);
		var nums:Number = Math.round( Math.random()*4);
		animate.play(this.animatorName[nums],0,Math.random());
        clonesprite.transform.position = pos;
        clonesprite.transform.rotationEuler = quaterial;
	}

	function sceneBuild(){
		var left:Number = -0.5*this.step*(this.widthNums);
		var right:Number = -1*left;
		for(var i:Number = left;i<right;i+=this.step)
			for(var j:Number = left;j<right;j+=this.step){
                var xchange:Number = (Math.random()-0.5)*10;
                var zchange:Number = (Math.random()-0.5)*10;
                var quaterial:Vector3 = new Vector3(0,Math.random()*180,0);
				this.cloneSprite(new Vector3(i+xchange,0,j+zchange),quaterial);
			}
	}
}

}
