package {
	import laya.d3.core.Sprite3D;
	import laya.display.Stage;
	import laya.events.Event;
	import laya.ui.Button;
	import laya.utils.Browser;
	import laya.utils.Handler;
	import laya.utils.Stat;
	import laya.ui.Image;
	import laya.display.Sprite;
	
	/**
	 * ...
	 * @author
	 */
	public class Sprite_ScreenShot {
		
		private var sprite3D:Sprite3D;
		private var lineSprite3D:Sprite3D;

		private var btnArr:Array = ["res/threeDimen/ui/button.png", "res/threeDimen/ui/button.png", "res/threeDimen/ui/button.png"];
   		private var nameArr:Array = ["canvas截图","sprite截图","清理"];
        private var _canvas:HTMLCanvasElement;
        private var aimSp:Sprite;
        private var drawImage:Image;
        private var drawSp:Sprite;
	    private var monkeyTexture:Texture;
		
		public function CustomMesh() {
			Config.preserveDrawingBuffer =true;
        	Laya.init(Browser.clientWidth, Browser.clientHeight);
		
			Laya.stage.alignV = Stage.ALIGN_MIDDLE;
			Laya.stage.alignH = Stage.ALIGN_CENTER;
			Laya.stage.scaleMode = Stage.SCALE_FIXED_AUTO;
        	Laya.stage.bgColor = "#232628";
        
        	Laya.loader.load(btnArr.concat("res/apes/monkey3.png"),Handler.create(this,onLoaded));
		}

		private function createButton(skin: string,name:string,cb:Function,index:number): Button {
			var btn: Button = new Button(skin,name);
			Laya.stage.addChild(btn);
			btn.on(Event.CLICK,this,cb);
			btn.size(147,55);
			btn.name = name;
			btn.right = 10;
			btn.top = index * (btn.height + 10);
			return btn;
    	}

		private function onLoaded(){
			for (var index = 0; index < btnArr.length; index++) {
				createButton(btnArr[index],nameArr[index],_onclick,index);
			}
			_canvas = window.document.getElementById("layaCanvas") as HTMLCanvasElement;
			aimSp = new Sprite();
			aimSp.size(Browser.clientWidth/2,Browser.clientHeight/2);
		    Laya.stage.addChild(aimSp);
			aimSp.graphics.drawRect(0,0,aimSp.width,aimSp.height,"#333333");
			monkeyTexture = Laya.loader.getRes("res/apes/monkey3.png");
			aimSp.graphics.drawTexture(monkeyTexture,0,0,monkeyTexture.width,monkeyTexture.height);
			drawImage = new Image();
			drawImage.size(Browser.clientWidth/2,Browser.clientHeight/2);
			Laya.stage.addChild(drawImage);
			drawImage.bottom = drawImage.right = 0;

			drawSp = new Sprite();
			Laya.stage.addChild(drawSp);
			drawSp.size(Browser.clientWidth/2,Browser.clientHeight/2);
			drawSp.y = Browser.clientHeight/2;
			drawSp.graphics.drawRect(0,0,drawSp.width,drawSp.height,"#ff0000");
    	}

		private function _onclick(e:Event){
			switch (e.target.name) {
				case nameArr[0]:
					var base64Url:string = _canvas.toDataURL("image/png",1);
					drawImage.skin = base64Url;
					break;
				case nameArr[1]:
					var text:Texture = Laya.stage.drawToTexture(Browser.clientWidth,Browser.clientHeight,0,0) as Texture;
					drawSp.graphics.drawTexture(text,0,0,drawSp.width,drawSp.height);
					break;
				case nameArr[2]:
					drawImage.skin = null;
					drawSp.graphics.clear();
					drawSp.graphics.drawRect(0,0,drawSp.width,drawSp.height,"#ff0000");
					break;
				default:
					break;
			}
    	}
		
	}
}