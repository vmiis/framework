$vm.add_record_s2                =function(options){
	if(options.json==1) $vm.add_record_special('add_json_record_s2',options);
	else $vm.add_record_special('add_record_s2',options);
}
$vm.add_record_without_permission=function(options){    $vm.add_record_special('add_record_without_permission',options);  }
$vm.add_record_special=function(cmd,options){
    // not allowed to upload file for all special add !!!
    var pid=options.pid;
    var records=options.records;
    var I=options.I;
    var row_data=options.row_data;
    var dbv=options.dbv;
    var callback=options.callback;
    var $tr=options.tr;

    //var db_pid=$vm.vm[pid].db_pid;
    var db_pid=undefined;
    if(pid!==undefined) db_pid=$vm.vm[pid].db_pid;
    else db_pid=options.db_pid;
    if(db_pid===undefined){
        alert('No db pid');
        return;
    }
    db_pid=db_pid.toString();
    //-------------------------------
    var req={cmd:cmd,db_pid:db_pid.toString(),data:row_data,dbv:dbv};
    $VmAPI.request({data:req,callback:function(res){
        records[I].ID=res.ret;
        records[I].dirty="0";
        records[I].valid="1";
        /*
        if(callback!==undefined){
            callback(res,1);
        }
        */
        //----------------------
        //upload file with no file name recover
        var num=0;
        $tr.find('input[type=file]').each(function(evt){
            var $file_td=$(this).closest('td');
            //--------------
            num=this.files.length;
            if(num===1){
                var file = this.files[0];
                var rid=records[I].ID;
                //if having a file to be upladed,SECOND upload file
                $vm.uploading_v2({file:file,ID:db_pid,rid:rid,filename:file.name,callback:function(){
                   if (file.name.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/)){
                      $vm.uploading_thumb_image({file:file,ID:db_pid,rid:rid,filename:file.name,callback:function(){
                          if(callback!==undefined){
                              callback(res,1);
                          }
                      }});
                   }
                }});
                $(this).closest('form')[0].reset();
            }
        });
        if(num===0 && callback!==undefined){ //no file upload
            callback(res,1);
        }
        //----------------------
    }});
    //-------------------------------
}
