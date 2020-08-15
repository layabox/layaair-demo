
class ChinarMirrorPlane extends Laya.Script3D {
    constructor() {
        super();
        this.mirrorCamera = new Laya.Camera();
        this.renderTexture = new Laya.RenderTexture(1024, 1024, Laya.RenderTextureFormat.R8G8B8);
        this.estimateViewFrustum = true;
        this.setNearClipPlane = true;
        this.nearClipDistanceOffset = -0.01;
        this.vn = new Laya.Vector3();
        this.pa = new Laya.Vector3();
        this.pb = new Laya.Vector3();
        this.pc = new Laya.Vector3();
        this.pe = new Laya.Vector3();
        this.va = new Laya.Vector3();
        this.vb = new Laya.Vector3();
        this.vc = new Laya.Vector3();
        this.vr = new Laya.Vector3();
        this.vu = new Laya.Vector3();
        this.p = new Laya.Matrix4x4();
        this.rm = new Laya.Matrix4x4();
        this.tm = new Laya.Matrix4x4();
    }
    set mirrorPlane(value) {
        this._mirrorPlane = value;
        var material = new Laya.UnlitMaterial();
        value.meshRenderer.sharedMaterial = material;
        material.albedoTexture = this.renderTexture;
        material.tilingOffset = new Laya.Vector4(-1, 1, 0, 0);
    }
    set onlyMainCamera(value) {
        value.scene.addChild(this.mirrorCamera);
        this.mainCamera = value;
    }
    onStart() {
        this.mirrorCamera.renderTarget = this.renderTexture;
        this.mirrorCamera.clearColor = new Laya.Vector4(0.0, 0.0, 0.0, 1.0);
    }
    onUpdate() {
        if (this.mirrorCamera == null || this._mirrorPlane == null || this.mainCamera == null) {
            return;
        }
        this._mirrorPlane.transform.worldMatrix.invert(ChinarMirrorPlane.tempMat);
        Laya.Vector3.transformV3ToV3(this.mainCamera.transform.position, ChinarMirrorPlane.tempMat, ChinarMirrorPlane.tempV3);
        ChinarMirrorPlane.tempV3.y = -ChinarMirrorPlane.tempV3.y;
        Laya.Vector3.transformV3ToV3(ChinarMirrorPlane.tempV3, this._mirrorPlane.transform.worldMatrix, ChinarMirrorPlane.tempV3);
        this.mirrorCamera.transform.position = ChinarMirrorPlane.tempV3;
        Laya.Vector3.transformV3ToV3(ChinarMirrorPlane.oriPa, this._mirrorPlane.transform.worldMatrix, this.pa);
        Laya.Vector3.transformV3ToV3(ChinarMirrorPlane.oriPb, this._mirrorPlane.transform.worldMatrix, this.pb);
        Laya.Vector3.transformV3ToV3(ChinarMirrorPlane.oriPc, this._mirrorPlane.transform.worldMatrix, this.pc);
        this.pe = this.mirrorCamera.transform.position;
        this.n = this.mirrorCamera.nearPlane;
        this.f = this.mirrorCamera.farPlane;
        Laya.Vector3.subtract(this.pa, this.pe, this.va);
        Laya.Vector3.subtract(this.pb, this.pe, this.vb);
        Laya.Vector3.subtract(this.pc, this.pe, this.vc);
        Laya.Vector3.subtract(this.pb, this.pa, this.vr);
        Laya.Vector3.subtract(this.pc, this.pa, this.vu);
        Laya.Vector3.cross(this.va, this.vc, ChinarMirrorPlane.tempV3);
        if (Laya.Vector3.dot(ChinarMirrorPlane.tempV3, this.vb) < 0.0) {
            Laya.Vector3.scale(this.vu, -1, this.vu);
            this.pc.cloneTo(this.pa);
            Laya.Vector3.add(this.pa, this.vr, this.pb);
            Laya.Vector3.add(this.pa, this.vu, this.pc);
            Laya.Vector3.subtract(this.pa, this.pe, this.va);
            Laya.Vector3.subtract(this.pb, this.pe, this.vb);
            Laya.Vector3.subtract(this.pc, this.pe, this.vc);
        }
        Laya.Vector3.normalize(this.vr, this.vr);
        Laya.Vector3.normalize(this.vu, this.vu);
        Laya.Vector3.cross(this.vr, this.vu, ChinarMirrorPlane.tempV3);
        Laya.Vector3.normalize(ChinarMirrorPlane.tempV3, this.vn);
        this.d = Laya.Vector3.dot(this.va, this.vn);
        if (this.setNearClipPlane) {
            this.n = this.d + this.nearClipDistanceOffset;
            this.mirrorCamera.nearPlane = this.n;
        }
        this.l = Laya.Vector3.dot(this.vr, this.va) * this.n / this.d;
        this.r = Laya.Vector3.dot(this.vr, this.vb) * this.n / this.d;
        this.b = Laya.Vector3.dot(this.vu, this.va) * this.n / this.d;
        this.t = Laya.Vector3.dot(this.vu, this.vc) * this.n / this.d;
        this.p.elements[0] = 2.0 * this.n / (this.r - this.l);
        this.p.elements[4] = 0;
        this.p.elements[8] = (this.r + this.l) / (this.r - this.l);
        this.p.elements[12] = 0.0;
        this.p.elements[1] = 0.0;
        this.p.elements[5] = 2.0 * this.n / (this.t - this.b);
        this.p.elements[9] = (this.t + this.b) / (this.t - this.b);
        this.p.elements[13] = 0.0;
        this.p.elements[2] = 0;
        this.p.elements[6] = 0;
        this.p.elements[10] = (this.f + this.n) / (this.n - this.f);
        this.p.elements[14] = (2.0 * this.f * this.n / (this.n - this.f)) / 2;
        this.p.elements[3] = 0;
        this.p.elements[7] = 0;
        this.p.elements[11] = -1;
        this.p.elements[15] = 0;
        this.p.elements[0] *= -1;
        this.p.elements[5] *= -1;
        this.p.elements[14] *= -1;
        this.rm.elements[0] = this.vr.x;
        this.rm.elements[4] = this.vr.y;
        this.rm.elements[8] = this.vr.z;
        this.rm.elements[12] = this.pe.x;
        this.rm.elements[1] = this.vu.x;
        this.rm.elements[5] = this.vu.y;
        this.rm.elements[9] = this.vu.z;
        this.rm.elements[13] = this.pe.z;
        this.rm.elements[2] = this.vn.x;
        this.rm.elements[6] = this.vn.y;
        this.rm.elements[10] = this.vn.z;
        this.rm.elements[14] = this.pe.y;
        this.rm.elements[3] = 0;
        this.rm.elements[7] = 0;
        this.rm.elements[11] = 0;
        this.rm.elements[15] = 1;
        this.mirrorCamera.projectionMatrix = this.p;
        this.rm.invert(ChinarMirrorPlane.tempMat);
        this.mirrorCamera.transform.worldMatrix = ChinarMirrorPlane.tempMat;
        if (!this.estimateViewFrustum)
            return;
    }
}
ChinarMirrorPlane.oriPa = new Laya.Vector3(5, 0, -5);
ChinarMirrorPlane.oriPb = new Laya.Vector3(-5, 0, -5);
ChinarMirrorPlane.oriPc = new Laya.Vector3(5, 0, 5);
ChinarMirrorPlane.tempMat = new Laya.Matrix4x4();
ChinarMirrorPlane.tempV3 = new Laya.Vector3();

class VideoPlayIn3DWorld {
    constructor() {
        Laya.Laya3D.init(0, 0);
        Laya.Stat.show();
        Laya.Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Scene3D.load("res/threeDimen/moveClipSample/moveclip/Conventional/moveclip.ls", Laya.Handler.create(this, function (scene) {
            Laya.Laya.stage.addChild(scene);
            var camera = scene.getChildByName("Main Camera");
            camera.addComponent(CameraMoveScript);
            var mirrorFloor = camera.addComponent(ChinarMirrorPlane);
            mirrorFloor.onlyMainCamera = camera;
            mirrorFloor.mirrorPlane = scene.getChildByName("reflectionPlan");
            VideoPlayIn3DWorld.videoPlane = scene.getChildByName("moveclip");
            this.createVideo("res/av/mov_bbb.mp4");
        }));
    }
    createVideo(url) {
        var htmlVideo = new Laya.HtmlVideo();
        htmlVideo.setSource(url, 1);
        VideoPlayIn3DWorld.video = htmlVideo.video;
        htmlVideo.video.addEventListener('loadedmetadata', this.onVideoReady, true);
    }
    onVideoReady() {
        VideoPlayIn3DWorld.video.playsInline = true;
        VideoPlayIn3DWorld.video.muted = true;
        VideoPlayIn3DWorld.video.loop = true;
        VideoPlayIn3DWorld.video.play();
        var videoTexture = new Laya.VideoTexture();
        videoTexture.video = VideoPlayIn3DWorld.video;
        videoTexture.videoPlay();
        VideoPlayIn3DWorld.videoPlane.meshRenderer.sharedMaterial = new Laya.UnlitMaterial();
        VideoPlayIn3DWorld.videoPlane.meshRenderer.sharedMaterial.albedoTexture = videoTexture;
    }
}

new VideoPlayIn3DWorld();

