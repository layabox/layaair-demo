window.Laya=window.Laya||{};

(function (Laya) {
	'use strict';

	class GrassCellInfo {
	    constructor(maxGrassNums, cellSize, privotPos) {
	        this.privotPos = new Laya.Vector3();
	        this.grassHight = 5;
	        this.posArray = new Float32Array(maxGrassNums * 3);
	        this.size = cellSize;
	        this.privotPos = privotPos;
	        this.updateGrassPos();
	        this.bound = new Laya.BoundBox(new Laya.Vector3(this.privotPos.x - this.size / 2, this.privotPos.y, this.privotPos.z - this.size / 2), new Laya.Vector3(this.privotPos.x + this.size / 2, this.privotPos.y + this.grassHight, this.privotPos.z + this.size / 2));
	    }
	    updateGrassPos() {
	        let array = this.posArray;
	        let orix = this.privotPos.x;
	        let oriy = this.privotPos.y;
	        let oriz = this.privotPos.z;
	        let size = this.size / 2;
	        for (let i = 0, n = this.posArray.length / 3; i < n; i += 3) {
	            var x = (Math.random() * 2 - 1) * size;
	            var z = (Math.random() * 2 - 1) * size;
	            array[i] = x + orix;
	            array[i + 1] = oriy;
	            array[i + 2] = z + oriz;
	        }
	    }
	    setDrawLevel(level) {
	        this.drawlevelRatio = Math.max(1 - level, 0.0);
	    }
	    setGrassCellData(drawArray, offset) {
	        let setLength = Math.floor(this.posArray.length / 3 * this.drawlevelRatio) * 3;
	        drawArray.set(this.posArray, offset);
	        return setLength + offset;
	    }
	}

	var UnityGrassVS = "#if defined(GL_FRAGMENT_PRECISION_HIGH)// 原来的写法会被我们自己的解析流程处理，而我们的解析是不认内置宏的，导致被删掉，所以改成 if defined 了\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n\r\n#include \"Lighting.glsl\";\r\n\r\n//attribute\r\nattribute vec4 a_Position;\r\nattribute vec3 a_privotPosition;\r\n\r\n//camera\r\nuniform mat4 u_MvpMatrix;\r\nuniform mat4 u_ViewProjection;\r\nuniform mat4 u_View;\r\nuniform mat4 u_Projection;\r\n\r\nuniform vec3 u_CameraDirection;\r\nuniform vec3 u_CameraUp;\r\nuniform vec3 u_CameraPos;\r\nuniform float u_Time;\r\n\r\n//wind\r\nuniform float u_WindAIntensity;\r\nuniform float u_WindAFrequency;\r\nuniform vec2 u_WindATiling;\r\nuniform vec2 u_WindAWrap;\r\n\r\nuniform float u_WindBIntensity;\r\nuniform float u_WindBFrequency;\r\nuniform vec2 u_WindBTiling;\r\nuniform vec2 u_WindBWrap;\r\n\r\nuniform float u_WindCIntensity;\r\nuniform float u_WindCFrequency;\r\nuniform vec2 u_WindCTiling;\r\nuniform vec2 u_WindCWrap;\r\n\r\n//Grass property\r\nuniform float u_grassHeight;\r\nuniform float u_grassWidth;\r\nuniform vec4 u_BoundSize;\r\nuniform vec3 u_GroundColor;\r\n\r\n//albedoTextue;\r\nuniform sampler2D u_albedoTexture;\r\n\r\nvarying vec4 v_Color;\r\n\r\nvoid main() {\r\n    \r\n    // uniform\r\n    vec3 baseColor = vec3(0.1, 0.5, 0.1);\r\n    float boundSize = 70.71067811865476;\r\n\r\n    // const\r\n    float minHeight = 2.0;\r\n    float maxHeight = 5.0;\r\n\r\n\r\n    vec4 aposition = a_Position;\r\n    vec3 perGrassPivotPosWS = a_privotPosition;\r\n    float perGrassHeight = mix(minHeight, maxHeight, (sin(perGrassPivotPosWS.x * 23.4643 + perGrassPivotPosWS.z) * 0.45 + 0.55)) * u_grassHeight;\r\n\r\n\r\n    vec3 cameraUpWS = normalize(u_CameraUp);\r\n    vec3 cameraForwardWS = normalize(u_CameraDirection);\r\n    vec3 cameraRightWS = normalize(cross(cameraForwardWS, cameraUpWS));\r\n\r\n    //BlillBoard x\r\n    vec3 positionOS = aposition.x * cameraRightWS * u_grassWidth * (sin(perGrassPivotPosWS.x * 95.4643 + perGrassPivotPosWS.z) * 0.45 + 0.55);\r\n    //BillBoard y\r\n    positionOS += aposition.y * cameraUpWS;\r\n\r\n    // 每根草 高度\r\n    positionOS.y *= perGrassHeight;\r\n\r\n\r\n    float wind = 0.0;\r\n    wind += (sin(u_Time * u_WindAFrequency + perGrassPivotPosWS.x * u_WindATiling.x + perGrassPivotPosWS.z * u_WindATiling.y)*u_WindAWrap.x+u_WindAWrap.y) * u_WindAIntensity; //windA\r\n    wind += (sin(u_Time * u_WindBFrequency + perGrassPivotPosWS.x * u_WindBTiling.x + perGrassPivotPosWS.z * u_WindBTiling.y)*u_WindBWrap.x+u_WindBWrap.y) * u_WindBIntensity; //windB\r\n    wind += (sin(u_Time * u_WindCFrequency + perGrassPivotPosWS.x * u_WindCTiling.x + perGrassPivotPosWS.z * u_WindCTiling.y)*u_WindCWrap.x+u_WindCWrap.y) * u_WindCIntensity; //windC\r\n    wind *= a_Position.y; //wind only affect top region, don't affect root region\r\n    vec3 windOffset = cameraRightWS * wind; //swing using billboard left right direction\r\n    //风的影响\r\n    positionOS += windOffset;\r\n\r\n\r\n    vec3 viewWS = u_CameraPos - perGrassPivotPosWS;\r\n    float viewWSLength = length(viewWS);\r\n    positionOS += cameraRightWS * aposition.x * max(0.0, viewWSLength * 0.02225);\r\n\r\n    vec3 positionWS = positionOS + perGrassPivotPosWS;\r\n    vec4 position = u_ViewProjection * vec4(positionWS, 1.0);\r\n\r\n\r\n    //reset Texture \r\n    vec2 uv = (positionWS.xz-u_BoundSize.xy)/u_BoundSize.zw;\r\n    baseColor = texture2D(u_albedoTexture, uv).rgb;\r\n    \r\n    vec3 albedo = mix(u_GroundColor,baseColor,a_Position.y);\r\n\r\n    v_Color = vec4(albedo, 1.0);\r\n\r\n    gl_Position = position;\r\n    gl_Position=remapGLPositionZ(gl_Position);\r\n}";

	var UnityGrassFS = "#if defined(GL_FRAGMENT_PRECISION_HIGH)// 原来的写法会被我们自己的解析流程处理，而我们的解析是不认内置宏的，导致被删掉，所以改成 if defined 了\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n\r\nvarying vec4 v_Color;\r\n#ifdef FOG\r\n\tuniform float u_FogStart;\r\n\tuniform float u_FogRange;\r\n\tuniform vec3 u_FogColor;\r\n#endif\r\n\r\nvoid main() {\r\n\r\n    vec4 color = v_Color;\r\n     gl_FragColor = color;\r\n\t#ifdef FOG\r\n\t\tfloat lerpFact=clamp((1.0/gl_FragCoord.w-u_FogStart)/u_FogRange,0.0,1.0);\r\n\t\tgl_FragColor.rgb=mix(gl_FragColor.rgb,u_FogColor,lerpFact);\r\n\t#endif\r\n   \r\n}";

	class GrassMaterial extends Laya.Material {
	    constructor() {
	        if (!GrassMaterial.hasInited) {
	            GrassMaterial.__init__();
	            GrassMaterial.hasInited = true;
	        }
	        super();
	        this.setShaderName("GrassShader");
	        this.alphaTest = false;
	        this.renderQueue = Laya.Material.RENDERQUEUE_OPAQUE;
	        this.depthWrite = true;
	        this.cull = Laya.RenderState.CULL_BACK;
	        this.blend = Laya.RenderState.BLEND_DISABLE;
	        this.depthTest = Laya.RenderState.DEPTHTEST_LESS;
	        this.setWindA(1.77, 4, new Laya.Vector2(0.1, 0.1), new Laya.Vector2(0.5, 0.5));
	        this.setWindB(0.25, 7.7, new Laya.Vector2(0.37, 3), new Laya.Vector2(0.5, 0.5));
	        this.setWindC(0.125, 11.7, new Laya.Vector2(0.77, 3), new Laya.Vector2(0.5, 0.5));
	        this.grassHight = 1.0;
	        this.grassWidth = 1.0;
	        this.grassGroundColor = new Laya.Vector3(0.25, 0.49, 0.23);
	        this.grassBoundSize = new Laya.Vector4(-105, -105, 210, 210);
	        this.albedoTexture = Laya.Loader.getRes("res/InstancedIndirectGrassVertexColor.jpg");
	    }
	    static __init__() {
	        var attributeMap = {
	            'a_Position': Laya.VertexMesh.MESH_POSITION0,
	            'a_Normal': Laya.VertexMesh.MESH_NORMAL0,
	            'a_Color': Laya.VertexMesh.MESH_COLOR0,
	            'a_Tangent0': Laya.VertexMesh.MESH_TANGENT0,
	            'a_privotPosition': Laya.VertexMesh.MESH_CUSTOME0
	        };
	        var uniformMap = {
	            'u_AlbedoTexture': Laya.Shader3D.PERIOD_MATERIAL,
	            'u_AlbedoColor': Laya.Shader3D.PERIOD_MATERIAL,
	            'u_TilingOffset': Laya.Shader3D.PERIOD_MATERIAL,
	            'u_MvpMatrix': Laya.Shader3D.PERIOD_SPRITE,
	            'u_CameraDirection': Laya.Shader3D.PERIOD_CAMERA,
	            'u_CameraUp': Laya.Shader3D.PERIOD_CAMERA,
	            'u_CameraPos': Laya.Shader3D.PERIOD_CAMERA,
	            'u_View': Laya.Shader3D.PERIOD_CAMERA,
	            'u_Projection': Laya.Shader3D.PERIOD_CAMERA,
	            "u_Time": Laya.Shader3D.PERIOD_SCENE,
	            'u_ViewProjection': Laya.Shader3D.PERIOD_CAMERA,
	            "u_WindAIntensity": Laya.Shader3D.PERIOD_MATERIAL,
	            "u_WindAFrequency": Laya.Shader3D.PERIOD_MATERIAL,
	            "u_WindATiling": Laya.Shader3D.PERIOD_MATERIAL,
	            "u_WindAWrap": Laya.Shader3D.PERIOD_MATERIAL,
	            "u_WindBIntensity": Laya.Shader3D.PERIOD_MATERIAL,
	            "u_WindBFrequency": Laya.Shader3D.PERIOD_MATERIAL,
	            "u_WindBTiling": Laya.Shader3D.PERIOD_MATERIAL,
	            "u_WindBWrap": Laya.Shader3D.PERIOD_MATERIAL,
	            "u_WindCIntensity": Laya.Shader3D.PERIOD_MATERIAL,
	            "u_WindCFrequency": Laya.Shader3D.PERIOD_MATERIAL,
	            "u_WindCTiling": Laya.Shader3D.PERIOD_MATERIAL,
	            "u_WindCWrap": Laya.Shader3D.PERIOD_MATERIAL,
	            "u_grassHeight": Laya.Shader3D.PERIOD_MATERIAL,
	            "u_grassWidth": Laya.Shader3D.PERIOD_MATERIAL,
	            "u_BoundSize": Laya.Shader3D.PERIOD_MATERIAL,
	            "u_GroundColor": Laya.Shader3D.PERIOD_MATERIAL,
	            "u_albedoTexture": Laya.Shader3D.PERIOD_MATERIAL
	        };
	        var stateMap = {
	            's_Cull': Laya.Shader3D.RENDER_STATE_CULL,
	            's_Blend': Laya.Shader3D.RENDER_STATE_BLEND,
	            's_BlendSrc': Laya.Shader3D.RENDER_STATE_BLEND_SRC,
	            's_BlendDst': Laya.Shader3D.RENDER_STATE_BLEND_DST,
	            's_DepthTest': Laya.Shader3D.RENDER_STATE_DEPTH_TEST,
	            's_DepthWrite': Laya.Shader3D.RENDER_STATE_DEPTH_WRITE
	        };
	        var shader = Laya.Shader3D.add("GrassShader", attributeMap, uniformMap, false, false);
	        var subShader = new Laya.SubShader(attributeMap, uniformMap);
	        shader.addSubShader(subShader);
	        var pass = subShader.addShaderPass(UnityGrassVS, UnityGrassFS, stateMap, "Forward");
	        pass.renderState.cull = Laya.RenderState.CULL_BACK;
	    }
	    setWindA(windIntensity, windFrequency, windTiling, windWrap) {
	        this._shaderValues.setNumber(GrassMaterial.WINDAINTENSITY, windIntensity);
	        this._shaderValues.setNumber(GrassMaterial.WINDAFREQUECY, windFrequency);
	        this._shaderValues.setVector2(GrassMaterial.WINDATILING, windTiling);
	        this._shaderValues.setVector2(GrassMaterial.WINDAWRAP, windWrap);
	    }
	    setWindB(windIntensity, windFrequency, windTiling, windWrap) {
	        this._shaderValues.setNumber(GrassMaterial.WINDBINTENSITY, windIntensity);
	        this._shaderValues.setNumber(GrassMaterial.WINDBFREQUECY, windFrequency);
	        this._shaderValues.setVector2(GrassMaterial.WINDBTILING, windTiling);
	        this._shaderValues.setVector2(GrassMaterial.WINDBWRAP, windWrap);
	    }
	    setWindC(windIntensity, windFrequency, windTiling, windWrap) {
	        this._shaderValues.setNumber(GrassMaterial.WINDCINTENSITY, windIntensity);
	        this._shaderValues.setNumber(GrassMaterial.WINDCFREQUECY, windFrequency);
	        this._shaderValues.setVector2(GrassMaterial.WINDCTILING, windTiling);
	        this._shaderValues.setVector2(GrassMaterial.WINDCWRAP, windWrap);
	    }
	    set grassHight(value) {
	        this._shaderValues.setNumber(GrassMaterial.GRASSHEIGHT, value);
	    }
	    set grassWidth(value) {
	        this._shaderValues.setNumber(GrassMaterial.GRASSWIDTH, value);
	    }
	    set grassGroundColor(value) {
	        this._shaderValues.setVector3(GrassMaterial.GROUNDCOLOR, value);
	    }
	    set grassBoundSize(value) {
	        this._shaderValues.setVector(GrassMaterial.GRASSBOUND, value);
	    }
	    set albedoTexture(value) {
	        this._shaderValues.setTexture(GrassMaterial.ALBEDOTEXTURE, value);
	    }
	}
	GrassMaterial.hasInited = false;
	GrassMaterial.WINDAINTENSITY = Laya.Shader3D.propertyNameToID("u_WindAIntensity");
	GrassMaterial.WINDAFREQUECY = Laya.Shader3D.propertyNameToID("u_WindAFrequency");
	GrassMaterial.WINDATILING = Laya.Shader3D.propertyNameToID("u_WindATiling");
	GrassMaterial.WINDAWRAP = Laya.Shader3D.propertyNameToID("u_WindAWrap");
	GrassMaterial.WINDBINTENSITY = Laya.Shader3D.propertyNameToID("u_WindBIntensity");
	GrassMaterial.WINDBFREQUECY = Laya.Shader3D.propertyNameToID("u_WindBFrequency");
	GrassMaterial.WINDBTILING = Laya.Shader3D.propertyNameToID("u_WindBTiling");
	GrassMaterial.WINDBWRAP = Laya.Shader3D.propertyNameToID("u_WindBWrap");
	GrassMaterial.WINDCINTENSITY = Laya.Shader3D.propertyNameToID("u_WindCIntensity");
	GrassMaterial.WINDCFREQUECY = Laya.Shader3D.propertyNameToID("u_WindCFrequency");
	GrassMaterial.WINDCTILING = Laya.Shader3D.propertyNameToID("u_WindCTiling");
	GrassMaterial.WINDCWRAP = Laya.Shader3D.propertyNameToID("u_WindCWrap");
	GrassMaterial.GRASSHEIGHT = Laya.Shader3D.propertyNameToID("u_grassHeight");
	GrassMaterial.GRASSWIDTH = Laya.Shader3D.propertyNameToID("u_grassWidth");
	GrassMaterial.GRASSBOUND = Laya.Shader3D.propertyNameToID("u_BoundSize");
	GrassMaterial.GROUNDCOLOR = Laya.Shader3D.propertyNameToID("u_GroundColor");
	GrassMaterial.ALBEDOTEXTURE = Laya.Shader3D.propertyNameToID("u_albedoTexture");

	class GlassRender {
	    constructor(manager, camera) {
	        this.grassManager = manager;
	        this.createCommandBuffer();
	        this.camera = camera;
	    }
	    creatGrassMesh() {
	        var vertexArray = new Float32Array(3 * 3);
	        vertexArray[0] = -0.25;
	        vertexArray[3] = 0.25;
	        vertexArray[7] = 1;
	        var indexArray = new Uint16Array([2, 1, 0]);
	        var vertexDeclaration = Laya.VertexMesh.getVertexDeclaration("POSITION");
	        var mesh = Laya.PrimitiveMesh._createMesh(vertexDeclaration, vertexArray, indexArray);
	        return mesh;
	    }
	    createMaterial() {
	        var mat = new GrassMaterial();
	        this.grassMaterial = mat;
	        return mat;
	    }
	    createCommandBuffer() {
	        Laya.DrawMeshInstancedCMD.maxInstanceCount = 1000000;
	        this.buf = new Laya.CommandBuffer();
	        this.materialBlock = new Laya.MaterialInstancePropertyBlock();
	        this.materialBlock.setVector3Array("a_privotPosition", this.grassManager.dataArrayBuffer, Laya.InstanceLocation.CUSTOME0);
	        this.instanceCMD = this.buf.drawMeshInstance(this.creatGrassMesh(), 0, null, this.createMaterial(), 0, this.materialBlock, this.grassManager.drawArrayLength);
	        return;
	    }
	    removeCommandBuffer() {
	        this.camera.removeCommandBuffer(Laya.CameraEventFlags.BeforeTransparent, this.buf);
	    }
	    addCommandBuffer() {
	        this.camera.addCommandBuffer(Laya.CameraEventFlags.BeforeTransparent, this.buf);
	    }
	    changeDrawNums() {
	        this.materialBlock.setVector3Array("a_privotPosition", this.grassManager.dataArrayBuffer, Laya.InstanceLocation.CUSTOME0);
	        this.instanceCMD.setDrawNums(this.grassManager.drawArrayLength);
	    }
	}

	class GrassRenderManager {
	    constructor(camera) {
	        this.instanceCount = 1000000;
	        this.grassCellsize = 10;
	        this.cellMaxGrassNum = 1000;
	        this.cellMipmapByDistance = 10;
	        this.DrawDistance = 150;
	        this.enableLevelDraw = true;
	        this.subGrassByLevel = 0.1;
	        this.grassMap = [];
	        this.drawArrayLength = 0;
	        this.drawGrassCellLeverlArray = [];
	        this.drawGrassCellLeverlArray.length = this.cellMipmapByDistance;
	        for (let index = 0; index < this.cellMipmapByDistance; index++) {
	            this.drawGrassCellLeverlArray[index] = [];
	        }
	        this.drawGrassLevelNums = [];
	        this.drawGrassLevelNums.length = this.cellMipmapByDistance;
	        this.dataArrayBuffer = new Float32Array(this.instanceCount * 3);
	        this.glassRender = new GlassRender(this, camera);
	    }
	    set enable(value) {
	        if (value)
	            this.glassRender.addCommandBuffer();
	        else
	            this.glassRender.removeCommandBuffer();
	    }
	    frustumCulling(camera) {
	        for (let j = 0; j < this.drawGrassLevelNums.length; j++) {
	            this.drawGrassLevelNums[j] = 0;
	        }
	        this.drawGrassCellNums = 0;
	        let distance = this.DrawDistance;
	        let levelDistance = this.DrawDistance / this.cellMipmapByDistance;
	        let boundFrustum = camera.boundFrustum;
	        let cameraPos = camera.transform.position;
	        for (let i = 0, n = this.grassMap.length; i < n; i++) {
	            let grasscell = this.grassMap[i];
	            let grassDistance = Laya.Vector3.distance(grasscell.privotPos, cameraPos);
	            if (grassDistance < distance) {
	                if (boundFrustum.intersects(grasscell.bound)) {
	                    if (this.enableLevelDraw) {
	                        let leval = Math.floor(grassDistance / levelDistance);
	                        grasscell.setDrawLevel(leval * this.subGrassByLevel);
	                        this.drawGrassCellLeverlArray[leval] || (this.drawGrassCellLeverlArray[leval] = {});
	                        this.drawGrassCellLeverlArray[leval][this.drawGrassLevelNums[leval]] = i;
	                        this.drawGrassLevelNums[leval] += 1;
	                    }
	                    else {
	                        grasscell.setDrawLevel(0);
	                        this.drawGrassCellLeverlArray[0][this.drawGrassLevelNums[0]] = i;
	                        this.drawGrassLevelNums[0] += 1;
	                    }
	                    this.drawGrassCellNums++;
	                }
	            }
	        }
	    }
	    addGrassCell(grassPrivot) {
	        let grassCell = new GrassCellInfo(this.cellMaxGrassNum, this.grassCellsize, grassPrivot);
	        this.grassMap.push(grassCell);
	    }
	    removeGrassCell(grassCell) {
	        let index = this.grassMap.indexOf(grassCell);
	        let lastIndex = this.grassMap.length - 1;
	        this.grassMap[index] = this.grassMap[lastIndex];
	        this.grassMap.length = lastIndex;
	    }
	    update(caemra) {
	        this.frustumCulling(caemra);
	        let offset = 0;
	        for (let i = 0, n = this.drawGrassLevelNums.length; i < n; i++) {
	            let drawnums = this.drawGrassLevelNums[i];
	            var array = this.drawGrassCellLeverlArray[i];
	            for (var j = 0; j < drawnums; j++) {
	                offset = this.grassMap[array[j]].setGrassCellData(this.dataArrayBuffer, offset);
	            }
	        }
	        this.drawArrayLength = offset;
	        this.glassRender.changeDrawNums();
	    }
	}

	class GrassDemo {
	    constructor() {
	        Laya.Laya3D.init(0, 0);
	        Laya.Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
	        Laya.Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
	        Laya.Stat.show();
	        Laya.Shader3D.debugMode = true;
	        this.PreloadingRes();
	    }
	    initScene() {
	        var scene = Laya.Loader.getRes("res/LayaScene_GrassScene/Conventional/GrassScene.ls");
	        Laya.Laya.stage.addChild(scene);
	        this.camera = scene.addChild(new Laya.Camera(0, 0.1, 1000));
	        this.camera.addComponent(CameraMoveScript);
	        this.camera.clearFlag = Laya.CameraClearFlags.Sky;
	        this.camera.transform.position = new Laya.Vector3(-45.56605299366802, 7.79715240971953, 9.329663960933718);
	        var directionLight = scene.addChild(new Laya.DirectionLight());
	        var mat = directionLight.transform.worldMatrix;
	        mat.setForward(new Laya.Vector3(-1.0, -1.0, -1.0));
	        directionLight.transform.worldMatrix = mat;
	        var plane = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createPlane(1000, 0, 1000));
	        var planeMat = plane.meshRenderer.sharedMaterial = new Laya.BlinnPhongMaterial();
	        planeMat.albedoColor = new Laya.Vector4(0.06, 0.31, 0.14, 1.0);
	    }
	    PreloadingRes() {
	        var resource = ["res/InstancedIndirectGrassVertexColor.jpg",
	            "res/LayaScene_GrassScene/Conventional/GrassScene.ls"];
	        Laya.Laya.loader.create(resource, Laya.Handler.create(this, this.onPreLoadFinish));
	    }
	    onPreLoadFinish() {
	        this.initScene();
	        this.grassManager = new GrassRenderManager(this.camera);
	        var grasssize = this.grassManager.grassCellsize;
	        for (let x = -100; x < 100; x += grasssize) {
	            for (let z = -100; z < 100; z += grasssize) {
	                this.grassManager.addGrassCell(new Laya.Vector3(x, 0, z));
	            }
	        }
	        this.grassManager.enable = true;
	        Laya.Laya.timer.loop(1, this, this.update, [this.camera]);
	    }
	    update(camera) {
	        this.grassManager.update(camera);
	    }
	}

	new GrassDemo();

}(Laya));
