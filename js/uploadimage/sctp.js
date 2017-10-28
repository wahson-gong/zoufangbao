mui.init();
if(window.plus) {
	plusReady();
} else {
	document.addEventListener("plusready", plusReady, false);
}

function plusReady() {
	//alert($("#myform").find(".img_val").length);
	    

//	document.getElementById('btn_send').addEventListener('tap', function() {
//		if($("#textarea").val()=="")
//		{
//			mui.alert("请填写内容");
//			return false;
//		}
		
//		imgupgrade();
//      //页面跳转
//      plus.webview.getWebviewById('gd_ckzp.html?node_id='+getUrlParam("node_id")).reload();
//      //plus.webview.currentWebview().reload();
//      openWindows('gd_ckzp.html?node_id='+getUrlParam("node_id"));
// 
//	});
};

//上传单张图片
function galleryImg() {
	//每次拍摄或选择图片前清空数组对象
	f1.splice(0, f1.length);
	document.getElementsByClassName("showimg")[0].innerHTML = null;
	// 从相册中选择图片
	mui.toast("从相册中选择一张图片");
	plus.gallery.pick(function(path) {
		showImg(path);
	}, function(e) {
		mui.toast("取消选择图片");
	}, {
		filter: "image",
		multiple: false
	});
}

function galleryImgs() {
	//每次拍摄或选择图片前清空数组对象
	f1.splice(0, f1.length);
	document.getElementsByClassName("showimg")[0].innerHTML = null;
	// 从相册中选择图片
	//mui.toast("从相册中选择不超过两张图片");
	plus.gallery.pick(function(e) {
		if(e.files.length >= 7) {
			mui.toast('一次最多上传6张照片');
			return false;
		}
		for(var i in e.files) {
			showImg(e.files[i]);
		}
	}, function(e) {
		mui.toast("取消选择图片");
	}, {
		filter: "image",
		multiple: true
	});
}
// 拍照添加文件

function cameraimages() {
	//每次拍摄或选择图片前清空数组对象
	f1.splice(0, f1.length);
	document.getElementsByClassName("showimg")[0].innerHTML = null;
	var cmr = plus.camera.getCamera();
	cmr.captureImage(function(p) {
		plus.io.resolveLocalFileSystemURL(p, function(entry) {
			var localurl = entry.toLocalURL(); //把拍照的目录路径，变成本地url路径，例如file:///........之类的。
			showImg(localurl);
		});
	}, function(e) {
//		mui.toast("很抱歉，获取失败 " + e);
	});
}
// 全局数组对象，添加文件,用于压缩上传使用
var f1 = new Array();
var ghy_f1 = "";

function showImg(url) {
	mui.toast("正在读取照片...");
	// 兼容以“file:”开头的情况
	if(0 != url.toString().indexOf("file://")) {
		url = "file://" + url;
	}
	var _div_ = document.getElementsByClassName("showimg")[0];
	var _img_ = new Image();
	_img_.src = url; // 传过来的图片路径在这里用。
	_img_.onclick = function() {
		plus.runtime.openFile(url);
	};
	_img_.onload = function() {
		var tmph = _img_.height;
		var tmpw = _img_.width;
		var isHengTu = tmpw > tmph;
		var max = Math.max(tmpw, tmph);
		var min = Math.min(tmpw, tmph);
		var bili = min / max;
		if(max > 1200) {
			max = 1200;
			min = Math.floor(bili * max);
		}
		tmph = isHengTu ? min : max;
		tmpw = isHengTu ? max : min;
		_img_.style.border = "1px solid rgb(200,199,204)";
		_img_.style.margin = "10px";
		_img_.style.width = "90%";
		_img_.style.height = "auto";

		_img_.onload = null;
		plus.io.resolveLocalFileSystemURL(url, function(entry) {
				entry.file(function(file) {
					console.log(file.size + '--' + file.name);
					canvasResize(file, {
						width: tmpw,
						height: tmph,
						crop: false,
						quality: 50, //压缩质量
						rotate: 0,
						callback: function(data, width, height) {
							f1.push(data);
							addImgInput(data);
							_img_.src = data;
							_div_.appendChild(_img_);
							//console.log(_img_);
							plus.nativeUI.closeWaiting();
						}
					});
				});
			},
			function(e) {
				plus.nativeUI.closeWaiting();
				console.log(e.message);
			});
	};
};

function imgupgrade() {
	var wt = plus.nativeUI.showWaiting();
	$("#myform").find(".img_val").each(function() {
		if($(this).val()!="")
		{
			loadSingleImage($(this).val());
		}
		
	});
	if($("#myform").find(".img_val").length==0)
	{
		loadSingleImage("");
	}
    plus.nativeUI.closeWaiting();
    
}

function addImgInput(img_val) {
	var imghtml='<div class="upimg-li img_val" data-value="'+img_val+'"><div class="upimg-li-close"></div><div class="TU_A1 pad-b-100" style="background-image: url('+img_val+');"></div></div>';
	$("#myform").append(imghtml);
	var img_input = "<input type='text' value='" + img_val + "' name='img[]' hidden='hidden' class='img_val'  />";
	$("#myform").append(img_input);
}

function loadSingleImage(img_val) {
	var url = web_url()+"/?type=updateimg";
	$.ajax({
		type: "post",
		url: url,
		async: false,
		data: {
			img: img_val,
		},
		dataType: "json",
		success: function(data) {
			mui.alert(data['msg']);
			console.log(data['msg']);
			//location.href = getParam("user_type") + "_index.html";
		},
		eror: function() {
			mui.alert("请检查网络!");
		}
	});
}