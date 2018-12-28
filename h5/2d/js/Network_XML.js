class Network_XML {
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

		this.setup();
	}

	setup() {
		let xmlValueContainsError = "<root><item>item a</item><item>item b</item>somethis...</root1>";
		let xmlValue = "<root><item>item a</item><item>item b</item>somethings...</root>";

		this.proessXML(xmlValueContainsError);
		console.log("\n");
		this.proessXML(xmlValue);
	}

	// 使用xml
	proessXML(source) {
		const Utils = Laya.Utils;

		let xml;
		try {
			xml = Utils.parseXMLFromString(source);
		} catch (e) {
			console.log(e.massage);
			return;
		}
		
		this.printDirectChildren(xml);
	}
	// 打印直接子级
	printDirectChildren(xml)
	{
		let rootNode = xml.firstChild;
		
		let nodes = rootNode.childNodes;
		for (let i = 0; i < nodes.length; i++) {
			let node = nodes[i];
			
			// 本节点为元素节点
			if (node.nodeType == 1) {
				console.log("节点名称: " + node.nodeName);
				console.log("元素节点，第一个子节点值为：" + node.firstChild.nodeValue);
			}
			// 本节点是文本节点
			else if (node.nodeType == 3) {
				console.log("文本节点：" + node.nodeValue);
			}
			console.log("\n");
		}
	}
}

new Network_XML();