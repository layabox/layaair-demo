<?php
/*LAYA服务器参数*/
$laya_server_name = $_SERVER['SERVER_NAME'];
$laya_server = ((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https')) ? 'https://' : 'http://';
//official.layabox.com
$laya_data = $laya_server . "official.layabox.com";
$version = "?v=laya_20170727";
if (gethostbyname($_SERVER['SERVER_NAME']) == "49.51.9.179") {
    $laya_server_ip = md5(gethostbyname($_SERVER['SERVER_NAME']));
} else {
    $laya_server_ip = "";
}
$language = $_GET['language'];
if ($language !== "zh" && $language !== "en") {
    if ($laya_server_ip == "2ad3a2ae3de46790d168e044c19be03d") {
        $language = "en";
        $language_name = "English";
        $lang_param = "?language=" . $language;
        $lang_andparam = "language=" . $language . "&";
    } else {
        $language = "zh";
        $language_name = "Chinese";
        $lang_param = "";
        $lang_andparam = "";
    }
} else {
    if ($language == "zh") {
        $lang_param = "";
        $lang_andparam = "";
    } elseif ($language == "en") {
        $lang_param = "?language=" . $language;
        $lang_andparam = "language=" . $language . "&";
    }
}
if (isset($tr_url)) {
    $text_data = [];
    $num = 0;
    $tr_url = json_decode(file_get_contents($tr_url), true);
    foreach ($tr_url as $K => $V) {
        $text_data[$num] = $V[$language];
        $num++;
    }
}
?>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=EDGE,Chrome=1;"/>
    <meta name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"/>
    <meta name="description"
          content="Layabox是免费开源的HTML5引擎解决方案，产品家族中包括LayaAir引擎、LayaFlash引擎、LayaOpen开放平台、LayaMarket SDK、LayaStore嵌入式游戏商店、LayaPlayer运行器。核心引擎LayaAir性能全球领先，支持2D、3D、VR开发，支持AS3、JavaScript、TypeScript三种开发语言、LayaAirIDE让项目开发更高效。"/>
    <meta name="keywords"
          content="HTML5游戏引擎,Layabox,官方网站, 免费开源,H5引擎,HTML5引擎,性能最高,3D,VR,AS3,JavaScript,TypeScript,开发语言,LayaFlash,LayaPlayer,LayaAir,LayaOpen,LayaMarket,LayaStore,游戏引擎，工具链"/>
    <meta name="author" content="ldc.layabox.com"/>
    <script type="text/javascript">
        var overseas = "<?php echo $laya_server_ip; ?>";
    </script>

    <title>
        LAYA_DEMO
    </title>

    <!--CSS-->
    <link rel="shortcut icon" href="<?php echo $laya_data ?>/public/img/favicon.ico"/>
    <link rel="bookmark" href="<?php echo $laya_data ?>/public/img/favicon.ico"/>
    <link rel="stylesheet" type="text/css"
          href="<?php echo $laya_data ?>/public/css/bootstrap.css<?php echo $version; ?>"/>
    <link rel="stylesheet" type="text/css"
          href="<?php echo $laya_data ?>/public/css/bootstrap-theme.css<?php echo $version; ?>"/>
    <link rel="stylesheet" type="text/css"
          href="<?php echo $laya_data ?>/public/css/animate.min.css<?php echo $version; ?>"/>
    <!--CSS laya-->
    <link rel="stylesheet" type="text/css"
          href="<?php echo $laya_data ?>/public/css/LAYA_HF.css<?php echo $version; ?>"/>
    <!--CSS main-->
    <link rel="stylesheet" type="text/css"
          href="css/demo.css<?php echo $version; ?>"/>
    <?php if ($language == "en") { ?>
        <style>
            #laya_nav .container {
                width: 100%;
            }
        </style>
    <?php } ?>

    <!--JS-->
    <!--IE 兼容-->
    <!--[IF LTE IE 9]>
    <script type="text/javascript" charset="utf-8"
            src="<?php echo $laya_data ?>/public/js/html5.min.js<?php echo $version; ?>"></script>
    <script type="text/javascript" charset="utf-8"
            src="<?php echo $laya_data ?>/public/js/respond.min.js<?php echo $version; ?>"></script>
    <![ENDIF]-->
    <script type="text/javascript" charset="utf-8"
            src="<?php echo $laya_data ?>/public/js/jquery.js<?php echo $version; ?>"></script>
    <!--[IF LTE IE 8]>
    <script type="text/javascript" charset="utf-8"
            src="<?php echo $laya_data ?>/public/js/jquery.ie8.min.js<?php echo $version; ?>"></script>
    <![ENDIF]-->
    <script type="text/javascript" charset="utf-8"
            src="<?php echo $laya_data ?>/public/js/bootstrap.js<?php echo $version; ?>"></script>
    <!--JS laya-->
    <script type="text/javascript" charset="utf-8"
            src="<?php echo $laya_data ?>/public/js/LAYA_HF.js<?php echo $version; ?>"></script>
    <!--JS main-->
    <script type="text/javascript" charset="utf-8" src="js/ace-src-min-noconflict/ace.js" defer="defer"></script>
    <script type="text/javascript" charset="utf-8" src="js/script.js?v=1490015756" defer="defer"></script>
    <script type="text/javascript" charset="utf-8" src="js/qrCode/kaelQrcode.js" defer="defer"></script>
    <script type="text/javascript" charset="utf-8" src="js/qrCode/qrcode.js" defer="defer"></script>

    <!--WOW-->
    <script type="text/javascript" charset="utf-8" src="<?php echo $laya_data ?>/public/js/wow.js"></script>
    <script type="text/javascript">
        if (!(/msie [6|7|8|9]/i.test(navigator.userAgent))) {
            new WOW().init();
        }
        //初始化页面
        $(window).ready(function () {
            laya_nav('layaair');
            onLR();
            rotate();
            WH();
        });
        $(window).resize(function () {
            onLR();
            WH();
        });
    </script>
</head>
<body data-spy="srcoll"
      data-target="#laya-siderbar">
<section id="laya_content">
    <nav class="navbar navbar-default movenav">
        <div class="container-fluid">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse"
                        data-target="#bs-example-navbar-collapse-2" aria-expanded="false">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="#">
                    <p style="padding-left: 14px;font-size: 15px;font-weight: 600;">LayaAir DEMO</p>
                </a>
            </div>
            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-2">
                <ul class="nav navbar-nav navbar-right nav-data">
                    <li class="dropdown">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown"><b class="caret"></b></a>
                        <ul class="dropdown-menu">
                            <li><a class="list-item" href="#Sprite_DisplayImage">显示图片</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    <section id="demo">
        <div class="demo-box">
            <nav class="navbar navbar-default">
                <div class="container-fluid">
                    <div class="navbar-header">
                        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse"
                                data-target="#bs-example-navbar-collapse-2" aria-expanded="false">
                            <span class="sr-only">Toggle navigation</span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                        </button>
                    </div>
                    <div>
                        <ul class="nav nav-tabs" role="tablist">
                            <li role="presentation" class="demo_category">
                                <a href="#2d_demo" aria-controls="2d_demo"
                                   role="tab" data-toggle="tab">2D</a>
                            </li>
                            <li role="presentation" class="demo_category">
                                <a href="#3d_demo" aria-controls="3d_demo"
                                   role="tab" data-toggle="tab">3D</a>
                            </li>
                        </ul>
                        <div class="tab-content">
                            <div role="tabpanel" class="tab-pane active" id="2d_demo">
                                <div class="panel-group hidden-xs" id="accordion_2d" role="tablist"
                                     aria-multiselectable="true">
                                    <div class="panel panel-default">
                                        <div class="panel-heading" role="tab">
                                            <a width="200px" class="collapsednew" swich="0" role="button"
                                               data-toggle="collapse" data-parent="#accordion_2d" aria-expanded="true"
                                               aria-controls="">
                                                <h4 class="panel-title">
                                                    <div class="square">
                                                        <!--<span class="glyphicon glyphicon-chevron-right"></span>-->
                                                    </div>
                                                    <div class="spantitle"></div>
                                                    <span class="badge"></span>
                                                </h4>
                                            </a>
                                        </div>
                                        <div class="panel-collapse collapse" role="tabpanel" aria-labelledby=""
                                             aria-expanded="true">
                                            <div class="panel-body">
                                                <div>
                                                    <ul class="nav nav-pills nav-stacked" role="tablist">
                                                        <li role="presentation">
                                                            <a href="" data-toggle="tab"></a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div role="tabpanel" class="tab-pane" id="3d_demo">
                                <div class="panel-group hidden-xs" id="accordion_3d" role="tablist"
                                     aria-multiselectable="true">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <div class="demo-data">
                <div class="row">
                    <div class="content">
                        <h2 id="caseTitle"></h2>
                        <div class="new-tab">
                            <button class="btn btn-default" type="button" id="openInNewTabButton">
                                <img src="res/newTab.png">
                                <a href="javascript:void(0)">新标签打开</a>
                            </button>
                            <!-- <button class="btn btn-default" type="button" onclick="ViewSwf()">
                                <img src="res/swf.jpg">
                                <a href="javascript:void(0)">观看SWF</a>
                            </button> -->
                            <button class="btn btn-default" type="button" data-toggle="modal" data-target="#myModal5">
                                <img src="res/qr.png">
                                <a href="javascript:void(0)">二维码</a>
                            </button>
                        </div>
                        <iframe id="demo_frame" frameborder="0" src="h5/demo.html"></iframe>
                        <div id="descDiv"></div>
                        <div class="refLibDiv" style="height:30px">
                            <span class="refLibField">引用库：</span>
                            <p id="refLibs"></p>
                        </div>
                        <div class="bs-example bs-example-tabs" data-example-id="togglable-tabs">
                            <ul id="myTabs" class="nav nav-tabs" role="tablist">
                                <li role="presentation">
                                    <a class="a" href="#as" id="as-tab" role="tab" data-toggle="tab" aria-controls="as"
                                       aria-expanded="true">ActionScript</a>
                                </li>
                                <li role="presentation" class="active">
                                    <a class="a ablack" href="#js" role="tab" id="js-tab" data-toggle="tab"
                                       aria-controls="js">JavaScript</a>
                                </li>
                                <li role="presentation">
                                    <a class="a" href="#ts" role="tab" id="ts-tab" data-toggle="tab" aria-controls="ts">TypeScript</a>
                                </li>
                            </ul>
                            <div class="btn-group code-control-btn-group" role="group">
                                <button type="button" class="btn" id="execButton" style="margin-right: 2px;">
                                    <!--<span class="glyphicon glyphicon-cog" aria-hidden="true"></span>-->
                                    <span>执行代码</span>
                                </button>
                                <button type="button" class="btn" id="resetButton">
                                    <!--<span class="glyphicon glyphicon-share-alt" aria-hidden="true"></span>-->
                                    <span>重置示例</span>
                                </button>
                            </div>
                            <div id="myTabContent" class="tab-content">
                                <div role="tabpanel" class="tab-pane fade" id="as" aria-labelledby="as-tab">
                                    <pre id="asPre" class="code"></pre>
                                </div>
                                <div role="tabpanel" class="tab-pane fade in active" id="js" aria-labelledby="js-tab">
                                    <pre id="jsPre" class="code"></pre>
                                </div>
                                <div role="tabpanel" class="tab-pane fade" id="ts" aria-labelledby="ts-tab">
                                    <pre id="tsPre" class="code"></pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <div class="modal inmodal fade" id="myModal5" tabindex="-1" role="dialog" aria-hidden="true" style="display: none;">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">
                        <span aria-hidden="true">×</span>
                        <span class="sr-only">Close</span>
                    </button>
                    <h4 class="modal-title">扫描二维码</h4>
                </div>
                <div class="modal-body">
                    <div class="qr-ctn" id="qr"></div>
                </div>
            </div>
        </div>
    </div>
</section>
<script type="text/javascript">
    $(".text-content img").addClass("img-responsive img-rounded");
    $(".collapsednew").click(function () {
        if ($(this).attr("swich") == 0) {
            $(".collapsednew").children(".panel-title").children(".square").removeClass("squarerotate");
            $(".collapsednew").attr("swich", "0");
            $(".badge").removeClass("badgeBlue");
            $(this).attr("swich", "1");
            $(this).children(".panel-title").children(".square").addClass("squarerotate");
            $(this).children(".panel-title").children(".badge").addClass("badgeBlue");
        } else if ($(this).attr("swich") == 1) {
            $(".collapsednew").attr("swich", "0");
            $(this).children(".panel-title").children(".square").removeClass("squarerotate");
        }
    });
    $(".a").click(function () {
        $(".a").removeClass("ablack");
        $(this).addClass("ablack");
    });

    function rotate() {
        $(".panel-collapse").each(function () {
            $(this).prev(".panel-heading").children("a").attr("swich", "0");
            $(this).prev(".panel-heading").children("a").children("h4").children(".badge").removeClass("badgeBlue");
            $(this).prev(".panel-heading").children("a").children(".panel-title").children(".square").removeClass("squarerotate");
            if ($(this).height() == "0") {
                $(this).prev(".panel-heading").children("a").attr("swich", "1");
                $(this).prev(".panel-heading").children("a").children("h4").children(".badge").addClass("badgeBlue");
                $(this).prev(".panel-heading").children("a").children(".panel-title").children(".square").addClass("squarerotate");
            }
        });
    }

    function WH() {
        if ($(window).width() >= 768) {
            $("#demo").css("height", $(window).height() - 95);
            $(".demo-box").css("height", $("#demo").height());
            $("#accordion_2d").css("height", $(".demo-box").height() - 43);
            $("#accordion_3d").css("height", $(".demo-box").height() - 43);
            $(".demo-box").removeClass("demo-boxS");
            $(".demo-box").css("width", $("#demo").width() - 48);
            $(".demo-data").css("width", $(window).width() - $(".demo-box nav").width() - 60);
        }
        if ($(window).width() <= 767) {
            $("#demo").css("height", $(window).height() - 160);
            $(".demo-box").css("height", $("#demo").height() + 40);
            $("#demo").css("height", $(window).height() - 31 - 80);
            $(".demo-box").addClass("demo-boxS");
            $(".demo-box").css("width", $("#demo").width() - 30);
            $(".demo-data").css("width", "100%");
        }
        $(".panel-group").css("height", $(window).height() - 156);
    }
</script>
</body>
</html>
