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
		return 'index.html';
	//return localStorage.home;
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



// 汉字拼音首字母列表 本列表包含了20902个汉字
//函数使用,本表收录的字符的Unicode编码范围为19968至40869, XDesigner 整理
var strChineseFirstPY = "YDYQSXMWZSSXJBYMGCCZQPSSQBYCDSCDQLDYLYBSSJGYZZJJFKCCLZDHWDWZJLJPFYYNWJJTMYHZWZHFLZPPQHGSCYYYNJQYXXGJHHSDSJNKKTMOMLCRXYPSNQSECCQZGGLLYJLMYZZSECYKYYHQWJSSGGYXYZYJWWKDJHYCHMYXJTLXJYQBYXZLDWRDJRWYSRLDZJPCBZJJBRCFTLECZSTZFXXZHTRQHYBDLYCZSSYMMRFMYQZPWWJJYFCRWFDFZQPYDDWYXKYJAWJFFXYPSFTZYHHYZYSWCJYXSCLCXXWZZXNBGNNXBXLZSZSBSGPYSYZDHMDZBQBZCWDZZYYTZHBTSYYBZGNTNXQYWQSKBPHHLXGYBFMJEBJHHGQTJCYSXSTKZHLYCKGLYSMZXYALMELDCCXGZYRJXSDLTYZCQKCNNJWHJTZZCQLJSTSTBNXBTYXCEQXGKWJYFLZQLYHYXSPSFXLMPBYSXXXYDJCZYLLLSJXFHJXPJBTFFYABYXBHZZBJYZLWLCZGGBTSSMDTJZXPTHYQTGLJSCQFZKJZJQNLZWLSLHDZBWJNCJZYZSQQYCQYRZCJJWYBRTWPYFTWEXCSKDZCTBZHYZZYYJXZCFFZZMJYXXSDZZOTTBZLQWFCKSZSXFYRLNYJMBDTHJXSQQCCSBXYYTSYFBXDZTGBCNSLCYZZPSAZYZZSCJCSHZQYDXLBPJLLMQXTYDZXSQJTZPXLCGLQTZWJBHCTSYJSFXYEJJTLBGXSXJMYJQQPFZASYJNTYDJXKJCDJSZCBARTDCLYJQMWNQNCLLLKBYBZZSYHQQLTWLCCXTXLLZNTYLNEWYZYXCZXXGRKRMTCNDNJTSYYSSDQDGHSDBJGHRWRQLYBGLXHLGTGXBQJDZPYJSJYJCTMRNYMGRZJCZGJMZMGXMPRYXKJNYMSGMZJYMKMFXMLDTGFBHCJHKYLPFMDXLQJJSMTQGZSJLQDLDGJYCALCMZCSDJLLNXDJFFFFJCZFMZFFPFKHKGDPSXKTACJDHHZDDCRRCFQYJKQCCWJDXHWJLYLLZGCFCQDSMLZPBJJPLSBCJGGDCKKDEZSQCCKJGCGKDJTJDLZYCXKLQSCGJCLTFPCQCZGWPJDQYZJJBYJHSJDZWGFSJGZKQCCZLLPSPKJGQJHZZLJPLGJGJJTHJJYJZCZMLZLYQBGJWMLJKXZDZNJQSYZMLJLLJKYWXMKJLHSKJGBMCLYYMKXJQLBMLLKMDXXKWYXYSLMLPSJQQJQXYXFJTJDXMXXLLCXQBSYJBGWYMBGGBCYXPJYGPEPFGDJGBHBNSQJYZJKJKHXQFGQZKFHYGKHDKLLSDJQXPQYKYBNQSXQNSZSWHBSXWHXWBZZXDMNSJBSBKBBZKLYLXGWXDRWYQZMYWSJQLCJXXJXKJEQXSCYETLZHLYYYSDZPAQYZCMTLSHTZCFYZYXYLJSDCJQAGYSLCQLYYYSHMRQQKLDXZSCSSSYDYCJYSFSJBFRSSZQSBXXPXJYSDRCKGJLGDKZJZBDKTCSYQPYHSTCLDJDHMXMCGXYZHJDDTMHLTXZXYLYMOHYJCLTYFBQQXPFBDFHHTKSQHZYYWCNXXCRWHOWGYJLEGWDQCWGFJYCSNTMYTOLBYGWQWESJPWNMLRYDZSZTXYQPZGCWXHNGPYXSHMYQJXZTDPPBFYHZHTJYFDZWKGKZBLDNTSXHQEEGZZYLZMMZYJZGXZXKHKSTXNXXWYLYAPSTHXDWHZYMPXAGKYDXBHNHXKDPJNMYHYLPMGOCSLNZHKXXLPZZLBMLSFBHHGYGYYGGBHSCYAQTYWLXTZQCEZYDQDQMMHTKLLSZHLSJZWFYHQSWSCWLQAZYNYTLSXTHAZNKZZSZZLAXXZWWCTGQQTDDYZTCCHYQZFLXPSLZYGPZSZNGLNDQTBDLXGTCTAJDKYWNSYZLJHHZZCWNYYZYWMHYCHHYXHJKZWSXHZYXLYSKQYSPSLYZWMYPPKBYGLKZHTYXAXQSYSHXASMCHKDSCRSWJPWXSGZJLWWSCHSJHSQNHCSEGNDAQTBAALZZMSSTDQJCJKTSCJAXPLGGXHHGXXZCXPDMMHLDGTYBYSJMXHMRCPXXJZCKZXSHMLQXXTTHXWZFKHCCZDYTCJYXQHLXDHYPJQXYLSYYDZOZJNYXQEZYSQYAYXWYPDGXDDXSPPYZNDLTWRHXYDXZZJHTCXMCZLHPYYYYMHZLLHNXMYLLLMDCPPXHMXDKYCYRDLTXJCHHZZXZLCCLYLNZSHZJZZLNNRLWHYQSNJHXYNTTTKYJPYCHHYEGKCTTWLGQRLGGTGTYGYHPYHYLQYQGCWYQKPYYYTTTTLHYHLLTYTTSPLKYZXGZWGPYDSSZZDQXSKCQNMJJZZBXYQMJRTFFBTKHZKBXLJJKDXJTLBWFZPPTKQTZTGPDGNTPJYFALQMKGXBDCLZFHZCLLLLADPMXDJHLCCLGYHDZFGYDDGCYYFGYDXKSSEBDHYKDKDKHNAXXYBPBYYHXZQGAFFQYJXDMLJCSQZLLPCHBSXGJYNDYBYQSPZWJLZKSDDTACTBXZDYZYPJZQSJNKKTKNJDJGYYPGTLFYQKASDNTCYHBLWDZHBBYDWJRYGKZYHEYYFJMSDTYFZJJHGCXPLXHLDWXXJKYTCYKSSSMTWCTTQZLPBSZDZWZXGZAGYKTYWXLHLSPBCLLOQMMZSSLCMBJCSZZKYDCZJGQQDSMCYTZQQLWZQZXSSFPTTFQMDDZDSHDTDWFHTDYZJYQJQKYPBDJYYXTLJHDRQXXXHAYDHRJLKLYTWHLLRLLRCXYLBWSRSZZSYMKZZHHKYHXKSMDSYDYCJPBZBSQLFCXXXNXKXWYWSDZYQOGGQMMYHCDZTTFJYYBGSTTTYBYKJDHKYXBELHTYPJQNFXFDYKZHQKZBYJTZBXHFDXKDASWTAWAJLDYJSFHBLDNNTNQJTJNCHXFJSRFWHZFMDRYJYJWZPDJKZYJYMPCYZNYNXFBYTFYFWYGDBNZZZDNYTXZEMMQBSQEHXFZMBMFLZZSRXYMJGSXWZJSPRYDJSJGXHJJGLJJYNZZJXHGXKYMLPYYYCXYTWQZSWHWLYRJLPXSLSXMFSWWKLCTNXNYNPSJSZHDZEPTXMYYWXYYSYWLXJQZQXZDCLEEELMCPJPCLWBXSQHFWWTFFJTNQJHJQDXHWLBYZNFJLALKYYJLDXHHYCSTYYWNRJYXYWTRMDRQHWQCMFJDYZMHMYYXJWMYZQZXTLMRSPWWCHAQBXYGZYPXYYRRCLMPYMGKSJSZYSRMYJSNXTPLNBAPPYPYLXYYZKYNLDZYJZCZNNLMZHHARQMPGWQTZMXXMLLHGDZXYHXKYXYCJMFFYYHJFSBSSQLXXNDYCANNMTCJCYPRRNYTYQNYYMBMSXNDLYLYSLJRLXYSXQMLLYZLZJJJKYZZCSFBZXXMSTBJGNXYZHLXNMCWSCYZYFZLXBRNNNYLBNRTGZQYSATSWRYHYJZMZDHZGZDWYBSSCSKXSYHYTXXGCQGXZZSHYXJSCRHMKKBXCZJYJYMKQHZJFNBHMQHYSNJNZYBKNQMCLGQHWLZNZSWXKHLJHYYBQLBFCDSXDLDSPFZPSKJYZWZXZDDXJSMMEGJSCSSMGCLXXKYYYLNYPWWWGYDKZJGGGZGGSYCKNJWNJPCXBJJTQTJWDSSPJXZXNZXUMELPXFSXTLLXCLJXJJLJZXCTPSWXLYDHLYQRWHSYCSQYYBYAYWJJJQFWQCQQCJQGXALDBZZYJGKGXPLTZYFXJLTPADKYQHPMATLCPDCKBMTXYBHKLENXDLEEGQDYMSAWHZMLJTWYGXLYQZLJEEYYBQQFFNLYXRDSCTGJGXYYNKLLYQKCCTLHJLQMKKZGCYYGLLLJDZGYDHZWXPYSJBZKDZGYZZHYWYFQYTYZSZYEZZLYMHJJHTSMQWYZLKYYWZCSRKQYTLTDXWCTYJKLWSQZWBDCQYNCJSRSZJLKCDCDTLZZZACQQZZDDXYPLXZBQJYLZLLLQDDZQJYJYJZYXNYYYNYJXKXDAZWYRDLJYYYRJLXLLDYXJCYWYWNQCCLDDNYYYNYCKCZHXXCCLGZQJGKWPPCQQJYSBZZXYJSQPXJPZBSBDSFNSFPZXHDWZTDWPPTFLZZBZDMYYPQJRSDZSQZSQXBDGCPZSWDWCSQZGMDHZXMWWFYBPDGPHTMJTHZSMMBGZMBZJCFZWFZBBZMQCFMBDMCJXLGPNJBBXGYHYYJGPTZGZMQBQTCGYXJXLWZKYDPDYMGCFTPFXYZTZXDZXTGKMTYBBCLBJASKYTSSQYYMSZXFJEWLXLLSZBQJJJAKLYLXLYCCTSXMCWFKKKBSXLLLLJYXTYLTJYYTDPJHNHNNKBYQNFQYYZBYYESSESSGDYHFHWTCJBSDZZTFDMXHCNJZYMQWSRYJDZJQPDQBBSTJGGFBKJBXTGQHNGWJXJGDLLTHZHHYYYYYYSXWTYYYCCBDBPYPZYCCZYJPZYWCBDLFWZCWJDXXHYHLHWZZXJTCZLCDPXUJCZZZLYXJJTXPHFXWPYWXZPTDZZBDZCYHJHMLXBQXSBYLRDTGJRRCTTTHYTCZWMXFYTWWZCWJWXJYWCSKYBZSCCTZQNHXNWXXKHKFHTSWOCCJYBCMPZZYKBNNZPBZHHZDLSYDDYTYFJPXYNGFXBYQXCBHXCPSXTYZDMKYSNXSXLHKMZXLYHDHKWHXXSSKQYHHCJYXGLHZXCSNHEKDTGZXQYPKDHEXTYKCNYMYYYPKQYYYKXZLTHJQTBYQHXBMYHSQCKWWYLLHCYYLNNEQXQWMCFBDCCMLJGGXDQKTLXKGNQCDGZJWYJJLYHHQTTTNWCHMXCXWHWSZJYDJCCDBQCDGDNYXZTHCQRXCBHZTQCBXWGQWYYBXHMBYMYQTYEXMQKYAQYRGYZSLFYKKQHYSSQYSHJGJCNXKZYCXSBXYXHYYLSTYCXQTHYSMGSCPMMGCCCCCMTZTASMGQZJHKLOSQYLSWTMXSYQKDZLJQQYPLSYCZTCQQPBBQJZCLPKHQZYYXXDTDDTSJCXFFLLCHQXMJLWCJCXTSPYCXNDTJSHJWXDQQJSKXYAMYLSJHMLALYKXCYYDMNMDQMXMCZNNCYBZKKYFLMCHCMLHXRCJJHSYLNMTJZGZGYWJXSRXCWJGJQHQZDQJDCJJZKJKGDZQGJJYJYLXZXXCDQHHHEYTMHLFSBDJSYYSHFYSTCZQLPBDRFRZTZYKYWHSZYQKWDQZRKMSYNBCRXQBJYFAZPZZEDZCJYWBCJWHYJBQSZYWRYSZPTDKZPFPBNZTKLQYHBBZPNPPTYZZYBQNYDCPJMMCYCQMCYFZZDCMNLFPBPLNGQJTBTTNJZPZBBZNJKLJQYLNBZQHKSJZNGGQSZZKYXSHPZSNBCGZKDDZQANZHJKDRTLZLSWJLJZLYWTJNDJZJHXYAYNCBGTZCSSQMNJPJYTYSWXZFKWJQTKHTZPLBHSNJZSYZBWZZZZLSYLSBJHDWWQPSLMMFBJDWAQYZTCJTBNNWZXQXCDSLQGDSDPDZHJTQQPSWLYYJZLGYXYZLCTCBJTKTYCZJTQKBSJLGMGZDMCSGPYNJZYQYYKNXRPWSZXMTNCSZZYXYBYHYZAXYWQCJTLLCKJJTJHGDXDXYQYZZBYWDLWQCGLZGJGQRQZCZSSBCRPCSKYDZNXJSQGXSSJMYDNSTZTPBDLTKZWXQWQTZEXNQCZGWEZKSSBYBRTSSSLCCGBPSZQSZLCCGLLLZXHZQTHCZMQGYZQZNMCOCSZJMMZSQPJYGQLJYJPPLDXRGZYXCCSXHSHGTZNLZWZKJCXTCFCJXLBMQBCZZWPQDNHXLJCTHYZLGYLNLSZZPCXDSCQQHJQKSXZPBAJYEMSMJTZDXLCJYRYYNWJBNGZZTMJXLTBSLYRZPYLSSCNXPHLLHYLLQQZQLXYMRSYCXZLMMCZLTZSDWTJJLLNZGGQXPFSKYGYGHBFZPDKMWGHCXMSGDXJMCJZDYCABXJDLNBCDQYGSKYDQTXDJJYXMSZQAZDZFSLQXYJSJZYLBTXXWXQQZBJZUFBBLYLWDSLJHXJYZJWTDJCZFQZQZZDZSXZZQLZCDZFJHYSPYMPQZMLPPLFFXJJNZZYLSJEYQZFPFZKSYWJJJHRDJZZXTXXGLGHYDXCSKYSWMMZCWYBAZBJKSHFHJCXMHFQHYXXYZFTSJYZFXYXPZLCHMZMBXHZZSXYFYMNCWDABAZLXKTCSHHXKXJJZJSTHYGXSXYYHHHJWXKZXSSBZZWHHHCWTZZZPJXSNXQQJGZYZYWLLCWXZFXXYXYHXMKYYSWSQMNLNAYCYSPMJKHWCQHYLAJJMZXHMMCNZHBHXCLXTJPLTXYJHDYYLTTXFSZHYXXSJBJYAYRSMXYPLCKDUYHLXRLNLLSTYZYYQYGYHHSCCSMZCTZQXKYQFPYYRPFFLKQUNTSZLLZMWWTCQQYZWTLLMLMPWMBZSSTZRBPDDTLQJJBXZCSRZQQYGWCSXFWZLXCCRSZDZMCYGGDZQSGTJSWLJMYMMZYHFBJDGYXCCPSHXNZCSBSJYJGJMPPWAFFYFNXHYZXZYLREMZGZCYZSSZDLLJCSQFNXZKPTXZGXJJGFMYYYSNBTYLBNLHPFZDCYFBMGQRRSSSZXYSGTZRNYDZZCDGPJAFJFZKNZBLCZSZPSGCYCJSZLMLRSZBZZLDLSLLYSXSQZQLYXZLSKKBRXBRBZCYCXZZZEEYFGKLZLYYHGZSGZLFJHGTGWKRAAJYZKZQTSSHJJXDCYZUYJLZYRZDQQHGJZXSSZBYKJPBFRTJXLLFQWJHYLQTYMBLPZDXTZYGBDHZZRBGXHWNJTJXLKSCFSMWLSDQYSJTXKZSCFWJLBXFTZLLJZLLQBLSQMQQCGCZFPBPHZCZJLPYYGGDTGWDCFCZQYYYQYSSCLXZSKLZZZGFFCQNWGLHQYZJJCZLQZZYJPJZZBPDCCMHJGXDQDGDLZQMFGPSYTSDYFWWDJZJYSXYYCZCYHZWPBYKXRYLYBHKJKSFXTZJMMCKHLLTNYYMSYXYZPYJQYCSYCWMTJJKQYRHLLQXPSGTLYYCLJSCPXJYZFNMLRGJJTYZBXYZMSJYJHHFZQMSYXRSZCWTLRTQZSSTKXGQKGSPTGCZNJSJCQCXHMXGGZTQYDJKZDLBZSXJLHYQGGGTHQSZPYHJHHGYYGKGGCWJZZYLCZLXQSFTGZSLLLMLJSKCTBLLZZSZMMNYTPZSXQHJCJYQXYZXZQZCPSHKZZYSXCDFGMWQRLLQXRFZTLYSTCTMJCXJJXHJNXTNRZTZFQYHQGLLGCXSZSJDJLJCYDSJTLNYXHSZXCGJZYQPYLFHDJSBPCCZHJJJQZJQDYBSSLLCMYTTMQTBHJQNNYGKYRQYQMZGCJKPDCGMYZHQLLSLLCLMHOLZGDYYFZSLJCQZLYLZQJESHNYLLJXGJXLYSYYYXNBZLJSSZCQQCJYLLZLTJYLLZLLBNYLGQCHXYYXOXCXQKYJXXXYKLXSXXYQXCYKQXQCSGYXXYQXYGYTQOHXHXPYXXXULCYEYCHZZCBWQBBWJQZSCSZSSLZYLKDESJZWMYMCYTSDSXXSCJPQQSQYLYYZYCMDJDZYWCBTJSYDJKCYDDJLBDJJSODZYSYXQQYXDHHGQQYQHDYXWGMMMAJDYBBBPPBCMUUPLJZSMTXERXJMHQNUTPJDCBSSMSSSTKJTSSMMTRCPLZSZMLQDSDMJMQPNQDXCFYNBFSDQXYXHYAYKQYDDLQYYYSSZBYDSLNTFQTZQPZMCHDHCZCWFDXTMYQSPHQYYXSRGJCWTJTZZQMGWJJTJHTQJBBHWZPXXHYQFXXQYWYYHYSCDYDHHQMNMTMWCPBSZPPZZGLMZFOLLCFWHMMSJZTTDHZZYFFYTZZGZYSKYJXQYJZQBHMBZZLYGHGFMSHPZFZSNCLPBQSNJXZSLXXFPMTYJYGBXLLDLXPZJYZJYHHZCYWHJYLSJEXFSZZYWXKZJLUYDTMLYMQJPWXYHXSKTQJEZRPXXZHHMHWQPWQLYJJQJJZSZCPHJLCHHNXJLQWZJHBMZYXBDHHYPZLHLHLGFWLCHYYTLHJXCJMSCPXSTKPNHQXSRTYXXTESYJCTLSSLSTDLLLWWYHDHRJZSFGXTSYCZYNYHTDHWJSLHTZDQDJZXXQHGYLTZPHCSQFCLNJTCLZPFSTPDYNYLGMJLLYCQHYSSHCHYLHQYQTMZYPBYWRFQYKQSYSLZDQJMPXYYSSRHZJNYWTQDFZBWWTWWRXCWHGYHXMKMYYYQMSMZHNGCEPMLQQMTCWCTMMPXJPJJHFXYYZSXZHTYBMSTSYJTTQQQYYLHYNPYQZLCYZHZWSMYLKFJXLWGXYPJYTYSYXYMZCKTTWLKSMZSYLMPWLZWXWQZSSAQSYXYRHSSNTSRAPXCPWCMGDXHXZDZYFJHGZTTSBJHGYZSZYSMYCLLLXBTYXHBBZJKSSDMALXHYCFYGMQYPJYCQXJLLLJGSLZGQLYCJCCZOTYXMTMTTLLWTGPXYMZMKLPSZZZXHKQYSXCTYJZYHXSHYXZKXLZWPSQPYHJWPJPWXQQYLXSDHMRSLZZYZWTTCYXYSZZSHBSCCSTPLWSSCJCHNLCGCHSSPHYLHFHHXJSXYLLNYLSZDHZXYLSXLWZYKCLDYAXZCMDDYSPJTQJZLNWQPSSSWCTSTSZLBLNXSMNYYMJQBQHRZWTYYDCHQLXKPZWBGQYBKFCMZWPZLLYYLSZYDWHXPSBCMLJBSCGBHXLQHYRLJXYSWXWXZSLDFHLSLYNJLZYFLYJYCDRJLFSYZFSLLCQYQFGJYHYXZLYLMSTDJCYHBZLLNWLXXYGYYHSMGDHXXHHLZZJZXCZZZCYQZFNGWPYLCPKPYYPMCLQKDGXZGGWQBDXZZKZFBXXLZXJTPJPTTBYTSZZDWSLCHZHSLTYXHQLHYXXXYYZYSWTXZKHLXZXZPYHGCHKCFSYHUTJRLXFJXPTZTWHPLYXFCRHXSHXKYXXYHZQDXQWULHYHMJTBFLKHTXCWHJFWJCFPQRYQXCYYYQYGRPYWSGSUNGWCHKZDXYFLXXHJJBYZWTSXXNCYJJYMSWZJQRMHXZWFQSYLZJZGBHYNSLBGTTCSYBYXXWXYHXYYXNSQYXMQYWRGYQLXBBZLJSYLPSYTJZYHYZAWLRORJMKSCZJXXXYXCHDYXRYXXJDTSQFXLYLTSFFYXLMTYJMJUYYYXLTZCSXQZQHZXLYYXZHDNBRXXXJCTYHLBRLMBRLLAXKYLLLJLYXXLYCRYLCJTGJCMTLZLLCYZZPZPCYAWHJJFYBDYYZSMPCKZDQYQPBPCJPDCYZMDPBCYYDYCNNPLMTMLRMFMMGWYZBSJGYGSMZQQQZTXMKQWGXLLPJGZBQCDJJJFPKJKCXBLJMSWMDTQJXLDLPPBXCWRCQFBFQJCZAHZGMYKPHYYHZYKNDKZMBPJYXPXYHLFPNYYGXJDBKXNXHJMZJXSTRSTLDXSKZYSYBZXJLXYSLBZYSLHXJPFXPQNBYLLJQKYGZMCYZZYMCCSLCLHZFWFWYXZMWSXTYNXJHPYYMCYSPMHYSMYDYSHQYZCHMJJMZCAAGCFJBBHPLYZYLXXSDJGXDHKXXTXXNBHRMLYJSLTXMRHNLXQJXYZLLYSWQGDLBJHDCGJYQYCMHWFMJYBMBYJYJWYMDPWHXQLDYGPDFXXBCGJSPCKRSSYZJMSLBZZJFLJJJLGXZGYXYXLSZQYXBEXYXHGCXBPLDYHWETTWWCJMBTXCHXYQXLLXFLYXLLJLSSFWDPZSMYJCLMWYTCZPCHQEKCQBWLCQYDPLQPPQZQFJQDJHYMMCXTXDRMJWRHXCJZYLQXDYYNHYYHRSLSRSYWWZJYMTLTLLGTQCJZYABTCKZCJYCCQLJZQXALMZYHYWLWDXZXQDLLQSHGPJFJLJHJABCQZDJGTKHSSTCYJLPSWZLXZXRWGLDLZRLZXTGSLLLLZLYXXWGDZYGBDPHZPBRLWSXQBPFDWOFMWHLYPCBJCCLDMBZPBZZLCYQXLDOMZBLZWPDWYYGDSTTHCSQSCCRSSSYSLFYBFNTYJSZDFNDPDHDZZMBBLSLCMYFFGTJJQWFTMTPJWFNLBZCMMJTGBDZLQLPYFHYYMJYLSDCHDZJWJCCTLJCLDTLJJCPDDSQDSSZYBNDBJLGGJZXSXNLYCYBJXQYCBYLZCFZPPGKCXZDZFZTJJFJSJXZBNZYJQTTYJYHTYCZHYMDJXTTMPXSPLZCDWSLSHXYPZGTFMLCJTYCBPMGDKWYCYZCDSZZYHFLYCTYGWHKJYYLSJCXGYWJCBLLCSNDDBTZBSCLYZCZZSSQDLLMQYYHFSLQLLXFTYHABXGWNYWYYPLLSDLDLLBJCYXJZMLHLJDXYYQYTDLLLBUGBFDFBBQJZZMDPJHGCLGMJJPGAEHHBWCQXAXHHHZCHXYPHJAXHLPHJPGPZJQCQZGJJZZUZDMQYYBZZPHYHYBWHAZYJHYKFGDPFQSDLZMLJXKXGALXZDAGLMDGXMWZQYXXDXXPFDMMSSYMPFMDMMKXKSYZYSHDZKXSYSMMZZZMSYDNZZCZXFPLSTMZDNMXCKJMZTYYMZMZZMSXHHDCZJEMXXKLJSTLWLSQLYJZLLZJSSDPPMHNLZJCZYHMXXHGZCJMDHXTKGRMXFWMCGMWKDTKSXQMMMFZZYDKMSCLCMPCGMHSPXQPZDSSLCXKYXTWLWJYAHZJGZQMCSNXYYMMPMLKJXMHLMLQMXCTKZMJQYSZJSYSZHSYJZJCDAJZYBSDQJZGWZQQXFKDMSDJLFWEHKZQKJPEYPZYSZCDWYJFFMZZYLTTDZZEFMZLBNPPLPLPEPSZALLTYLKCKQZKGENQLWAGYXYDPXLHSXQQWQCQXQCLHYXXMLYCCWLYMQYSKGCHLCJNSZKPYZKCQZQLJPDMDZHLASXLBYDWQLWDNBQCRYDDZTJYBKBWSZDXDTNPJDTCTQDFXQQMGNXECLTTBKPWSLCTYQLPWYZZKLPYGZCQQPLLKCCYLPQMZCZQCLJSLQZDJXLDDHPZQDLJJXZQDXYZQKZLJCYQDYJPPYPQYKJYRMPCBYMCXKLLZLLFQPYLLLMBSGLCYSSLRSYSQTMXYXZQZFDZUYSYZTFFMZZSMZQHZSSCCMLYXWTPZGXZJGZGSJSGKDDHTQGGZLLBJDZLCBCHYXYZHZFYWXYZYMSDBZZYJGTSMTFXQYXQSTDGSLNXDLRYZZLRYYLXQHTXSRTZNGZXBNQQZFMYKMZJBZYMKBPNLYZPBLMCNQYZZZSJZHJCTZKHYZZJRDYZHNPXGLFZTLKGJTCTSSYLLGZRZBBQZZKLPKLCZYSSUYXBJFPNJZZXCDWXZYJXZZDJJKGGRSRJKMSMZJLSJYWQSKYHQJSXPJZZZLSNSHRNYPZTWCHKLPSRZLZXYJQXQKYSJYCZTLQZYBBYBWZPQDWWYZCYTJCJXCKCWDKKZXSGKDZXWWYYJQYYTCYTDLLXWKCZKKLCCLZCQQDZLQLCSFQCHQHSFSMQZZLNBJJZBSJHTSZDYSJQJPDLZCDCWJKJZZLPYCGMZWDJJBSJQZSYZYHHXJPBJYDSSXDZNCGLQMBTSFSBPDZDLZNFGFJGFSMPXJQLMBLGQCYYXBQKDJJQYRFKZTJDHCZKLBSDZCFJTPLLJGXHYXZCSSZZXSTJYGKGCKGYOQXJPLZPBPGTGYJZGHZQZZLBJLSQFZGKQQJZGYCZBZQTLDXRJXBSXXPZXHYZYCLWDXJJHXMFDZPFZHQHQMQGKSLYHTYCGFRZGNQXCLPDLBZCSCZQLLJBLHBZCYPZZPPDYMZZSGYHCKCPZJGSLJLNSCDSLDLXBMSTLDDFJMKDJDHZLZXLSZQPQPGJLLYBDSZGQLBZLSLKYYHZTTNTJYQTZZPSZQZTLLJTYYLLQLLQYZQLBDZLSLYYZYMDFSZSNHLXZNCZQZPBWSKRFBSYZMTHBLGJPMCZZLSTLXSHTCSYZLZBLFEQHLXFLCJLYLJQCBZLZJHHSSTBRMHXZHJZCLXFNBGXGTQJCZTMSFZKJMSSNXLJKBHSJXNTNLZDNTLMSJXGZJYJCZXYJYJWRWWQNZTNFJSZPZSHZJFYRDJSFSZJZBJFZQZZHZLXFYSBZQLZSGYFTZDCSZXZJBQMSZKJRHYJZCKMJKHCHGTXKXQGLXPXFXTRTYLXJXHDTSJXHJZJXZWZLCQSBTXWXGXTXXHXFTSDKFJHZYJFJXRZSDLLLTQSQQZQWZXSYQTWGWBZCGZLLYZBCLMQQTZHZXZXLJFRMYZFLXYSQXXJKXRMQDZDMMYYBSQBHGZMWFWXGMXLZPYYTGZYCCDXYZXYWGSYJYZNBHPZJSQSYXSXRTFYZGRHZTXSZZTHCBFCLSYXZLZQMZLMPLMXZJXSFLBYZMYQHXJSXRXSQZZZSSLYFRCZJRCRXHHZXQYDYHXSJJHZCXZBTYNSYSXJBQLPXZQPYMLXZKYXLXCJLCYSXXZZLXDLLLJJYHZXGYJWKJRWYHCPSGNRZLFZWFZZNSXGXFLZSXZZZBFCSYJDBRJKRDHHGXJLJJTGXJXXSTJTJXLYXQFCSGSWMSBCTLQZZWLZZKXJMLTMJYHSDDBXGZHDLBMYJFRZFSGCLYJBPMLYSMSXLSZJQQHJZFXGFQFQBPXZGYYQXGZTCQWYLTLGWSGWHRLFSFGZJMGMGBGTJFSYZZGZYZAFLSSPMLPFLCWBJZCLJJMZLPJJLYMQDMYYYFBGYGYZMLYZDXQYXRQQQHSYYYQXYLJTYXFSFSLLGNQCYHYCWFHCCCFXPYLYPLLZYXXXXXKQHHXSHJZCFZSCZJXCPZWHHHHHAPYLQALPQAFYHXDYLUKMZQGGGDDESRNNZLTZGCHYPPYSQJJHCLLJTOLNJPZLJLHYMHEYDYDSQYCDDHGZUNDZCLZYZLLZNTNYZGSLHSLPJJBDGWXPCDUTJCKLKCLWKLLCASSTKZZDNQNTTLYYZSSYSSZZRYLJQKCQDHHCRXRZYDGRGCWCGZQFFFPPJFZYNAKRGYWYQPQXXFKJTSZZXSWZDDFBBXTBGTZKZNPZZPZXZPJSZBMQHKCYXYLDKLJNYPKYGHGDZJXXEAHPNZKZTZCMXCXMMJXNKSZQNMNLWBWWXJKYHCPSTMCSQTZJYXTPCTPDTNNPGLLLZSJLSPBLPLQHDTNJNLYYRSZFFJFQWDPHZDWMRZCCLODAXNSSNYZRESTYJWJYJDBCFXNMWTTBYLWSTSZGYBLJPXGLBOCLHPCBJLTMXZLJYLZXCLTPNCLCKXTPZJSWCYXSFYSZDKNTLBYJCYJLLSTGQCBXRYZXBXKLYLHZLQZLNZCXWJZLJZJNCJHXMNZZGJZZXTZJXYCYYCXXJYYXJJXSSSJSTSSTTPPGQTCSXWZDCSYFPTFBFHFBBLZJCLZZDBXGCXLQPXKFZFLSYLTUWBMQJHSZBMDDBCYSCCLDXYCDDQLYJJWMQLLCSGLJJSYFPYYCCYLTJANTJJPWYCMMGQYYSXDXQMZHSZXPFTWWZQSWQRFKJLZJQQYFBRXJHHFWJJZYQAZMYFRHCYYBYQWLPEXCCZSTYRLTTDMQLYKMBBGMYYJPRKZNPBSXYXBHYZDJDNGHPMFSGMWFZMFQMMBCMZZCJJLCNUXYQLMLRYGQZCYXZLWJGCJCGGMCJNFYZZJHYCPRRCMTZQZXHFQGTJXCCJEAQCRJYHPLQLSZDJRBCQHQDYRHYLYXJSYMHZYDWLDFRYHBPYDTSSCNWBXGLPZMLZZTQSSCPJMXXYCSJYTYCGHYCJWYRXXLFEMWJNMKLLSWTXHYYYNCMMCWJDQDJZGLLJWJRKHPZGGFLCCSCZMCBLTBHBQJXQDSPDJZZGKGLFQYWBZYZJLTSTDHQHCTCBCHFLQMPWDSHYYTQWCNZZJTLBYMBPDYYYXSQKXWYYFLXXNCWCXYPMAELYKKJMZZZBRXYYQJFLJPFHHHYTZZXSGQQMHSPGDZQWBWPJHZJDYSCQWZKTXXSQLZYYMYSDZGRXCKKUJLWPYSYSCSYZLRMLQSYLJXBCXTLWDQZPCYCYKPPPNSXFYZJJRCEMHSZMSXLXGLRWGCSTLRSXBZGBZGZTCPLUJLSLYLYMTXMTZPALZXPXJTJWTCYYZLBLXBZLQMYLXPGHDSLSSDMXMBDZZSXWHAMLCZCPJMCNHJYSNSYGCHSKQMZZQDLLKABLWJXSFMOCDXJRRLYQZKJMYBYQLYHETFJZFRFKSRYXFJTWDSXXSYSQJYSLYXWJHSNLXYYXHBHAWHHJZXWMYLJCSSLKYDZTXBZSYFDXGXZJKHSXXYBSSXDPYNZWRPTQZCZENYGCXQFJYKJBZMLJCMQQXUOXSLYXXLYLLJDZBTYMHPFSTTQQWLHOKYBLZZALZXQLHZWRRQHLSTMYPYXJJXMQSJFNBXYXYJXXYQYLTHYLQYFMLKLJTMLLHSZWKZHLJMLHLJKLJSTLQXYLMBHHLNLZXQJHXCFXXLHYHJJGBYZZKBXSCQDJQDSUJZYYHZHHMGSXCSYMXFEBCQWWRBPYYJQTYZCYQYQQZYHMWFFHGZFRJFCDPXNTQYZPDYKHJLFRZXPPXZDBBGZQSTLGDGYLCQMLCHHMFYWLZYXKJLYPQHSYWMQQGQZMLZJNSQXJQSYJYCBEHSXFSZPXZWFLLBCYYJDYTDTHWZSFJMQQYJLMQXXLLDTTKHHYBFPWTYYSQQWNQWLGWDEBZWCMYGCULKJXTMXMYJSXHYBRWFYMWFRXYQMXYSZTZZTFYKMLDHQDXWYYNLCRYJBLPSXCXYWLSPRRJWXHQYPHTYDNXHHMMYWYTZCSQMTSSCCDALWZTCPQPYJLLQZYJSWXMZZMMYLMXCLMXCZMXMZSQTZPPQQBLPGXQZHFLJJHYTJSRXWZXSCCDLXTYJDCQJXSLQYCLZXLZZXMXQRJMHRHZJBHMFLJLMLCLQNLDXZLLLPYPSYJYSXCQQDCMQJZZXHNPNXZMEKMXHYKYQLXSXTXJYYHWDCWDZHQYYBGYBCYSCFGPSJNZDYZZJZXRZRQJJYMCANYRJTLDPPYZBSTJKXXZYPFDWFGZZRPYMTNGXZQBYXNBUFNQKRJQZMJEGRZGYCLKXZDSKKNSXKCLJSPJYYZLQQJYBZSSQLLLKJXTBKTYLCCDDBLSPPFYLGYDTZJYQGGKQTTFZXBDKTYYHYBBFYTYYBCLPDYTGDHRYRNJSPTCSNYJQHKLLLZSLYDXXWBCJQSPXBPJZJCJDZFFXXBRMLAZHCSNDLBJDSZBLPRZTSWSBXBCLLXXLZDJZSJPYLYXXYFTFFFBHJJXGBYXJPMMMPSSJZJMTLYZJXSWXTYLEDQPJMYGQZJGDJLQJWJQLLSJGJGYGMSCLJJXDTYGJQJQJCJZCJGDZZSXQGSJGGCXHQXSNQLZZBXHSGZXCXYLJXYXYYDFQQJHJFXDHCTXJYRXYSQTJXYEFYYSSYYJXNCYZXFXMSYSZXYYSCHSHXZZZGZZZGFJDLTYLNPZGYJYZYYQZPBXQBDZTZCZYXXYHHSQXSHDHGQHJHGYWSZTMZMLHYXGEBTYLZKQWYTJZRCLEKYSTDBCYKQQSAYXCJXWWGSBHJYZYDHCSJKQCXSWXFLTYNYZPZCCZJQTZWJQDZZZQZLJJXLSBHPYXXPSXSHHEZTXFPTLQYZZXHYTXNCFZYYHXGNXMYWXTZSJPTHHGYMXMXQZXTSBCZYJYXXTYYZYPCQLMMSZMJZZLLZXGXZAAJZYXJMZXWDXZSXZDZXLEYJJZQBHZWZZZQTZPSXZTDSXJJJZNYAZPHXYYSRNQDTHZHYYKYJHDZXZLSWCLYBZYECWCYCRYLCXNHZYDZYDYJDFRJJHTRSQTXYXJRJHOJYNXELXSFSFJZGHPZSXZSZDZCQZBYYKLSGSJHCZSHDGQGXYZGXCHXZJWYQWGYHKSSEQZZNDZFKWYSSTCLZSTSYMCDHJXXYWEYXCZAYDMPXMDSXYBSQMJMZJMTZQLPJYQZCGQHXJHHLXXHLHDLDJQCLDWBSXFZZYYSCHTYTYYBHECXHYKGJPXHHYZJFXHWHBDZFYZBCAPNPGNYDMSXHMMMMAMYNBYJTMPXYYMCTHJBZYFCGTYHWPHFTWZZEZSBZEGPFMTSKFTYCMHFLLHGPZJXZJGZJYXZSBBQSCZZLZCCSTPGXMJSFTCCZJZDJXCYBZLFCJSYZFGSZLYBCWZZBYZDZYPSWYJZXZBDSYUXLZZBZFYGCZXBZHZFTPBGZGEJBSTGKDMFHYZZJHZLLZZGJQZLSFDJSSCBZGPDLFZFZSZYZYZSYGCXSNXXCHCZXTZZLJFZGQSQYXZJQDCCZTQCDXZJYQJQCHXZTDLGSCXZSYQJQTZWLQDQZTQCHQQJZYEZZZPBWKDJFCJPZTYPQYQTTYNLMBDKTJZPQZQZZFPZSBNJLGYJDXJDZZKZGQKXDLPZJTCJDQBXDJQJSTCKNXBXZMSLYJCQMTJQWWCJQNJNLLLHJCWQTBZQYDZCZPZZDZYDDCYZZZCCJTTJFZDPRRTZTJDCQTQZDTJNPLZBCLLCTZSXKJZQZPZLBZRBTJDCXFCZDBCCJJLTQQPLDCGZDBBZJCQDCJWYNLLZYZCCDWLLXWZLXRXNTQQCZXKQLSGDFQTDDGLRLAJJTKUYMKQLLTZYTDYYCZGJWYXDXFRSKSTQTENQMRKQZHHQKDLDAZFKYPBGGPZREBZZYKZZSPEGJXGYKQZZZSLYSYYYZWFQZYLZZLZHWCHKYPQGNPGBLPLRRJYXCCSYYHSFZFYBZYYTGZXYLXCZWXXZJZBLFFLGSKHYJZEYJHLPLLLLCZGXDRZELRHGKLZZYHZLYQSZZJZQLJZFLNBHGWLCZCFJYSPYXZLZLXGCCPZBLLCYBBBBUBBCBPCRNNZCZYRBFSRLDCGQYYQXYGMQZWTZYTYJXYFWTEHZZJYWLCCNTZYJJZDEDPZDZTSYQJHDYMBJNYJZLXTSSTPHNDJXXBYXQTZQDDTJTDYYTGWSCSZQFLSHLGLBCZPHDLYZJYCKWTYTYLBNYTSDSYCCTYSZYYEBHEXHQDTWNYGYCLXTSZYSTQMYGZAZCCSZZDSLZCLZRQXYYELJSBYMXSXZTEMBBLLYYLLYTDQYSHYMRQWKFKBFXNXSBYCHXBWJYHTQBPBSBWDZYLKGZSKYHXQZJXHXJXGNLJKZLYYCDXLFYFGHLJGJYBXQLYBXQPQGZTZPLNCYPXDJYQYDYMRBESJYYHKXXSTMXRCZZYWXYQYBMCLLYZHQYZWQXDBXBZWZMSLPDMYSKFMZKLZCYQYCZLQXFZZYDQZPZYGYJYZMZXDZFYFYTTQTZHGSPCZMLCCYTZXJCYTJMKSLPZHYSNZLLYTPZCTZZCKTXDHXXTQCYFKSMQCCYYAZHTJPCYLZLYJBJXTPNYLJYYNRXSYLMMNXJSMYBCSYSYLZYLXJJQYLDZLPQBFZZBLFNDXQKCZFYWHGQMRDSXYCYTXNQQJZYYPFZXDYZFPRXEJDGYQBXRCNFYYQPGHYJDYZXGRHTKYLNWDZNTSMPKLBTHBPYSZBZTJZSZZJTYYXZPHSSZZBZCZPTQFZMYFLYPYBBJQXZMXXDJMTSYSKKBJZXHJCKLPSMKYJZCXTMLJYXRZZQSLXXQPYZXMKYXXXJCLJPRMYYGADYSKQLSNDHYZKQXZYZTCGHZTLMLWZYBWSYCTBHJHJFCWZTXWYTKZLXQSHLYJZJXTMPLPYCGLTBZZTLZJCYJGDTCLKLPLLQPJMZPAPXYZLKKTKDZCZZBNZDYDYQZJYJGMCTXLTGXSZLMLHBGLKFWNWZHDXUHLFMKYSLGXDTWWFRJEJZTZHYDXYKSHWFZCQSHKTMQQHTZHYMJDJSKHXZJZBZZXYMPAGQMSTPXLSKLZYNWRTSQLSZBPSPSGZWYHTLKSSSWHZZLYYTNXJGMJSZSUFWNLSOZTXGXLSAMMLBWLDSZYLAKQCQCTMYCFJBSLXCLZZCLXXKSBZQCLHJPSQPLSXXCKSLNHPSFQQYTXYJZLQLDXZQJZDYYDJNZPTUZDSKJFSLJHYLZSQZLBTXYDGTQFDBYAZXDZHZJNHHQBYKNXJJQCZMLLJZKSPLDYCLBBLXKLELXJLBQYCXJXGCNLCQPLZLZYJTZLJGYZDZPLTQCSXFDMNYCXGBTJDCZNBGBQYQJWGKFHTNPYQZQGBKPBBYZMTJDYTBLSQMPSXTBNPDXKLEMYYCJYNZCTLDYKZZXDDXHQSHDGMZSJYCCTAYRZLPYLTLKXSLZCGGEXCLFXLKJRTLQJAQZNCMBYDKKCXGLCZJZXJHPTDJJMZQYKQSECQZDSHHADMLZFMMZBGNTJNNLGBYJBRBTMLBYJDZXLCJLPLDLPCQDHLXZLYCBLCXZZJADJLNZMMSSSMYBHBSQKBHRSXXJMXSDZNZPXLGBRHWGGFCXGMSKLLTSJYYCQLTSKYWYYHYWXBXQYWPYWYKQLSQPTNTKHQCWDQKTWPXXHCPTHTWUMSSYHBWCRWXHJMKMZNGWTMLKFGHKJYLSYYCXWHYECLQHKQHTTQKHFZLDXQWYZYYDESBPKYRZPJFYYZJCEQDZZDLATZBBFJLLCXDLMJSSXEGYGSJQXCWBXSSZPDYZCXDNYXPPZYDLYJCZPLTXLSXYZYRXCYYYDYLWWNZSAHJSYQYHGYWWAXTJZDAXYSRLTDPSSYYFNEJDXYZHLXLLLZQZSJNYQYQQXYJGHZGZCYJCHZLYCDSHWSHJZYJXCLLNXZJJYYXNFXMWFPYLCYLLABWDDHWDXJMCXZTZPMLQZHSFHZYNZTLLDYWLSLXHYMMYLMBWWKYXYADTXYLLDJPYBPWUXJMWMLLSAFDLLYFLBHHHBQQLTZJCQJLDJTFFKMMMBYTHYGDCQRDDWRQJXNBYSNWZDBYYTBJHPYBYTTJXAAHGQDQTMYSTQXKBTZPKJLZRBEQQSSMJJBDJOTGTBXPGBKTLHQXJJJCTHXQDWJLWRFWQGWSHCKRYSWGFTGYGBXSDWDWRFHWYTJJXXXJYZYSLPYYYPAYXHYDQKXSHXYXGSKQHYWFDDDPPLCJLQQEEWXKSYYKDYPLTJTHKJLTCYYHHJTTPLTZZCDLTHQKZXQYSTEEYWYYZYXXYYSTTJKLLPZMCYHQGXYHSRMBXPLLNQYDQHXSXXWGDQBSHYLLPJJJTHYJKYPPTHYYKTYEZYENMDSHLCRPQFDGFXZPSFTLJXXJBSWYYSKSFLXLPPLBBBLBSFXFYZBSJSSYLPBBFFFFSSCJDSTZSXZRYYSYFFSYZYZBJTBCTSBSDHRTJJBYTCXYJEYLXCBNEBJDSYXYKGSJZBXBYTFZWGENYHHTHZHHXFWGCSTBGXKLSXYWMTMBYXJSTZSCDYQRCYTWXZFHMYMCXLZNSDJTTTXRYCFYJSBSDYERXJLJXBBDEYNJGHXGCKGSCYMBLXJMSZNSKGXFBNBPTHFJAAFXYXFPXMYPQDTZCXZZPXRSYWZDLYBBKTYQPQJPZYPZJZNJPZJLZZFYSBTTSLMPTZRTDXQSJEHBZYLZDHLJSQMLHTXTJECXSLZZSPKTLZKQQYFSYGYWPCPQFHQHYTQXZKRSGTTSQCZLPTXCDYYZXSQZSLXLZMYCPCQBZYXHBSXLZDLTCDXTYLZJYYZPZYZLTXJSJXHLPMYTXCQRBLZSSFJZZTNJYTXMYJHLHPPLCYXQJQQKZZSCPZKSWALQSBLCCZJSXGWWWYGYKTJBBZTDKHXHKGTGPBKQYSLPXPJCKBMLLXDZSTBKLGGQKQLSBKKTFXRMDKBFTPZFRTBBRFERQGXYJPZSSTLBZTPSZQZSJDHLJQLZBPMSMMSXLQQNHKNBLRDDNXXDHDDJCYYGYLXGZLXSYGMQQGKHBPMXYXLYTQWLWGCPBMQXCYZYDRJBHTDJYHQSHTMJSBYPLWHLZFFNYPMHXXHPLTBQPFBJWQDBYGPNZTPFZJGSDDTQSHZEAWZZYLLTYYBWJKXXGHLFKXDJTMSZSQYNZGGSWQSPHTLSSKMCLZXYSZQZXNCJDQGZDLFNYKLJCJLLZLMZZNHYDSSHTHZZLZZBBHQZWWYCRZHLYQQJBEYFXXXWHSRXWQHWPSLMSSKZTTYGYQQWRSLALHMJTQJSMXQBJJZJXZYZKXBYQXBJXSHZTSFJLXMXZXFGHKZSZGGYLCLSARJYHSLLLMZXELGLXYDJYTLFBHBPNLYZFBBHPTGJKWETZHKJJXZXXGLLJLSTGSHJJYQLQZFKCGNNDJSSZFDBCTWWSEQFHQJBSAQTGYPQLBXBMMYWXGSLZHGLZGQYFLZBYFZJFRYSFMBYZHQGFWZSYFYJJPHZBYYZFFWODGRLMFTWLBZGYCQXCDJYGZYYYYTYTYDWEGAZYHXJLZYYHLRMGRXXZCLHNELJJTJTPWJYBJJBXJJTJTEEKHWSLJPLPSFYZPQQBDLQJJTYYQLYZKDKSQJYYQZLDQTGJQYZJSUCMRYQTHTEJMFCTYHYPKMHYZWJDQFHYYXWSHCTXRLJHQXHCCYYYJLTKTTYTMXGTCJTZAYYOCZLYLBSZYWJYTSJYHBYSHFJLYGJXXTMZYYLTXXYPZLXYJZYZYYPNHMYMDYYLBLHLSYYQQLLNJJYMSOYQBZGDLYXYLCQYXTSZEGXHZGLHWBLJHEYXTWQMAKBPQCGYSHHEGQCMWYYWLJYJHYYZLLJJYLHZYHMGSLJLJXCJJYCLYCJPCPZJZJMMYLCQLNQLJQJSXYJMLSZLJQLYCMMHCFMMFPQQMFYLQMCFFQMMMMHMZNFHHJGTTHHKHSLNCHHYQDXTMMQDCYZYXYQMYQYLTDCYYYZAZZCYMZYDLZFFFMMYCQZWZZMABTBYZTDMNZZGGDFTYPCGQYTTSSFFWFDTZQSSYSTWXJHXYTSXXYLBYQHWWKXHZXWZNNZZJZJJQJCCCHYYXBZXZCYZTLLCQXYNJYCYYCYNZZQYYYEWYCZDCJYCCHYJLBTZYYCQWMPWPYMLGKDLDLGKQQBGYCHJXY";
//此处收录了375个多音字,
var oMultiDiff = { "19969": "DZ", "19975": "WM", "19988": "QJ", "20048": "YL", "20056": "SC", "20060": "NM", "20094": "QG", "20127": "QJ", "20167": "QC", "20193": "YG", "20250": "KH", "20256": "ZC", "20282": "SC", "20285": "QJG", "20291": "TD", "20314": "YD", "20340": "NE", "20375": "TD", "20389": "YJ", "20391": "CZ", "20415": "PB", "20446": "YS", "20447": "SQ", "20504": "TC", "20608": "KG", "20854": "QJ", "20857": "ZC", "20911": "PF", "20504": "TC", "20608": "KG", "20854": "QJ", "20857": "ZC", "20911": "PF", "20985": "AW", "21032": "PB", "21048": "XQ", "21049": "SC", "21089": "YS", "21119": "JC", "21242": "SB", "21273": "SC", "21305": "YP", "21306": "QO", "21330": "ZC", "21333": "SDC", "21345": "QK", "21378": "CA", "21397": "SC", "21414": "XS", "21442": "SC", "21477": "JG", "21480": "TD", "21484": "ZS", "21494": "YX", "21505": "YX", "21512": "HG", "21523": "XH", "21537": "PB", "21542": "PF", "21549": "KH", "21571": "E", "21574": "DA", "21588": "TD", "21589": "O", "21618": "ZC", "21621": "KHA", "21632": "ZJ", "21654": "KG", "21679": "LKG", "21683": "KH", "21710": "A", "21719": "YH", "21734": "WOE", "21769": "A", "21780": "WN", "21804": "XH", "21834": "A", "21899": "ZD", "21903": "RN", "21908": "WO", "21939": "ZC", "21956": "SA", "21964": "YA", "21970": "TD", "22003": "A", "22031": "JG", "22040": "XS", "22060": "ZC", "22066": "ZC", "22079": "MH", "22129": "XJ", "22179": "XA", "22237": "NJ", "22244": "TD", "22280": "JQ", "22300": "YH", "22313": "XW", "22331": "YQ", "22343": "YJ", "22351": "PH", "22395": "DC", "22412": "TD", "22484": "PB", "22500": "PB", "22534": "ZD", "22549": "DH", "22561": "PB", "22612": "TD", "22771": "KQ", "22831": "HB", "22841": "JG", "22855": "QJ", "22865": "XQ", "23013": "ML", "23081": "WM", "23487": "SX", "23558": "QJ", "23561": "YW", "23586": "YW", "23614": "YW", "23615": "SN", "23631": "PB", "23646": "ZS", "23663": "ZT", "23673": "YG", "23762": "TD", "23769": "ZS", "23780": "QJ", "23884": "QK", "24055": "XH", "24113": "DC", "24162": "ZC", "24191": "GA", "24273": "QJ", "24324": "NL", "24377": "TD", "24378": "QJ", "24439": "PF", "24554": "ZS", "24683": "TD", "24694": "WE", "24733": "LK", "24925": "TN", "25094": "ZG", "25100": "XQ", "25103": "XH", "25153": "PB", "25170": "PB", "25179": "KG", "25203": "PB", "25240": "ZS", "25282": "FB", "25303": "NA", "25324": "KG", "25341": "ZY", "25373": "WZ", "25375": "XJ", "25384": "A", "25457": "A", "25528": "SD", "25530": "SC", "25552": "TD", "25774": "ZC", "25874": "ZC", "26044": "YW", "26080": "WM", "26292": "PB", "26333": "PB", "26355": "ZY", "26366": "CZ", "26397": "ZC", "26399": "QJ", "26415": "ZS", "26451": "SB", "26526": "ZC", "26552": "JG", "26561": "TD", "26588": "JG", "26597": "CZ", "26629": "ZS", "26638": "YL", "26646": "XQ", "26653": "KG", "26657": "XJ", "26727": "HG", "26894": "ZC", "26937": "ZS", "26946": "ZC", "26999": "KJ", "27099": "KJ", "27449": "YQ", "27481": "XS", "27542": "ZS", "27663": "ZS", "27748": "TS", "27784": "SC", "27788": "ZD", "27795": "TD", "27812": "O", "27850": "PB", "27852": "MB", "27895": "SL", "27898": "PL", "27973": "QJ", "27981": "KH", "27986": "HX", "27994": "XJ", "28044": "YC", "28065": "WG", "28177": "SM", "28267": "QJ", "28291": "KH", "28337": "ZQ", "28463": "TL", "28548": "DC", "28601": "TD", "28689": "PB", "28805": "JG", "28820": "QG", "28846": "PB", "28952": "TD", "28975": "ZC", "29100": "A", "29325": "QJ", "29575": "SL", "29602": "FB", "30010": "TD", "30044": "CX", "30058": "PF", "30091": "YSP", "30111": "YN", "30229": "XJ", "30427": "SC", "30465": "SX", "30631": "YQ", "30655": "QJ", "30684": "QJG", "30707": "SD", "30729": "XH", "30796": "LG", "30917": "PB", "31074": "NM", "31085": "JZ", "31109": "SC", "31181": "ZC", "31192": "MLB", "31293": "JQ", "31400": "YX", "31584": "YJ", "31896": "ZN", "31909": "ZY", "31995": "XJ", "32321": "PF", "32327": "ZY", "32418": "HG", "32420": "XQ", "32421": "HG", "32438": "LG", "32473": "GJ", "32488": "TD", "32521": "QJ", "32527": "PB", "32562": "ZSQ", "32564": "JZ", "32735": "ZD", "32793": "PB", "33071": "PF", "33098": "XL", "33100": "YA", "33152": "PB", "33261": "CX", "33324": "BP", "33333": "TD", "33406": "YA", "33426": "WM", "33432": "PB", "33445": "JG", "33486": "ZN", "33493": "TS", "33507": "QJ", "33540": "QJ", "33544": "ZC", "33564": "XQ", "33617": "YT", "33632": "QJ", "33636": "XH", "33637": "YX", "33694": "WG", "33705": "PF", "33728": "YW", "33882": "SR", "34067": "WM", "34074": "YW", "34121": "QJ", "34255": "ZC", "34259": "XL", "34425": "JH", "34430": "XH", "34485": "KH", "34503": "YS", "34532": "HG", "34552": "XS", "34558": "YE", "34593": "ZL", "34660": "YQ", "34892": "XH", "34928": "SC", "34999": "QJ", "35048": "PB", "35059": "SC", "35098": "ZC", "35203": "TQ", "35265": "JX", "35299": "JX", "35782": "SZ", "35828": "YS", "35830": "E", "35843": "TD", "35895": "YG", "35977": "MH", "36158": "JG", "36228": "QJ", "36426": "XQ", "36466": "DC", "36710": "JC", "36711": "ZYG", "36767": "PB", "36866": "SK", "36951": "YW", "37034": "YX", "37063": "XH", "37218": "ZC", "37325": "ZC", "38063": "PB", "38079": "TD", "38085": "QY", "38107": "DC", "38116": "TD", "38123": "YD", "38224": "HG", "38241": "XTC", "38271": "ZC", "38415": "YE", "38426": "KH", "38461": "YD", "38463": "AE", "38466": "PB", "38477": "XJ", "38518": "YT", "38551": "WK", "38585": "ZC", "38704": "XS", "38739": "LJ", "38761": "GJ", "38808": "SQ", "39048": "JG", "39049": "XJ", "39052": "HG", "39076": "CZ", "39271": "XT", "39534": "TD", "39552": "TD", "39584": "PB", "39647": "SB", "39730": "LG", "39748": "TPB", "40109": "ZQ", "40479": "ND", "40516": "HG", "40536": "HG", "40583": "QJ", "40765": "YQ", "40784": "QJ", "40840": "YK", "40863": "QJG" };
//参数,中文字符串  
//返回值:拼音首字母串数组  
function makePy(str) {
    if (typeof (str) != "string")
        throw new Error(-1, "函数makePy需要字符串类型参数!");
    var arrResult = new Array(); //保存中间结果的数组  
    for (var i = 0, len = str.length; i < len; i++) {
        //获得unicode码  
        var ch = str.charAt(i);
        //检查该unicode码是否在处理范围之内,在则返回该码对映汉字的拼音首字母,不在则调用其它函数处理  
        arrResult.push(checkCh(ch));
    }
    
    //处理arrResult,返回所有可能的拼音首字母串数组  
    return mkRslt(arrResult);
}
function checkCh(ch) {
    var uni = ch.charCodeAt(0);
    //如果不在汉字处理范围之内,返回原字符,也可以调用自己的处理函数  
    if (uni > 40869 || uni < 19968)
        return ch; //dealWithOthers(ch);  
    //检查是否是多音字,是按多音字处理,不是就直接在strChineseFirstPY字符串中找对应的首字母  
    return (oMultiDiff[uni] ? oMultiDiff[uni] : (strChineseFirstPY.charAt(uni - 19968)));
}
function mkRslt(arr) {
    var arrRslt = [""];
    for (var i = 0, len = arr.length; i < len; i++) {
        var str = arr[i];
        var strlen = str.length;
        if (strlen == 1) {
            for (var k = 0; k < arrRslt.length; k++) {
                arrRslt[k] += str;
            }
        } else {
            var tmpArr = arrRslt.slice(0);
            arrRslt = [];
            for (k = 0; k < strlen; k++) {
                //复制一个相同的arrRslt  
                var tmp = tmpArr.slice(0);
                //把当前字符str[k]添加到每个元素末尾  
                for (var j = 0; j < tmp.length; j++) {
                    tmp[j] += str.charAt(k);
                }
                //把复制并修改后的数组连接到arrRslt上  
                arrRslt = arrRslt.concat(tmp);
            }
        }
    }
    return arrRslt;
}

// ========================================================

/**
 * 根据拼音分类排序
 */
function getPyData(oldData,key,type){
    var newData = {};
    oldData.sort(function(a,b){
        // return (a[key]).localeCompare(b[key])
        return makePy(a[key].charAt(0))[0].toUpperCase() < makePy(b[key].charAt(0))[0].toUpperCase() ? -1 : 1;
    });
    //console.log(oldData);
    if(type=='yes'){
    	return oldData;
    }else{
    	$.each(oldData,function(index,item){
	        var initial = makePy(item[key].charAt(0))[0].toUpperCase();
	        if(initial>='A'&&initial<='Z'){
	            if (!newData[initial]) {
	                newData[initial] = [];
	            } 
	            newData[initial].push(item);
	        }
	    });
	    return newData;
    }
}

//var oldData=[
//	{
//		"xingming":"章",
//		"性别":"女",
//	},
//	{
//		"xingming":"蒋",
//		"性别":"女",
//	},
//	{
//		"xingming":"江",
//		"性别":"女",
//	},
//	{
//		"xingming":"刘",
//		"性别":"男",
//	},
//	{
//		"xingming":"杨",
//		"性别":"男",
//	},
//];
//var ndata=getPyData(oldData,'xingming');
//console.log(JSON.stringify(ndata));

//ghy
function GetDateStr(AddDayCount) { 
var dd = new Date(); 
dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期 
var y = dd.getFullYear(); 
var m = dd.getMonth()+1;//获取当前月份的日期 
var d = dd.getDate(); 
return y+"-"+m+"-"+d; 
} 