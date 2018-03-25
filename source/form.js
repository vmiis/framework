//--------------------------------------------------------
$vm.deserialize=function(record,form_id){
    $.each(record, function(name, value){
        var $el = $(form_id+' *[name='+name+']');
        var type = $el.attr('type');
        switch(type){
            case 'checkbox':
                if(value=='off' || value=='0' || value=='') $el.attr('checked', false);
                else $el.attr('checked', true);
                break;
            case 'radio':
                if($el.attr('value')==value) $el.prop('checked', true);
                break;
            default:
                $el.val(value);
        }
    });
}
//--------------------------------------------------------
