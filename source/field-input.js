$vm.render_input_field=function(record,mID,$input,html){
    if(record===undefined) record={};
    var field=$input.attr('data-id');
    record.vm_custom[field]=true;
    $input.html(html);
    $input.find('input').val(record[field])
    $input.find('input').on('input', function(){
        var value=$(this).val();
        if(value==="" && record[field]===undefined) return;
        if(value!==record[field]){
            record.vm_dirty=1;
            record[field]=value;
            $('#save'+mID).css('background','#E00');
        }
    });
}
