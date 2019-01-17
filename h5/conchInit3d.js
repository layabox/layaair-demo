function GetQueryString(name){
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null)return  unescape(r[2]); return null;
}

var id = GetQueryString("id") || 0;

var list = [
	"advancedModule/AStarFindPath",
	"advancedModule/GarbageCollection",
	"advancedModule/Laya3DCombineHtml",
	"advancedModule/PBRDemo",
	"advancedModule/RealTimeShadow",
	"advancedModule/RenderTextureDemo",
	"advancedModule/ScriptSample",
	"advancedModule/TouchScriptSample",
	"advancedModule/TrailRender",
	"animationModule/AnimationLayerBlend",
	"animationModule/BoneLinkSprite3D",
	"animationModule/SkinAnimationSample",
	"cameraModule/D3SpaceToD2Space",
	"cameraModule/MultiCamera",
	"cameraModule/OrthographicCamera",
	"lightModule/DirectionLightDemo",
	"lightModule/PointLightDemo",
	"lightModule/SpotLightDemo",
	"materialModule/BlinnPhongMaterialLoad",
	"materialModule/BlinnPhong_DiffuseMap",
	"materialModule/BlinnPhong_NormalMap",
	"materialModule/BlinnPhong_SpecularMap",
	"materialModule/PBRStandardMaterialDemo",
	"meshModule/CustomMesh",
	"meshModule/MeshLoad",
	"particleModule/Particle_BurningGround",
	"particleModule/Particle_EternalLight",
	"particleModule/Particle_Scene",
	"physicsModule/PhysicsWorld_BaseCollider",
	"physicsModule/PhysicsWorld_BuildingBlocks",
	"physicsModule/PhysicsWorld_Character",
	"physicsModule/PhysicsWorld_CollisionFiflter",
	"physicsModule/PhysicsWorld_CompoundCollider",
	"physicsModule/PhysicsWorld_ContinueCollisionDetection",
	"physicsModule/PhysicsWorld_Kinematic",
	"physicsModule/PhysicsWorld_MeshCollider",
	"physicsModule/PhysicsWorld_RayShapeCast",
	"physicsModule/PhysicsWorld_TriggerAndCollisionEvent",
	"sceneModule/SceneLoad1",
	"sceneModule/SceneLoad2",
	"shaderModule/Shader_GlowingEdge",
	"shaderModule/Shader_Simple",
	"shaderModule/Shader_Terrain",
	"skyModule/Sky_Procedural",
	"skyModule/SkyDomeSample",
	"sprite3dModule/Sprite3DClone",
	"sprite3dModule/Sprite3DLoad",
	"sprite3dModule/Sprite3DTransform",	
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
 