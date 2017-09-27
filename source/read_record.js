$vm.read_record_auto=function(params){
    var query=params.query;
    var minLength=params.minLength;
    var process=params.process;
    var callback=params.callback;
    $VmAPI.request({data:{cmd:'auto',s1:query,sql:params.sql,minLength:minLength},callback:function(res){
        var items=[];  var nv={};
        for(var i=0;i<res.table.length;i++){
            var nm=res.table[i].Item.trim();
            items.push(nm);
            nv[nm]=res.table[i].Value;
        };
        process(items);
        if(callback!==undefined) callback(nv);
    }});
}

$vm.auto_input=function(params){
    var input_id=params.input_id;
    var minLength=params.minLength;
    var callback=params.callback;
    $('#'+input_id).autocomplete({
        minLength:minLength,
        source:function(request,response){
            $VmAPI.request({data:{cmd:'auto',s1:request.term,sql:params.sql,minLength:minLength},callback:function(res){
                var records=res.table;
                var items=[];
                for(var i=0;i<records.length;i++){
                    var obj={};
                    obj.label=records[i].Name;
                    obj.value=records[i].Value;
                    items.push(obj);
                }
                response(items);
            }});
        },
        select: function(event,ui) {
            if(callback!==undefined){
                callback(event,ui);
            }
        }
    })
    if(minLength===0) $('#'+input_id).focus(function(){$('#'+input_id).autocomplete("search","");});
}
