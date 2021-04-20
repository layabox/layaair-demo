window.Laya=window.Laya||{};

(function (exports, Laya) {
	'use strict';

	var FullScreenVert = "#if defined(GL_FRAGMENT_PRECISION_HIGH)\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n\r\n#define SHADER_NAME SCREENVS\r\n\r\n#include \"Lighting.glsl\";\r\n\r\nattribute vec4 a_PositionTexcoord;\r\nuniform vec4 u_OffsetScale;\r\nvarying vec2 v_Texcoord0;\r\n\r\nvoid main() {\t\r\n\tgl_Position = vec4(u_OffsetScale.x*2.0-1.0+(a_PositionTexcoord.x+1.0)*u_OffsetScale.z,(1.0-((u_OffsetScale.y*2.0-1.0+(-a_PositionTexcoord.y+1.0)*u_OffsetScale.w)+1.0)/2.0)*2.0-1.0, 0.0, 1.0);\t\r\n\tv_Texcoord0 = a_PositionTexcoord.zw;\r\n\tgl_Position = remapGLPositionZ(gl_Position);\r\n}\r\n";

	var CoCFS = "#if defined(GL_FRAGMENT_PRECISION_HIGH)\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n\r\n#define SHADER_NAME COCFS\r\n\r\nuniform sampler2D u_MainTex;\r\nuniform vec4 u_ZBufferParams;\r\nuniform vec3 u_CoCParams;\r\n\r\n#ifdef CAMERA_NORMALDEPTH\r\n    uniform sampler2D u_CameraDepthNormalTexture;\r\n#else\r\n    uniform sampler2D u_CameraDepthTexture;\r\n#endif\r\n\r\n\r\nvarying vec2 v_Texcoord0;\r\n\r\n// Z buffer to linear 0..1 depth\r\nfloat Linear01Depth(float z,vec4 zbufferParams)\r\n{\r\n    return 1.0 / (zbufferParams.x * z + zbufferParams.y);\r\n}\r\n\r\n// Z buffer to linear depth\r\nfloat LinearEyeDepth(float z,vec4 zbufferParams)\r\n{\r\n    return 1.0 / (zbufferParams.z * z + zbufferParams.w);\r\n}\r\n\r\nfloat DecodeFloatRG(vec2 enc )\r\n{\r\n    vec2 kDecodeDot = vec2(1.0, 1.0/255.0);\r\n    return dot( enc, kDecodeDot );\r\n}\r\n\r\nvoid DecodeDepthNormal(vec4 enc, out float depth)\r\n{\r\n    depth = DecodeFloatRG (enc.zw);\r\n}\r\n\r\nvoid main() {\r\n\r\n    #ifdef CAMERA_NORMALDEPTH\r\n        vec4 depthNormal = texture2D(u_CameraDepthNormalTexture, v_Texcoord0);\r\n        float depth = 0.0;\r\n        DecodeDepthNormal(depthNormal, depth);\r\n        depth = ((1.0 / depth) - u_ZBufferParams.y) * (1.0 / u_ZBufferParams.x);\r\n    #else\r\n        float depth = texture2D(u_CameraDepthTexture, v_Texcoord0).x;\r\n    #endif\r\n\r\n    depth = LinearEyeDepth(depth, u_ZBufferParams);\r\n    float farStart = u_CoCParams.x;\r\n    float farEnd = u_CoCParams.y;\r\n\r\n    float coc = (depth - farStart) / (farEnd - farStart);\r\n    coc = clamp(coc, 0.0, 1.0);\r\n    gl_FragColor = vec4(coc, coc, coc, 1.0);\r\n}\r\n";

	var PrefilterFS = "#if defined(GL_FRAGMENT_PRECISION_HIGH)\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n\r\n#define SHADER_NAME PrefilterFS\r\n\r\nuniform sampler2D u_MainTex;\r\nuniform sampler2D u_FullCoCTex;\r\nuniform vec4 u_MainTex_TexelSize;\r\n\r\nvarying vec2 v_Texcoord0;\r\n\r\nconst int kCount = 5;\r\nvec2 kTaps[5];\r\n\r\nvoid main () {\r\n\r\n    kTaps[0] = vec2( 0.0,  0.0);\r\n    kTaps[1] = vec2( 0.9, -0.4);\r\n    kTaps[2] = vec2(-0.9,  0.4);\r\n    kTaps[3] = vec2( 0.4,  0.9);\r\n    kTaps[4] = vec2(-0.4, -0.9);\r\n\r\n    vec3 colorAcc = vec3(0.0);\r\n    float farCoCAcc = 0.0;\r\n    for (int i = 0; i < kCount; i++) {\r\n        vec2 uv = u_MainTex_TexelSize.xy * kTaps[i] + v_Texcoord0;\r\n        vec3 tapColor = texture2D(u_MainTex, uv).rgb;\r\n        float coc = texture2D(u_FullCoCTex, uv).r;\r\n\r\n        colorAcc += tapColor * coc;\r\n        farCoCAcc += coc;\r\n    }\r\n    vec3 color = colorAcc * (1.0 / float(kCount));\r\n    float farCoC = farCoCAcc * (1.0 / float(kCount));\r\n\r\n    // float farCoC = texture2D(u_FullCoCTex, v_Texcoord0).x;\r\n    // vec3 color = texture2D(u_MainTex, v_Texcoord0).rgb;\r\n    // color *= farCoC;\r\n\r\n    gl_FragColor = vec4(color, farCoC);\r\n}";

	var BlurVFS = "#if defined(GL_FRAGMENT_PRECISION_HIGH)\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n\r\n#define SHADER_NAME BlurVFS\r\n\r\nuniform sampler2D u_MainTex;\r\n\r\nuniform vec4 u_SourceSize;\r\nuniform vec4 u_DownSampleScale;\r\nuniform vec3 u_CoCParams;\r\n\r\nvarying vec2 v_Texcoord0;\r\n\r\n// todo 3 & 5\r\nconst int kTapCount = 3;\r\nfloat kOffsets[3];\r\nfloat kCoeffs[3];\r\n\r\n\r\nvec4 Blur(vec2 dir, float premultiply) {\r\n\r\n    kOffsets[0] = -1.33333333;\r\n    kOffsets[1] = 0.00000000;\r\n    kOffsets[2] = 1.33333333;\r\n\r\n    kCoeffs[0] = 0.35294118;\r\n    kCoeffs[1] = 0.29411765;\r\n    kCoeffs[2] = 0.3529411;\r\n\r\n    vec2 uv = v_Texcoord0;\r\n    // ivec2 positionSS = ivec2(u_SourceSize.xy * uv);\r\n\r\n    vec4 halfColor = texture2D(u_MainTex, uv);\r\n    float samp0CoC = halfColor.a;\r\n\r\n    float maxRadius = u_CoCParams.z;\r\n    vec2 offset = u_SourceSize.zw * dir * samp0CoC * maxRadius;\r\n\r\n    vec4 acc = vec4(0.0);\r\n\r\n    for (int i = 0; i < kTapCount; i++) {\r\n        vec2 sampCoord = uv + kOffsets[i] * offset;\r\n        vec4 samp = texture2D(u_MainTex, sampCoord);\r\n        float sampCoC = samp.w;\r\n        vec3 sampColor = samp.xyz;\r\n\r\n        float weight = clamp(1.0 - (samp0CoC - sampCoC), 0.0, 1.0);\r\n        acc += vec4(sampColor, 1.0) * kCoeffs[i] * weight;\r\n    }\r\n\r\n    acc.xyz /= acc.w + 1e-4;\r\n    return vec4(acc.xyz, 1.0);\r\n}\r\n\r\nvoid main() {\r\n    gl_FragColor = Blur(vec2(0.0, 1.0), 0.0);\r\n    // gl_FragColor = texture2D(u_MainTex, v_Texcoord0);\r\n}\r\n";

	var BlurHFS = "#if defined(GL_FRAGMENT_PRECISION_HIGH)\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n\r\n#define SHADER_NAME BlurHFS\r\n\r\nuniform sampler2D u_MainTex;\r\n\r\nuniform vec4 u_SourceSize;\r\nuniform vec4 u_DownSampleScale;\r\nuniform vec3 u_CoCParams;\r\n\r\nvarying vec2 v_Texcoord0;\r\n\r\nconst int kTapCount = 3;\r\nfloat kOffsets[3];\r\nfloat kCoeffs[3];\r\n\r\nvec4 Blur(vec2 dir, float premultiply) {\r\n\r\n    kOffsets[0] = -1.33333333;\r\n    kOffsets[1] = 0.00000000;\r\n    kOffsets[2] = 1.33333333;\r\n\r\n    kCoeffs[0] = 0.35294118;\r\n    kCoeffs[1] = 0.29411765;\r\n    kCoeffs[2] = 0.3529411;\r\n\r\n    vec2 uv = v_Texcoord0;\r\n    // ivec2 positionSS = ivec2(u_SourceSize.xy * uv);\r\n\r\n    vec4 halfColor = texture2D(u_MainTex, uv);\r\n    float samp0CoC = halfColor.a;\r\n\r\n    float maxRadius = u_CoCParams.z;\r\n    vec2 offset = u_SourceSize.zw  * dir * samp0CoC * maxRadius;\r\n\r\n    vec4 acc = vec4(0.0);\r\n\r\n    for (int i = 0; i < kTapCount; i++) {\r\n        vec2 sampCoord = uv + kOffsets[i] * offset;\r\n        vec4 samp = texture2D(u_MainTex, sampCoord);\r\n        float sampCoC = samp.a;\r\n        vec3 sampColor = samp.rgb;\r\n\r\n        float weight = clamp(1.0 - (samp0CoC - sampCoC), 0.0, 1.0);\r\n        acc += vec4(sampColor, sampCoC) * kCoeffs[i] * weight;\r\n    }\r\n\r\n    acc.xyz /= acc.w + 1e-4;\r\n    return vec4(acc.xyz, samp0CoC);\r\n}\r\n\r\nvoid main() {\r\n    gl_FragColor = Blur(vec2(1.0, 0.0), 1.0);\r\n}";

	var CompositeFS = "#if defined(GL_FRAGMENT_PRECISION_HIGH)\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n\r\nuniform sampler2D u_MainTex;\r\nuniform sampler2D u_BlurCoCTex;\r\nuniform sampler2D u_FullCoCTex;\r\n\r\nvarying vec2 v_Texcoord0;\r\n\r\nvoid main() {\r\n\r\n    vec3 baseColor = texture2D(u_MainTex, v_Texcoord0).rgb;\r\n    vec4 samplevalue = texture2D(u_BlurCoCTex, v_Texcoord0);\r\n    vec3 farColor = samplevalue.rgb;\r\n    float coc = texture2D(u_FullCoCTex, v_Texcoord0).r;\r\n\r\n    vec3 dstColor = vec3(0.0);\r\n    float dstAlpha = 1.0;\r\n\r\n    float blend = sqrt(coc * 3.14 * 2.0);\r\n    dstColor = farColor * clamp(blend, 0.0, 1.0);\r\n    dstAlpha = clamp(1.0 - blend, 0.0, 1.0);\r\n\r\n\r\n    gl_FragColor = vec4(baseColor * dstAlpha + dstColor, 1.0);\r\n\r\n}";

	class GaussianDoF extends Laya.PostProcessEffect {
	    constructor() {
	        GaussianDoF.__init__();
	        super();
	        this._shader = Laya.Shader3D.find("GaussianDoF");
	        this._shaderData = new Laya.ShaderData();
	        this._shaderData.setVector3(GaussianDoF.COCPARAMS, new Laya.Vector3(10, 30, 1));
	        this._zBufferParams = new Laya.Vector4();
	        this._sourceSize = new Laya.Vector4();
	        this._dowmSampleScale = new Laya.Vector4();
	    }
	    static __init__() {
	        GaussianDoF.SHADERDEFINE_DEPTHNORMALTEXTURE = Laya.Shader3D.getDefineByName("CAMERA_NORMALDEPTH");
	        let attributeMap = {
	            'a_PositionTexcoord': Laya.VertexMesh.MESH_POSITION0
	        };
	        let uniformMap = {
	            'u_MainTex': Laya.Shader3D.PERIOD_MATERIAL,
	            'u_OffsetScale': Laya.Shader3D.PERIOD_MATERIAL,
	            'u_ZBufferParams': Laya.Shader3D.PERIOD_MATERIAL,
	            'u_CoCParams': Laya.Shader3D.PERIOD_MATERIAL,
	            'u_CameraDepthTexture': Laya.Shader3D.PERIOD_MATERIAL,
	            'u_CameraDepthNormalTexture': Laya.Shader3D.PERIOD_MATERIAL,
	            'u_FullCoCTex': Laya.Shader3D.PERIOD_MATERIAL,
	            'u_SourceSize': Laya.Shader3D.PERIOD_MATERIAL,
	            'u_DownSampleScale': Laya.Shader3D.PERIOD_MATERIAL,
	            'u_BlurCoCTex': Laya.Shader3D.PERIOD_MATERIAL,
	            'u_MainTex_TexelSize': Laya.Shader3D.PERIOD_MATERIAL,
	        };
	        let shader = Laya.Shader3D.add("GaussianDoF");
	        let cocSubShader = new Laya.SubShader(attributeMap, uniformMap);
	        shader.addSubShader(cocSubShader);
	        let cocPass = cocSubShader.addShaderPass(FullScreenVert, CoCFS);
	        let prefilterSubShader = new Laya.SubShader(attributeMap, uniformMap);
	        shader.addSubShader(prefilterSubShader);
	        let prefilterPass = prefilterSubShader.addShaderPass(FullScreenVert, PrefilterFS);
	        let blurHSubShader = new Laya.SubShader(attributeMap, uniformMap);
	        shader.addSubShader(blurHSubShader);
	        let blurHPass = blurHSubShader.addShaderPass(FullScreenVert, BlurHFS);
	        let blurVSubShader = new Laya.SubShader(attributeMap, uniformMap);
	        shader.addSubShader(blurVSubShader);
	        let blurVPass = blurVSubShader.addShaderPass(FullScreenVert, BlurVFS);
	        let compositeSubShader = new Laya.SubShader(attributeMap, uniformMap);
	        shader.addSubShader(compositeSubShader);
	        let compositePass = compositeSubShader.addShaderPass(FullScreenVert, CompositeFS);
	    }
	    set farStart(value) {
	        let cocParams = this._shaderData.getVector3(GaussianDoF.COCPARAMS);
	        cocParams.x = value;
	        this._shaderData.setVector3(GaussianDoF.COCPARAMS, cocParams);
	    }
	    get farStart() {
	        return this._shaderData.getVector3(GaussianDoF.COCPARAMS).x;
	    }
	    set farEnd(value) {
	        let cocParams = this._shaderData.getVector3(GaussianDoF.COCPARAMS);
	        cocParams.y = Math.max(cocParams.x, value);
	        this._shaderData.setVector3(GaussianDoF.COCPARAMS, cocParams);
	    }
	    get farEnd() {
	        return this._shaderData.getVector3(GaussianDoF.COCPARAMS).y;
	    }
	    set maxRadius(value) {
	        let cocParams = this._shaderData.getVector3(GaussianDoF.COCPARAMS);
	        cocParams.z = Math.min(value, 2);
	        this._shaderData.setVector3(GaussianDoF.COCPARAMS, cocParams);
	    }
	    get maxRadius() {
	        return this._shaderData.getVector3(GaussianDoF.COCPARAMS).z;
	    }
	    setupShaderValue(context) {
	        let camera = context.camera;
	        let source = context.source;
	        this._dowmSampleScale.setValue(0.5, 0.5, 2.0, 2.0);
	        this._shaderData.setVector(GaussianDoF.DOWNSAMPLESCALE, this._dowmSampleScale);
	        let far = camera.farPlane;
	        let near = camera.nearPlane;
	        this._zBufferParams.setValue(1.0 - far / near, far / near, (near - far) / (near * far), 1 / near);
	        this._shaderData.setVector(GaussianDoF.ZBUFFERPARAMS, this._zBufferParams);
	        if (camera.depthTextureMode & Laya.DepthTextureMode.Depth) {
	            let depthTexture = camera.depthTexture;
	            this._shaderData.setTexture(GaussianDoF.DEPTHTEXTURE, depthTexture);
	            this._shaderData.removeDefine(GaussianDoF.SHADERDEFINE_DEPTHNORMALTEXTURE);
	        }
	        else if (camera.depthTextureMode & Laya.DepthTextureMode.DepthNormals) {
	            let depthNormalTexture = camera.depthNormalTexture;
	            this._shaderData.setTexture(GaussianDoF.NORMALDEPTHTEXTURE, depthNormalTexture);
	            this._shaderData.addDefine(GaussianDoF.SHADERDEFINE_DEPTHNORMALTEXTURE);
	        }
	        else {
	            camera.depthTextureMode |= Laya.DepthTextureMode.Depth;
	        }
	    }
	    render(context) {
	        let cmd = context.command;
	        let viewport = context.camera.viewport;
	        let camera = context.camera;
	        this.setupShaderValue(context);
	        let source = context.source;
	        let shader = this._shader;
	        let shaderData = this._shaderData;
	        let dataTexFormat = Laya.RenderTextureFormat.R16G16B16A16;
	        let fullCoC = Laya.RenderTexture.createFromPool(source.width, source.height, dataTexFormat, Laya.RenderTextureDepthFormat.DEPTHSTENCIL_NONE, 1);
	        cmd.blitScreenTriangle(source, fullCoC, null, shader, shaderData, 0);
	        fullCoC.filterMode = Laya.FilterMode.Bilinear;
	        this._shaderData.setTexture(GaussianDoF.FULLCOCTEXTURE, fullCoC);
	        let prefilterTex = Laya.RenderTexture.createFromPool(source.width / 2, source.height / 2, dataTexFormat, Laya.RenderTextureDepthFormat.DEPTHSTENCIL_NONE, 1);
	        cmd.blitScreenTriangle(source, prefilterTex, null, shader, shaderData, 1);
	        prefilterTex.filterMode = Laya.FilterMode.Bilinear;
	        this._sourceSize.setValue(prefilterTex.width, prefilterTex.height, 1.0 / prefilterTex.width, 1.0 / prefilterTex.height);
	        this._shaderData.setValueData(GaussianDoF.SOURCESIZE, this._sourceSize);
	        let blurHTex = Laya.RenderTexture.createFromPool(prefilterTex.width, prefilterTex.height, dataTexFormat, Laya.RenderTextureDepthFormat.DEPTHSTENCIL_NONE, 1);
	        cmd.blitScreenTriangle(prefilterTex, blurHTex, null, this._shader, this._shaderData, 2);
	        let blurVTex = Laya.RenderTexture.createFromPool(prefilterTex.width, prefilterTex.height, dataTexFormat, Laya.RenderTextureDepthFormat.DEPTHSTENCIL_NONE, 1);
	        cmd.blitScreenTriangle(blurHTex, blurVTex, null, this._shader, this._shaderData, 3);
	        blurVTex.filterMode = Laya.FilterMode.Bilinear;
	        blurVTex.anisoLevel = 1;
	        fullCoC.filterMode = Laya.FilterMode.Point;
	        this._shaderData.setTexture(GaussianDoF.BLURCOCTEXTURE, blurVTex);
	        let finalTex = Laya.RenderTexture.createFromPool(source.width, source.height, source.format, source.depthStencilFormat, 1);
	        cmd.blitScreenTriangle(source, finalTex, null, this._shader, this._shaderData, 4);
	        context.source = finalTex;
	        Laya.RenderTexture.recoverToPool(fullCoC);
	        Laya.RenderTexture.recoverToPool(prefilterTex);
	        Laya.RenderTexture.recoverToPool(blurHTex);
	        Laya.RenderTexture.recoverToPool(blurVTex);
	        context.deferredReleaseTextures.push(finalTex);
	    }
	}
	GaussianDoF.SOURCESIZE = Laya.Shader3D.propertyNameToID("u_SourceSize");
	GaussianDoF.ZBUFFERPARAMS = Laya.Shader3D.propertyNameToID("u_ZBufferParams");
	GaussianDoF.COCPARAMS = Laya.Shader3D.propertyNameToID("u_CoCParams");
	GaussianDoF.DEPTHTEXTURE = Laya.Shader3D.propertyNameToID("u_CameraDepthTexture");
	GaussianDoF.NORMALDEPTHTEXTURE = Laya.Shader3D.propertyNameToID("u_CameraDepthNormalTexture");
	GaussianDoF.FULLCOCTEXTURE = Laya.Shader3D.propertyNameToID("u_FullCoCTex");
	GaussianDoF.DOWNSAMPLESCALE = Laya.Shader3D.propertyNameToID("u_DownSampleScale");
	GaussianDoF.BLURCOCTEXTURE = Laya.Shader3D.propertyNameToID("u_BlurCoCTex");

	class PostProcess_DoF {
	    constructor() {
	        Laya.Laya3D.init(0, 0);
	        Laya.Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
	        Laya.Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
	        Laya.Stat.show();
	        Laya.Shader3D.debugMode = true;
	        Laya.Laya.loader.create("res/threeDimen/LayaScene_zhuandibanben/Conventional/zhuandibanben.ls", Laya.Handler.create(this, this.onComplate));
	    }
	    onComplate() {
	        let scene = this.scene = Laya.Loader.getRes("res/threeDimen/LayaScene_zhuandibanben/Conventional/zhuandibanben.ls");
	        Laya.Laya.stage.addChild(scene);
	        let camera = this.camera = scene.getChildByName("MainCamera");
	        let mainCamera = scene.getChildByName("BlurCamera");
	        mainCamera.removeSelf();
	        camera.depthTextureMode |= Laya.DepthTextureMode.Depth;
	        let postProcess = new Laya.PostProcess();
	        camera.postProcess = postProcess;
	        let gaussianDoF = new GaussianDoF();
	        console.log(gaussianDoF);
	        postProcess.addEffect(gaussianDoF);
	        gaussianDoF.farStart = 1;
	        gaussianDoF.farEnd = 5;
	        gaussianDoF.maxRadius = 1.0;
	    }
	}
	new PostProcess_DoF();

	exports.PostProcess_DoF = PostProcess_DoF;

}(this.Laya = this.Laya || {}, Laya));
