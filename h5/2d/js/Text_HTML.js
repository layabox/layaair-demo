class Text_HTML {
	constructor() {
		const 
			Browser = Laya.Browser,
			WebGL = Laya.WebGL,
			Stage = Laya.Stage,
			Stat = Laya.Stat;

		// 不支持WebGL时自动切换至Canvas
		Laya.init(Browser.clientWidth, Browser.clientHeight, WebGL);

		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;

		Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
		Laya.stage.bgColor = "#232628";

		this.setup();
	}

	setup() {
		this.createParagraph();	// 代码创建
		this.showExternalHTML(); // 使用外部定义的html
	}

	createParagraph() {
		const HTMLDivElement = Laya.HTMLDivElement;

		let p = new HTMLDivElement();
		Laya.stage.addChild(p);

		p.style.font = "Impact";
		p.style.fontSize = 30;

		let html = "<span color='#e3d26a'>使用</span>";
		html += "<span style='color:#FFFFFF;font-weight:bold'>HTMLDivElement</span>";
		html += "<span color='#6ad2e3'>创建的</span><br/>";
		html += "<span color='#d26ae3'>HTML文本</span>";
		
		p.innerHTML = html;
	}

	showExternalHTML() {
		const HTMLIframeElement = Laya.HTMLIframeElement;

		let p = new HTMLIframeElement();
		Laya.stage.addChild(p);
		p.href = "res/html/test.html";
		p.y = 200;
	}
}

new Text_HTML();