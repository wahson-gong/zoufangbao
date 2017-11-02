mui.init();
if(window.plus) {
	plusReady();
} else {
	document.addEventListener("plusready", plusReady, false);
}

function plusReady() {};
//上次单张照片
function galleryImgs(num) {
	console.log(num);
	console.log(f1.length);
	if(f1.length >= num) {
		mui.toast('一次最多上传'+num+'张照片');
		return false;
	}
	//每次拍摄或选择图片前清空数组对象
	//f1.splice(0, f1.length);
	// 从相册中选择图片
	plus.gallery.pick(function(e) {
		if((e.files.length+f1.length) > num) {
			mui.toast('一次最多上传'+num+'张照片');
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

function cameraimages(num) {
	if(f1.length >= num) {
		mui.toast('一次最多上传'+num+'张照片');
		return false;
	}
	//每次拍摄或选择图片前清空数组对象
	//f1.splice(0, f1.length);
	var cmr = plus.camera.getCamera();
	cmr.captureImage(function(p) {
		plus.io.resolveLocalFileSystemURL(p, function(entry) {
			var localurl = entry.toLocalURL(); //把拍照的目录路径，变成本地url路径，例如file:///........之类的。
			showImg(localurl);
			imgupgrade();
		});
	}, function(e) {
		//mui.toast("很抱歉，获取失败 " + e);
	});
}
// 全局数组对象，添加文件,用于压缩上传使用
var f1 = new Array();
var ghy_f1 = "";

function showImg(url) {
	//mui.toast("正在读取照片...");
	// 兼容以“file:”开头的情况
	if(0 != url.toString().indexOf("file://")) {
		url = "file://" + url;
	}
	var _img_ = new Image();
	_img_.src = url;
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
//批量上传
function imgupgrade() {
	
	if(f1.length==0){
//		alert('请选择图片');
//		return false;
	}
	var wt = plus.nativeUI.showWaiting("上传中...");
	for (var i=0;i<f1.length;i++) {
		if(f1[i]!="")
		{
			loadSingleImage(f1[i]);
		}
	}
    plus.nativeUI.closeWaiting();
   // plus.nativeUI.toast("上传图片成功");
}
function close_img(obj){
	var index=$(obj).parent('.upimg-li').index();
	f1.splice(index, 1);
	$(obj).parent('.upimg-li').remove();
}
function close_imgA(obj){
	var index=$(obj).parent('.upimg-li').index();
	f1.splice(index, 1);
	$(obj).parent('.upimg-li').hide();
	$(obj).siblings('.TU_A1').remove();
	$(obj).remove();
}
//
function addImgInput(img_val) {
	console.log(img_val)
	$('.bk-tx-pic-touxiang').css('background-image','url('+img_val+')');
}
//上传
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
			console.log("上传成功"+data['msg'])
			$('#touxiang').val(data['msg']);
		},
		eror: function() {
			mui.alert("请检查网络!");
		}
	});
}