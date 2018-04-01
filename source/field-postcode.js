//-------------------------------------
$vm.postcode=function($input,callback){
    $input.autocomplete({
        minLength:1,
        source:function(request,response){
            $VmAPI.request({data:{cmd:'postcode',query:request.term,count:'10'},callback:function(res){
                response($.parseJSON(res.ret));
            }});
        },
        select: function(event,ui){
            var suburb=ui.item.label.split('/')[0];
            var state=ui.item.label.split('/')[1];
            var postcode=ui.item.label.split('/')[2];
            ui.item.value=postcode
            if(callback!=undefined){
                callback(suburb,state,postcode);
            }
        }
    })
}
//-------------------------------------
$vm.suburb=function($input,callback){
    $input.autocomplete({
        minLength:1,
        source:function(request,response){
            $VmAPI.request({data:{cmd:'suburb',query:request.term,count:'10'},callback:function(res){
                response($.parseJSON(res.ret));
            }});
        },
        select: function(event,ui){
            var suburb=ui.item.label.split('/')[0];
            var state=ui.item.label.split('/')[1];
            var postcode=ui.item.label.split('/')[2];
            ui.item.value=suburb
            if(callback!=undefined){
                callback(suburb,state,postcode);
            }
        }
    })
}
//-------------------------------------
