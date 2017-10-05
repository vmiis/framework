$vm.source=function(pid,event){
	if (event.altKey) {
		if($vm.vm[pid].url!==undefined){
			var url='__BASE__/vmiis/Common-Code/code_viewer/code.html'
			var module_url=$vm.vm[pid].url;
			if(module_url[0]=='/') module_url=$vm.hosting_path+module_url;
			$.get(module_url+'?'+new Date().getTime(), function(data){
				var nm=$vm.vm[pid].name;
				if($vm.module_list[nm]!==undefined){
					var msg;
					if(Array.isArray($vm.module_list[nm])===true){
						msg='module name: '+nm+', database table id: '+$vm.module_list[nm][0]+', path: '+$vm.module_list[nm][1];
					}
					else{
						msg='module name: '+nm+', database table id: '+$vm.module_list[nm]['table_id']+', path: '+$vm.url($vm.module_list[nm]['url']);
					}
					var param={
			            name:"code_viewer",
			            pid:$vm.id(url+"--------"),
			            slot:$vm.root_layout_content_slot,
			            url:$vm.url(url),
			            op:{name:msg,code:data}
			        }
			        $vm.load_module(param);
				}
			})
		}
    }
	else if (event.ctrlKey) {
		//if(_sys !=undefined && _sys.config!=undefined){
			//var txt=JSON.stringify(config,null,4);
			//txt=$('<div/>').html(txt).text();
			var txt2=JSON.stringify($vm.module_list,null,4);
			txt2=$('<div/>').html(txt2).text();
			var url='__LIB__/vmiis/Common-Code/code_viewer/code.html'
			var param={
				name:"code_viewer",
				pid:$vm.id(url+"--------"),
				slot:$vm.root_layout_content_slot,
				url:$vm.url(url),
				//op:{name:'System info',code:'{"config":'+txt+',\r\n"module_list":'+txt2+'}'}
				op:{name:'System info',code:txt2}
			}
			$vm.load_module(param);
		//}
		/*
            if($vm.vm_module_border===undefined){
                  $('div.vm_module').css("border","1px solid red");
                  $vm.vm_module_border=1;
            }
            else{
                  $('div.vm_module').css("border","0px solid red");
                  $vm.vm_module_border=undefined;
            }
			*/
    }
	else if(event.shiftKey){
		var nm=$vm.vm[pid].name;
		var msg;
		if(Array.isArray($vm.module_list[nm])===true){
		  msg='module name: '+nm+'\r\ndatabase table id: '+$vm.module_list[nm][0]+'\r\npath: '+$vm.module_list[nm][1]
		}
		else{
		  msg='module name: '+nm+'\r\ndatabase table id: '+$vm.module_list[nm]['table_id']+'\r\npath: '+$vm.module_list[nm]['url']
		}
		alert(msg)
	}
}
//------------------------------------------------------------------
$vm.url_source=function(url){
	$.get(url+'?'+new Date().getTime(), function(data){
		var c_url='__PARTS__/code_viewer/code.html'
		var param={
			name:"code_viewer",
			pid:$vm.id(url+"--------"),
			slot:$vm.root_layout_content_slot,
			url:$vm.url(c_url),
			op:{name:url,code:data}
		}
		$vm.load_module(param);
	})
}
//------------------------------------------------------------------
