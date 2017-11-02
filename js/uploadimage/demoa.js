mui.init();
if(window.plus) {
	plusReady();
} else {
	document.addEventListener("plusready", plusReady, false);
}

function plusReady() {};
// 全局数组对象，添加文件,用于压缩上传使用
var f1 = new Array();
var ghy_f1 = "";
var end_str = "";
var sar_str = "";
var lc_num = 0;
var lc_num_str = '';

function num_yno() {
	lc_num_str = $('#fangwutupian_').data('num');
	if(lc_num_str != '' && lc_num_str != undefined) {
		lc_num = parseInt(lc_num_str);
	}
}

//上次单张照片

//	sar_str=$('#fangwutupian_').val();
//	var imglist=end_str.replace(/{title}/g,"");
//	var imglist=imglist.split('{next}');
//	var lg=imglist.length;
//	var lc_num=$('#fangwutupian_').data('num');
//	if(lc_num==''||lc_num==undefined){
//		lc_num=0;
//	}else{
//		lc_num=parseInt(lc_num);
//	}
//	if((lg+lc_num)>=num){
//		mui.toast('最多上传'+num+'张照片');
//		return false;
//	}
//	$('#fangwutupian_').data('num',lg+lc_num);

function galleryImgs(num) {
	num_yno();
	if((1 + lc_num + f1.length) > num) {
		mui.toast('一次最多上传' + num + '张照片');
		return false;
	}
	//每次拍摄或选择图片前清空数组对象
	//f1.splice(0, f1.length);
	// 从相册中选择图片
	plus.gallery.pick(function(e) {
		if((e.files.length + lc_num + f1.length) > num) {
			mui.toast('一次最多上传' + num + '张照片');
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
	num_yno();
	if((1 + lc_num + f1.length) > num) {
		mui.toast('一次最多上传' + num + '张照片');
		return false;
	}
	//每次拍摄或选择图片前清空数组对象
	//f1.splice(0, f1.length);
	var cmr = plus.camera.getCamera();
	cmr.captureImage(function(p) {
		plus.io.resolveLocalFileSystemURL(p, function(entry) {
			var localurl = entry.toLocalURL(); //把拍照的目录路径，变成本地url路径，例如file:///........之类的。
			showImg(localurl);
		});
	}, function(e) {
		//mui.toast("很抱歉，获取失败 " + e);
	});
}

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
							var cong = 'yes';
							for(var i = 0; i < f1.length; i++) {
								if(f1[i] == data) {
									cong = 'no';
								}
							}
							if(cong == 'no') {
								plus.nativeUI.closeWaiting();
								plus.nativeUI.toast('图片不可重复');
								return false;
							}
							f1.push(data);
							//console.log('dd' + data);
							console.log(f1.length);
							addImgInput(data);
							var tu = $('#fangwutupian_').data('tu');
							if(tu == '' || tu == undefined) {
								tu = data;
							} else {
								tu = tu + '{tu}' + data;
							}
							$('#fangwutupian_').data('tu', tu);
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
	if(f1.length == 0) {
		//		alert('请选择图片');
		//		return false;
	}
	//	var wt = plus.nativeUI.showWaiting('图片上传中...');
	for(var i = 0; i < f1.length; i++) {
		if(f1[i] != "") {
			//console.log(f1[i]);
			loadSingleImage(f1[i]);
		}
	}
	$('.upimg-barA').addClass('tuon');
	//  plus.nativeUI.closeWaiting();
	if(f1.length != 0) {
		plus.nativeUI.toast('图片上传成功');
	}

}

function close_img(obj) {
	var index = $(obj).parent('.upimg-li').index();
	f1.splice(index, 1);
	$(obj).parent('.upimg-li').remove();
}

function close_imgA(obj) {
	var index = $(obj).parent('.upimg-li').index();
	f1.splice(index, 1);
	$(obj).parent('.upimg-li').remove();

	//	$(obj).parent('.upimg-li').hide();
	//	$(obj).siblings('.TU_A1').remove();
	//	$(obj).remove();
}
//
function addImgInput(img_val) {
	console.log(img_val);
	var img_html = '<div class="upimg-li"><div class="upimg-li-close" onclick="return close_imgA(this)"></div><div onclick="return out_img(this)" class="TU_A1 pad-b-100" style="background-image: url(' + img_val + ');"></div></div>';
	//	var img_html='<img src="'+img_val+'" />';
	if(ghy_f1 == '') {
		ghy_f1 = img_html;
	} else {
		ghy_f1 = ghy_f1 + img_html;
	}
	$('.upimg-barA').show();
	$('.upimg-barA').append(img_html);
}
//上传
function loadSingleImage(img_val) {
	sar_str = $('#fangwutupian_').val();

	var url = web_url() + "/?type=updateimg";
	$.ajax({
		type: "post",
		url: url,
		async: false,
		data: {
			img: img_val,
		},
		dataType: "json",
		success: function(data) {
			//mui.alert(data['msg']);
			console.log(data['msg']);
			if(sar_str != '') {
				end_str = sar_str;
			}
			if(end_str == '') {
				end_str = data['msg'] + '{title}';
			} else {
				end_str = end_str + '{next}' + data['msg'] + '{title}'
			}
			$('#fangwutupian').val(end_str);
			//location.href = getParam("user_type") + "_index.html";
		},
		eror: function() {
			mui.alert("请检查网络!");
		}
	});
}