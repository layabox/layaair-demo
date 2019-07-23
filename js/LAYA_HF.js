"use strict";
/*LayaConfig*/
var laya_http = (window.location.protocol == 'https:') ? 'https://' : 'http://';
var laya_config = {
    "domainName": laya_http + "official.layabox.com"
};//official.layabox.com

/*默认配置*/
if (typeof(overseas) == "undefined") {
    var overseas = "";
}
var laya_zh = "";
var laya_en = "?language=en";

/*设置语言*/
var language = request("language");
var language_name = "";
var lang_param = "";
var lang_andparam = "";
var visual = 1;
if (!retunOS(overseas)) {
    /*国内*/
    if (language !== "" && language == "en") {
        lang_param = "?language=" + language;
        lang_andparam = "language=" + language + "&";
    } else {
        language = "zh";
    }
} else {
    /*国外*/
    var visual = 0;
    laya_zh = "?language=zh";
    if (language !== "" && language == "zh") {
        lang_param = "?language=" + language;
        lang_andparam = "language=" + language + "&";
    } else {
        language = "en";
        lang_param = "?language=" + language;
        lang_andparam = "language=" + language + "&";
    }
}
if (language == "zh") {
    language_name = "Chinese"
} else if (language == "en") {
    language_name = "English"
}

/*LAYABOX动态创建*/

//LAYA导航
function laya_nav(laya) {
    //导航目录json
    var nav_json = [];
    //语言json
    var language_json = [];
    //副导航目录json
    var assisted_json = [];
    //判断页面类型
    if (laya == "layabox") {
        nav_json = [
            {
                "title": {
                    "zh": "首页",
                    "en": "Home Page"
                },
                "url": {
                    "zh": laya_http + "www.layabox.com/" + lang_param,
                    "en": laya_http + "www.layabox.com/" + lang_param
                },
                "visual": {
                    "zh": 1,
                    "en": 1
                },
                "blank": "0"
            }, {
                "title": {
                    "zh": "服务",
                    "en": "Products"
                },
                "url": {
                    "zh": laya_http + "www.layabox.com/product/" + lang_param,
                    "en": laya_http + "www.layabox.com/product/" + lang_param
                },
                "visual": {
                    "zh": 1,
                    "en": 1
                },
                "blank": "0"
            }, {
                "title": {
                    "zh": "案例",
                    "en": "Showcase"
                },
                "url": {
                    "zh": laya_http + "www.layabox.com/gamelist/" + lang_param,
                    "en": laya_http + "www.layabox.com/gamelist/" + lang_param
                },
                "visual": {
                    "zh": 1,
                    "en": 1
                },
                "blank": "0"
            }, {
                "title": {
                    "zh": "新闻",
                    "en": "News"
                },
                "url": {
                    "zh": laya_http + "www.layabox.com/news/" + lang_param,
                    "en": laya_http + "www.layabox.com/news/" + lang_param
                },
                "visual": {
                    "zh": 1,
                    "en": 1
                },
                "blank": "0"
            }, {
                "title": {
                    "zh": "开发者中心",
                    "en": "Dev Center"
                },
                "url": {
                    "zh": laya_http + "ldc.layabox.com/" + lang_param,
                    "en": laya_http + "ldc.layabox.com/" + lang_param
                },
                "visual": {
                    "zh": 1,
                    "en": 1
                },
                "blank": "1"
            }, {
                "title": {
                    "zh": "开发者社区",
                    "en": "Developers Community"
                },
                "url": {
                    "zh": laya_http + "ask.layabox.com",
                    "en": laya_http + "ask.en.layabox.com"
                },
                "visual": {
                    "zh": 1,
                    "en": 1
                },
                "blank": "1"
            }, {
                "title": {
                    "zh": "关于我们",
                    "en": "Abouts Us"
                },
                "url": {
                    "zh": laya_http + "www.layabox.com/about/" + lang_param,
                    "en": laya_http + "www.layabox.com/about/" + lang_param
                },
                "visual": {
                    "zh": 1,
                    "en": 1
                },
                "blank": "0"
            }
        ];
        language_json = [
            {
                "title": {
                    "zh": "语言",
                    "en": "Language"
                },
                "url": {
                    "zh": "#",
                    "en": "#"
                },
                "visual": {
                    "zh": 1,
                    "en": 1
                },
                "dropdown": [
                    {
                        "title": {
                            "zh": "中文",
                            "en": "Chinese"
                        },
                        "url": {
                            "zh": laya_http + "www.layabox.com/" + laya_zh,
                            "en": laya_http + "www.layabox.com/" + laya_zh
                        },
                        "visual": {
                            "zh": 1,
                            "en": 1
                        },
                        "blank": "0"
                    },
                    {
                        "title": {
                            "zh": "英文",
                            "en": "English"
                        },
                        "url": {
                            "zh": laya_http + "www.layabox.com/" + laya_en,
                            "en": laya_http + "www.layabox.com/" + laya_en
                        },
                        "visual": {
                            "zh": 0,
                            "en": 0
                        },
                        "blank": "0"
                    }
                ],
                "blank": "0"
            }
        ];
    } else if (laya == "layaair") {
        nav_json = [
            {
                "title": {
                    "zh": "首页",
                    "en": "Home"
                },
                "url": {
                    "zh": laya_http + "ldc.layabox.com/" + lang_param,
                    "en": laya_http + "ldc.layabox.com/" + lang_param
                },
                "visual": {
                    "zh": 1,
                    "en": 1
                },
                "blank": "0"
            }, {
                "title": {
                    "zh": "引擎示例",
                    "en": "Example"
                },
                "url": {
                    "zh": laya_http + "layaair2.ldc2.layabox.com/demo/",
                    "en": laya_http + "layaair2.ldc2.layabox.com/demo/"
                },
                "visual": {
                    "zh": 1,
                    "en": 1
                },
                "blank": "0"
            }, {
                "title": {
                    "zh": "技术文档",
                    "en": "Doc"
                },
                "url": {
                    "zh": laya_http + "ldc.layabox.com/doc/" + lang_param,
                    "en": laya_http + "ldc.layabox.com/doc/" + lang_param
                },
                "visual": {
                    "zh": 1,
                    "en": 1
                },
                "blank": "0"
            }, {
                "title": {
                    "zh": "API",
                    "en": "API"
                },
                "url": {
                    "zh": laya_http + "layaair2.ldc2.layabox.com/api/" + lang_param,
                    "en": laya_http + "layaair2.ldc2.layabox.com/api/English/index.html" + lang_param
                },
                "visual": {
                    "zh": 1,
                    "en": 1
                },
                "blank": "0"
            }, {
                "title": {
                    "zh": "腾讯课堂教学",
                    "en": "Classroom"
                },
                "url": {
                    "zh": "http://layabox.ke.qq.com/",
                    "en": "http://layabox.ke.qq.com/"
                },
                "visual": {
                    "zh": visual,
                    "en": visual
                },
                "blank": "1"
            }, {
                "title": {
                    "zh": "搜索",
                    "en": "Search"
                },
                "url": {
                    "zh": laya_http + "sou.layabox.com/",
                    "en": laya_http + "sou.layabox.com/"
                },
                "visual": {
                    "zh": visual,
                    "en": visual
                },
                "blank": "1"
            },
            {
                "title": {
                    "zh": "FAQ",
                    "en": "FAQ"
                },
                "url": {
                    "zh": laya_http + "ldc.layabox.com/faq/",
                    "en": laya_http + "ldc.layabox.com/faq/"
                },
                "visual": {
                    "zh": 0,
                    "en": 0
                },
                "blank": "1"
            },
            {
                "title": {
                    "zh": "GitHub",
                    "en": "GitHub"
                },
                "url": {
                    "zh": laya_http + "github.com/layabox/layaair",
                    "en": laya_http + "github.com/layabox/layaair"
                },
                "visual": {
                    "zh": 1,
                    "en": 1
                },
                "blank": "0"
            }, {
                "title": {
                    "zh": "引擎下载",
                    "en": "Download"
                },
                "url": {
                    "zh": "#",
                    "en": "#"
                },
                "visual": {
                    "zh": 1,
                    "en": 1
                },
                "dropdown": [
                    {
                        "title": {
                            "zh": "LayaAir 引擎下载",
                            "en": "LayaAir Engine Download"
                        },
                        "url": {
                            "zh": laya_http + "ldc.layabox.com/layadownload/?" + lang_andparam + "type=layaair",
                            "en": laya_http + "ldc.layabox.com/layadownload/?" + lang_andparam + "type=layaair"
                        },
                        "visual": {
                            "zh": 1,
                            "en": 1
                        },
                        "blank": "0"
                    }, {
                        "title": {
                            "zh": "LayaAir IDE 下载",
                            "en": "LayaAir IDE Download"
                        },
                        "url": {
                            "zh": laya_http + "ldc.layabox.com/layadownload/?" + lang_andparam + "type=layaairide",
                            "en": laya_http + "ldc.layabox.com/layadownload/?" + lang_andparam + "type=layaairide"
                        },
                        "visual": {
                            "zh": 1,
                            "en": 1
                        },
                        "blank": "0"
                    }, {
                        "title": {
                            "zh": "LayaNative 下载",
                            "en": "LayaNative Download"
                        },
                        "url": {
                            "zh": laya_http + "ldc.layabox.com/layadownload/?" + lang_andparam + "type=layaairnative",
                            "en": laya_http + "ldc.layabox.com/layadownload/?" + lang_andparam + "type=layaairnative"
                        },
                        "visual": {
                            "zh": 1,
                            "en": 1
                        },
                        "blank": "0"
                    }
                ],
                "blank": "0"
            }
        ];
        assisted_json = [
            {
                "title": {
                    "zh": "官网",
                    "en": "Official Web"
                },
                "url": {
                    "zh": laya_http + "www.layabox.com/" + lang_param,
                    "en": laya_http + "www.layabox.com/" + lang_param
                },
                "visual": {
                    "zh": 1,
                    "en": 1
                },
                "blank": "1"
            }, {
                "title": {
                    "zh": "社区",
                    "en": "Community"
                },
                "url": {
                    "zh": laya_http + "ask.layabox.com",
                    "en": laya_http + "ask.en.layabox.com"
                },
                "visual": {
                    "zh": 1,
                    "en": 1
                },
                "blank": "1"
            }, {
                "title": {
                    "zh": "语言",
                    "en": "Language"
                },
                "url": {
                    "zh": "#",
                    "en": "#"
                },
                "visual": {
                    "zh": 1,
                    "en": 1
                },
                "dropdown": [
                    {
                        "title": {
                            "zh": "中文",
                            "en": "Chinese"
                        },
                        "url": {
                            "zh": location.href.replace(/language=(en|ch)/, 'language=ch'),
                            "en": location.href.replace(/language=(en|ch)/, 'language=ch')
                        },
                        "visual": {
                            "zh": 1,
                            "en": 1
                        },
                        "blank": "0"
                    },
                    {
                        "title": {
                            "zh": "英文",
                            "en": "English"
                        },
                        "url": {
                            "zh": location.href.replace(/language=(en|ch)/, 'language=en'),
                            "en": location.href.replace(/language=(en|ch)/, 'language=en')
                        },
                        "visual": {
                            "zh": 1,
                            "en": 1
                        },
                        "blank": "0"
                    }
                ],
                "blank": "0"
            }
        ];
    }
    //创建li组
    var creatli = function (Array) {
        var ul = "";
        for (var i = 0, num = Array.length; i < num; i++) {
            if (Array[i].visual[language]) {
                var blank = "";
                if (Array[i].blank == "1") {
                    blank = 'target="_blank"';
                }
                if (Array[i].dropdown == undefined) {
                    ul = ul + '<li><a href="' + Array[i].url[language] + '" ' + blank + '>' + Array[i].title[language] + '</a></li>';
                } else {
                    var dropdown = '<a href="' + Array[i].url[language] + '" class="dropdown-toggle" data-toggle="dropdown">' + Array[i].title[language] + '</a>';
                    var dropdown_li = '';
                    for (var ii = 0, num_li = Array[i].dropdown.length; ii < num_li; ii++) {
                        if (Array[i].dropdown[ii].visual[language]) {
                            var blank_li = "";
                            if (Array[i].dropdown[ii].blank == "1") {
                                blank_li = 'target="_blank"';
                            }
                            dropdown_li = dropdown_li + '<li><a href="' + Array[i].dropdown[ii].url[language] + '" ' + blank_li + '>' + Array[i].dropdown[ii].title[language] + '</a></li>';
                        }
                    }
                    dropdown_li = '<ul class="dropdown-menu" role="menu">' + dropdown_li + '</ul>';
                    ul = ul + ' <li class="dropdown">' + dropdown + dropdown_li + '</li>';
                }
            }
        }
        return ul;
    };
    var nav = '<nav id="laya_nav" class="navbar navbar-inverse ' + laya + '_nav"><div class="container"></div></nav>';
    var navbarH = '<div class="navbar-header"></div>';
    var navbarH_button = '<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#laya_nav_collapse"></button>';
    var navbarH_button_span = '<span class="sr-only"></span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span>';
    var navbarH_a = '<a class="navbar-brand" href="' + laya_http + 'www.layabox.com/"><img src="img/LAYABOX_Logo.png"/></a>';
    $(nav).prependTo("body");
    $(navbarH).prependTo("#laya_nav .container");
    $(navbarH_button).prependTo("#laya_nav .navbar-header");
    $(navbarH_a).appendTo("#laya_nav .navbar-header");
    $(navbarH_button_span).prependTo("#laya_nav button");
    var laya_nav_collapse = '<div id="laya_nav_collapse" class="collapse navbar-collapse"></div>';
    $(laya_nav_collapse).appendTo("#laya_nav .container");
    if (nav_json.length > 0) {
        var collapse_ul_l = '<ul class="nav navbar-nav">';
        collapse_ul_l = collapse_ul_l + creatli(nav_json);
        collapse_ul_l = collapse_ul_l + '</ul>';
        $(collapse_ul_l).prependTo("#laya_nav_collapse");
    }
    if (assisted_json.length > 0) {
        var collapse_ul_r = '<ul class="nav navbar-nav navbar-right">';
        collapse_ul_r = collapse_ul_r + creatli(assisted_json);
        collapse_ul_r = collapse_ul_r + '</ul>';
        $(collapse_ul_r).appendTo("#laya_nav_collapse");
    }
    if (language_json.length > 0) {
        var collapse_la = '<ul class="nav navbar-nav navbar-right">';
        collapse_la = collapse_la + creatli(language_json);
        collapse_la = collapse_la + '</ul>';
        $(collapse_la).appendTo("#laya_nav_collapse");
    }
}

//LAYA页脚
function layabox_foot() {
    //友情链接json
    var friend_json = [
        {
            "title": "龙图教育",
            "url": "http://www.longtuedu.com.cn/",
            "blank": "1"
        }, {
            "title": "游戏蛮牛",
            "url": "http://www.manew.com/",
            "blank": "1"
        }, {
            "title": "独游网",
            "url": "http://www.indiegames.cn/",
            "blank": "1"
        }, {
            "title": "伍游网",
            "url": "http://www.5you.cc/pc.html",
            "blank": "1"
        }, {
            "title": "我学院网",
            "url": "http://www.woxueyuan.com",
            "blank": "1"
        }, {
            "title": "w3cschool",
            "url": "http://www.w3cschool.cn/",
            "blank": "1"
        }, {
            "title": "很快微信开发者社区",
            "url": "http://www.henkuai.com/",
            "blank": "1"
        }, {
            "title": "一轮文档搜索",
            "url": "http://www.yilun.net/",
            "blank": "1"
        }
    ];
    var foot_json = {
        "tr_0": {
            "zh": "公司简介",
            "en": "Company Profile"
        },
        "tr_1": {
            "zh": "联系方式",
            "en": "Contact Us"
        },
        "tr_2": {
            "zh": "人才招聘",
            "en": "Careers"
        },
        "tr_3": {
            "zh": "商务合作：bd@layabox.com",
            "en": "Business partnership：bd@layabox.com"
        },
        "tr_4": {
            "zh": "LayaAir引擎2D交流QQ群：104144216（已满）",
            "en": "Layabox developer integrated communication QQ group：104144216（Full）"
        },
        "tr_5": {
            "zh": "LayaAir引擎2D交流QQ群2群：135887157",
            "en": "LayaAir engine official QQ group：135887157"
        },
        "tr_6": {
            "zh": "LayaAir引擎3D&VR交流QQ群：343966316",
            "en": "LayaAir engine official QQ group：343966316"
        },
        "tr_7": {
            "zh": "友情链接",
            "en": "Partnership Link"
        },
        "tr_8": {
            "zh": "微信二维码",
            "en": "WeChat QR code"
        }
    };
    //创建a组
    var creata = function (Array) {
        var ul = "";
        for (var i = 0, num = Array.length; i < num; i++) {
            if (i == 0) {
                var p = '<p></p>';
            } else {
                var p = '<p class="pline">|</p>';
            }
            var blank = "";
            if (Array[i].blank == "1") {
                blank = 'target="_blank"';
            }
            ul = ul + p + '<a href="' + Array[i].url + '" ' + blank + '><p>' + Array[i].title + '</p></a>';
        }
        return ul;
    };
    var foot = '<footer id="laya_foot"><div class="container"></div></footer>';
    $(foot).appendTo("body");
    var div_1 = '<div class="foot_div_1">';
    div_1 = div_1 + '<a href="' + laya_http + 'www.layabox.com/about/' + lang_param + '#introduce"><p>' + foot_json["tr_0"][language] + '</p></a>';
    div_1 = div_1 + '<a href="' + laya_http + 'www.layabox.com/about/' + lang_param + '#contact"><p>' + foot_json["tr_1"][language] + '</p></a>';
    div_1 = div_1 + '<a href="' + laya_http + 'www.layabox.com/about/' + lang_param + '#recruit"><p>' + foot_json["tr_2"][language] + '</p></a>';
    div_1 = div_1 + '</div>';
    var div_2 = '<div class="foot_div_2"><p>|</p><p>' + foot_json["tr_3"][language] + '</p></div>';
    div_2 = div_2 + '<div class="foot_div_2">';
    div_2 = div_2 + '<p>' + foot_json["tr_4"][language] + '</p>';
    div_2 = div_2 + '<p>' + foot_json["tr_5"][language] + '</p>';
    div_2 = div_2 + '<p>' + foot_json["tr_6"][language] + '</p>';
    div_2 = div_2 + '</div>';
    var div_3 = '<div class="foot_div_3"><p>Copyright © 2014-2017 Layabox Inc. 京ICP备15008163号-1';
    // div_3 = div_3 + '<script language="javascript" type="text/javascript" src="' + laya_http + 'js.users.51.la/17805416.js"></script>';
    // div_3 = div_3 + '<noscript><a href="' + laya_http + 'www.51.la/?17805416" target="_blank"><img alt="&#x6211;&#x8981;&#x5566;&#x514D;&#x8D39;&#x7EDF;&#x8BA1;" src="' + laya_http + 'img.users.51.la/17805416.asp" style="border:none"/></a></noscript>';
    div_3 = div_3 + '</p></div>';
    var div_4 = '<div class="foot_div_4"><p class="friendship">' + foot_json["tr_7"][language] + '</p>';
    div_4 = div_4 + creata(friend_json);
    div_4 = div_4 + '</div>';
    var div_wx = '<div class="wx"><img src="' + laya_config.domainName + '/public/img/LAYABOX_QRcode.jpg"/><p>' + foot_json["tr_8"][language] + '</p></div>';
    $(div_1).prependTo("#laya_foot .container");
    $(div_2).appendTo("#laya_foot .container");
    $(div_3).appendTo("#laya_foot .container");
    $(div_4).appendTo("#laya_foot .container");
    $(div_wx).appendTo("#laya_foot .container");
}

//LAYA合作伙伴
function layabox_cooperation() {
    var cooperation_json = {
        "tr_0": {
            "zh": "合作伙伴",
            "en": "Partnership"
        },
        "tr_1": {
            "zh": "（排序不分前后）",
            "en": "（randomly sorted）"
        }
    };
    var title = '<div class="title">' + cooperation_json["tr_0"][language] + '</div><div class="ranking">' + cooperation_json["tr_1"][language] + '</div>';
    var coop = "";
    for (var i = 0, num = 18; i < num;) {
        i++;
        var div = '<img src="' + laya_config.domainName + '/public/img/cooperation/' + i + '.jpg"/>';
        div = '<div class="col-lg-2 col-md-2 col-sm-4 col-xs-6">' + div + '</div>';
        coop = coop + div;
    }
    var div = title + '<div class="container">' + coop + '</div>';
    div = '<section class="cooperation">' + div + '</section>';
    $(div).appendTo("#laya_content");
}

/*初始化布局*/
function onLR() {
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var bodyWidth = $("body").width();
    var bodyHeight = $("body").height();
    var navHeight = $("#laya_nav").height();
    var footHeight = $("#laya_foot").height();
    var content = $("#laya_content").height();
    if (navHeight + footHeight + content + 100 >= windowHeight) {
        $("#laya_foot").css({
            "position": "relative"
        });
    } else {
        $("#laya_foot").css({
            "position": "fixed"
        });
    }
}

/*获取链接参数*/
function request(paras) {
    var url = location.href;
    var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
    var paraObj = {};
    for (var i = 0, j; j = paraString[i]; i++) {
        paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
    }
    var returnValue = paraObj[paras.toLowerCase()];
    if (typeof(returnValue) == "undefined") {
        return "";
    } else {
        return returnValue;
    }
}

/*判断服务器*/
function retunOS(str) {
    if (str == "2ad3a2ae3de46790d168e044c19be03d") {
        return true;
    } else {
        return false;
    }
    return false;
}