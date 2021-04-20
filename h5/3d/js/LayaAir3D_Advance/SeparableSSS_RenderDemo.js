window.Laya=window.Laya||{};

(function (exports, Laya) {
    'use strict';

    var SeprableSSSFS = "#if defined(GL_FRAGMENT_PRECISION_HIGH)// 原来的写法会被我们自己的解析流程处理，而我们的解析是不认内置宏的，导致被删掉，所以改成 if defined 了\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n\r\n//#if defined(SAMPLE_HIGH)\r\n    const int StepRange = 3;\r\n    const int SamplerNum = 17;\r\n    uniform vec4 u_kernel[SamplerNum];\r\n//#else\r\n//    const int StepRange = 2;\r\n//    const int SamplerNum = 7;\r\n//    uniform vec4 u_kernel[samplerNum];\r\n//#endif\r\n\r\n//DiffuseBuffer\r\nuniform sampler2D u_MainTex;\r\n//深度贴图\r\nuniform sampler2D u_depthTex;\r\n//uv\r\nvarying vec2 v_Texcoord0;\r\n//sss宽度\r\nuniform float u_sssWidth;\r\n//模糊方向 0，1 或者1，0\r\nuniform vec2 u_blurDir;\r\n\r\n//float distanceToProjectionWindow = 1.0 / tan(0.5 * radians(SSSS_FOVY));\r\nuniform float u_distanceToProjectionWindow;\r\n\r\n\r\nvec4 Sample17Nums(vec2 finalStep,vec4 colorBlurred,float depthM,vec4 colorM){\r\n      for (int i = 1; i < SamplerNum; i++) {\r\n        // Fetch color and depth for current sample:\r\n        vec2 offset = v_Texcoord0 + u_kernel[i].a * finalStep;\r\n        vec4 color = texture2D(u_MainTex, offset);\r\n\r\n            // // If the difference in depth is huge, we lerp color back to \"colorM\"://深度差异过大 我们把颜色还原为原色\r\n             float depth = texture2D(u_depthTex, offset).r;\r\n             float s = clamp(300.0 * abs(depthM - depth),0.0,1.0);\r\n            color.rgb = mix(color.rgb, colorM.rgb, s);\r\n\r\n        // Accumulate:\r\n        colorBlurred.rgb += u_kernel[i].rgb * color.rgb;\r\n       \r\n    }\r\n     return colorBlurred;\r\n}\r\n\r\n\r\nvoid main()\r\n{\r\n    vec4 colorM = texture2D(u_MainTex,v_Texcoord0);\r\n\r\n    //   if (initStencil) // (Checked in compile time, it's optimized away)如果模具缓冲区不可用，请初始化该缓冲区：\r\n    //     if (SSSS_STREGTH_SOURCE == 0.0) discard;\r\n\r\n    float depthM = texture2D(u_depthTex,v_Texcoord0).r;\r\n    //计算随着depth的变化ssswidth的比例\r\n    float scale = u_distanceToProjectionWindow/depthM;\r\n    //计算像素采样步长\r\n    vec2 finalStep = u_sssWidth *scale* u_blurDir;\r\n    finalStep *=colorM.a* 0.2;\r\n\r\n    vec4 colorBlurred = colorM;\r\n\r\n    colorBlurred.rgb*=u_kernel[0].rgb;\r\n    colorBlurred = Sample17Nums(finalStep,colorBlurred,depthM,colorM);\r\n    //累计其他采样\r\n    //   for (int i = 1; i < SSSS_N_SAMPLES; i++) {\r\n    //     // Fetch color and depth for current sample:\r\n    //     float2 offset = texcoord + kernel[i].a * finalStep;\r\n    //     float4 color = SSSSSample(colorTex, offset);\r\n\r\n    //     #if SSSS_FOLLOW_SURFACE == 1\r\n    //     // If the difference in depth is huge, we lerp color back to \"colorM\":\r\n    //     float depth = SSSSSample(depthTex, offset).r;\r\n    //     float s = SSSSSaturate(300.0f * distanceToProjectionWindow *\r\n    //                            sssWidth * abs(depthM - depth));\r\n    //     color.rgb = SSSSLerp(color.rgb, colorM.rgb, s);\r\n    //     #endif\r\n\r\n    //     // Accumulate:\r\n    //     colorBlurred.rgb += kernel[i].rgb * color.rgb;\r\n    // }\r\n    gl_FragColor = colorBlurred;\r\n    // gl_FragColor = vec4(scale,scale,scale,1.0);\r\n}\r\n\r\n";

    var SeprableSSSVS = "#if defined(GL_FRAGMENT_PRECISION_HIGH)// 原来的写法会被我们自己的解析流程处理，而我们的解析是不认内置宏的，导致被删掉，所以改成 if defined 了\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n\r\n#include \"Lighting.glsl\";\r\n\r\nattribute vec4 a_PositionTexcoord;\r\nuniform vec4 u_OffsetScale;\r\nvarying vec2 v_Texcoord0;\r\n\r\nvoid main() {\t\r\n\tgl_Position = vec4(a_PositionTexcoord.xy, 0.0, 1.0);\r\n\tv_Texcoord0 = a_PositionTexcoord.zw;\r\n\tgl_Position = remapGLPositionZ(gl_Position);\r\n}";

    class SeparableSSS_BlitMaterial extends Laya.Material {
        constructor() {
            super();
            this.setShaderName("SeparableSSS");
            this._fallOff = new Laya.Vector3(1.0, 0.37, 0.3);
            this._strength = new Laya.Vector3(0.48, 0.41, 0.28);
            this._nSampler = 17;
            this.sssWidth = 0.0012;
            this.kenel = this.calculateKernel(this._nSampler, this._strength, this._fallOff);
        }
        static init() {
            var attributeMap = {
                'a_PositionTexcoord': Laya.VertexMesh.MESH_POSITION0
            };
            var uniformMap = {
                'u_MainTex': Laya.Shader3D.PERIOD_MATERIAL,
                'u_depthTex': Laya.Shader3D.PERIOD_MATERIAL,
                'u_blurDir': Laya.Shader3D.PERIOD_MATERIAL,
                'u_sssWidth': Laya.Shader3D.PERIOD_MATERIAL,
                'u_distanceToProjectionWindow': Laya.Shader3D.PERIOD_MATERIAL,
                'u_kernel': Laya.Shader3D.PERIOD_MATERIAL
            };
            var shader = Laya.Shader3D.add("SeparableSSS");
            var subShader = new Laya.SubShader(attributeMap, uniformMap);
            shader.addSubShader(subShader);
            var shaderpass = subShader.addShaderPass(SeprableSSSVS, SeprableSSSFS);
            var renderState = shaderpass.renderState;
            renderState = shaderpass.renderState;
            renderState.depthTest = Laya.RenderState.DEPTHTEST_ALWAYS;
            renderState.depthWrite = false;
            renderState.cull = Laya.RenderState.CULL_NONE;
            renderState.blend = Laya.RenderState.BLEND_DISABLE;
        }
        set colorTex(value) {
            this.shaderData.setTexture(SeparableSSS_BlitMaterial.SHADERVALUE_COLORTEX, value);
        }
        set blurDir(value) {
            this.shaderData.setVector2(SeparableSSS_BlitMaterial.SHADERVALUE_BLURDIR, value);
        }
        set depthTex(value) {
            this.shaderData.setTexture(SeparableSSS_BlitMaterial.SHADERVALUE_DEPTHTEX, value);
        }
        set sssWidth(value) {
            value = Math.max(value, 0);
            value = Math.min(value, 0.025);
            this.shaderData.setNumber(SeparableSSS_BlitMaterial.SHADERVALUE_SSSWIDTH, value);
        }
        set kenel(value) {
            let shaderval = new Float32Array(value.length * 4);
            for (let i = 0, n = value.length; i < n; i++) {
                let ind = i * 4;
                shaderval[ind] = value[i].x;
                shaderval[ind + 1] = value[i].y;
                shaderval[ind + 2] = value[i].z;
                shaderval[ind + 3] = value[i].w;
            }
            this.shaderData.setBuffer(SeparableSSS_BlitMaterial.SHADERVALUE_KENEL, shaderval);
        }
        set falloff(value) {
            Laya.Vector3.max(value, Laya.Vector3._ZERO, value);
            Laya.Vector3.min(value, Laya.Vector3._ONE, value);
            this._fallOff = value;
            this.kenel = this.calculateKernel(this._nSampler, this._fallOff, this._strength);
        }
        set strength(value) {
            Laya.Vector3.max(value, Laya.Vector3._ZERO, value);
            Laya.Vector3.min(value, Laya.Vector3._ONE, value);
            this._strength = value;
            this.kenel = this.calculateKernel(this._nSampler, this._fallOff, this._strength);
        }
        set nSamples(value) {
            this._nSampler = value;
            this.kenel = this.calculateKernel(this._nSampler, this._fallOff, this._strength);
        }
        set cameraFiledOfView(value) {
            let distanceToProject = 1.0 / Math.tan(0.5 * value * Laya.MathUtils3D.Deg2Rad);
            this._shaderValues.setNumber(SeparableSSS_BlitMaterial.SHADERVALUE_DISTANCETOPROJECTIONWINDOW, distanceToProject);
        }
        calculateKernel(nSamples, strength, falloff) {
            let range = nSamples > 20 ? 3.0 : 2.0;
            let exponent = 2.0;
            let Kernel = new Array(nSamples);
            let step = 2.0 * range / (nSamples - 1);
            for (let i = 0; i < nSamples; i++) {
                let o = -range + i * step;
                let sign = o < 0.0 ? -1.0 : 1.0;
                Kernel[i] = new Laya.Vector4();
                Kernel[i].w = range * sign * Math.abs(Math.pow(o, exponent)) / Math.pow(range, exponent);
            }
            for (let i = 0; i < nSamples; i++) {
                let w0 = i > 0 ? Math.abs(Kernel[i].w - Kernel[i - 1].w) : 0.0;
                let w1 = i < nSamples - 1 ? Math.abs(Kernel[i].w - Kernel[i + 1].w) : 0.0;
                let area = (w0 + w1) / 2.0;
                let t = this.prefile(Kernel[i].w, falloff);
                Laya.Vector3.scale(t, area, t);
                Kernel[i].x = t.x;
                Kernel[i].y = t.y;
                Kernel[i].z = t.z;
            }
            let t = Kernel[Math.floor(nSamples / 2)];
            for (var i = Math.floor(nSamples / 2); i > 0; i--) {
                Kernel[i] = Kernel[i - 1];
            }
            Kernel[0] = t;
            let sum = new Laya.Vector3(0.0, 0.0, 0.0);
            for (let i = 0; i < nSamples; i++) {
                sum.x += Kernel[i].x;
                sum.y += Kernel[i].y;
                sum.z += Kernel[i].z;
            }
            for (let i = 0; i < nSamples; i++) {
                Kernel[i].x /= sum.x;
                Kernel[i].y /= sum.y;
                Kernel[i].z /= sum.z;
            }
            Kernel[0].x = (1.0 - strength.x) + strength.x * Kernel[0].x;
            Kernel[0].y = (1.0 - strength.y) + strength.y * Kernel[0].y;
            Kernel[0].z = (1.0 - strength.z) + strength.z * Kernel[0].z;
            for (let i = 1; i < nSamples; i++) {
                Kernel[i].x *= strength.x;
                Kernel[i].y *= strength.y;
                Kernel[i].z *= strength.z;
            }
            return Kernel;
        }
        prefile(r, falloff) {
            let falloffArray = [falloff.x, falloff.y, falloff.z];
            let v1 = this.gaussian(0.0484, r, falloffArray);
            Laya.Vector3.scale(v1, 0.100, v1);
            let v2 = this.gaussian(0.187, r, falloffArray);
            Laya.Vector3.scale(v2, 0.118, v2);
            let v3 = this.gaussian(0.567, r, falloffArray);
            Laya.Vector3.scale(v3, 0.113, v3);
            let v4 = this.gaussian(1.99, r, falloffArray);
            Laya.Vector3.scale(v4, 0.358, v4);
            let v5 = this.gaussian(7.41, r, falloffArray);
            Laya.Vector3.scale(v5, 0.078, v5);
            let vec3 = new Laya.Vector3(v1.x + v2.x + v3.x + v4.x + v5.x, v1.y + v2.y + v3.y + v4.y + v5.y, v1.z + v2.z + v3.z + v4.z + v5.z);
            return vec3;
        }
        gaussian(variance, r, falloff) {
            let g = new Laya.Vector3();
            let gg = new Array();
            for (let i = 0; i < 3; i++) {
                let rr = r / (falloff[i] + 0.001);
                gg[i] = Math.exp((-(rr * rr)) / (2.0 * variance)) / (2.0 * 3.14 * variance);
            }
            g.setValue(gg[0], gg[1], gg[2]);
            return g;
        }
    }
    SeparableSSS_BlitMaterial.SHADERVALUE_COLORTEX = Laya.Shader3D.propertyNameToID("u_MainTex");
    SeparableSSS_BlitMaterial.SHADERVALUE_DEPTHTEX = Laya.Shader3D.propertyNameToID("u_depthTex");
    SeparableSSS_BlitMaterial.SHADERVALUE_BLURDIR = Laya.Shader3D.propertyNameToID("u_blurDir");
    SeparableSSS_BlitMaterial.SHADERVALUE_SSSWIDTH = Laya.Shader3D.propertyNameToID("u_sssWidth");
    SeparableSSS_BlitMaterial.SHADERVALUE_DISTANCETOPROJECTIONWINDOW = Laya.Shader3D.propertyNameToID("u_distanceToProjectionWindow");
    SeparableSSS_BlitMaterial.SHADERVALUE_KENEL = Laya.Shader3D.propertyNameToID("u_kernel");

    var SSSSRenderVS = "#if defined(GL_FRAGMENT_PRECISION_HIGH)// 原来的写法会被我们自己的解析流程处理，而我们的解析是不认内置宏的，导致被删掉，所以改成 if defined 了\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n#include \"Lighting.glsl\";\r\n\r\nattribute vec4 a_Position;\r\n\r\nattribute vec2 a_Texcoord0;\r\nuniform mat4 u_MvpMatrix;\r\n\r\nvarying vec2 v_Texcoord0;\r\nuniform vec4 u_TilingOffset;\r\nvarying vec2 v_ScreenTexcoord;\r\n\r\nvoid main() {\r\n\tvec4 position;\r\n\tposition=a_Position;\r\n\tgl_Position = u_MvpMatrix * position;\r\n\tv_Texcoord0=TransformUV(a_Texcoord0,u_TilingOffset);\r\n\tgl_Position=remapGLPositionZ(gl_Position);\r\n\tv_ScreenTexcoord =vec2((gl_Position.x/gl_Position.w+1.0)*0.5, (gl_Position.y/gl_Position.w+1.0)*0.5);\r\n}";

    var SSSSRenderFS = "#if defined(GL_FRAGMENT_PRECISION_HIGH)// 原来的写法会被我们自己的解析流程处理，而我们的解析是不认内置宏的，导致被删掉，所以改成 if defined 了\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n\r\nuniform sampler2D sssssDiffuseTexture;\r\nuniform sampler2D sssssSpecularTexture;\r\nvarying vec2 v_Texcoord0;\r\nvarying vec2 v_ScreenTexcoord;\r\n\r\nvoid main()\r\n{\r\n\tvec4 color;\r\n\tcolor =texture2D(sssssDiffuseTexture,v_ScreenTexcoord)+texture2D(sssssSpecularTexture, v_ScreenTexcoord);\r\n\r\n\tgl_FragColor = color;\r\n}\r\n\r\n";

    class SeparableSSSRenderMaterial extends Laya.Material {
        constructor() {
            super();
            this.setShaderName("SeparableRender");
            this.renderModeSet();
            this._shaderValues.setVector(SeparableSSSRenderMaterial.TILINGOFFSET, new Laya.Vector4(1, 1, 0, 0));
        }
        static init() {
            var attributeMap = {
                'a_Position': Laya.VertexMesh.MESH_POSITION0,
                'a_Normal': Laya.VertexMesh.MESH_NORMAL0,
                'a_Texcoord0': Laya.VertexMesh.MESH_TEXTURECOORDINATE0,
                'a_Tangent0': Laya.VertexMesh.MESH_TANGENT0,
            };
            var uniformMap = {
                'sssssDiffuseTexture': Laya.Shader3D.PERIOD_MATERIAL,
                'sssssSpecularTexture': Laya.Shader3D.PERIOD_MATERIAL,
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
            var shader = Laya.Shader3D.add("SeparableRender", null, null, false);
            var subShader = new Laya.SubShader(attributeMap, uniformMap);
            shader.addSubShader(subShader);
            subShader.addShaderPass(SSSSRenderVS, SSSSRenderFS, stateMap, "Forward");
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
    SeparableSSSRenderMaterial.SSSSDIFUSETEX = Laya.Shader3D.propertyNameToID("sssssDiffuseTexture");
    SeparableSSSRenderMaterial.SSSSSPECULARTEX = Laya.Shader3D.propertyNameToID("sssssSpecularTexture");
    SeparableSSSRenderMaterial.TILINGOFFSET = Laya.Shader3D.propertyNameToID("u_TilingOffset");

    class SeparableSSS_RenderDemo {
        constructor() {
            this.curStateIndex = 0;
            Laya.Laya3D.init(0, 0);
            Laya.Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
            Laya.Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
            Laya.Stat.show();
            Laya.Shader3D.debugMode = true;
            SeparableSSS_BlitMaterial.init();
            SeparableSSSRenderMaterial.init();
            this.sssssBlitMaterail = new SeparableSSS_BlitMaterial();
            this.sssssRenderMaterial = new SeparableSSSRenderMaterial();
            this.PreloadingRes();
        }
        PreloadingRes() {
            let resource = ["res/threeDimen/LayaScene_separable-sss/Conventional/separable-sss.ls",
                "res/threeDimen/LayaScene_separable-sss/Conventional/HeadBlinnphong.lh"];
            Laya.Laya.loader.create(resource, Laya.Handler.create(this, this.onPreLoadFinish));
        }
        onPreLoadFinish() {
            this.scene = Laya.Loader.getRes("res/threeDimen/LayaScene_separable-sss/Conventional/separable-sss.ls");
            Laya.Laya.stage.addChild(this.scene);
            this.mainCamera = this.scene.getChildByName("Main Camera");
            this.blinnphongCharacter = Laya.Loader.getRes("res/threeDimen/LayaScene_separable-sss/Conventional/HeadBlinnphong.lh");
            this.characterBlinnphongMaterial = this.blinnphongCharacter.meshRenderer.sharedMaterial.clone();
            let buf = this.createCommandBuffer(this.mainCamera, this.blinnphongCharacter.meshFilter.sharedMesh);
            this.mainCamera.addCommandBuffer(Laya.CameraEventFlags.BeforeForwardOpaque, buf);
            this.sssssBlitMaterail.cameraFiledOfView = this.mainCamera.fieldOfView;
            this.SSSSSCharacter = this.blinnphongCharacter.clone();
            this.SSSSSCharacter.meshRenderer.sharedMaterial = this.sssssRenderMaterial;
            this.scene.addChild(this.SSSSSCharacter);
            this.scene.addChild(this.blinnphongCharacter);
            this.blinnphongCharacter.active = false;
            this.loadUI();
        }
        createCommandBuffer(camera, character) {
            let oriColor = this.characterBlinnphongMaterial.albedoColor;
            let oriSpec = this.characterBlinnphongMaterial.specularColor;
            let buf = new Laya.CommandBuffer();
            let viewPort = camera.viewport;
            debugger;
            let depthTexture = Laya.RenderTexture.createFromPool(viewPort.width, viewPort.height, Laya.RenderTextureFormat.Depth);
            buf.setRenderTarget(depthTexture);
            buf.clearRenderTarget(true, true, new Laya.Vector4(0.5, 0.5, 0.5, 1.0));
            buf.drawMesh(character, this.blinnphongCharacter.transform.worldMatrix, this.characterBlinnphongMaterial, 0, 0);
            let diffuseRenderTexture = Laya.RenderTexture.createFromPool(viewPort.width, viewPort.height, Laya.RenderTextureFormat.R8G8B8A8, Laya.RenderTextureDepthFormat.DEPTH_16);
            buf.setRenderTarget(diffuseRenderTexture);
            buf.clearRenderTarget(true, true, new Laya.Vector4(0.5, 0.5, 0.5, 1.0));
            buf.setShaderDataVector(this.characterBlinnphongMaterial.shaderData, Laya.BlinnPhongMaterial.ALBEDOCOLOR, oriColor);
            buf.setShaderDataVector(this.characterBlinnphongMaterial.shaderData, Laya.BlinnPhongMaterial.MATERIALSPECULAR, new Laya.Vector4(0.0, 0.0, 0.0, 0.0));
            buf.drawMesh(character, this.blinnphongCharacter.transform.worldMatrix, this.characterBlinnphongMaterial, 0, 0);
            let specRrenderTexture = Laya.RenderTexture.createFromPool(viewPort.width, viewPort.height, Laya.RenderTextureFormat.R8G8B8A8, Laya.RenderTextureDepthFormat.DEPTH_16);
            buf.setRenderTarget(specRrenderTexture);
            buf.clearRenderTarget(true, true, new Laya.Vector4(1.0, 0.0, 0.0, 0.0));
            buf.setShaderDataVector(this.characterBlinnphongMaterial.shaderData, Laya.BlinnPhongMaterial.MATERIALSPECULAR, oriSpec);
            buf.setShaderDataVector(this.characterBlinnphongMaterial.shaderData, Laya.BlinnPhongMaterial.ALBEDOCOLOR, new Laya.Vector4(0.0, 0.0, 0.0, 0.0));
            buf.drawMesh(character, this.blinnphongCharacter.transform.worldMatrix, this.characterBlinnphongMaterial, 0, 0);
            buf.setShaderDataTexture(this.sssssBlitMaterail.shaderData, SeparableSSS_BlitMaterial.SHADERVALUE_DEPTHTEX, depthTexture);
            let blurRenderTexture = Laya.RenderTexture.createFromPool(viewPort.width, viewPort.height, Laya.RenderTextureFormat.R8G8B8A8, Laya.RenderTextureDepthFormat.DEPTHSTENCIL_NONE);
            buf.setShaderDataVector2(this.sssssBlitMaterail.shaderData, SeparableSSS_BlitMaterial.SHADERVALUE_BLURDIR, new Laya.Vector2(10.0, 0.0));
            buf.blitScreenQuadByMaterial(diffuseRenderTexture, blurRenderTexture, new Laya.Vector4(0, 0, 1.0, 1.0), this.sssssBlitMaterail, 0);
            buf.setShaderDataVector2(this.sssssBlitMaterail.shaderData, SeparableSSS_BlitMaterial.SHADERVALUE_BLURDIR, new Laya.Vector2(0.0, 10.0));
            buf.blitScreenQuadByMaterial(blurRenderTexture, diffuseRenderTexture, new Laya.Vector4(0.0, 0.0, 0.0, 0.0), this.sssssBlitMaterail, 0);
            buf.setGlobalTexture(Laya.Shader3D.propertyNameToID("sssssDiffuseTexture"), diffuseRenderTexture);
            this.sssssRenderMaterial.shaderData.setTexture(Laya.Shader3D.propertyNameToID("sssssSpecularTexture"), specRrenderTexture);
            diffuseRenderTexture.filterMode = Laya.FilterMode.Point;
            specRrenderTexture.filterMode = Laya.FilterMode.Point;
            return buf;
        }
        loadUI() {
            Laya.Laya.loader.load(["res/threeDimen/ui/button.png"], Laya.Handler.create(this, function () {
                var changeActionButton = Laya.Laya.stage.addChild(new Laya.Button("res/threeDimen/ui/button.png", "次表面散射模式"));
                changeActionButton.size(160, 40);
                changeActionButton.labelBold = true;
                changeActionButton.labelSize = 30;
                changeActionButton.sizeGrid = "4,4,4,4";
                changeActionButton.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
                changeActionButton.pos(Laya.Laya.stage.width / 2 - changeActionButton.width * Laya.Browser.pixelRatio / 2, Laya.Laya.stage.height - 100 * Laya.Browser.pixelRatio);
                changeActionButton.on(Laya.Event.CLICK, this, function () {
                    if (++this.curStateIndex % 2 == 1) {
                        this.blinnphongCharacter.active = true;
                        this.SSSSSCharacter.active = false;
                        changeActionButton.label = "正常模式";
                    }
                    else {
                        this.blinnphongCharacter.active = false;
                        this.SSSSSCharacter.active = true;
                        changeActionButton.label = "次表面散射模式";
                    }
                });
            }));
        }
    }
    new SeparableSSS_RenderDemo();

    exports.SeparableSSS_RenderDemo = SeparableSSS_RenderDemo;

}(this.Laya = this.Laya || {}, Laya));
