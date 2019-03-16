$(document).ready(function()
{
	var demo_frame = document.getElementById("demo_frame");
	var demo;
	var languagePack = {};
	var descriptions = {};
	var libraries = {};
	var code_loaded;
	var demo_loaded;
	var lang = 'js';
	var g_lang = 'js';

	////////////////////////////
	// initialize code editer //
	////////////////////////////
	as_editor = CreateEditor("asPre", true, "ace/mode/actionscript");
	js_editor = CreateEditor("jsPre", false, "ace/mode/javascript");
	ts_editor = CreateEditor("tsPre", true, "ace/mode/typescript");

	function CreateEditor(dom_id, read_only, mode)
	{
		var editor = ace.edit(dom_id);
		editor.renderer.setScrollMargin(10, 10, 10, 10);
		editor.setAutoScrollEditorIntoView(true);
		editor.setReadOnly(read_only);
		editor.setShowPrintMargin(false);
		editor.$blockScrolling = Infinity;
		editor.setTheme("ace/theme/monokai");
		editor.setFontSize(16);
		editor.getSession().setMode(mode);
		return editor;
	}

	////////////////////////
	// regiestr dom event //
	////////////////////////
	$("#execButton").click(execCode);
	$("#resetButton").click(resetCode);
	$("#openInNewTabButton").click(openInNewTab);
	$("#showGithubCodeButton").click(showGithubCode);

	///////////////////////////////////////////////////////
	// read manifest.json, and fill the list on the left //
	///////////////////////////////////////////////////////
	var suite_accordion_2d = $('#accordion_2d');
	var suite_accordion_3d = $('#accordion_3d');
	var suite_drapdown = $('#bs-example-navbar-collapse-2').children();

	// 源元素用于克隆
	var origin_suite_element_PC = suite_accordion_2d.children();
	var origin_suite_element_mobile = suite_drapdown.children();
	var origin_presentation = origin_suite_element_PC.find("li[role='presentation']");
	var origin_dropdown_li = origin_suite_element_mobile.find("ul[class='dropdown-menu']").children();

	// 从DOM渲染列表中移除
	origin_suite_element_PC.remove();
	origin_presentation.remove();
	origin_suite_element_mobile.remove();
	origin_dropdown_li.remove();

	function getQueryString(name, src) {
		if(!src) src = window.location.search.substr(1);
	    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	    var r = src.match(reg);
	    if (r != null) return unescape(r[2]); return null;
	}

	function parseToSearchUrl(key) {
		var keyArr = key.split("&");
		return "language=" + (language ? language : 'ch') + "&category=" + keyArr[0] + "&group=" + keyArr[1] + "&name=" + keyArr[2];
	}

	var isOldVersion = false;
	// if (!location.search)
	// {
		// var isChinese = navigator.language.indexOf('zh') !== -1;
		// if(!isChinese)
		// 	location.search = "language=en&category=2d&group=Sprite&name=DisplayImage";
		// else
		// 	location.search = "language=ch&category=2d&group=Sprite&name=DisplayImage";
	// } else {
	var tmpLang = getQueryString("language");

	var searchSplitArr = location.search.split("language=");
	isOldVersion = (-1 === searchSplitArr[searchSplitArr.length - 1].indexOf("="));
	if (isOldVersion) {
		var searchSplitAndArr = location.search.substr(1).split("&");
		if (tmpLang){
			searchSplitAndArr.shift();
		}
		var searchSplitStr = searchSplitAndArr.join("&");
		var parsedStr = parseToSearchUrl(searchSplitStr);
		var parsedSearchUrl = tmpLang ? ("language=" + tmpLang + "&" + parsedStr) : parsedStr;
		location.search = parsedSearchUrl;
	}
	// }
	demoArr = [
		getQueryString("language"),
		getQueryString("category"),
		getQueryString("group"),
		getQueryString("name")
	];
	var language = demoArr.shift();
	demo = demoArr.join("&");
	var manifest = 'res/manifest.json';
	if ("en" === language)
	{
		manifest = "res/manifest-en.json";

		openInNewTabButton.style.width = '170px';
		openInNewTabButton.lastElementChild.innerText = "Open in new tab"
		openInNewTabButton.nextElementSibling.lastElementChild.innerText = "Qr Code";
		execButton.lastElementChild.innerText = "Execute";
		resetButton.lastElementChild.innerText = "Reset";
		refLibs.previousElementSibling.innerText = "References: ";
		showGithubCodeButton.lastElementChild.innerText = 'SourceCode';
	}

	ReadFile(manifest, 'json', function(content)
	{
		$.each(content.manifest['2d'], function(index, category)
		{
			addCategory(category, '2d');
		});
		$.each(content.manifest['3d'], function(index, category)
		{
			addCategory(category, '3d');
		});



		//////

		caseTitle.innerText = languagePack[demo];
		NavToDemo(demo);

		// 展开默认选中
		switchTab(demoArr[0]);

		$('#collapse' + demoArr[1]).collapse('show');
		$('#collapse' + demoArr[1] + " a[demo='" + demo + "']").parent().addClass("active");
	}, function() {
		// 如果不是本地打开，return
		if (location.protocol.indexOf('file') == -1) {
			return;
		}
		// 获取本地资源出错
		// 可能得情况: 1) 没有使用本地服务器 2)直接打开并别没有关闭浏览器的安全限制
		if (language == 'en') {
			alert('Please turn off browser security restrictions or use local server access!');
		} else {
			alert('请关闭浏览器的安全限制或使用本地服务器访问！');
		}
	});

	function addCategory(category, type)
	{
		var demos = category.manifest;
		// PC列表
		var suite_element_PC = origin_suite_element_PC.clone(true);

		suite_element_PC.appendTo(type == "2d" ? suite_accordion_2d : suite_accordion_3d);
		suite_element_PC.find(".square").next().text(category.tr_zhCN);
		suite_element_PC.find(".badge").text(demos.length);

		var collapse_target = "collapse" + category.prefix;
		suite_element_PC.find('a').attr("href", '#' + collapse_target);
		$(suite_element_PC.children()[1]).attr('id', collapse_target);

		// Mobile列表
		var suite_element_mobile = origin_suite_element_mobile.clone(true).appendTo(suite_drapdown);
		suite_element_mobile.children('a').prepend(category.tr_zhCN);

		// Demo清单
		// PC列表容器
		var presentation_list = suite_element_PC.find('ul[role="tablist"]');
		// Mobile列表容器
		var dropdown_menu = suite_element_mobile.children("ul");

		$.each(demos, function(innerIndex, demo)
		{
			var full_name = type + '&' + category.prefix + '&' + demo[0];

			// PC子列表
			var presentatoin = origin_presentation.clone(true).appendTo(presentation_list);

			var a_element = presentatoin.children();
			a_element.attr("demo", full_name);
			a_element.text(demo[1]);
			a_element.click(gotoDemo);

			// Mobile子列表
			var dropdown_li = origin_dropdown_li.clone(true).appendTo(dropdown_menu);
			a_element = dropdown_li.children();
			a_element.attr("demo", full_name);
			a_element.text(demo[1]);
			a_element.click(gotoDemo);

			languagePack[full_name] = category.tr_zhCN + "--" + demo[1];
			descriptions[full_name] = demo[2];
			libraries[full_name] = demo[3];
		});
	}

	function gotoDemo(e)
	{
		$(".nav-stacked li").removeClass("active");
		demo = $(e.target).attr('demo');
		history.pushState("", "", "?" + parseToSearchUrl(demo));
		NavToDemo(demo);

		$(e.target).parent().addClass("active");
	}

	function NavToDemo(demo_full_name)
	{
		// todo
		GenerateQRCode(demo_frame.src + '?' + parseToSearchUrl(demo) + "&lib=" + libraries[demo]);

		caseTitle.innerText = languagePack[demo_full_name];
		document.title = languagePack[demo_full_name];

		LoadCode(demo_full_name, g_lang, OnCodeLoaded);
		
		if (g_lang != "js")
		{
			LoadCode(demo_full_name, "js", function(code)
			{
				var temp = g_lang;
				g_lang = "js";
				OnCodeLoaded(code);
				g_lang = temp;
			});
		}
	}

	function OnCodeLoaded(code)
	{
		SetEditorValue(g_lang, code);
		if (g_lang == "js")
		{
			// 使第一次undo失效，否则会undo到空文档
			setTimeout(function()
			{
				js_editor.getSession().getUndoManager().reset();
			}, 100);

			origin_js_code = code;
		}
		code_loaded = true;
		if (demo_loaded)
			OnDemoReady();
		else
			demo_frame.src = demo_frame.src;
	}

	function LoadCode(demo_full_name, lang, successCallback)
	{
		var p = demo_full_name.split('&');
		var path = 'h5/' + p[0] + '/' + lang + '/';
		if (p[0] == '2d')
		{
			path += p[1] + '_' + p[2] + '.' + lang;
		}
		else
		{
			path += p[1].toLowerCase() + 'Module' + '/';
			path += p[2];
			path += '.' + lang;
		}
		ReadFile(path, "text", successCallback);
	}


	demo_frame.onload = function()
	{
		demo_loaded = true;
		if (code_loaded)
			OnDemoReady();
	}

	function OnDemoReady()
	{
		demo_loaded = code_loaded = false;
		demo_frame.contentWindow.showWithCode(js_editor.getValue(), libraries[demo]);

		var desc_mate = demo_frame.contentWindow.document.head.lastElementChild;
		var reflibs_meta = desc_mate.previousElementSibling;

		descDiv.innerHTML = descriptions[demo];
		refLibs.innerHTML = libraries[demo].replace(/,/g, ' | ');
		addLinkFunc();
	}

	function addLinkFunc() {
		var innerHTML = refLibs.innerHTML;
		var libs = innerHTML.split(" | ");
		var 
			html = "",
			lib,
			libFullName;
		for (var i = 0, len = libs.length; i < len; i++) {
			if (!!html) {
				html += " | ";
			}
			lib = libs[i];
			libFullName = getLibFullName(lib);
			if (!libFullName || libFullName === "#") {
				html += lib;
			} else {
				html += '<span class="libs-link" data-lib="' + libFullName + '">' + lib + '</span>';
			}
			
		}
		refLibs.innerHTML = html;
		refLibs.addEventListener("click", function(e) {
			var target = e.target;
			if (target.className === "libs-link") {
				var lib = target.getAttribute("data-lib");
				showLibCode(lib);
			}
		}, false);
	}

	function showLibCode(libPath) {
		ReadFile("h5/libs/" + libPath, "text", function(code) { // successFunc
			console.error("success");
			OnCodeLoaded(code);
		}, function() { // errorFunc
			console.error("error");
		}); // url, dataType, callback, errorFunc
	}

	function getLibFullName(libName) {
		var libPath;
		switch(libName) {
			case "box2d":
				libPath = "box2d.js";
				break;
			case "bytebuffer":
				libPath = "bytebuffer.js";
				break;
			case "domparserinone":
				libPath = "domparserinone.js";
				break;
			case "ani":
				libPath = "laya.ani.js";
				break;
			case "core":
				libPath = "laya.core.js";
				break;
			case "d3":
				libPath = "laya.d3.js";
				break;
			case "d3Plugin":
				libPath = "laya.d3Plugin.js";
				break;
			case "debugtool":
				libPath = "laya.debugtool.js";
				break;
			case "device":
				libPath = "laya.device.js";
				break;
			case "filter":
				libPath = "laya.filter.js";
				break;
			case "html":
				libPath = "laya.html.js";
				break;
			case "particle":
				libPath = "laya.particle.js";
				break;
			case "pathfinding":
				libPath = "laya.pathfinding.js";
				break;
			case "physics":
				libPath = "laya.physics.js";
				break;
			case "physics3D":
				libPath = "laya.physics3D.js";
				break;
			case "physics3D.runtime":
				libPath = "laya.physics3D.runtime.js";
				break;
			case "physics3D.wasm":
				libPath = "laya.physics3D.wasm.js";
				break;
			case "physicsRender":
				libPath = "laya.physicsRender.js";
				break;
			case "tiledmap":
				libPath = "laya.tiledmap.js";
				break;
			case "ui":
				libPath = "laya.ui.js";
				break;
			case "webgl":
				libPath = "laya.webgl.js";
				break;
			case "wxmini":
				libPath = "laya.wxmini.js";
				break;
			case "LayaRender":
				libPath = "LayaRender.js";
				break;
			case "LayaUISample.max.all":
				libPath = "LayaUISample.max.all.js";
				break;
			case "load_demo":
				libPath = "laya.load_demo.js";
				break;
			case "matter-RenderLaya":
				libPath = "matter-RenderLaya.js";
				break;
			case "matter":
				libPath = "matter.js";
				break;
			case "MousePickingScene":
				libPath = "MousePickingScene.js";
				break;
			case "OESVertexArrayObject-polyfill":
				libPath = "OESVertexArrayObject-polyfill.js";
				break;
			case "protobuf":
				libPath = "protobuf.js";
				break;
			case "worker":
				libPath = "worker.js";
				break;
			default:
				libPath = "";
		}
		return libPath;
	}

	function resetCode(e)
	{
		if (g_lang != "js")
			return;

		SetEditorValue('js', origin_js_code);
		code_loaded = true;
		demo_frame.src = demo_frame.src;
	}

	function showGithubCode() {
		// 显示github代码
		let search = window.location.search;
		let 
			category = search.match(/category=(.+?)&/)[1],
			group = search.match(/group=(.+?)&/)[1],
			name = search.match(/name=(.+?)$/)[1];
		// let fileName = group + '_' + name + '.' + g_lang;
		// var filePath = category + '/' + g_lang + '/' + fileName;
		var filePath = getFilePath(category, group, name);
		let githubLink = 'https://github.com/layabox/layaair-demo/tree/master/' + filePath;
		window.open(githubLink);
	}

	/**
	 * 获取该分类下源码路径
	 * @param {*} category 
	 * @param {*} group 
	 * @param {*} name 
	 */
	function getFilePath(category, group, name) {
		var path = 'h5/' + category + '/' + g_lang + '/';
		if (category == '2d') {
			path += group + '_' + name + '.' + g_lang;
		} else {
			path += group.toLowerCase() + 'Module' + '/';
			path += name;
			path += '.' + g_lang;
		}
		return path;
	}

	function openInNewTab()
	{
		window.open(demo_frame.src + '?' + parseToSearchUrl(demo) + "&lib=" + libraries[demo]);
	}

	// function ViewSwf()
	// {
	// 	var path;
	// 	if (location.pathname.indexOf("index.html") > -1)
	// 		path = location.origin + location.pathname.replace("index.html", "swfindex.html") + location.search;
	// 	else
	// 		path = location.origin + location.pathname + "swfindex.html" + location.search;
	// 	window.open(path);
	// }

	function GenerateQRCode(url)
	{
		var qr_container = document.getElementById("qr");
		if (qr_container.children.length > 0)
			qr_container.removeChild(qr_container.children[0]);

		var kael_QR = new KaelQrcode();
		kael_QR.init(qr_container,
		{
			text: url,
			size: 250
		});
	}

	function execCode()
	{
		if (g_lang != "js")
			return;

		code_loaded = true;
		demo_frame.src = demo_frame.src;
	}

	function SetEditorValue(lang, code)
	{
		var editor = window[lang + "_editor"];
		editor.setValue(code);

		editor.resize();
		editor.moveCursorTo(0);
	}

	window.onpopstate = function()
	{
		$(".nav-stacked li").removeClass("active");
		var demo_full_name = location.search.substr(1);
		demo = demo_full_name = getQueryString("category", demo_full_name)
			+ "&" + getQueryString("group", demo_full_name)
			+ "&" + getQueryString("name", demo_full_name);

		NavToDemo(demo_full_name);
	}

	$("#myTabs>li>a").on("show.bs.tab", function(e)
	{
		var lang = $(e.target).attr("aria-controls");
		g_lang = lang;

		LoadCode(demo, lang, function(code)
		{
			SetEditorValue(lang, code);
		});

		if (lang == "js")
			$(".code-control-btn-group [type=button]").removeClass("disabled");
		else
			$(".code-control-btn-group [type=button]").addClass("disabled");
	});

	function ReadFile(url, dataType, callback, errorFunc)
	{
		$.ajax(url,
		{
			dataType: dataType,
			success: callback,
			error: function()
			{
				console.log(arguments);
				errorFunc instanceof Function && errorFunc();
			}
		});
	}
	/**
	 * 切换顶部tab，2d和3d分类
	 * @param  {[type]} type 2d | 3d
	 */
	function switchTab(type)
	{
		if (type == '2d')
		{
			// 打开2d accordion的第一项列表
			$('#accordion_2d').children(":first").children().eq(1).collapse('show');
			$('.demo_category a[href="#2d_demo"]').tab('show');
		}
		else
		{
			// 打开3d accordion的第一项列表
			$('#accordion_3d').children(":first").children().eq(1).collapse('show');
			$('.demo_category a[href="#3d_demo"]').tab('show');
		}
	}
});