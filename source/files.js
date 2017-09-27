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
