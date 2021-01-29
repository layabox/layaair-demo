package LayaAir3D_Advance{
	import DepthNormalShader.DepthMaterial;
	import DepthNormalShader.DepthNormalsMaterial;
	import laya.d3.core.Camera;
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.depthMap.DepthPass;
	import laya.d3.math.Vector3;
	import laya.d3.resource.TextureCube;
	import laya.d3.shader.Shader3D;
	import laya.display.Stage;
	import laya.net.Loader;  
	import laya.net.URL;
	import laya.utils.Handler;
	import laya.utils.Stat;
    import laya.d3.graphics.Vertex.VertexMesh;
    import laya.d3.shader.Shader3D;
    import laya.d3.shader.SubShader;
	import laya.d3.depthMap.DepthTextureMode;
	
	public class CameraDepthModeTextureDemo {

		public function CameraDepthModeTextureDemo() {
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			Stat.show();
			Shader3D.debugMode = true;
			this.initDepthMaterial();
			this.initDepthNormalsMaterial();
			this.PreloadingRes();
	}
		private function PreloadingRes() {
			var resource = ["res/threeDimen/LayaScene_depthNormalScene/Conventional/depthNormalPlane.lh",
				"res/threeDimen/LayaScene_depthNormalScene/Conventional/depthPlane.lh",
				"res/threeDimen/LayaScene_depthNormalScene/Conventional/depthscene.lh",
				"res/threeDimen/LayaScene_depthNormalScene/Conventional/Main Camera.lh",
				"res/threeDimen/LayaScene_depthNormalScene/Conventional/Assets/Scenes/depthNormalSceneGIReflection.ltcb.ls"
			];
			Laya.loader.create(resource, Handler.create(this, this.onPreLoadFinish));
		}
		private function onPreLoadFinish() {
			this.scene = Laya.stage.addChild(new Scene3D());
			this.scene.ambientColor = new Vector3(0.858, 0.858, 0.858);
			this.scene.reflection = Loader.getRes("res/threeDimen/LayaScene_depthNormalScene/Conventional/Assets/Scenes/depthNormalSceneGIReflection.ltcb.ls");
			this.scene.reflectionDecodingFormat = 1;
			this.scene.reflectionIntensity = 1;
			this.depthNormalPlane = this.scene.addChild(Loader.getRes("res/threeDimen/LayaScene_depthNormalScene/Conventional/depthNormalPlane.lh"));
			this.depthPlane = this.scene.addChild(Loader.getRes("res/threeDimen/LayaScene_depthNormalScene/Conventional/depthPlane.lh"));
			this.scene.addChild(Loader.getRes("res/threeDimen/LayaScene_depthNormalScene/Conventional/depthscene.lh"));
			var camera = this.scene.addChild(Loader.getRes("res/threeDimen/LayaScene_depthNormalScene/Conventional/Main Camera.lh"));
			camera.depthTextureMode |= DepthTextureMode.Depth;
			this.depthPlane.meshRenderer.sharedMaterial = new DepthMaterial();
			camera.depthTextureMode |= DepthTextureMode.DepthNormals;
			this.depthNormalPlane.meshRenderer.sharedMaterial = new DepthNormalsMaterial();
		}

		public function initDepthMaterial() {
			var DepthVS = "#if defined(GL_FRAGMENT_PRECISION_HIGH)\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n#include \"Lighting.glsl\";\r\nattribute vec4 a_Position;\r\n\r\nattribute vec2 a_Texcoord0;\r\nvarying vec2 v_Texcoord0;\r\n\r\nuniform mat4 u_MvpMatrix;\r\n\r\nvoid main() {\r\n    vec4 position;\r\n    position=a_Position;\r\n    v_Texcoord0=a_Texcoord0;\r\n    gl_Position = u_MvpMatrix * position;\r\n    gl_Position=remapGLPositionZ(gl_Position);\r\n}";

            var DepthFS = "#if defined(GL_FRAGMENT_PRECISION_HIGH)\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n\r\n#include \"DepthNormalUtil.glsl\";\r\n\r\n\r\nvarying vec2 v_Texcoord0;\r\n\r\nvoid main(){\r\n    vec4 col;\r\n    vec2 uv = vec2(v_Texcoord0.x,1.0-v_Texcoord0.y);\r\n    float depth = SAMPLE_DEPTH_TEXTURE(u_CameraDepthTexture,uv);\r\n    depth =Linear01Depth(depth,u_ZBufferParams);\r\n    col = vec4(depth,depth,depth,1.0);\r\n    gl_FragColor = col;\r\n}";
            var attributeMap = {
                'a_Position': VertexMesh.MESH_POSITION0,
                'a_Normal': VertexMesh.MESH_NORMAL0,
                'a_Texcoord0': VertexMesh.MESH_TEXTURECOORDINATE0,
                'a_Tangent0': VertexMesh.MESH_TANGENT0
            };
            var uniformMap = {
                'u_CameraDepthNormalsTexture': Shader3D.PERIOD_CAMERA,
                'u_CameraDepthTexture': Shader3D.PERIOD_CAMERA,
                'u_ZBufferParams': Shader3D.PERIOD_CAMERA,
                'u_MvpMatrix': Shader3D.PERIOD_SPRITE
            };
            var stateMap = {
                's_Cull': Shader3D.RENDER_STATE_CULL,
                's_Blend': Shader3D.RENDER_STATE_BLEND,
                's_BlendSrc': Shader3D.RENDER_STATE_BLEND_SRC,
                's_BlendDst': Shader3D.RENDER_STATE_BLEND_DST,
                's_DepthTest': Shader3D.RENDER_STATE_DEPTH_TEST,
                's_DepthWrite': Shader3D.RENDER_STATE_DEPTH_WRITE
            };
            var shader = Shader3D.add("DepthShader", null, null, false, false);
            var subShader = new SubShader(attributeMap, uniformMap);
            shader.addSubShader(subShader);
            subShader.addShaderPass(DepthVS, DepthFS, stateMap, "Forward");
        }

		public function initDepthNormalsMaterial() {
		    var DepthNormalVS = "#if defined(GL_FRAGMENT_PRECISION_HIGH)\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n#include \"Lighting.glsl\";\r\nattribute vec4 a_Position;\r\n\r\nattribute vec2 a_Texcoord0;\r\nvarying vec2 v_Texcoord0;\r\n\r\nuniform mat4 u_MvpMatrix;\r\n\r\nvoid main() {\r\n    vec4 position;\r\n    position=a_Position;\r\n    v_Texcoord0=a_Texcoord0;\r\n    gl_Position = u_MvpMatrix * position;\r\n    gl_Position=remapGLPositionZ(gl_Position);\r\n}";

            var DepthNormalFS = "#if defined(GL_FRAGMENT_PRECISION_HIGH)\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n\r\n#include \"DepthNormalUtil.glsl\";\r\n\r\n\r\nvarying vec2 v_Texcoord0;\r\n\r\nvoid main(){\r\n    vec2 uv = vec2(v_Texcoord0.x,1.0-v_Texcoord0.y);\r\n    vec4 col = texture2D(u_CameraDepthNormalsTexture,uv);\r\n    vec3 normals;\r\n    float depth;\r\n    DecodeDepthNormal(col,depth,normals);\r\n    col = vec4(normals,1.0);\r\n    gl_FragColor = col;\r\n}";
            var attributeMap = {
                'a_Position': VertexMesh.MESH_POSITION0,
                'a_Normal': VertexMesh.MESH_NORMAL0,
                'a_Texcoord0': VertexMesh.MESH_TEXTURECOORDINATE0,
                'a_Tangent0': VertexMesh.MESH_TANGENT0
            };
            var uniformMap = {
                'u_CameraDepthNormalsTexture': Shader3D.PERIOD_CAMERA,
                'u_CameraDepthTexture': Shader3D.PERIOD_CAMERA,
                'u_MvpMatrix': Shader3D.PERIOD_SPRITE
            };
            var stateMap = {
                's_Cull': Shader3D.RENDER_STATE_CULL,
                's_Blend': Shader3D.RENDER_STATE_BLEND,
                's_BlendSrc': Shader3D.RENDER_STATE_BLEND_SRC,
                's_BlendDst': Shader3D.RENDER_STATE_BLEND_DST,
                's_DepthTest': Shader3D.RENDER_STATE_DEPTH_TEST,
                's_DepthWrite': Shader3D.RENDER_STATE_DEPTH_WRITE
            };
            var shader = Shader3D.add("DepthNormalShader", null, null, false, false);
            var subShader = new SubShader(attributeMap, uniformMap);
            shader.addSubShader(subShader);
            subShader.addShaderPass(DepthNormalVS, DepthNormalFS, stateMap, "Forward");
        }
}