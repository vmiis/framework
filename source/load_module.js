$vm.old_good_load_module=function(options){
	//------------------------------
	var callback=options.callback;
	var pid	=options.pid;
	var db_pid	=options.db_pid;
	var slot	=options.slot;
	var url=options.url;
	if(url===undefined) return;
	if($('#D'+pid).length===0){
		$vm.vm[pid]={};
	}
	$vm.vm[pid].parent_uid=undefined;
	$vm.vm[pid].parent_name="";
	$vm.vm[pid].excel_dialog="";
	for (var a in options){
		$vm.vm[pid][a]=options[a];
	};
	//------------------------------
	var load_main=function(){
		if($('#D'+pid).length==0){
			//------------------------------
			var ver=localStorage.getItem(url+"_ver");
			var txt=localStorage.getItem(url+"_txt");
			if(ver!==$vm.version || $vm.debug===true || txt==null){
				var new_url=url+'?v_='+$vm.version;
				if(url.indexOf('?')!==-1) new_url=url+'&v_='+$vm.version;
				//if($vm.debug_message===true) console.log('LOAD MODULE FROM '+url);
				//jQuery.ajaxSetup({async:false}); //SSTTAARRTT, find where EENNDD
				console.log('LOAD MODULE FROM '+new_url)
				$.get(new_url, function(data){
					localStorage.setItem(url+"_txt",data);
					localStorage.setItem(url+"_ver",$vm.version);
					process_include(data);
				});
			}
			else{
				process_include(txt);
			}
		}
		else{
			insert();
		}
	}
	//------------------------------
	var process_include=function(content){
		var search_include=function(txt){
			var lines=txt.split('\n');
			for(var i=0;i<lines.length;i++){
				if(lines[i].length>10){
					if(lines[i].indexOf('VmInclude:')!==-1){
						load_include(lines,i); //find include and process untill no more include found
						return;
					}
				}
			}
			var add_lines=function(lines){
				var all="";
				for(var j=0;j<lines.length;j++){
					all+=lines[j]+'\n';
				}
				return all;
			}
			//can not find any more, so we will stop, this is the last point
			var all=add_lines(lines); // this is the last full content
			//jQuery.ajaxSetup({async:true}); //EENNDD, find where SSTTAARRTT
			process_content(all);
			insert();
		}
		var load_include=function(lines,i){
			var add_lines=function(lines,I,txt){
				lines[I]=txt;
				var all="";
				for(var j=0;j<lines.length;j++){
					all+=lines[j]+'\n';
				}
				return all;
			}
			var name=lines[i].replace('VmInclude:','').trim();
			var items=name.split('|');
			var url=$vm.url(items[0]);
			var ver=localStorage.getItem(url+"_ver");
			var txt=localStorage.getItem(url+"_txt");
			if(ver!==$vm.version || $vm.debug===true || txt==null){
				var new_url=url+'?v_='+$vm.version;
				if(url.indexOf('?')!==-1) new_url=url+'&v_='+$vm.version;
				console.log('LOAD INCLUDE FROM '+new_url)
				//if(url.indexOf('field_select')!==-1) console.log("HHHHHH----"+new_url+"-------")
				$.get(new_url, function(data){
					//if(url.indexOf('field_select')!==-1) console.log("GGGGGG"+data)
					if(items.length>1){
						for(var kk=0;kk<(items.length-1)/2;kk++){
							var k1=2*kk+1;
							var k2=2*kk+2;
							if(k1<items.length && k2<items.length){
								var re=new RegExp(items[k1], 'g');
								data=data.replace(re,items[k2]);
							}
						}
					}
					localStorage.setItem(url+"_txt",data);
					localStorage.setItem(url+"_ver",$vm.version);
					var current_all=add_lines(lines,i,data)
					search_include(current_all);
				},'text');

			}
			else{
				var current_all=add_lines(lines,i,txt)
				search_include(current_all);
			}
		}
		search_include(content);
	}
	//------------------------------
	var process_content=function(txt){
		txt=$vm.url(txt);
		var content=txt.replace(/__ID__/g, pid);
		content=content.replace(/__ID/g, pid);
		//-----------------
		content=content.replace(/<!--([\s\S]*?)-->/mig, '');
		//-----------------
		content="<div id=D"+pid+" class=vm_module>"+content+"</div>"
		$("#D"+pid).remove();
		$("#vm_park").append($(content));
		//-----------------
		if (typeof window['F'+pid] == 'function') { eval('F'+pid+"()");	}
		//-----------------------------------------
		$('#D'+pid).on('dblclick',function(event){
			event.stopPropagation();
			$vm.source(''+pid,event);
		});
		//-------------------------------------
		if($vm.vm_module_border!==undefined){
            $('div.vm_module').css("border","1px solid red");
        }
		//-------------------------------------
	}
	//------------------------------
	var insert=function(){
		if(slot!="body") $vm.insert_module({pid:pid,slot:slot});
		//if(slot!==undefined && slot!=="")
		$('#D'+pid).triggerHandler('load');
		if(callback!==undefined) callback();
	}
	//------------------------------
	load_main();
	//------------------------------
};
$vm.insert_module=function(options){
	var pid		=options.pid;
	var slot	=options.slot;
	if(pid===undefined) return;
	if(slot===undefined || slot=="") return;

	var current=$('#'+slot).data("current");
//	if(current===pid) return; //the module is already in the slot
	if(current!==undefined) $vm.push_back_to_park({div:current});

	$vm.push_to_slot({div:pid,slot:slot});
	$('#'+slot).data("current",pid);
	$('#D'+pid).data('back_module',current);
	$('#D'+pid).data('back_slot',slot);

	//****
	var last_state=$('#'+slot).data('current_state');
	var new_state={ID:pid,slot:slot};
	
	window.history.pushState(new_state, null, null);
	$('#'+slot).data('current_state',new_state);

	if(last_state!=undefined){
		if(last_state.ID!=new_state.ID){
			var last_ID=last_state.ID;
			$('#D'+last_ID).css('display','none');
		}
	}
	
	var last_ID=''; 
	if(last_state!=undefined) last_ID=last_state.ID;
	
console.log('insert:'+pid+'   last:'+last_ID+" --- current:"+pid)
	//****
};
//------------------------------------
window.onpopstate=function(event) {
	if(event.state==null){
		window.history.back(-1);
	}
	else{
		var slot=$vm.root_layout_content_slot;
		var current_ID=$('#'+slot).data("current_state").ID;
		var last_ID=event.state.ID;
		if(last_ID!=undefined){
			$('#D'+last_ID).css('display','block');
			if(current_ID!=last_ID){
				$('#D'+current_ID).css('display','none');
			}
		}
		$('#'+slot).data("current_state",event.state);
console.log('popstate'+event.state.ID+'   last:'+current_ID+" --- current:"+event.state.ID)

	}
}
//------------------------------------
$vm.push_back_to_park=function(options){
	var div=options.div;
	if( $('#D'+div).length>0){
		var scroll=$('#vm_body').scrollTop();
		$('#D'+div).data('scroll',scroll);

		//$('#D'+div).appendTo('#vm_park');
		$('#D'+div).css('display','none');

		$('#D'+div).triggerHandler('hide');
	}
}
$vm.push_to_slot=function(options){
	var div	=options.div;
	var slot=options.slot;

	//$('#'+slot).html('');
   	//$('#D'+div).appendTo('#'+slot);
	$('#D'+div).css('display','block');

	$('#D'+div).triggerHandler('show');
	var scroll=$('#D'+div).data('scroll');
	if(scroll==undefined) scroll=0;
	$('#vm_body').scrollTop(scroll)
}
$vm.back=function(options){
	var div=options.div;
	var back_module=$('#D'+div).data('back_module');
	var back_slot=$('#D'+div).data('back_slot');
	$vm.push_back_to_park({div:div});
	$vm.push_to_slot({div:back_module,slot:back_slot});
	$('#'+back_slot).data("current",back_module);
	var form=options.form;
	var refresh_back=options.refresh_back;
	if(form!==undefined){
		if(refresh_back===undefined) $('#D'+back_module).triggerHandler('form_back'); //without save on form
		else if(refresh_back!==undefined) $('#D'+back_module).triggerHandler('refresh_back'); //with save on form
	}
	else $('#D'+back_module).triggerHandler('back');
}
$vm.back_and_refresh=function(options){
	var div=options.div;
	var back_module=$('#D'+div).data('back_module');
	var back_slot=$('#D'+div).data('back_slot');
	$vm.push_back_to_park({div:div});
	$vm.push_to_slot({div:back_module,slot:back_slot});
	$('#'+back_slot).data("current",back_module);
	$('#D'+back_module).triggerHandler('refresh_back');
}
$vm.load_first_module=function(options){
	var url=$vm.first_module;
	var src=$vm.first_module_src;
	if(options!==undefined){
		url=options.url;
		src=options.src;
	}
	var param={
		pid:$vm.id(url),
		slot:"vm_body",//$vm.root_layout_content_slot,
		url:$vm.url(url),
		source:src
	}
	$vm.load_module(param);
}
//--------------------------------------------------------
$vm.load_first_module_to_body=function(options){
	$vm.load_module({
		pid:$vm.id(),
		slot:"body",
		url:$vm.url(options.url),
		callback:options.callback
	});
}
//--------------------------------------------------------
$vm.open_dialog=function(options){
	var name=options.name;
	if($vm.module_list[name]===undefined) return;
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
	//var pid=$vm.id(url+mid);
	//$('#D'+pid).appendTo('body');


	var id=$vm.module_list[name].id;
	$('#D'+id).css('display','block')
}
//--------------------------------------------------------
$vm.close_dialog=function(options){
	var name=options.name;
	if($vm.module_list[name]===undefined) return;
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
	var pid=$vm.id(url+mid);
	//$('#D'+pid).appendTo('#vm_park');
	var id=$vm.module_list[name].id;
	$('#D'+id).css('display','none')
}
//--------------------------------------------------------
$vm.load_module_to_park=function(options){
	var name=optioms.name;
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
        url:$vm.url(url),
     }
     $vm.load_module(param);
}
//-----------------------------------
$vm.get_module_id=function(options){
	return $vm.module_list[options.name].id;
	/*
	var name=options.name;
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
    return $vm.id(url+mid);
	*/
}
//-----------------------------------
$vm.get_module=function(options){
	/*
	var name=options.name;
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
    return $('#D'+$vm.id(url+mid));
	*/
	return $('#D'+$vm.module_list[options.name].id);
}
//-----------------------------------
$vm.load_module_by_name=function(name,slot,op,callback){
	//load module from module list by 'name' into a 'slot' with options 'op'
	if(name!==undefined){
		if($vm.module_list[name]===undefined){
			alert("The module '"+name+"' is not in the module list.");
			return;
		}
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
		var id=$vm.module_list[name].id;
		if(id==undefined) id=$vm.id();
		$vm.module_list[name].id=id;
		var param={
			name:name,
			pid:id,//$vm.id(url+mid),
			slot:slot,
			url:$vm.url(url),
			op:op,
			callback:callback
		 }
		 $vm.load_module(param);
	}
}
//-----------------------------------
$vm.alert=function(msg){
	$vm.open_dialog({name:'alert_dialog_module'});
	var mid=$vm.module_list['alert_dialog_module']['table_id'];
	var url=$vm.module_list['alert_dialog_module']['url'];
	var pid=$vm.id(url+mid);

	var name='alert_dialog_module';
	var id=$vm.module_list[name].id;
	$('#message'+id).text(msg);
}
//-----------------------------------
$vm.close_alert=function(){
	$vm.close_dialog({name:'alert_dialog_module'});
}
//-----------------------------------
$vm.table_id=function(__ID,param_name){
	var this_module=$vm.vm[__ID].name;
	var module_name=$vm.module_list[this_module][param_name];
	if(module_name===undefined){
		alert("The module doesn't contain the parameter name: "+param_name);
		return '';
	}
	var module=$vm.module_list[module_name];
	if(module===undefined){
		alert("Can not find "+module_name+" in the module list.");
		return '';
	}
	return module.table_id;
}
//-----------------------------------
$vm.attr=function(__ID,param_name){
	var this_module=$vm.vm[__ID].name;
	var value=$vm.module_list[this_module][param_name];
	if(value===undefined){
		alert("The module doesn't contain the attr name: "+param_name);
		return '';
	}
	return value;
}
//-----------------------------------
/*
$vm.load_module_v2=function(json,slot,op,callback){
	if(json==undefined){
		alert("The module is not in the module list.");
	}
	var url=json.url;
	var id=json.id;
	if(id!=undefined){
		$vm.show_module_v2(id,slot,op);
	}
	else{
		id=$vm.id();
		json.id=id;
	}
	var param={
		name:name,
		pid:id,
		slot:slot,
		url:$vm.url(url),
		op:op,
		callback:callback
	 }
	 $vm.load_module(param);
}
//-----------------------------------
$vm.show_module_v2=function(id,slot,op){
	if($vm.vm[id].op!=undefined && op!=undefined){
		for (var a in op){
			$vm.vm[id].op[a]=op[a];
		};
	}
	$vm.insert_module({pid:id,slot:slot});
	$('#D'+id).triggerHandler('load');
}
//-----------------------------------
*/
$vm.load_module_content=function(url,callback){ //used for iframe
	var ver=localStorage.getItem(url+"_ver");
	var txt=localStorage.getItem(url+"_txt");
	//------------------------------------------
	if(ver!=$vm.version || txt===null || $vm.debug===true || $vm.reload!=''){
		console.log('loading '+url+'?_='+$vm.version+$vm.reload);
		$.get(url+'?_='+$vm.version+$vm.reload,function(data){
			localStorage.setItem(url+"_txt",data);
			localStorage.setItem(url+"_ver",$vm.version);
			if(callback!=undefined) callback(data);
		},'text').fail(function() {
			alert( "The module content file ("+url+") doesn't exist!" );
		});
	}
	else{ if(callback!=undefined) callback(txt); }
	//------------------------------------------
}
