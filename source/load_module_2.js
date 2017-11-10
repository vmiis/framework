$vm.process_first_include=function(txt,pid,slot,callback,url_0,m_name){
	var lines=txt.split('\n');
	for(var i=0;i<lines.length;i++){
		if(lines[i].length>10){
			if(lines[i].indexOf('VmInclude:')!==-1){
				$vm.load_include(lines,i,pid,slot,callback,url_0,m_name); //find the first include and process
				return;
			}
		}
	}
}
//-----------------------------------
$vm.load_include=function(lines,i,pid,slot,callback,url_0,m_name){
	var name=lines[i].replace('VmInclude:','').trim();
	var items=name.split('|');
	var url=$vm.url(items[0]);
	if(url[0]=='/') url=$vm.hosting_path+url;
	url=url.replace('__CURRENT_PATH__',_g_current_path);
	//------------------------------
	if(url.indexOf('127.0.0.1')==-1 && url.indexOf('localhost')==-1){
		if($vm.trust_path!=undefined){
			var trust=0;
			for(var k=0;k<$vm.trust_path.length;k++){
				var len=$vm.trust_path[k].length;
				if(url.indexOf($vm.trust_path[k])!==-1 && url.substring(0,len)==$vm.trust_path[k]){
					trust=1;
					break;
				}
			}
			if(trust==0){
				alert("The url ("+url+") is not trusted.")
				return;
			}
		}
	}
	//------------------------------
	var ver=localStorage.getItem(url+"_ver");
	var txt=localStorage.getItem(url+"_txt");
	var parts_i=url.indexOf('https://vmiis.github.io/parts');
	var modules_i=url.indexOf('https://vmiis.github.io/modules');
	if(ver!=$vm.version || $vm.debug===true && parts_i==-1 && modules_i==-1 || txt==null || $vm.reload!=''){
	//if(ver!=$vm.version || $vm.debug===true || txt==null || $vm.reload!=''){
		var new_url=url+'?_v='+($vm.version+$vm.reload).replace(/\./,'')+"&g="+_g_vm_chrom_loop++;
		if(url.indexOf('?')!==-1) new_url=url+'&_v='+($vm.version+$vm.reload).replace(/\./,'')+"&g="+_g_vm_chrom_loop++;
		//console.log('LOAD INCLUDE '+new_url.split('/').pop())
		console.log('loading '+new_url)
		//if(url.indexOf('field_select')!==-1) console.log("HHHHHH----"+new_url+"-------")
		$.get(new_url, function(data){
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
			var current_all=$vm.replace_and_recreate_content(lines,i,data)
			if(current_all.indexOf('VmInclude:')==-1){
				$vm.create_module_and_run_code(current_all,pid,url_0,slot,m_name);
				$vm.insert_and_trigger_load(pid,slot,callback);
			}
			else{
				$vm.process_first_include(current_all,pid,slot,callback,url_0,m_name);
			}
		},'text');

	}
	else{
		var current_all=$vm.replace_and_recreate_content(lines,i,txt)
		if(current_all.indexOf('VmInclude:')==-1){
			$vm.create_module_and_run_code(current_all,pid,url_0,slot,m_name);
			$vm.insert_and_trigger_load(pid,slot,callback);
		}
		else{
			$vm.process_first_include(current_all,pid,slot,callback,url_0,m_name);
		}
	}
}
//-----------------------------------
$vm.replace_and_recreate_content=function(lines,I,replace){
	lines[I]=replace;
	var all="";
	for(var j=0;j<lines.length;j++){
		all+=lines[j]+'\n';
	}
	return all;
}
//-----------------------------------
$vm.create_module_and_run_code=function(txt,pid,url,slot,m_name){
	var content=txt;
	if(m_name!=undefined && $vm.module_list[m_name]!=undefined){
		if($vm.module_list[m_name].module_only=='1'){
			content=$(content).filter('#D__ID').html();
		}
	}
	content=$vm.url(content);
    if(m_name!=undefined && $vm.module_list[m_name]!=undefined){
		if($vm.module_list[m_name].html_filter!=undefined){
        	content=$vm.module_list[m_name].html_filter(content);
		}
    }
	content=content.replace(/__ID/g, pid);
	content=content.replace(/<!--([\s\S]*?)-->/mig, '');
	//-----------------
	if(slot!='body'){
		content="<div id=D"+pid+" module='"+m_name+"' class=vm_module style='display:none'><!--"+url+"-->"+content+"</div>"
		$("#D"+pid).remove();
		if(slot=='' || slot==undefined) slot=$vm.root_layout_content_slot;
		$("#"+slot).append($(content));
	}
	else{
		$("body").append($(content));
	}
	//-----------------
	if (typeof window['F'+pid] == 'function') {
		try{
			eval('F'+pid+"()");
		}
		catch(err){
			var module=url;
			if(module===undefined) module=pid;
			alert(err+"\r\nThis error happend in the module\r\n"+module);
		}
	}
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
//-----------------------------------
$vm.insert_and_trigger_load=function(pid,slot,callback){
	if(slot!="body"){
		$vm.insert_module({pid:pid,slot:slot});
		$('#D'+pid).triggerHandler('load');
	}
	if(callback!==undefined) callback();
	$('#vm_loader').hide();
}
//-----------------------------------
$vm.show_module=function(pid,slot,op){
	if($vm.vm[pid].op!=undefined && op!=undefined){
		for (var a in op){
			$vm.vm[pid].op[a]=op[a];
		};
	}
	$vm.insert_module({pid:pid,slot:slot});
	$('#D'+pid).triggerHandler('load');
}
//-----------------------------------
_g_current_path='';
$vm.load_module=function(options){
	_g_vm_chrom_loop=0;
	//------------------------------
	var m_name=options.name;
	var callback=options.callback;
	var pid	=options.pid;
	var db_pid	=options.db_pid;
	var slot	=options.slot;
	var url=options.url;
	if(url[0]=='/') url=$vm.hosting_path+url;
	var last_part=url.split('/').pop();
    _g_current_path=url.replace(last_part,'');
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
	if($('#D'+pid).length==0){
		/*
		var new_url=url+'?v_='+($vm.version+$vm.reload).replace(/\./,'');
		if(url.indexOf('?')!==-1) new_url=url+'&v_='+($vm.version+$vm.reload).replace(/\./,'');
		console.log('LOAD MODULE '+new_url.split('/').pop())
		$.get(new_url, function(data){
			var current_all=data;
			if(current_all.indexOf('VmInclude:')==-1){
				$vm.create_module_and_run_code(current_all,pid,url,slot,m_name);
				$vm.insert_and_trigger_load(pid,slot,callback);
			}
			else{
				$vm.process_first_include(current_all,pid,slot,callback,url,m_name);
			}
		}).fail(function() {
			alert( "The file '"+url+"' doesn't exist!" );
		});
		*/
		//------------------------------
		if(url.indexOf('127.0.0.1')==-1 && url.indexOf('localhost')==-1){
			if($vm.trust_path!=undefined){
				var trust=0;
				for(var i=0;i<$vm.trust_path.length;i++){
					var len=$vm.trust_path[i].length;
					if(url.indexOf($vm.trust_path[i])!==-1 && url.substring(0,len)==$vm.trust_path[i]){
						trust=1;
						break;
					}
				}
				if(trust==0){
					alert("The url ("+url+") is not trusted.")
					return;
				}
			}
		}
		//------------------------------
		var ver=localStorage.getItem(url+"_ver");
		var txt=localStorage.getItem(url+"_txt");
		var parts_i=url.indexOf('https://vmiis.github.io/parts');
		var modules_i=url.indexOf('https://vmiis.github.io/modules');
		if(ver!=$vm.version || $vm.debug===true && parts_i==-1 && modules_i==-1 || txt==null || $vm.reload!=''){
			var new_url=url+'?_v='+($vm.version+$vm.reload).replace(/\./,'');
			if(url.indexOf('?')!==-1) new_url=url+'&_v='+($vm.version+$vm.reload).replace(/\./,'');
			//console.log('LOAD MODULE '+new_url.split('/').pop())
			console.log('loading '+new_url)
			$('#vm_loader').show();
			$.get(new_url, function(data){
				localStorage.setItem(url+"_txt",data);
				localStorage.setItem(url+"_ver",$vm.version);
				var current_all=data;
				if(current_all.indexOf('VmInclude:')==-1){
					$vm.create_module_and_run_code(current_all,pid,url,slot,m_name);
					$vm.insert_and_trigger_load(pid,slot,callback);
				}
				else{
					$vm.process_first_include(current_all,pid,slot,callback,url,m_name);
				}
			}).fail(function() {
			    alert( "The file '"+url+"' doesn't exist!" );
			});
		}
		else{
			var current_all=txt;
			if(current_all.indexOf('VmInclude:')==-1){
				$vm.create_module_and_run_code(current_all,pid,url,slot,m_name);
				$vm.insert_and_trigger_load(pid,slot,callback);
			}
			else{
				$vm.process_first_include(current_all,pid,slot,callback,url,m_name);
			}
		}
	}
	else $vm.insert_and_trigger_load(pid,slot,callback);
};
