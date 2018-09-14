function GetQueryString(name){
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null)return  unescape(r[2]); return null;
}

var id = GetQueryString("id") || 0;

var list = [
	"Animation_Altas", // 0
	"Animation_SWF",
	"BlendMode_Lighter",
	"Debug_FPSStats",
	"Filters_Blur",
	"Filters_Color", // 5
	"Filters_Glow",
	"Interaction_CustomEvent",
	"Interaction_Drag",
	"Interaction_FixInteractiveRegion",
	"Interaction_Hold", // 10
	"Interaction_Keyboard",
	"Interaction_Mouse",
	"Interaction_Rotate",
	"Interaction_Scale",
	"Interaction_Swipe", // 15
	"Loader_MultipleType",
	"Loader_ProgressAndErrorHandle",
	"Loader_Sequence",
	"Loader_SingleType",
	"Network_GET", // 20
	"Network_POST",
	"Network_ProtocolBuffer",
	"Network_Socket",
	"Network_XML",
	"Particle_T1", // 25
	"Particle_T2",
	"Particle_T3",
	"PerformanceTest_Cartoon",
	"PerformanceTest_Legend",
	"PerformanceTest_Maggots", // 30
	"PerformanceTest_Skeleton",
	"Physics_Cloth",
	"Physics_NewtonsCradle",
	"Physics_Slingshot",
	"SmartScale_Align_Contral", // 35
	"SmartScale_Landscape",
	"SmartScale_Portrait",
	"SmartScale_Scale_EXTRACT_FIT",
	"SmartScale_Scale_NOBORDER",
	"SmartScale_Scale_NOSCALE", // 40
	"SmartScale_Scale_SHOW_ALL",
	"SmartScale_T",
	"Sound_SimpleDemo",
	"Sprite_Cache",
	"Sprite_Container", // 45
	"Sprite_DisplayImage",
	"Sprite_DrawPath",
	"Sprite_DrawShapes",
	"Sprite_MagnifyingGlass",
	"Sprite_NodeControl", // 50
	"Sprite_Pivot",
	"Sprite_RoateAndScale",
	"Sprite_SwitchTexture",
	"Text_AutoSize",
	"Text_BitmapFont", // 55
	"Text_ComplexStyle",
	"Text_Editable",
	"Text_HTML",
	"Text_InputMultiline",
	"Text_InputSingleline", // 60
	"Text_MaxChars",
	"Text_Overflow",
	"Text_Prompt",
	"Text_Restrict",
	"Text_Scroll", // 65
	"Text_Underline",
	"Text_WordWrap",
	"TiledMap_AnimationTile",
	"TiledMap_IsometricWorld",
	"TiledMap_PerspectiveWall", // 70
	"TiledMap_ScrollMap",
	"Timer_CallLater",
	"Timer_DelayExcute",
	"Timer_Interval",
	"Tween_EaseFunctionsDemo", // 75
	"Tween_Letters",
	"Tween_SimpleSample",
	"Tween_TimeLine",
	"UI_Button",
	"UI_CheckBox", // 80
	"UI_Clip",
	"UI_ColorPicker",
	"UI_ComboBox",
	"UI_Dialog",
	"UI_Image", // 85
	"UI_Input",
	"UI_Label",
	"UI_List",
	"UI_ProgressBar",
	"UI_RadioGroup", // 90
	"UI_ScrollBar",
	"UI_Slider",
	"UI_Tab",
	"UI_TextArea",
	"UI_Tree", // 95
	"InputDevice_Map",
	"InputDevice_Media",
	"InputDevice_Shake",
	"InputDevice_Video",
	"PerformanceTest_Cartoon2", // 100
	"PIXI_Example_04",
	"PIXI_Example_05",
	"PIXI_Example_21",
	"PIXI_Example_23",
	"Skeleton_ChangeSkin", // 105
	"Skeleton_MultiTexture",
	"Skeleton_SpineEvent",
	"Skeleton_SpineIkMesh",
	"Skeleton_SpineStretchyman",
	"Skeleton_SpineVine", // 110
	"Sprite_Guide"
 ];

 var url="2d/js/"+list[id]+".js";
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
 