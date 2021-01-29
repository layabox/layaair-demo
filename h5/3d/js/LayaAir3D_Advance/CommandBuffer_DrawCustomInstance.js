window.Laya=window.Laya||{};

(function (Laya) {
	'use strict';

	var CustomInstanceVS = "#if defined(GL_FRAGMENT_PRECISION_HIGH)// 原来的写法会被我们自己的解析流程处理，而我们的解析是不认内置宏的，导致被删掉，所以改成 if defined 了\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n#include \"Lighting.glsl\";\r\n#include \"LayaUtile.glsl\";\r\n\r\nattribute vec4 a_Position;\r\n\r\n#ifdef GPU_INSTANCE\r\n\tuniform mat4 u_ViewProjection;\r\n\tattribute mat4 a_WorldMat;\r\n#else\r\n\tuniform mat4 u_MvpMatrix;\r\n#endif\r\n\r\n#ifdef GPU_INSTANCE\r\n    attribute vec4 a_InstanceColor;\r\n#endif\r\n\r\nvarying vec4 v_Color;\r\n\r\nvoid main() {\r\n\tvec4 position;\r\n\tposition=a_Position;\r\n\t#ifdef GPU_INSTANCE\r\n\t\tgl_Position = u_ViewProjection * a_WorldMat * position;\r\n\t#else\r\n\t\tgl_Position = u_MvpMatrix * position;\r\n\t#endif\r\n\r\n\r\n    #ifdef GPU_INSTANCE\r\n\t\tv_Color =a_InstanceColor;\r\n\t#else\r\n\t\tv_Color = vec4(1.0,1.0,1.0,1.0);\r\n\t#endif\r\n\r\n\tgl_Position=remapGLPositionZ(gl_Position);\r\n}";

	var CustomInstanceFS = "#if defined(GL_FRAGMENT_PRECISION_HIGH)// 原来的写法会被我们自己的解析流程处理，而我们的解析是不认内置宏的，导致被删掉，所以改成 if defined 了\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n\r\nvarying vec4 v_Color;\r\n\r\nvoid main()\r\n{\r\n\tvec4 color =  v_Color;\r\n\tgl_FragColor.rgb = color.rgb;\r\n\t\r\n}\r\n\r\n";

	class CustomInstanceMaterial extends Laya.Material {
	    static init() {
	        var attributeMap = {
	            'a_Position': Laya.VertexMesh.MESH_POSITION0,
	            'a_Normal': Laya.VertexMesh.MESH_NORMAL0,
	            'a_Texcoord0': Laya.VertexMesh.MESH_TEXTURECOORDINATE0,
	            'a_Tangent0': Laya.VertexMesh.MESH_TANGENT0,
	            'a_WorldMat': Laya.VertexMesh.MESH_WORLDMATRIX_ROW0,
	            'a_InstanceColor': Laya.VertexMesh.MESH_CUSTOME0
	        };
	        var uniformMap = {
	            'u_ViewProjection': Laya.Shader3D.PERIOD_CAMERA,
	            'u_MvpMatrix': Laya.Shader3D.PERIOD_CAMERA
	        };
	        var stateMap = {
	            's_Cull': Laya.Shader3D.RENDER_STATE_CULL,
	            's_Blend': Laya.Shader3D.RENDER_STATE_BLEND,
	            's_BlendSrc': Laya.Shader3D.RENDER_STATE_BLEND_SRC,
	            's_BlendDst': Laya.Shader3D.RENDER_STATE_BLEND_DST,
	            's_DepthTest': Laya.Shader3D.RENDER_STATE_DEPTH_TEST,
	            's_DepthWrite': Laya.Shader3D.RENDER_STATE_DEPTH_WRITE
	        };
	        var shader = Laya.Shader3D.add("CustomInstanceMat", null, null, false);
	        var subShader = new Laya.SubShader(attributeMap, uniformMap);
	        shader.addSubShader(subShader);
	        subShader.addShaderPass(CustomInstanceVS, CustomInstanceFS, stateMap, "Forward");
	    }
	    constructor() {
	        super();
	        this.setShaderName("CustomInstanceMat");
	        this.renderModeSet();
	    }
	    renderModeSet() {
	        this.alphaTest = true;
	        this.renderQueue = Laya.Material.RENDERQUEUE_OPAQUE;
	        this.depthWrite = true;
	        this.cull = Laya.RenderState.CULL_BACK;
	        this.blend = Laya.RenderState.BLEND_DISABLE;
	        this.depthTest = Laya.RenderState.DEPTHTEST_LESS;
	    }
	}

	class CommandBuffer_DrawCustomInstance {
	    constructor() {
	        this.matrixs = [];
	        this.matrixs1 = [];
	        this.colors = [];
	        this.colors1 = [];
	        this.currentColor = [];
	        this.currentMatrix = [];
	        this.timer = 0;
	        this.delta = 0.01;
	        this.curStateIndex = 0;
	        Laya.Laya3D.init(0, 0);
	        Laya.Stat.show();
	        Laya.Laya3D.init(100, 100);
	        Laya.Stat.show();
	        Laya.Shader3D.debugMode = true;
	        Laya.Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
	        Laya.Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
	        CustomInstanceMaterial.init();
	        let scene = Laya.Laya.stage.addChild(new Laya.Scene3D());
	        let camera = scene.addChild(new Laya.Camera(0, 0.1, 100));
	        camera.transform.position = new Laya.Vector3(14.85, 17.08, 35.89);
	        camera.transform.rotation = new Laya.Quaternion(0, 0, 0, 1);
	        camera.addComponent(CameraMoveScript);
	        camera.clearColor = new Laya.Vector4(0.8, 0.4, 0.2, 1.0);
	        this.mat = new CustomInstanceMaterial();
	        let directionLight = scene.addChild(new Laya.DirectionLight());
	        directionLight.color.setValue(1, 1, 1);
	        let mat = directionLight.transform.worldMatrix;
	        mat.setForward(new Laya.Vector3(-1.0, -1.0, -1.0));
	        directionLight.transform.worldMatrix = mat;
	        this.createCommandBuffer(camera);
	        this.loadUI();
	        Laya.Laya.timer.frameLoop(1, this, this.changetwoon);
	    }
	    createCommandBuffer(camera) {
	        let buf = new Laya.CommandBuffer();
	        this.createMatrixArray();
	        this.materialBlock = new Laya.MaterialInstancePropertyBlock();
	        this.materialBlock.setVectorArray("a_InstanceColor", this.colors1, Laya.InstanceLocation.CUSTOME0);
	        this.instanceCMD = buf.drawMeshInstance(Laya.PrimitiveMesh.createSphere(0.5), 0, this.matrixs1, this.mat, 0, this.materialBlock, 900);
	        camera.addCommandBuffer(Laya.CameraEventFlags.BeforeTransparent, buf);
	        return;
	    }
	    createMatrixArray() {
	        for (let i = 0; i < 30; i++) {
	            for (let j = 0; j < 30; j++) {
	                let ind = j * 30 + i;
	                if (ind > 1023)
	                    break;
	                this.matrixs[ind] = new Laya.Matrix4x4();
	                this.matrixs1[ind] = new Laya.Matrix4x4();
	                this.currentMatrix[ind] = new Laya.Matrix4x4();
	                Laya.Matrix4x4.createTranslate(new Laya.Vector3(i, j, 0), this.matrixs[ind]);
	                Laya.Matrix4x4.createTranslate(new Laya.Vector3(ind % 10 + 10, Math.floor(ind / 100) + 10, Math.floor(ind / 10) % 10 - 5), this.matrixs1[ind]);
	                this.colors[ind] = new Laya.Vector4(1 - i / 30.0, 1 - j / 30.0, 1.0, 1.0);
	                this.colors1[ind] = new Laya.Vector4(1 - i / 30.0, 1 - j / 30.0, 0.0, 1.0);
	                this.currentColor[ind] = new Laya.Vector4();
	            }
	        }
	        return null;
	    }
	    changePositionColor(sourceColor, sourceMatrix, destColor, destMatrix, lerp) {
	        var lep = lerp;
	        var invert = 1 - lerp;
	        for (let i = 0; i < 30; i++) {
	            for (let j = 0; j < 30; j++) {
	                let ind = j * 30 + i;
	                this.currentColor[ind].setValue(sourceColor[ind].x * lep + destColor[ind].x * invert, sourceColor[ind].y * lep + destColor[ind].y * invert, sourceColor[ind].z * lep + destColor[ind].z * invert, 1.0);
	                var mat = this.currentMatrix[ind].elements;
	                var sourcemat = sourceMatrix[ind].elements;
	                var destmat = destMatrix[ind].elements;
	                mat[12] = sourcemat[12] * lep + destmat[12] * invert;
	                mat[13] = sourcemat[13] * lep + destmat[13] * invert;
	                mat[14] = sourcemat[14] * lep + destmat[14] * invert;
	            }
	        }
	    }
	    changetwoon() {
	        this.timer += this.delta;
	        if (this.timer < 0 || this.timer > 1) {
	            this.timer = Math.round(this.timer);
	            return;
	        }
	        this.changePositionColor(this.colors, this.matrixs, this.colors1, this.matrixs1, this.timer);
	        this.instanceCMD.setWorldMatrix(this.currentMatrix);
	        this.materialBlock.setVectorArray("a_InstanceColor", this.currentColor, Laya.InstanceLocation.CUSTOME0);
	    }
	    loadUI() {
	        Laya.Laya.loader.load(["res/threeDimen/ui/button.png"], Laya.Handler.create(this, function () {
	            var changeActionButton = Laya.Laya.stage.addChild(new Laya.Button("res/threeDimen/ui/button.png", "切换颜色位置1"));
	            changeActionButton.size(160, 40);
	            changeActionButton.labelBold = true;
	            changeActionButton.labelSize = 30;
	            changeActionButton.sizeGrid = "4,4,4,4";
	            changeActionButton.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
	            changeActionButton.pos(Laya.Laya.stage.width / 2 - changeActionButton.width * Laya.Browser.pixelRatio / 2, Laya.Laya.stage.height - 100 * Laya.Browser.pixelRatio);
	            changeActionButton.on(Laya.Event.CLICK, this, function () {
	                if (++this.curStateIndex % 2 == 1) {
	                    changeActionButton.label = "颜色位置1";
	                    this.delta = -0.01;
	                }
	                else {
	                    changeActionButton.label = "颜色位置2";
	                    this.delta = 0.01;
	                }
	            });
	        }));
	    }
	}

	new CommandBuffer_DrawCustomInstance();

}(Laya));
