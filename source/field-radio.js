$vm.render_radio_field=function(record,mID,$div,html){
    if(record===undefined) record={};
    var field=$div.attr('data-id');
    record.vm_custom[field]=true;
    $div.html(html)
    $div.find('input[value="'+record[field]+'"]').prop('checked', true);
    $div.find('input').on('click', function(){
        var value=$(this).val();
        if(value==="" && record[field]===undefined) return;
        if(value!==record[field]){
            record.vm_dirty=1;
            record[field]=value;
            $('#save'+mID).css('background','#E00');
        }
    });
}
