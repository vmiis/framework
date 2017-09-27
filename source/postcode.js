$vm.postcode_suburb=function(params){
    var query=params["query"];
    var process=params["process"];
}
$vm.auto_postcode_list=function(ret){
    var records=$.parseJSON(ret);
    var items=[];
    for(var i=0;i<records.length;i++){
        var obj={};
        obj.value=records[i];
        obj.suburb=records[i].split('/')[0];
        obj.state=records[i].split('/')[1];
        obj.postcode=records[i].split('/')[2];
        items.push(obj);
    }
    return items;
}
$vm.autocomplete_list=function(records){
    var items=[];
    for(var i=0;i<records.length;i++){
        var obj={};
        obj.label=records[i].name;
        /*
        obj.value=records[i].value;
        obj.value2=records[i].value2;
        obj.value3=records[i].value3;
        */
        for(key in records[i]){
            if(key!='name'){
                obj[key]=records[i][key];
            }
        }
        items.push(obj);
    }
    return items;
}
