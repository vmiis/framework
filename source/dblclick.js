$vm.source=function(pid,event){
	if (event.altKey) {
		if($vm.vm[pid].url!==undefined){
			var url='__COMPONENT__/code_viewer/code.html'
			var module_url=$vm.vm[pid].url;
			if(module_url[0]=='/') module_url=$vm.hosting_path+module_url;
			$.get(module_url+'?'+new Date().getTime(), function(data){
				var nm=$vm.vm[pid].name;
				if($vm.module_list[nm]!==undefined){
                    if($vm.module_list[nm].html_filter!=undefined){
                        data=$vm.module_list[nm].html_filter(data);
                    }
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
        var nm=$vm.vm[pid].name+"_";
        var list={}
        for(key in $vm.module_list){
          if(key.indexOf(nm)!==-1){
              list[key]=$vm.module_list[key];
          }
        }
		var txt2=JSON.stringify(list,null,4);
		txt2=$('<div></div>').html(txt2).text();
		var url='__COMPONENT__/code_viewer/code.html'
		var param={
			name:"code_viewer",
			pid:$vm.id(url+"--------"),
			slot:$vm.root_layout_content_slot,
			url:$vm.url(url),
			op:{name:'System info',code:txt2}
		}
		$vm.load_module(param);
    }
	else if(event.shiftKey){
		var nm=$vm.vm[pid].name;
        var list={}
        list[nm]=$vm.module_list[nm];
        var txt2=JSON.stringify(list,null,4);
		txt2=$('<div></div>').html(txt2).text();
		var url='__COMPONENT__/code_viewer/code.html'
		var param={
			name:"code_viewer",
			pid:$vm.id(url+"--------"),
			slot:$vm.root_layout_content_slot,
			url:$vm.url(url),
			op:{name:'System info',code:txt2}
		}
		$vm.load_module(param);


        /*
        var msg;
		if(Array.isArray($vm.module_list[nm])===true){
		  msg='module name: '+nm+'\r\ndatabase table id: '+$vm.module_list[nm][0]+'\r\npath: '+$vm.module_list[nm][1]
		}
		else{
		  msg='module name: '+nm+'\r\ndatabase table id: '+$vm.module_list[nm]['table_id']+'\r\npath: '+$vm.module_list[nm]['url']
		}
		alert(msg)
        */
	}
}
//------------------------------------------------------------------
$vm.url_source=function(url){
	$.get(url+'?'+new Date().getTime(), function(data){
		var c_url='__COMPONENT__/code_viewer/code.html'
		var param={
			name:"code_viewer",
			pid:$vm.id(url+"--------"),
			slot:$vm.root_layout_content_slot,
			url:$vm.url(c_url),
			op:{name:url,code:data}
		}
		$vm.load_module(param);
    },'text');
}
$vm.view_code=function(code,name){
	if(name==undefined) name='Code'
	var c_url='__COMPONENT__/code_viewer/code.html'
	var param={
		name:"code_viewer",
		pid:$vm.id("--------"),
		slot:$vm.root_layout_content_slot,
        url:$vm.url(c_url),
		op:{name:name,code:code}
	}
    $vm.load_module(param);
}
//------------------------------------------------------------------
