class Sprite_ScreenShot {
	constructor() {
		const 
			Browser = Laya.Browser,
			WebGL = Laya.WebGL,
			Stage = Laya.Stage;


		this.btnArr = ["res/threeDimen/ui/button.png", "res/threeDimen/ui/button.png", "res/threeDimen/ui/button.png"];
    	this.nameArr = ["canvas截图","sprite截图","清理"];
        this._canvas = null;
    	this.aimSp = null;
   		this.drawImage = null;
        this.drawSp = null;
	    this.monkeyTexture = null;
		// 不支持WebGL时自动切换至Canvas
		Config.preserveDrawingBuffer =true;
        Laya.init(Browser.clientWidth, Browser.clientHeight);
		
		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;
		Laya.stage.scaleMode = Stage.SCALE_FIXED_AUTO;
        Laya.stage.bgColor = "#232628";
        
        Laya.loader.load(this.btnArr.concat("res/apes/monkey3.png"),Laya.Handler.create(this,this.onLoaded));
	}

	createButton(skin, name, cb, index) {
        var btn = new Laya.Button(skin,name);
        Laya.stage.addChild(btn);
        btn.on(Laya.Event.CLICK,this,cb);
        btn.size(147,55);
        btn.name = name;
        btn.right = 10;
        btn.top = index * (btn.height + 10);
		return btn;
    }
    
    onLoaded(){
        for (let index = 0; index < this.btnArr.length; index++) {
            this.createButton(this.btnArr[index],this.nameArr[index],this._onclick,index);
        }
        this._canvas = window.document.getElementById("layaCanvas");
        this.aimSp = new Laya.Sprite();
        this.aimSp.size(Laya.Browser.clientWidth/2,Laya.Browser.clientHeight/2);
        Laya.stage.addChild(this.aimSp);
        this.aimSp.graphics.drawRect(0,0,this.aimSp.width,this.aimSp.height,"#333333");
        this.monkeyTexture = Laya.loader.getRes("res/apes/monkey3.png");
        this.aimSp.graphics.drawTexture(this.monkeyTexture,0,0,this.monkeyTexture.width,this.monkeyTexture.height);
        this.drawImage = new Laya.Image();
        this.drawImage.size(Laya.Browser.clientWidth/2,Laya.Browser.clientHeight/2);
        Laya.stage.addChild(this.drawImage);
        this.drawImage.bottom = this.drawImage.right = 0;

        this.drawSp = new Laya.Sprite();
        Laya.stage.addChild(this.drawSp);
        this.drawSp.size(Laya.Browser.clientWidth/2,Laya.Browser.clientHeight/2);
        this.drawSp.y = Laya.Browser.clientHeight/2;
        this.drawSp.graphics.drawRect(0,0,this.drawSp.width,this.drawSp.height,"#ff0000");
    }

    _onclick(e){
		debugger;
        switch (e.target.name) {
            case this.nameArr[0]:
                var base64Url = this._canvas.toDataURL("image/png",1);
                this.drawImage.skin = base64Url;
                break;
            case this.nameArr[1]:
                var text = Laya.stage.drawToTexture(Laya.Browser.clientWidth,Laya.Browser.clientHeight,0,0);
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

new Sprite_ScreenShot();