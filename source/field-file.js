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
