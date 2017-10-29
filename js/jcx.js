$(function() {
	$('.search-cvA').click(function() {
		$(this).parents('.search').addClass('on');
		$('.search-input').focus();
	});
	//	$('.search-input').blur(function(){
	//		$('.search-input').val('');
	//		$('.search').removeClass('on');
	//	});
});

//获取传递的参数
function GetUrlParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return unescape(r[2]);
	return null;
}
//user
function user_edit(data1) {
	net_yno();
	var url1 = web_url() + '/?type=edit&t=user&yonghuming=' + localStorage.yonghuming + '&id=' + JSON.parse(localStorage.ubase).msg[0].id;
	if(localStorage.net == 'false') {
		if(localStorage.data_edit == undefined) {
			setParam('data_edit', '{"count":0,"list":[]}');
		}
		var data_edit = JSON.parse(localStorage.data_edit);
		var add_list = data_edit.list;
		var add_count = parseInt(data_edit.count);
		data_edit.count = add_count + 1;
		var add_listA = {
			"url": url1 + data1
		};
		add_list.push(add_listA);
		data_edit.list = add_list;
		setParam('data_edit', JSON.stringify(data_edit));
		plus.nativeUI.closeWaiting();
		mui.toast('已保存！');
	} else {
		getData(false, 'post', url1, data1, function(msg) {
			mui.toast('提交成功！');
		});
	}
}

//localStorage clear
function locs_del() {
	setParam('data_edit', '{"count":0,"list":[]}');
	setParam('data_add', '{"count":0,"list":[]}');
	//	for(var i=0;i<localStorage.length;i++){
	//      var key=localStorage.key(i);console.log(key);
	//      if(key!='ubase'&&key!='web_base'&&key!='yonghuming'&&key!='web_url'&&key!='newhouse_citychoose'&&key!='login_status'&&key!='login_token'&&key!='login_suoshucun_txt'&&key!='login_suoshuzu_txt'){
	//      	localStorage.removeItem(key);
	//      }
	//  } 
}
//loc 大小
function locs() {
	var size = 0;
	for(item in localStorage) {
		if(localStorage.hasOwnProperty(item)) {
			size += localStorage.getItem(item).length;
		}
	}
	console.log('当前localStorage剩余容量为' + (size / 1024).toFixed(2) + 'KB');
}
//需要传递当前的版本
function checkUpdate(wgtVer) {
	var url1 = web_url() + "/?type=search&t=banben&number=1&page=1&ordertype=dtime&orderby=desc";
	getData(false, 'get', url1, '', function(mmm) {
		if(mmm == undefined || mmm.msg == '[]') {
			return false;
		}
		var bianhao = JSON.parse(mmm.msg)[0].banbenhao;
		if(bianhao == '' || bianhao == undefined) {
			return false;
		}
		var bianhaoA = parseFloat(bianhao);
		var bianhaoB = parseFloat(wgtVer);
		//console.log(bianhaoB+"   "+bianhaoA);
		var qz = JSON.parse(mmm.msg)[0].shifouqiangzhishengji;
		var sj = JSON.parse(mmm.msg)[0].gengxinshujuleixing;
		if(bianhaoB < bianhaoA) {
			//return false;//更新控制
			if(qz == '是') {
				document.getElementById("gengxin-bar").style.display = 'block';
				if(sj == '全新安装') {
					if(mui.os.android) {
						plus.runtime.openURL(result.xiazailianjie, 'com.android.browser');
					}
					if(mui.os.ios) {
						plus.runtime.openURL(result.iosxiazailianjie);
					}
				} else {
					downWgt(web_url() + "/" + JSON.parse(mmm.msg)[0].xiazaidizhi);
				}
			} else {
				mui.confirm('有新版本，是否升级？', '版本更新', ['是', '否'], function(e) {
					if(e.index == 0) {
						if(sj == '全新安装') {
							if(mui.os.android) {
								plus.runtime.openURL(result.xiazailianjie, 'com.android.browser');
							}
							if(mui.os.ios) {
								plus.runtime.openURL(result.iosxiazailianjie);
							}
						} else {
							downWgt(web_url() + "/" + JSON.parse(mmm.msg)[0].xiazaidizhi);
						}
					}
				});
			}
		}
	});
}
// 下载wgt文件
function downWgt(wgtUrl) {
	plus.nativeUI.showWaiting("下载更新文件...");
	plus.downloader.createDownload(wgtUrl, {
		filename: "_doc/update/"
	}, function(d, status) {
		if(status == 200) {
			console.log("下载wgt成功：" + d.filename);
			plus.nativeUI.closeWaiting();
			installWgt(d.filename);
		} else {
			console.log("下载wgt失败！");
			plus.nativeUI.alert("下载更新失败！");
		}
		plus.nativeUI.closeWaiting();
	}).start();
}
// 更新应用资源  
function installWgt(path) {
	plus.nativeUI.showWaiting("安装更新文件...");
	plus.runtime.install(path, {}, function() {
		plus.nativeUI.closeWaiting();
		plus.nativeUI.alert("应用资源更新完成！", function() {
			plus.runtime.restart();
		});
	}, function(e) {
		plus.nativeUI.closeWaiting();
		plus.nativeUI.alert("安装更新文件失败[" + e.code + "]：" + e.message);
	});
}
//网络判断
function net_yno() {　　
	var types = {};　　
	types[plus.networkinfo.CONNECTION_UNKNOW] = "Unknown connection";　　
	types[plus.networkinfo.CONNECTION_NONE] = "None connection";　　
	types[plus.networkinfo.CONNECTION_ETHERNET] = "Ethernet connection";　　
	types[plus.networkinfo.CONNECTION_WIFI] = "WiFi connection";　　
	types[plus.networkinfo.CONNECTION_CELL2G] = "Cellular 2G connection";　　
	types[plus.networkinfo.CONNECTION_CELL3G] = "Cellular 3G connection";　　
	types[plus.networkinfo.CONNECTION_CELL4G] = "Cellular 4G connection";　　 //console.log( "Network: " + types[plus.networkinfo.getCurrentType()] );
	//None connection
	//WiFi connection
	//Cellular 4G connection
	var dd = true;
	var aa = types[plus.networkinfo.getCurrentType()];
	if(aa == 'None connection' || aa == 'Unknown connection') {
		//mui.toast('网络异常，请检查网络后下拉刷新');
		dd = false;
	}
	setParam('net', dd);
}

function onNetChange() {　　 //获取当前网络类型
	　　
	var nt = plus.networkinfo.getCurrentType();　　
	switch(nt) {　　　　
		case plus.networkinfo.CONNECTION_ETHERNET:
			　　　　
		case plus.networkinfo.CONNECTION_WIFI:
			　　　　　　mui.toast("当前网络为WiFi");　　　　　　
			break;　　　　
		case plus.networkinfo.CONNECTION_CELL2G:
			　　　　
		case plus.networkinfo.CONNECTION_CELL3G:
			　　　　
		case plus.networkinfo.CONNECTION_CELL4G:
			　　　　　　mui.toast("当前网络非WiFi");　　　　　　
			break;　　　　
		default:
			　　　　　　mui.toast("当前没有网络");　　　　　　
			break;　　
	}
}

function home_id() {
	//	return 'HBuilder';
	//	return 'H547E21F3';
	//	return 'index.html';
	return localStorage.home;
}

function wx_time() {
	return '9999-12-31 00:00:00';
}

function gq_time() {
	return '1000-01-01 00:00:00';
}

function rizi() {
	return '&xt_yhm=' + localStorage.yonghuming + '&token=' + localStorage.login_token;
}
if(localStorage.web_url == undefined) {
	setParam('web_url', 'http://222.82.243.27:8282');
}

function web_url() {
	return 'http://222.82.243.27:8282';
}

function linkA(obj) {
	openWindows($(obj).data('href'));
}

function openWindows(url) {
	//	open_view("user_list1.html");
	//		//return false;
	//  webviewShow = plus.webview.create(url);//后台创建webview并打开show.html 
	//  webviewShow.addEventListener("loaded", function() { //注册新webview的载入完成事件 
	//      webviewShow.show("slide-in-right",0); //把新webview窗体显示出来，显示动画效果为速度150毫秒的右侧移入动画
	//      close_view("user_list1.html"); 
	//  }, false); 
	//  
	mui.openWindow({
		url: url,
		createNew: false,
		show: {
			autoShow: true,
			aniShow: 'slide-in-right',
		},
		waiting: {
			autoShow: false,
			//title:'努力加载中...',//等待对话框上显示的提示内容
		}
	});

}

function open_view(str) {
	var w = plus.webview.create(str);
	plus.webview.show(w, 'slide-in-right', 150);
}

function close_view(str) {
	var w = plus.webview.getWebviewById(str);
	plus.webview.close(w, 'slide-in-left', 0);
}

function openWindowsToCreateNew(url) {
	mui.openWindow({
		url: url,
		createNew: true,
		show: {
			autoShow: false,
			aniShow: 'slide-in-right',
		},
		waiting: {
			autoShow: true,
			title: '努力加载中...', //等待对话框上显示的提示内容
		}
	});
}

function HTMLEncode(html) {
	var temp = document.createElement("div");
	(temp.textContent != null) ? (temp.textContent = html) : (temp.innerText = html);
	var output = temp.innerHTML;
	temp = null;
	return output;
}
//html反转义
function HTMLDecode(text) {
	var temp = document.createElement("div");
	temp.innerHTML = text;
	var output = temp.innerText || temp.textContent;
	temp = null;
	return output;
}

function img_htmlA(content) {
	content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function(match) {
		console.log(match);
	});
}

function img_htmlB(content) {
	content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function(match, capture) {
		content = content.replace(capture, web_url() + '/' + capture)
		return content;
	});
	return content;
}

function getData(asyncFlag, type, url, formData, callback) {
	$.ajax({
		async: asyncFlag,
		type: type,
		url: url,
		data: formData,
		contentType: "application/x-www-form-urlencoded; charset=utf-8",
		success: function(data) {
			callback(data);
		}
	});
}

function extend(obj1, obj2) {
	for(var i = 0; i < obj2.length; i++) {
		obj1.push(obj2[i]);
	}
}

function extendA(obj1, obj2, num) {
	var n = obj2.length;
	if(n < num) {
		num = n;
	}
	for(var i = 0; i < num; i++) {
		obj1.push(obj2[i]);
	}
}

function img_chuli(str) {
	var substr = '';
	if(str != '' && str != null) {
		substr = web_url() + '/' + str;
	} else {
		substr = 'images/wutu.jpg';
	}
	return substr;
}

function setParam(name, value) {
	localStorage.setItem(name, value);
}

function getParam(name) {
	return localStorage.getItem(name);
}

function delParam(name) {
	localStorage.removeItem(name);
}

function time_d1(str) {
	if(str == '') {
		var time = new Date();
	} else {
		var time = new Date(str);
	}
	var year = time.getFullYear();
	var month = time.getMonth() + 1;
	month < 10 ? month = '0' + month : month;
	var day = time.getDate();
	day < 10 ? day = '0' + day : day;
	return year + '-' + month + '-' + day;
}

function timeA() {
	var time = new Date();
	var year = time.getFullYear();
	var month = time.getMonth() + 1;
	month < 10 ? month = '0' + month : month;
	var day = time.getDate();
	day < 10 ? day = '0' + day : day;
	var hour = time.getHours();
	hour < 10 ? hour = '0' + hour : hour;
	var minutes = time.getMinutes();
	minutes < 10 ? minutes = '0' + minutes : minutes;
	var second = time.getSeconds();
	second < 10 ? second = '0' + second : second;
	return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + second;
}
//加一天
function timeA_date_add(str) {
	if(str == '') {
		var time = new Date();
	} else {
		var time = new Date(str);
	}
	time.setDate(time.getDate() + 1);
	var year = time.getFullYear();
	var month = time.getMonth() + 1;
	month < 10 ? month = '0' + month : month;
	var day = time.getDate();
	day < 10 ? day = '0' + day : day;
	var hour = time.getHours();
	hour < 10 ? hour = '0' + hour : hour;
	var minutes = time.getMinutes();
	minutes < 10 ? minutes = '0' + minutes : minutes;
	var second = time.getSeconds();
	second < 10 ? second = '0' + second : second;
	return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + second;
}
//今天前
function time_qian(str) {
	if(str == '') {
		var time = new Date();
	} else {
		var time = new Date(str);
	}
	var year = time.getFullYear();
	var month = time.getMonth() + 1;
	month < 10 ? month = '0' + month : month;
	var day = time.getDate();
	day < 10 ? day = '0' + day : day;
	var hour = time.getHours();
	hour < 10 ? hour = '0' + hour : hour;
	var minutes = time.getMinutes();
	minutes < 10 ? minutes = '0' + minutes : minutes;
	var second = time.getSeconds();
	second < 10 ? second = '0' + second : second;
	return year + '-' + month + '-' + day + ' 00:00:00';
}
//今天结束
function time_end(str) {
	if(str == '') {
		var time = new Date();
	} else {
		var time = new Date(str);
	}
	time.setDate(time.getDate() + 1);
	var year = time.getFullYear();
	var month = time.getMonth() + 1;
	month < 10 ? month = '0' + month : month;
	var day = time.getDate();
	day < 10 ? day = '0' + day : day;
	var hour = time.getHours();
	hour < 10 ? hour = '0' + hour : hour;
	var minutes = time.getMinutes();
	minutes < 10 ? minutes = '0' + minutes : minutes;
	var second = time.getSeconds();
	second < 10 ? second = '0' + second : second;
	return year + '-' + month + '-' + day + ' 00:00:00';
}
//获取本周开始时间结束时间
function week_time() {
	var now = new Date(); //当前日期 
	var nowDayOfWeek = now.getDay(); //今天本周的第几天 
	var nowDay = now.getDate(); //当前日 
	var nowMonth = now.getMonth(); //当前月 
	var nowYear = now.getFullYear(); //当前年

	var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
	var stime = formatDate(weekStartDate);

	var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek));
	var etime = formatDate(weekEndDate);

	var monthStartDate = new Date(nowYear, nowMonth, 1);
	var syue = formatDate(monthStartDate);

	var monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth));
	var eyue = formatDate(monthEndDate);

	var stime_a = formatDate(weekStartDate);

	var etime_a = formatDate(weekEndDate);

	return stime + '*' + etime + '*' + syue + '*' + eyue + '*' + stime_a + '*' + etime_a;

}

function str_tm(num,type){
	var day1 = new Date();
	day1.setDate(day1.getDate() - num);
	var str=day1.toLocaleDateString(); 
	var arr=str.split('/');
	var tm=arr[0]+'-'+arr[1]+'-'+arr[2];
	if(type==0){
		tm=tm + " 00:00:00";
	}else if(type==1){
		tm=tm + " 23:59:59";
	}else if(type=3){
		var hour = day1.getHours();
		hour < 10 ? hour = '0' + hour : hour;
		var minutes = day1.getMinutes();
		minutes < 10 ? minutes = '0' + minutes : minutes;
		var second = day1.getSeconds();
		second < 10 ? second = '0' + second : second;
		tm=tm + " "+hour+":"+minutes+":"+second;
	}
	return tm;
}
//console.log(str_tm(1,0));//昨天
//console.log(str_tm(0,2));//今日
//console.log(str_tm(-1,0));//明天
//console.log(str_tm(-2,0));//后天

function getMonthDays(myMonth) {
	var now = new Date(); //当前日期 
	var nowYear = now.getFullYear(); //当前年
	var monthStartDate = new Date(nowYear, myMonth, 1);
	var monthEndDate = new Date(nowYear, myMonth + 1, 1);
	var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
	return days;
}
//格式化日期：yyyy-MM-dd 
function formatDate(date) {
	var myyear = date.getFullYear();
	var mymonth = date.getMonth() + 1;
	var myweekday = date.getDate();
	if(mymonth < 10) {
		mymonth = "0" + mymonth;
	}
	if(myweekday < 10) {
		myweekday = "0" + myweekday;
	}
	return(myyear + "-" + mymonth + "-" + myweekday);
}

function timeB(str) {
	if(str == '') {
		var time = new Date();
	} else {
		var time = new Date(str);
	}
	var year = time.getFullYear();
	var month = time.getMonth() + 1;
	month < 10 ? month = '0' + month : month;
	var day = time.getDate();
	day < 10 ? day = '0' + day : day;
	var hour = time.getHours();
	hour < 10 ? hour = '0' + hour : hour;
	var minutes = time.getMinutes();
	minutes < 10 ? minutes = '0' + minutes : minutes;
	var second = time.getSeconds();
	second < 10 ? second = '0' + second : second;
	return month + '月' + day + '日';
}

function timeC(str) {
	if(str == '') {
		var time = new Date();
	} else {
		var time = new Date(str);
	}
	var day = time.getDay();
	var str = '';
	if(day == 0) {
		str = '星期天';
	} else if(day == 1) {
		str = '星期一';
	} else if(day == 2) {
		str = '星期二';
	} else if(day == 3) {
		str = '星期三';
	} else if(day == 4) {
		str = '星期四';
	} else if(day == 5) {
		str = '星期五';
	} else if(day == 6) {
		str = '星期六';
	}
	return str;
}

function timeD(str) {
	var time = new Date(str);
	var year = time.getFullYear();
	var month = time.getMonth() + 1;
	month < 10 ? month = '0' + month : month;
	var day = time.getDate();
	day < 10 ? day = '0' + day : day;
	var hour = time.getHours();
	hour < 10 ? hour = '0' + hour : hour;
	var minutes = time.getMinutes();
	minutes < 10 ? minutes = '0' + minutes : minutes;
	var second = time.getSeconds();
	second < 10 ? second = '0' + second : second;
	var tday = time.getDay();
	var str = '';
	if(tday == 0) {
		str = '星期天';
	} else if(tday == 1) {
		str = '星期一';
	} else if(tday == 2) {
		str = '星期二';
	} else if(tday == 3) {
		str = '星期三';
	} else if(tday == 4) {
		str = '星期四';
	} else if(tday == 5) {
		str = '星期五';
	} else if(tday == 6) {
		str = '星期六';
	}
	return month + '月' + day + '日' + '&nbsp;&nbsp;<span class="ys1">' + str + '</span>';
}

function timeE(str) {
	var time = new Date(str);
	var year = time.getFullYear();
	var month = time.getMonth() + 1;
	month < 10 ? month = '0' + month : month;
	var day = time.getDate();
	day < 10 ? day = '0' + day : day;
	var hour = time.getHours();
	hour < 10 ? hour = '0' + hour : hour;
	var minutes = time.getMinutes();
	minutes < 10 ? minutes = '0' + minutes : minutes;
	var second = time.getSeconds();
	second < 10 ? second = '0' + second : second;
	var tday = time.getDay();
	var str = '';
	if(tday == 0) {
		str = '星期天';
	} else if(tday == 1) {
		str = '星期一';
	} else if(tday == 2) {
		str = '星期二';
	} else if(tday == 3) {
		str = '星期三';
	} else if(tday == 4) {
		str = '星期四';
	} else if(tday == 5) {
		str = '星期五';
	} else if(tday == 6) {
		str = '星期六';
	}
	return month + '月' + day + '日' + '&nbsp;&nbsp;' + str;
}

function timeF(str) {
	var time = str.split(' ');
	return time[0];
}

function getDateDiff(dateStr) {
	var dateTimeStamp = Date.parse(dateStr.replace(/-/gi, "/"));
	var minute = 1000 * 60;
	var hour = minute * 60;
	var day = hour * 24;
	var halfamonth = day * 15;
	var month = day * 30;
	var now = new Date().getTime();
	var diffValue = now - dateTimeStamp;
	if(diffValue < 0) {
		return;
	}
	var monthC = diffValue / month;
	var weekC = diffValue / (7 * day);
	var dayC = diffValue / day;
	var hourC = diffValue / hour;
	var minC = diffValue / minute;
	if(monthC >= 1) {
		result = "" + parseInt(monthC) + "月前";
	} else if(weekC >= 1) {
		result = "" + parseInt(weekC) + "周前";
	} else if(dayC >= 1) {
		result = "" + parseInt(dayC) + "天前";
	} else if(hourC >= 1) {
		result = "" + parseInt(hourC) + "小时前";
	} else if(minC >= 1) {
		result = "" + parseInt(minC) + "分钟前";
	} else
		result = "刚刚";
	return result;
}

//新增数
function xinzengshu(shu) {
	//var url_a=web_url()+'/?type=edit&t=user&id='+JSON.parse(localStorage.ubase).msg[0].id+rizi();
	var num = JSON.parse(localStorage.ubase).msg[0].xinzengshu;
	if(num == undefined || num == "" || num == null) {
		num = '0';
	}
	var a = parseInt(num);
	var end = 0;
	if(shu == '') {
		end = a++;
	} else {
		var b = parseInt(shu)
		end = a + b;
	}
	var base = JSON.parse(localStorage.ubase);
	base.msg[0].xinzengshu = end;
	setParam('ubase', JSON.stringify(base));
	//var data_a='xinzengshu='+end;
	//getData(false,'get',url_a,data_a,function(result){console.log('xinzengshu');});
}
//修改数
function xiugaishu(shu) {
	//var url_a=web_url()+'/?type=edit&t=user&id='+JSON.parse(localStorage.ubase).msg[0].id+rizi();
	var num = JSON.parse(localStorage.ubase).msg[0].xiugaishu;
	if(num == undefined || num == "" || num == null) {
		num = '0';
	}
	var a = parseInt(num);
	var end = 0;
	if(shu == '') {
		end = a++;
	} else {
		var b = parseInt(shu);
		end = a + b;
	}
	var base = JSON.parse(localStorage.ubase);
	base.msg[0].xiugaishu = end;
	setParam('ubase', JSON.stringify(base));
	//var data_a='xiugaishu='+end;
	//getData(false,'post',url_a,data_a,function(result){console.log('xiugaishu');});
}
//from正则验证
function from_zz(type) {
	if(type == '身份证') {
		return /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/;
	} else if(type == '数字') {
		return /^(\d*\.)?\d+$/;
	} else if(type == '正整数') {
		return /^[0-9]*[1-9][0-9]*$/;
	} else if(type == '正数') {
		return /^([0-9]*\.)?[0-9]+$/;
	} else if(type == '电话') {
		return /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;
	} else if(type == '手机') {
		return /^1+\d{10}$/;
	} else if(type == '邮箱') {
		return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
	} else if(type == '空') {
		return /\s+/g;
	}
}
//组图
function imglist_act(imglist) {
	if(imglist != "") {
		var imglist = imglist.replace(/{title}/g, "");
		var imglist = imglist.split('{next}');
		return imglist;
	}
}

function zu1_act(xiaoguotu) {
	var zu = [];
	var xiaoguotu_tu = imglist_act(xiaoguotu);
	for(var j = 0; j < xiaoguotu_tu.length; j++) {
		zu.push(xiaoguotu_tu[j]);
	}
	$('.swiper-wrapper').empty();
	for(var k = 0; k < zu.length; k++) {
		$('.swiper-wrapper').append('<div class="swiper-slide"><img src="' + web_url() + '/' + zu[k] + '"/></div>');
	}
}

function zu1_end(b) {
	var a = 0;
	var swiper = new Swiper('.swiper-container', {
		pagination: '.swiper-pagination',
		paginationType: 'custom',
		paginationCustomRender: function(swiper, current, total) {
			return current + '/' + total;
		},
		initialSlide: b,
		onInit: function(swiper) {

		}
	});
}
$('.close-img').on('click', function() {
	$('#outimg').hide();
});

function out_img(obj) {
	console.log('zutu');
	var zutu = document.getElementById("fangwutupian").value;
	console.log(zutu);
	if(zutu != '') {
		zu1_act(zutu);
		$('#outimg').show();
		var index = $(obj).parents('.upimg-li').index();
		zu1_end(index);
	}
}
//年
function nianling(str) {
	var a = new Date();
	var b = new Date(str);
	a = a.valueOf();
	b = b.valueOf();
	var c = a - b;
	c = new Date(c);
	console.log(c.getFullYear() - 1970 + '年' + (c.getMonth()) + '个月' + (c.getDate() - 1) + '天' + (c.getHours() - 8) + '个小时' + c.getMinutes() + '分钟' + c.getSeconds() + '秒');
	return c.getFullYear() - 1970;
}
//窗口清理
function home_view() {
	var curr = plus.webview.currentWebview();
	var wvs = plus.webview.all();
	for(var i = 0, len = wvs.length; i < len; i++) {
		if(wvs[i].id != curr.id && wvs[i].id != 'tianqi1.html' && wvs[i].id != 'user_list1.html' && wvs[i].id != 'login.html') {
			plus.webview.close(wvs[i]);
		} else {
			continue;
		}
	}
}

//首页返回键处理  处理逻辑：2秒内，连续两次按返回键，则退出应用；
function doubleBack() {
	var first = null;
	mui.back = function() {
		//首次按键，提示‘再按一次退出应用’
		if(!first) {
			first = new Date().getTime();
			mui.toast('再按一次退出应用');
			setTimeout(function() {
				first = null;
			}, 1000);
		} else {
			if(new Date().getTime() - first < 2000) {
				plus.runtime.quit();
			}
		}
	};
};