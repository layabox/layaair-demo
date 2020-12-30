let scene;
let camera;
var EdgeEffectVS = "#if defined(GL_FRAGMENT_PRECISION_HIGH)\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n\r\n#include \"Lighting.glsl\";\r\n\r\nattribute vec4 a_PositionTexcoord;\r\n\r\nvarying vec2 v_Texcoord0;\r\n\r\nvoid main() {\r\n\tgl_Position = vec4(a_PositionTexcoord.xy, 0.0, 1.0);\r\n\tv_Texcoord0 = a_PositionTexcoord.zw;\r\n\tgl_Position = remapGLPositionZ(gl_Position);\r\n}\r\n";

var EdgeEffectFS = "#if defined(GL_FRAGMENT_PRECISION_HIGH)\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n\r\n#include \"DepthNormalUtil.glsl\";\r\n\r\nuniform sampler2D u_MainTex;\r\nuniform vec4 u_MainTex_TexelSize;\r\n\r\nuniform vec4 u_DepthBufferParams;\r\n\r\nuniform vec3 u_EdgeColor;\r\n\r\n#ifdef DEPTHEDGE\r\n    uniform float u_Depthhold;\r\n#endif\r\n\r\n#ifdef NORMALEDGE\r\n    uniform float u_NormalHold;\r\n#endif\r\n\r\n#ifdef COLOREDGE\r\n    uniform float u_ColorHold;\r\n#endif\r\n\r\nvarying vec2 v_Texcoord0;\r\n\r\n#ifdef DEPTHNORMAL\r\n    uniform sampler2D u_DepthNormalTex;\r\n    void getDepthNormal(out float depth, out vec3 normal){\r\n        vec4 col = texture2D(u_DepthNormalTex, v_Texcoord0);\r\n        DecodeDepthNormal(col, depth, normal);\r\n    }\r\n\r\n    float getDepth(vec2 uv) {\r\n        float depth;\r\n        vec3 normal;\r\n        vec4 col = texture2D(u_DepthNormalTex, uv);\r\n        DecodeDepthNormal(col, depth, normal);\r\n        return depth;\r\n    }\r\n\r\n    vec3 getNormal(vec2 uv) {\r\n        float depth;\r\n        vec3 normal;\r\n        vec4 col = texture2D(u_DepthNormalTex, uv);\r\n        DecodeDepthNormal(col, depth, normal);\r\n        return normal;\r\n    }\r\n\r\n#endif\r\n\r\n#ifdef DEPTH\r\n    uniform sampler2D u_DepthTex;\r\n    float getDepth(vec2 uv) {\r\n        float depth = texture2D(u_DepthTex, uv).r;\r\n        depth = Linear01Depth(depth, u_DepthBufferParams);\r\n        return depth;\r\n    }\r\n#endif\r\n\r\nvoid SobelSample(in vec2 uv,out vec3 colorG, out vec3 normalG, out vec3 depthG) {\r\n\r\n    float offsetx = u_MainTex_TexelSize.x;\r\n    float offsety = u_MainTex_TexelSize.y;\r\n    vec2 offsets[9];\r\n    offsets[0] = vec2(-offsetx,  offsety); // 左上\r\n    offsets[1] = vec2( 0.0,    offsety); // 正上\r\n    offsets[2] = vec2( offsetx,  offsety); // 右上\r\n    offsets[3] = vec2(-offsetx,  0.0);   // 左\r\n    offsets[4] = vec2( 0.0,    0.0);   // 中\r\n    offsets[5] = vec2( offsetx,  0.0);   // 右\r\n    offsets[6] = vec2(-offsetx, -offsety); // 左下\r\n    offsets[7] = vec2( 0.0,   -offsety); // 正下\r\n    offsets[8] = vec2( offsetx, -offsety); // 右下\r\n\r\n    float Gx[9];\r\n    Gx[0] = -1.0; Gx[1] = 0.0; Gx[2] = 1.0; \r\n    Gx[3] = -2.0; Gx[4] = 0.0; Gx[5] = 2.0; \r\n    Gx[6] = -1.0; Gx[7] = 0.0; Gx[8] = 1.0; \r\n\r\n    float Gy[9];\r\n    Gy[0] = 1.0; Gy[1] = 2.0; Gy[2] = 1.0; \r\n    Gy[3] = 0.0; Gy[4] = 0.0; Gy[5] = 0.0; \r\n    Gy[6] = -1.0; Gy[7] = -2.0;Gy[8] = -1.0; \r\n\r\n    vec3 sampleTex[9];\r\n    float sampleDepth[9];\r\n    vec3 sampleNormal[9];\r\n    for (int i = 0; i < 9; i++)\r\n    {\r\n        vec2 uvOffset = uv + offsets[i];\r\n        sampleTex[i] = texture2D(u_MainTex, uvOffset).rgb;\r\n        sampleDepth[i] = getDepth(uvOffset);\r\n        sampleNormal[i] = (getNormal(uvOffset) + 1.0) / 2.0;\r\n    }\r\n\r\n    vec3 colorGx = vec3(0.0);\r\n    vec3 colorGy = vec3(0.0);\r\n    float depthGx = 0.0;\r\n    float depthGy = 0.0;\r\n    vec3 normalGx = vec3(0.0);\r\n    vec3 normalGy = vec3(0.0);\r\n\r\n    for (int i = 0; i < 9; i++) {\r\n        colorGx += sampleTex[i] * Gx[i];\r\n        colorGy += sampleTex[i] * Gy[i];\r\n        depthGx += sampleDepth[i] * Gx[i];\r\n        depthGy += sampleDepth[i] * Gy[i];\r\n        normalGx += sampleNormal[i] * Gx[i];\r\n        normalGy += sampleNormal[i] * Gy[i];\r\n    }\r\n\r\n    float colDepthG = abs(depthGx) + abs(depthGy);\r\n    depthG = vec3(colDepthG);\r\n\r\n    colorG = abs(colorGx) + abs(colorGy);\r\n\r\n    normalG = abs(normalGx) + abs(normalGy);\r\n\r\n}\r\n\r\nfloat ColorGray(vec3 color) {\r\n    return (color.r + color.g + color.b) / 3.0;\r\n}\r\n\r\nvec3 getEdgeValue(float hold, vec3 valueG) {\r\n    return vec3(step(hold, ColorGray(valueG)));\r\n}\r\n\r\nvoid main() {\r\n    \r\n    vec2 uv = v_Texcoord0;\r\n\r\n    vec3 colorG, normalG, depthG;\r\n    SobelSample(uv, colorG, normalG, depthG);\r\n    vec3 edgeColor = vec3(0.2);\r\n\r\n    #if defined(DEPTHEDGE)\r\n        vec3 edgeValue = getEdgeValue(u_Depthhold, depthG);\r\n    #endif\r\n\r\n    #if defined(NORMALEDGE)\r\n        vec3 edgeValue = getEdgeValue(u_NormalHold, normalG);\r\n    #endif\r\n\r\n    #if defined(COLOREDGE)\r\n        vec3 edgeValue = getEdgeValue(u_ColorHold, colorG);\r\n    #endif\r\n\r\n    vec3 fillColor = u_EdgeColor;\r\n\r\n    #ifdef SOURCE\r\n        fillColor = texture2D(u_MainTex, uv).rgb;\r\n    #endif\r\n\r\n    vec3 finalColor = mix(fillColor, edgeColor, edgeValue);\r\n    gl_FragColor = vec4(finalColor, 1.0);\r\n\r\n}";

var EdgeMode;
(function (EdgeMode) {
	EdgeMode[EdgeMode["ColorEdge"] = 0] = "ColorEdge";
	EdgeMode[EdgeMode["NormalEdge"] = 1] = "NormalEdge";
	EdgeMode[EdgeMode["DepthEdge"] = 2] = "DepthEdge";
})(EdgeMode || (EdgeMode = {}));
class EdgeEffect extends Laya.PostProcessEffect {
	constructor() {
		super();
		this._shader = null;
		this._shaderData = new Laya.ShaderData();
		this._depthBufferparam = new Laya.Vector4();
		this._edgeMode = EdgeMode.NormalEdge;
		if (!EdgeEffect._isShaderInit) {
			EdgeEffect._isShaderInit = true;
			EdgeEffect.EdgeEffectShaderInit();
		}
		this._shader = Laya.Shader3D.find("PostProcessEdge");
		this.edgeColor = new Laya.Vector3(0.2, 0.2, 0.2);
		this.colorHold = 0.7;
		this.normalHold = 0.7;
		this.depthHold = 0.7;
		this.edgeMode = EdgeMode.DepthEdge;
		this.showSource = true;
	}
	get edgeColor() {
		return this._shaderData.getVector3(EdgeEffect.EDGECOLOR);
	}
	set edgeColor(value) {
		this._shaderData.setVector3(EdgeEffect.EDGECOLOR, value);
	}
	get colorHold() {
		return this._shaderData.getNumber(EdgeEffect.COLORHOLD);
	}
	set colorHold(value) {
		this._shaderData.setNumber(EdgeEffect.COLORHOLD, value);
	}
	get depthHold() {
		return this._shaderData.getNumber(EdgeEffect.DEPTHHOLD);
	}
	set depthHold(value) {
		this._shaderData.setNumber(EdgeEffect.DEPTHHOLD, value);
	}
	get normalHold() {
		return this._shaderData.getNumber(EdgeEffect.NORMALHOLD);
	}
	set normalHold(value) {
		this._shaderData.setNumber(EdgeEffect.NORMALHOLD, value);
	}
	get edgeMode() {
		return this._edgeMode;
	}
	get showSource() {
		return this._shaderData.hasDefine(EdgeEffect.SHADERDEFINE_SOURCE);
	}
	set showSource(value) {
		if (value) {
			this._shaderData.addDefine(EdgeEffect.SHADERDEFINE_SOURCE);
		}
		else {
			this._shaderData.removeDefine(EdgeEffect.SHADERDEFINE_SOURCE);
		}
	}
	set edgeMode(value) {
		this._edgeMode = value;
		switch (value) {
			case EdgeMode.ColorEdge:
				this._shaderData.addDefine(EdgeEffect.SHADERDEFINE_COLOREDGE);
				this._shaderData.removeDefine(EdgeEffect.SHADERDEFINE_DEPTHEDGE);
				this._shaderData.removeDefine(EdgeEffect.SHADERDEFINE_NORMALEDGE);
				break;
			case EdgeMode.NormalEdge:
				this._shaderData.addDefine(EdgeEffect.SHADERDEFINE_NORMALEDGE);
				this._shaderData.removeDefine(EdgeEffect.SHADERDEFINE_DEPTHEDGE);
				this._shaderData.removeDefine(EdgeEffect.SHADERDEFINE_COLOREDGE);
				break;
			case EdgeMode.DepthEdge:
				this._shaderData.addDefine(EdgeEffect.SHADERDEFINE_DEPTHEDGE);
				this._shaderData.removeDefine(EdgeEffect.SHADERDEFINE_COLOREDGE);
				this._shaderData.removeDefine(EdgeEffect.SHADERDEFINE_NORMALEDGE);
				break;
		}
	}
	render(context) {
		let cmd = context.command;
		let viewport = context.camera.viewport;
		let camera = context.camera;
		let far = camera.farPlane;
		let near = camera.nearPlane;
		let source = context.source;
		let destination = context.destination;
		let width = viewport.width;
		let height = viewport.height;
		let renderTexture = Laya.RenderTexture.createFromPool(width, height, Laya.TextureFormat.R8G8B8A8, Laya.RenderTextureDepthFormat.DEPTH_16);
		renderTexture.filterMode = Laya.FilterMode.Bilinear;
		if (camera.depthTextureMode == Laya.DepthTextureMode.Depth) {
			this._shaderData.addDefine(EdgeEffect.SHADERDEFINE_DEPTH);
			this._shaderData.removeDefine(EdgeEffect.SHADERDEFINE_DEPTHNORMAL);
			this._shaderData.setTexture(EdgeEffect.DEPTHTEXTURE, camera.depthTexture);
		}
		else if (camera.depthTextureMode == Laya.DepthTextureMode.DepthNormals) {
			this._shaderData.addDefine(EdgeEffect.SHADERDEFINE_DEPTHNORMAL);
			this._shaderData.removeDefine(EdgeEffect.SHADERDEFINE_DEPTH);
			this._shaderData.setTexture(EdgeEffect.DEPTHNORMALTEXTURE, camera.depthNormalTexture);
		}
		this._depthBufferparam.setValue(1.0 - far / near, far / near, (near - far) / (near * far), 1 / near);
		this._shaderData.setVector(EdgeEffect.DEPTHBUFFERPARAMS, this._depthBufferparam);
		cmd.blitScreenTriangle(source, renderTexture, null, this._shader, this._shaderData, 0);
		context.source = renderTexture;
		context.deferredReleaseTextures.push(renderTexture);
	}
	static EdgeEffectShaderInit() {
		EdgeEffect.SHADERDEFINE_DEPTH = Laya.Shader3D.getDefineByName("DEPTH");
		EdgeEffect.SHADERDEFINE_DEPTHNORMAL = Laya.Shader3D.getDefineByName("DEPTHNORMAL");
		EdgeEffect.SHADERDEFINE_DEPTHEDGE = Laya.Shader3D.getDefineByName("DEPTHEDGE");
		EdgeEffect.SHADERDEFINE_NORMALEDGE = Laya.Shader3D.getDefineByName("NORMALEDGE");
		EdgeEffect.SHADERDEFINE_COLOREDGE = Laya.Shader3D.getDefineByName("COLOREDGE");
		EdgeEffect.SHADERDEFINE_SOURCE = Laya.Shader3D.getDefineByName("SOURCE");
		let attributeMap = {
			'a_PositionTexcoord': Laya.VertexMesh.MESH_POSITION0
		};
		let uniformMap = {
			'u_MainTex': Laya.Shader3D.PERIOD_MATERIAL,
			'u_OffsetScale': Laya.Shader3D.PERIOD_MATERIAL,
			'u_MainTex_TexelSize': Laya.Shader3D.PERIOD_MATERIAL,
			'u_DepthTex': Laya.Shader3D.PERIOD_MATERIAL,
			'u_DepthNormalTex': Laya.Shader3D.PERIOD_MATERIAL,
			'u_DepthBufferParams': Laya.Shader3D.PERIOD_MATERIAL,
			'u_ColorHold': Laya.Shader3D.PERIOD_MATERIAL,
			'u_Depthhold': Laya.Shader3D.PERIOD_MATERIAL,
			'u_NormalHold': Laya.Shader3D.PERIOD_MATERIAL
		};
		let shader = Laya.Shader3D.add("PostProcessEdge");
		let subShader = new Laya.SubShader(attributeMap, uniformMap);
		shader.addSubShader(subShader);
		let pass = subShader.addShaderPass(EdgeEffectVS, EdgeEffectFS);
		pass.renderState.depthWrite = false;
	}
}
EdgeEffect._isShaderInit = false;
EdgeEffect.DEPTHTEXTURE = Laya.Shader3D.propertyNameToID("u_DepthTex");
EdgeEffect.DEPTHNORMALTEXTURE = Laya.Shader3D.propertyNameToID("u_DepthNormalTex");
EdgeEffect.DEPTHBUFFERPARAMS = Laya.Shader3D.propertyNameToID("u_DepthBufferParams");
EdgeEffect.EDGECOLOR = Laya.Shader3D.propertyNameToID("u_EdgeColor");
EdgeEffect.COLORHOLD = Laya.Shader3D.propertyNameToID("u_ColorHold");
EdgeEffect.DEPTHHOLD = Laya.Shader3D.propertyNameToID("u_Depthhold");
EdgeEffect.NORMALHOLD = Laya.Shader3D.propertyNameToID("u_NormalHold");
class PostProcess_Edge {
    constructor() {
		Laya3D.init(0, 0);
		Laya.URL.basePath ="https://layaair2.ldc2.layabox.com/demo2/h5/";
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;

        Laya.Stat.show();

        Laya.Shader3D.debugMode = true;

        this.scene = Laya.stage.addChild(new Laya.Scene3D);
        this.camera = this.scene.addChild(new Laya.Camera(0, 0.2, 50));
       // this.camera.addComponent(CameraMoveScript);
        this.camera.transform.position = new Laya.Vector3(0, 4, 10);
        this.camera.transform.rotation = new Laya.Quaternion(-0.2, 0, 0, 0.97);

        this.addLight();

        let res = [
            "res/threeDimen/skinModel/dude/dude.lh",
        ];

        Laya.loader.create(res, Laya.Handler.create(this, this.onResComplate));

    }

    onResComplate() {

        let sphere = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createSphere(1), "Sphere");
        this.scene.addChild(sphere);
        sphere.transform.position = new Laya.Vector3(0, 1, 0);

        let plane = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createPlane(), "Plane");
        this.scene.addChild(plane);
        plane.transform.position = new Laya.Vector3(0, -0.5, 0);

        let cube = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1, 1, 1), "Cube");
        this.scene.addChild(cube);
        cube.transform.position = new Laya.Vector3(0, 3, 0);
        
        this.camera.depthTextureMode |= Laya.DepthTextureMode.DepthNormals;

        let dude = Laya.Loader.getRes("res/threeDimen/skinModel/dude/dude.lh");
        this.scene.addChild(dude);
        dude.transform.position = new Laya.Vector3(1.5, 0, 0);
        dude.transform.rotationEuler = new Laya.Vector3(0, 180, 0);

        let postProcess = new Laya.PostProcess();
        this.camera.postProcess = postProcess;

        let edgeEffect = new EdgeEffect();
        postProcess.addEffect(edgeEffect);

        this.addUI(edgeEffect);
    }

    addLight() {

        let dirLightDirections = [new Laya.Vector3(-1, -1, -1), new Laya.Vector3(1, -1, -1)]
        let lightColor = new Laya.Vector3(0.6, 0.6, 0.6);
        for (let index = 0; index < dirLightDirections.length; index++) {
            let dir = dirLightDirections[index];
            Laya.Vector3.normalize(dir, dirLightDirections[index]);
            let dirLight = new Laya.DirectionLight();
            this.scene.addChild(dirLight);
            dirLight.transform.worldMatrix.setForward(dirLightDirections[index]);
            dirLight.color = lightColor;
        }

    }

    addUI(edgeEffect) {
        Laya.loader.load(["res/ui/hslider.png", "res/threeDimen/ui/button.png", "res/ui/hslider$bar.png", "res/ui/colorPicker.png"], Laya.Handler.create(this, function () {

            let colorButton = this.addButton(100, 250, 160, 30, "color edge", 20, function () {
                edgeEffect.edgeMode = EdgeMode.ColorEdge;
                colorSlider.visible = true;
                normalSlider.visible = false;
                depthSlider.visible = false;
            });

            let colorSlider = this.addSlider(100, 290, 300, 0.01, 1, 0.7, 0.01, function (value) {
                edgeEffect.colorHold = value;
            });

            let normalFunc = function () {
                edgeEffect.edgeMode = EdgeMode.NormalEdge;
                colorSlider.visible = false;
                normalSlider.visible = true;
                depthSlider.visible = false;
            };
            let normalButton = this.addButton(100, 330, 160, 30, "normal edge", 20, normalFunc);

            let normalSlider = this.addSlider(100, 370, 300, 0.01, 1, 0.7, 0.01, function (value) {
                edgeEffect.normalHold = value;
            });

            let depthButton = this.addButton(100, 410, 160, 30, "depth edge", 20, function () {
                edgeEffect.edgeMode = EdgeMode.DepthEdge;
                colorSlider.visible = false;
                normalSlider.visible = false;
                depthSlider.visible = true;
            });

            let depthSlider = this.addSlider(100, 450, 300, 0.01, 1, 0.7, 0.01, function (value) {
                edgeEffect.depthHold = value;
            });

            let source = this.addButton(100, 490, 160, 30, "show source", 20, function () {
                edgeEffect.showSource = !edgeEffect.showSource;
            });

            normalFunc();

        }));
    }

    addButton(x, y, width, height, text, size, clickFunc) {
        let button = Laya.stage.addChild(new Laya.Button("res/threeDimen/ui/button.png", text));
        button.size(width, height);
        button.labelBold = true;
        button.labelSize = size;
        button.sizeGrid = "4,4,4,4";
        button.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
        button.pos(x, y);
        button.on(Laya.Event.CLICK, this, clickFunc);
        return button;
    }

    addSlider(x, y, width, min, max, value, tick, changeFunc) {
        let slider = Laya.stage.addChild(new Laya.HSlider("res/ui/hslider.png"));
        slider.width = width;
        slider.pos(x, y);
        slider.min = min;
        slider.max = max;
        slider.value = value;
        slider.tick = tick;
        slider.changeHandler = Laya.Handler.create(this, changeFunc, [], false);

        slider.visible = false;

        return slider;
	}
}
new PostProcess_Edge;