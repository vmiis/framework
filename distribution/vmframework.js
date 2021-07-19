$vm.add_record=function(options){
      var pid=options.pid;
      var records=options.records;
      var I=options.I;
      var row_data=options.row_data;
      var dbv=options.dbv;
      var callback=options.callback;
      var db_pid=$vm.vm[pid].db_pid;
      if(db_pid===undefined){
            alert('No db pid');
            return;
      }
      db_pid=db_pid.toString();
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
      var req={cmd:"add_record",db_pid:db_pid.toString(),data:row_data,dbv:dbv};
      $VmAPI.request({data:req,callback:function(res){
            records[I].ID=res.ret;
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
$vm.add_record_v2=function(options){ //using uploading_v2
    var pid=options.pid;
    var records=options.records;
    var I=options.I;
    var row_data=options.row_data;
    var dbv=options.dbv;
    var callback=options.callback;
    var db_pid=undefined;
    if(pid!==undefined) db_pid=$vm.vm[pid].db_pid;
    else db_pid=options.db_pid;
    if(db_pid===undefined){
        alert('No db pid');
        return;
    }
    db_pid=db_pid.toString();
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
              //if having a file to be upladed, FIRST we add record with filename_field as "upload unsuccessful"
              row_data[filename_field]="upload unsuccessful";
        }
    });
    //-------------------------------
    var req={cmd:"add_record",db_pid:db_pid.toString(),data:row_data,dbv:dbv};
    $VmAPI.request({data:req,callback:function(res){
        records[I].ID=res.ret;
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
                   var recorver_name=function(){
                       var filename=$file_td.data('filename');
                       var filename_field=$file_td.data('filename_field');
                       var a_data={}; a_data[filename_field]=filename;
                       var a_dbv={};
                       var req={cmd:"modify_record",rid:rid,db_pid:db_pid,data:a_data,dbv:a_dbv};
                       $VmAPI.request({data:req,callback:function(res){
                           if(callback!==undefined){
                               callback(res,'add');
                           }
                       }});
                   }
                   //if having a file to be upladed,SECOND upload file
                   $vm.uploading_v2({file:file,ID:db_pid,rid:rid,filename:file.name,callback:function(){
                       if (file.name.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/)){
                          $vm.uploading_thumb_image({file:file,ID:db_pid,rid:rid,filename:file.name,callback:function(){
                              recorver_name();
                          }});
                       }
                       else{
                           recorver_name();
                       }

                        /*
                          //after upload successful, THIRD we will recorver the file name from "upload unsuccessful" to the orignal one
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
                          */
                    }});
                    $(this).closest('form')[0].reset();
              }
        });
        if(num===0 && callback!==undefined){ //no file upload
              callback(res,'add');
        }
        //----------------------
    }});
    //-------------------------------
}
$vm.grid_add_record=function(options){
    var pid=options.pid;
    var records=options.records;
    var I=options.I;
    var row_data=options.row_data;
    var dbv=options.dbv;
    var callback=options.callback;
    var $tr=options.tr;

    var db_pid=undefined;
    if(pid!==undefined) db_pid=$vm.vm[pid].db_pid;
    else db_pid=options.db_pid;

    if(db_pid===undefined){
        alert('No db pid');
        return;
    }
    db_pid=db_pid.toString();
    //-------------------------------
    //file upload special process
    $tr.find('input[type=file]').each(function(evt){
        var num=this.files.length;
        if(num===1){
              var $file_td=$(this).closest('td');
              var filename_field=$file_td.data('filename_field');
              var filename=row_data[filename_field];
              $file_td.data('filename',filename);
              //if having a file to be upladed, FIRST we add record with filename_field as "upload unsuccessful"
              row_data[filename_field]="upload unsuccessful";
        }
    });
    //-------------------------------
    var req={cmd:"add_record",db_pid:db_pid.toString(),data:row_data,dbv:dbv};
    if(options.json==1) req={cmd:"add_json_record",db_pid:db_pid.toString(),data:row_data,dbv:dbv};

	$VmAPI.request({data:req,callback:function(res){
        records[I].ID=res.ret;
        records[I].dirty="0";
        records[I].valid="1";
        //upload file
		var total_num=0;
		var td_callback=function(res){
			total_num--;
			if(total_num==0){
				callback(res,'add');
			}
		}
		$tr.find('input[type=file]').each(function(evt){
			var num=this.files.length;
			if(num===1){
				total_num++;
			}
			$vm.td_upload_file_for_add(this,td_callback,options);
		});
		/*
        $tr.find('input[type=file]').each(function(evt){
              var $file_td=$(this).closest('td');
              //--------------
              var recorver_name=function(){
                  var filename=$file_td.data('filename');
                  var filename_field=$file_td.data('filename_field');
                  var a_data={}; a_data[filename_field]=filename;
                  var a_dbv={};
                  var req={cmd:"modify_record",rid:rid,db_pid:db_pid,data:a_data,dbv:a_dbv};
                  $VmAPI.request({data:req,callback:function(res){
                      if(callback!==undefined){
                          callback(res,'add');
                      }
                  }});
              }
              //--------------
              var num=this.files.length;
              if(num===1){
				  total_num++;
                   var file = this.files[0];
                   var rid=records[I].ID;
                   //if having a file to be upladed,SECOND upload file
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
		*/
		if(total_num===0 && callback!==undefined){ //no file upload
            callback(res,'add');
        }
        //----------------------
    }});
	//-------------------------------
}
$vm.td_upload_file_for_add=function(input,td_callback,options){
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
			if(options.json==1) req={cmd:"modify_json_record",rid:rid,db_pid:db_pid.toString(),data:a_data,dbv:a_dbv};
			$VmAPI.request({data:req,callback:function(res){
				if(callback!==undefined){
					td_callback(res,'add');
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
$vm.grid_add_record_iframe=function(options){
    var pid=options.pid;
    var records=options.records;
    var I=options.I;
    var row_data=options.row_data;
    var dbv=options.dbv;
    var callback=options.callback;
    var $tr=options.tr;

    var db_pid=undefined;
    if(pid!==undefined) db_pid=$vm.vm[pid].db_pid;
    else db_pid=options.db_pid;

    if(db_pid===undefined){
        alert('No db pid');
        return;
    }
    db_pid=db_pid.toString();
    //-------------------------------
    //file upload special process
    $tr.find('input[type=file]').each(function(evt){
        var num=this.files.length;
        if(num===1){
              var $file_td=$(this).closest('td');
              var filename_field=$file_td.data('filename_field');
              var filename=row_data[filename_field];
              $file_td.data('filename',filename);
              //if having a file to be upladed, FIRST we add record with filename_field as "upload unsuccessful"
              row_data[filename_field]="upload unsuccessful";
        }
    });
    //-------------------------------
    var req={cmd:"add_record_iframe",db_pid:db_pid.toString(),data:row_data,dbv:dbv};
    if(options.json==1) req={cmd:"add_json_record_iframe",db_pid:db_pid.toString(),data:row_data,dbv:dbv};
    //$VmAPI.request({data:req,callback:function(res){
    $vm.post_message_from_child_to_parent(req,'*',function(res){
        records[I].ID=res.ret;
        records[I].dirty="0";
        records[I].valid="1";
        //upload file
        var num=0;
        $tr.find('input[type=file]').each(function(evt){
              var $file_td=$(this).closest('td');
              //--------------
              var recorver_name=function(){
                  var filename=$file_td.data('filename');
                  var filename_field=$file_td.data('filename_field');
                  var a_data={}; a_data[filename_field]=filename;
                  var a_dbv={};
                  var req={cmd:"modify_record_iframe",rid:rid,db_pid:db_pid,data:a_data,dbv:a_dbv};
                  //$VmAPI.request({data:req,callback:function(res){
                  $vm.post_massage(req,'*',function(res){
                      if(callback!==undefined){
                          callback(res,'add');
                      }
                  });
              }
              //--------------
              num=this.files.length;
              if(num===1){
                   var file = this.files[0];
                   var rid=records[I].ID;
                   //if having a file to be upladed,SECOND upload file
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
        if(num===0 && callback!==undefined){ //no file upload
              callback(res,'add');
        }
        //----------------------
    });
    //-------------------------------
}
*/
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
//--------------------------------------------------------
$vm.is_valid_url=function(userInput) {
    var res = userInput.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    if(res == null)   return false;
    else              return true;
}
//--------------------------------------------------------
$vm.css_process=function(css_txt1,allowed_css){
    var css_txt=css_txt1.replace(/\r/g,'').replace(/\n/g,'');
    var txt="";
    var a=css_txt.split('}');
    for(var i=0; i<a.length; i++){
        var b=a[i].split('{');
        if(b.length==2){
            txt+=b[0].trim()+'{\r\n';
            var c=b[1].split(';');
            for(var j=0;j<c.length;j++){
                    var d=c[j].split(':');
                    if(d.length==2){
                        if(allowed_css.includes(d[0].trim())==true){
                            txt+="    "+d[0].trim()+":"+d[1].trim()+";\r\n";
                        }
                    }
            }
            txt+='}\r\n';
        }
    }
    return txt;
}
//--------------------------------------------------------
$vm.content_filter=function(content,allowed_tags,allowed_attrs,allowed_css){
    //--------------------------------------------------------
    var $dom=$("<div></div>").html(content);
    var style_txt="";
    var tags=$dom.find("*");
    tags.each(function(){
        var tag=$(this).prop('tagName').toLowerCase();
        if(allowed_tags.includes(tag)==false){
            if(tag=='style'){
                style_txt+=$(this).text().toLowerCase()+"\r\n";
            }
            $dom.find( this ).remove();
        }
        else{
            var element=$(this);
            $.each(this.attributes, function(i, attrib){
                if(attrib!=undefined){
                    var name = attrib.name.toLowerCase();
                    if(allowed_attrs.includes(name)==false){
                        element.removeAttr(name);
                    }
                    else{
                        var value=attrib.value;
                        if(name=='src' || name=='href'){
                            if($vm.is_valid_url(value)==false) element.removeAttr(name);
                        }
                        else if(name=='style'){
                            var av=('@@@{'+attrib.value+'}');
                            attrib.value=$vm.css_process(av,allowed_css).replace('@@@{','').replace('}','').replace(/\r/g,'').replace(/\n/g,'');
                        }
                    }
                }
            });
        }
    })
    style_txt=$vm.css_process(style_txt,allowed_css);
    return $dom.html()+"\r\n<sty"+"le>"+style_txt+"</sty"+"le>";
}
//--------------------------------------------------------
$vm.date_add_days=function(d,n){
      var ms0 = d.getTime() + (86400000 * n);
      var ms1 = d.getTime() + (86400000 * n+3600000);

      var d0= new Date(ms0);
      var d1= new Date(ms1);

      var dms=(d1.getTimezoneOffset()-d.getTimezoneOffset())*60*1000;

      var added = new Date(ms0+dms);
      return added;
}
$vm.date_to_string_dmy=function(d){
      return $vm.pad(d.getDate(),2)+"/"+$vm.pad(d.getMonth()+1,2)+"/"+d.getFullYear();
}
$vm.pad=function(num, size) {
      var s = "000000000" + num;
      return s.substr(s.length-size);
}
$vm.date_parse=function(a) {
    try{
        var b=a.split('/');
        return new Date(b[2],b[1]-1,b[0]);
    }
    catch(e){
        return new Date(1800,0,1);
    }
}
$vm.date_weekfirst=function(d0){
      var d=new Date(d0);
      var day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
      return new Date(d.setDate(diff));
}
$vm.date_day_diff=function(a,b){
    var ms=(b.getTimezoneOffset()-a.getTimezoneOffset())*60*1000;
	return Math.floor( (b.getTime()-a.getTime()-ms)/1000/3600/24 );
}
$vm.first_day_of_current_month=function(){
	var date = new Date(), y = date.getFullYear(), m = date.getMonth();
	var firstDay = new Date(y, m, 1,0,0,0,0);
	return firstDay;
}
$vm.first_day_of_current_year=function(){
	var date = new Date(), y = date.getFullYear();
	var firstDay = new Date(y, 0, 1);
	return $vm.date_to_string_dmy(firstDay);
}
$vm.time12=function(time){
	//----------------------
	var timeB=time;
	var ts=time.split(':');
	var new_h=parseInt(ts[0])-12;
	if(new_h>=0){
		if(new_h==0) new_h=12;
		timeB=$vm.pad(new_h,2)+':'+ts[1]+'pm';
	}
	else{
		new_h=new_h+12;
		if(new_h==0) new_h=12;
		timeB=$vm.pad(new_h,2)+':'+ts[1]+'am';
	}
	//----------------------
    return timeB;
}
//----------------------------------------------------------------------------
$vm.date_today=function(){
  var d=new Date();
  return new Date(d.getFullYear(),d.getMonth(),d.getDate(),0,0,0,0);
}
//----------------------------------------------------------------------------
$vm.date_yyyymmdd_parse=function(a) {
    try{
        var b=a.split('-');
        return new Date(b[0],b[1]-1,b[2]);
    }
    catch(e){
        return new Date(1800,0,1);
    }
}
//----------------------------------------------------------------------------
$vm.au_date_to_string_yyyymmdd=function(d){
    if(d==undefined) return "";
    var items=d.split('/');
    if(items.length==3 && items[2].length==4){
      var nd=new Date(items[2],items[1]-1,items[0]);
      return nd.getFullYear()+"-"+$vm.pad(nd.getMonth()+1,2)+"-"+$vm.pad(nd.getDate(),2);
    }
    else return d;
}
//----------------------------------------------------------------------------
$vm.date_to_string_yyyymmdd=function(nd){
    return nd.getFullYear()+"-"+$vm.pad(nd.getMonth()+1,2)+"-"+$vm.pad(nd.getDate(),2);
}
//----------------------------------------------------------------------------
$vm.source=function(pid,event){
	if (event.altKey) {
		if($vm.vm[pid].url!==undefined){
			var url='__COMPONENT__/code_viewer/code.html'
			var module_url=$vm.vm[pid].url;
			if(module_url[0]=='/') module_url=$vm.hosting_path+module_url;
			else{
				if(module_url.substring(0,7)!='http://' && module_url.substring(0,8)!='https://'){
					module_url=$vm.hosting_path+"/"+module_url;
				}
			}
			$.get(module_url+'?'+new Date().getTime(), function(data){
				var nm=$vm.vm[pid].name;
				if($vm.module_list[nm]!==undefined){
                    if($vm.module_list[nm].html_filter!=undefined){
                        data=$vm.module_list[nm].html_filter(data);
                    }
					var msg;
					if(Array.isArray($vm.module_list[nm])===true){
						msg='module name: '+nm+', database table id: '+$vm.module_list[nm][0]+', path: '+$vm.module_list[nm][1];
					}
					else{
						msg='module name: '+nm+', database table id: '+$vm.module_list[nm]['table_id'];//+', path: '+$vm.url($vm.module_list[nm]['url']);
					}
					/*
					var param={
			            name:"code_viewer",
			            pid:$vm.id(url+"--------"),
			            slot:$vm.root_layout_content_slot,
			            url:$vm.url(url),
			            op:{name:msg,code:data}
			        }
			        $vm.load_module(param);
					*/
					if($vm.module_list["sys_code_viewer"]==undefined){
						$vm.module_list["sys_code_viewer"]={url:url}
					}
					$vm.load_module_v2("sys_code_viewer",'',{code:data,msg:msg,url:module_url});
				}
			})
		}
    }
	else if (event.ctrlKey) {
		/*
        var nm=$vm.vm[pid].name+"_";
        var list={}
        for(key in $vm.module_list){
          if(key.indexOf(nm)!==-1){
              list[key]=$vm.module_list[key];
          }
        }
		*/
		var txt2=JSON.stringify($vm.module_list,null,4);
		txt2=$('<div></div>').html(txt2).text();
		var url='__COMPONENT__/code_viewer/code.html'
		/*
		var param={
			name:"code_viewer",
			pid:$vm.id(url+"--------"),
			slot:$vm.root_layout_content_slot,
			url:$vm.url(url),
			op:{name:'System info',code:txt2}
		}
		$vm.load_module(param);
		*/
		if($vm.module_list["sys_code_viewer"]==undefined){
			$vm.module_list["sys_code_viewer"]={url:url}
		}
		$vm.load_module_v2("sys_code_viewer",'',{code:txt2,msg:"modules",url:""});
    }
	else if(event.shiftKey){
		var nm=$vm.vm[pid].name;
        var list={}
        list[nm]=$vm.module_list[nm];
        var txt2=JSON.stringify(list,null,4);
		txt2=$('<div></div>').html(txt2).text();
		var url='__COMPONENT__/code_viewer/code.html'
		var param={
			name:"code_viewer",
			pid:$vm.id(url+"--------"),
			slot:$vm.root_layout_content_slot,
			url:$vm.url(url),
			op:{name:'System info',code:txt2}
		}
		$vm.load_module(param);


        /*
        var msg;
		if(Array.isArray($vm.module_list[nm])===true){
		  msg='module name: '+nm+'\r\ndatabase table id: '+$vm.module_list[nm][0]+'\r\npath: '+$vm.module_list[nm][1]
		}
		else{
		  msg='module name: '+nm+'\r\ndatabase table id: '+$vm.module_list[nm]['table_id']+'\r\npath: '+$vm.module_list[nm]['url']
		}
		alert(msg)
        */
	}
}
//------------------------------------------------------------------
$vm.url_source=function(url){
	$.get(url+'?'+new Date().getTime(), function(data){
		var c_url='__COMPONENT__/code_viewer/code.html'
		var param={
			name:"code_viewer",
			pid:$vm.id(url+"--------"),
			slot:$vm.root_layout_content_slot,
			url:$vm.url(c_url),
			op:{name:url,code:data}
		}
		$vm.load_module(param);
    },'text');
}
$vm.view_code=function(code,name){
	if(name==undefined) name='Code'
	var c_url='__COMPONENT__/code_viewer/code.html'
	var param={
		name:"code_viewer",
		pid:$vm.id("--------"),
		slot:$vm.root_layout_content_slot,
        url:$vm.url(c_url),
		op:{name:name,code:code}
	}
    $vm.load_module(param);
}
//------------------------------------------------------------------
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
$vm.autocomplete=function($div,sql,callback){
    var field=$div.attr('data-id');
    $div.focus(function(){$div.autocomplete("search","");});
    return $div.autocomplete({
        minLength:0,
        source:function(request,response){
            $VmAPI.request({data:{cmd:'auto',s1:request.term,sql:sql,minLength:0},callback:function(res){
                response($vm.autocomplete_list(res.table));
            }});
        },
        select: function(event,ui){
            if(callback!=undefined){
                callback(field+'_uid',ui.item.value2);
                for(key in ui.item){
                    if(key.indexOf('field_')!==-1){
                        var k=key.replace('field_','')
                        var v=ui.item[key];
                        callback(k,v);
                    }
                }
            }
        }
    })
}
$vm.render_checkbox_field=function(record,mID,$div,html){
    var field=$div.attr('data-id');
    record.vm_custom[field]=true;
    $div.html(html);
    if(record[field]=="1" || record[field]=="True" || record[field]=="on" ) $div.find('input').prop('checked', true);
    $div.find('input').on('click', function(){
        var value='0';
        if($(this).prop("checked") == true)   value='1';

        if(value==="" && record[field]===undefined) return;
        if(value!==record[field]){
            record.vm_dirty=1;
            record[field]=value;
            $('#save'+mID).css('background','#E00');
        }
    });
}
$vm.render_color_field=function(record,mID,$div,html){
    if(record===undefined) record={};
    var field=$div.attr('data-id');
    record.vm_custom[field]=true;
    $div.html(html);
    $div.find('input').val(record[field])
    $div.find('input').on('input', function(){
        var value=$(this).val();
        if(value==="" && record[field]===undefined) return;
        if(value!==record[field]){
            record.vm_dirty=1;
            record[field]=value;
            $('#save'+mID).css('background','#E00');
        }
    });
}
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
$vm.render_file_field=function(record,mID,$div,callback){
    if(record===undefined) record={};
    var field=$div.attr('data-id');
    var filename=""; if(record!=undefined) filename=record[field]; if(filename==undefined) filename=""
    var html="<u style='cursor:pointer'>"+$vm.text(filename)+"</u>";
    html+="<span class=file_button"+mID+"> <a class=choose_file"+mID+" title='Choose a file'><i class='fa fa-file'></i></a></span>";
    html+="<input type=file name="+field+" style='display:none'></input>";
    $div.html(html);
    $div.find('u').on('click',function(){
        var rid=record.ID;
        if(rid!==undefined){
            filename=record[field]; if(filename==undefined) filename=""
            if(filename!="") $vm.open_link({rid:rid,filename:filename});
        }
        else alert("No file was found on server.")
    });
    $div.find('a.choose_file'+mID).on('click',function(){
        $div.find('input[type=file]').trigger('click');
    })
    $div.find('input[type=file]').on('change',function(evt){
        var size='';
        var lastModified='';
        if(this.files.length==1){
            $div.find('u').html(this.files[0].name);
            size=this.files[0].size;
            lastModified=$vm.date_to_string_yyyymmdd(new Date(this.files[0].lastModified));
        }
        else{ $div.find('u').html("");}
        if(record!=undefined) record.vm_dirty=1;
        $('#save'+mID).css('background','#E00');
        if(callback!=undefined) callback(size,lastModified);
    })
}
//-------------------------------------
$vm.upload_form_files=function(rid,$form,upload_files_callback){
    //--------------------------------------------------------
    var upload_a_file=function(rid,file,upload_a_file_callback){
        $vm.uploading_v2({file:file,rid:rid,filename:file.name,callback:function(){
            if (file.name.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/)){
               $vm.uploading_thumb_image({file:file,rid:rid,filename:file.name,callback:function(){
                   upload_a_file_callback();
               }});
            }
            else{
                upload_a_file_callback();
            }
        }});
    }
    //--------------------------------------------------------
    var total_num=0;
    $form.find('input[type=file]').each(function(evt){
        if(this.files.length===1){
            total_num++;
        }
    });
    if(total_num!=0){
        $form.find('input[type=file]').each(function(evt){
            if(this.files.length===1){
                upload_a_file(rid,this.files[0],function(){
                    total_num--;
                    if(total_num==0){
                        upload_files_callback();
                    }
                });
            }
        });
    }
    else upload_files_callback();
    //--------------------------------------------------------
}
//--------------------------------------------------------
$vm.set_file_name_as_upload_unsuccessful=function(data,$form){
    var N=0
    $form.find('input[type=file]').each(function(evt){
        if(this.files.length===1){
            var field=$(this).attr('name');
            data[field]="upload unsuccessful";
            N++;
        }
    });
    return N;
}
//--------------------------------------------------------
$vm.get_original_file_name=function($form){
    var data={}
    $form.find('input[type=file]').each(function(evt){
        if(this.files.length===1){
            var field=$(this).attr('name');
            data[field]=this.files[0].name;
        }
    });
    return data
}
//--------------------------------------------------------
$vm.render_image_field=function(record,mID,$div){
    //------------------------------------------
    var _set_image_url=function($obj,rid,filename,modified){
        if(rid===undefined) return;
        var ext=filename.split('.').pop();
        var thumb=filename+'_thumb.'+ext;
        var p='S'+rid;
        if($vm.vm[mID][p]!==undefined) $obj.attr('src',$vm.vm[mID][p]);
        else{
            var src_ID='S'+rid+new Date(modified).getTime()+'_'+$vm.version;
            var src_ID_day='D'+rid+new Date(modified).getTime()+'_'+$vm.version;
            var src=localStorage.getItem(src_ID);
            var src_Day=localStorage.getItem(src_ID_day);
            var D0=new Date(src_Day);
            var D1=new Date();
            var dif = D1.getTime() - D0.getTime();
            dif=dif/1000/3600/24;
            if(src!==null && dif<6){
                $obj.attr('src',src);
            }
            else{
                $vm.s3_link({rid:rid,filename:thumb,days:'7',modified:modified,callback:function(url){
                    $vm.vm[mID][p]=url;
                    $obj.attr('src',url);
                    localStorage.setItem(src_ID,url);
                    localStorage.setItem(src_ID_day,new Date().toString());
                }});
            }
        }
    };
    //-------------------------------------
    var _show_image=function(rid,filename,modified) {
        var p='L'+rid;
        if($vm.vm[mID][p]!==undefined){
            var url=$vm.vm[mID][p];
            window.open(url,'resizable=1');
        }
        else{
            jQuery.ajaxSetup({async:false});
            var src='';
            $vm.s3_link({rid:rid,filename:filename,days:'1',modified:modified,callback:function(url){
                $vm.vm[mID][p]=url;
                src=url;
            }});
            jQuery.ajaxSetup({async:true});
            window.open(src,'Image','resizable=1');
        }
    }
    //-------------------------------------
    if(record===undefined) record={};
    var field=$div.attr('data-id');
    var filename=""; if(record!=undefined) filename=record[field]; if(filename==undefined) filename=""
    var html="<span></span><img  width='80' style='display:inline-block;cursor:pointer;margin-bottom:0' />"
    html+="<span class=file_button"+mID+"> <a title='Choose a file' class=choose_file"+mID+"><i class='fa fa-file'></i></a></span>";
    html+="<input type=file name="+field+" style='display:none'></input>";
    $div.html(html);
    if(record!=undefined){
        $img=$div.find('img');
        if(record[field]!=='' && record[field]!==undefined){
            var rid=record.ID;
            var Modified=record.Modified;
            if(Modified===undefined) Modified=record.DateTime;
            _set_image_url($img,rid,record[field],Modified);
            $img.on('click',function(){
                _show_image(rid,record[field],Modified);
            })
        }
    }
    //-------------------------------------
    $div.find('a.choose_file'+mID).on('click',function(){
        $div.find('input[type=file]').trigger('click');
    })
    //-------------------------------------
    $div.find('input[type=file]').on('change',function(evt){
        $img=$div.find('img');
        $img.css('display','none');
        if(this.files.length==1)  $div.find('span:first').html(this.files[0].name);
        else $div.find('span:first').html('');
        record.vm_dirty=1;
        $('#save'+mID).css('background','#E00');
    })
    //-------------------------------------
}
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
//-------------------------------------
$vm.postcode=function($input,callback){
    $input.autocomplete({
        minLength:1,
        source:function(request,response){
            $VmAPI.request({data:{cmd:'postcode',query:request.term,count:'10'},callback:function(res){
                response($.parseJSON(res.ret));
            }});
        },
        select: function(event,ui){
            var suburb=ui.item.label.split('/')[0];
            var state=ui.item.label.split('/')[1];
            var postcode=ui.item.label.split('/')[2];
            ui.item.value=postcode
            if(callback!=undefined){
                callback(suburb,state,postcode);
            }
        }
    })
}
//-------------------------------------
$vm.suburb=function($input,callback){
    $input.autocomplete({
        minLength:1,
        source:function(request,response){
            $VmAPI.request({data:{cmd:'suburb',query:request.term,count:'10'},callback:function(res){
                response($.parseJSON(res.ret));
            }});
        },
        select: function(event,ui){
            var suburb=ui.item.label.split('/')[0];
            var state=ui.item.label.split('/')[1];
            var postcode=ui.item.label.split('/')[2];
            ui.item.value=suburb
            if(callback!=undefined){
                callback(suburb,state,postcode);
            }
        }
    })
}
//-------------------------------------
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
$vm.render_select_field=function(record,mID,$div,html){
    if(record===undefined) record={};
    var field=$div.attr('data-id');
    record.vm_custom[field]=true;
    $div.html(html)
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
$vm.file_reference_open_link=function(params){
    var td=params.td;
    var value=params.value;
    if(value===null || value===undefined || value===""){
        value="";
        td.innerHTML="";
    }
    if(value!==""){
        var html="";
        var items=value.split(',');
        for(var i=0;i<items.length;i++){
            if(html!=="") html+=", ";
            var file=items[i].split('-');
            var pid=file[0];
            var uid=file[1];
            var name="";
            for(var j=2;j<file.length;j++){
                if(name!=="") name+="-";
                name+=file[j];
            }
            var hhh=$.parseHTML(name);
            var text=$(hhh).text();
            html+="<u data-m="+items[i]+" style='cursor:pointer'>"+text+"</u>";
        }
        td.innerHTML=html;
        $(td).find('u').on('click',function(){
            var item=$(this).attr('data-m');
            var file=item.split('-');
            var pid=file[0];
            var uid=file[1];
            var name="";
            for(var j=2;j<file.length;j++){
                if(name!=="") name+="-";
                name+=file[j];
            }
            //$(this).vm8('open_link',undefined,pid,uid,name);
            $vm.open_link({pid:pid,uid:uid,filename:name});
        });
    }
}
//---------------------------------------------
$vm.open_link=function(params){
    var rid=params.rid;
    var pid=params.pid;
    var uid=params.uid;
    var filename=params.filename;
    var days=params.days;
    var modified=params.modified;
    var req={cmd:'s3_download_url',rid:rid,pid:pid,uid:uid,filename:filename};
    if(days!==undefined) req={cmd:'s3_download_url_days',rid:rid,pid:pid,uid:uid,filename:filename,days:days.toString(),modified:modified};
    $VmAPI.request({data:req,callback:function(res){
        var link = document.createElement("a");
        link.href = res.s3_download_url;
        link.style = "visibility:hidden";
        var fn=filename.split('-');
        link.download = filename.replace(fn[0]+'-','').replace(/ /g,'_');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }});
}
//---------------------------------------------
$vm.s3_link=function(params){
    var rid=params.rid;
    var pid=params.pid;
    var uid=params.uid;
    var filename=params.filename;
    var days=params.days;
    var modified=params.modified;
    var callback=params.callback;
    var req={cmd:'s3_download_url',rid:rid,pid:pid,uid:uid,filename:filename};
    if(days!==undefined) req={cmd:'s3_download_url_days',rid:rid,pid:pid,uid:uid,filename:filename,days:days.toString(),modified:modified};
    $VmAPI.request({data:req,callback:function(res){
        if(callback!==undefined) callback(res.s3_download_url);
    }});
}
//---------------------------------------------
$vm.set_file_input=function(params){
    var td=params.td;
    var filename_field=params.filename_field;
    var callback=params.callback;

    $(td).data('filename_field',filename_field);
    td.innerHTML="<form><button>Choose File</button><input type=file style='display:none'></input></form>";
    $(td).find('button').on('click',function(){
        $(td).find('form')[0].reset();
        $(td).find('input[type=file]').trigger('click');
        return false;
    });
    $(td).find('input[type=file]').on('change',function(evt){
        var file = this.files[0];
        callback(file);
    })
}
//---------------------------------------------
$vm.file_link=function(params){
    var td=params.td;
    var rid=params.rid;
    var value=params.value;

    if(value===undefined) value="";
    if(value===null) value="";
    var html="<u style='cursor:pointer'>"+value+"</u>";
    td.innerHTML=html;
    $(td).find('u').on('click',function(){
        var nm=$(this).html();
        if(rid!==null && rid!==undefined){
            $vm.open_link({rid:rid,filename:nm});
        }
    });
}
//---------------------------------------------
$vm.file_reference=function(params){
    var td=params.td;
    var PID=params.PID;
    var value=params.value;
    var file_name=params.file_name;

    if(value===undefined || file_name===undefined) value="";
    if(value===null || file_name===null) value="";
    if(value==="") td.innerHTML="";
    else td.innerHTML="<input value='"+PID+"-"+value+"-"+file_name+"' readonly style='border:0' />";
}
//---------------------------------------------
$vm.uploading=function(params){
    var file=params.file;
    var ID=params.TD;
    var rid=params.rid;
    var filename=params.filename;
    var callback=params.callback;

    if(file){
        var req_data={cmd:'s3_upload_url',rid:rid,filename:filename,contentType:file.type};
        $VmAPI.request({data:req_data,callback:function(res){
            $('#progress_dialog'+ID).dialog({ height: 'auto',width:'auto',	modal: true});
            $('#progress'+ID).text('Uploading...');
            $(".ui-dialog-titlebar").hide();
            $.ajax({
                xhr: function(){
                    var xhr = new window.XMLHttpRequest();
                    xhr.upload.addEventListener("progress", function(evt){
                        $('#progress'+ID).text(evt.loaded);
                    }, false);
                    return xhr;
                },
                url : res.s3_upload_url,
                type : "PUT",
                data : file,
                headers: {'Content-Type': file.type },
                cache : false,
                processData : false
            })
            .done(function() {
                $('#progress_dialog'+ID).dialog('close');
                if(callback!==undefined) callback();
            })
            .fail(function(e) {
                alert('Upload error');
            });
        }});
    }
}
//---------------------------------------------
$vm.uploading_v2=function(params){ //remove jquery dialog
    var file=params.file;
    var ID=params.TD;
    var rid=params.rid;
    var filename=params.filename;
    var callback=params.callback;
    if(file){
        var req_data={cmd:'s3_upload_url',rid:rid,filename:filename,contentType:file.type};
        $VmAPI.request({data:req_data,callback:function(res){
            $vm.open_dialog({name:'uploading_file_dialog_module'});
            //var mid=$vm.module_list['uploading_file_dialog_module'][0];
            //var url=$vm.module_list['uploading_file_dialog_module'][1];
            var mid;
            var url;
    		if(Array.isArray($vm.module_list['uploading_file_dialog_module'])===true){
    			mid=$vm.module_list['uploading_file_dialog_module'][0];
    	        url=$vm.module_list['uploading_file_dialog_module'][1];
    		}
    		else{
    			mid=$vm.module_list['uploading_file_dialog_module']['table_id'];
    	        url=$vm.module_list['uploading_file_dialog_module']['url'];
    		}

            var pid=$vm.id(url+mid);
            $('#progress'+pid).text('Uploading...');

            $.ajax({
                xhr: function(){
                    var xhr = new window.XMLHttpRequest();
                    xhr.upload.addEventListener("progress", function(evt){
                        $('#progress'+pid).text(evt.loaded);
                    }, false);
                    return xhr;
                },
                url : res.s3_upload_url,
                type : "PUT",
                data : file,
                headers: {'Content-Type': file.type },
                cache : false,
                processData : false
            })
            .done(function() {
                $vm.close_dialog({name:'uploading_file_dialog_module'});
                if(callback!==undefined) callback();
            })
            .fail(function(e) {
                alert('Upload error');
            });
        }});
    }
}
//---------------------------------------------
$vm.uploading_thumb_image=function(params){
    //--------------------
    var file=params.file;
    var ID=params.TD;
    var rid=params.rid;
    var filename=params.filename;
    var callback=params.callback;
    //--------------------
    var get_thumbnail=function(e){
        var myCan=document.createElement('canvas');
        var img = new Image();
        img.src = e.target.result;
        img.onload = function () {
            myCan.width = 80;;
            myCan.height = 80*img.height/img.width;
            if (myCan.getContext) {
                var cntxt = myCan.getContext("2d");
                cntxt.drawImage(img, 0, 0, myCan.width, myCan.height);
                var dataURL=myCan.toDataURL();
                var blobBin = atob(dataURL.split(',')[1]);
                var array = [];
                for(var i = 0; i < blobBin.length; i++) {
                    array.push(blobBin.charCodeAt(i));
                }
                var new_file=new Blob([new Uint8Array(array)], {type: 'image/'+file.type});
                var req_data={cmd:'s3_upload_thumb_url',rid:rid,filename:filename,contentType:file.type};
                $VmAPI.request({data:req_data,callback:function(res){
                    $vm.open_dialog({name:'uploading_file_dialog_module'});
                    //var mid=$vm.module_list['uploading_file_dialog_module'][0];
                    //var url=$vm.module_list['uploading_file_dialog_module'][1];
                    if(Array.isArray($vm.module_list['uploading_file_dialog_module'])===true){
            			mid=$vm.module_list['uploading_file_dialog_module'][0];
            	        url=$vm.module_list['uploading_file_dialog_module'][1];
            		}
            		else{
            			mid=$vm.module_list['uploading_file_dialog_module']['table_id'];
            	        url=$vm.module_list['uploading_file_dialog_module']['url'];
            		}
                    var pid=$vm.id(url+mid);
                    $('#progress'+pid).text('Uploading...');

                    $.ajax({
                        xhr: function(){
                            var xhr = new window.XMLHttpRequest();
                            xhr.upload.addEventListener("progress", function(evt){
                                $('#progress'+pid).text(evt.loaded);
                            }, false);
                            return xhr;
                        },
                        url : res.s3_upload_url,
                        type : "PUT",
                        data : new_file,
                        headers: {'Content-Type': file.type },
                        cache : false,
                        processData : false
                    })
                    .done(function() {
                        $vm.close_dialog({name:'uploading_file_dialog_module'});
                        if(callback!==undefined) callback();
                    })
                    .fail(function(e) {
                        alert('Upload error');
                    });
                }});
            }
        }
    }
    //--------------------
    if(file){
        var reader = new FileReader();
        reader.onload = get_thumbnail;
        reader.readAsDataURL(file);
    }
    //--------------------
}
//---------------------------------------------
$vm.download_csv=function(params){
    var name=params.name;
    var data=params.data;
    var fields=params.fields;

    if(data==='') return;
    var CSV='';
    var row="";
    var ids=fields.split(',');
    for(var j=0;j<ids.length;j++){
        if(j!==0) row+=",";
        if(ids[j].split('|')[0][0]!='_'){
            row+=ids[j].split('|')[0];
        }
    }
    row+="\r\n";
    CSV+=row;
    for(var i=0;i<data.length;i++){
        row="";
        for(j=0;j<ids.length;j++){
            if(j!==0) row+=",";
            if(ids[j].split('|')[0][0]!='_'){
                //var pro=ids[j].split('|').pop().trim().replace(/ /g,'_').replace('...','');
                var pro=ids[j].split('|').pop().trim().replace('...','');
                var v="";
                if(data[i][pro]!==undefined) v=data[i][pro];
                v=v.toString().replace(/"/g,''); //remove "
                row+='"'+v+'"';
            }
        }
        row+="\r\n";
        CSV+=row;
    }
    name=name.replace(/ /g,'_');
    //window.URL = window.webkitURL || window.URL;
    //-----------------------
    var bytes = [];
        bytes.push(239);
        bytes.push(187);
        bytes.push(191);
    for (var i = 0; i < CSV.length; i++) {
        if(CSV.charCodeAt(i)<128) {
            bytes.push(CSV.charCodeAt(i));
        }
        else if(CSV.charCodeAt(i)<2048) {
            bytes.push(( (CSV.charCodeAt(i) & 192) >> 6 ) + ((CSV.charCodeAt(i) & 1792)>>6 ) +192); //xC0>>6 + x700>>8 +xE0
            bytes.push(CSV.charCodeAt(i) & 63 + 128); //x3F + x80
        }
        else if(CSV.charCodeAt(i)<65536) {
            bytes.push(((CSV.charCodeAt(i) & 61440) >>12) + 224 ); //xF00>>12 + xE0
            bytes.push(( (CSV.charCodeAt(i) & 192) >> 6 ) + ((CSV.charCodeAt(i) & 3840)>>6 ) +128); //xC0>>6 + xF00>>8 +x80
            bytes.push(CSV.charCodeAt(i) & 63 + 128); //x3F + x80
        }
    }
    var u8 = new Uint8Array(bytes);
    var blob = new Blob([u8]);
    //-----------------------
    if (navigator.appVersion.toString().indexOf('.NET') > 0){
        window.navigator.msSaveBlob(blob, name);
    }
    else{
        var link = document.createElement("a");
        link.setAttribute("href", window.URL.createObjectURL(blob));
        link.setAttribute("download", name);
        link.style = "visibility:hidden";
        link.download = name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
//---------------------------------------------
$vm.set_dropdown_list_from_text=function($List,text){
    var txt=$("<div></div>").html(text).text();
    txt=txt.replace(/\r/g,'\n');
    txt=txt.replace(/\n\n/g,'\n');
    txt=txt.replace(/\n/g,',');
    txt=txt.replace(/,,/g,',');
    var lines=txt.split(',');
    $List.html('');
    for(var i=0;i<lines.length;i++){
        var line=lines[i];
        var items=line.split(';');
        var sel='';
        if(items[0].length>0 && items[0]=='*'){
            items[0]=items[0].replace('*','');
            sel='selected';
        }
        if(items.length==2)	$List.append(  $('<option '+sel+'></option>').val(items[1]).html(items[0])  );
        else			    $List.append(  $('<option '+sel+'></option>').val(items[0]).html(items[0])  );
    }
}
//---------------------------------------------
$vm.vm_password=function(length, special) {
    var iteration = 0;
    var password = "";
    var randomNumber;
    if(special == undefined){
        var special = false;
    }
    while(iteration < length){
        randomNumber = (Math.floor((Math.random() * 100)) % 94) + 33;
        if(!special){
            if ((randomNumber >=33) && (randomNumber <=47)) { continue; }
            if ((randomNumber >=58) && (randomNumber <=64)) { continue; }
            if ((randomNumber >=91) && (randomNumber <=96)) { continue; }
            if ((randomNumber >=123) && (randomNumber <=126)) { continue; }
        }
        iteration++;
        password += String.fromCharCode(randomNumber);
    }
    return password;
}
//---------------------------------------------
String.prototype.splitCSV = function(sep) {
  for (var foo = this.split(sep = sep || ","), x = foo.length - 1, tl; x >= 0; x--) {
    if (foo[x].replace(/"\s+$/, '"').charAt(foo[x].length - 1) == '"') {
      if ((tl = foo[x].replace(/^\s+"/, '"')).length > 1 && tl.charAt(0) == '"') {
        foo[x] = foo[x].replace(/^\s*"|"\s*$/g, '').replace(/""/g, '"');
      } else if (x) {
        foo.splice(x - 1, 2, [foo[x - 1], foo[x]].join(sep));
      } else foo = foo.shift().split(sep).concat(foo);
    } else foo[x].replace(/""/g, '"');
  } return foo;
}
//---------------------------------------------
$vm.check_and_clear_localstorage=function(){
    var data='';
    for(var key in window.localStorage){
        if(window.localStorage.hasOwnProperty(key)){
            data+=window.localStorage[key];
        }
    }
    if(data.length>3000000){
        localStorage.clear();
    }
}
//---------------------------------------------
$vm.today_ddmmyyyy=function(){
    today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!

    var yyyy = today.getFullYear();
    if(dd<10){
        dd='0'+dd
    }
    if(mm<10){
        mm='0'+mm
    }
    today = dd+'/'+mm+'/'+yyyy;
    return today;
}
//---------------------------------------------
$.fn.mobile_menumaker = function(options) {
    var nav__ID = $(this), settings = $.extend({format: "dropdown",sticky: false}, options);
    return this.each(function() {
	$(this).find(".button").on('click', function(){
	    $(this).toggleClass('menu-opened');
	    var mainmenu = $(this).next('ul');
	    if (mainmenu.hasClass('open')) {
		mainmenu.slideToggle().removeClass('open');
	    }
	    else {
		mainmenu.slideToggle().addClass('open');
		if (settings.format === "dropdown") {
		    mainmenu.find('ul').show();
		}
	    }
	});
	nav__ID.find('li ul').parent().addClass('has-sub');
	multiTg = function() {
	    nav__ID.find(".has-sub").prepend('<span class="submenu-button"></span>');
	    nav__ID.find('.submenu-button').on('click', function() {
		$(this).toggleClass('submenu-opened');
		if ($(this).siblings('ul').hasClass('open')) {
		    $(this).siblings('ul').removeClass('open').slideToggle();
		}
		else {
		    $(this).siblings('ul').addClass('open').slideToggle();
		}
	    });
	};
	if (settings.format === 'multitoggle') multiTg();
	else nav__ID.addClass('dropdown');
	if (settings.sticky === true) nav__ID.css('position', 'fixed');
	var resizeFix = function() {
	    var mediasize = 900;
	    if ($( window ).width() > mediasize) {
		nav__ID.find('ul').show();
	    }
	    if ($(window).width() <= mediasize) {
		nav__ID.find('ul').hide().removeClass('open');
	    }
	};
	resizeFix();
	return $(window).on('resize', resizeFix);
    });
};
//--------------------------------------------------------
$vm.find_object=function(theObject, key, val){
	var result = null;
	if(theObject instanceof Array) {
		for(var i = 0; i < theObject.length; i++) {
			result = $vm.find_object(theObject[i], key, val);
			if (result) {
				break;
			}
		}
	}
	else
	{
		for(var prop in theObject) {
			if(prop == key) {
				if(theObject[prop] == val) {
					return theObject;
				}
			}
			if(theObject[prop] instanceof Object || theObject[prop] instanceof Array) {
				result = $vm.find_object(theObject[prop], key, val);
				if (result) {
					break;
				}
			}
		}
	}
	return result;
}
//--------------------------------------------------------
$vm.text=function(txt){
	return $('<div></div>').html(txt).text();
}
//--------------------------------------------------------
$vm.status_of_data=function(data){
    var N1=0,N2=0;
    for(key in data){
        N2++;
        if(data[key]=='') N1++;
    }
    var status="#FFCC00";
    if(N1==N2) 		    status='#FF0000';
    else if(N1==0)  	status='#00FF00';
    return status;
}
//--------------------------------------------------------
//------------------------------------------------------------------
$vm.init_v3=function(options){
	var callback=options.callback;
	$vm.vm={};
	$vm.edge=0;
	if(navigator.appVersion.indexOf('Edge')!=-1) $vm.edge=1;
	$vm.user="guest";
	$VmAPI.request({data:{cmd:'user_name',ip:$vm.ip},callback:function(res){
		if(res.user!==undefined){
			$vm.user=res.user;
			$vm.user_id=res.user_id;
			$vm.user_ip=res.user_ip;
			$vm.user_puid=res.user_puid;
		}
		if(callback!==undefined) callback(res);

		//------------------------------------------------------------------
		$vm.ip='';
		/*
		try{
			window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
			var pc = new RTCPeerConnection({iceServers:[]}), noop = function(){};
			pc.createDataChannel("");
			pc.createOffer(pc.setLocalDescription.bind(pc), noop);
			pc.onicecandidate = function(ice){
			   if(!ice || !ice.candidate || !ice.candidate.candidate)  return;
			   $vm.ip=/([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(ice.candidate.candidate)[1];
			   pc.onicecandidate = noop;
			   $VmAPI.request({data:{cmd:'user_ip',ip:$vm.ip,name:$vm.user},callback:function(res){}})
			   //-----------------------------------------------------
			};
		}catch(e){
			$VmAPI.request({data:{cmd:'user_ip',ip:'0.0.0.0',name:$vm.user},callback:function(res){}})
		}
		//------------------------------------------------------------------
		*/
	}})
	//-----------------------------------------------------
};
//------------------------------------------------------------------
//------------------------------------------------------------------
$vm.init=function(options){
	if($vm.repository==undefined) $vm.repository="";
	$vm.set_category();
	var callback=options.callback;
	$vm.itemuid="";
	$vm.appid="";
	$vm.idapp="";
	$vm.ticks="";
	$vm.appuid="";
	$vm.uidapp="";
	$vm.user='';
	$vm.user_id='';
	$vm.user_ip='';
	$vm.guest=1;
	$vm.owner=1;
	$vm.current_module='';
	$vm.current_form='';
	$vm.current_grid='';
	$vm.current_main='';
	$vm.current_left='';
	$vm.comm=0;
	$vm.itemuid="";
	$vm.appid="";
	$vm.idapp="";
	$vm.ticks="";
	$vm.update_key='';
	$vm.submit_btn=""
	$vm.module_border="0";
	$vm.vm={};
	//$vm.root_layout_content_slot='vm_content_slot';

	$vm.edge=0;
	if(navigator.appVersion.indexOf('Edge')!=-1) $vm.edge=1;

	//$vm.path_app=location.href.substring(0, location.href.lastIndexOf("/")+1)
	//if($vm.api_url!="") $vm.path_app=$vm.api_url.replace("api.aspx","");

	g_itemuid="";
	g_appid="";
	g_idapp="";
	g_ticks="";
	g_appuid="";
	g_uidapp="";
	g_user='';
	g_guest=1;
	g_owner=1;
	g_current_module='';
	g_current_form='';
	g_current_grid='';
	g_current_main='';
	g_current_left='';
	g_comm=0;
	g_itemuid="";
	g_appid="";
	g_idapp="";
	g_ticks="";
	g_update_key='';
	g_submit_btn=""
	g_module_border="0";
	if(typeof(g_vm)==='undefined') g_vm={};
	//-----------------------------------------------------
	$('body').html("<div id=vm_body></div><div id=vm_park style='display:none'></div>");
	//g_vm.root_layout_content_slot='vm_content_slot';
	//-----------------------------------------------------
	//g_vm_path_app=location.href.substring(0, location.href.lastIndexOf("/")+1)
	//if(g_vm_api_url!="") g_vm_path_app=g_vm_api_url.replace("api.aspx","");
	//-----------------------------------------------------
  	$("html").bind("ajaxStart", function(){
     		$(this).addClass('busy');
   	}).bind("ajaxStop", function(){
     		$(this).removeClass('busy');
   	});
	//-----------------------------------------------------
	/*
	var req={cmd:"data2", action:"user_name"};
    	$(this).vm7('request',req, function(res){
        g_user=res.user_name;
        g_user_id=res.user_id;
        g_vm_ver=res.ver;

        g_user=res.user_name;
        g_user_id=res.user_id;
        g_vm_ver=res.ver;

        if(callback!==undefined) callback();
    	});
	*/
	g_user='guest';
	g_user_id='0';
	g_user_ip='';
	$vm.user="guest";
	$VmAPI.request({data:{cmd:'user_name'},callback:function(res){
		if(res.user!==undefined){
			$vm.user=res.user;
			$vm.user_id=res.user_id;
			$vm.user_ip=res.user_ip;
		}
		if(callback!==undefined) callback(res);
		//------------------------------------------------------------------
		$vm.ip='';
		/*
		try{
			window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
			var pc = new RTCPeerConnection({iceServers:[]}), noop = function(){};
			pc.createDataChannel("");
			pc.createOffer(pc.setLocalDescription.bind(pc), noop);
			pc.onicecandidate = function(ice){
			   if(!ice || !ice.candidate || !ice.candidate.candidate)  return;
			   $vm.ip=/([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(ice.candidate.candidate)[1];
			   pc.onicecandidate = noop;
			   $VmAPI.request({data:{cmd:'user_ip',ip:$vm.ip,name:$vm.user},callback:function(res){}})
			   //-----------------------------------------------------
			};
		}catch(e){
			$VmAPI.request({data:{cmd:'user_ip',ip:'0.0.0.0',name:$vm.user},callback:function(res){}})
		}
		//------------------------------------------------------------------
		*/
	}})
	//-----------------------------------------------------
};
//------------------------------------------------------------------
$vm.jquery_validator_init=function(options){
	//--------------------------------
	$.validator.addMethod(
		'regex',
		function(value, element, param) {
			var re = new RegExp(param[0]);
            return this.optional(element) || re.test(value);
    	},
    	$.validator.format('{1}')
    );
    $.validator.setDefaults({
	    ignore: ''
	    ,errorPlacement: function(error, element) {
    		if (element.attr('type') == 'radio') {
	    		element.parent().append('<br>');
	    		error.appendTo(element.parent());
            }
            else {
                error.insertAfter(element);
            }
    	}
	});
	//--------------------------------
}
//------------------------------------------------------------------
$vm._id=-1;
$vm.id=function(txt){
	$vm._id++;
	return "_"+$vm._id.toString();
	//return "_"+txt.replace(/=/g,'_').replace(/\&/g,'_').replace(/\?/g,'_').replace(/-/g,'_').replace(/\./g,'_').replace(/\//g,'_').replace(/:/g,'_').replace('__BASE__','');
}
//------------------------------------------------------------------
$vm.load_demo=function(){
	var name=window.location.search.split('n=').pop();
    if(name!==""){
		var mid;
        var url;
		if(Array.isArray($vm.module_list[name])===true){
			mid=$vm.module_list[name][0];
	        url=$vm.module_list[name][1];
		}
		else{
			mid=$vm.module_list[name]['table_id'];
	        url=$vm.module_list[name]['url'];
		}
        var param={
            name:name,
			pid:$vm.id(url+mid),
            slot:$vm.root_layout_content_slot,
            url:$vm.url(url),
			op:{}
        }
        $vm.load_module(param);
		$vm.demo_background();
    }
}
//------------------------------------------------------------------
$vm.set_category=function(){
	$vm.category="";
	$vm.subcategory="";
	var a=$vm.get_parameter('category'); if(a!=null) $vm.category=a;
	var a=$vm.get_parameter('subcategory'); if(a!=null) $vm.subcategory=a;
}
//------------------------------------------------------------------
$vm.get_parameter=function(name, url){
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
//--------------------------------------------------------
$vm.load_config_and_init=function(path,callback){
	var url=$vm.hosting_path+path;
	var ver=localStorage.getItem(url+"_ver");
	var txt=localStorage.getItem(url+"_txt");
	//------------------------------------------
	if(ver!=$vm.version || txt===null || $vm.debug===true || $vm.reload!=''){
		console.log('loading '+url+'?_='+$vm.version+$vm.reload);
		$.get(url+'?_='+$vm.version+$vm.reload,function(data){
			localStorage.setItem(url+"_txt",data);
			localStorage.setItem(url+"_ver",$vm.version);
			$vm._panel_init(data,callback);
		},'text').fail(function() {
			alert( "The configuration file ("+url+") doesn't exist!" );
		});
	}
	else{ $vm._panel_init(txt,callback); }
	//------------------------------------------
}
//--------------------------------------------------------
$vm._panel_init=function(txt,callback){
	var text=$('<div></div>').html(txt).text();
	//---------------------------
	var config;
	try{ config=JSON.parse(text);}
	catch (e){ alert("Error in app config file\n"+e); return; }
	//--------------------------------------------------------
	var group=config.group;
	if(group==undefined) group="";
	else group=group+"_";
	var modules=config.modules;
	for (var property in modules) {
		if($vm.module_list[group+property]==undefined) $vm.module_list[group+property]=modules[property];
	}
	if(callback!=undefined) callback(config);
}
//--------------------------------------------------------
//------------------------------------------------------------------
$vm.init2=function(options){
	if($vm.repository==undefined) $vm.repository="";
	$vm.set_category();
	var callback=options.callback;
	$vm.vm={};
	$vm.edge=0;
	if(navigator.appVersion.indexOf('Edge')!=-1) $vm.edge=1;
  	$("html").bind("ajaxStart", function(){
     		$(this).addClass('busy');
   	}).bind("ajaxStop", function(){
     		$(this).removeClass('busy');
   	});
	//-----------------------------------------------------
	$vm.user="guest";
	if(callback!==undefined) callback();
	//-----------------------------------------------------
};
//------------------------------------------------------------------
$vm.old_good_load_module=function(options){
	//------------------------------
	var callback=options.callback;
	var pid	=options.pid;
	var db_pid	=options.db_pid;
	var slot	=options.slot;
	var url=options.url;
	if(url===undefined) return;
	if($('#D'+pid).length===0){
		$vm.vm[pid]={};
	}
	$vm.vm[pid].parent_uid=undefined;
	$vm.vm[pid].parent_name="";
	$vm.vm[pid].excel_dialog="";
	for (var a in options){
		$vm.vm[pid][a]=options[a];
	};
	//------------------------------
	var load_main=function(){
		if($('#D'+pid).length==0){
			//------------------------------
			var ver=localStorage.getItem(url+"_ver");
			var txt=localStorage.getItem(url+"_txt");
			if(ver!==$vm.version || $vm.debug===true || txt==null){
				var new_url=url+'?v_='+$vm.version;
				if(url.indexOf('?')!==-1) new_url=url+'&v_='+$vm.version;
				//if($vm.debug_message===true) console.log('LOAD MODULE FROM '+url);
				//jQuery.ajaxSetup({async:false}); //SSTTAARRTT, find where EENNDD
				console.log('LOAD MODULE FROM '+new_url)
				$.get(new_url, function(data){
					localStorage.setItem(url+"_txt",data);
					localStorage.setItem(url+"_ver",$vm.version);
					process_include(data);
				});
			}
			else{
				process_include(txt);
			}
		}
		else{
			insert();
		}
	}
	//------------------------------
	var process_include=function(content){
		var search_include=function(txt){
			var lines=txt.split('\n');
			for(var i=0;i<lines.length;i++){
				if(lines[i].length>10){
					if(lines[i].indexOf('VmInclude:')!==-1){
						load_include(lines,i); //find include and process untill no more include found
						return;
					}
				}
			}
			var add_lines=function(lines){
				var all="";
				for(var j=0;j<lines.length;j++){
					all+=lines[j]+'\n';
				}
				return all;
			}
			//can not find any more, so we will stop, this is the last point
			var all=add_lines(lines); // this is the last full content
			//jQuery.ajaxSetup({async:true}); //EENNDD, find where SSTTAARRTT
			process_content(all);
			insert();
		}
		var load_include=function(lines,i){
			var add_lines=function(lines,I,txt){
				lines[I]=txt;
				var all="";
				for(var j=0;j<lines.length;j++){
					all+=lines[j]+'\n';
				}
				return all;
			}
			var name=lines[i].replace('VmInclude:','').trim();
			var items=name.split('|');
			var url=$vm.url(items[0]);
			var ver=localStorage.getItem(url+"_ver");
			var txt=localStorage.getItem(url+"_txt");
			if(ver!==$vm.version || $vm.debug===true || txt==null){
				var new_url=url+'?v_='+$vm.version;
				if(url.indexOf('?')!==-1) new_url=url+'&v_='+$vm.version;
				console.log('LOAD INCLUDE FROM '+new_url)
				//if(url.indexOf('field_select')!==-1) console.log("HHHHHH----"+new_url+"-------")
				$.get(new_url, function(data){
					//if(url.indexOf('field_select')!==-1) console.log("GGGGGG"+data)
					if(items.length>1){
						for(var kk=0;kk<(items.length-1)/2;kk++){
							var k1=2*kk+1;
							var k2=2*kk+2;
							if(k1<items.length && k2<items.length){
								var re=new RegExp(items[k1], 'g');
								data=data.replace(re,items[k2]);
							}
						}
					}
					localStorage.setItem(url+"_txt",data);
					localStorage.setItem(url+"_ver",$vm.version);
					var current_all=add_lines(lines,i,data)
					search_include(current_all);
				},'text');

			}
			else{
				var current_all=add_lines(lines,i,txt)
				search_include(current_all);
			}
		}
		search_include(content);
	}
	//------------------------------
	var process_content=function(txt){
		txt=$vm.url(txt);
		var content=txt.replace(/__ID__/g, pid);
		content=content.replace(/__ID/g, pid);
		//-----------------
		content=content.replace(/<!--([\s\S]*?)-->/mig, '');
		//-----------------
		content="<div id=D"+pid+" class=vm_module>"+content+"</div>"
		$("#D"+pid).remove();
		$("#vm_park").append($(content));
		//-----------------
		if (typeof window['F'+pid] == 'function') { eval('F'+pid+"()");	}
		//-----------------------------------------
		$('#D'+pid).on('dblclick',function(event){
			event.stopPropagation();
			$vm.source(''+pid,event);
		});
		//-------------------------------------
		if($vm.vm_module_border!==undefined){
            $('div.vm_module').css("border","1px solid red");
        }
		//-------------------------------------
	}
	//------------------------------
	var insert=function(){
		if(slot!="body") $vm.insert_module({pid:pid,slot:slot});
		//if(slot!==undefined && slot!=="")
		$('#D'+pid).triggerHandler('load');
		if(callback!==undefined) callback();
	}
	//------------------------------
	load_main();
	//------------------------------
};
$vm.insert_module=function(options){
    if($vm.page_stack==undefined){
        $vm.page_stack=[];
        $vm.page_stack_index=0;
    }
	var pid		=options.pid;
	var slot	=options.slot;
	if(pid===undefined) return;
	if(slot===undefined || slot=="") return;

    //new =================================
    var L=$vm.page_stack.length;
    if(L!=0){
        var top=$vm.page_stack[L-1];
        if(top!=undefined && top.slot==slot){
            $('#D'+top.ID).css('display','none');
            $('#D'+top.ID).triggerHandler('hide');
        }
    }
    //$vm.push_to_slot({div:pid,slot:slot});
	$('#D'+pid).css('display','block');
	$('#D'+pid).triggerHandler('show');
    $vm.page_stack_index++;
    $vm.page_stack.push({ID:pid,slot:slot,index:$vm.page_stack_index});
    window.history.pushState({ID:pid,slot:slot,index:$vm.page_stack_index}, null, null);
    console.log($vm.page_stack)
    //=====================================
    return;

    //old =====================================
	var current=$('#'+slot).data("current");
    //	if(current===pid) return; //the module is already in the slot
	if(current!==undefined) $vm.push_back_to_park({div:current});

	$vm.push_to_slot({div:pid,slot:slot});
	$('#'+slot).data("current",pid);
	$('#D'+pid).data('back_module',current);
	$('#D'+pid).data('back_slot',slot);

	//****
	var last_state=$('#'+slot).data('current_state');
	var new_state={ID:pid,slot:slot};

	window.history.pushState(new_state, null, null);
	$('#'+slot).data('current_state',new_state);

	if(last_state!=undefined){
		if(last_state.ID!=new_state.ID){
			var last_ID=last_state.ID;
			$('#D'+last_ID).css('display','none');
		}
	}

	var last_ID='';
	if(last_state!=undefined) last_ID=last_state.ID;

    console.log('insert:'+pid+'   last:'+last_ID+" --- current:"+pid)
	//****
    //=====================================
};
//------------------------------------
window.onpopstate=function(event) {
    //new ==========================================
    var W_index=event.state.index;
    var V_index=0;
    var L=$vm.page_stack.length;
    if(L>1){
        var previous=$vm.page_stack[L-2];
        V_index=previous.index;
    }
    if(W_index==V_index){
        //back
        var top=$vm.page_stack.pop();
        if(top!=undefined){
			$('#D'+top.ID).css('display','none');
			$('#D'+top.ID).triggerHandler('hide');
		}
        if($vm.page_stack.length==0){
            window.history.back(-1);
        }
        else{
            var L=$vm.page_stack.length;
            var top=$vm.page_stack[L-1];
            $('#D'+top.ID).css('display','block');
			$('#D'+top.ID).triggerHandler('show');
        }
    }
    else if(W_index>V_index){
        //forword
        var L=$vm.page_stack.length;
        var top=$vm.page_stack[L-1];
        $('#D'+top.ID).css('display','none');
		$('#D'+top.ID).triggerHandler('hide');
        $('#D'+event.state.ID).css('display','block');
		$('#D'+event.state.ID).triggerHandler('show');
        $vm.page_stack.push(event.state);
    }
    console.log($vm.page_stack);
    //new ==========================================
    return;

    //old ==========================================
    if(event.state==null){
		window.history.back(-1);
	}
	else{
		var slot=$vm.root_layout_content_slot;
		var current_ID=$('#'+slot).data("current_state").ID;
		var last_ID=event.state.ID;
		if(last_ID!=undefined){
			$('#D'+last_ID).css('display','block');
            $('#D'+last_ID).triggerHandler('show');
			if(current_ID!=last_ID){
				$('#D'+current_ID).css('display','none');
                $('#D'+last_ID).triggerHandler('hide');
			}
		}
		$('#'+slot).data("current_state",event.state);
        console.log('popstate'+event.state.ID+'   last:'+current_ID+" --- current:"+event.state.ID)
	}
    //old ==========================================
}
//------------------------------------
$vm.push_back_to_park=function(options){
	var div=options.div;
	if( $('#D'+div).length>0){
		var scroll=$('#vm_body').scrollTop();
		$('#D'+div).data('scroll',scroll);

		//$('#D'+div).appendTo('#vm_park');
		$('#D'+div).css('display','none');

		$('#D'+div).triggerHandler('hide');
	}
}
$vm.push_to_slot=function(options){
	var div	=options.div;
	var slot=options.slot;

	//$('#'+slot).html('');
   	//$('#D'+div).appendTo('#'+slot);
	$('#D'+div).css('display','block');

	$('#D'+div).triggerHandler('show');
	var scroll=$('#D'+div).data('scroll');
	if(scroll==undefined) scroll=0;
	$('#vm_body').scrollTop(scroll)
}
$vm.back=function(options){
	var div=options.div;
	var back_module=$('#D'+div).data('back_module');
	var back_slot=$('#D'+div).data('back_slot');
	$vm.push_back_to_park({div:div});
	$vm.push_to_slot({div:back_module,slot:back_slot});
	$('#'+back_slot).data("current",back_module);
	var form=options.form;
	var refresh_back=options.refresh_back;
	if(form!==undefined){
		if(refresh_back===undefined) $('#D'+back_module).triggerHandler('form_back'); //without save on form
		else if(refresh_back!==undefined) $('#D'+back_module).triggerHandler('refresh_back'); //with save on form
	}
	else $('#D'+back_module).triggerHandler('back');
}
$vm.back_and_refresh=function(options){
	var div=options.div;
	var back_module=$('#D'+div).data('back_module');
	var back_slot=$('#D'+div).data('back_slot');
	$vm.push_back_to_park({div:div});
	$vm.push_to_slot({div:back_module,slot:back_slot});
	$('#'+back_slot).data("current",back_module);
	$('#D'+back_module).triggerHandler('refresh_back');
}
$vm.load_first_module=function(options){
	var url=$vm.first_module;
	var src=$vm.first_module_src;
	if(options!==undefined){
		url=options.url;
		src=options.src;
	}
	var param={
		pid:$vm.id(url),
		slot:"vm_body",//$vm.root_layout_content_slot,
		url:$vm.url(url),
		source:src
	}
	$vm.load_module(param);
}
//--------------------------------------------------------
$vm.load_first_module_to_body=function(options){
	$vm.load_module({
		pid:$vm.id(),
		slot:"body",
		url:$vm.url(options.url),
		callback:options.callback
	});
}
//--------------------------------------------------------
$vm.open_dialog=function(options){
	var name=options.name;
	if($vm.module_list[name]===undefined) return;
	var mid;
	var url;
	if(Array.isArray($vm.module_list[name])===true){
		mid=$vm.module_list[name][0];
		url=$vm.module_list[name][1];
	}
	else{
		mid=$vm.module_list[name]['table_id'];
		url=$vm.module_list[name]['url'];
	}
	//var pid=$vm.id(url+mid);
	//$('#D'+pid).appendTo('body');


	var id=$vm.module_list[name].id;
	$('#D'+id).css('display','block')
}
//--------------------------------------------------------
$vm.close_dialog=function(options){
	var name=options.name;
	if($vm.module_list[name]===undefined) return;
	var mid;
	var url;
	if(Array.isArray($vm.module_list[name])===true){
		mid=$vm.module_list[name][0];
		url=$vm.module_list[name][1];
	}
	else{
		mid=$vm.module_list[name]['table_id'];
		url=$vm.module_list[name]['url'];
	}
	var pid=$vm.id(url+mid);
	//$('#D'+pid).appendTo('#vm_park');
	var id=$vm.module_list[name].id;
	$('#D'+id).css('display','none')
}
//--------------------------------------------------------
$vm.load_module_to_park=function(options){
	var name=optioms.name;
	var mid;
	var url;
	if(Array.isArray($vm.module_list[name])===true){
		mid=$vm.module_list[name][0];
		url=$vm.module_list[name][1];
	}
	else{
		mid=$vm.module_list[name]['table_id'];
		url=$vm.module_list[name]['url'];
	}
    var param={
        name:name,
        pid:$vm.id(url+mid),
        url:$vm.url(url),
     }
     $vm.load_module(param);
}
//-----------------------------------
$vm.get_module_id=function(options){
	return $vm.module_list[options.name].id;
	/*
	var name=options.name;
	var mid;
	var url;
	if(Array.isArray($vm.module_list[name])===true){
		mid=$vm.module_list[name][0];
		url=$vm.module_list[name][1];
	}
	else{
		mid=$vm.module_list[name]['table_id'];
		url=$vm.module_list[name]['url'];
	}
    return $vm.id(url+mid);
	*/
}
//-----------------------------------
$vm.get_module=function(options){
	/*
	var name=options.name;
	var mid;
	var url;
	if(Array.isArray($vm.module_list[name])===true){
		mid=$vm.module_list[name][0];
		url=$vm.module_list[name][1];
	}
	else{
		mid=$vm.module_list[name]['table_id'];
		url=$vm.module_list[name]['url'];
	}
    return $('#D'+$vm.id(url+mid));
	*/
	return $('#D'+$vm.module_list[options.name].id);
}
//-----------------------------------
$vm.load_module_by_name=function(name,slot,op,callback){
	//load module from module list by 'name' into a 'slot' with options 'op'
	if(name!==undefined){
		if($vm.module_list[name]===undefined){
			alert("The module '"+name+"' is not in the module list.");
			return;
		}
		var mid;
        var url;
		if(Array.isArray($vm.module_list[name])===true){
			mid=$vm.module_list[name][0];
	        url=$vm.module_list[name][1];
		}
		else{
			mid=$vm.module_list[name]['table_id'];
	        url=$vm.module_list[name]['url'];
		}
		var id=$vm.module_list[name].id;
		if(id==undefined) id=$vm.id();
		$vm.module_list[name].id=id;
		var param={
			name:name,
			pid:id,//$vm.id(url+mid),
			slot:slot,
			url:$vm.url(url),
			op:op,
			callback:callback
		 }
		 $vm.load_module(param);
		 var title0=document.title.split('|').pop();
		 var title=$vm.module_list[name].name_for_search;
		 if(title==undefined) title="";
		 if(title!="") title=title+" | "+title0;
		 else title=title0;
		 document.title=title;
	}
}
//-----------------------------------
$vm.alert=function(msg){
	$vm.open_dialog({name:'alert_dialog_module'});
	var mid=$vm.module_list['alert_dialog_module']['table_id'];
	var url=$vm.module_list['alert_dialog_module']['url'];
	var pid=$vm.id(url+mid);

	var name='alert_dialog_module';
	var id=$vm.module_list[name].id;
	$('#message'+id).text(msg);
}
//-----------------------------------
$vm.close_alert=function(){
	$vm.close_dialog({name:'alert_dialog_module'});
}
//-----------------------------------
$vm.table_id=function(__ID,param_name){
	var this_module=$vm.vm[__ID].name;
	var module_name=$vm.module_list[this_module][param_name];
	if(module_name===undefined){
		alert("The module doesn't contain the parameter name: "+param_name);
		return '';
	}
	var module=$vm.module_list[module_name];
	if(module===undefined){
		alert("Can not find "+module_name+" in the module list.");
		return '';
	}
	return module.table_id;
}
//-----------------------------------
$vm.attr=function(__ID,param_name){
	var this_module=$vm.vm[__ID].name;
	var value=$vm.module_list[this_module][param_name];
	if(value===undefined){
		alert("The module doesn't contain the attr name: "+param_name);
		return '';
	}
	return value;
}
//-----------------------------------
/*
$vm.load_module_v2=function(json,slot,op,callback){
	if(json==undefined){
		alert("The module is not in the module list.");
	}
	var url=json.url;
	var id=json.id;
	if(id!=undefined){
		$vm.show_module_v2(id,slot,op);
	}
	else{
		id=$vm.id();
		json.id=id;
	}
	var param={
		name:name,
		pid:id,
		slot:slot,
		url:$vm.url(url),
		op:op,
		callback:callback
	 }
	 $vm.load_module(param);
}
//-----------------------------------
$vm.show_module_v2=function(id,slot,op){
	if($vm.vm[id].op!=undefined && op!=undefined){
		for (var a in op){
			$vm.vm[id].op[a]=op[a];
		};
	}
	$vm.insert_module({pid:id,slot:slot});
	$('#D'+id).triggerHandler('load');
}
//-----------------------------------
*/
$vm.load_module_content=function(url,callback){ //used for iframe
	var ver=localStorage.getItem(url+"_ver");
	var txt=localStorage.getItem(url+"_txt");
	//------------------------------------------
	if(ver!=$vm.version || txt===null || $vm.debug===true || $vm.reload!=''){
		console.log('loading '+url+'?_='+$vm.version+$vm.reload);
		$.get(url+'?_='+$vm.version+$vm.reload,function(data){
			localStorage.setItem(url+"_txt",data);
			localStorage.setItem(url+"_ver",$vm.version);
			if(callback!=undefined) callback(data);
		},'text').fail(function() {
			alert( "The module content file ("+url+") doesn't exist!" );
		});
	}
	else{ if(callback!=undefined) callback(txt); }
	//------------------------------------------
}
$vm.process_first_include=function(txt,pid,slot,callback,url_0,m_name){
	var lines=txt.split('\n');
	for(var i=0;i<lines.length;i++){
		if(lines[i].length>10){
			if(lines[i].indexOf('VmInclude:')!==-1){
				$vm.load_include(lines,i,pid,slot,callback,url_0,m_name); //find the first include and process
				return;
			}
		}
	}
}
//-----------------------------------
$vm.load_include=function(lines,i,pid,slot,callback,url_0,m_name){
	var name=lines[i].replace('VmInclude:','').trim();
	var items=name.split('|');
	var url=$vm.url(items[0]);
	if(url[0]=='/') url=$vm.hosting_path+url;
	//url=url.replace('__CURRENT_PATH__',_g_current_path);
	url=url.replace('__CURRENT_PATH__',$vm.vm[pid].current_path);
	//------------------------------
	var ver=localStorage.getItem(url+"_ver");
	var txt=localStorage.getItem(url+"_txt");

	var http127_i=0;
	if(url.indexOf('http://127.0.0.1')!=-1 || url.indexOf('http://localhost')!=-1) http127_i=1;
	else if($vm.localhost==true && url.indexOf('http://')==-1 && url.indexOf('https://')==-1){ //like modules/home.html
        http127_i=1;
        if(url[0]=='/') url=$vm.hosting_path+url;
        else url=$vm.hosting_path+"/"+url;
    }
	if(ver!=$vm.version || http127_i==1 || txt==null || $vm.reload!=''){
		var new_url=url+'?_v='+($vm.version+$vm.reload).replace(/\./,'')+"&g="+_g_vm_chrom_loop++;
		if(url.indexOf('?')!==-1) new_url=url+'&_v='+($vm.version+$vm.reload).replace(/\./,'')+"&g="+_g_vm_chrom_loop++;
		console.log('loading from url. '+new_url)
		$.get(new_url, function(data){
			if(items.length>1){
				for(var kk=0;kk<(items.length-1)/2;kk++){
					var k1=2*kk+1;
					var k2=2*kk+2;
					if(k1<items.length && k2<items.length){
						var re=new RegExp(items[k1], 'g');
						data=data.replace(re,items[k2]);
					}
				}
			}
			localStorage.setItem(url+"_txt",data);
			localStorage.setItem(url+"_ver",$vm.version);
			var current_all=$vm.replace_and_recreate_content(lines,i,data)
			if(current_all.indexOf('VmInclude:')==-1){
				$vm.create_module_and_run_code(current_all,pid,url_0,slot,m_name);
				$vm.insert_and_trigger_load(pid,slot,callback);
			}
			else{
				$vm.process_first_include(current_all,pid,slot,callback,url_0,m_name);
			}
		},'text');

	}
	else{
		console.log('loading from stotage. '+url)
		var current_all=$vm.replace_and_recreate_content(lines,i,txt)
		if(current_all.indexOf('VmInclude:')==-1){
			$vm.create_module_and_run_code(current_all,pid,url_0,slot,m_name);
			$vm.insert_and_trigger_load(pid,slot,callback);
		}
		else{
			$vm.process_first_include(current_all,pid,slot,callback,url_0,m_name);
		}
	}
}
//-----------------------------------
$vm.replace_and_recreate_content=function(lines,I,replace){
	lines[I]=replace;
	var all="";
	for(var j=0;j<lines.length;j++){
		all+=lines[j]+'\n';
	}
	return all;
}
//-----------------------------------
$vm.create_module_and_run_code=function(txt,pid,url,slot,m_name){
	//txt=txt.replace(/__CURRENT_PATH__/g,_g_current_path);
	txt=txt.replace(/__CURRENT_PATH__/g,$vm.vm[pid].current_path);
	var content=txt;
	if(m_name!=undefined && $vm.module_list[m_name]!=undefined){
		if($vm.module_list[m_name].full_content!=='1'){
			var c_m=$(content).filter('#D__ID').html();
			if(c_m!=undefined && c_m!='') content=c_m;
		}
	}
	content=$vm.url(content);
    if(m_name!=undefined && $vm.module_list[m_name]!=undefined){
		if($vm.module_list[m_name].html_filter!=undefined){
        	content=$vm.module_list[m_name].html_filter(content);
		}
    }
	content=content.replace(/__ID/g, pid);
	content=content.replace(/<!--([\s\S]*?)-->/mig, '');
	//-----------------
	if(slot!='body'){
		content="<div id=D"+pid+" module='"+m_name+"' class=vm_module style='display:none'><!--"+url+"-->"+content+"</div>"
		$("#D"+pid).remove();
		if(slot=='' || slot==undefined) slot=$vm.root_layout_content_slot;
		$("#"+slot).append($(content));
	}
	else{
		$("body").append($(content));
	}
	//-----------------
	if (typeof window['F'+pid] == 'function') {
		try{
			eval('F'+pid+"()");
		}
		catch(err){
			var module=url;
			if(module===undefined) module=pid;
			alert(err+"\r\nThis error happend in the module\r\n"+module);
		}
	}
	//-----------------------------------------
	$('#D'+pid).on('dblclick',function(event){
		event.stopPropagation();
		$vm.source(''+pid,event);
	});
	//-------------------------------------
	if($vm.vm_module_border!==undefined){
		$('div.vm_module').css("border","1px solid red");
	}
	//-------------------------------------
}
//-----------------------------------
$vm.insert_and_trigger_load=function(pid,slot,callback){
	if(slot!="body"){
		$vm.insert_module({pid:pid,slot:slot});
		$('#D'+pid).triggerHandler('load');
	}
	if(callback!==undefined) callback();
	$('#vm_loader').hide();
}
//-----------------------------------
$vm.show_module=function(pid,slot,op){
	if($vm.vm[pid].op!=undefined && op!=undefined){
		for (var a in op){
			$vm.vm[pid].op[a]=op[a];
		};
	}
	$vm.insert_module({pid:pid,slot:slot});
	$('#D'+pid).triggerHandler('load');
}
//-----------------------------------
_g_current_path='';
$vm.load_module=function(options){
	_g_vm_chrom_loop=0;
	//------------------------------
	var m_name=options.name;
	var callback=options.callback;
	var pid	=options.pid;
	var db_pid	=options.db_pid;
	var slot	=options.slot;
	var url=options.url;
	if(url[0]=='/') url=$vm.hosting_path+url;
	var last_part=url.split('/').pop();
    _g_current_path=url.replace(last_part,'');
	if(url===undefined) return;
	if($('#D'+pid).length===0){
		$vm.vm[pid]={};
	}
	$vm.vm[pid].parent_uid=undefined;
	$vm.vm[pid].parent_name="";
	$vm.vm[pid].excel_dialog="";
	$vm.vm[pid].current_path=_g_current_path;
	for (var a in options){
		$vm.vm[pid][a]=options[a];
	};
    $vm.vm[pid].input=options.op;
	//------------------------------
	if($('#D'+pid).length==0){
        //------------------------------
        if(url.indexOf('http://')==-1 && url.indexOf('https://')==-1) url=$vm.hosting_path+"/"+url;
		//------------------------------
		var ver=localStorage.getItem(url+"_ver");
		var txt=localStorage.getItem(url+"_txt");
        var http127_i=0;
		if(url.indexOf('http://127.0.0.1')!=-1 || url.indexOf('http://localhost')!=-1) http127_i=1;
		else if($vm.localhost==true && url.indexOf('http://')==-1 && url.indexOf('https://')==-1){ //like modules/home.html
            http127_i=1;
            if(url[0]=='/') url=$vm.hosting_path+url;
            else url=$vm.hosting_path+"/"+url;
        }

		var reload=0;
		if(window.location.toString().indexOf('reload='+m_name)!=-1){
			reload=1;
		}
		if(ver!=$vm.version || http127_i==1 || txt==null || $vm.reload!='' || reload==1){
			var new_url=url+'?_v='+($vm.version+$vm.reload).replace(/\./,'');
			if(url.indexOf('?')!==-1) new_url=url+'&_v='+($vm.version+$vm.reload).replace(/\./,'');
			console.log('loading from url. '+new_url)
            if(window.location.hostname!='127.0.0.1' && window.location.hostname!='localhost')	$('#vm_loader').show();
			$.get(new_url, function(data){
				//-----------------------------------
				//for images belong to this module
				if(data.indexOf('__CURRENT_NAME__')!=-1){
					var nm=new_url.split('/').pop().split('?')[0];
					data=data.replace(/__CURRENT_NAME__/g,nm);
				}
				//-----------------------------------
				localStorage.setItem(url+"_txt",data);
				localStorage.setItem(url+"_ver",$vm.version);
				var current_all=data;
				if(current_all.indexOf('VmInclude:')==-1){
					$vm.create_module_and_run_code(current_all,pid,url,slot,m_name);
					$vm.insert_and_trigger_load(pid,slot,callback);
				}
				else{
					$vm.process_first_include(current_all,pid,slot,callback,url,m_name);
				}
			}).fail(function() {
			    alert( "The file '"+url+"' doesn't exist!" );
			});
		}
		else{
			console.log('loading from stotage. '+url)
			var current_all=txt;
			if(current_all.indexOf('VmInclude:')==-1){
				$vm.create_module_and_run_code(current_all,pid,url,slot,m_name);
				$vm.insert_and_trigger_load(pid,slot,callback);
			}
			else{
				$vm.process_first_include(current_all,pid,slot,callback,url,m_name);
			}
		}
	}
	else $vm.insert_and_trigger_load(pid,slot,callback);
};
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
$vm.modify_record_s2=function(options){
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
    if(db_pid===undefined){
        alert('No db pid');
        return;
    }
    /*
    var db_pid='0'; if($vm.vm[pid]!==undefined && $vm.vm[pid].db_pid!==undefined) db_pid=$vm.vm[pid].db_pid;
    if(db_pid=='0'){
        alert('No db pid');
        return;
    }
    */
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
    var req={cmd:"modify_record_s2",rid:rid,db_pid:db_pid.toString(),data:row_data,dbv:dbv};
	if(options.json==1) req={cmd:"modify_json_record_s2",rid:rid,db_pid:db_pid.toString(),data:row_data,dbv:dbv};
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
			$vm.td_upload_file_for_modify_s2(this,td_callback,options);
			/*
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
                    var req={cmd:"modify_record_s2",rid:rid,db_pid:db_pid,data:a_data,dbv:a_dbv};
                    $VmAPI.request({data:req,callback:function(res){
                        if(callback!==undefined){
                            callback(res,1);
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
$vm.td_upload_file_for_modify_s2=function(input,td_callback,options){
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
			var req={cmd:"modify_record_s2",rid:rid,db_pid:db_pid,data:a_data,dbv:a_dbv};
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
$vm.nav_click_process=function(name,slot){
	switch(name){
		case 'vm_signinout':
			if($vm.user=='guest'){
				window.open($VmAPI.api_base+"signin.html?url="+window.location.href,"Sign In","width=600, height=600");
			}
			else{
				$VmAPI.clear_token();
				$VmAPI.request({data:{cmd:'signout'},callback:function(c){
					$vm.user="guest";
					$vm.user_id="";
					location.reload(true);
				}});
			}
			break;
		default:
			if(name=='dev'){
				$vm.alert('Under development');
			}
			else $vm.nav_load_module(name,slot);
			break;
	}
}
//-----------------------------------------
$vm.nav_load_module=function(name,slot,config){
	//var input=config;
	if($vm.app_config.modules!=undefined && $vm.app_config.modules[name]!=undefined && $vm.app_config.modules[name].url!=undefined){
		if($vm.module_list[name]==undefined){
			$vm.module_list[name]=$vm.app_config.modules[name];
		}
	}
	if($vm.module_list[name]==undefined){
		alert(name+" is not in the module list.");
		return;
	}
	var url=$vm.module_list[name].url;
	if(url.split('.').pop().split('?')[0]=='json'){
		$vm.nav_load_panel(name)
		return;
	}
	if(url[0]=='/'){
		if($vm.hosting_path!=undefined) url=$vm.hosting_path+url;
	}
	var single_record=$vm.module_list[name].single_record;
	//if(check_trust(url)==0) return;
	var c=$vm.app_config;
	if(config!=undefined) c=config;
	else if($vm.module_list[name].config!=undefined) c=$vm.module_list[name].config;
	var op={
		//-----------------
		sys:{
			config:c,
			UID:name,
		},
		input:config,
		//-----------------
	}
	var slot_1=$vm.root_layout_content_slot;
	if(slot!=undefined && slot!="") slot_1=slot;
	if(single_record=='1' || slot=="hidden") slot_1=undefined;
	$vm.load_module_by_name(name,slot_1,op)
};
//---------------------------------------------
$vm.load_module_v2=function(name,slot,op){
    if(op==undefined) op={};
	var slot_1=$vm.root_layout_content_slot;
	if(slot!=undefined && slot!="") slot_1=slot;
	if(slot=="hidden") slot_1=undefined;
	$vm.load_module_by_name(name,slot_1,op)
};
//---------------------------------------------
$vm.nav_load_panel=function(name){
	var url=$vm.module_list[name].url;
	if(url[0]=='/'){
		if($vm.hosting_path!=undefined) url=$vm.hosting_path+url;
	}
	//if(check_trust(url)==0) return;
	console.log('loading '+url);
	$.get(url,function(text){
		var text=$('<div></div>').html(text).text();
		//---------------------------
		var config;
		try{ config=JSON.parse(text); }
		catch (e){ alert("Error in config file\n"+e); return; }
		//-----------------------------------------------
		var module=name+"_panel";
		if($vm.module_list[module]==undefined){
			$vm.module_list[module]={
				url:config.url,
				var:{},
			}
		}
		$vm.load_module_by_name(module,$vm.root_layout_content_slot,{
			sys:{
				config:config,
				UID:name,
			}
		})
		//-----------------------------------------------
	},'text').fail(function() {
		alert( "The file '"+url+"' doesn't exist!" );
	});
}
//---------------------------------------------
$vm.nav_wappsystem_signin=function(){
	if($vm.user=='guest'){
		window.open($VmAPI.api_base+"signin.html?url="+window.location.href,"Sign In","width=600, height=700");
	}
}
//---------------------------------------------
$vm.nav_signout=function(){
	if($vm.user_puid=="1"){
		var auth2 = gapi.auth2.getAuthInstance();
		auth2.signOut();
	}
	else if($vm.user_puid=="2"){
		FB.logout(function(response){});
	}
	$VmAPI.clear_token();
	$VmAPI.request({data:{cmd:'signout'},callback:function(c){
		location.reload(true);
	}});
}
//---------------------------------------------
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
$vm.read_record_auto=function(params){
    var query=params.query;
    var minLength=params.minLength;
    var process=params.process;
    var callback=params.callback;
    $VmAPI.request({data:{cmd:'auto',s1:query,sql:params.sql,minLength:minLength},callback:function(res){
        var items=[];  var nv={};
        for(var i=0;i<res.table.length;i++){
            var nm=res.table[i].Item.trim();
            items.push(nm);
            nv[nm]=res.table[i].Value;
        };
        process(items);
        if(callback!==undefined) callback(nv);
    }});
}

$vm.auto_input=function(params){
    var input_id=params.input_id;
    var minLength=params.minLength;
    var callback=params.callback;
    $('#'+input_id).autocomplete({
        minLength:minLength,
        source:function(request,response){
            $VmAPI.request({data:{cmd:'auto',s1:request.term,sql:params.sql,minLength:minLength},callback:function(res){
                var records=res.table;
                var items=[];
                for(var i=0;i<records.length;i++){
                    var obj={};
                    obj.label=records[i].Name;
                    obj.value=records[i].Value;
                    items.push(obj);
                }
                response(items);
            }});
        },
        select: function(event,ui) {
            if(callback!==undefined){
                callback(event,ui);
            }
        }
    })
    if(minLength===0) $('#'+input_id).focus(function(){$('#'+input_id).autocomplete("search","");});
}
//--------------------------------------------------------
$vm.deserialize=function(record,form_id){
    if(record==undefined) return;
    $.each(record, function(name, value){
        if(name!=''){
            var $els = $(form_id+' *[name='+name+']');
            $els.each(function(){
                var $el=$(this);
                var type = $el.attr('type');
                switch(type){
                    case 'checkbox':
                        if(value=='off' || value=='0' || value=='' ) $el.prop('checked', false);
                        else $el.prop('checked', true);
                        break;
                    case 'radio':
                        if($el.attr('value')==value){
                             $el.prop('checked', true);
                        }
                        break;
                    case 'file':
                        break;
                    case 'text':
                    case 'email':
                    case 'textarea':
                    case 'select':
                        $el.val(value);
                        break;
                    case 'undefined':
                        break;
                    default:
                        $el.val(value);
                        break;

                }
            });
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
    return data;
}
$vm.google_signin_setup=function(client_id,button_id,callback){
	$.getScript('https://apis.google.com/js/platform.js',function(){
		gapi.load('auth2', function(){
			auth2 = gapi.auth2.init({
				client_id: client_id,
				cookiepolicy: 'single_host_origin',
				//scope: 'additional_scope'
			});
			var element=document.getElementById(button_id);
			auth2.attachClickHandler(element, {}, function(googleUser) {
					$vm.user_google_token=googleUser.getAuthResponse().id_token;
					$VmAPI.request({data:{cmd:'signin_google',token:$vm.user_google_token},callback:function(res){
						$VmAPI.set_token(res.token,res.api_url,res.username,res.user_id,res.nickname);
						if(res.user!==undefined){
							$vm.user=res.user;
							$vm.user_id=res.user_id;
							$vm.user_ip=res.user_ip;
							$vm.user_puid=res.user_puid;
							callback(res);
						}
						else{
							alert('Signin error');
						}
					}})
				},
				function(error){}
			);
		});
	});
	//---------------------------------------------
}
$vm.facebook_signin_setup=function(appId,button_id,callback){
	window.fbAsyncInit = function() {
		FB.init({
		  appId      : appId,
		  cookie     : true,
		  xfbml      : true,
		  version    : 'v2.8'
		});
		FB.AppEvents.logPageView();
	};
	(function(d, s, id){
		 var js, fjs = d.getElementsByTagName(s)[0];
		 if (d.getElementById(id)) {return;}
		 js = d.createElement(s); js.id = id;
		 js.src = "https://connect.facebook.net/en_US/sdk.js";
		 fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));
	$('#'+button_id).on('click',function(){
		FB.login(function(response){
			if(response.status==='connected'){
				$vm.user_facebook_token=response.authResponse.accessToken;
				$VmAPI.request({data:{cmd:'signin_facebook',token:$vm.user_facebook_token},callback:function(res){
					$VmAPI.set_token(res.token,res.api_url,res.username,res.user_id,res.nickname);
					if(res.user!==undefined){
						$vm.user=res.user;
						$vm.user_id=res.user_id;
						$vm.user_ip=res.user_ip;
						$vm.user_puid=res.user_puid;
						callback(res);
					}
					else{
						alert('Signin error');
					}
				}})
			}
			else{
			}
		}, {scope: 'email'});
	})
	//---------------------------------------------
}
$vm.iframe_height=function(){
    var height=$('#content_slot').outerHeight(true);
    var req={cmd:'height',height:height};
    window.parent.postMessage(req,'*');
}
//--------------------------------------------------------
$vm.msg_id=0;
$vm.callback_array=[]
//--------------------------------------------------------
$vm.post_message_from_child_to_parent=function(obj){
	var req=obj.data;
	console.log(' ');
	console.log(req.cmd+' TO parent');
	console.log(req)
    req.ID=$vm.msg_id;
    $vm.callback_array.push({callback:obj.callback,ID:$vm.msg_id})
    window.opener.postMessage(req,obj.origin);
    $vm.msg_id++;
}
//--------------------------------------------------------
$vm.process_message_from_child=function(e){
	var req=e.data;
	if(req.cmd!=undefined){
		$VmAPI.request({data:req,callback:function(res){
			res.ID=req.ID;
			res.cmd=req.cmd;
			e.source.postMessage(res,e.origin);
		}})
    }
}
//--------------------------------------------------------
$vm.process_message_from_parent=function(e){
	var res=e.data;
	console.log(' ');
	console.log(res.cmd+' FROM parent');
	console.log(res)
    for(i=0;i<$vm.callback_array.length;i++){
        var obj=$vm.callback_array[i]
        if(obj.ID==res.ID){
            obj.callback(res);
            $vm.callback_array.splice(i,1);
            break;
        }
    }
}
//--------------------------------------------------------
/*
if(
	e.data.cmd=='query_records_iframe' ||
	e.data.cmd=='add_json_record_iframe' ||
	e.data.cmd=='modify_json_record_iframe' ||
	e.data.cmd=='delete_record_iframe'
){
	$VmAPI.request({data:e.data,callback:function(res){
		res.ID=e.data.ID;
		res.cmd=e.data.cmd;
		e.source.postMessage(res,e.origin);
	}})
}
else if(e.data.cmd=='test'){
	alert("TEST")
	e.source.postMessage(e.data,e.origin);
}
*/
/*
$vm.post_message=function(req,o,callback){
    req.ID=$vm.msg_id;
    $vm.callback_array.push({callback:callback,ID:$vm.msg_id})
    window.parent.postMessage(req,'*');
    $vm.msg_id++;
}
//--------------------------------------------------------
$vm.process_message=function(e){
    if(e.data=='load'){
        $('#content_slot div[class=vm_module]').each(function(){
            if($(this).css("display")=="block"){
                $(this).trigger('load');
                return false;
            }
        })
    }
    else{
        for(i=0;i<$vm.callback_array.length;i++){
            var obj=$vm.callback_array[i]
            if(obj.ID==e.data.ID){
                obj.callback(e.data);
                $vm.callback_array.splice(i,1);
                break;
            }
        }
    }
}
//--------------------------------------------------------
$vm.parent_process_message=function(e){
	if(e.data.cmd!=undefined){
        if(e.data.cmd=='back'){
            $('#content_slot div[class=vm_module]').each(function(){
                if($(this).css("display")=="block"){
                    var o=$(this).attr('id').replace('D','#back')
                    $(o).triggerHandler('click');
                    return false;
                }
            })
        }
        else if(
            e.data.cmd=='query_records_iframe' ||
            e.data.cmd=='add_json_record_iframe' ||
            e.data.cmd=='modify_json_record_iframe' ||
            e.data.cmd=='delete_record_iframe'
        ){
            $VmAPI.request({data:e.data,callback:function(res){
                //alert(JSON.stringify(res));
                $('#content_slot div[class=vm_module]').each(function(){
                    if($(this).css("display")=="block"){
                        var o=$(this).find('iframe');
                        res.ID=e.data.ID;
                        res.cmd=e.data.cmd;
                        o[0].contentWindow.postMessage(res,'*');
                        return false;
                    }
                })
            }})
        }
        else if(e.data.cmd=='height'){
            $('#content_slot div[class=vm_module]').each(function(){
                if($(this).css("display")=="block"){
                    var o=$(this).find('iframe');
                    var h=e.data.height;
                    if(h<$vm.min_height-3) h=$vm.min_height-3;
                    o.css('min-height',h+'px');
                    return false;
                }
            })
        }
    }
}
*/
//--------------------------------------------------------
