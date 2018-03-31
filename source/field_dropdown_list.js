$vm.render_dropdown_list_field=function(mID,$div,record,list){
    var field=$div.attr('data-id');
    record.vm_custom[field]=true;
    $div.html(list)
    $div.find('select').val(record[field])
    $div.find('select').on('change', function(){
        var value=$(this).val();
        if(value==="" && record[field]===undefined) return;
        if(value!==record[field]){
            record.vm_dirty=1;
            record[field]=value;
            $('#save'+mID).css('background','#E00');
        }
    });
}
