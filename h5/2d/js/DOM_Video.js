class DOM_Video {
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

		// 创建Video元素
		let videoElement = Laya.Browser.createElement("video");
		Laya.Browser.document.body.appendChild(videoElement);

		// 设置Video元素地样式和属性
		videoElement.style.zInddex = Laya.Render.canvas.style.zIndex + 1;
		videoElement.src = "res/av/mov_bbb.mp4";
		videoElement.controls = true;
		// 阻止IOS视频全屏
		videoElement.setAttribute("webkit-playsinline", true);
		videoElement.setAttribute("playsinline", true);

		// 设置画布上的对齐参照物
		let reference = new Laya.Sprite();
		Laya.stage.addChild(reference);
		reference.pos(100, 100);
		reference.size(600, 400);
		reference.graphics.drawRect(0, 0, reference.width, reference.height, "#CCCCCC");

		// 每次舞台尺寸变更时，都会调用Utils.fitDOMElementInArea设置Video的位置，对齐的位置和refence重合
		Laya.stage.on(Laya.Event.RESIZE, this, Laya.Utils.fitDOMElementInArea, [videoElement, reference, 0, 0, reference.width, reference.height]);
	}
}

new DOM_Video();