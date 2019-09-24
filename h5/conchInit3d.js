function GetQueryString(name){
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null)return  unescape(r[2]); return null;
}

var id = GetQueryString("id") || 0;

 var list = [
	"LayaAir3D_Advance/AStarFindPath",
	"LayaAir3D_Advance/Laya3DCombineHtml",
	"LayaAir3D_Advance/Scene2DPlayer3D",
	"LayaAir3D_Advance/Secne3DPlayer2D",
	"LayaAir3D_Animation/AnimationEventByUnity",
	"LayaAir3D_Animation/AnimationLayerBlend",
	"LayaAir3D_Animation/AnimatorDemo",
	"LayaAir3D_Animation/AnimatorStateScriptDemo",
	"LayaAir3D_Animation/BoneLinkSprite3D",
	"LayaAir3D_Animation/CameraAnimation",
	"LayaAir3D_Animation/MaterialAnimation",
	"LayaAir3D_Animation/RigidbodyAnimationDemo",
	"LayaAir3D_Animation/SkinAnimationSample",
	"LayaAir3D_Camera/CameraDemo",
	"LayaAir3D_Camera/CameraLayer",
	"LayaAir3D_Camera/CameraLookAt",
	"LayaAir3D_Camera/CameraRay",
	"LayaAir3D_Camera/D3SpaceToD2Space",
	"LayaAir3D_Camera/MultiCamera",
	"LayaAir3D_Camera/OrthographicCamera",
	"LayaAir3D_Camera/RenderTargetCamera",
	"LayaAir3D_Lighting/MultiLight",
	"LayaAir3D_Lighting/PointLightDemo",
	"LayaAir3D_Lighting/SpotLightDemo",
	"LayaAir3D_Lighting/RealTimeShadow",
	"LayaAir3D_Lighting/RealTimeShadow",
	"LayaAir3D_Material/BlinnPhong_DiffuseMap",
	"LayaAir3D_Material/BlinnPhong_NormalMap",
	"LayaAir3D_Material/BlinnPhong_SpecularMap",
	"LayaAir3D_Material/BlinnPhongMaterialLoad",
	"LayaAir3D_Material/EffectMaterialDemo",
	"LayaAir3D_Material/MaterialDemo",
	"LayaAir3D_Material/PBRStandardMaterialDemo",
	"LayaAir3D_Material/UnlitMaterialDemo",
	"LayaAir3D_Material/WaterPrimaryMaterialDemo",
	"LayaAir3D_Mesh/MeshLoad",
	"LayaAir3D_Mesh/CustomMesh",
	"LayaAir3D_Mesh/ChangeMesh",
	"LayaAir3D_MouseInteraction/MouseInteraction",
	"LayaAir3D_MouseInteraction/MultiTouch",
	"LayaAir3D_Particle/Particle_Scene",
	"LayaAir3D_Particle/Particle_BurningGround",
	"LayaAir3D_Particle/Particle_EternalLight",
	"LayaAir3D_Performance/StaticBatchingTest",
	"LayaAir3D_Physics/PhysicsWorld_BaseCollider",
	"LayaAir3D_Physics/PhysicsWorld_BuildingBlocks",
	"LayaAir3D_Physics/PhysicsWorld_Character",
	"LayaAir3D_Physics/PhysicsWorld_CollisionFiflter",	
	"LayaAir3D_Physics/PhysicsWorld_CompoundCollider",
	"LayaAir3D_Physics/PhysicsWorld_ContinueCollisionDetection",
	"LayaAir3D_Physics/PhysicsWorld_Kinematic",
	"LayaAir3D_Physics/PhysicsWorld_MeshCollider",
	"LayaAir3D_Physics/PhysicsWorld_RayShapeCast",
	"LayaAir3D_Physics/PhysicsWorld_TriggerAndCollisionEvent",
	"LayaAir3D_Resource/LoadResourceDemo",
	"LayaAir3D_Resource/GarbageCollection",	
	"LayaAir3D_Scene3D/SceneLoad1",
	"LayaAir3D_Scene3D/SceneLoad2",
	"LayaAir3D_Scene3D/EnvironmentalReflection",
	"LayaAir3D_Scene3D/LightmapScene",
	"LayaAir3D_Script/ScriptDemo",
	"LayaAir3D_Shader/Shader_Simple",
	"LayaAir3D_Shader/Shader_GlowingEdge",
	"LayaAir3D_Shader/Shader_Terrain",	
	"LayaAir3D_Shader/Shader_CartoonRender",
	"LayaAir3D_Sky/Sky_SkyBox",
	"LayaAir3D_Sky/Sky_Procedural",	
	"LayaAir3D_Sprite3D/Sprite3DLoad",
	"LayaAir3D_Sprite3D/Sprite3DClone",
	"LayaAir3D_Sprite3D/Sprite3DParent",
	"LayaAir3D_Sprite3D/TransformDemo",	
	"LayaAir3D_Sprite3D/Sprite3DLayer",
	"LayaAir3D_Sprite3D/TransformDemo",
	"LayaAir3D_Sprite3D/PixelLineSprite3DDemo",	
	"LayaAir3D_Sprite3D/SkinnedMeshSprite3DDemo",
	"LayaAir3D_Sprite3D/ScriptSample",
	"LayaAir3D_Texture/TextureDemo",
	"LayaAir3D_Texture/TextureGPUCompression",	
	"LayaAir3D_Texture/RenderTextureDemo",
	"LayaAir3D_Trail/TrailDemo",
	"LayaAir3D_Trail/TrailRender",	


 ];

 var url="3d/js/"+list[id]+".js";
 var xhr = new XMLHttpRequest();
 xhr.open('GET',url,true);
 xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded"); 
 xhr.onerror=function(e){
	 alert('onerr');
 }
//if(window.conch)
//PerfShow(true);

 xhr.onload=function(e){
    
     window._mouselist=[];
	 
	 function addMouse(t){
	   if(window._mouselist.length<3)
	     window._mouselist.push(t);
	   else
	   {
	      window._mouselist.shift();
		  window._mouselist.push(t);
	   }
	   if(window._mouselist.length==3)
		{
		    return (window._mouselist[0]+window._mouselist[1]+window._mouselist[2])<=window._mouselist[0]*3+500;
		}
		else
		{
		  return false;
		}
	 }
	 // window.conch&&conch.showLoadingView(false);
     window.eval(xhr.responseText);
	 var mousetype=('ontouchstart' in window)?"touchstart":"mousedown";

	

	 function loadNewPage()
	 {
		id++
		var pre=location.protocol+"//"+location.host+location.pathname;
		var url=pre+"?id="+id;
		console.log(">>>>>>>@@@@@@@@@@@@@@@="+url);
	    window.location.href=url;
	 }
	 document.addEventListener(mousetype,function(e){
	   if(addMouse(Date.now()))
	   {
			loadNewPage();
	   }
	 
	 });
	 
	 
	 window.document.addEventListener('keydown', function (e) {
    switch (e.keyCode) {

        case 82:
            loadNewPage();
            break;
    }
});
	 
	 
	 
 }
 xhr.send();//
 