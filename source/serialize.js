$vm.deserialize=function(record,form_id){
    if(record==undefined) return;
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
            case 'file':
                break;
            default:
                $el.val(value);
        }
    });
}
$vm.serialize=function(form_id){
    var data={};
    var a=$(form_id).serializeArray();
    $.each(a, function () { data[this.name]=this.value || '';});
    $(form_id+" input:checkbox:not(:checked)").each(function(){
		data[this.name]="off";
	})
}
