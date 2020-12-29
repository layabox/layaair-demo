
  var DepthVS = "#if defined(GL_FRAGMENT_PRECISION_HIGH)// 原来的写法会被我们自己的解析流程处理，而我们的解析是不认内置宏的，导致被删掉，所以改成 if defined 了\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n#include \"Lighting.glsl\";\r\nattribute vec4 a_Position;\r\n\r\nattribute vec2 a_Texcoord0;\r\nvarying vec2 v_Texcoord0;\r\n\r\nuniform mat4 u_MvpMatrix;\r\n\r\nvoid main() {\r\n    vec4 position;\r\n    position=a_Position;\r\n    v_Texcoord0=a_Texcoord0;\r\n    gl_Position = u_MvpMatrix * position;\r\n    gl_Position=remapGLPositionZ(gl_Position);\r\n}";

  var DepthFS = "#if defined(GL_FRAGMENT_PRECISION_HIGH)\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n\r\n#include \"DepthNormalUtil.glsl\";\r\n\r\n\r\nvarying vec2 v_Texcoord0;\r\n\r\nvoid main(){\r\n    vec4 col;\r\n    vec2 uv = vec2(v_Texcoord0.x,1.0-v_Texcoord0.y);\r\n    float depth = SAMPLE_DEPTH_TEXTURE(u_CameraDepthTexture,uv);\r\n    depth =Linear01Depth(depth,u_ZBufferParams);\r\n    col = vec4(depth,depth,depth,1.0);\r\n    gl_FragColor = col;\r\n}";

  class DepthMaterial extends Laya.Material {
	  static init() {
		  var attributeMap = {
			  'a_Position': Laya.VertexMesh.MESH_POSITION0,
			  'a_Normal': Laya.VertexMesh.MESH_NORMAL0,
			  'a_Texcoord0': Laya.VertexMesh.MESH_TEXTURECOORDINATE0,
			  'a_Tangent0': Laya.VertexMesh.MESH_TANGENT0
		  };
		  var uniformMap = {
			  'u_CameraDepthNormalsTexture': Laya.Shader3D.PERIOD_CAMERA,
			  'u_CameraDepthTexture': Laya.Shader3D.PERIOD_CAMERA,
			  'u_ZBufferParams': Laya.Shader3D.PERIOD_CAMERA,
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
		  var shader = Laya.Shader3D.add("DepthShader", null, null, false, false);
		  var subShader = new Laya.SubShader(attributeMap, uniformMap);
		  shader.addSubShader(subShader);
		  subShader.addShaderPass(DepthVS, DepthFS, stateMap, "Forward");
	  }
	  constructor() {
		  super();
		  this.setShaderName("DepthShader");
		  this.renderModeSet();
	  }
	  renderModeSet() {
		  this.alphaTest = false;
		  this.renderQueue = Laya.Material.RENDERQUEUE_OPAQUE;
		  this.depthWrite = true;
		  this.cull = Laya.RenderState.CULL_BACK;
		  this.blend = Laya.RenderState.BLEND_DISABLE;
		  this.depthTest = Laya.RenderState.DEPTHTEST_LESS;
	  }
  }

  var DepthNormalVS = "#if defined(GL_FRAGMENT_PRECISION_HIGH)// 原来的写法会被我们自己的解析流程处理，而我们的解析是不认内置宏的，导致被删掉，所以改成 if defined 了\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n#include \"Lighting.glsl\";\r\nattribute vec4 a_Position;\r\n\r\nattribute vec2 a_Texcoord0;\r\nvarying vec2 v_Texcoord0;\r\n\r\nuniform mat4 u_MvpMatrix;\r\n\r\nvoid main() {\r\n    vec4 position;\r\n    position=a_Position;\r\n    v_Texcoord0=a_Texcoord0;\r\n    gl_Position = u_MvpMatrix * position;\r\n    gl_Position=remapGLPositionZ(gl_Position);\r\n}";

  var DepthNormalFS = "#if defined(GL_FRAGMENT_PRECISION_HIGH)\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n\r\n#include \"DepthNormalUtil.glsl\";\r\n\r\n\r\nvarying vec2 v_Texcoord0;\r\n\r\nvoid main(){\r\n    vec2 uv = vec2(v_Texcoord0.x,1.0-v_Texcoord0.y);\r\n    vec4 col = texture2D(u_CameraDepthNormalsTexture,uv);\r\n    vec3 normals;\r\n    float depth;\r\n    DecodeDepthNormal(col,depth,normals);\r\n    col = vec4(normals,1.0);\r\n    gl_FragColor = col;\r\n}";

  class DepthNormalsMaterial extends Laya.Material {
	  static init() {
		  var attributeMap = {
			  'a_Position': Laya.VertexMesh.MESH_POSITION0,
			  'a_Normal': Laya.VertexMesh.MESH_NORMAL0,
			  'a_Texcoord0': Laya.VertexMesh.MESH_TEXTURECOORDINATE0,
			  'a_Tangent0': Laya.VertexMesh.MESH_TANGENT0
		  };
		  var uniformMap = {
			  'u_CameraDepthNormalsTexture': Laya.Shader3D.PERIOD_CAMERA,
			  'u_CameraDepthTexture': Laya.Shader3D.PERIOD_CAMERA,
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
		  var shader = Laya.Shader3D.add("DepthNormalShader", null, null, false, false);
		  var subShader = new Laya.SubShader(attributeMap, uniformMap);
		  shader.addSubShader(subShader);
		  subShader.addShaderPass(DepthNormalVS, DepthNormalFS, stateMap, "Forward");
	  }
	  constructor() {
		  super();
		  this.setShaderName("DepthNormalShader");
		  this.renderModeSet();
	  }
	  renderModeSet() {
		  this.alphaTest = false;
		  this.renderQueue = Laya.Material.RENDERQUEUE_OPAQUE;
		  this.depthWrite = true;
		  this.cull = Laya.RenderState.CULL_BACK;
		  this.blend = Laya.RenderState.BLEND_DISABLE;
		  this.depthTest = Laya.RenderState.DEPTHTEST_LESS;
	  }
  }

class CameraDepthModeTextureDemo {
    constructor() {
		Laya.Laya3D.init(0, 0);
		Laya.URL.basePath ="https://layaair2.ldc2.layabox.com/demo2/h5/";
        Laya.Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        Laya.Shader3D.debugMode = true;
		DepthMaterial.init();
        DepthNormalsMaterial.init();
        this.PreloadingRes();
    }
    PreloadingRes() {
        var resource = ["res/threeDimen/LayaScene_depthNormalScene/Conventional/depthNormalPlane.lh",
            "res/threeDimen/LayaScene_depthNormalScene/Conventional/depthPlane.lh",
            "res/threeDimen/LayaScene_depthNormalScene/Conventional/depthscene.lh",
            "res/threeDimen/LayaScene_depthNormalScene/Conventional/Main Camera.lh",
            "res/threeDimen/LayaScene_depthNormalScene/Conventional/Assets/Scenes/depthNormalSceneGIReflection.ltcb.ls"
        ];
        Laya.Laya.loader.create(resource, Laya.Handler.create(this, this.onPreLoadFinish));
    }
    onPreLoadFinish() {
        this.scene = Laya.Laya.stage.addChild(new Laya.Scene3D());
        this.scene.ambientColor = new Laya.Vector3(0.858, 0.858, 0.858);
        this.scene.reflection = Laya.Loader.getRes("res/threeDimen/LayaScene_depthNormalScene/Conventional/Assets/Scenes/depthNormalSceneGIReflection.ltcb.ls");
        this.scene.reflectionDecodingFormat = 1;
        this.scene.reflectionIntensity = 1;
        this.depthNormalPlane = this.scene.addChild(Laya.Loader.getRes("res/threeDimen/LayaScene_depthNormalScene/Conventional/depthNormalPlane.lh"));
        this.depthPlane = this.scene.addChild(Laya.Loader.getRes("res/threeDimen/LayaScene_depthNormalScene/Conventional/depthPlane.lh"));
        this.scene.addChild(Laya.Loader.getRes("res/threeDimen/LayaScene_depthNormalScene/Conventional/depthscene.lh"));
        var camera = this.scene.addChild(Laya.Loader.getRes("res/threeDimen/LayaScene_depthNormalScene/Conventional/Main Camera.lh"));
        camera.depthTextureMode |= Laya.DepthTextureMode.Depth;
        this.depthPlane.meshRenderer.sharedMaterial = new DepthMaterial();
        camera.depthTextureMode |= Laya.DepthTextureMode.DepthNormals;
        this.depthNormalPlane.meshRenderer.sharedMaterial = new DepthNormalsMaterial();
    }
}

new CameraDepthModeTextureDemo();