$vm.autocomplete=function($div,sql,callback){
    var field=$div.attr('data-id');
    $div.focus(function(){$div.autocomplete("search","");});
    return $div.autocomplete({
        minLength:0,
        source:function(request,response){
            $VmAPI.request({data:{cmd:'auto',s1:request.term,sql:sql,minLength:0},callback:function(res){
                response($vm.autocomplete_list(res.table));
            }});
        },
        select: function(event,ui){
            if(callback!=undefined){
                callback(field+'_uid',ui.item.value2);
                for(key in ui.item){
                    if(key.indexOf('field_')!==-1){
                        var k=key.replace('field_','')
                        var v=ui.item[key];
                        callback(k,v);
                    }
                }
            }
        }
    })
}
