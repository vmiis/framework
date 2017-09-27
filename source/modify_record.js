$vm.modify_record=function(options){
      var pid=options.pid;
      var records=options.records;
      var I=options.I;
      var row_data=options.row_data;
      var dbv=options.dbv;
      var callback=options.callback;
      var rid=records[I].ID;
      var db_pid='0'; if($vm.vm[pid]!==undefined && $vm.vm[pid].db_pid!==undefined) db_pid=$vm.vm[pid].db_pid;
      if(db_pid=='0'){
            alert('No db pid');
            return;
      }
      //-------------------------------
      //file upload special process
      var hot=$('#excel'+pid).handsontable('getInstance');
      var td=hot.getCell(I, 0);
      var $tr=$(td).closest('tr');
      $tr.find('input[type=file]').each(function(evt){
            var num=this.files.length;
            if(num===1){
                  var $file_td=$(this).closest('td');
                  var filename_field=$file_td.data('filename_field');
                  var filename=row_data[filename_field];
                  $file_td.data('filename',filename);
                  row_data[filename_field]="upload unsuccessful";
            }
      });
      //-------------------------------
      var req={cmd:"modify_record",rid:rid,db_pid:db_pid.toString(),data:row_data,dbv:dbv};
      $VmAPI.request({data:req,callback:function(res){
            records[I].dirty="0";
            records[I].valid="1";
            //upload file
            var num=0;
            $tr.find('input[type=file]').each(function(evt){
                  var $file_td=$(this).closest('td');
                  num=this.files.length;
                  if(num===1){
                       var file = this.files[0];
                       var rid=records[I].ID;
                       $vm.uploading({file:file,ID:db_pid,rid:rid,filename:file.name,callback:function(){
                              //after upload successful, we will recorver the file name from "upload unsuccessful" to the orignal one
                              var filename=$file_td.data('filename');
                              var filename_field=$file_td.data('filename_field');
                              var a_data={}; a_data[filename_field]=filename;
                              var a_dbv={};
                              var req={cmd:"modify_record",rid:rid,db_pid:db_pid,data:a_data,dbv:a_dbv};
                              $VmAPI.request({data:req,callback:function(res){
                                  if(callback!==undefined){
                                        callback(res,1);
                                  }
                              }});

                        }});
                        $(this).closest('form')[0].reset();
                  }
            });
            if(num===0 && callback!==undefined){
                  callback(res,1);
            }
            //----------------------
      }});
      //-------------------------------
}
$vm.modify_record_v2=function(options){ //using uploading_v2
    var pid=options.pid;
    var records=options.records;
    var I=options.I;
    var row_data=options.row_data;
    var dbv=options.dbv;
    var callback=options.callback;
    var rid=records[I].ID;

    //var db_pid='0'; if($vm.vm[pid]!==undefined && $vm.vm[pid].db_pid!==undefined) db_pid=$vm.vm[pid].db_pid;

    var db_pid=undefined;
    if(pid!==undefined) db_pid=$vm.vm[pid].db_pid;
    else db_pid=options.db_pid;

    if(db_pid==undefined){
        alert('No db pid');
        return;
    }
    //-------------------------------
    //file upload special process
    var hot=$('#excel'+pid).handsontable('getInstance');
    var td=hot.getCell(I, 0);
    var $tr=$(td).closest('tr');
    $tr.find('input[type=file]').each(function(evt){
        var num=this.files.length;
        if(num===1){
              var $file_td=$(this).closest('td');
              var filename_field=$file_td.data('filename_field');
              var filename=row_data[filename_field];
              $file_td.data('filename',filename);
              row_data[filename_field]="upload unsuccessful";
        }
    });
    //-------------------------------
    var req={cmd:"modify_record",rid:rid,db_pid:db_pid.toString(),data:row_data,dbv:dbv};
    $VmAPI.request({data:req,callback:function(res){
        records[I].dirty="0";
        records[I].valid="1";
        //upload file
        var num=0;
        $tr.find('input[type=file]').each(function(evt){
            var $file_td=$(this).closest('td');
            num=this.files.length;
            if(num===1){
                //after upload successful, we will recorver the file name from "upload unsuccessful" to the orignal one
                var file = this.files[0];
                var rid=records[I].ID;
                var recorver_name=function(){
                    var filename=$file_td.data('filename');
                    var filename_field=$file_td.data('filename_field');
                    var a_data={}; a_data[filename_field]=filename;
                    var a_dbv={};
                    var req={cmd:"modify_record",rid:rid,db_pid:db_pid,data:a_data,dbv:a_dbv};
                    $VmAPI.request({data:req,callback:function(res){
                        if(callback!==undefined){
                            callback(res,'modify');
                        }
                    }});
                }
                $vm.uploading_v2({file:file,ID:db_pid,rid:rid,filename:file.name,callback:function(){
                    if (file.name.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/)){
                       $vm.uploading_thumb_image({file:file,ID:db_pid,rid:rid,filename:file.name,callback:function(){
                           recorver_name();
                       }});
                    }
                    else{
                        recorver_name();
                    }
                }});
                $(this).closest('form')[0].reset();
            }
        });
        if(num===0 && callback!==undefined){
              callback(res,'modify');
        }
        //----------------------
    }});
    //-------------------------------
}
$vm.grid_modify_record=function(options){
    var pid=options.pid;
    var records=options.records;
    var I=options.I;
    var row_data=options.row_data;
    var dbv=options.dbv;
    var callback=options.callback;
    var $tr=options.tr;
    var rid=records[I].ID;

    //var db_pid='0'; if($vm.vm[pid]!==undefined && $vm.vm[pid].db_pid!==undefined) db_pid=$vm.vm[pid].db_pid;

    var db_pid=undefined;
    if(pid!==undefined) db_pid=$vm.vm[pid].db_pid;
    else db_pid=options.db_pid;
    if(db_pid==undefined){
        alert('No db pid');
        return;
    }
    //-------------------------------
    //file upload special process
    //var $tr=$('#grid'+pid+' tr:nth-child('+(I+2)+')');
    $tr.find('input[type=file]').each(function(evt){
        var num=this.files.length;
        if(num===1){
              var $file_td=$(this).closest('td');
              var filename_field=$file_td.data('filename_field');
              var filename=row_data[filename_field];
              $file_td.data('filename',filename);
              row_data[filename_field]="upload unsuccessful";
        }
    });
    //-------------------------------
    var req={cmd:"modify_record",rid:rid,db_pid:db_pid.toString(),data:row_data,dbv:dbv};
    if(options.json==1) req={cmd:"modify_json_record",rid:rid,db_pid:db_pid.toString(),data:row_data,dbv:dbv};
	$VmAPI.request({data:req,callback:function(res){
        records[I].dirty="0";
        records[I].valid="1";
        //upload file
        var total_num=0;
		var td_callback=function(res){
			total_num--;
			if(total_num==0){
				callback(res,'modify');
			}
		}
        $tr.find('input[type=file]').each(function(evt){
			var num=this.files.length;
			if(num===1){
				total_num++;
			}
			$vm.td_upload_file_for_modify(this,td_callback,options);
			/*
            var $file_td=$(this).closest('td');
            var num=this.files.length;
            if(num===1){
				total_num++;
                //after upload successful, we will recorver the file name from "upload unsuccessful" to the orignal one
                var file = this.files[0];
                var rid=records[I].ID;
                var recorver_name=function(){
                    var filename=$file_td.data('filename');
                    var filename_field=$file_td.data('filename_field');
                    var a_data={}; a_data[filename_field]=filename;
                    var a_dbv={};
                    var req={cmd:"modify_record",rid:rid,db_pid:db_pid,data:a_data,dbv:a_dbv};
                    $VmAPI.request({data:req,callback:function(res){
                        if(callback!==undefined){
                            callback(res,'modify');
                        }
                    }});
                }
                $vm.uploading_v2({file:file,ID:db_pid,rid:rid,filename:file.name,callback:function(){
                    if (file.name.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/)){
                       $vm.uploading_thumb_image({file:file,ID:db_pid,rid:rid,filename:file.name,callback:function(){
                           recorver_name();
                       }});
                    }
                    else{
                        recorver_name();
                    }
                }});
                $(this).closest('form')[0].reset();
            }
			*/
        });
        if(total_num===0 && callback!==undefined){
              callback(res,'modify');
        }
        //----------------------
    }});
    //-------------------------------
}
//-------------------------------------------
$vm.td_upload_file_for_modify=function(input,td_callback,options){
	var pid=options.pid;
    var records=options.records;
    var I=options.I;
    var row_data=options.row_data;
    var dbv=options.dbv;
    var callback=options.callback;
    var $tr=options.tr;
    var rid=records[I].ID;
    var db_pid=undefined;
    if(pid!==undefined) db_pid=$vm.vm[pid].db_pid;
    else db_pid=options.db_pid;

	var $file_td=$(input).closest('td');
	var num=input.files.length;
	if(num===1){
		//total_num++;
		//after upload successful, we will recorver the file name from "upload unsuccessful" to the orignal one
		var file = input.files[0];
		var rid=records[I].ID;
		var recorver_name=function(){
			var filename=$file_td.data('filename');
			var filename_field=$file_td.data('filename_field');
			var a_data={}; a_data[filename_field]=filename;
			var a_dbv={};
			var req={cmd:"modify_record",rid:rid,db_pid:db_pid,data:a_data,dbv:a_dbv};
			$VmAPI.request({data:req,callback:function(res){
				if(callback!==undefined){
					td_callback(res,'modify');
				}
			}});
		}
		$vm.uploading_v2({file:file,ID:db_pid,rid:rid,filename:file.name,callback:function(){
			if (file.name.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/)){
			   $vm.uploading_thumb_image({file:file,ID:db_pid,rid:rid,filename:file.name,callback:function(){
				   recorver_name();
			   }});
			}
			else{
				recorver_name();
			}
		}});
		$(input).closest('form')[0].reset();
	}
}
//-------------------------------------------
/*
$vm.grid_modify_record_iframe=function(options){
    var pid=options.pid;
    var records=options.records;
    var I=options.I;
    var row_data=options.row_data;
    var dbv=options.dbv;
    var callback=options.callback;
    var $tr=options.tr;
    var rid=records[I].ID;

    //var db_pid='0'; if($vm.vm[pid]!==undefined && $vm.vm[pid].db_pid!==undefined) db_pid=$vm.vm[pid].db_pid;

    var db_pid=undefined;
    if(pid!==undefined) db_pid=$vm.vm[pid].db_pid;
    else db_pid=options.db_pid;
    if(db_pid==undefined){
        alert('No db pid');
        return;
    }
    //-------------------------------
    //file upload special process
    //var $tr=$('#grid'+pid+' tr:nth-child('+(I+2)+')');
    $tr.find('input[type=file]').each(function(evt){
        var num=this.files.length;
        if(num===1){
              var $file_td=$(this).closest('td');
              var filename_field=$file_td.data('filename_field');
              var filename=row_data[filename_field];
              $file_td.data('filename',filename);
              row_data[filename_field]="upload unsuccessful";
        }
    });
    //-------------------------------
    var req={cmd:"modify_record_iframe",rid:rid,db_pid:db_pid.toString(),data:row_data,dbv:dbv};
    if(options.json==1) req={cmd:"modify_json_record_iframe",rid:rid,db_pid:db_pid.toString(),data:row_data,dbv:dbv};
    //$VmAPI.request({data:req,callback:function(res){
    $vm.post_message_from_child_to_parent(req,'*',function(res){
        records[I].dirty="0";
        records[I].valid="1";
        //upload file
        var num=0;
        $tr.find('input[type=file]').each(function(evt){
            var $file_td=$(this).closest('td');
            num=this.files.length;
            if(num===1){
                //after upload successful, we will recorver the file name from "upload unsuccessful" to the orignal one
                var file = this.files[0];
                var rid=records[I].ID;
                var recorver_name=function(){
                    var filename=$file_td.data('filename');
                    var filename_field=$file_td.data('filename_field');
                    var a_data={}; a_data[filename_field]=filename;
                    var a_dbv={};
                    var req={cmd:"modify_record",rid:rid,db_pid:db_pid,data:a_data,dbv:a_dbv};
                    $VmAPI.request({data:req,callback:function(res){
                        if(callback!==undefined){
                            callback(res,'modify');
                        }
                    }});
                }
                $vm.uploading_v2({file:file,ID:db_pid,rid:rid,filename:file.name,callback:function(){
                    if (file.name.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/)){
                       $vm.uploading_thumb_image({file:file,ID:db_pid,rid:rid,filename:file.name,callback:function(){
                           recorver_name();
                       }});
                    }
                    else{
                        recorver_name();
                    }
                }});
                $(this).closest('form')[0].reset();
            }
        });
        if(num===0 && callback!==undefined){
              callback(res,'modify');
        }
        //----------------------
    });
    //-------------------------------
}
*/
