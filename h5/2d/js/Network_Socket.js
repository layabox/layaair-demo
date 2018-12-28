let socket, output;

class Network_Socket {
	constructor() {
		const 
			Browser = Laya.Browser,
			WebGL = Laya.WebGL,
			Stage = Laya.Stage,
			Stat = Laya.Stat,
			Handler = Laya.Handler;

		// 不支持WebGL时自动切换至Canvas
		Laya.init(Browser.width, Browser.height, WebGL);

		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;

		Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
		Laya.stage.bgColor = "#232628";

		this.connect();
	}

	connect() {
		const 
			Socket = Laya.Socket,
			Event = Laya.Event;

		socket = new Socket();
		//socket.connect("echo.websocket.org", 80);
		socket.connectByUrl("ws://echo.websocket.org:80");

		output = socket.output;

		socket.on(Event.OPEN, this, this.onSocketOpen);
		socket.on(Event.CLOSE, this, this.onSocketClose);
		socket.on(Event.MESSAGE, this, this.onMessageReveived);
		socket.on(Event.ERROR, this, this.onConnectError);
	}

	onSocketOpen() {
		console.log("Connected");

		// 发送字符串
		socket.send("demonstrate <sendString>");

		// 使用output.writeByte发送
		let message = "demonstrate <output.writeByte>";
		for (let i = 0; i < message.length; ++i) {
			output.writeByte(message.charCodeAt(i));
		}
		socket.flush();
	}

	onSocketClose() {
		console.log("Socket closed");
	}

	onMessageReveived(message) {
		const Byte = Laya.Byte;

		console.log("Message from server:");
		if (typeof message == "string") {
			console.log(message);
		} else if (message instanceof ArrayBuffer) {
			console.log(new Byte(message).readUTFBytes());
		}
		socket.input.clear();
	}

	onConnectError(e) {
		console.log("error");
	}
}

new Network_Socket();