$vm.iframe_height=function(){
    var height=$('#content_slot').outerHeight(true);
    var req={cmd:'height',height:height};
    window.parent.postMessage(req,'*');
}
//--------------------------------------------------------
$vm.msg_id=0;
$vm.callback_array=[]
//--------------------------------------------------------
$vm.post_message_from_child_to_parent=function(obj){
	var req=obj.data;
	console.log(' ');
	console.log(req.cmd+' TO parent');
	console.log(req)
    req.ID=$vm.msg_id;
    $vm.callback_array.push({callback:obj.callback,ID:$vm.msg_id})
    window.opener.postMessage(req,obj.origin);
    $vm.msg_id++;
}
//--------------------------------------------------------
$vm.process_message_from_child=function(e){
	var req=e.data;
	if(req.cmd!=undefined){
		$VmAPI.request({data:req,callback:function(res){
			res.ID=req.ID;
			res.cmd=req.cmd;
			e.source.postMessage(res,e.origin);
		}})
    }
}
//--------------------------------------------------------
$vm.process_message_from_parent=function(e){
	var res=e.data;
	console.log(' ');
	console.log(res.cmd+' FROM parent');
	console.log(res)
    for(i=0;i<$vm.callback_array.length;i++){
        var obj=$vm.callback_array[i]
        if(obj.ID==res.ID){
            obj.callback(res);
            $vm.callback_array.splice(i,1);
            break;
        }
    }
}
//--------------------------------------------------------
/*
if(
	e.data.cmd=='query_records_iframe' ||
	e.data.cmd=='add_json_record_iframe' ||
	e.data.cmd=='modify_json_record_iframe' ||
	e.data.cmd=='delete_record_iframe'
){
	$VmAPI.request({data:e.data,callback:function(res){
		res.ID=e.data.ID;
		res.cmd=e.data.cmd;
		e.source.postMessage(res,e.origin);
	}})
}
else if(e.data.cmd=='test'){
	alert("TEST")
	e.source.postMessage(e.data,e.origin);
}
*/
/*
$vm.post_message=function(req,o,callback){
    req.ID=$vm.msg_id;
    $vm.callback_array.push({callback:callback,ID:$vm.msg_id})
    window.parent.postMessage(req,'*');
    $vm.msg_id++;
}
//--------------------------------------------------------
$vm.process_message=function(e){
    if(e.data=='load'){
        $('#content_slot div[class=vm_module]').each(function(){
            if($(this).css("display")=="block"){
                $(this).trigger('load');
                return false;
            }
        })
    }
    else{
        for(i=0;i<$vm.callback_array.length;i++){
            var obj=$vm.callback_array[i]
            if(obj.ID==e.data.ID){
                obj.callback(e.data);
                $vm.callback_array.splice(i,1);
                break;
            }
        }
    }
}
//--------------------------------------------------------
$vm.parent_process_message=function(e){
	if(e.data.cmd!=undefined){
        if(e.data.cmd=='back'){
            $('#content_slot div[class=vm_module]').each(function(){
                if($(this).css("display")=="block"){
                    var o=$(this).attr('id').replace('D','#back')
                    $(o).triggerHandler('click');
                    return false;
                }
            })
        }
        else if(
            e.data.cmd=='query_records_iframe' ||
            e.data.cmd=='add_json_record_iframe' ||
            e.data.cmd=='modify_json_record_iframe' ||
            e.data.cmd=='delete_record_iframe'
        ){
            $VmAPI.request({data:e.data,callback:function(res){
                //alert(JSON.stringify(res));
                $('#content_slot div[class=vm_module]').each(function(){
                    if($(this).css("display")=="block"){
                        var o=$(this).find('iframe');
                        res.ID=e.data.ID;
                        res.cmd=e.data.cmd;
                        o[0].contentWindow.postMessage(res,'*');
                        return false;
                    }
                })
            }})
        }
        else if(e.data.cmd=='height'){
            $('#content_slot div[class=vm_module]').each(function(){
                if($(this).css("display")=="block"){
                    var o=$(this).find('iframe');
                    var h=e.data.height;
                    if(h<$vm.min_height-3) h=$vm.min_height-3;
                    o.css('min-height',h+'px');
                    return false;
                }
            })
        }
    }
}
*/
//--------------------------------------------------------
