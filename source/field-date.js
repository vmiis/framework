$vm.render_date_field=function(record,mID,$input,html){
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
$vm.au_date_to_string_yyyymmdd=function(d){
    var items=d.split('/');
    if(items.length==3 && items[2].length==4){
      var nd=new Date(items[2],items[1]-1,items[0]);
      return nd.getFullYear()+"-"+$vm.pad(nd.getMonth()+1,2)+"-"+$vm.pad(nd.getDate(),2);
    }
    else return d;
}
$vm.date_to_string_yyyymmdd=function(nd){
    return nd.getFullYear()+"-"+$vm.pad(nd.getMonth()+1,2)+"-"+$vm.pad(nd.getDate(),2);
}
