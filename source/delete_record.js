$vm.delete_record=function(options){
      var pid=options.pid;
      var rid=options.rid;
      var dbv=options.dbv;
      var callback=options.callback;
      var db_pid='0'; if(pid!=undefined && $vm.vm[pid]!==undefined && $vm.vm[pid].db_pid!==undefined) db_pid=$vm.vm[pid].db_pid;
      if(db_pid=='0'){
            //alert('No db pid');
            //return;
      }
      //-------------------------------
      var R=false;
      var req={cmd:"delete_record",rid:rid,db_pid:db_pid.toString(),dbv:dbv};
	  if($vm.third_party!=1){
		  $VmAPI.request({data:req,callback:function(res){
	            //-------------------------------
	            if(res.Error!==undefined) return false;
	            if(res.ret=='NULL'){
	                  if(res.msg!==undefined) alert(res.msg);
	                  else alert("No permission!");
	                  return false;
	            }
	            //-------------------------------
	            //R=true;
	            if(callback!==undefined){
	                callback(res,'delete');
	            }
	      }});
	  }
	  else if($vm.third_party==1){
		  $vm.post_message_from_child_to_parent({data:req,origin:'*',callback:function(res){
	            //-------------------------------
	            if(res.Error!==undefined) return false;
	            if(res.ret=='NULL'){
	                  if(res.msg!==undefined) alert(res.msg);
	                  else alert("No permission!");
	                  return false;
	            }
	            //-------------------------------
	            //R=true;
	            if(callback!==undefined){
	                callback(res,'delete');
	            }
	      }});
	  }
	  //-------------------------------
}
/*
$vm.delete_record_iframe=function(options){
      var pid=options.pid;
      var rid=options.rid;
      var dbv=options.dbv;
      var callback=options.callback;
      var db_pid='0'; if(pid!=undefined && $vm.vm[pid]!==undefined && $vm.vm[pid].db_pid!==undefined) db_pid=$vm.vm[pid].db_pid;
      if(db_pid=='0'){
            //alert('No db pid');
            //return;
      }
      //-------------------------------
      var R=false;
      var req={cmd:"delete_record_iframe",rid:rid,db_pid:db_pid.toString(),dbv:dbv};
      $VmAPI.request({data:req,callback:function(res){
            //-------------------------------
            if(res.Error!==undefined) return false;
            if(res.ret=='NULL'){
                  if(res.msg!==undefined) alert(res.msg);
                  else alert("No permission!");
                  return false;
            }
            //-------------------------------
            //R=true;
            if(callback!==undefined){
                callback(res,'delete');
            }
      }});
      //-------------------------------
}
*/
$vm.delete_record_s2=function(options){
      var pid=options.pid;
      var rid=options.rid;
      var dbv=options.dbv;
      var callback=options.callback;
      var db_pid='0'; if($vm.vm[pid]!==undefined && $vm.vm[pid].db_pid!==undefined) db_pid=$vm.vm[pid].db_pid;
      if(db_pid=='0'){
            alert('No db pid');
            return;
      }
      //-------------------------------
      var R=false;
      var req={cmd:"delete_record_s2",rid:rid,db_pid:db_pid.toString(),dbv:dbv};
      $VmAPI.request({data:req,callback:function(res){
            //-------------------------------
            if(res.Error!==undefined) return false;
            if(res.ret=='NULL'){
                  if(res.msg!==undefined) alert(res.msg);
                  else alert("No permission!");
                  return false;
            }
            //-------------------------------
            //R=true;
            if(callback!==undefined){
                callback(res,'delete');
            }
      }});
      //-------------------------------
}
$vm.lock_parent=function(options){
      var rid=options.rid;
      var req={cmd:"lock_parent",rid:rid};
      $VmAPI.request({data:req,callback:function(res){
            //-------------------------------
            if(res.Error!==undefined) return;
            if(res.ret=='NULL'){
                  if(res.msg!==undefined) alert(res.msg);
                  else alert("No permission!");
            }
            //-------------------------------
      }});
      //-------------------------------
}
$vm.unlock_parent=function(options){
      var rid=options.rid;
      //-------------------------------
      var req={cmd:"unlock_parent",rid:rid};
      $VmAPI.request({data:req,callback:function(res){
            //-------------------------------
            if(res.Error!==undefined) return;
            if(res.ret=='NULL'){
                  if(res.msg!==undefined) alert(res.msg);
                  else alert("No permission!");
            }
            //-------------------------------
      }});
      //-------------------------------
}
$vm.lock=function(options){
      var rid=options.rid;
      var req={cmd:"lock",rid:rid};
      $VmAPI.request({data:req,callback:function(res){
            //-------------------------------
            if(res.Error!==undefined) return;
            if(res.ret=='NULL'){
                  if(res.msg!==undefined) alert(res.msg);
                  else alert("No permission!");
            }
            //-------------------------------
      }});
      //-------------------------------
}
$vm.unlock=function(options){
      var rid=options.rid;
      //-------------------------------
      var req={cmd:"unlock",rid:rid};
      $VmAPI.request({data:req,callback:function(res){
            //-------------------------------
            if(res.Error!==undefined) return;
            if(res.ret=='NULL'){
                  if(res.msg!==undefined) alert(res.msg);
                  else alert("No permission!");
            }
            //-------------------------------
      }});
      //-------------------------------
}
