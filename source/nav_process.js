$vm.nav_click_process=function(name,slot){
	switch(name){
		case 'vm_signinout':
			if($vm.user=='guest'){
				window.open($VmAPI.api_base+"signin.html?url="+window.location.href,"Sign In","width=600, height=600");
			}
			else{
				$VmAPI.clear_token();
				$VmAPI.request({data:{cmd:'signout'},callback:function(c){
					$vm.user="guest";
					$vm.user_id="";
					location.reload(true);
				}});
			}
			break;
		default:
			if(name=='dev'){
				$vm.alert('Under development');
			}
			else $vm.nav_load_module(name,slot);
			break;
	}
}
//-----------------------------------------
$vm.nav_load_module=function(name,slot){
	if($vm.app_config.modules[name]!=undefined && $vm.app_config.modules[name].url!=undefined){
		if($vm.module_list[name]==undefined){
			$vm.module_list[name]=$vm.app_config.modules[name];
		}
	}
	var url=$vm.module_list[name].url;
	if(url.split('.').pop().split('?')[0]=='json'){
		$vm.nav_load_panel(name)
		return;
	}
	if(url[0]=='/'){
		if($vm.hosting_path!=undefined) url=$vm.hosting_path+url;
	}
	var single_record=$vm.module_list[name].single_record;
	//if(check_trust(url)==0) return;
	var op={
		//-----------------
		sys:{
			config:$vm.app_config,
			UID:name,
		},
		//-----------------
	}
	var slot_1=$vm.root_layout_content_slot;
	if(slot!=undefined) slot_1=slot;
	if(single_record=='1') slot_1=undefined;
	$vm.load_module_by_name(name,slot_1,op)
};
//---------------------------------------------
$vm.nav_load_panel=function(name){
	var url=$vm.module_list[name].url;
	if(url[0]=='/'){
		if($vm.hosting_path!=undefined) url=$vm.hosting_path+url;
	}
	//if(check_trust(url)==0) return;
	console.log('loading '+url);
	$.get(url,function(text){
		var text=$('<div/>').html(text).text();
		//---------------------------
		var config;
		try{ config=JSON.parse(text); }
		catch (e){ alert("Error in config file\n"+e); return; }
		//-----------------------------------------------
		var module=name+"_panel";
		if($vm.module_list[module]==undefined){
			$vm.module_list[module]={
				url:config.url,
				var:{},
			}
		}
		$vm.load_module_by_name(module,$vm.root_layout_content_slot,{
			sys:{
				config:config,
				UID:name,
			}
		})
		//-----------------------------------------------
	},'text').fail(function() {
		alert( "The file '"+url+"' doesn't exist!" );
	});
}
//---------------------------------------------
