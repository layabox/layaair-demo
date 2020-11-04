window.Laya=window.Laya||{};

(function (Laya) {
	'use strict';

	class CameraMoveScript extends Laya.Script3D {
	    constructor() {
	        super();
	        this._tempVector3 = new Laya.Vector3();
	        this.yawPitchRoll = new Laya.Vector3();
	        this.resultRotation = new Laya.Quaternion();
	        this.tempRotationZ = new Laya.Quaternion();
	        this.tempRotationX = new Laya.Quaternion();
	        this.tempRotationY = new Laya.Quaternion();
	        this.rotaionSpeed = 0.00006;
	        this.speed = 0.01;
	    }
	    _updateRotation() {
	        if (Math.abs(this.yawPitchRoll.y) < 1.50) {
	            Laya.Quaternion.createFromYawPitchRoll(this.yawPitchRoll.x, this.yawPitchRoll.y, this.yawPitchRoll.z, this.tempRotationZ);
	            this.tempRotationZ.cloneTo(this.camera.transform.localRotation);
	            this.camera.transform.localRotation = this.camera.transform.localRotation;
	        }
	    }
	    onAwake() {
	        Laya.Laya.stage.on(Laya.Event.RIGHT_MOUSE_DOWN, this, this.mouseDown);
	        Laya.Laya.stage.on(Laya.Event.RIGHT_MOUSE_UP, this, this.mouseUp);
	        this.camera = this.owner;
	    }
	    onUpdate() {
	        var elapsedTime = Laya.Laya.timer.delta;
	        if (!isNaN(this.lastMouseX) && !isNaN(this.lastMouseY) && this.isMouseDown) {
	            var scene = this.owner.scene;
	            Laya.KeyBoardManager.hasKeyDown(87) && this.moveForward(-this.speed * elapsedTime);
	            Laya.KeyBoardManager.hasKeyDown(83) && this.moveForward(this.speed * elapsedTime);
	            Laya.KeyBoardManager.hasKeyDown(65) && this.moveRight(-this.speed * elapsedTime);
	            Laya.KeyBoardManager.hasKeyDown(68) && this.moveRight(this.speed * elapsedTime);
	            Laya.KeyBoardManager.hasKeyDown(81) && this.moveVertical(this.speed * elapsedTime);
	            Laya.KeyBoardManager.hasKeyDown(69) && this.moveVertical(-this.speed * elapsedTime);
	            var offsetX = Laya.Laya.stage.mouseX - this.lastMouseX;
	            var offsetY = Laya.Laya.stage.mouseY - this.lastMouseY;
	            var yprElem = this.yawPitchRoll;
	            yprElem.x -= offsetX * this.rotaionSpeed * elapsedTime;
	            yprElem.y -= offsetY * this.rotaionSpeed * elapsedTime;
	            this._updateRotation();
	        }
	        this.lastMouseX = Laya.Laya.stage.mouseX;
	        this.lastMouseY = Laya.Laya.stage.mouseY;
	    }
	    onDestroy() {
	        Laya.Laya.stage.off(Laya.Event.RIGHT_MOUSE_DOWN, this, this.mouseDown);
	        Laya.Laya.stage.off(Laya.Event.RIGHT_MOUSE_UP, this, this.mouseUp);
	    }
	    mouseDown(e) {
	        this.camera.transform.localRotation.getYawPitchRoll(this.yawPitchRoll);
	        this.lastMouseX = Laya.Laya.stage.mouseX;
	        this.lastMouseY = Laya.Laya.stage.mouseY;
	        this.isMouseDown = true;
	    }
	    mouseUp(e) {
	        this.isMouseDown = false;
	    }
	    mouseOut(e) {
	        this.isMouseDown = false;
	    }
	    moveForward(distance) {
	        this._tempVector3.x = this._tempVector3.y = 0;
	        this._tempVector3.z = distance;
	        this.camera.transform.translate(this._tempVector3);
	    }
	    moveRight(distance) {
	        this._tempVector3.y = this._tempVector3.z = 0;
	        this._tempVector3.x = distance;
	        this.camera.transform.translate(this._tempVector3);
	    }
	    moveVertical(distance) {
	        this._tempVector3.x = this._tempVector3.z = 0;
	        this._tempVector3.y = distance;
	        this.camera.transform.translate(this._tempVector3, false);
	    }
	}

	var BlurVS = "#include \"Lighting.glsl\";\r\n#if defined(GL_FRAGMENT_PRECISION_HIGH)// 原来的写法会被我们自己的解析流程处理，而我们的解析是不认内置宏的，导致被删掉，所以改成 if defined 了\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\nattribute vec4 a_PositionTexcoord;\r\nvarying vec2 v_Texcoord0;\r\n\r\nvoid main() {\r\n\tgl_Position = vec4(a_PositionTexcoord.xy, 0.0, 1.0);\r\n\tv_Texcoord0 = a_PositionTexcoord.zw;\r\n\tgl_Position = remapGLPositionZ(gl_Position);\r\n}";

	var BlurHorizentalFS = "#if defined(GL_FRAGMENT_PRECISION_HIGH)// 原来的写法会被我们自己的解析流程处理，而我们的解析是不认内置宏的，导致被删掉，所以改成 if defined 了\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n\r\nvarying vec2 v_Texcoord0;\r\nuniform sampler2D u_MainTex;\r\nuniform vec4 u_MainTex_TexelSize;\r\nuniform float u_DownSampleValue;\r\n\r\nvoid main()\r\n{\r\n    vec4 color = vec4(0.0,0.0,0.0,0.0);\r\n    vec2 uv = v_Texcoord0;\r\n    vec2 uvOffset = vec2(1.0,0.0)*u_MainTex_TexelSize.xy*u_DownSampleValue;\r\n    uv = uv - uvOffset*3.0;\r\n    //高斯参数\r\n    color+=0.0205*texture2D(u_MainTex,uv);\r\n    uv+=uvOffset;\r\n    color+=0.0855*texture2D(u_MainTex,uv);\r\n    uv+=uvOffset;\r\n    color+=0.232*texture2D(u_MainTex,uv);\r\n    uv+=uvOffset;\r\n    color+=0.324*texture2D(u_MainTex,uv);\r\n    uv+=uvOffset;\r\n    color+=0.232*texture2D(u_MainTex,uv);\r\n    uv+=uvOffset;\r\n    color+=0.0855*texture2D(u_MainTex,uv);\r\n    uv+=uvOffset;\r\n    color+=0.0205*texture2D(u_MainTex,uv);\r\n\r\n    gl_FragColor = color;\r\n    \r\n\r\n    \r\n}";

	var BlurVerticalFS = "#if defined(GL_FRAGMENT_PRECISION_HIGH)// 原来的写法会被我们自己的解析流程处理，而我们的解析是不认内置宏的，导致被删掉，所以改成 if defined 了\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n\r\nvarying vec2 v_Texcoord0;\r\nuniform sampler2D u_MainTex;\r\nuniform vec4 u_MainTex_TexelSize;\r\nuniform float u_DownSampleValue;\r\n\r\nvoid main()\r\n{\r\n    vec4 color = vec4(0.0,0.0,0.0,0.0);\r\n    vec2 uv = v_Texcoord0;\r\n    vec2 uvOffset = vec2(0.0,1.0)*u_MainTex_TexelSize.xy*u_DownSampleValue;\r\n    uv = uv - uvOffset*3.0;\r\n    //高斯参数\r\n    color+=0.0205*texture2D(u_MainTex,uv);\r\n    uv+=uvOffset;\r\n    color+=0.0855*texture2D(u_MainTex,uv);\r\n    uv+=uvOffset;\r\n    color+=0.232*texture2D(u_MainTex,uv);\r\n    uv+=uvOffset;\r\n    color+=0.324*texture2D(u_MainTex,uv);\r\n    uv+=uvOffset;\r\n    color+=0.232*texture2D(u_MainTex,uv);\r\n    uv+=uvOffset;\r\n    color+=0.0855*texture2D(u_MainTex,uv);\r\n    uv+=uvOffset;\r\n    color+=0.0205*texture2D(u_MainTex,uv);\r\n\r\n    gl_FragColor = color;\r\n    \r\n\r\n    \r\n}";

	var BlurDownSampleFS = "#if defined(GL_FRAGMENT_PRECISION_HIGH)// 原来的写法会被我们自己的解析流程处理，而我们的解析是不认内置宏的，导致被删掉，所以改成 if defined 了\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n\r\nvarying vec2 v_Texcoord0;\r\nuniform sampler2D u_MainTex;\r\nuniform vec4 u_MainTex_TexelSize;\r\n\r\nvoid main()\r\n{\r\n    vec4 color = vec4(0.0,0.0,0.0,0.0);\r\n    color += texture2D(u_MainTex,v_Texcoord0+u_MainTex_TexelSize.xy*vec2(1.0,0.0));\r\n\tcolor += texture2D(u_MainTex,v_Texcoord0+u_MainTex_TexelSize.xy*vec2(-1.0,0.0));\r\n\tcolor += texture2D(u_MainTex,v_Texcoord0+u_MainTex_TexelSize.xy*vec2(0.0,-1.0));\r\n\tcolor += texture2D(u_MainTex,v_Texcoord0+u_MainTex_TexelSize.xy*vec2(0.0,1.0));\r\n    gl_FragColor = color/4.0;\r\n    //gl_FragColor = vec4(1.0,0.0,0.0,1.0);\r\n}";

	var BlurDownSampleVS = "#include \"Lighting.glsl\";\r\n#if defined(GL_FRAGMENT_PRECISION_HIGH)// 原来的写法会被我们自己的解析流程处理，而我们的解析是不认内置宏的，导致被删掉，所以改成 if defined 了\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\nattribute vec4 a_PositionTexcoord;\r\nvarying vec2 v_Texcoord0;\r\n\r\nvoid main() {\r\n\tgl_Position = vec4(a_PositionTexcoord.xy, 0.0, 1.0);\r\n\tv_Texcoord0 = a_PositionTexcoord.zw;\r\n\tgl_Position = remapGLPositionZ(gl_Position);\r\n}";

	var BlurEdgeAdd = "#if defined(GL_FRAGMENT_PRECISION_HIGH)// 原来的写法会被我们自己的解析流程处理，而我们的解析是不认内置宏的，导致被删掉，所以改成 if defined 了\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n\r\nvarying vec2 v_Texcoord0;\r\nuniform sampler2D u_MainTex;\r\nuniform sampler2D u_sourceTexture0;\r\n\r\nvoid main()\r\n{\r\n    vec2 uv = v_Texcoord0;\r\n    vec4 mainColor = texture2D(u_MainTex,uv);\r\n    vec4 sourceColor = texture2D(u_sourceTexture0,uv);\r\n    float factor = step(sourceColor.x+sourceColor.y+sourceColor.z,0.001);\r\n    vec4 color = mix(sourceColor,mainColor,factor);\r\n    gl_FragColor =color;\r\n}";

	var BlurEdgeSub = "#if defined(GL_FRAGMENT_PRECISION_HIGH)// 原来的写法会被我们自己的解析流程处理，而我们的解析是不认内置宏的，导致被删掉，所以改成 if defined 了\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n\r\nvarying vec2 v_Texcoord0;\r\nuniform sampler2D u_sourceTexture0;\r\nuniform sampler2D u_sourceTexture1;\r\n\r\nvoid main()\r\n{\r\n    vec2 uv = v_Texcoord0;\r\n    vec4 blurColor = texture2D(u_sourceTexture0,uv);\r\n    vec4 clearColor = texture2D(u_sourceTexture1,uv);\r\n    float factor = step(clearColor.x+clearColor.y+clearColor.z,0.001);\r\n    vec4 color = blurColor*factor;\r\n    color = (1.0-step(color.x+color.y+color.z,0.15))*vec4(1.0,0.0,0.0,1.0);\r\n    gl_FragColor = color;\r\n}";

	class BlurEffect extends Laya.PostProcessEffect {
	    constructor() {
	        super();
	        this._shader = null;
	        this._shaderData = new Laya.ShaderData();
	        this._downSampleNum = 1;
	        this._blurSpreadSize = 1;
	        this._blurIterations = 2;
	        this._texSize = new Laya.Vector4(1.0, 1.0, 1.0, 1.0);
	        this._shader = Laya.Shader3D.find("blurEffect");
	        this._tempRenderTexture = new Array(13);
	    }
	    static init() {
	        var attributeMap = {
	            'a_PositionTexcoord': Laya.VertexMesh.MESH_POSITION0
	        };
	        var uniformMap = {
	            'u_MainTex': Laya.Shader3D.PERIOD_MATERIAL,
	            'u_MainTex_TexelSize': Laya.Shader3D.PERIOD_MATERIAL,
	            'u_DownSampleValue': Laya.Shader3D.PERIOD_MATERIAL,
	            'u_sourceTexture0': Laya.Shader3D.PERIOD_MATERIAL,
	            'u_sourceTexture1': Laya.Shader3D.PERIOD_MATERIAL
	        };
	        var shader = Laya.Shader3D.add("blurEffect");
	        var subShader = new Laya.SubShader(attributeMap, uniformMap);
	        shader.addSubShader(subShader);
	        var shaderpass = subShader.addShaderPass(BlurDownSampleVS, BlurDownSampleFS);
	        var renderState = shaderpass.renderState;
	        renderState.depthTest = Laya.RenderState.DEPTHTEST_ALWAYS;
	        renderState.depthWrite = false;
	        renderState.cull = Laya.RenderState.CULL_NONE;
	        renderState.blend = Laya.RenderState.BLEND_DISABLE;
	        subShader = new Laya.SubShader(attributeMap, uniformMap);
	        shader.addSubShader(subShader);
	        shaderpass = subShader.addShaderPass(BlurVS, BlurVerticalFS);
	        renderState = shaderpass.renderState;
	        renderState.depthTest = Laya.RenderState.DEPTHTEST_ALWAYS;
	        renderState.depthWrite = false;
	        renderState.cull = Laya.RenderState.CULL_NONE;
	        renderState.blend = Laya.RenderState.BLEND_DISABLE;
	        subShader = new Laya.SubShader(attributeMap, uniformMap);
	        shader.addSubShader(subShader);
	        shaderpass = subShader.addShaderPass(BlurVS, BlurHorizentalFS);
	        renderState = shaderpass.renderState;
	        renderState.depthTest = Laya.RenderState.DEPTHTEST_ALWAYS;
	        renderState.depthWrite = false;
	        renderState.cull = Laya.RenderState.CULL_NONE;
	        renderState.blend = Laya.RenderState.BLEND_DISABLE;
	        subShader = new Laya.SubShader(attributeMap, uniformMap);
	        shader.addSubShader(subShader);
	        shaderpass = subShader.addShaderPass(BlurVS, BlurEdgeSub);
	        renderState = shaderpass.renderState;
	        renderState.depthTest = Laya.RenderState.DEPTHTEST_ALWAYS;
	        renderState.depthWrite = false;
	        renderState.cull = Laya.RenderState.CULL_NONE;
	        renderState.blend = Laya.RenderState.BLEND_DISABLE;
	        subShader = new Laya.SubShader(attributeMap, uniformMap);
	        shader.addSubShader(subShader);
	        shaderpass = subShader.addShaderPass(BlurVS, BlurEdgeAdd);
	        renderState = shaderpass.renderState;
	        renderState.depthTest = Laya.RenderState.DEPTHTEST_ALWAYS;
	        renderState.depthWrite = false;
	        renderState.cull = Laya.RenderState.CULL_NONE;
	        renderState.blend = Laya.RenderState.BLEND_DISABLE;
	    }
	    get downSampleNum() {
	        return this._downSampleNum;
	    }
	    set downSampleNum(value) {
	        this._downSampleNum = Math.min(6, Math.max(value, 0.0));
	    }
	    get blurSpreadSize() {
	        return this._blurSpreadSize;
	    }
	    set blurSpreadSize(value) {
	        this._blurSpreadSize = Math.min(10, Math.max(value, 1.0));
	    }
	    get blurIterations() {
	        return this._blurIterations;
	    }
	    set blurIterations(value) {
	        this._blurIterations = Math.min(Math.max(value, 0.0), 6.0);
	    }
	    render(context) {
	        var cmd = context.command;
	        var viewport = context.camera.viewport;
	        var scaleFactor = 1.0 / (1 << Math.floor(this._downSampleNum));
	        var tw = Math.floor(viewport.width * scaleFactor);
	        var th = Math.floor(viewport.height * scaleFactor);
	        this._texSize.setValue(1.0 / tw, 1.0 / th, tw, th);
	        this._shaderData.setNumber(BlurEffect.SHADERVALUE_DOWNSAMPLEVALUE, this.blurSpreadSize);
	        this._shaderData.setVector(BlurEffect.SHADERVALUE_TEXELSIZE, this._texSize);
	        var downSampleTexture = Laya.RenderTexture.createFromPool(tw, th, Laya.RenderTextureFormat.R8G8B8, Laya.RenderTextureDepthFormat.DEPTHSTENCIL_NONE);
	        downSampleTexture.filterMode = Laya.FilterMode.Bilinear;
	        this._tempRenderTexture[0] = downSampleTexture;
	        var lastDownTexture = context.source;
	        cmd.blitScreenTriangle(lastDownTexture, downSampleTexture, null, this._shader, this._shaderData, 0);
	        lastDownTexture = downSampleTexture;
	        for (var i = 0; i < this._blurIterations; i++) {
	            var blurTexture = Laya.RenderTexture.createFromPool(tw, th, Laya.RenderTextureFormat.R8G8B8, Laya.RenderTextureDepthFormat.DEPTHSTENCIL_NONE);
	            blurTexture.filterMode = Laya.FilterMode.Bilinear;
	            cmd.blitScreenTriangle(lastDownTexture, blurTexture, null, this._shader, this._shaderData, 1);
	            lastDownTexture = blurTexture;
	            this._tempRenderTexture[i * 2 + 1] = blurTexture;
	            blurTexture = Laya.RenderTexture.createFromPool(tw, th, Laya.RenderTextureFormat.R8G8B8, Laya.RenderTextureDepthFormat.DEPTHSTENCIL_NONE);
	            blurTexture.filterMode = Laya.FilterMode.Bilinear;
	            cmd.blitScreenTriangle(lastDownTexture, blurTexture, null, this._shader, this._shaderData, 2);
	            lastDownTexture = blurTexture;
	            this._tempRenderTexture[i * 2 + 2] = blurTexture;
	        }
	        context.source = lastDownTexture;
	        var maxTexture = this._blurIterations * 2 + 1;
	        for (i = 0; i < maxTexture; i++) {
	            Laya.RenderTexture.recoverToPool(this._tempRenderTexture[i]);
	        }
	        context.deferredReleaseTextures.push(lastDownTexture);
	    }
	}
	BlurEffect.BLUR_TYPE_GaussianBlur = 0;
	BlurEffect.BLUR_TYPE_Simple = 1;
	BlurEffect.SHADERVALUE_MAINTEX = Laya.Shader3D.propertyNameToID("u_MainTex");
	BlurEffect.SHADERVALUE_TEXELSIZE = Laya.Shader3D.propertyNameToID("u_MainTex_TexelSize");
	BlurEffect.SHADERVALUE_DOWNSAMPLEVALUE = Laya.Shader3D.propertyNameToID("u_DownSampleValue");
	class BlurMaterial extends Laya.Material {
	    constructor(texelSize, offset) {
	        super();
	        this.texelSize = new Laya.Vector4();
	        this.doSamplevalue = 0;
	        this.setShaderName("blurEffect");
	        this._shaderValues.setNumber(BlurMaterial.SHADERVALUE_DOWNSAMPLEVALUE, offset);
	        this._shaderValues.setVector(BlurMaterial.SHADERVALUE_TEXELSIZE, texelSize);
	    }
	    sourceTexture(sourceTexture0, sourceTexture1) {
	        this._shaderValues.setTexture(BlurMaterial.SHADERVALUE_SOURCETEXTURE0, sourceTexture0);
	        this._shaderValues.setTexture(BlurMaterial.ShADERVALUE_SOURCETEXTURE1, sourceTexture1);
	    }
	}
	BlurMaterial.SHADERVALUE_MAINTEX = Laya.Shader3D.propertyNameToID("u_MainTex");
	BlurMaterial.SHADERVALUE_TEXELSIZE = Laya.Shader3D.propertyNameToID("u_MainTex_TexelSize");
	BlurMaterial.SHADERVALUE_DOWNSAMPLEVALUE = Laya.Shader3D.propertyNameToID("u_DownSampleValue");
	BlurMaterial.SHADERVALUE_SOURCETEXTURE0 = Laya.Shader3D.propertyNameToID("u_sourceTexture0");
	BlurMaterial.ShADERVALUE_SOURCETEXTURE1 = Laya.Shader3D.propertyNameToID("u_sourceTexture1");

	class PostProcess_Blur {
	    constructor() {
	        Laya.Laya3D.init(0, 0);
	        Laya.Stat.show();
	        Laya.Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
	        Laya.Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
	        Laya.Shader3D.debugMode = true;
	        BlurEffect.init();
	        Laya.Scene3D.load("res/threeDimen/LayaScene_zhuandibanben/Conventional/zhuandibanben.ls", Laya.Handler.create(this, function (scene) {
	            Laya.Laya.stage.addChild(scene);
	            this.camera = scene.getChildByName("MainCamera");
	            this.camera.addComponent(CameraMoveScript);
	            this.camera.clearFlag = Laya.CameraClearFlags.Sky;
	            this.camera.cullingMask ^= 2;
	            this.camera.enableHDR = false;
	            var mainCamera = scene.getChildByName("BlurCamera");
	            mainCamera.clearFlag = Laya.CameraClearFlags.Nothing;
	            mainCamera.cullingMask = 2;
	            mainCamera.renderingOrder = 1;
	            mainCamera.enableHDR = false;
	            this.camera.addChild(mainCamera);
	            mainCamera.transform.localMatrix = new Laya.Matrix4x4();
	            this.postProcess = new Laya.PostProcess();
	            var blurEffect = new BlurEffect();
	            this.postProcess.addEffect(blurEffect);
	            this.camera.postProcess = this.postProcess;
	            blurEffect.downSampleNum = 6;
	            blurEffect.blurSpreadSize = 1;
	            blurEffect.blurIterations = 1;
	            this.loadUI();
	        }));
	    }
	    loadUI() {
	        Laya.Laya.loader.load(["res/threeDimen/ui/button.png"], Laya.Handler.create(this, function () {
	            var button = Laya.Laya.stage.addChild(new Laya.Button("res/threeDimen/ui/button.png", "关闭高斯模糊"));
	            button.size(200, 40);
	            button.labelBold = true;
	            button.labelSize = 30;
	            button.sizeGrid = "4,4,4,4";
	            button.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
	            button.pos(Laya.Laya.stage.width / 2 - button.width * Laya.Browser.pixelRatio / 2, Laya.Laya.stage.height - 60 * Laya.Browser.pixelRatio);
	            button.on(Laya.Event.CLICK, this, function () {
	                var enableHDR = !!this.camera.postProcess;
	                if (enableHDR) {
	                    button.label = "开启高斯模糊";
	                    this.camera.postProcess = null;
	                }
	                else {
	                    button.label = "关闭高斯模糊";
	                    this.camera.postProcess = this.postProcess;
	                }
	            });
	        }));
	    }
	}

	new PostProcess_Blur();

}(Laya));
