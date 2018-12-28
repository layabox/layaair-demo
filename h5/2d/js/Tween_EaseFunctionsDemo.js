let
	character,
	duration = 2000,
	tween;

class Tween_EaseFunctionsDemo {
	constructor() {
		const 
			WebGL = Laya.WebGL,
			Stage = Laya.Stage,
			Browser = Laya.Browser,
			Stat = Laya.Stat,
			Handler = Laya.Handler;

		// 不支持WebGL时自动切换至Canvas
		Laya.init(550, 400, WebGL);

		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;

		Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
		Laya.stage.bgColor = "#232628";

		this.setup();
	}

	setup() {
		this.createCharacter();
		this.createEaseFunctionList();
		this.createDurationCrontroller();
	}

	createCharacter() {
		const Sprite = Laya.Sprite;

		character = new Sprite();
		Laya.stage.addChild(character);
		character.loadImage("res/cartoonCharacters/1.png");
		character.pos(100, 50);
	}

	createEaseFunctionList() {
		const 
			List = Laya.List,
			Handler = Laya.Handler;

			let easeFunctionsList = new List();

			easeFunctionsList.itemRender = ListItemRender;
			easeFunctionsList.pos(5, 5);
	
			easeFunctionsList.repeatX = 1;
			easeFunctionsList.repeatY = 20;
	
			easeFunctionsList.vScrollBarSkin = '';
	
			easeFunctionsList.selectEnable = true;
			easeFunctionsList.selectHandler = new Handler(this, this.onEaseFunctionChange, [easeFunctionsList]);
			easeFunctionsList.renderHandler = new Handler(this, this.renderList);
			Laya.stage.addChild(easeFunctionsList);
	
			let data = [];
			data.push('backIn', 'backOut', 'backInOut');
			data.push('bounceIn', 'bounceOut', 'bounceInOut');
			data.push('circIn', 'circOut', 'circInOut');
			data.push('cubicIn', 'cubicOut', 'cubicInOut');
			data.push('elasticIn', 'elasticOut', 'elasticInOut');
			data.push('expoIn', 'expoOut', 'expoInOut');
			data.push('linearIn', 'linearOut', 'linearInOut');
			data.push('linearNone');
			data.push('QuadIn', 'QuadOut', 'QuadInOut');
			data.push('quartIn', 'quartOut', 'quartInOut');
			data.push('quintIn', 'quintOut', 'quintInOut');
			data.push('sineIn', 'sineOut', 'sineInOut');
			data.push('strongIn', 'strongOut', 'strongInOut');

			easeFunctionsList.array = data;
	}

	renderList(item) {
		item.setLabel(item.dataSource);
	}

	onEaseFunctionChange(list) {
		const 
			Tween = Laya.Tween,
			Ease = Laya.Ease;

		character.pos(100, 50);

		tween && tween.clear();
		tween = Tween.to(character, { x: 350, y: 250 }, duration, Ease[list.selectedItem]);
	}

	createDurationCrontroller() {
		const Event = Laya.Event;

		let durationInput = this.createInputWidthLabel("Duration:", '2000', 400, 10);
		durationInput.on(Event.INPUT, this, function() {
			duration = parseInt(durationInput.text);
		});
	}

	createInputWidthLabel(label, prompt, x, y) {
		const 
			Text = Laya.Text,
			Input = Laya.Input;
		
		let text = new Text();
		text.text = label;
		text.color = "white";
		Laya.stage.addChild(text);
		text.pos(x, y);

		let input = new Input();
		input.size(50, 20);
		input.text = prompt;
		input.align = 'center';
		Laya.stage.addChild(input);
		input.color = "#FFFFFF";
		input.borderColor = "#FFFFFF";
		input.pos(text.x + text.width + 10, text.y - 3);
		input.inputElementYAdjuster = 1;

		return input
	}
}

class ListItemRender extends Laya.Box {
	constructor() {
		super();
		const Label = Laya.Label;

		this.size(100, 20);

		this.label = new Label();
		this.label.fontSize = 12;
		this.label.color = "#FFFFFF";
		this.addChild(this.label);
	}

	setLabel(value) {
		this.label.text = value;
	}
}

new Tween_EaseFunctionsDemo();