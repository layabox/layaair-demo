
    var GlassShaderVS = "#if defined(GL_FRAGMENT_PRECISION_HIGH)// 原来的写法会被我们自己的解析流程处理，而我们的解析是不认内置宏的，导致被删掉，所以改成 if defined 了\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n#include \"Lighting.glsl\";\r\n\r\nattribute vec4 a_Position;\r\n\r\nattribute vec2 a_Texcoord0;\r\nuniform mat4 u_MvpMatrix;\r\n\r\nvarying vec2 v_Texcoord0;\r\nuniform vec4 u_TilingOffset;\r\nvarying vec2 v_ScreenTexcoord;\r\n\r\nvoid main() {\r\n\tvec4 position;\r\n\tposition=a_Position;\r\n\tgl_Position = u_MvpMatrix * position;\r\n\tv_Texcoord0=TransformUV(a_Texcoord0,u_TilingOffset);\r\n\tgl_Position=remapGLPositionZ(gl_Position);\r\n\tv_ScreenTexcoord =vec2((gl_Position.x/gl_Position.w+1.0)*0.5, (gl_Position.y/gl_Position.w+1.0)*0.5);\r\n}";

	var GlassShaderFS = "#if defined(GL_FRAGMENT_PRECISION_HIGH)// 原来的写法会被我们自己的解析流程处理，而我们的解析是不认内置宏的，导致被删掉，所以改成 if defined 了\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n\r\nuniform sampler2D u_tintTexure;\r\nuniform sampler2D u_screenTexture;\r\nvarying vec2 v_Texcoord0;\r\nuniform float u_tintAmount;\r\nvarying vec2 v_ScreenTexcoord;\r\n\r\nvoid main()\r\n{\r\n\tvec4 color;\r\n\tcolor =mix(texture2D(u_screenTexture,v_ScreenTexcoord),texture2D(u_tintTexure, v_Texcoord0),0.5);\r\n\r\n\tgl_FragColor = color;\r\n}\r\n\r\n";

	class GlassWithoutGrabMaterail extends Laya.Material {
	    constructor(texture) {
	        super();
	        this.setShaderName("GlassShader");
	        this.renderModeSet();
	        this._shaderValues.setVector(GlassWithoutGrabMaterail.TILINGOFFSET, new Laya.Vector4(1, 1, 0, 0));
	        this._shaderValues.setTexture(GlassWithoutGrabMaterail.TINTTEXTURE, texture);
	    }
	    static init() {
	        var attributeMap = {
	            'a_Position': Laya.VertexMesh.MESH_POSITION0,
	            'a_Normal': Laya.VertexMesh.MESH_NORMAL0,
	            'a_Texcoord0': Laya.VertexMesh.MESH_TEXTURECOORDINATE0,
	            'a_Tangent0': Laya.VertexMesh.MESH_TANGENT0,
	        };
	        var uniformMap = {
	            'u_tintTexure': Laya.Shader3D.PERIOD_MATERIAL,
	            'u_normalTexture': Laya.Shader3D.PERIOD_MATERIAL,
	            'u_tintAmount': Laya.Shader3D.PERIOD_MATERIAL,
	            'u_TilingOffset': Laya.Shader3D.PERIOD_MATERIAL,
	            'u_MvpMatrix': Laya.Shader3D.PERIOD_SPRITE
	        };
	        var stateMap = {
	            's_Cull': Laya.Shader3D.RENDER_STATE_CULL,
	            's_Blend': Laya.Shader3D.RENDER_STATE_BLEND,
	            's_BlendSrc': Laya.Shader3D.RENDER_STATE_BLEND_SRC,
	            's_BlendDst': Laya.Shader3D.RENDER_STATE_BLEND_DST,
	            's_DepthTest': Laya.Shader3D.RENDER_STATE_DEPTH_TEST,
	            's_DepthWrite': Laya.Shader3D.RENDER_STATE_DEPTH_WRITE
	        };
	        var shader = Laya.Shader3D.add("GlassShader", null, null, false);
	        var subShader = new Laya.SubShader(attributeMap, uniformMap);
	        shader.addSubShader(subShader);
	        subShader.addShaderPass(GlassShaderVS, GlassShaderFS, stateMap, "Forward");
	    }
	    get depthWrite() {
	        return this._shaderValues.getBool(GlassWithoutGrabMaterail.DEPTH_WRITE);
	    }
	    set depthWrite(value) {
	        this._shaderValues.setBool(GlassWithoutGrabMaterail.DEPTH_WRITE, value);
	    }
	    get cull() {
	        return this._shaderValues.getInt(GlassWithoutGrabMaterail.CULL);
	    }
	    set cull(value) {
	        this._shaderValues.setInt(GlassWithoutGrabMaterail.CULL, value);
	    }
	    get blend() {
	        return this._shaderValues.getInt(GlassWithoutGrabMaterail.BLEND);
	    }
	    set blend(value) {
	        this._shaderValues.setInt(GlassWithoutGrabMaterail.BLEND, value);
	    }
	    get blendSrc() {
	        return this._shaderValues.getInt(GlassWithoutGrabMaterail.BLEND_SRC);
	    }
	    set blendSrc(value) {
	        this._shaderValues.setInt(GlassWithoutGrabMaterail.BLEND_SRC, value);
	    }
	    get blendDst() {
	        return this._shaderValues.getInt(GlassWithoutGrabMaterail.BLEND_DST);
	    }
	    set blendDst(value) {
	        this._shaderValues.setInt(GlassWithoutGrabMaterail.BLEND_DST, value);
	    }
	    get depthTest() {
	        return this._shaderValues.getInt(GlassWithoutGrabMaterail.DEPTH_TEST);
	    }
	    set depthTest(value) {
	        this._shaderValues.setInt(GlassWithoutGrabMaterail.DEPTH_TEST, value);
	    }
	    renderModeSet() {
	        this.alphaTest = false;
	        this.renderQueue = Laya.Material.RENDERQUEUE_TRANSPARENT;
	        this.depthWrite = true;
	        this.cull = Laya.RenderState.CULL_BACK;
	        this.blend = Laya.RenderState.BLEND_DISABLE;
	        this.depthTest = Laya.RenderState.DEPTHTEST_LESS;
	    }
	}
	GlassWithoutGrabMaterail.CULL = Laya.Shader3D.propertyNameToID("s_Cull");
	GlassWithoutGrabMaterail.BLEND = Laya.Shader3D.propertyNameToID("s_Blend");
	GlassWithoutGrabMaterail.BLEND_SRC = Laya.Shader3D.propertyNameToID("s_BlendSrc");
	GlassWithoutGrabMaterail.BLEND_DST = Laya.Shader3D.propertyNameToID("s_BlendDst");
	GlassWithoutGrabMaterail.DEPTH_TEST = Laya.Shader3D.propertyNameToID("s_DepthTest");
	GlassWithoutGrabMaterail.DEPTH_WRITE = Laya.Shader3D.propertyNameToID("s_DepthWrite");
	GlassWithoutGrabMaterail.TINTTEXTURE = Laya.Shader3D.propertyNameToID("u_tintTexure");
	GlassWithoutGrabMaterail.NORMALTEXTURE = Laya.Shader3D.propertyNameToID("u_normalTexture");
	GlassWithoutGrabMaterail.TILINGOFFSET = Laya.Shader3D.propertyNameToID("u_TilingOffset");
	GlassWithoutGrabMaterail.ALBEDOCOLOR = Laya.Shader3D.propertyNameToID("u_tintAmount");

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

	class CommandBuffer_BlurryGlass {
	    constructor() {
	        Laya.Laya3D.init(100, 100);
	        Laya.Stat.show();
	        Laya.Shader3D.debugMode = true;
	        Laya.Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
	        Laya.Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
	        BlurEffect.init();
	        GlassWithoutGrabMaterail.init();
	        Laya.Scene3D.load("res/threeDimen/BlurryRefraction/Conventional/BlurryGlass.ls", Laya.Handler.create(this, function (scene) {
	            Laya.Laya.stage.addChild(scene);
	            var camera = scene.getChildByName("Main Camera");
	            camera.addComponent(CameraMoveScript);
	            var glass01 = scene.getChildByName("glass01");
	            var glass02 = scene.getChildByName("glass02");
	            var pbrStandard = glass01.meshRenderer.sharedMaterial;
	            var glassMaterial = new GlassWithoutGrabMaterail(pbrStandard.albedoTexture);
	            glass01.meshRenderer.sharedMaterial = glassMaterial;
	            glass02.meshRenderer.sharedMaterial = glassMaterial;
	            this.mat = glassMaterial;
	            this.createCommandBuffer(camera);
	        }));
	    }
	    createCommandBuffer(camera) {
	        camera.enableBuiltInRenderTexture = true;
	        var buf = new Laya.CommandBuffer();
	        var viewPort = camera.viewport;
	        var renderTexture = Laya.RenderTexture.createFromPool(viewPort.width, viewPort.height, Laya.RenderTextureFormat.R8G8B8, Laya.RenderTextureDepthFormat.DEPTHSTENCIL_NONE);
	        this.texture = renderTexture;
	        buf.blitScreenTriangle(null, renderTexture);
	        var shader = Laya.Shader3D.find("blurEffect");
	        var shaderValue = new Laya.ShaderData();
	        var downSampleFactor = 4;
	        var downSampleWidth = viewPort.width / downSampleFactor;
	        var downSampleheigh = viewPort.height / downSampleFactor;
	        var texSize = new Laya.Vector4(1.0 / viewPort.width, 1.0 / viewPort.height, viewPort.width, downSampleheigh);
	        shaderValue.setNumber(BlurEffect.SHADERVALUE_DOWNSAMPLEVALUE, 1);
	        shaderValue.setVector(BlurEffect.SHADERVALUE_TEXELSIZE, texSize);
	        var downRenderTexture = Laya.RenderTexture.createFromPool(downSampleWidth, downSampleheigh, Laya.RenderTextureFormat.R8G8B8, Laya.RenderTextureDepthFormat.DEPTHSTENCIL_NONE);
	        buf.blitScreenTriangle(renderTexture, downRenderTexture, null, shader, shaderValue, 0);
	        var blurTexture = Laya.RenderTexture.createFromPool(downSampleWidth, downSampleheigh, Laya.RenderTextureFormat.R8G8B8, Laya.RenderTextureDepthFormat.DEPTHSTENCIL_NONE);
	        blurTexture.filterMode = Laya.FilterMode.Bilinear;
	        buf.blitScreenTriangle(downRenderTexture, blurTexture, null, shader, shaderValue, 1);
	        buf.blitScreenTriangle(blurTexture, downRenderTexture, null, shader, shaderValue, 2);
	        buf.blitScreenTriangle(downRenderTexture, blurTexture, null, shader, shaderValue, 1);
	        buf.blitScreenTriangle(blurTexture, downRenderTexture, null, shader, shaderValue, 2);
	        var globalUniformNameID = Laya.Shader3D.propertyNameToID("u_screenTexture");
	        buf.setGlobalTexture(globalUniformNameID, downRenderTexture);
	        camera.addCommandBuffer(Laya.CameraEventFlags.BeforeTransparent, buf);
	        Laya.RenderTexture.recoverToPool(downRenderTexture);
	        Laya.RenderTexture.recoverToPool(blurTexture);
	        return;
	    }
	}

	new CommandBuffer_BlurryGlass;

