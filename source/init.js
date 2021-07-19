//------------------------------------------------------------------
$vm.init=function(options){
	if($vm.repository==undefined) $vm.repository="";
	$vm.set_category();
	var callback=options.callback;
	$vm.itemuid="";
	$vm.appid="";
	$vm.idapp="";
	$vm.ticks="";
	$vm.appuid="";
	$vm.uidapp="";
	$vm.user='';
	$vm.user_id='';
	$vm.user_ip='';
	$vm.guest=1;
	$vm.owner=1;
	$vm.current_module='';
	$vm.current_form='';
	$vm.current_grid='';
	$vm.current_main='';
	$vm.current_left='';
	$vm.comm=0;
	$vm.itemuid="";
	$vm.appid="";
	$vm.idapp="";
	$vm.ticks="";
	$vm.update_key='';
	$vm.submit_btn=""
	$vm.module_border="0";
	$vm.vm={};
	//$vm.root_layout_content_slot='vm_content_slot';

	$vm.edge=0;
	if(navigator.appVersion.indexOf('Edge')!=-1) $vm.edge=1;

	//$vm.path_app=location.href.substring(0, location.href.lastIndexOf("/")+1)
	//if($vm.api_url!="") $vm.path_app=$vm.api_url.replace("api.aspx","");

	g_itemuid="";
	g_appid="";
	g_idapp="";
	g_ticks="";
	g_appuid="";
	g_uidapp="";
	g_user='';
	g_guest=1;
	g_owner=1;
	g_current_module='';
	g_current_form='';
	g_current_grid='';
	g_current_main='';
	g_current_left='';
	g_comm=0;
	g_itemuid="";
	g_appid="";
	g_idapp="";
	g_ticks="";
	g_update_key='';
	g_submit_btn=""
	g_module_border="0";
	if(typeof(g_vm)==='undefined') g_vm={};
	//-----------------------------------------------------
	$('body').html("<div id=vm_body></div><div id=vm_park style='display:none'></div>");
	//g_vm.root_layout_content_slot='vm_content_slot';
	//-----------------------------------------------------
	//g_vm_path_app=location.href.substring(0, location.href.lastIndexOf("/")+1)
	//if(g_vm_api_url!="") g_vm_path_app=g_vm_api_url.replace("api.aspx","");
	//-----------------------------------------------------
  	$("html").bind("ajaxStart", function(){
     		$(this).addClass('busy');
   	}).bind("ajaxStop", function(){
     		$(this).removeClass('busy');
   	});
	//-----------------------------------------------------
	/*
	var req={cmd:"data2", action:"user_name"};
    	$(this).vm7('request',req, function(res){
        g_user=res.user_name;
        g_user_id=res.user_id;
        g_vm_ver=res.ver;

        g_user=res.user_name;
        g_user_id=res.user_id;
        g_vm_ver=res.ver;

        if(callback!==undefined) callback();
    	});
	*/
	g_user='guest';
	g_user_id='0';
	g_user_ip='';
	$vm.user="guest";
	$VmAPI.request({data:{cmd:'user_name'},callback:function(res){
		if(res.user!==undefined){
			$vm.user=res.user;
			$vm.user_id=res.user_id;
			$vm.user_ip=res.user_ip;
		}
		if(callback!==undefined) callback(res);
		//------------------------------------------------------------------
		$vm.ip='';
		/*
		try{
			window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
			var pc = new RTCPeerConnection({iceServers:[]}), noop = function(){};
			pc.createDataChannel("");
			pc.createOffer(pc.setLocalDescription.bind(pc), noop);
			pc.onicecandidate = function(ice){
			   if(!ice || !ice.candidate || !ice.candidate.candidate)  return;
			   $vm.ip=/([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(ice.candidate.candidate)[1];
			   pc.onicecandidate = noop;
			   $VmAPI.request({data:{cmd:'user_ip',ip:$vm.ip,name:$vm.user},callback:function(res){}})
			   //-----------------------------------------------------
			};
		}catch(e){
			$VmAPI.request({data:{cmd:'user_ip',ip:'0.0.0.0',name:$vm.user},callback:function(res){}})
		}
		//------------------------------------------------------------------
		*/
	}})
	//-----------------------------------------------------
};
//------------------------------------------------------------------
$vm.jquery_validator_init=function(options){
	//--------------------------------
	$.validator.addMethod(
		'regex',
		function(value, element, param) {
			var re = new RegExp(param[0]);
            return this.optional(element) || re.test(value);
    	},
    	$.validator.format('{1}')
    );
    $.validator.setDefaults({
	    ignore: ''
	    ,errorPlacement: function(error, element) {
    		if (element.attr('type') == 'radio') {
	    		element.parent().append('<br>');
	    		error.appendTo(element.parent());
            }
            else {
                error.insertAfter(element);
            }
    	}
	});
	//--------------------------------
}
//------------------------------------------------------------------
$vm._id=-1;
$vm.id=function(txt){
	$vm._id++;
	return "_"+$vm._id.toString();
	//return "_"+txt.replace(/=/g,'_').replace(/\&/g,'_').replace(/\?/g,'_').replace(/-/g,'_').replace(/\./g,'_').replace(/\//g,'_').replace(/:/g,'_').replace('__BASE__','');
}
//------------------------------------------------------------------
$vm.load_demo=function(){
	var name=window.location.search.split('n=').pop();
    if(name!==""){
		var mid;
        var url;
		if(Array.isArray($vm.module_list[name])===true){
			mid=$vm.module_list[name][0];
	        url=$vm.module_list[name][1];
		}
		else{
			mid=$vm.module_list[name]['table_id'];
	        url=$vm.module_list[name]['url'];
		}
        var param={
            name:name,
			pid:$vm.id(url+mid),
            slot:$vm.root_layout_content_slot,
            url:$vm.url(url),
			op:{}
        }
        $vm.load_module(param);
		$vm.demo_background();
    }
}
//------------------------------------------------------------------
$vm.set_category=function(){
	$vm.category="";
	$vm.subcategory="";
	var a=$vm.get_parameter('category'); if(a!=null) $vm.category=a;
	var a=$vm.get_parameter('subcategory'); if(a!=null) $vm.subcategory=a;
}
//------------------------------------------------------------------
$vm.get_parameter=function(name, url){
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
//--------------------------------------------------------
$vm.load_config_and_init=function(path,callback){
	var url=$vm.hosting_path+path;
	var ver=localStorage.getItem(url+"_ver");
	var txt=localStorage.getItem(url+"_txt");
	//------------------------------------------
	if(ver!=$vm.version || txt===null || $vm.debug===true || $vm.reload!=''){
		console.log('loading '+url+'?_='+$vm.version+$vm.reload);
		$.get(url+'?_='+$vm.version+$vm.reload,function(data){
			localStorage.setItem(url+"_txt",data);
			localStorage.setItem(url+"_ver",$vm.version);
			$vm._panel_init(data,callback);
		},'text').fail(function() {
			alert( "The configuration file ("+url+") doesn't exist!" );
		});
	}
	else{ $vm._panel_init(txt,callback); }
	//------------------------------------------
}
//--------------------------------------------------------
$vm._panel_init=function(txt,callback){
	var text=$('<div></div>').html(txt).text();
	//---------------------------
	var config;
	try{ config=JSON.parse(text);}
	catch (e){ alert("Error in app config file\n"+e); return; }
	//--------------------------------------------------------
	var group=config.group;
	if(group==undefined) group="";
	else group=group+"_";
	var modules=config.modules;
	for (var property in modules) {
		if($vm.module_list[group+property]==undefined) $vm.module_list[group+property]=modules[property];
	}
	if(callback!=undefined) callback(config);
}
//--------------------------------------------------------
