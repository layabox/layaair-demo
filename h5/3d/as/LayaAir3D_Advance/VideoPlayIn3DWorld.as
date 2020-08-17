package {
	import common.CameraMoveScript;
	import common.ChinarMirrorPlane;
	import laya.net.URL;
	import laya.utils.Handler;
	import laya.utils.Stat;
	import laya.utils.Utils;
	import laya.display.Stage;
	import laya.d3.core.Camera;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Vector3;
	import laya.d3.math.Vector4;
	import laya.d3.core.MeshSprite3D;
	import laya.device.media.HtmlVideo;
	import laya.device.media.VIDEOTYPE;
	import laya.resource.VideoTexture;
	import laya.d3.core.material.UnlitMaterial;
	
	public class VideoPlayIn3DWorld {
		public var video;
		public var videoPlane:MeshSprite3D;

		public function VideoPlayIn3DWorld() {
			//初始化引擎
			Laya3D.init(0, 0);
			URL.basePath = "https://layaair2.ldc2.layabox.com/demo2/h5/";
			Stat.show();
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			//加载场景
			Scene3D.load("res/threeDimen/moveClipSample/moveclip/Conventional/moveclip.ls", Handler.create(this, function (scene: Scene3D): void {
				Laya.stage.addChild(scene) as Scene3D;

				//获取场景中的相机
				var camera: Camera = scene.getChildByName("Main Camera") as Camera;
				camera.addComponent(CameraMoveScript);
				var mirrorFloor:ChinarMirrorPlane = camera.addComponent(ChinarMirrorPlane) as ChinarMirrorPlane;
				mirrorFloor.onlyMainCamera = camera;
				mirrorFloor.mirrorPlane = scene.getChildByName("reflectionPlan") as MeshSprite3D;
				//camera.active = false;    
				
				//增加视频
				videoPlane = scene.getChildByName("moveclip") as MeshSprite3D;
				this.createVideo("https://layaair2.ldc2.layabox.com/demo2/h5/res/av/mov_bbb.mp4");
			}));
			
		}
		private function createVideo(url:string):void{
			var htmlVideo:HtmlVideo = new HtmlVideo();
			htmlVideo.setSource(url,VIDEOTYPE.MP4);
			video = htmlVideo.video;
			htmlVideo.video.addEventListener('loadedmetadata',this.onVideoReady.bind(this),true);
		}

		private function onVideoReady(){
			video.playsInline = true;
			video.muted = true;
			video.loop = true;
			video.play();
			var videoTexture:VideoTexture = new VideoTexture();
			videoTexture.video = video;
			videoTexture.videoPlay();
			videoPlane.meshRenderer.sharedMaterial = new UnlitMaterial();
			(videoPlane.meshRenderer.sharedMaterial as UnlitMaterial).albedoTexture = videoTexture;
		}

	}

}