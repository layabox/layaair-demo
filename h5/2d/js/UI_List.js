const 
	WID = 373,
	HEI = 85;
const Box = Laya.Box;

class Item extends Box {
	constructor(){
		super();
		const Image = Laya.Image;

		this.size(WID, HEI);
		this.img = new Image();
		this.addChild(this.img);
	}

	setImg(src) {
		this.img.skin = src;
	}
}

class UI_List {
	constructor() {
		const 
			Browser = Laya.Browser,
			WebGL = Laya.WebGL,
			Stage = Laya.Stage,
			Stat = Laya.Stat,
			Handler = Laya.Handler;

		// 不支持WebGL时自动切换至Canvas
		Laya.init(550, 400, WebGL);

		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;

		Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
		Laya.stage.bgColor = "#232628";

		Stat.show();
		this.setup();
	}

	setup() {
		const 
			List = Laya.List,
			Handler = Laya.Handler;
		
		let list = new List();
		Laya.stage.addChild(list);

		list.itemRender = Item;

		list.repeatX = 1;
		list.repeatY = 4;

		list.x = (Laya.stage.width - WID) / 2;
		list.y = (Laya.stage.height - HEI * list.repeatY) / 2;

		// 使用但隐藏滚动条
		list.vScrollBarSkin = "";

		list.selectEnable = true;
		list.selectHandler = new Handler(this, this.onSelect);

		list.renderHandler = new Handler(this, this.updateItem);

		// 设置数据项为对应图片的路径
		let data = [];
		for (let i = 0; i < 10; ++i) {
			data.push("res/ui/listskins/1.jpg");
			data.push("res/ui/listskins/2.jpg");
			data.push("res/ui/listskins/3.jpg");
			data.push("res/ui/listskins/4.jpg");
			data.push("res/ui/listskins/5.jpg");
		}
		list.array = data;
	}

	updateItem(cell, index) {
		cell.setImg(cell.dataSource);
	}

	onSelect(index) {
		console.log("当前选择的索引：" + index);
	}
}

new UI_List();