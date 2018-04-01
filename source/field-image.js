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
