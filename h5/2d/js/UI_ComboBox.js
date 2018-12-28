let skin = "res/ui/combobox.png";

class UI_ComboBox {
	constructor() {
		const 
			Browser = Laya.Browser,
			WebGL = Laya.WebGL,
			Stage = Laya.Stage,
			Stat = Laya.Stat,
			Handler = Laya.Handler;

		// 不支持WebGL时自动切换至Canvas
		Laya.init(800, 600, WebGL);

		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;

		Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
		Laya.stage.bgColor = "#232628";

		Laya.loader.load(skin, Handler.create(this, this.onLoadComplete));
	}

	onLoadComplete() {
		let cb = this.createComboBox(skin);
		cb.autoSize = true;
		cb.pos((Laya.stage.width - cb.width) / 2, 100);
		cb.autoSize = false;
	}

	createComboBox(skin) {
		const 
			ComboBox = Laya.ComboBox,
			Handler = Laya.Handler;

		let comboBox = new ComboBox(skin, "item0,item1,item2,item3,item4,item5");
		Laya.stage.addChild(comboBox);

		comboBox.labelSize = 30;
		comboBox.itemSize = 25;
		comboBox.selectHandler = new Handler(this, this.onSelect, [comboBox]);
		
		return comboBox;
	}

	onSelect(cb) {
		console.log("选中了： " + cb.selectedLabel);
	}
}

new UI_ComboBox();