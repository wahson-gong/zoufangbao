//author wallace 华dee
//2015 7 3 
//qq447363121陈国华
var refresher = {
	info:{
	"pullDownLable":"下拉刷新...",
	"pullingDownLable":"释放刷新...",
	"pullUpLable":"上拉加载更多...",
	"pullingUpLable":"释放加载更多...",
	"loadingLable":"Loading..."},
	init:function(parameter){		
	var wrapper=document.getElementById(parameter.id);
	
	var div=document.createElement("div");
		div.id="scroller_"+parameter.id;
		div.className='scroller';
		wrapper.appendChild(div);
		
	var scroller=document.getElementById("scroller_"+parameter.id);
	var list=document.querySelector("#"+parameter.id+" ul")
		scroller.insertBefore(list,scroller.childNodes[0]);
		
	var pullDown=document.createElement("div");
		pullDown.id="pullDown_"+parameter.id;
		pullDown.className='pullDown';
	var loader=document.createElement("div");
		loader.className="loader_"+parameter.id+' loader';
	for(var i=0;i<4;i++){
		var span=document.createElement("span");
		loader.appendChild(span);	
		}	
		pullDown.appendChild(loader);
			
	var pullDownLabel=document.createElement("div");
		pullDownLabel.className="pullDownLabel_"+parameter.id+' pullDownLabel';
		pullDown.appendChild(pullDownLabel);	
			
		scroller.insertBefore(pullDown,scroller.childNodes[0]);	
			
		var pullUp=document.createElement("div");
		pullUp.id="pullUp_"+parameter.id;
		pullUp.className='pullUp';
		var loader=document.createElement("div");
		loader.className="loader_"+parameter.id+' loader';
	for(var i=0;i<4;i++){
		var span=document.createElement("span");
		loader.appendChild(span);	
		}	
		pullUp.appendChild(loader);
		
		var pullUpLabel=document.createElement("div");
		pullUpLabel.className="pullUpLabel_"+parameter.id+' pullUpLabel';
		var pagenum=document.getElementById(parameter.id).getAttribute('data-pagenum');
		if(pagenum=='10'){
			var content=document.createTextNode(refresher.info.pullUpLable);
		}else if(pagenum=='20'){
			var content=document.createTextNode(refresher.info.pullUpLable);
		}else if(pagenum=='0'){
			var content=document.createTextNode('暂无信息');
		}else{
			var content=document.createTextNode('');//已经到底了哦：）
		}
		pullUpLabel.appendChild(content);
		pullUp.appendChild(pullUpLabel);
			
		scroller.appendChild(pullUp);
		//create dom above
		//create dom ,you can wirte it yourself			
	var pullDownEl = document.getElementById('pullDown_'+parameter.id);
	pullDownEl.className='pullDown';
	var pullDownOffset = pullDownEl.offsetHeight;
	var pullUpEl = document.getElementById('pullUp_'+parameter.id);	
	pullUpEl.className='pullUp';
	var pullUpOffset =pullUpEl.offsetHeight;
		//parameter
	this.scrollIt(parameter,pullDownEl,pullDownOffset,pullUpEl,pullUpOffset);
	},
	
	scrollIt:function(parameter,pullDownEl,pullDownOffset,pullUpEl, pullUpOffset){	
		eval(parameter.id + "= new iScroll(parameter.id, {useTransition: true,vScrollbar: false,topOffset: pullDownOffset,onRefresh: function () {refresher.onRelease(pullDownEl,pullUpEl,parameter);},onScrollMove: function () {refresher.onScrolling(this,pullDownEl,pullUpEl,pullUpOffset,parameter);},onScrollEnd: function () {refresher.onPulling(pullDownEl,parameter.pullDownAction,pullUpEl,parameter.pullUpAction,parameter);},})");
//	myScroll = new iScroll(parameter.id, {
//		useTransition: true,
//		vScrollbar: false, //hide the iscroll v bar
//		topOffset: pullDownOffset,
//		onRefresh: function () {
//			refresher.onRelease(pullDownEl,pullUpEl,parameter);
//		},
//		onScrollMove: function () {
//			refresher.onScrolling(this,pullDownEl,pullUpEl,pullUpOffset,parameter);//element
//		},
//		onScrollEnd: function () {
//			refresher.onPulling(pullDownEl,parameter.pullDownAction,pullUpEl,parameter.pullUpAction,parameter);
//		},
//	});
	 setTimeout(function(){pullDownEl.querySelector('.pullDownLabel_'+parameter.id).innerHTML = refresher.info.pullDownLable},300);
	 document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
	},
	
	//things loader css on scrolling,you can wirte it yourself			
	onScrolling:function(e,pullDownEl,pullUpEl,pullUpOffset,parameter){
		if(parameter.scrollAction)
		parameter.scrollAction();
		
		if (e.y>-(pullUpOffset)) {
		pullDownEl.className = 'pullDown';
		pullDownEl.querySelector('.pullDownLabel_'+parameter.id).innerHTML = refresher.info.pullDownLable;
		e.minScrollY =-pullUpOffset;
			}	
		if (e.y > 0) {
				pullDownEl.className = 'pullDown flip';
				pullDownEl.querySelector('.pullDownLabel_'+parameter.id).innerHTML = refresher.info.pullingDownLable;					
				e.minScrollY = 0;
			}			
			if ( e.scrollerH < e.wrapperH && e.y < (e.minScrollY-pullUpOffset) || e.scrollerH > e.wrapperH && e.y< (e.maxScrollY - pullUpOffset) ) {
				document.getElementById("pullUp_"+parameter.id).style.display="block";
				pullUpEl.className = 'pullUp flip';
				var pagenum=document.getElementById(parameter.id).getAttribute('data-pagenum');
				if(pagenum=='10'){
					pullUpEl.querySelector('.pullUpLabel_'+parameter.id).innerHTML =refresher.info.pullingUpLable;
				}else if(pagenum=='20'){
					pullUpEl.querySelector('.pullUpLabel_'+parameter.id).innerHTML =refresher.info.pullingUpLable;
				}else if(pagenum=='0'){
					pullUpEl.querySelector('.pullUpLabel_'+parameter.id).innerHTML='暂无信息';
				}else{
					pullUpEl.querySelector('.pullUpLabel_'+parameter.id).innerHTML ='已经到底了哦：）';
				}
			} 
			if (e.scrollerH < e.wrapperH && e.y > (e.minScrollY-pullUpOffset) && pullUpEl.className.match('flip') || e.scrollerH > e.wrapperH && e.y > (e.maxScrollY - pullUpOffset) && pullUpEl.className.match('flip')) {
				document.getElementById("pullUp_"+parameter.id).style.display="none";
				pullUpEl.className = 'pullUp';
				var pagenum=document.getElementById(parameter.id).getAttribute('data-pagenum');
				if(pagenum=='10'){
					pullUpEl.querySelector('.pullUpLabel_'+parameter.id).innerHTML =  refresher.info.pullUpLable;
				}else if(pagenum=='20'){
					pullUpEl.querySelector('.pullUpLabel_'+parameter.id).innerHTML =  refresher.info.pullUpLable;
				}else if(pagenum=='0'){
					pullUpEl.querySelector('.pullUpLabel_'+parameter.id).innerHTML='暂无信息';
				}else{
					pullUpEl.querySelector('.pullUpLabel_'+parameter.id).innerHTML =  '已经到底了哦：）';
				}
				
			}
		},
	
	//things loader css on release,you can wirte it yourself
onRelease:function (pullDownEl,pullUpEl,parameter){
	if (pullDownEl.className.match('loading_'+parameter.id)) {	
		pullDownEl.className = 'pullDown';
		pullDownEl.querySelector('.pullDownLabel_'+parameter.id).innerHTML = refresher.info.pullDownLable;	
		pullDownEl.querySelector('.loader_'+parameter.id).style.display="none"
	    pullDownEl.style.lineHeight=pullDownEl.offsetHeight+"px";				
	}
	if (pullUpEl.className.match('loading_'+parameter.id)) {	
		pullUpEl.className = 'pullUp';
		var pagenum=document.getElementById(parameter.id).getAttribute('data-pagenum');
		if(pagenum=='10'){
			pullUpEl.querySelector('.pullUpLabel_'+parameter.id).innerHTML =  refresher.info.pullUpLable;
		}else if(pagenum=='20'){
			pullUpEl.querySelector('.pullUpLabel_'+parameter.id).innerHTML =  refresher.info.pullUpLable;
		}else if(pagenum=='0'){
			pullUpEl.querySelector('.pullUpLabel_'+parameter.id).innerHTML='暂无信息';
		}else{
			pullUpEl.querySelector('.pullUpLabel_'+parameter.id).innerHTML =  '已经到底了哦：）';
		}
		pullUpEl.querySelector('.loader_'+parameter.id).style.display="none"
		pullUpEl.style.lineHeight=pullDownEl.offsetHeight+"px";	
	}
},
	//things loader css on pulling,you can wirte it yourself		
	onPulling:function (pullDownEl,pullDownAction,pullUpEl,pullUpAction,parameter){
		if(parameter.scrollEndAction)
		parameter.scrollEndAction();
			if (pullDownEl.className.match('flip')) {
				pullDownEl.className = 'pullDown loading_'+parameter.id;
				pullDownEl.querySelector('.pullDownLabel_'+parameter.id).innerHTML =refresher.info.loadingLable;				
				pullDownEl.querySelector('.loader_'+parameter.id).style.display="inline-block"
				pullDownEl.style.lineHeight="20px";		
				if (pullDownAction)
				pullDownAction();	// Execute custom function (ajax call?)
			} 
			if (pullUpEl.className.match('flip')) {
				pullUpEl.className = 'pullUp loading_'+parameter.id;
				pullUpEl.querySelector('.pullUpLabel_'+parameter.id).innerHTML = refresher.info.loadingLable;
				pullUpEl.querySelector('.loader_'+parameter.id).style.display="inline-block"
				pullUpEl.style.lineHeight="20px";		
				if (pullUpAction) 
				pullUpAction();	// Execute custom function (ajax call?)
			}
	}	
}