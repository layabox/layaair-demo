import GameConfig from "./GameConfig";
import Browser =  Laya.Browser;
import Stage = Laya.Stage;
import Sprite = Laya.Sprite;
import Image = Laya.Image;
import Texture = Laya.Texture;
import Handler = Laya.Handler;
import Button = Laya.Button;
import Event = Laya.Event;


class Sprite_ScreenShot {

    private btnArr:Array<string> = ["res/button.png", "res/button.png", "res/button.png"];
    private nameArr:Array<string> = ["canvas截图","sprite截图","清理"];
    private _canvas:HTMLCanvasElement;
    private aimSp:Sprite;
    private drawImage:Image;
    private drawSp:Sprite;
	private monkeyTexture:Texture;
	
	constructor() {
		Config.preserveDrawingBuffer =true;
        Laya.init(Browser.clientWidth, Browser.clientHeight);
		
		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;
		Laya.stage.scaleMode = Stage.SCALE_FIXED_AUTO;
        Laya.stage.bgColor = "#232628";
        
        Laya.loader.load(this.btnArr.concat("res/apes/monkey3.png"),Handler.create(this,this.onLoaded));
	  }
	  
	  private createButton(skin: string,name:string,cb:Function,index:number): Button {
        var btn: Button = new Button(skin,name);
       Laya.stage.addChild(btn);
        btn.on(Event.CLICK,this,cb);
        btn.size(147,55);
        btn.name = name;
        btn.right = 10;
        btn.top = index * (btn.height + 10);
		return btn;
    }
    
    private onLoaded(){
        for (let index = 0; index < this.btnArr.length; index++) {
            this.createButton(this.btnArr[index],this.nameArr[index],this._onclick,index);
        }
        this._canvas = window.document.getElementById("layaCanvas") as HTMLCanvasElement;
        this.aimSp = new Sprite();
        this.aimSp.size(Browser.clientWidth/2,Browser.clientHeight/2);
       Laya.stage.addChild(this.aimSp);
        this.aimSp.graphics.drawRect(0,0,this.aimSp.width,this.aimSp.height,"#333333");
        this.monkeyTexture = Laya.loader.getRes("res/apes/monkey3.png");
        this.aimSp.graphics.drawTexture(this.monkeyTexture,0,0,this.monkeyTexture.width,this.monkeyTexture.height);
        this.drawImage = new Image();
        this.drawImage.size(Browser.clientWidth/2,Browser.clientHeight/2);
       Laya.stage.addChild(this.drawImage);
        this.drawImage.bottom = this.drawImage.right = 0;

        this.drawSp = new Sprite();
       Laya.stage.addChild(this.drawSp);
        this.drawSp.size(Browser.clientWidth/2,Browser.clientHeight/2);
        this.drawSp.y = Browser.clientHeight/2;
        this.drawSp.graphics.drawRect(0,0,this.drawSp.width,this.drawSp.height,"#ff0000");
    }

    private _onclick(e:Event){
        switch (e.target.name) {
            case this.nameArr[0]:
                var base64Url:string = this._canvas.toDataURL("image/png",1);
                this.drawImage.skin = base64Url;
                break;
            case this.nameArr[1]:
                var text:Texture = Laya.stage.drawToTexture(Browser.clientWidth,Browser.clientHeight,0,0) as Texture;
                this.drawSp.graphics.drawTexture(text,0,0,this.drawSp.width,this.drawSp.height);
                break;
            case this.nameArr[2]:
                this.drawImage.skin = null;
                this.drawSp.graphics.clear();
                this.drawSp.graphics.drawRect(0,0,this.drawSp.width,this.drawSp.height,"#ff0000");
                break;
        }
    }

}
//激活启动类
new Sprite_ScreenShot();
