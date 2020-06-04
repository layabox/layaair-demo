var libs = "";
var script_tags = document.querySelectorAll("script");
for (var i = 0; i < script_tags.length; i++)
{
	var tag = script_tags[i];
	var src = tag.src;
	if (src.indexOf("core") > -1)
		libs += 'Core';
	else if (src.indexOf("webgl") > -1)
		libs += "WebGL";
	else if (src.indexOf("ani") > -1)
		libs += "Animation";
	else if (src.indexOf("tiledmap") > -1)
		libs += "TiledMap";
	else if (src.indexOf("filter") > -1)
		libs += "Filter";
	else if (src.indexOf("particle") > -1)
		libs += "Particle";
	else if (src.indexOf("html") > -1)
		libs += "HTML";
	else if (src.indexOf("ui") > -1)
		libs += "UI";
	else if (src.indexOf("device") > -1)
		libs += "Device";
	else if (src.indexOf("baidu") > -1)
		libs += "Baidu Map API";
	else if (src.indexOf("bytebuffer") > -1)
		libs += "bytebuffer.js";
	else if (src.indexOf("protobuf") > -1)
		libs += "protobuf.js";
	else if (src.indexOf("matter") > -1)
		libs += "matter.js";
	else if (src.indexOf("LayaRender") > -1)
		libs += "LayaRender.js";
	else if (src.indexOf("LayaUISample") > -1)
		libs += "IDE导出的文件";
	else if (src.indexOf("laya.d3.min.js") > -1)
		libs += "3D";
	else if (src.indexOf("astar") > -1)
		libs += "astar.js";
	else if (src.indexOf("cannon") > -1)
		libs += "cannon.js";
	else if (src.indexOf("d3Plugin") > -1)
		libs += "d3Plugin";
	else if (src.indexOf("common/CameraMoveScript.js") > -1)
		libs += "CameraMoveScript.js";
	else if (src.indexOf("common/VRCameraMoveScript.js") > -1)
		libs += "VRCameraMoveScript.js";
	else if (src.indexOf("common/AnimatorStateScriptTest.js") > -1)
		libs += "AnimatorStateScriptTest.js";
	else if (src.indexOf("common/CustomAnimatorStateScript.js") > -1)
		libs += "CustomAnimatorStateScript.js";
	else if (src.indexOf("GlitterStripSampler") > -1)
		libs += "GlitterStripSampler.js";
	else if (src.indexOf("CustomMaterial") > -1)
		libs += "CustomMaterial.js";
	else
		continue;

	libs += ",";
}
ref_libs.setAttribute("content", libs.substr(0, -1));

window.onload = function()
{
	if (top == window)
	{
		var demo_full_name = location.href.substring(
			location.href.lastIndexOf('/') + 1,
			location.href.lastIndexOf('.'));

		var url = "../../";
		if (demo_full_name.indexOf("D3") == 0)
			url += "3d";
		else
			url += "2d";
		url += "/js/" + demo_full_name + ".js";

		loader = new XMLHttpRequest();
		loader.open("GET", url);
		loader.send(null);
		loader.onreadystatechange = OnStateChange;
	}
};

function OnStateChange()
{
	if (loader.readyState == 4)
	{ // 4 = "loaded"
		if (loader.status == 200)
		{ // 200 = OK
			LoadDemo(loader.responseText);
		}
		else
		{
			alert("Problem retrieving js file");
		}
	}
}

function LoadDemo(script)
{
	document.getElementById("demo_script").innerHTML = script;
}