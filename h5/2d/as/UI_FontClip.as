package
{
	import laya.display.Stage;
	import laya.ui.FontClip;
    import laya.webgl.WebGL;

	 public class Font_Clip
	 {
		private var TestClipNum:string="res/comp/fontClip_num.png";
		private var _ClipNum:string="res/comp/fontClip_num.png";
		private var _ClipNum1:string="res/comp/fontClip_num.png";
		private var TestFontClip:string="res/comp/fontClip.png";
		private var _FontClip:string="res/comp/fontClip.png";

	 	public function Font_Clip (){
			 // 不支持WebGL时自动切换至Canvas
			 Laya.init(800, 600, WebGL);

			 Laya.stage.alignV = Stage.ALIGN_MIDDLE;
			 Laya.stage.alignH = Stage.ALIGN_CENTER;
			 Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
			 Laya.stage.bgColor = "#232628";
			 Laya.loader.load([this.TestClipNum,this.TestFontClip,this._ClipNum,this._FontClip,this._ClipNum1],Laya.Handler.create(this,this.ShowContent));	 
			}
            
			private function ShowContent():void{

				 var clipnum:FontClip=new FontClip(this._ClipNum);
				 var fontClip:FontClip=new FontClip(this._FontClip);
				 var TestFontClip:FontClip=new FontClip(this.TestFontClip);
				 var TestClipNum:FontClip=new FontClip(this.TestClipNum);
                 var clipnum1:FontClip=new FontClip(this._ClipNum1);

				 clipnum.pos(240,500);
				 clipnum.size(250,50);
				 clipnum.sheet="0123456789";
				 clipnum.value="114499";
				 clipnum.spaceY=10;

				 TestClipNum.pos(200,400);
				 TestClipNum.sheet="0123456789";
				 TestClipNum.value="0123456789";

				 clipnum1.pos (150,200);
				 clipnum1.direction="vertical";
				 clipnum1.sheet="0123456789";
				 clipnum1.value="223388";

				 fontClip.pos(240,300);
				 fontClip.sheet="鼠牛虎兔龙蛇马羊 猴鸡狗猪年快乐";
				 fontClip.value="猪年快乐";				 
				 fontClip.spaceY=10;

				 TestFontClip.pos(200,200);
				 TestFontClip.sheet="鼠牛虎兔龙蛇马羊猴鸡狗猪年快乐";
				 TestFontClip.value="鼠牛虎兔龙蛇马羊猴鸡狗猪年快乐";
				 TestFontClip.spaceY=10;

				 Laya.stage.addChild(clipnum);
				 Laya.stage.addChild(fontClip);
				 Laya.stage.addChild(TestFontClip);
				 Laya.stage.addChild(TestClipNum);
				 Laya.stage.addChild(clipnum1);	 
			}
	}
}


