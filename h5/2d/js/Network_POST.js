let hr, logger;
class Network_POST {
	constructor() {
		const 
			Browser = Laya.Browser,
			WebGL = Laya.WebGL,
			Stage = Laya.Stage,
			Stat = Laya.Stat,
			Handler = Laya.Handler,
			Event = Laya.Event,
			Accelerator = Laya.Accelerator;

		// 不支持WebGL时自动切换至Canvas
		Laya.init(Browser.width, Browser.height, WebGL);

		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;

		Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
		Laya.stage.bgColor = "#232628";

		this.connect();
		this.showLogger();
	}

	connect() {
		const 
			HttpRequest = Laya.HttpRequest,
			Event = Laya.Event;
		
		hr = new HttpRequest();
		hr.once(Event.PROGRESS, this, this.onHttpRequestProgress);
		hr.once(Event.COMPLETE, this, this.onHttpRequestComplete);
		hr.once(Event.ERROR, this, this.onHttpRequestError);
		hr.send('http://xkxz.zhonghao.huo.inner.layabox.com/api/getData', 'name=myname&psword=xxx', 'post', 'text');
	}

	showLogger() {
		const Text = Laya.Text;
		
		logger = new Text();

		logger.fontSize = 30;
		logger.color = "#FFFFFF";
		logger.align = 'center';
		logger.valign = 'middle';

		logger.size(Laya.stage.width, Laya.stage.height);
		logger.text = "等待响应...\n";
		Laya.stage.addChild(logger);
	}

	onHttpRequestError(e) {
		console.log(e);
	}

	onHttpRequestProgress(e) {
		console.log(e);
	}

	onHttpRequestComplete(e) {
		logger.text += "收到数据：" + hr.data;
	}
}

new Network_POST();